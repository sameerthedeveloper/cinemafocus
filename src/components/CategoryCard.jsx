import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link 
      to={`/category/${category.slug}`}
      className="group relative block overflow-hidden rounded-2xl aspect-[4/5] bg-secondary/20"
    >
      <img
        src={category.imageUrl}
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60"
      />
      
      <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
         <h3 className="text-3xl font-medium text-white tracking-tight mb-2 drop-shadow-md">
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
