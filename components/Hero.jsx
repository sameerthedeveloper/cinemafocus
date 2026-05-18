"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Button from './Button';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Hero = ({ 
  // New unified slides array (each slide contains all visual configurations)
  slides = [],
  
  // Single-slide legacy fallbacks for robust backwards compatibility
  title, 
  subtitle, 
  ctaText, 
  ctaLink, 
  imageUrl,
  layout = 'full-bg',
  textAlignment = 'center',
  verticalAlignment = 'center',
  imageOpacity = 60,
  imageBlur = 0,
  imageBrightness = 100,
  imagePosition = 'center',
  overlayColor = 'black',
  overlayColorCustom = '#000000',
  overlayOpacity = 40,
  ctaVariant = 'primary',
  ctaSize = 'lg',
  ctaShape = 'rounded-full',
  duration = 6
}) => {

  // Normalize slides: if slides array is empty, construct it from legacy props
  const slideItems = (slides && slides.length > 0) ? slides : [{
    title,
    subtitle,
    ctaText,
    ctaLink,
    imageUrl,
    layout,
    textAlignment,
    verticalAlignment,
    imageOpacity,
    imageBlur,
    imageBrightness,
    imagePosition,
    overlayColor,
    overlayColorCustom,
    overlayOpacity,
    ctaVariant,
    ctaSize,
    ctaShape,
    duration
  }];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef(null);

  // Navigation handlers
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slideItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === slideItems.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (slideItems.length <= 1) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slideItems.length]);

  // Auto-play loop with dynamic per-slide durations
  useEffect(() => {
    if (slideItems.length <= 1 || isPaused) {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
      return;
    }

    const currentSlide = slideItems[currentIndex];
    const slideDuration = (currentSlide?.duration !== undefined ? currentSlide.duration : 6) * 1000;

    autoPlayRef.current = setTimeout(() => {
      handleNext();
    }, slideDuration);

    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [currentIndex, slideItems, isPaused]);

  // Alignments mapping
  const horizontalAlignClasses = {
    left: 'text-left items-start justify-start',
    center: 'text-center items-center justify-center',
    right: 'text-right items-end justify-end',
  };

  const verticalAlignClasses = {
    top: 'items-start pt-24 md:pt-36',
    center: 'items-center',
    bottom: 'items-end pb-24 md:pb-36',
  };

  const horizontalAlignItems = {
    left: 'items-start',
    center: 'items-center',
    right: 'items-end',
  };

  const paragraphAlignClasses = {
    left: 'mr-auto ml-0',
    center: 'mx-auto',
    right: 'ml-auto mr-0',
  };

  // Resolve overlay hex color per slide
  const getOverlayColor = (slide) => {
    const color = slide.overlayColor || 'black';
    if (color === 'custom' && slide.overlayColorCustom) return slide.overlayColorCustom;
    if (color === 'slate') return '#0f172a';
    if (color === 'indigo') return '#1e1b4b';
    if (color === 'rose') return '#4c0519';
    return '#000000';
  };

  // Build CTA button dynamic classes per slide
  const getButtonClasses = (slide) => {
    const shape = slide.ctaShape === 'rounded-none' ? 'rounded-none' : slide.ctaShape === 'rounded-lg' ? 'rounded-lg' : 'rounded-full';
    const sizeClass = slide.ctaSize === 'sm' ? 'px-6 py-2 text-xs' : slide.ctaSize === 'lg' ? 'px-10 py-4 text-base' : 'px-8 py-3 text-sm';
    
    if (slide.ctaVariant === 'secondary') {
      return clsx(shape, sizeClass, "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800 font-bold transition-all shadow-md");
    } else if (slide.ctaVariant === 'outline') {
      return clsx(shape, sizeClass, "bg-transparent text-white border border-white hover:bg-white hover:text-black font-bold transition-all");
    } else if (slide.ctaVariant === 'gradient') {
      return clsx(shape, sizeClass, "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 font-bold border-none transition-all shadow-lg");
    } else if (slide.ctaVariant === 'link') {
      return clsx(shape, sizeClass, "bg-transparent text-white hover:underline font-medium border-none p-0");
    }
    
    // Default / Primary: White Button
    return clsx(shape, sizeClass, "bg-white text-black hover:bg-zinc-200 border-none font-bold transition-all shadow-lg");
  };

  const getButtonStyle = (slide) => {
    if (slide.ctaVariant === 'primary' || !slide.ctaVariant) {
      return { color: 'black' }; // Force black text on primary white background
    }
    return {};
  };

  const getTitleStyle = (slide) => {
    if (!slide.titleSize) return {};
    return {
      fontSize: `clamp(24px, 5vw, ${slide.titleSize}px)`,
      lineHeight: '1.15'
    };
  };

  const getSubtitleStyle = (slide) => {
    if (!slide.subtitleSize) return {};
    return {
      fontSize: `clamp(14px, 2.5vw, ${slide.subtitleSize}px)`,
      lineHeight: '1.4'
    };
  };

  return (
    <div 
      className="relative w-full h-screen bg-zinc-950 overflow-hidden group/hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. SLIDES LOOP */}
      {slideItems.map((slide, idx) => {
        const isActive = idx === currentIndex;
        const alignClass = horizontalAlignClasses[slide.textAlignment] || horizontalAlignClasses.center;
        const verticalClass = verticalAlignClasses[slide.verticalAlignment] || verticalAlignClasses.center;
        const pAlignClass = paragraphAlignClasses[slide.textAlignment] || paragraphAlignClasses.center;
        const flexAlignItems = horizontalAlignItems[slide.textAlignment] || horizontalAlignItems.center;

        // Render Split Layout
        if (slide.layout === 'split-left' || slide.layout === 'split-right') {
          const isRightSplit = slide.layout === 'split-right' ? idx % 2 === 0 : idx % 2 === 1;
          return (
            <div 
              key={`slide-${idx}`}
              className={clsx(
                "absolute inset-0 w-full h-full flex flex-col md:grid md:grid-cols-2 bg-zinc-950 transition-all duration-1000 ease-in-out transform z-0",
                isActive ? "opacity-100 scale-100 z-10 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
              )}
            >
              {/* Text Panel */}
              <div className={clsx(
                "flex items-center px-6 py-24 md:py-0 md:px-16 lg:px-24 z-10 bg-zinc-950 border-zinc-900",
                isRightSplit ? "md:order-2 md:border-l" : "md:order-1 md:border-r"
              )}>
                {isActive && (
                  <div className={clsx("w-full max-w-xl space-y-8 animate-fade-in-up flex flex-col", flexAlignItems)}>
                     <h1 className={clsx("text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight text-white leading-[1.1] drop-shadow-md", slide.textAlignment === 'right' ? 'text-right' : slide.textAlignment === 'left' ? 'text-left' : 'text-center')} style={getTitleStyle(slide)}>
                       {slide.title}
                     </h1>
                     <p className={clsx("text-lg md:text-xl text-zinc-300 font-light leading-relaxed drop-shadow-sm", pAlignClass, slide.textAlignment === 'right' ? 'text-right' : slide.textAlignment === 'left' ? 'text-left' : 'text-center')} style={getSubtitleStyle(slide)}>
                       {slide.subtitle}
                     </p>
                     <div className="pt-4">
                       <Button 
                         to={slide.ctaLink || '/products'} 
                         className={getButtonClasses(slide)}
                         style={getButtonStyle(slide)}
                       >
                         {slide.ctaText || "Discover Products"}
                       </Button>
                     </div>
                  </div>
                )}
              </div>

              {/* Image Panel */}
              <div className={clsx(
                "relative h-[50vh] md:h-full w-full bg-zinc-900 z-0",
                isRightSplit ? "md:order-1" : "md:order-2"
              )}>
                 {slide.imageUrl ? (
                   <Image 
                     src={slide.imageUrl} 
                     alt={slide.title || "Hero Image"} 
                     fill
                     priority={idx === 0}
                     className={clsx(
                       "object-cover transition-all ease-out",
                       isActive ? "scale-105 duration-[8000ms]" : "scale-100 duration-500"
                     )}
                     style={{ 
                       objectPosition: slide.imagePosition || 'center',
                       filter: `brightness(${slide.imageBrightness !== undefined ? slide.imageBrightness : 100}%) blur(${slide.imageBlur !== undefined ? slide.imageBlur : 0}px)`,
                       opacity: (slide.imageOpacity !== undefined ? slide.imageOpacity : 100) / 100
                     }}
                     sizes="(max-width: 768px) 100vw, 50vw"
                   />
                 ) : (
                   <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-600">
                     No Image Provided
                   </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent md:bg-gradient-to-r md:from-zinc-950/20 md:to-transparent pointer-events-none" />
              </div>
            </div>
          );
        }

        // Render Minimal Gradient Layout
        if (slide.layout === 'minimal') {
          return (
            <div 
              key={`slide-${idx}`}
              className={clsx(
                "absolute inset-0 w-full h-full flex items-center bg-zinc-950 transition-all duration-1000 ease-in-out transform z-0",
                isActive ? "opacity-100 scale-100 z-10 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
              )}
            >
              {/* Dynamic Glow Backgrounds */}
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[130px]" />
                <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px]" />
              </div>

              {/* Content */}
              <div className="container px-6 relative z-10 mx-auto">
                <div className={`flex flex-col ${alignClass}`}>
                  {isActive && (
                    <div className={`max-w-4xl space-y-8 animate-fade-in-up flex flex-col ${alignClass}`}>
                      <h1 className="text-4xl md:text-6xl lg:text-8xl font-medium tracking-tight text-white leading-[1.1] drop-shadow-lg" style={getTitleStyle(slide)}>
                        {slide.title}
                      </h1>
                      <p className={clsx("text-xl md:text-2xl text-zinc-300 font-light max-w-2xl leading-relaxed drop-shadow-md", pAlignClass)} style={getSubtitleStyle(slide)}>
                        {slide.subtitle}
                      </p>
                      <div className="pt-8">
                        <Button 
                          to={slide.ctaLink || '/products'} 
                          className={getButtonClasses(slide)}
                          style={getButtonStyle(slide)}
                        >
                          {slide.ctaText || "Discover Products"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }

        // Default Full Background Layout
        return (
          <div 
            key={`slide-${idx}`}
            className={clsx(
              "absolute inset-0 w-full h-full flex transition-all duration-1000 ease-in-out transform z-0 bg-zinc-950",
              verticalClass,
              isActive ? "opacity-100 scale-100 z-10 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
            )}
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              {slide.imageUrl ? (
                <Image 
                  src={slide.imageUrl} 
                  alt={slide.title || "Cinema Focus Hero"} 
                  fill
                  priority={idx === 0}
                  className={clsx(
                    "object-cover transition-all ease-out",
                    isActive ? "scale-105 duration-[8000ms]" : "scale-100 duration-500"
                  )}
                  style={{ 
                    objectPosition: slide.imagePosition || 'center',
                    filter: `brightness(${slide.imageBrightness !== undefined ? slide.imageBrightness : 100}%) blur(${slide.imageBlur !== undefined ? slide.imageBlur : 0}px)`,
                    opacity: (slide.imageOpacity !== undefined ? slide.imageOpacity : 60) / 100
                  }}
                  sizes="100vw"
                />
              ) : (
                <div className="w-full h-full bg-zinc-900" />
              )}
              
              {/* Overlay */}
              <div 
                className="absolute inset-0 transition-all duration-300"
                style={{ 
                  backgroundColor: getOverlayColor(slide),
                  opacity: (slide.overlayOpacity !== undefined ? slide.overlayOpacity : 40) / 100
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-95 pointer-events-none" />
            </div>

            {/* Content */}
            <div className="container px-6 relative z-10 mx-auto">
               <div className={`flex flex-col ${alignClass}`}>
                 {isActive && (
                   <div className={`max-w-4xl space-y-8 animate-fade-in-up flex flex-col ${alignClass}`}>
                     <h1 className="text-4xl md:text-6xl lg:text-8xl font-medium tracking-tight text-white leading-[1.1] drop-shadow-lg" style={getTitleStyle(slide)}>
                       {slide.title}
                     </h1>
                     <p className={clsx("text-xl md:text-2xl text-zinc-300 font-light max-w-2xl leading-relaxed drop-shadow-md", pAlignClass)} style={getSubtitleStyle(slide)}>
                       {slide.subtitle}
                     </p>
                     <div className="pt-8">
                       <Button 
                         to={slide.ctaLink || '/products'} 
                         className={getButtonClasses(slide)}
                         style={getButtonStyle(slide)}
                       >
                         {slide.ctaText || "Discover Products"}
                       </Button>
                     </div>
                   </div>
                 )}
               </div>
            </div>
          </div>
        );
      })}

      {/* 2. NAVIGATION ARROWS (Only show if multiple slides exist) */}
      {slideItems.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/30 backdrop-blur-md border border-white/10 hover:border-white/30 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover/hero:opacity-100 hover:bg-black/60 shadow-lg cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/30 backdrop-blur-md border border-white/10 hover:border-white/30 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover/hero:opacity-100 hover:bg-black/60 shadow-lg cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* 3. PAGINATION DOTS (Only show if multiple slides exist) */}
      {slideItems.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {slideItems.map((_, idx) => (
            <button 
              key={`dot-${idx}`}
              onClick={() => handleDotClick(idx)}
              className={clsx(
                "h-1.5 transition-all duration-300 rounded-full cursor-pointer",
                idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero;
