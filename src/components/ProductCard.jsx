import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product.slug}`} className="group block space-y-6">
      {/* Image Container - Clean, no borders, gray background */}
      <div className="aspect-square bg-secondary/30 rounded-2xl overflow-hidden relative">
         <img
          src={product.images?.[0] || '/images/placeholder.png'}
          alt={product.name}
          onError={(e) => { e.target.src = '/images/placeholder.png'; }}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Content - Minimal text below */}
      <div className="text-center space-y-2">
        <h3 className="text-xl md:text-2xl font-medium text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-muted text-sm md:text-base font-medium uppercase tracking-widest">
           {product.category.replace('-', ' ')}
        </p>
        
        {/* Optional: "Shop >" link that appears or is always there */}
        <div className="pt-2 text-primary text-sm font-medium opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          Buy Now ›
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
