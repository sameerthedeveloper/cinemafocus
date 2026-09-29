import { getProducts, getCategories } from '@/lib/portal/data';
import { PageHeader, EmptyState } from '@/components/panel/ui';

export const metadata = { title: 'Brands' };
export const dynamic = 'force-dynamic';

export default async function PortalBrands() {
  let products = null, categories = null;
  try { [products, categories] = await Promise.all([getProducts(), getCategories()]); } catch {}

  const counts = new Map();
  (products || []).forEach((p) => p.category && counts.set(p.category, (counts.get(p.category) || 0) + 1));
  const brands = (categories || [])
    .map((c) => ({ ...c, count: counts.get(c.slug) || 0 }))
    .sort((a, b) => b.count - a.count || String(a.name).localeCompare(String(b.name)));

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto pb-20 md:pb-10">
      <PageHeader title="Brands" description="The brands you carry and how many products each has." />
      {categories === null ? <EmptyState title="Brands couldn't be loaded" hint="Refresh to try again." /> : brands.length === 0 ? <EmptyState title="No brands yet" /> : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {brands.map((b) => (
            <li key={b.id} className="bg-white border border-[var(--admin-border)] rounded-[20px] shadow-sm p-5 flex items-center gap-4">
              <span className="w-14 h-14 rounded-xl bg-black/[0.045] border border-[var(--admin-border)] overflow-hidden shrink-0 flex items-center justify-center">
                {(b.image_url || b.imageUrl) ? <img src={b.image_url || b.imageUrl} alt="" loading="lazy" className="w-full h-full object-contain p-1.5" /> : <span className="text-sm font-semibold text-[var(--admin-muted)]">{String(b.name || '?').slice(0, 2).toUpperCase()}</span>}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium truncate">{b.name}</span>
                <span className="block text-xs text-[var(--admin-muted)] truncate">{b.slug}</span>
              </span>
              <span className="text-right">
                <span className="block text-xl font-semibold tabular">{b.count}</span>
                <span className="block text-[11px] text-[var(--admin-muted)]">{b.count === 1 ? 'product' : 'products'}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
