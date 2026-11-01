"use client";

import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { ChevronRight, ChevronLeft, FileText, Link2, Check } from 'lucide-react';
import ContentRenderer from '@/components/ContentRenderer';
import OptimizedImage from '@/components/OptimizedImage';
import { formatDate } from '@/lib/utils';
import { CINEMA_FOCUS_GEO } from '@/lib/geoContext';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const pill =
  'inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-medium tracking-tight transition-colors';

export default function PressDetailClient({ release }) {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const covers = release.coverImages?.length ? release.coverImages : [release.imageUrl].filter(Boolean);
  const hasMany = covers.length > 1;
  const go = (delta) => setIndex((i) => (i + delta + covers.length) % covers.length);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: release.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user dismissed the share sheet, or clipboard is blocked */
    }
  };

  const hasBody = (release.contentBlocks && release.contentBlocks.length > 0) || release.content;

  return (
    <article className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 md:px-8 md:pb-24 md:pt-40">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground md:mb-8">
        <Link href="/press" className="transition-colors hover:text-foreground">Press room</Link>
        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
        <span className="line-clamp-1 text-foreground" aria-current="page">{release.title}</span>
      </nav>

      <header className="max-w-3xl">
        <p className="text-sm text-muted-foreground">
          <time dateTime={release.date}>{formatDate(release.date)}</time>
          <span aria-hidden="true"> · </span>
          Press release
        </p>
        <h1 className="mt-3 text-4xl font-medium leading-[1.1] tracking-tight text-balance md:text-5xl">{release.title}</h1>
        {release.excerpt && <p className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl">{release.excerpt}</p>}
      </header>

      {covers.length > 0 && (
        <div className="group relative mt-10 aspect-[16/10] w-full overflow-hidden rounded-panel bg-secondary/40 md:mt-14 md:aspect-[16/9]">
          <OptimizedImage
            key={index}
            src={covers[index]}
            alt={release.title}
            fill
            optimize
            priority={index === 0}
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="object-cover"
          />
          {hasMany && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous image"
                className={clsx('absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-float transition-opacity md:left-4 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100', focusRing)}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next image"
                className={clsx('absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-float transition-opacity md:right-4 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100', focusRing)}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <p className="absolute bottom-3 left-3 rounded-full bg-background px-3 py-1 text-xs font-medium shadow-float md:bottom-4 md:left-4" aria-live="polite">
                {index + 1} / {covers.length}
              </p>
            </>
          )}
        </div>
      )}

      {hasBody && (
        <div className="mt-10 max-w-3xl md:mt-14">
          {release.contentBlocks && release.contentBlocks.length > 0 ? (
            <ContentRenderer blocks={release.contentBlocks} />
          ) : (
            <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground md:text-lg">{release.content}</p>
          )}
        </div>
      )}

      <div className="mt-12 flex max-w-3xl flex-wrap gap-3">
        {release.pdfUrl && (
          <a
            href={release.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(pill, 'bg-primary text-primary-foreground hover:bg-primary/90', focusRing)}
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Download PDF
          </a>
        )}
        <button type="button" onClick={share} className={clsx(pill, 'bg-secondary hover:bg-accent', focusRing)}>
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
          <span aria-live="polite">{copied ? 'Link copied' : 'Share'}</span>
        </button>
      </div>

      <footer className="mt-16 grid max-w-3xl gap-8 border-t border-border pt-8 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-medium">Press enquiries</h2>
          <a href={`mailto:${CINEMA_FOCUS_GEO.email}`} className="mt-1 block text-muted-foreground transition-colors hover:text-foreground">
            {CINEMA_FOCUS_GEO.email}
          </a>
        </div>
        <div className="sm:text-right">
          <Link href="/press" className="text-sm font-medium underline-offset-4 hover:underline">
            All press releases
          </Link>
        </div>
      </footer>
    </article>
  );
}
