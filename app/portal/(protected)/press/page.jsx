import { ExternalLink } from 'lucide-react';
import { getPress } from '@/lib/portal/data';
import { PageHeader, EmptyState } from '@/components/panel/ui';

export const metadata = { title: 'Press Releases' };
export const dynamic = 'force-dynamic';

export default async function PortalPress() {
  let press = null;
  try { press = await getPress(); } catch {}
  const sorted = press && [...press].sort((a, b) => (Date.parse(b.date || b.created_at || 0) || 0) - (Date.parse(a.date || a.created_at || 0) || 0));

  return (
    <div className="p-4 md:p-8 max-w-[1000px] mx-auto pb-20 md:pb-10">
      <PageHeader title="Press Releases" description="News and announcements published on your website." />
      {sorted === null ? <EmptyState title="Press releases couldn't be loaded" hint="Refresh to try again." /> : sorted.length === 0 ? <EmptyState title="No press releases yet" /> : (
        <ul className="space-y-4">
          {sorted.map((p) => (
            <li key={p.id} className="bg-white border border-[var(--admin-border)] rounded-[20px] shadow-sm p-4 flex gap-4">
              <span className="w-28 h-20 sm:w-36 sm:h-24 rounded-lg bg-black/[0.045] overflow-hidden shrink-0">
                {(p.image_url || p.imageUrl) && <img src={p.image_url || p.imageUrl} alt="" loading="lazy" className="w-full h-full object-cover" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-[var(--admin-muted)] tabular">{p.date ? new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span>
                <span className="block font-medium mt-0.5">{p.title}</span>
                {p.excerpt && <span className="block text-[13px] text-[var(--admin-muted)] mt-1 line-clamp-2">{p.excerpt}</span>}
                <a href={`/press/${p.slug || p.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-[var(--admin-accent)] hover:underline">View on website <ExternalLink size={12} /></a>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
