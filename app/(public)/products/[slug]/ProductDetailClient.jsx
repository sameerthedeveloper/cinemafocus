"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Section from '@/components/Section';
import Button from '@/components/Button';
import { useCurrency } from '@/hooks/useCurrency';
import { ChevronRight, ChevronLeft, FileText } from 'lucide-react';
import LazyImage from '@/components/LazyImage';

export default function ProductDetailClient({ product }) {
  const { formatPrice, showPrice } = useCurrency();
  // Default to the most recently added image (last in the array) so a
  // newly uploaded image shows as the primary photo without requiring
  // the old one to be removed first.
  const [activeIndex, setActiveIndex] = useState(() =>
    product?.images?.length ? product.images.length - 1 : 0
  );

  // Reset to the newest image whenever we're showing a different product
  // (e.g. client-side navigation between product pages).
  useEffect(() => {
    setActiveIndex(product?.images?.length ? product.images.length - 1 : 0);
  }, [product?.id, product?.slug]);

  // Preload all gallery images in background
  useEffect(() => {
    if (product?.images?.length > 1) {
      product.images.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    }
  }, [product]);

  // Auto-play slideshow: cycle every 4 seconds, resetting on interaction
  useEffect(() => {
    if (!product?.images || product.images.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, [activeIndex, product?.images]);

  if (!product) return null;

  return (
    <div className="animate-fade-in pt-6">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] px-4 md:px-8 mx-auto py-4 flex mt-15 items-center text-sm text-muted-foreground">
        <Link href={`/brand/${product.category}`} className="hover:text-primary transition-colors capitalize">
          {product.category?.replace('-', ' ')}
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="text-foreground font-medium" aria-current="page">{product.name}</span>
      </div>

      <Section className="py-12 md:py-20" container={false}>
         <div className="max-w-[1400px] mx-auto px-4 md:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
             {/* Images Gallery */}
             <div className="space-y-6 lg:sticky lg:top-32 h-fit">
                <div className="relative group aspect-square md:aspect-[4/3] bg-white overflow-hidden rounded-2xl flex items-center justify-center p-8">
                  <LazyImage 
                    key={activeIndex}
                    src={product.images?.[activeIndex]} 
                    alt={product.name} 
                    className="transition-all duration-300 shadow-sm"
                    aspectRatio="w-full h-full"
                    objectFit="contain"
                    priority={true}
                  />
                 
                 {product.images?.length > 1 && (
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
               
               {product.images?.length > 1 && (
                 <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                   {product.images.map((img, idx) => (
                     <button 
                       key={idx} 
                       onClick={() => setActiveIndex(idx)}
                       className={`aspect-square bg-white overflow-hidden rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center border-2 p-1 ${idx === activeIndex ? 'border-primary opacity-100 ring-4 ring-primary/5' : 'border-transparent opacity-60 hover:opacity-100 shadow-sm'}`}
                     >
                       <LazyImage 
                         src={img} 
                         alt={`${product.name} ${idx}`} 
                         className="" 
                         objectFit="contain" 
                         aspectRatio="w-full h-full"
                         containerClassName="bg-transparent"
                       />
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
  
               {/* Specs */}
               <div className="border-t border-border pt-8">
                 <h4 className="font-medium text-lg text-foreground mb-6">Specifications</h4>
                 <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                   {(product.specifications || []).map((spec, idx) => (
                     <div key={idx} className="pb-4 border-b border-border mx-2">
                       <dt className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-1 opacity-70">{spec.key === 'Category' ? 'Brand Category' : spec.key}</dt>
                       <dd className="text-base text-foreground font-medium">{spec.value}</dd>
                     </div>
                   ))}
                 </dl>
               </div>
  
               {/* Actions */}
               <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <Button href="/contact" size="lg" className="rounded-full px-10 py-6 text-lg">Enquire Now</Button>
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
                 <Button href="/contact" variant="outline" size="lg" className="rounded-full px-10 py-6 text-lg">Visit Showroom</Button>
               </div>
             </div>
           </div>
         </div>
      </Section>
    </div>
  );
}
