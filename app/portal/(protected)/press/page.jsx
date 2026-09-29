import { ExternalLink } from 'lucide-react';
import { getPress } from '@/lib/portal/data';
import { formatDate } from '@/lib/utils';
import { PageHeader, EmptyState } from '@/components/panel/ui';

export const metadata = { title: 'Press Releases' };
export const dynamic = 'force-dynamic';

export default async function PortalPress() {
  let press = null;
  try { press = await getPress(); } catch {}
  const releases = press && [...press].sort((a, b) => (Date.parse(b.date || b.created_at || 0) || 0) - (Date.parse(a.date || a.created_at || 0) || 0));

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-20 md:pb-8">
      <PageHeader title="Press Releases" description="News and announcements published on your website." />

      {releases === null ? (
        <EmptyState title="Press releases couldn't be loaded" hint="Refresh to try again." />
      ) : (
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/20 border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Title</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                <th className="text-right p-4 font-medium text-muted-foreground">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {releases.map((release) => (
                <tr key={release.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="p-4 font-medium text-sm md:text-base">{release.title}</td>
                  <td className="p-4 text-muted-foreground text-sm">{formatDate(release.date)}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-3">
                      <a href={`/press/${release.slug || release.id}`} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors" title="View on website">
                        <ExternalLink size={18} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
              {releases.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-muted-foreground">No press releases found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
