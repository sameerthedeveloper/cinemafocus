"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Expand, ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';
import Button from '@/components/Button';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';

// Every sixth photo is featured (2x2) from `lg` up, so the grid has a rhythm instead of
// a wall of identical tiles. Rows have a fixed height, so mixed sizes still tile cleanly.
const isFeatured = (idx) => idx % 6 === 0;

export default function GalleryClient({ projects }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const touchStartX = useRef(null);
  const closeRef = useRef(null);
  const openerRef = useRef(null);
  const count = projects.length;

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    openerRef.current?.focus();
  }, []);
  const nextImage = useCallback(() => setLightboxIndex((i) => (i === null ? i : (i + 1) % count)), [count]);
  const prevImage = useCallback(() => setLightboxIndex((i) => (i === null ? i : (i - 1 + count) % count)), [count]);

  const openLightbox = (idx, e) => {
    openerRef.current = e.currentTarget;
    setLightboxIndex(idx);
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const distance = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;
    if (distance > 50) nextImage();
    else if (distance < -50) prevImage();
  };

  const isOpen = lightboxIndex !== null;
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, closeLightbox, nextImage, prevImage]);

  const current = isOpen ? projects[lightboxIndex] : null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 md:px-8 md:pb-24 md:pt-40">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-medium tracking-tight md:text-5xl">Gallery</h1>
        <p className="mt-3 text-lg text-muted-foreground md:text-xl">
          Moments from Cinema Focus. Select a photo to view it full size.
        </p>
        {count > 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            {count} {count === 1 ? 'photo' : 'photos'}
          </p>
        )}
      </header>

      <div className="mt-10 md:mt-14">
        {count > 0 ? (
          <ul className="grid auto-rows-[240px] grid-cols-1 gap-3 sm:auto-rows-[260px] sm:grid-cols-2 md:gap-4 lg:auto-rows-[300px] lg:grid-cols-3 lg:gap-6">
            {projects.map((item, idx) => (
              <li key={item.id || idx} className={isFeatured(idx) ? 'lg:col-span-2 lg:row-span-2' : undefined}>
                <button
                  type="button"
                  onClick={(e) => openLightbox(idx, e)}
                  aria-label={`View photo: ${item.title || 'Cinema Focus photo'}`}
                  className={`group relative block h-full w-full overflow-hidden rounded-card bg-secondary/40 text-left ${focusRing}`}
                >
                  <OptimizedImage
                    src={item.imageUrl}
                    alt={item.title || 'Cinema Focus photo'}
                    fill
                    optimize
                    sizes={isFeatured(idx) ? '(min-width: 1024px) 66vw, (min-width: 640px) 50vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    style={{ objectPosition: item.imagePosition || item.image_position || 'center' }}
                  />

                  {item.title && (
                    <span className="absolute bottom-4 left-4 right-16 line-clamp-1 w-fit max-w-[calc(100%-5rem)] rounded-full bg-background px-4 py-2 text-sm font-medium shadow-float">
                      {item.title}
                    </span>
                  )}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-float transition-transform duration-300 group-hover:scale-110"
                  >
                    <Expand className="h-4 w-4" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-panel bg-secondary/40 px-6 py-20 text-center md:py-28">
            <h2 className="text-xl font-medium md:text-2xl">New photos are on the way</h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              We add photos here as we go. Meanwhile, explore the systems we stock.
            </p>
            <Button href="/products" icon className="mt-8 rounded-full normal-case! tracking-tight!">
              Browse products
            </Button>
          </div>
        )}
      </div>

      {current &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={current.title || 'Gallery photo'}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
            onClick={closeLightbox}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={closeLightbox}
              aria-label="Close photo"
              className={`absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-6 md:top-6 ${focusRing} focus-visible:ring-offset-black`}
            >
              <X className="h-5 w-5" />
            </button>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  aria-label="Previous photo"
                  className={`absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:left-6 md:flex ${focusRing} focus-visible:ring-offset-black`}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  aria-label="Next photo"
                  className={`absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-6 md:flex ${focusRing} focus-visible:ring-offset-black`}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <figure className="flex max-h-full w-full max-w-6xl flex-col items-center px-4 py-16 md:px-20" onClick={(e) => e.stopPropagation()}>
              <img
                src={current.imageUrl}
                alt={current.title || 'Cinema Focus photo'}
                className="max-h-[75vh] max-w-full rounded-media object-contain"
              />
              <figcaption className="mt-5 text-center">
                {current.title && <p className="text-lg font-medium text-white md:text-xl">{current.title}</p>}
                <p className="mt-1 text-sm text-white/70" aria-live="polite">
                  Photo {lightboxIndex + 1} of {count}
                </p>
              </figcaption>
            </figure>
          </div>,
          document.body
        )}
    </div>
  );
}
