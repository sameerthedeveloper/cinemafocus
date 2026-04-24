import { getProduct } from '@/lib/cms';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.shortDescription || product.longDescription?.substring(0, 160) || product.name,
    openGraph: {
      title: `${product.name} - Cinema Focus`,
      description: product.shortDescription || product.longDescription?.substring(0, 160) || product.name,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - Cinema Focus`,
      description: product.shortDescription || product.longDescription?.substring(0, 160) || product.name,
    }
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

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
