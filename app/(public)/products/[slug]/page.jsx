import { getProduct } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const product = await getProduct(supabase, slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | Cinema Focus`,
    description: product.shortDescription || product.longDescription?.substring(0, 160) || product.name,
    openGraph: {
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const product = await getProduct(supabase, slug);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif mb-4">Product Not Found</h2>
        <a href="/products" className="text-primary hover:underline">Back to Products</a>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
