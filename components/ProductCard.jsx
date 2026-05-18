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
  // 2. images[0]  — first image from the local images array
  // 3. Fallback   — placeholder handled by LazyImage itself
  const imageSrc = product.image_url || product.images?.[0] || null;

  return (
    <Link href={`/products/${product.slug}`} className="group block" aria-label={`View ${product.name}`}>
      {/* Card container — Apple uses soft bg, no visible border, just shadow on hover */}
      <div className="relative rounded-3xl overflow-hidden bg-secondary/40 transition-all duration-500 ease-out group-hover:bg-secondary/70 group-hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
        {/* Image area */}
        <div className="relative aspect-square overflow-hidden p-6 pb-4">
          <LazyImage
            src={imageSrc}
            alt={product.name}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            containerClassName="rounded-2xl bg-transparent"
            objectFit="contain"
            aspectRatio="aspect-square"
          />

          {/* New badge */}
          {product.is_new_launch && (
            <span className="absolute top-4 left-4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest bg-primary text-primary-foreground rounded-full leading-none z-10">
              New
            </span>
          )}
        </div>

        {/* Content */}
        <div className="px-5 pb-6 pt-1 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {product.brand || (product.category ? product.category.replace(/-/g, ' ') : 'Audio')}
          </p>
          <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          {showPrice && product.price ? (
            <p className="text-sm font-medium text-foreground/80 pt-0.5">
              {formatPrice(product.price)}
            </p>
          ) : (
            <p className="text-sm font-medium text-primary/70 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Learn more →
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
