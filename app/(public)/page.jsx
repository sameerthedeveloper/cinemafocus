import React, { Suspense } from 'react';
import Link from 'next/link';
import { 
  getHero, 
  getNewLaunches 
} from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import Hero from '@/components/Hero';
import NewLaunches from '@/components/NewLaunches';
import { 
  PressSection, 
  CollectionSection, 
  FeaturedSection, 
  TrustSection, 
  GallerySection 
} from '@/components/HomeSections';

export default async function Home() {
  const supabase = await createClient();

  // ONLY fetch critical LCP data upfront to minimize server response time
  const [heroData, newLaunchesData] = await Promise.all([
    getHero(supabase),
    getNewLaunches(supabase)
  ]);

  return (
    <div className="animate-fade-in pb-20">
      {/* Critical LCP Section - Rendered immediately */}
      {newLaunchesData && newLaunchesData.length > 0 ? (
        <NewLaunches products={newLaunchesData} /> 
      ) : (
        <Hero 
          title={heroData.title === 'CINEMA FOUCS' ? 'Cinema Focus' : heroData.title}
          subtitle={heroData.subtitle || "Experience audio perfection with our curated collection."}
          ctaText={heroData.ctaText || "Discover Products"}
          ctaLink={heroData.ctaLink || "/products"}
          imageUrl={heroData.imageUrl}
        />
      )}

      {/* Deferred Sections - Streamed via Suspense */}
      <Suspense fallback={<div className="h-48 flex items-center justify-center opacity-50">Loading Press...</div>}>
        <PressSection supabase={supabase} />
      </Suspense>

      <Suspense fallback={<div className="py-24 container mx-auto px-6 h-[400px] border-t border-white/5 animate-pulse" />}>
        <CollectionSection supabase={supabase} />
      </Suspense>

      <Suspense fallback={<div className="py-24 container mx-auto px-6 h-[400px] bg-white/5 animate-pulse" />}>
        <FeaturedSection supabase={supabase} />
      </Suspense>

      <div className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 text-center md:text-left">
          <div className="space-y-4">
            <h3 className="text-2xl font-medium text-foreground">Who We Are.</h3>
            <p className="text-muted leading-relaxed text-lg font-light">
              A collective of audiophiles bridging the gap between artist and listener.
            </p>
            <Link href="/about" className="text-primary hover:underline block pt-2">Learn more ›</Link>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-medium text-foreground">What We Do.</h3>
            <p className="text-muted leading-relaxed text-lg font-light">
              We curate world-class systems. From intimate 2-channel setups to immersive home cinemas.
            </p>
            <Link href="/about" className="text-primary hover:underline block pt-2">Learn more ›</Link>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-medium text-foreground">Our Mission.</h3>
            <p className="text-muted leading-relaxed text-lg font-light">
              To reveal the soul of the music. True high-fidelity is about emotion, texture, and presence.
            </p>
            <Link href="/about" className="text-primary hover:underline block pt-2">Learn more ›</Link>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="py-24 h-48 bg-card animate-pulse" />}>
        <TrustSection supabase={supabase} />
      </Suspense>

       <Suspense fallback={<div className="py-24 container mx-auto px-6 h-[600px] animate-pulse" />}>
          <GallerySection supabase={supabase} />
       </Suspense>
    </div>
  );
}
