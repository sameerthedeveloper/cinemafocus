import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "@/lib/aws/cognito";

const API_BASE = process.env.API_GATEWAY_URL;

async function forward(request, path, method) {
  const headers = { "Content-Type": "application/json", "X-Robots-Tag": "noindex" };

  if (!API_BASE) {
    return NextResponse.json({ error: "AWS API is not configured" }, { status: 503, headers });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  const url = new URL(request.url);
  const target = `${API_BASE}/${path.join("/")}${url.search}`;

  const upstreamHeaders = { "Content-Type": "application/json" };
  if (token) upstreamHeaders.Authorization = `Bearer ${token}`;

  const hasBody = method !== "GET" && method !== "DELETE";
  const body = hasBody ? await request.text() : undefined;

  const res = await fetch(target, { method, headers: upstreamHeaders, body });
  const text = await res.text();

  // Anonymous GETs are public catalogue data: let the edge cache them briefly so
  // page views don't each hit Lambda (small account concurrency limit).
  if (method === "GET" && !token && res.ok) {
    headers["Cache-Control"] = "public, s-maxage=60, stale-while-revalidate=300";
  } else {
    headers["Cache-Control"] = "no-store";
  }

  return new NextResponse(text, { status: res.status, headers });
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
