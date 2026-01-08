import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Section from '../components/Section';
import Button from '../components/Button';
import { getProduct, getProducts } from '../lib/db';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const ProductDetail = () => {
  const { slug } = useParams();
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
      <Helmet>
        <title>{product.name} | Cinema Focus</title>
        <meta name="description" content={product.shortDescription || product.name} />
      </Helmet>
      {/* Breadcrumb */}
      <div className="container px-4 mx-auto py-4 flex mt-15 items-center text-sm text-muted-foreground">
        <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
        <ChevronRight size={14} className="mx-2" />
        <Link to={`/products?category=${product.category}`} className="hover:text-primary transition-colors capitalize">
          {product.category.replace('-', ' ')}
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="text-foreground font-medium">{product.name}</span>
      </div>

      <Section className="py-24">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
           {/* Images (simple gallery for now) - Sticky */}
           <div className="space-y-6 lg:sticky lg:top-32 h-fit">
             <div className="aspect-square bg-secondary/20 overflow-hidden rounded-2xl">
               <img 
                 src={product.images[0]} 
                 alt={product.name} 
                 className="w-full h-full object-contain p-8"
               />
             </div>
             {product.images.length > 1 && (
               <div className="grid grid-cols-4 gap-4">
                 {product.images.map((img, idx) => (
                   <div key={idx} className="aspect-square bg-secondary/20 overflow-hidden rounded-xl cursor-pointer hover:opacity-80 transition-opacity">
                     <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-contain p-2" />
                   </div>
                 ))}
               </div>
             )}
           </div>

           {/* Details */}
           <div className="space-y-12 py-4">
             <div>
               <h3 className="text-primary font-medium text-sm mb-4 tracking-wide uppercase">{product.brand}</h3>
               <h1 className="text-5xl md:text-6xl font-medium tracking-tight leading-[1] mb-6">{product.name}</h1>
               <div className="h-0.5 w-12 bg-white" />
             </div>

             <div className="prose prose-invert prose-xl text-muted leading-relaxed font-light">
               <p>{product.longDescription}</p>
             </div>

             {/* Specs - Grid */}
             <div className="border-t border-black/10 pt-8">
               <h4 className="font-medium text-lg text-foreground mb-8">Specifications</h4>
               <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                 {product.specifications.map((spec, idx) => (
                   <div key={idx} className="pb-4 border-b border-black/5 mx-2">
                     <dt className="text-sm font-medium text-muted mb-1">{spec.key}</dt>
                     <dd className="text-lg text-foreground font-medium">{spec.value}</dd>
                   </div>
                 ))}
               </dl>
             </div>

             {/* Actions */}
             <div className="flex flex-col sm:flex-row gap-6 pt-8">
               <Button to="/contact" size="lg" className="rounded-full px-8">Enquire Now</Button>
               <Button to="/contact" variant="outline" size="lg" className="rounded-full px-8">Visit Showroom</Button>
             </div>
           </div>
         </div>
      </Section>
    </div>
  );
};

export default ProductDetail;
