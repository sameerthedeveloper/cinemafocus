import { getProducts, getCategories } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import CategoryClient from './CategoryClient';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const cats = await getCategories(supabase);
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
  const supabase = await createClient();
  
  const [cats, products] = await Promise.all([
    getCategories(supabase),
    getProducts(supabase, { category: slug })
  ]);

  const activeCat = cats.find(c => c.slug === slug);

  if (!activeCat) {
    redirect('/products');
  }

  return <CategoryClient category={activeCat} products={products} />;
}
