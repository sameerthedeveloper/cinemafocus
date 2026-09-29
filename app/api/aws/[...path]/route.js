import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "@/lib/aws/cognito";

const API_BASE = process.env.API_GATEWAY_URL;

async function forward(request, path, method) {
  const headers = { "Content-Type": "application/json", "X-Robots-Tag": "noindex", "Cache-Control": "no-store" };

  if (!API_BASE) {
    return NextResponse.json({ error: "AWS API is not configured" }, { status: 503, headers });
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

    const url = new URL(request.url);
    const target = `${API_BASE}/${path.join("/")}${url.search}`;

    const upstreamHeaders = { "Content-Type": "application/json" };
    if (token) upstreamHeaders.Authorization = `Bearer ${token}`;

    const hasBody = method !== "GET" && method !== "DELETE";
    const body = hasBody ? await request.text() : undefined;

    const res = await fetch(target, { method, headers: upstreamHeaders, body, signal: AbortSignal.timeout(20000) });
    const text = await res.text();

    // Authenticated admin traffic: never cached (public reads use /api/aws-public).
    // Normalise API Gateway's own errors ({"message":"Not Found"}) to the {error} shape the UI reads.
    let out = text;
    if (!res.ok) {
      try {
        const parsed = JSON.parse(text);
        if (parsed && !parsed.error && parsed.message) out = JSON.stringify({ error: parsed.message });
      } catch {
        out = JSON.stringify({ error: text || res.statusText || `Upstream error (${res.status})` });
      }
    }
    return new NextResponse(out, { status: res.status, headers });
  } catch (e) {
    console.error(`[api/aws] ${method} /${path.join("/")} failed:`, e);
    return NextResponse.json({ error: `Couldn't reach the AWS API (${e?.name || "error"}). Please try again.` }, { status: 502, headers });
  }
}

export async function GET(request, { params }) {
  const { path } = await params;
  return forward(request, path, "GET");
}

export async function POST(request, { params }) {
  const { path } = await params;
  return forward(request, path, "POST");
}

export async function PUT(request, { params }) {
  const { path } = await params;
  return forward(request, path, "PUT");
}

export async function DELETE(request, { params }) {
  const { path } = await params;
  return forward(request, path, "DELETE");
}
