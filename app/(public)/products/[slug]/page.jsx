import { notFound, permanentRedirect } from 'next/navigation';
import { getProduct, getProductSeo, getCategories } from '@/lib/cms';
import ProductDetailClient from './ProductDetailClient';
import JsonLd from '@/components/JsonLd';
import { canonicalSlugOf, seoNoindex, seoTitle, seoDescription } from '@/lib/seo';
import { buildMetadata, pickTitle } from '@/lib/metadata';
import { breadcrumbSchema, productSchema } from '@/lib/schema';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: 'Product Not Found', robots: { index: false, follow: false } };
  }

  // Legacy per-slug overrides from the `product_seo` setting
  let legacySeo = {};
  try {
    const seoData = await getProductSeo();
    legacySeo = seoData?.[slug] || {};
  } catch (e) {
    console.error('Failed to load product SEO overrides:', e);
  }

  const brand = product.brand || '';
  const title =
    seoTitle(product) ||
    legacySeo.title ||
    pickTitle(
      [product.name, brand, 'Cinema Focus Chennai'].filter(Boolean).join(' | '),
      [product.name, brand, 'Cinema Focus'].filter(Boolean).join(' | '),
      [product.name, 'Cinema Focus'].join(' | '),
      product.name
    );
  const description =
    seoDescription(product) ||
    legacySeo.description ||
    product.shortDescription ||
    product.longDescription ||
    `${product.name}${brand ? ` by ${brand}` : ''} at Cinema Focus, Chennai.`;

  const noindex = seoNoindex(product) || !!canonicalSlugOf(product);

  return buildMetadata({
    title,
    description,
    path: `/products/${slug}`,
    image: product.images?.[0],
    imageAlt: product.name,
    noindex,
    extraDescriptions: [product.longDescription],
  });
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  // Duplicate listing -> permanent redirect to the canonical product (308)
  const canonicalSlug = canonicalSlugOf(product);
  if (canonicalSlug) permanentRedirect(`/products/${canonicalSlug}`);

  // Link the brand crumb only when the brand page exists
  let brandCrumb = null;
  try {
    const cats = await getCategories();
    const cat = cats.find((c) => c.slug === product.category);
    if (cat) brandCrumb = { name: cat.name, path: `/brand/${cat.slug}` };
  } catch (e) {
    console.error('Failed to load categories for breadcrumb:', e);
  }

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    ...(brandCrumb ? [brandCrumb] : []),
    { name: product.name, path: `/products/${product.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={productSchema(product)} />
      <ProductDetailClient product={product} />
    </>
  );
}
