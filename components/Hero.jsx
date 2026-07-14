"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Button from './Button';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import gsap from 'gsap';

// Waveform Visualizer Component
const WaveformVisualizer = ({ className = '' }) => {
  const bars = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 0.08,
    randomHeight: 40 + Math.random() * 60
  }));

  return (
    <svg
      viewBox="0 0 240 80"
      className={clsx('w-24 h-12', className)}
      aria-label="Audio waveform"
    >
      {bars.map((bar) => (
        <rect
          key={bar.id}
          x={bar.id * 18 + 6}
          y="20"
          width="12"
          height="40"
          fill="currentColor"
          opacity="0.7"
          rx="2"
          className="animate-waveform-bar"
          style={{
            animationDelay: `${bar.delay}s`,
            transformOrigin: `${bar.id * 18 + 12}px 50px`
          }}
        />
      ))}
    </svg>
  );
};

const Hero = ({ 
  // New unified slides array (each slide contains all visual configurations)
  slides = [],
  
  // Single-slide legacy fallbacks for robust backwards compatibility
  title, 
  subtitle, 
  ctaText, 
  ctaLink, 
  imageUrl,
  imageUrlMobile,
  imageUrlTablet,
  imageUrlUltrawide,
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
  duration = 6,
  textColor = 'white',
  textColorCustom = '#ffffff'
}) => {

  // Normalize slides: if slides array is empty, construct it from legacy props
  const slideItems = (slides && slides.length > 0) ? slides : [{
    title,
    subtitle,
    ctaText,
    ctaLink,
    imageUrl,
    imageUrlMobile,
    imageUrlTablet,
    imageUrlUltrawide,
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
    textColor,
    textColorCustom,
    ctaVariant,
    ctaSize,
    ctaShape,
    duration
  }];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLightBackground, setIsLightBackground] = useState(false);
  const autoPlayRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

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

  // GSAP entrance animation on slide change
  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return;

    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );

    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.4 }
    );
  }, [currentIndex]);

  // Scroll indicator fade on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          opacity: scrolled ? 0 : 0.6,
          duration: 0.3
        });
      }
      setScrollProgress(Math.min(window.scrollY / window.innerHeight, 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // SMART LOGO SWITCHING: Analyze current slide's background image brightness
  useEffect(() => {
    if (!slideItems || slideItems.length === 0) return;
    
    const currentSlide = slideItems[currentIndex];
    
    // If layout doesn't have a background image, assume dark background (white logo)
    if (currentSlide.layout === 'minimal' || !currentSlide.imageUrl) {
      setIsLightBackground(false);
      window.dispatchEvent(new CustomEvent('hero-brightness', { detail: { isLight: false } }));
      return;
    }

    const checkImageBrightness = async () => {
      try {
        const img = new window.Image();
        img.crossOrigin = "Anonymous";
        img.src = currentSlide.imageUrl;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        // Analyze top 20% (where header sits)
        const sampleHeight = Math.max(1, Math.floor(canvas.height * 0.2));
        const imageData = ctx.getImageData(0, 0, canvas.width, sampleHeight);
        const data = imageData.data;
        let colorSum = 0;
        
        for (let x = 0, len = data.length; x < len; x += 4) {
          const r = data[x];
          const g = data[x + 1];
          const b = data[x + 2];
          // relative luminance
          const avg = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
          colorSum += avg;
        }
        
        const brightness = Math.floor(colorSum / (canvas.width * sampleHeight));
        // If brightness is high (e.g. > 160 out of 255), it's a light background
        const isLight = brightness > 160;
        
        setIsLightBackground(isLight);
        window.dispatchEvent(new CustomEvent('hero-brightness', { detail: { isLight } }));
      } catch (e) {
        // Fallback to dark background (white logo) on CORS or load errors
        setIsLightBackground(false);
        window.dispatchEvent(new CustomEvent('hero-brightness', { detail: { isLight: false } }));
      }
    };

    checkImageBrightness();
  }, [currentIndex, slideItems]);

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

  const getTextColor = (slide) => {
    if (isLightBackground) return '#000000'; // Override for bright backgrounds
    if (slide.textColor === 'black') return '#000000';
    if (slide.textColor === 'custom') return slide.textColorCustom || '#ffffff';
    return '#ffffff';
  };

  const getSubtitleColor = (slide) => {
    if (isLightBackground) return '#3f3f46'; // dark text (zinc-700) on bright bg
    if (slide.textColor === 'black') return '#3f3f46'; // zinc-700
    if (slide.textColor === 'custom') return slide.textColorCustom || '#ffffff'; // maybe with some opacity, but full color is safer
    return '#d4d4d8'; // zinc-300
  };

  // Build CTA button dynamic classes per slide (enhanced with glow hover)
  const getButtonClasses = (slide) => {
    const shape = slide.ctaShape === 'rounded-none' ? 'rounded-none' : slide.ctaShape === 'rounded-lg' ? 'rounded-lg' : 'rounded-full';
    const sizeClass = slide.ctaSize === 'sm' ? 'px-6 py-2 text-xs' : slide.ctaSize === 'lg' ? 'px-10 py-4 text-base' : 'px-8 py-3 text-sm';
    const hoverBase = "hover:scale-105 hover:-translate-y-1 transition-all duration-200 ease-out";

    // SMART OVERRIDE: If light background and using primary variant (default white), flip it to dark button
    if (isLightBackground && (slide.ctaVariant === 'primary' || !slide.ctaVariant)) {
      return clsx(shape, sizeClass, hoverBase, "bg-black text-white hover:bg-zinc-800 border-none font-bold shadow-lg hover:shadow-black/40");
    }

    if (slide.ctaVariant === 'secondary') {
      return clsx(shape, sizeClass, hoverBase, "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800 font-bold shadow-md hover:shadow-lg hover:shadow-zinc-700/50");
    } else if (slide.ctaVariant === 'outline') {
      // Smart override for outline button on bright bg
      if (isLightBackground) {
        return clsx(shape, sizeClass, hoverBase, "bg-transparent text-black border border-black hover:bg-black hover:text-white font-bold hover:shadow-lg hover:shadow-black/30");
      }
      return clsx(shape, sizeClass, hoverBase, "bg-transparent text-white border border-white hover:bg-white hover:text-black font-bold hover:shadow-lg hover:shadow-white/30");
    } else if (slide.ctaVariant === 'gradient') {
      return clsx(shape, sizeClass, hoverBase, "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 font-bold border-none shadow-lg hover:shadow-indigo-500/40");
    } else if (slide.ctaVariant === 'link') {
      return clsx(shape, sizeClass, hoverBase, "bg-transparent text-white hover:underline font-medium border-none p-0", isLightBackground && "text-black");
    }

    // Default / Primary: White Button (for dark background)
    return clsx(shape, sizeClass, hoverBase, "bg-white text-black hover:bg-zinc-200 border-none font-bold shadow-lg hover:shadow-white/40");
  };

  const getButtonStyle = (slide) => {
    // If we flipped primary to black because of light bg, we don't need color override
    if (isLightBackground && (slide.ctaVariant === 'primary' || !slide.ctaVariant)) return {};
    
    if (slide.ctaVariant === 'primary' || !slide.ctaVariant) {
      return { color: 'black' }; // Force black text on primary white background
    }
    return {};
  };

  const getTitleStyle = (slide) => {
    const style = { color: getTextColor(slide) };
    if (slide.titleSize) {
      style.fontSize = `clamp(24px, 5vw, ${slide.titleSize}px)`;
      style.lineHeight = '1.15';
    }
    return style;
  };

  const getSubtitleStyle = (slide) => {
    const style = { color: getSubtitleColor(slide) };
    if (slide.subtitleSize) {
      style.fontSize = `clamp(14px, 2.5vw, ${slide.subtitleSize}px)`;
      style.lineHeight = '1.4';
    }
    return style;
  };

  const renderResponsiveImages = (slide, idx, isActive, isSplit = false) => {
    if (!slide.imageUrl && !slide.imageUrlMobile && !slide.imageUrlTablet && !slide.imageUrlUltrawide) {
      return (
        <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-600">
          No Image Provided
        </div>
      );
    }

    const desktopImg = slide.imageUrl;
    const mobileImg = slide.imageUrlMobile || desktopImg;
    const tabletImg = slide.imageUrlTablet || desktopImg;
    const ultrawideImg = slide.imageUrlUltrawide || desktopImg;

    const commonProps = {
      alt: slide.title || "Cinema Focus Hero",
      fill: true,
      priority: idx === 0,
      fetchPriority: idx === 0 ? "high" : "auto",
      loading: idx === 0 ? "eager" : "lazy",
      style: { 
        objectPosition: slide.imagePosition || 'center',
        filter: `brightness(${slide.imageBrightness !== undefined ? slide.imageBrightness : 100}%) blur(${slide.imageBlur !== undefined ? slide.imageBlur : 0}px)`,
        opacity: (slide.imageOpacity !== undefined ? slide.imageOpacity : 100) / 100
      }
    };

    const getImgClass = (breakpointClass) => clsx(
      breakpointClass,
      "object-cover transition-all ease-out",
      isActive ? "scale-105 duration-[8000ms]" : "scale-100 duration-500"
    );

    const sizes = isSplit ? "(max-width: 768px) 100vw, 50vw" : "100vw";

    return (
      <>
        {/* Mobile: 0 - 768px */}
        <Image src={mobileImg} {...commonProps} className={getImgClass("block md:hidden")} sizes={sizes} />
        {/* Tablet: 768px - 1024px */}
        <Image src={tabletImg} {...commonProps} className={getImgClass("hidden md:block lg:hidden")} sizes={sizes} />
        {/* Laptop/Desktop: 1024px - 2560px */}
        <Image src={desktopImg} {...commonProps} className={getImgClass("hidden lg:block 3xl:hidden")} sizes={sizes} />
        {/* Ultrawide: 2560px+ */}
        <Image src={ultrawideImg} {...commonProps} className={getImgClass("hidden 3xl:block")} sizes={sizes} />
      </>
    );
  };

  return (
    <div 
      className="relative w-full 3xl:max-w-[2560px] mx-auto h-[100dvh] bg-zinc-950 overflow-hidden group/hero"
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
                     <h1 ref={titleRef} className={clsx("text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight leading-[1.1] drop-shadow-md", slide.textAlignment === 'right' ? 'text-right' : slide.textAlignment === 'left' ? 'text-left' : 'text-center')} style={getTitleStyle(slide)}>
                       {slide.title}
                     </h1>
                     <p ref={subtitleRef} className={clsx("text-lg md:text-xl font-light leading-relaxed drop-shadow-sm whitespace-pre-line", pAlignClass, slide.textAlignment === 'right' ? 'text-right' : slide.textAlignment === 'left' ? 'text-left' : 'text-center')} style={getSubtitleStyle(slide)}>
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
                 {renderResponsiveImages(slide, idx, isActive, true)}
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
                      <h1 ref={titleRef} className="text-4xl md:text-6xl lg:text-8xl font-medium tracking-tight leading-[1.1] drop-shadow-lg" style={getTitleStyle(slide)}>
                        {slide.title}
                      </h1>
                      <p ref={subtitleRef} className={clsx("text-xl md:text-2xl font-light max-w-2xl leading-relaxed drop-shadow-md whitespace-pre-line", pAlignClass)} style={getSubtitleStyle(slide)}>
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
              {renderResponsiveImages(slide, idx, isActive, false)}
              
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
                     <h1 ref={titleRef} className="text-4xl md:text-6xl lg:text-8xl font-medium tracking-tight leading-[1.1] drop-shadow-lg" style={getTitleStyle(slide)}>
                       {slide.title}
                     </h1>
                     <p ref={subtitleRef} className={clsx("text-xl md:text-2xl font-light max-w-2xl leading-relaxed drop-shadow-md whitespace-pre-line", pAlignClass)} style={getSubtitleStyle(slide)}>
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

      {/* 4. SCROLL INDICATOR with Chevron Pulse */}
      {/* <div
        ref={scrollIndicatorRef}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-60 transition-opacity"
      >
        <span className="text-xs font-light text-zinc-400 uppercase tracking-wider">Scroll to explore</span>
        <div className="animate-chevron-pulse text-white">
          <ChevronDown size={20} strokeWidth={1.5} />
        </div>
      </div> */}

      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes waveform-bar {
          0%, 100% {
            height: 40px;
            opacity: 0.7;
          }
          50% {
            height: 60px;
            opacity: 1;
          }
        }

        @keyframes chevron-pulse {
          0%, 100% {
            opacity: 0.6;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(4px);
          }
        }

        @keyframes button-glow {
          0% {
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          }
          100% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
          }
        }

        .animate-waveform-bar {
          animation: waveform-bar 1.25s ease-in-out infinite;
        }

        .animate-chevron-pulse {
          animation: chevron-pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;
