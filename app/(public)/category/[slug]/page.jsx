import { getProducts, getCategories } from '@/lib/cms';
import CategoryClient from './CategoryClient';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cats = await getCategories();
  const category = cats.find(c => c.slug === slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} | Cinema Focus`,
    description: `Explore our premium selection of ${category.name.toLowerCase()} — expertly curated by Cinema Focus for the ultimate audio experience.`,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  
  const [cats, products] = await Promise.all([
    getCategories(),
    getProducts({ category: slug })
  ]);

  const activeCat = cats.find(c => c.slug === slug);

  if (!activeCat) {
    redirect('/products');
  }

  return <CategoryClient category={activeCat} products={products} />;
}
