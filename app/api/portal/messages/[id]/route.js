import { NextResponse } from 'next/server';
import { getPortalSession } from '@/lib/portal/session';

export const dynamic = 'force-dynamic';

// Mark a message seen/unseen for the signed-in portal user. The Lambda re-checks the role and
// only accepts a status change; the browser never sees the Cognito token.
export async function PATCH(request, { params }) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  let body;
  try { body = await request.json(); } catch { body = null; }
  const status = body?.status;
  if (status !== 'read' && status !== 'unread') {
    return NextResponse.json({ error: 'status must be "read" or "unread"' }, { status: 400 });
  }
  if (!process.env.API_GATEWAY_URL) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  try {
    const res = await fetch(`${process.env.API_GATEWAY_URL}/messages/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
      body: JSON.stringify({ status }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return NextResponse.json({ error: 'Could not update the message' }, { status: res.status });
    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Could not reach the server' }, { status: 502 });
  }
}
