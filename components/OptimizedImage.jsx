"use client";

import React from 'react';
import Image from 'next/image';
import { useImageOptimizationMode } from '@/context/SiteSettingsContext';

// Hosts next.config.mjs allows the Next.js optimizer to fetch from. Anything else must be rendered
// as-is (the optimizer rejects unknown hosts with a 400).
const CDN_HOST = process.env.NEXT_PUBLIC_CDN_DOMAIN || 'd2x0o69dm3vdcd.cloudfront.net';
function canOptimize(src) {
  if (typeof src !== 'string') return false;
  if (src.startsWith('/')) return !src.startsWith('//');
  try {
    const { hostname, pathname } = new URL(src);
    if (hostname.endsWith('.supabase.co')) return pathname.startsWith('/storage/v1/object/public/');
    return hostname === CDN_HOST || hostname === 'images.unsplash.com';
  } catch {
    return false;
  }
}

/**
 * A premium, mode-aware Image component that switches behavior dynamically
 * based on the global `imageOptimizationMode` database setting.
 * 
 * Props:
 * - src: URL string of the image
 * - alt: Accessibility description
 * - width: Intended display width (px)
 * - height: Intended display height (px)
 * - priority: If true, renders as high-priority (LCP-critical) image
 * - sizes: Accurate responsive layout sizes string (prevent CLS)
 * - className: Custom styling classes
 * - fill: If true, absolute-stretches the image to fill its parent container
 * - optimize: If true, always resize/re-encode through the Next.js image optimizer (AVIF/WebP,
 *   responsive srcset) regardless of mode. Use for content images that may be uploaded at full
 *   resolution (product shots, press and project photos). Falls back to a plain <img> for hosts
 *   the optimizer cannot fetch.
 * 
 * Deliverable 5 dynamic rendering logic:
 * - 'upload' mode: priority ? <Image unoptimized> : <img loading="lazy">
 * - 'runtime' mode: <Image> everywhere
 * - 'hybrid' mode: priority ? <Image> : <img loading="lazy">
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  sizes,
  className,
  fill = false,
  optimize = false,
  style = {},
  ...props
}) {
  const { mode } = useImageOptimizationMode();

  // 1. Safe guards for SVGs and local default templates to avoid useless processing
  const isSvg = typeof src === 'string' && src.endsWith('.svg');
  const isPlaceholder = typeof src === 'string' && (src.includes('placehold.co') || src.includes('placeholder'));
  const forceUnoptimized = isSvg || isPlaceholder;

  let useNextImage = false;
  let useUnoptimized = false;

  // 2. Deliverable 5 Core Truth Table Mapping
  if (forceUnoptimized) {
    useNextImage = true;
    useUnoptimized = true;
  } else if (optimize && canOptimize(src)) {
    useNextImage = true;
    useUnoptimized = false;
  } else {
    switch (mode) {
      case 'upload':
        if (priority) {
          useNextImage = true;
          useUnoptimized = true;
        } else {
          useNextImage = false;
        }
        break;
      case 'runtime':
        useNextImage = true;
        useUnoptimized = false;
        break;
      case 'hybrid':
        if (priority) {
          useNextImage = true;
          useUnoptimized = false;
        } else {
          useNextImage = false;
        }
        break;
      default:
        // Default to safe upload-time optimized path
        if (priority) {
          useNextImage = true;
          useUnoptimized = true;
        } else {
          useNextImage = false;
        }
    }
  }

  // 3. Prevent CLS and Vercel console warnings by setting default sizes if fill is active
  const resolvedSizes = sizes || (fill ? '100vw' : undefined);

  // 4. Render standard Next.js <Image> wrapper
  if (useNextImage) {
    return (
      <Image
        src={src}
        alt={alt || 'Cinema Focus Asset'}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        unoptimized={useUnoptimized}
        sizes={resolvedSizes}
        className={className}
        style={style}
        {...props}
      />
    );
  }

  // 5. Render native, high-performance HTML5 <img>
  // Simulate Next.js "fill" behavior using absolute layouts if fill = true
  const nativeStyle = fill
    ? {
        position: 'absolute',
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        objectFit: props.objectFit || 'cover',
        ...style
      }
    : style;

  return (
    <img
      src={src}
      alt={alt || 'Cinema Focus Asset'}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? 'eager' : 'lazy'}
      sizes={resolvedSizes}
      className={className}
      style={nativeStyle}
      {...props}
    />
  );
}
