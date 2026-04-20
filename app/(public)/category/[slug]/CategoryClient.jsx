"use client";

import React from 'react';
import ProductCard from '@/components/ProductCard';
import Section from '@/components/Section';

export default function CategoryClient({ category, products }) {
  if (!category) return null;

  return (
    <Section className="py-20 min-h-screen">
       <div className="space-y-4 mb-12 text-center pt-10">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight">{category.name}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
             Explore our premium selection of {category.name.toLowerCase()}.
          </p>
       </div>

       {/* Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-x-6 gap-y-12">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
       </div>
       
       {products.length === 0 && (
         <div className="text-center py-20 text-muted-foreground">
           No products found in this category.
         </div>
       )}
    </Section>
  );
}
