import { getProduct, getProductSeo } from '@/lib/cms';
import ProductDetailClient from './ProductDetailClient';
import JsonLd from '@/components/JsonLd';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  // Load custom SEO overrides
  let productSeo = {};
  try {
    const seoData = await getProductSeo();
    productSeo = seoData?.[slug] || {};
  } catch (e) {
    console.error("Failed to load product SEO overrides:", e);
  }

  const title = productSeo.title || product.name;
  const description = productSeo.description || product.shortDescription || product.longDescription?.substring(0, 160) || product.name;
  const keywords = productSeo.keywords || '';

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: `${title} - Cinema Focus`,
      description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - Cinema Focus`,
      description,
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

  // Dynamic Product JSON-LD structured data
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images || [],
    "description": product.shortDescription || product.longDescription || product.name,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.cinemafocus.in/products/${product.slug}`,
      "priceCurrency": "OMR",
      "price": product.price || 0,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <>
      <JsonLd data={productSchema} />
      <ProductDetailClient product={product} />
    </>
  );
}
