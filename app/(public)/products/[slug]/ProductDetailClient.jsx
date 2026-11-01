"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import Button from '@/components/Button';
import { useCurrency } from '@/hooks/useCurrency';
import { ChevronRight, ChevronLeft, FileText } from 'lucide-react';
import LazyImage from '@/components/LazyImage';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const action = 'h-12 w-full rounded-full px-7 normal-case! tracking-tight! sm:w-auto';

export default function ProductDetailClient({ product }) {
  const { formatPrice, showPrice } = useCurrency();
  // Default to the most recently added image (last in the array) so a
  // newly uploaded image shows as the primary photo without requiring
  // the old one to be removed first.
  const [activeIndex, setActiveIndex] = useState(() =>
    product?.images?.length ? product.images.length - 1 : 0
  );

  // Reset to the newest image whenever we're showing a different product
  // (e.g. client-side navigation between product pages).
  const productKey = `${product?.id ?? ''}|${product?.slug ?? ''}`;
  const [seenProductKey, setSeenProductKey] = useState(productKey);
  if (seenProductKey !== productKey) {
    setSeenProductKey(productKey);
    setActiveIndex(product?.images?.length ? product.images.length - 1 : 0);
  }

  // Preload all gallery images in background so switching is instant
  useEffect(() => {
    if (product?.images?.length > 1) {
      product.images.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    }
  }, [product]);

  if (!product) return null;

  const images = product.images || [];
  const hasMany = images.length > 1;
  const go = (delta) => setActiveIndex((i) => (i + delta + images.length) % images.length);
  const brandLabel = product.brand || product.category?.replace(/-/g, ' ');
  const specs = product.specifications || [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 md:px-8 md:pb-24 md:pt-40">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground md:mb-8">
        <Link href="/products" className="transition-colors hover:text-foreground">Products</Link>
        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
        {product.category && (
          <>
            <Link href={`/brand/${product.category}`} className={clsx('transition-colors hover:text-foreground', !product.brand && 'capitalize')}>
              {brandLabel}
            </Link>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
          </>
        )}
        <span className="text-foreground" aria-current="page">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
        {/* Gallery */}
        <div className="h-fit space-y-4 lg:sticky lg:top-32">
          <div className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-card bg-white p-6 ring-1 ring-border/70 md:aspect-[4/3] md:p-8">
            <LazyImage
              key={activeIndex}
              src={images[activeIndex]}
              alt={product.name}
              aspectRatio="w-full h-full"
              objectFit="contain"
              priority={true}
            />

            {hasMany && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous image"
                  className={clsx(
                    'absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-float transition-opacity duration-300 md:left-4',
                    'md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100',
                    focusRing
                  )}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next image"
                  className={clsx(
                    'absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-float transition-opacity duration-300 md:right-4',
                    'md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100',
                    focusRing
                  )}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <p className="absolute bottom-3 left-3 z-20 rounded-full bg-background px-3 py-1 text-xs font-medium shadow-float md:bottom-4 md:left-4" aria-live="polite">
                  {activeIndex + 1} / {images.length}
                </p>
              </>
            )}
          </div>

          {hasMany && (
            <ul className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:gap-3">
              {images.map((img, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Show image ${idx + 1} of ${images.length}`}
                    aria-current={idx === activeIndex ? 'true' : undefined}
                    className={clsx(
                      'flex aspect-square w-full items-center justify-center overflow-hidden rounded-media bg-white p-1 ring-1 transition-all duration-300',
                      idx === activeIndex ? 'opacity-100 ring-2 ring-primary' : 'opacity-60 ring-border/70 hover:opacity-100',
                      focusRing
                    )}
                  >
                    <LazyImage
                      src={img}
                      alt=""
                      objectFit="contain"
                      aspectRatio="w-full h-full"
                      containerClassName="bg-transparent"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Details */}
        <div className="space-y-8 md:space-y-10 lg:py-2">
          <div>
            {brandLabel &&
              (product.category ? (
                <Link href={`/brand/${product.category}`} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  {brandLabel}
                </Link>
              ) : (
                <p className="text-sm font-medium text-muted-foreground">{brandLabel}</p>
              ))}
            <h1 className="mt-2 text-4xl font-medium leading-[1.1] tracking-tight text-balance md:text-5xl">{product.name}</h1>
            {showPrice && product.price && (
              <p className="mt-5 text-2xl font-medium">{formatPrice(product.price)}</p>
            )}
          </div>

          {product.longDescription && (
            <p className="max-w-[62ch] whitespace-pre-line text-base leading-relaxed text-muted-foreground md:text-lg">
              {product.longDescription}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/contact" className={action}>Enquire about this product</Button>
            <Button href="/location" variant="outline" className={action}>Visit showroom</Button>
            {product.catalogUrl && (
              <Button
                href={product.catalogUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                className={clsx(action, 'gap-2')}
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                Download catalogue
              </Button>
            )}
          </div>

          {/* Specs */}
          {specs.length > 0 && (
            <section className="border-t border-border pt-8">
              <h2 className="mb-4 text-xl font-medium md:text-2xl">Specifications</h2>
              <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
                {specs.map((spec, idx) => (
                  <div key={idx} className="border-b border-border py-4">
                    <dt className="mb-1 text-sm text-muted-foreground">{spec.key === 'Category' ? 'Brand category' : spec.key}</dt>
                    <dd className="text-base font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
