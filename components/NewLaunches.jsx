"use client";

import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import Button from './Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCurrency } from '../hooks/useCurrency';

const NewLaunches = ({ products }) => {
  const { formatPrice, showPrice } = useCurrency();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  
  // Use passed products or fallback to a mock list if empty
  const displayProducts = products && products.length > 0 ? products : [
    {
       slug: 'mock-1',
       name: 'CAPTIVATING.\nELECTRIFYING.',
       shortDescription: "Discover sound as you've never experienced before.",
       images: ['/images/products/speaker-transparent.png'], // User provided transparent image
       bgColor: '#333333', // Dark Grey from image
       textColor: '#ffffff',
       accentColor: '#ffffff',
    },
    {
       slug: 'mock-2', 
       name: 'PURE.\nPERFECTION.',
       shortDescription: 'Engineering meets art in perfect harmony.',
       images: ['/images/headphones.webp'],
       bgColor: '#1a1a1a', 
       textColor: '#f4f4f5', 
       accentColor: '#ffffff',
    },
    {
       slug: 'mock-3',
       name: 'ANALOG.\nSOUL.',
       shortDescription: 'Warmth and precision in every rotation.',
       images: ['/images/turntables.webp'],
       bgColor: '#27272a',
       textColor: '#ffffff',
       accentColor: '#ffffff',
    }
  ];

  const [key, setKey] = React.useState(0); // Key to force re-render/reset animation
  const AUTOPLAY_DURATION = 10000;

  // Auto-play Effect
  React.useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, AUTOPLAY_DURATION);

    return () => clearInterval(timer);
  }, [currentIndex, isTransitioning, displayProducts.length]);

  // Reset animation key on change
  React.useEffect(() => {
    setKey(prev => prev + 1);
  }, [currentIndex]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % displayProducts.length);
      setIsTransitioning(false);
    }, 400); // Faster transition
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + displayProducts.length) % displayProducts.length);
      setIsTransitioning(false);
    }, 400);
  };

  const currentProduct = displayProducts[currentIndex];

  if (!currentProduct) return null;

  // Defaults
  const bgColor = currentProduct.bgColor || '#333333';
  const textColor = currentProduct.textColor || '#ffffff';

  return (
    <div id="new-launches" className="relative w-full h-[100dvh] overflow-hidden group transition-colors duration-1000 ease-in-out" style={{ backgroundColor: bgColor, color: textColor }}>
       
      {/* Background Ambience - Multi-layered organic blurs for "Apple" feel */}
      <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-white/5 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-black/20 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 w-full h-full max-w-[1440px] mx-auto px-6 md:px-20 flex flex-col-reverse md:flex-row items-center">
         
         {/* Left Side: Text Content */}
         <div className="w-full md:w-1/2 flex flex-col justify-start md:justify-center items-start h-auto md:h-full pt-8 pb-12 md:py-0 pl-0 md:pl-0 z-20">
            <div 
              className={clsx(
                "transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) transform flex flex-col items-start", // Apple Ease
                isTransitioning ? "opacity-0 translate-y-8 scale-95" : "opacity-100 translate-y-0 scale-100"
              )}
            >
              {/* Eyebrow / Label */}
              <span className="mb-4 inline-block px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs font-semibold tracking-wider uppercase backdrop-blur-md animate-fade-in-up">
                 NEWLY LAUNCH
              </span>

              <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-semibold tracking-tighter leading-[0.95] whitespace-pre-line mb-6 md:mb-8 drop-shadow-sm bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-zinc-500">
                {currentProduct.name}
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl font-normal text-zinc-400 max-w-lg tracking-tight mb-8 md:mb-10 leading-relaxed line-clamp-3 md:line-clamp-none">
                {currentProduct.shortDescription}
              </p>
              
              {/* {showPrice && currentProduct.price && (
                <div className="text-xl md:text-2xl font-light tracking-wide opacity-90 mb-6">
                   {formatPrice(currentProduct.price)}
                </div>
              )} */}
              
              {/* Apple-style Pill Button - Blur backdrop */}
              <Button 
                to={currentProduct.slug.startsWith('mock') ? '/products' : `/products/${currentProduct.slug}`} 
                className="rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-black hover:border-white px-8 py-3 md:px-10 md:py-4 text-sm md:text-base tracking-wide font-medium transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
              >
                Discover
              </Button>
            </div>
         </div>

         {/* Right Side: Product Image */}
         <div className="w-full md:w-1/2 h-auto md:h-full flex items-center justify-center relative z-10 pointer-events-none pt-24 md:pt-0">
            <div 
               className={clsx(
                 "transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) transform w-full flex justify-center relative aspect-square max-h-[35vh] md:max-h-[85vh]",
                 isTransitioning ? "opacity-0 scale-90 translate-x-12 blur-sm" : "opacity-100 scale-100 translate-x-0 blur-0"
               )}
            >
               <Image 
                 src={currentProduct.images?.[0] || '/images/products/speaker-transparent.png'} 
                 alt={currentProduct.name}
                 fill
                 priority={currentIndex === 0}
                 className="object-contain drop-shadow-2xl animate-float mt-0 md:mt-0"
                 style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' }}
                 sizes="(max-width: 768px) 90vw, 40vw"
               />
            </div>
         </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-12 left-6 md:left-16 right-6 md:right-16 hidden md:flex justify-between items-end z-20">
         {/* Pagination Number */}
         <div className="text-sm font-mono tracking-widest text-zinc-400">
            {String(currentIndex + 1).padStart(2, '0')} <span className="mx-2">—</span> {String(displayProducts.length).padStart(2, '0')}
         </div>

         {/* Navigation Arrows */}
         <div className="flex gap-4">
            <button 
               onClick={handlePrev}
               className="w-12 h-12 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
               disabled={isTransitioning}
            >
               <ArrowLeft size={18} />
            </button>
            <button 
               onClick={handleNext}
               className="w-12 h-12 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
               disabled={isTransitioning}
            >
               <ArrowRight size={18} />
            </button>
         </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1.5 bg-white/10 w-full z-30">
          <div 
            key={key}
            className="h-full bg-white origin-left will-change-[width]"
            style={{ 
                animation: `progress ${AUTOPLAY_DURATION}ms linear forwards`
            }}
          />
      </div>
      <style>{`
        @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default NewLaunches;
