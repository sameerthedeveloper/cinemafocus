"use client";

import React, { useState, useEffect } from 'react';
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

  // Reset states when src changes
  useEffect(() => {
    if (!priority) {
      setIsLoaded(false);
      setHasError(false);
    }
  }, [src, priority]);

  // Handle fallback if src is missing
  const imageSrc = src || '/images/placeholder.svg';

  return (
    <div className={clsx(
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
