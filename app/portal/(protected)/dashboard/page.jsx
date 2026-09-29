import Link from 'next/link';
import { Eye, Users, MessageSquare, Inbox, Package, Tag, Image as ImageIcon, Newspaper, Sparkles } from 'lucide-react';
import { getPortalSession } from '@/lib/portal/session';
import { getProducts, getCategories, getProjects, getPress, getLaunches, getMessages, getTrafficSeries } from '@/lib/portal/data';
import { weekOverWeek, enquiryStats, isUnread, sum } from '@/lib/portal/stats';
import { StatCard, Delta, Card, Badge, PageHeader, EmptyState } from '@/components/panel/ui';
import LineChart from '@/components/admin/LineChart';

export const metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

const RANGES = [14, 30];
const settle = async (p) => { try { return { ok: true, value: await p }; } catch { return { ok: false, value: null }; } };
const fmt = (n) => new Intl.NumberFormat('en-IN').format(n);

export default async function PortalDashboard({ searchParams }) {
  const session = await getPortalSession();
  const sp = await searchParams;
  const range = RANGES.includes(Number(sp?.range)) ? Number(sp.range) : 14;

  const [products, categories, projects, press, launches, messages, traffic] = await Promise.all([
    settle(getProducts()), settle(getCategories()), settle(getProjects()), settle(getPress()), settle(getLaunches()),
    settle(getMessages(session.token)), settle(getTrafficSeries(session.token, range)),
  ]);

  const series = traffic.value?.series || [];
  const views = series.length ? weekOverWeek(series, 'value') : null;
  const visitors = series.length ? weekOverWeek(series, 'visitors') : null;
  const enquiries = messages.ok ? enquiryStats(messages.value, 30) : null;
  const unread = messages.ok ? messages.value.filter(isUnread).length : null;
  const totalViews = sum(series, 'value');
  const noTraffic = series.length > 0 && totalViews === 0;

  const activeProducts = products.ok ? products.value.filter((p) => p.is_active !== false).length : null;
  const content = [
    { label: 'Products', icon: Package, href: '/portal/products', n: products.ok ? products.value.length : null, sub: activeProducts !== null ? `${activeProducts} active` : '' },
    { label: 'Brands', icon: Tag, href: '/portal/brands', n: categories.ok ? categories.value.length : null },
    { label: 'Gallery projects', icon: ImageIcon, href: '/portal/gallery', n: projects.ok ? projects.value.length : null },
    { label: 'Press releases', icon: Newspaper, href: '/portal/press', n: press.ok ? press.value.length : null },
    { label: 'New launches', icon: Sparkles, href: null, n: launches.ok ? launches.value.length : null },
  ];
  const recent = messages.ok ? messages.value.slice(0, 6) : [];
  const failed = [products, categories, messages, traffic].some((r) => !r.ok);
  const forbidden = !messages.ok && !traffic.ok;

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto pb-20 md:pb-10">
      <PageHeader title="Dashboard" description="How your website is doing — visitors, enquiries and what's live." />

      {failed && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-3">
          {forbidden
            ? "Some numbers couldn't be loaded for this account. If this persists, ask your administrator to check your access."
            : "Some numbers couldn't be loaded just now. Refresh in a moment to try again."}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Page views · 7 days" value={views ? fmt(views.current) : '—'} sub="vs previous 7 days" icon={Eye} delta={views ? <Delta pct={views.pct} /> : null} />
        <StatCard label="Visitors · 7 days" value={visitors ? fmt(visitors.current) : '—'} sub="Unique browsers, vs previous 7 days" icon={Users} delta={visitors ? <Delta pct={visitors.pct} /> : null} />
        <StatCard label="Enquiries · 30 days" value={enquiries ? fmt(enquiries.current) : '—'} sub="vs previous 30 days" icon={MessageSquare} delta={enquiries ? <Delta pct={enquiries.pct} /> : null} href="/portal/messages" />
        <StatCard label="Unread messages" value={unread ?? '—'} sub={messages.ok ? `${messages.value.length} total` : ''} icon={Inbox} href="/portal/messages" />
      </div>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        <Card
          className="xl:col-span-2"
          title="Website traffic"
          subtitle={`Page views and visitors per day, last ${range} days`}
          action={
            <div className="inline-flex rounded-lg border border-[var(--admin-border)] p-0.5 text-xs font-medium">
              {RANGES.map((r) => (
                <Link key={r} href={`/portal/dashboard?range=${r}`} className={`px-2.5 py-1 rounded-md ${r === range ? 'bg-[#f3f4f6] text-[var(--admin-text)]' : 'text-[var(--admin-muted)] hover:text-[var(--admin-text)]'}`}>{r}d</Link>
              ))}
            </div>
          }
        >
          {!series.length ? (
            <EmptyState title="Traffic data isn't available right now" hint="Refresh to try again." />
          ) : noTraffic ? (
            <EmptyState title="No visits recorded yet" hint="Page views appear here as people browse the live website. Counting starts once this version is live." />
          ) : (
            <>
              <div className="flex items-center gap-5 text-xs text-[var(--admin-muted)] mb-2">
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[var(--admin-accent)]" /> Page views · {fmt(totalViews)}</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0 border-t border-dashed border-[#9ca3af]" /> Visitors · {fmt(sum(series, 'visitors'))}</span>
              </div>
              <LineChart data={series} valueLabel="Views" secondary={series.map((s) => ({ value: s.visitors }))} secondaryLabel="Visitors" />
              {traffic.value?.partial && <p className="mt-2 text-xs text-[var(--admin-muted)]">Some days couldn&apos;t be loaded and show as zero.</p>}
            </>
          )}
        </Card>

        <Card title="On your website" subtitle="Live content right now">
          <ul className="divide-y divide-[#f3f4f6] -my-2">
            {content.map((c) => {
              const Icon = c.icon;
              const row = (
                <div className="flex items-center gap-3 py-3">
                  <span className="w-8 h-8 rounded-lg bg-[#f3f4f6] text-[var(--admin-muted)] flex items-center justify-center shrink-0"><Icon size={15} strokeWidth={1.75} /></span>
                  <span className="flex-1 text-[13px] font-medium">{c.label}{c.sub && <span className="block text-xs font-normal text-[var(--admin-muted)]">{c.sub}</span>}</span>
                  <span className="text-lg font-semibold tabular">{c.n ?? '—'}</span>
                </div>
              );
              return <li key={c.label}>{c.href ? <Link href={c.href} className="block hover:bg-[#fafafa] -mx-2 px-2 rounded-lg transition-colors">{row}</Link> : row}</li>;
            })}
          </ul>
        </Card>
      </div>

      <Card
        className="mt-6"
        flush
        title="Recent enquiries"
        subtitle="Latest messages from the contact forms"
        action={<Link href="/portal/messages" className="text-xs font-medium text-[var(--admin-accent)] hover:underline">View all</Link>}
      >
        {recent.length === 0 ? (
          <div className="px-6 pb-6"><EmptyState title="No messages yet" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-[var(--admin-muted)] border-y border-[var(--admin-border)]">
                  <th className="font-medium px-5 md:px-6 py-3">Name</th>
                  <th className="font-medium px-3 py-3">Subject</th>
                  <th className="font-medium px-3 py-3">Date</th>
                  <th className="font-medium px-5 md:px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((m) => (
                  <tr key={m.id} className="border-b border-[#f3f4f6] last:border-0 hover:bg-[#fafafa] transition-colors">
                    <td className="px-5 md:px-6 py-3"><div className="font-medium">{m.name || '—'}</div><div className="text-xs text-[var(--admin-muted)]">{m.email}</div></td>
                    <td className="px-3 py-3 text-[var(--admin-muted)]">{m.subject || 'New Inquiry'}</td>
                    <td className="px-3 py-3 text-[var(--admin-muted)] whitespace-nowrap tabular">{m.created_at ? new Date(m.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                    <td className="px-5 md:px-6 py-3"><Badge tone={isUnread(m) ? 'warning' : 'success'}>{isUnread(m) ? 'Unread' : 'Read'}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
