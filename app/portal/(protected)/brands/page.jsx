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
    .map((c) => ({ ...c, productCount: counts.get(c.slug) || 0 }))
    .sort((a, b) => b.productCount - a.productCount || String(a.name).localeCompare(String(b.name)));

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-20 md:pb-8">
      <PageHeader title="Brands" description="The brands you carry and how many products each has." />

      {categories === null ? (
        <EmptyState title="Brands couldn't be loaded" hint="Refresh to try again." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((category) => (
            <div key={category.id} className="bg-background group rounded-2xl border border-border overflow-hidden flex flex-col hover:border-primary/50 transition-colors">
              <div className="aspect-video bg-secondary relative overflow-hidden">
                {(category.image_url || category.imageUrl) && (
                  <img src={category.image_url || category.imageUrl} alt={category.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-medium text-lg">{category.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-grow">{category.description}</p>
                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  <span>/{category.slug}</span>
                  <span>{category.productCount} Products</span>
                  <span className="text-[10px] uppercase tracking-widest font-semibold bg-secondary px-2 py-0.5 rounded-full">Brand</span>
                </div>
              </div>
            </div>
          ))}
          {brands.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground bg-secondary/30 rounded-2xl border-dashed border-2 border-border">No brands found.</div>
          )}
        </div>
      )}
    </div>
  );
}
