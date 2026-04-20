"use client";

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

/**
 * A highly optimized Image component that handles:
 * - Lazy loading via native browser support
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
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(priority); // Assume loaded if priority to skip flicker
  const [hasError, setHasError] = useState(false);

  // Reset states when src changes
  useEffect(() => {
    if (!priority) {
      setIsLoaded(false);
      setHasError(false);
    }
  }, [src, priority]);

  return (
    <div className={clsx(
      "relative overflow-hidden bg-secondary/20", 
      aspectRatio,
      containerClassName
    )}>
      {/* Skeleton Loader - Skip if priority */}
      {!priority && showSkeleton && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-secondary/40 animate-pulse z-10" />
      )}

      {/* Actual Image */}
      <img
        src={hasError ? '/images/placeholder.png' : src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading={priority ? "eager" : loading}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : undefined}
        className={clsx(
          "w-full h-full",
          !priority && "transition-all duration-700 ease-out",
          objectFit === "contain" ? "object-contain" : "object-cover",
          priority ? "opacity-100 scale-100" : (isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"),
          className
        )}
        {...props}
      />

      {/* Error Fallback Overlay (Optional) */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/20 text-muted-foreground text-xs text-center p-2">
          Image unavailable
        </div>
      )}
    </div>
  );
};

export default LazyImage;
