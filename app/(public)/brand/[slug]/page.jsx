import { getProducts, getCategories } from '@/lib/cms';
import BrandClient from './BrandClient';
import { redirect } from 'next/navigation';
import JsonLd from '@/components/JsonLd';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cats = await getCategories();
  const category = cats.find(c => c.slug === slug);

  if (!category) {
    return {
      title: 'Brand Not Found',
    };
  }

  return {
    title: `${category.name} — Cinema Focus`,
    description: `Browse the complete Cinema Focus ${category.name} collection — handpicked for the ultimate audio experience in Chennai, India.`,
    keywords: `${category.name}, ${category.name} speakers, premium audio Chennai, buy ${category.name} India`,
    alternates: {
      canonical: `/brand/${slug}`,
    },
    openGraph: {
      title: `${category.name} — Cinema Focus`,
      description: `Browse the complete Cinema Focus ${category.name} collection — handpicked for the ultimate audio experience in Chennai, India.`,
      url: `https://cinemafocus.in/brand/${slug}`,
    }
  };
}

export default async function BrandPage({ params }) {
  const { slug } = await params;
  
  const [cats, products] = await Promise.all([
    getCategories(),
    getProducts({ category: slug })
  ]);

  const activeCat = cats.find(c => c.slug === slug);

  if (!activeCat) {
    redirect('/products');
  }

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://cinemafocus.in/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Brands",
        "item": "https://cinemafocus.in/products"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": activeCat.name,
        "item": `https://cinemafocus.in/brand/${slug}`
      }
    ]
  };

  // ItemList schema (CollectionPage)
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": products.map((prod, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://cinemafocus.in/products/${prod.slug}`,
      "name": prod.name
    }))
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />
      <BrandClient category={activeCat} products={products} />
    </>
  );
}
