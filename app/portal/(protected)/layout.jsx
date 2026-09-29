import { redirect } from 'next/navigation';
import PortalFrame from '@/components/panel/PortalFrame';
import { getPortalSession } from '@/lib/portal/session';
import { getMessages } from '@/lib/portal/data';
import { isUnread } from '@/lib/portal/stats';

// Always per-request: content depends on the signed-in user's session.
export const dynamic = 'force-dynamic';

export default async function PortalLayout({ children }) {
  const session = await getPortalSession();
  if (!session) redirect('/portal/login');

  // Sidebar badge; never let a slow or failing lookup block the page.
  let unread = 0;
  try {
    unread = (await getMessages(session.token)).filter(isUnread).length;
  } catch {}

  return <PortalFrame email={session.email} unread={unread}>{children}</PortalFrame>;
}
