import React from 'react';
import Image from 'next/image';
import Button from './Button';

const Hero = ({ title, subtitle, ctaText, ctaLink, imageUrl }) => {
  return (
    <div className="relative h-screen flex items-center bg-zinc-950 overflow-hidden">
      {/* Background Image - LCP Optimized with next/image */}
      <div className="absolute inset-0 z-0">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt="Cinema Focus Hero" 
            fill
            priority
            fetchPriority="high"
            quality={90}
            className="object-cover opacity-60"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900" />
        )}
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Subtle gradient overlay from bottom to blend */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-90" />
      </div>

      {/* Content - Centered for max impact */}
      <div className="container px-6 relative z-10 mx-auto text-center">
         <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
           <h1 className="text-4xl md:text-6xl lg:text-8xl font-medium tracking-tight text-white leading-[1.1] drop-shadow-lg">
             {title}
           </h1>
           <p className="text-xl md:text-2xl text-zinc-300 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md">
             {subtitle}
           </p>
           <div className="pt-8 flex justify-center">
             <Button 
               to={ctaLink || '/products'} 
               size="lg" 
               className="rounded-full px-10 bg-white text-black hover:bg-zinc-200 border-none font-bold"
               style={{ color: 'black' }} // Force color to avoid conflicts
             >
               {ctaText || "Discover Products"}
             </Button>
           </div>
         </div>
      </div>
    </div>
  );
};

export default Hero;
