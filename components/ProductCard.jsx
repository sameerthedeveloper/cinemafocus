"use client";

import React from 'react';
import Link from 'next/link';
import { useCurrency } from '../hooks/useCurrency';
import LazyImage from './LazyImage';

const ProductCard = ({ product }) => {
  const { formatPrice, showPrice } = useCurrency();
  
  if (!product) return null;

  // Resolve the best available image source:
  // 1. image_url  — explicit URL set by admin (Supabase storage or external)
  // 2. images[0]  — first image from the local images array (e.g. /images/products/slug-0.png)
  // 3. Fallback   — placeholder handled by LazyImage itself
  const imageSrc = product.image_url || product.images?.[0] || null;

  return (
    <Link href={`/products/${product.slug}`} className="group block space-y-6">
      {/* Dynamic Image with Lazy Loading & Skeleton */}
      <LazyImage 
        src={imageSrc} 
        alt={product.name}
        className="p-4 group-hover:scale-110 transition-transform duration-500"
        containerClassName="rounded-2xl shadow-sm bg-secondary/10"
        objectFit="contain"
      />

      {/* Content - Minimal text below */}
      <div className="text-center space-y-2">
        <h3 className="text-xl md:text-2xl font-medium text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-muted text-sm md:text-base font-medium uppercase tracking-widest">
           {product.category ? product.category.replace(/-/g, ' ') : 'New Arrival'}
        </p>
        {showPrice && product.price && (
          <p className="text-foreground font-medium mt-1">
            {formatPrice(product.price)}
          </p>
        )}
        
        {/* Optional: "Shop >" link that appears or is always there */}
        <div className="pt-2 text-primary text-sm font-medium opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          Buy Now ›
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
