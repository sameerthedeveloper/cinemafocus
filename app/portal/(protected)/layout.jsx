import { redirect } from 'next/navigation';
import PortalFrame from '@/components/panel/PortalFrame';
import { getPortalSession } from '@/lib/portal/session';

// Always per-request: content depends on the signed-in user's session.
export const dynamic = 'force-dynamic';

// Only the (fast, local) session check blocks here, so the sidebar and top bar paint
// immediately; page content streams in behind loading.jsx and the unread badge loads on its own.
export default async function PortalLayout({ children }) {
  const session = await getPortalSession();
  if (!session) redirect('/portal/login');
  return <PortalFrame email={session.email}>{children}</PortalFrame>;
}
