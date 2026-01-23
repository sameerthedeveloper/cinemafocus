import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Section from '../components/Section';
import Button from '../components/Button';
import { getProduct, getProducts } from '../lib/db';
import SEO from '../components/SEO';
import { useCurrency } from '../hooks/useCurrency';
import { ChevronRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const ProductDetail = () => {
  const { slug } = useParams();
  const { formatPrice, showPrice } = useCurrency();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const p = await getProduct(slug);
      setProduct(p);
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!product) {
    return (
      <Section className="py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif mb-4">Product Not Found</h2>
        <Button to="/products" variant="link" icon={false}>Back to Products</Button>
      </Section>
    );
  }

  return (
    <div className="animate-fade-in pt-6">
      <SEO 
        title={product.name} 
        description={product.shortDescription || product.name}
        image={product.images?.[0]}
        path={`/products/${slug}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "image": product.images,
          "description": product.shortDescription || product.longDescription?.substring(0, 150),
          "brand": {
            "@type": "Brand",
            "name": product.brand || "Cinema Focus"
          },
          "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock"
          }
        }}
      />
      {/* Breadcrumb */}
      <div className="max-w-[1400px] px-4 md:px-8 mx-auto py-4 flex mt-15 items-center text-sm text-muted-foreground">
        <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
        <ChevronRight size={14} className="mx-2" />
        <Link to={`/products?category=${product.category}`} className="hover:text-primary transition-colors capitalize">
          {product.category.replace('-', ' ')}
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="text-foreground font-medium" aria-current="page">{product.name}</span>
      </div>

      <Section className="py-12 md:py-20" container={false}>
         <div className="max-w-[1400px] mx-auto px-4 md:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
             {/* Images (simple gallery for now) - Sticky */}
             <div className="space-y-6 lg:sticky lg:top-32 h-fit">
               <div className="aspect-square md:aspect-[4/3] bg-secondary/20 overflow-hidden rounded-2xl flex items-center justify-center">
                 <img 
                   src={product.images[0]} 
                   alt={product.name} 
                   className="w-full h-full object-contain p-8 mix-blend-multiply"
                 />
               </div>
               {product.images.length > 1 && (
                 <div className="grid grid-cols-4 gap-4">
                   {product.images.map((img, idx) => (
                     <div key={idx} className="aspect-square bg-secondary/20 overflow-hidden rounded-xl cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center">
                       <img src={img} alt={`${product.name} ${idx}`} loading="lazy" className="w-full h-full object-contain p-2 mix-blend-multiply" />
                     </div>
                   ))}
                 </div>
               )}
             </div>
 
             {/* Details */}
             <div className="space-y-10 py-4">
               <div>
                 <h3 className="text-primary font-medium text-sm mb-4 tracking-wide uppercase opacity-70">{product.brand}</h3>
                 <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] mb-6">{product.name}</h1>
                 {showPrice && product.price && (
                   <p className="text-2xl font-light text-foreground mb-6 opacity-90">
                     {formatPrice(product.price)}
                   </p>
                 )}
                 <div className="h-px w-full bg-border" />
               </div>
 
               <div className="prose prose-invert prose-lg text-muted-foreground leading-relaxed font-light">
                 <p>{product.longDescription}</p>
               </div>
 
               {/* Specs - Grid */}
               <div className="border-t border-border pt-8">
                 <h4 className="font-medium text-lg text-foreground mb-6">Specifications</h4>
                 <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                   {(product.specifications || []).map((spec, idx) => (
                     <div key={idx} className="pb-4 border-b border-border mx-2">
                       <dt className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-1 opacity-70">{spec.key}</dt>
                       <dd className="text-base text-foreground font-medium">{spec.value}</dd>
                     </div>
                   ))}
                 </dl>
               </div>
 
               {/* Actions */}
               <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <Button to="/contact" size="lg" className="rounded-full px-10 py-6 text-lg">Enquire Now</Button>
                 <Button to="/contact" variant="outline" size="lg" className="rounded-full px-10 py-6 text-lg">Visit Showroom</Button>
               </div>
             </div>
           </div>
         </div>
      </Section>
    </div>
  );
};

export default ProductDetail;
