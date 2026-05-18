import React, { Suspense } from 'react';
import Link from 'next/link';
import { 
  getHero, 
  getNewLaunches 
} from '@/lib/cms';
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
import JsonLd from '@/components/JsonLd';

export default async function Home() {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Cinema Focus",
    "image": "https://www.cinemafocus.in/logo.svg",
    "description": "Cinema Focus delivers reference-class Home Cinema & Hi-Fi audio systems in Chennai, India.",
    "@id": "https://www.cinemafocus.in/#localbusiness",
    "url": "https://www.cinemafocus.in",
    "telephone": "+919841035821",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "New Decor Towers, 71 Dr. Radhakrishnan Salai, Mylapore",
      "addressLocality": "Chennai",
      "postalCode": "600004",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 13.0401,
      "longitude": 80.2662
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    }
  };

  // ONLY fetch critical LCP data upfront to minimize server response time
  const [heroData, newLaunchesData] = await Promise.all([
    getHero(),
    getNewLaunches()
  ]);

  // Normalize heroData to always contain a slides array
  const normalizedHero = heroData?.slides && Array.isArray(heroData.slides)
    ? heroData
    : {
        slides: [{
          title: heroData?.title === 'CINEMA FOUCS' ? 'Cinema Focus' : (heroData?.title || 'Cinema Focus'),
          subtitle: heroData?.subtitle || "Experience audio perfection with our curated collection.",
          ctaText: heroData?.ctaText || "Discover Products",
          ctaLink: heroData?.ctaLink || "/products",
          imageUrl: heroData?.imageUrl,
          layout: heroData?.layout || 'full-bg',
          textAlignment: heroData?.textAlignment || 'center',
          verticalAlignment: heroData?.verticalAlignment || 'center',
          imageOpacity: heroData?.imageOpacity !== undefined ? heroData.imageOpacity : 60,
          imageBlur: heroData?.imageBlur !== undefined ? heroData.imageBlur : 0,
          imageBrightness: heroData?.imageBrightness !== undefined ? heroData.imageBrightness : 100,
          imagePosition: heroData?.imagePosition || 'center',
          overlayColor: heroData?.overlayColor || 'black',
          overlayColorCustom: heroData?.overlayColorCustom || '#000000',
          overlayOpacity: heroData?.overlayOpacity !== undefined ? heroData.overlayOpacity : 40,
          ctaVariant: heroData?.ctaVariant || 'primary',
          ctaSize: heroData?.ctaSize || 'lg',
          ctaShape: heroData?.ctaShape || 'rounded-full',
          duration: heroData?.duration !== undefined ? heroData.duration : 6
        }]
      };

  return (
    <div className="pb-20">
      <JsonLd data={businessSchema} />
      {/* Critical LCP Section - Rendered immediately without animation to minimize LCP delay */}
      {newLaunchesData && newLaunchesData.length > 0 ? (
        <NewLaunches products={newLaunchesData} /> 
      ) : (
        <Hero 
          {...normalizedHero}
        />
      )}

      {/* Deferred Sections - Animations start here to preserve visual experience below the fold */}
      <div className="animate-fade-in">
        <Suspense fallback={
          <div className="py-24 container mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <div className="space-y-4">
                <div className="h-4 w-32 bg-white/10 animate-pulse rounded" />
                <div className="h-10 w-48 bg-white/10 animate-pulse rounded" />
              </div>
              <div className="h-6 w-24 bg-white/10 animate-pulse rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="aspect-video bg-white/5 animate-pulse rounded-2xl" />)}
            </div>
          </div>
        }>
          <PressSection />
        </Suspense>

        <Suspense fallback={
          <div className="py-24 container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <div className="h-12 w-64 bg-white/10 animate-pulse rounded mx-auto" />
              <div className="h-6 w-96 bg-white/10 animate-pulse rounded mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse rounded-2xl" />)}
            </div>
          </div>
        }>
          <CollectionSection />
        </Suspense>

        <Suspense fallback={
          <div className="py-24 container mx-auto px-6">
            <div className="flex justify-between items-end mb-16">
              <div className="h-12 w-48 bg-white/10 animate-pulse rounded" />
              <div className="h-6 w-32 bg-white/10 animate-pulse rounded" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="space-y-4">
                <div className="aspect-square bg-white/5 animate-pulse rounded-2xl" />
                <div className="h-6 w-3/4 bg-white/10 animate-pulse rounded mx-auto" />
                <div className="h-4 w-1/2 bg-white/10 animate-pulse rounded mx-auto" />
              </div>)}
            </div>
          </div>
        }>
          <FeaturedSection />
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

        <Suspense fallback={
          <div className="py-24 bg-card">
            <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
              {[1, 2, 3, 4].map(i => <div key={i} className="space-y-4 flex flex-col items-center">
                <div className="h-12 w-12 bg-white/10 animate-pulse rounded-full" />
                <div className="h-4 w-24 bg-white/10 animate-pulse rounded" />
              </div>)}
            </div>
          </div>
        }>
          <TrustSection />
        </Suspense>

        <Suspense fallback={
          <div className="py-24 container mx-auto px-6">
            <div className="mb-16 text-center space-y-4">
              <div className="h-12 w-48 bg-white/10 animate-pulse rounded mx-auto" />
              <div className="h-6 w-32 bg-white/10 animate-pulse rounded mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="aspect-video bg-white/5 animate-pulse rounded-2xl" />)}
            </div>
          </div>
        }>
          <GallerySection />
        </Suspense>
      </div>
    </div>
  );
}
