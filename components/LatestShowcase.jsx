"use client";

import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import LazyImage from './LazyImage';
import { useCurrency } from '@/hooks/useCurrency';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';

// Mouse-only spotlight: a soft pool of light follows the pointer across the tile, like a
// showroom spot on a shelf. Touch and keyboard users simply get the hover colour change.
const trackPointer = (e) => {
  if (e.pointerType !== 'mouse') return;
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
};

function Tile({ product, featured = false, className }) {
  const { formatPrice, showPrice } = useCurrency();
  const image = product.image_url || product.images?.[0] || null;
  const brand = product.brand || (product.category ? product.category.replace(/-/g, ' ') : 'Audio');
  const price = showPrice && product.price ? formatPrice(product.price) : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      onPointerMove={trackPointer}
      style={{ '--x': '50%', '--y': '0%' }}
      className={clsx(
        'group relative flex overflow-hidden rounded-panel bg-secondary/60 transition-colors duration-500 hover:bg-secondary',
        featured ? 'flex-col p-4 md:p-6' : 'flex-row items-center gap-4 p-4 md:gap-6 md:p-5',
        focusRing,
        className
      )}
    >
      {/* spotlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-100"
        style={{ background: 'radial-gradient(420px circle at var(--x) var(--y), rgb(255 255 255 / 0.85), transparent 70%)' }}
      />

      <div
        className={clsx(
          'relative z-10 shrink-0 overflow-hidden bg-white',
          featured ? 'flex-1 rounded-card p-6 md:p-10' : 'w-28 rounded-card p-2 sm:w-36 md:w-44 md:p-3'
        )}
      >
        <LazyImage
          src={image}
          alt={product.name}
          aspectRatio={featured ? 'aspect-[4/3] md:aspect-auto md:h-full md:min-h-[320px]' : 'aspect-square'}
          objectFit="contain"
          containerClassName="bg-transparent"
          className="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        {product.is_new_launch && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs font-medium shadow-float">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal" />
            New
          </span>
        )}
      </div>

      <div className={clsx('relative z-10 min-w-0', featured ? 'mt-5 flex items-end justify-between gap-6 px-2 pb-2 md:mt-6' : 'flex-1')}>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{brand}</p>
          <h3 className={clsx('mt-1 font-medium tracking-tight text-foreground', featured ? 'text-2xl leading-tight md:text-4xl' : 'line-clamp-2 text-lg leading-snug md:text-xl')}>
            {product.name}
          </h3>
          {featured && product.short_description && (
            <p className="mt-3 line-clamp-2 max-w-xl leading-relaxed text-muted-foreground">{product.short_description}</p>
          )}
          {price && <p className="mt-3 text-sm font-medium">{price}</p>}
        </div>

        <span
          aria-hidden="true"
          className={clsx(
            'flex shrink-0 items-center justify-center rounded-full bg-background transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground',
            featured ? 'h-12 w-12' : 'ml-auto hidden h-10 w-10 sm:flex'
          )}
        >
          <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

/**
 * "The latest": one large featured product beside up to two compact ones.
 * Falls back gracefully for 1 or 2 products.
 */
export default function LatestShowcase({ products = [] }) {
  const [first, ...rest] = products.slice(0, 3);
  if (!first) return null;

  const side = rest.slice(0, 2);
  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-12 lg:grid-rows-2">
      <Tile
        product={first}
        featured
        className={clsx('lg:row-span-2', side.length === 0 ? 'lg:col-span-12' : 'lg:col-span-7')}
      />
      {side.map((p) => (
        <Tile key={p.slug} product={p} className={clsx('lg:col-span-5', side.length === 1 && 'lg:row-span-2')} />
      ))}
    </div>
  );
}
