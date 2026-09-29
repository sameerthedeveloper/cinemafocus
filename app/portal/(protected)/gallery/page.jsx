import { Star } from 'lucide-react';
import { getProjects } from '@/lib/portal/data';
import { PageHeader, EmptyState } from '@/components/panel/ui';

export const metadata = { title: 'Gallery' };
export const dynamic = 'force-dynamic';

export default async function PortalGallery() {
  let projects = null;
  try { projects = await getProjects(); } catch {}
  const sorted = projects && [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || (Date.parse(b.created_at || 0) || 0) - (Date.parse(a.created_at || 0) || 0));

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-20 md:pb-8">
      <PageHeader title="Gallery" description="Installations shown on your website's gallery." />

      {sorted === null ? (
        <EmptyState title="Gallery couldn't be loaded" hint="Refresh to try again." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((project) => (
            <div key={project.id} className={`group relative bg-background rounded-2xl border ${project.featured ? 'border-amber-500/50 shadow-sm' : 'border-border'} overflow-hidden flex flex-col`}>
              <div className="aspect-video bg-secondary/20 relative overflow-hidden">
                {(project.image_url || project.imageUrl) && (
                  <img
                    src={project.image_url || project.imageUrl}
                    alt={project.title}
                    loading="lazy"
                    style={{ objectPosition: project.image_position || project.imagePosition || '50% 50%' }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                {project.featured && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="px-2.5 py-1 text-xs font-semibold bg-amber-500 text-black rounded-full shadow flex items-center gap-1 backdrop-blur-md">
                      <Star size={12} fill="currentColor" /> Featured on Home
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex items-center justify-between">
                <div>
                  <h3 className="font-medium truncate">{project.title || project.name || 'Untitled project'}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{project.category}</span>
                  </div>
                </div>
                {project.featured && <span className="text-amber-500 text-xs font-medium shrink-0 ml-2" title="Featured on Homepage">Home Featured</span>}
              </div>
            </div>
          ))}
          {sorted.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground bg-secondary/30 rounded-2xl border-dashed border-2 border-border font-medium">No gallery items found.</div>
          )}
        </div>
      )}
    </div>
  );
}
