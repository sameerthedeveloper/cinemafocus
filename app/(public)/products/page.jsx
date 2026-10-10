import JsonLd from '@/components/JsonLd';
import { getProducts, getCategories, getNewLaunches } from '@/lib/cms';
import { isIndexableProduct } from '@/lib/seo';
import { buildMetadata } from '@/lib/metadata';
import { breadcrumbSchema, collectionSchema } from '@/lib/schema';
import ProductsClient from './ProductsClient';

export const metadata = buildMetadata({
  title: 'Hi-Fi & Home Cinema Products | Cinema Focus Chennai',
  description:
    'Explore the complete collection of world-class high-end audio and home theater equipment at Cinema Focus in Chennai, India. Curated specifically for audiophiles.',
  path: '/products',
});

// Only the fields the grid and its search box use
const cardFields = (p) => ({
  slug: p.slug,
  name: p.name,
  brand: p.brand,
  category: p.category,
  price: p.price,
  images: p.images,
  image_url: p.image_url,
  short_description: p.short_description,
  is_new_launch: p.is_new_launch,
});

export default async function ProductsPage() {
  let products;
  let categories;
  let newLaunches;
  try {
    [products, categories, newLaunches] = await Promise.all([getProducts(), getCategories(), getNewLaunches()]);
  } catch (e) {
    // Client falls back to fetching on mount
    console.error('Failed to server-render products:', e);
  }

  const listed = (products || []).filter(isIndexableProduct);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Products', path: '/products' },
        ])}
      />
      {listed.length > 0 && (
        <JsonLd
          data={collectionSchema({
            path: '/products',
            name: 'Cinema Focus product collection',
            description: 'High-end audio and home cinema equipment available at Cinema Focus, Chennai.',
            items: listed,
          })}
        />
      )}
      <ProductsClient
        initialProducts={products?.map(cardFields)}
        initialCategories={categories}
        initialNewLaunches={newLaunches}
      />
    </>
  );
}
