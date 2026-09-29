import { NextResponse } from 'next/server';
import { getPortalSession } from '@/lib/portal/session';
import { getMessages } from '@/lib/portal/data';
import { isUnread } from '@/lib/portal/stats';

export const dynamic = 'force-dynamic';

// Unread-message count for the portal sidebar badge (loaded after the page shell renders).
export async function GET() {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const messages = await getMessages(session.token);
    return NextResponse.json({ unread: messages.filter(isUnread).length }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ unread: 0 }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
