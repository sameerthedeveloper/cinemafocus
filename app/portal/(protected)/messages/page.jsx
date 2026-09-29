import { getPortalSession } from '@/lib/portal/session';
import { getMessages } from '@/lib/portal/data';
import { PageHeader, EmptyState } from '@/components/panel/ui';
import MessagesView from '@/components/panel/MessagesView';

export const metadata = { title: 'Messages' };
export const dynamic = 'force-dynamic';

export default async function PortalMessages() {
  const session = await getPortalSession();
  let messages = null;
  try { messages = await getMessages(session.token); } catch {}

  return (
    <div className="p-4 md:p-8 max-w-[1100px] mx-auto pb-20 md:pb-10">
      <PageHeader title="Messages" description="Enquiries sent through the website's contact forms." />
      {messages === null
        ? <EmptyState title="Messages couldn't be loaded" hint="Refresh to try again. If this keeps happening, ask your administrator to check your access." />
        : <MessagesView messages={messages} />}
    </div>
  );
}
