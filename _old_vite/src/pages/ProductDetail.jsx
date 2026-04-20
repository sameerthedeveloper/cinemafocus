import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Section from '../components/Section';
import Button from '../components/Button';
import { getProduct, getProducts } from '../lib/db';
import SEO from '../components/SEO';
import { useCurrency } from '../hooks/useCurrency';
import { ChevronRight, ChevronLeft, ShieldCheck, Truck, RotateCcw, FileText } from 'lucide-react';
import LazyImage from '../components/LazyImage';

const ProductDetail = () => {
  const { slug } = useParams();
  const { formatPrice, showPrice } = useCurrency();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const p = await getProduct(slug);
      setProduct(p);
      setLoading(false);
      setActiveIndex(0);
    };
    fetchProduct();
  }, [slug]);

  // Preload all gallery images in background
  useEffect(() => {
    if (product?.images?.length > 1) {
      product.images.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    }
  }, [product]);

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
        description={product.shortDescription || product.longDescription?.substring(0, 160) || product.name}
        image={product.images?.[0]}
        path={`/products/${slug}`}
        keywords={`${product.name}, ${product.brand}, ${product.category?.replace('-', ' ')}, premium audio, Cinema Focus`}
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "image": product.images,
            "description": product.shortDescription || product.longDescription?.substring(0, 300),
            "sku": product.slug,
            "category": product.category?.replace('-', ' '),
            "brand": {
              "@type": "Brand",
              "name": product.brand || "Cinema Focus"
            },
            "offers": {
              "@type": "Offer",
              "price": product.price || 0,
              "priceCurrency": "OMR",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "Cinema Focus"
              }
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cinemafocus.in" },
              { "@type": "ListItem", "position": 2, "name": product.category?.replace('-', ' ') || "Products", "item": `https://cinemafocus.in/products?category=${product.category}` },
              { "@type": "ListItem", "position": 3, "name": product.brand, "item": `https://cinemafocus.in/products?category=${product.category}` },
              { "@type": "ListItem", "position": 4, "name": product.name }
            ]
          }
        ]}
      />
      {/* Breadcrumb */}
      <div className="max-w-[1400px] px-4 md:px-8 mx-auto py-4 flex mt-15 items-center text-sm text-muted-foreground">
        {/* <Link to="/products" className="hover:text-primary transition-colors">Products</Link> */}
        <Link to={`/products?category=${product.category}`} className="hover:text-primary transition-colors capitalize">
          {product.category.replace('-', ' ')}
        </Link>
        <ChevronRight size={14} className="mx-2" />
<Link to={`/products?category=${product.category}`} className="hover:text-primary transition-colors capitalize">
          {product.brand}
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="text-foreground font-medium" aria-current="page">{product.name}</span>
      </div>

      <Section className="py-12 md:py-20" container={false}>
         <div className="max-w-[1400px] mx-auto px-4 md:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
             {/* Images Gallery - Sticky */}
             <div className="space-y-6 lg:sticky lg:top-32 h-fit">
               <div className="relative group aspect-square md:aspect-[4/3] bg-secondary/20 overflow-hidden rounded-2xl flex items-center justify-center">
                 <LazyImage 
                   key={activeIndex}
                   src={product.images[activeIndex]} 
                   alt={product.name} 
                   className="p-8 mix-blend-multiply transition-all duration-300 shadow-sm"
                   aspectRatio="aspect-square md:aspect-[4/3]"
                   objectFit="contain"
                 />
                 
                 {product.images.length > 1 && (
                   <>
                     <button 
                       onClick={() => setActiveIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                       className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer z-20"
                       aria-label="Previous image"
                     >
                       <ChevronLeft size={24} />
                     </button>
                     <button 
                       onClick={() => setActiveIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                       className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer z-20"
                       aria-label="Next image"
                     >
                       <ChevronRight size={24} />
                     </button>
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-background/40 backdrop-blur-sm rounded-full z-20">
                       {product.images.map((_, idx) => (
                         <div 
                           key={idx} 
                           className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'bg-primary w-4' : 'bg-primary/30'}`}
                         />
                       ))}
                     </div>
                   </>
                 )}
               </div>
               
               {product.images.length > 1 && (
                 <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                   {product.images.map((img, idx) => (
                     <button 
                       key={idx} 
                       onClick={() => setActiveIndex(idx)}
                       className={`aspect-square bg-secondary/20 overflow-hidden rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center border-2 ${idx === activeIndex ? 'border-primary opacity-100 ring-4 ring-primary/5' : 'border-transparent opacity-60 hover:opacity-100 shadow-sm'}`}
                     >
                       <LazyImage src={img} alt={`${product.name} ${idx}`} className="p-2 mix-blend-multiply" objectFit="contain" />
                     </button>
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
                 {product.catalogUrl && (
                   <Button 
                     href={product.catalogUrl} 
                     target="_blank" 
                     variant="outline" 
                     size="lg" 
                     className="rounded-full px-10 py-6 text-lg flex items-center justify-center gap-2"
                   >
                     <FileText size={20} />
                     Download Catalog
                   </Button>
                 )}
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
