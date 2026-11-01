"use client";

import React from 'react';
import Link from 'next/link';
import PressReleaseCard from '@/components/PressReleaseCard';

export default function PressClient({ initialReleases = [] }) {
  const releases = initialReleases || [];
  const [featured, ...others] = releases;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 md:px-8 md:pb-24 md:pt-40">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-medium tracking-tight md:text-5xl">Press room</h1>
        <p className="mt-3 text-lg text-muted-foreground md:text-xl">
          News, launches and announcements from Cinema Focus.
        </p>
      </header>

      {featured ? (
        <>
          <div className="mt-10 md:mt-14">
            <PressReleaseCard release={featured} variant="horizontal" headingLevel="h2" />
          </div>

          {others.length > 0 && (
            <section aria-label="More stories" className="mt-16 border-t border-border pt-12 md:mt-24 md:pt-16">
              <ul className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {others.map((release) => (
                  <li key={release.id || release.slug}>
                    <PressReleaseCard release={release} headingLevel="h2" />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      ) : (
        <div className="mt-10 rounded-panel bg-secondary/40 px-6 py-20 text-center md:mt-14 md:py-28">
          <h2 className="text-xl font-medium md:text-2xl">No press releases yet</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Announcements will appear here as soon as they are published. Meanwhile, see what is new in the showroom.
          </p>
          <Link
            href="/products?category=new-arrivals"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-primary px-7 text-sm font-medium tracking-tight text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            See new launches
          </Link>
        </div>
      )}
    </div>
  );
}
