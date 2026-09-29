import { getProjects } from '@/lib/portal/data';
import { PageHeader, EmptyState, Badge } from '@/components/panel/ui';

export const metadata = { title: 'Gallery' };
export const dynamic = 'force-dynamic';

export default async function PortalGallery() {
  let projects = null;
  try { projects = await getProjects(); } catch {}
  const sorted = projects && [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || (Date.parse(b.created_at || 0) || 0) - (Date.parse(a.created_at || 0) || 0));

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto pb-20 md:pb-10">
      <PageHeader title="Gallery" description="Installations shown on your website's gallery." />
      {sorted === null ? <EmptyState title="Gallery couldn't be loaded" hint="Refresh to try again." /> : sorted.length === 0 ? <EmptyState title="No projects yet" /> : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((p) => (
            <li key={p.id} className="bg-white border border-[var(--admin-border)] rounded-[20px] shadow-sm overflow-hidden">
              <div className="aspect-[4/3] bg-black/[0.045]">
                {(p.image_url || p.imageUrl) && <img src={p.image_url || p.imageUrl} alt={p.title || p.name || 'Project'} loading="lazy" className="w-full h-full object-cover" />}
              </div>
              <div className="p-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.title || p.name || 'Untitled project'}</div>
                  <div className="text-xs text-[var(--admin-muted)] mt-0.5">{p.category || 'Installation'}</div>
                </div>
                {p.featured && <Badge tone="info">Featured</Badge>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
