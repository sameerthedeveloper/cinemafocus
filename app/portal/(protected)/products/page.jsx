import { getProducts, getCategories } from '@/lib/portal/data';
import { PageHeader, EmptyState } from '@/components/panel/ui';
import ProductsView from '@/components/panel/ProductsView';

export const metadata = { title: 'Products' };
export const dynamic = 'force-dynamic';

export default async function PortalProducts() {
  let products = null, categories = [];
  try { [products, categories] = await Promise.all([getProducts(), getCategories()]); } catch {}
  const brands = categories.map((c) => ({ slug: c.slug, name: c.name })).sort((a, b) => a.name.localeCompare(b.name));
  const sorted = products && [...products].sort((a, b) => String(a.name).localeCompare(String(b.name)));

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto pb-20 md:pb-10">
      <PageHeader title="Products" description="Everything in your catalogue, as it appears on the website." />
      {sorted === null ? <EmptyState title="Products couldn't be loaded" hint="Refresh to try again." /> : <ProductsView products={sorted} brands={brands} />}
    </div>
  );
}
