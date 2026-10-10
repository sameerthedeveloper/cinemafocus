"use client";

import React, { useState, useEffect, useRef } from 'react';
import OptimizedImage from './OptimizedImage';
import clsx from 'clsx';

/**
 * A highly optimized Image component that handles:
 * - Lazy loading via next/image
 * - Smooth fade-in transition once loaded
 * - Skeleton loader (pulse effect) while fetching
 * - Graceful error handling with fallback
 */
const LazyImage = ({ 
  src, 
  alt, 
  className, 
  containerClassName, 
  showSkeleton = true,
  aspectRatio = "aspect-square",
  objectFit = "cover",
  loading = "lazy",
  priority = false,
  sizes,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(priority);
  const [hasError, setHasError] = useState(false);

  // Reset states when src changes (not on first mount: the server-rendered <img> may
  // already have finished loading before hydration, and its load event is then never replayed)
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (!priority) {
      setIsLoaded(false);
      setHasError(false);
    }
  }, [src, priority]);

  // Pick up an image that finished loading before React attached onLoad
  const markIfAlreadyLoaded = (el) => {
    const img = el?.querySelector('img');
    if (img && img.complete && img.naturalWidth > 0) setIsLoaded(true);
  };

  // Handle fallback if src is missing
  const imageSrc = src || '/images/placeholder.svg';

  return (
    <div ref={markIfAlreadyLoaded} className={clsx(
      "relative overflow-hidden bg-secondary/20", 
      aspectRatio,
      containerClassName
    )}>
      {/* Skeleton Loader - Skip if priority or already loaded */}
      {!priority && showSkeleton && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-secondary/40 animate-pulse z-10" />
      )}

      {/* Optimized custom OptimizedImage */}
      <OptimizedImage
        src={hasError ? '/images/placeholder.svg' : imageSrc}
        alt={alt || "Cinema Focus Asset"}
        fill
        priority={priority}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        className={clsx(
          "transition-all duration-700 ease-out",
          objectFit === "contain" ? "object-contain" : "object-cover",
          priority || isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
          className
        )}
        {...props}
      />

      {/* Error Fallback Overlay */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/20 text-muted-foreground text-xs text-center p-2">
          Image unavailable
        </div>
      )}
    </div>
  );
};

export default LazyImage;
