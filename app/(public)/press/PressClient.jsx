"use client";

import React from 'react';
import Section from '@/components/Section';
import PressReleaseCard from '@/components/PressReleaseCard';

export default function PressClient({ initialReleases = [] }) {
  if (!initialReleases || initialReleases.length === 0) {
    return (
      <Section className="pt-24 pb-20">
        <div className="mb-16 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight">Press Room.</h1>
          <p className="text-xl text-muted font-light max-w-2xl mx-auto">
            Latest news, announcements, and stories from our world.
          </p>
        </div>
        <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
          <p className="text-zinc-500 font-medium">No press releases found at the moment.</p>
        </div>
      </Section>
    );
  }

  const featuredRelease = initialReleases[0];
  const otherReleases = initialReleases.slice(1);

  return (
    <div className="animate-fade-in pt-24 pb-20">
      <Section>
        <div className="mb-16 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight">Press Room.</h1>
          <p className="text-xl text-muted font-light max-w-2xl mx-auto">
            Latest news, announcements, and stories from our world.
          </p>
        </div>
        
        {/* Featured Release */}
        {featuredRelease && (
          <div className="mb-16">
            <PressReleaseCard release={featuredRelease} variant="horizontal" />
          </div>
        )}

        {/* Grid for Other Releases */}
        {otherReleases.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherReleases.map((release) => (
              <PressReleaseCard key={release.id} release={release} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
