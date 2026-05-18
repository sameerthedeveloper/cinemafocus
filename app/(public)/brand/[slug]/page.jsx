import { getProducts, getCategories } from '@/lib/cms';
import BrandClient from './BrandClient';
import { redirect } from 'next/navigation';

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
    description: `Browse the complete Cinema Focus ${category.name} collection — handpicked for the ultimate audio experience.`,
    openGraph: {
      title: `${category.name} — Cinema Focus`,
      description: `Browse the complete Cinema Focus ${category.name} collection — handpicked for the ultimate audio experience.`,
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

  return <BrandClient category={activeCat} products={products} />;
}
