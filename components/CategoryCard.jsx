"use client";

import React from 'react';
import Link from 'next/link';
import LazyImage from './LazyImage';

const CategoryCard = ({ category }) => {
  if (!category) return null;

  const imageSrc = category.imageUrl || category.image_url;

  return (
    <Link 
      href={`/brand/${category.slug}`}
      className="group flex flex-col items-center text-center w-[160px] md:w-[200px] p-6 md:p-8 rounded-[2rem] bg-secondary/10 hover:bg-secondary/20 transition-all duration-500 ease-out border border-border/10 hover:border-primary/20 hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 flex-shrink-0 cursor-pointer select-none"
    >
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-background flex items-center justify-center p-4 md:p-6 transition-all duration-500 ease-out group-hover:scale-[1.05] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)] border border-border/5 mb-5 md:mb-6">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={category.name}
            className="w-full h-full object-contain p-1"
          />
        ) : (
          <div className="text-muted-foreground/30 font-bold text-2xl uppercase select-none">
            {category.name.substring(0, 2)}
          </div>
        )}
      </div>
      
      <div className="space-y-1.5 md:space-y-2">
        <h3 className="text-sm md:text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary leading-tight line-clamp-1">
          {category.name}
        </h3>
        {category.featured ? (
          <span className="text-[10px] md:text-[11px] text-[#e05600] font-bold uppercase tracking-wider block animate-pulse">New</span>
        ) : (
          <span className="text-[10px] md:text-xs text-muted-foreground/80 font-medium block">
            {category.product_count || 0} {category.product_count === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;
