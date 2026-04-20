"use client";

import React from 'react';
import Link from 'next/link';
import LazyImage from './LazyImage';

const CategoryCard = ({ category }) => {
  if (!category) return null;

  return (
    <Link 
      href={`/category/${category.slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-secondary/20"
    >
      <LazyImage
        src={category.imageUrl || category.image_url}
        alt={category.name}
        aspectRatio="aspect-[4/5]"
        className="opacity-80 group-hover:opacity-60 group-hover:scale-105"
      />
      
      <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
         <h3 className="text-xl font-medium text-white tracking-tight mb-2 drop-shadow-md">
            {category.name}
         </h3>
         <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-lg">›</span>
         </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
