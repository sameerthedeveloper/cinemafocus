"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';

/**
 * Store hero: the Cinema Focus "product stage". Big headline on a studio-white (or dark) stage,
 * the product photo sitting on the bottom edge, two pill buttons, a slide timer along the bottom.
 *
 * Needs the tokens from docs/design/design.md plus these three CSS rules in globals.css:
 *
 *   @keyframes hero-intro { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
 *   .hero-intro { animation: hero-intro 0.7s cubic-bezier(0.215, 0.61, 0.355, 1) 0.05s backwards; }
 *   @keyframes hero-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
 *   @media (prefers-reduced-motion: reduce) { .hero-intro { animation: none; } .hero-progress-fill { animation: none !important; transform: scaleX(1) !important; } }
 *
 * Product photos on a white background look best, because the hero blends them into the stage.
 *
 *   <StoreHero slides={slides} />
 */
const SLIDES = [
  {
    id: 'a17',
    tone: 'light', // 'light' = white stage, 'dark' = black stage
    title: 'A new set of members in our family.',
    subtitle: 'Headphone amps, DACs and streamers, now in stock.',
    image: '/images/hero/product.webp', // product photo, ideally 2400px wide on white
    imageAlt: 'Headphone amplifier',
    cta: { text: 'Shop now', href: '/shop' },
    cta2: { text: 'See what is new', href: '/shop?sort=new' },
    info: 'Free delivery across India on orders above ₹10,000',
  },
];

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export default function StoreHero({ slides = SLIDES, interval = 6500, autoplay = true }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const slide = slides[index];
  const dark = slide.tone === 'dark';

  const go = useCallback((i) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (!autoplay || paused || count < 2) return;
    const id = setTimeout(() => go(index + 1), interval);
    return () => clearTimeout(id);
  }, [index, autoplay, paused, count, interval, go]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={clsx('relative flex min-h-[640px] w-full flex-col overflow-hidden transition-colors duration-500 h-svh max-h-[920px]', dark ? 'bg-stage text-white' : 'bg-background text-foreground')}
    >
      {/* Text. key= restarts the entrance animation for each slide. */}
      <div key={slide.id} className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 pt-32 text-center sm:pt-36 md:px-8 md:pt-40">
        <h1 className="hero-intro text-balance text-5xl font-medium leading-[1.02] tracking-[-0.035em] sm:text-6xl md:text-7xl lg:text-8xl">
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p className={clsx('hero-intro mt-5 max-w-xl text-lg md:text-xl', dark ? 'text-white/70' : 'text-muted-foreground')} style={{ animationDelay: '0.15s' }}>
            {slide.subtitle}
          </p>
        )}
        <div className="hero-intro mt-8 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: '0.25s' }}>
          {slide.cta && (
            <Link
              href={slide.cta.href}
              className={clsx('group inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-medium tracking-tight transition-colors', focusRing, dark ? 'bg-white text-black hover:bg-white/90' : 'bg-primary text-primary-foreground hover:bg-primary/90')}
            >
              {slide.cta.text}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          )}
          {slide.cta2 && (
            <Link
              href={slide.cta2.href}
              className={clsx('inline-flex h-12 items-center rounded-full px-7 text-sm font-medium tracking-tight transition-colors', focusRing, dark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-secondary text-foreground hover:bg-accent')}
            >
              {slide.cta2.text}
            </Link>
          )}
        </div>
      </div>

      {/* Product on the bottom edge. Multiply blend drops the white photo background on a white stage. */}
      {slide.image && (
        <div key={`img-${slide.id}`} className={clsx('hero-intro absolute inset-x-0 bottom-0 z-0 mx-auto h-[56%] w-[min(94vw,1180px)] md:h-[62%]', !dark && 'mix-blend-multiply')} style={{ animationDelay: '0.2s' }}>
          <Image src={slide.image} alt={slide.imageAlt || ''} fill priority={index === 0} sizes="(max-width: 1180px) 94vw, 1180px" className="object-contain object-bottom" />
        </div>
      )}

      {/* Bottom bar: info line + slide timer */}
      <div className="absolute inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 pb-5 md:px-8 md:pb-7">
        <p className={clsx('hidden text-sm sm:block', dark ? 'text-white/70' : 'text-muted-foreground')}>{slide.info}</p>
        {count > 1 && (
          <div role="group" aria-label="Choose slide" className="ml-auto flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Slide ${i + 1} of ${count}`}
                aria-current={i === index ? 'true' : undefined}
                className={clsx('relative h-6 w-10 rounded-full', focusRing)}
              >
                <span className={clsx('absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full', dark ? 'bg-white/25' : 'bg-black/15')}>
                  <span
                    key={i === index ? `${index}-${paused}` : 'idle'}
                    className="hero-progress-fill absolute inset-0 origin-left rounded-full bg-current"
                    style={
                      i < index
                        ? { transform: 'scaleX(1)' }
                        : i === index
                          ? { animation: autoplay ? `hero-progress ${interval}ms linear forwards` : undefined, animationPlayState: paused ? 'paused' : 'running', transform: autoplay ? undefined : 'scaleX(1)' }
                          : { transform: 'scaleX(0)' }
                    }
                  />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
