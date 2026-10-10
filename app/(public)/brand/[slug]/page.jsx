import { getProducts, getCategories } from '@/lib/cms';
import BrandClient from './BrandClient';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import { seoNoindex, seoTitle, seoDescription, isIndexableProduct } from '@/lib/seo';
import { buildMetadata, pickTitle } from '@/lib/metadata';
import { breadcrumbSchema, collectionSchema } from '@/lib/schema';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const [cats, products] = await Promise.all([getCategories(), getProducts({ category: slug })]);
  const category = cats.find((c) => c.slug === slug);

  if (!category) {
    return { title: 'Brand Not Found', robots: { index: false, follow: false } };
  }

  const name = category.name;
  const title =
    seoTitle(category) ||
    pickTitle(
      `${name} in India | Buy ${name} at Cinema Focus, Chennai`,
      `${name} in India | Buy at Cinema Focus, Chennai`,
      `${name} in India | Cinema Focus Chennai`,
      `${name} | Cinema Focus`
    );
  const description =
    seoDescription(category) ||
    `Browse the Cinema Focus ${name} collection in India. Hear ${name} at our Mylapore, Chennai showroom, with expert advice and installation.`;

  // Thin / empty brand pages stay out of the index
  const noindex = seoNoindex(category) || products.filter(isIndexableProduct).length === 0;

  return buildMetadata({
    title,
    description,
    path: `/brand/${slug}`,
    image: category.imageUrl || category.image_url,
    imageAlt: name,
    noindex,
  });
}

export default async function BrandPage({ params }) {
  const { slug } = await params;

  const [cats, products] = await Promise.all([
    getCategories(),
    getProducts({ category: slug }),
  ]);

  const activeCat = cats.find((c) => c.slug === slug);

  if (!activeCat) notFound();

  const listed = products.filter(isIndexableProduct);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Products', path: '/products' },
          { name: activeCat.name, path: `/brand/${slug}` },
        ])}
      />
      <JsonLd
        data={collectionSchema({
          path: `/brand/${slug}`,
          name: `${activeCat.name} at Cinema Focus`,
          description: activeCat.description,
          items: listed,
        })}
      />
      <BrandClient category={activeCat} products={products} />
    </>
  );
}
