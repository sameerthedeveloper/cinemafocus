import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "@/lib/aws/cognito";

const API_BASE = process.env.API_GATEWAY_URL;

async function forward(request, path, method) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  const url = new URL(request.url);
  const target = `${API_BASE}/${path.join("/")}${url.search}`;

  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const hasBody = method !== "GET" && method !== "DELETE";
  const body = hasBody ? await request.text() : undefined;

  const res = await fetch(target, { method, headers, body });
  const text = await res.text();

  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
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
