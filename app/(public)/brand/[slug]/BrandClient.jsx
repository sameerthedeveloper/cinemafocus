"use client";

import React from 'react';
import ProductCard from '@/components/ProductCard';
import Section from '@/components/Section';

export default function BrandClient({ category, products }) {
  if (!category) return null;

  return (
    <Section className="py-20 min-h-screen">
       <div className="space-y-4 mb-12 text-center pt-10">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight">{category.name}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
             Explore our premium {category.name} collection.
          </p>
       </div>

       {/* Grid */}
       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
       </div>
       
       {products.length === 0 && (
         <div className="text-center py-20 text-muted-foreground">
           No products found for this brand.
         </div>
       )}
    </Section>
  );
}
