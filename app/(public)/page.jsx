import React, { Suspense } from 'react';
import { getHero, getSeo } from '@/lib/cms';
import Hero from '@/components/Hero';
import { 
  PressSection, 
  CollectionSection, 
  FeaturedSection, 
  TrustSection, 
  GallerySection,
  ContactSection,
  AboutTeaser
} from '@/components/HomeSections';
import { buildMetadata, HOME_TITLE } from '@/lib/metadata';
import JsonLd from '@/components/JsonLd';
import { webPageSchema } from '@/lib/schema';

// Light placeholder shown while a below-the-fold section loads
function SectionSkeleton({ rows = 'cards' }) {
  const items = rows === 'products' ? 4 : rows === 'brands' ? 6 : 3;
  const cols = rows === 'products' ? 'grid-cols-2 lg:grid-cols-4' : rows === 'brands' ? 'grid-cols-2 md:grid-cols-6' : 'grid-cols-1 md:grid-cols-3';
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24" aria-hidden="true">
      <div className="mb-10 h-10 w-56 animate-pulse rounded-full bg-secondary/60" />
      <div className={`grid gap-6 ${cols}`}>
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="aspect-[4/3] animate-pulse rounded-card bg-secondary/60" />
        ))}
      </div>
    </div>
  );
}

export async function generateMetadata() {
  let seo = null;
  try {
    seo = await getSeo();
  } catch (e) {
    console.error('Failed to load site SEO settings:', e);
  }
  return buildMetadata({
    title: HOME_TITLE,
    description:
      seo?.defaultDescription ||
      'Cinema Focus delivers reference-class Home Cinema & Hi-Fi audio systems in Chennai, India. Explore our curated collection of speakers, subwoofers, amplifiers, and turntables.',
    path: '/',
    image: seo?.ogImage,
  });
}

export default async function Home() {
  // ONLY fetch critical LCP data upfront to minimize server response time
  const heroData = await getHero();

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
          duration: heroData?.duration !== undefined ? heroData.duration : 6,
          mobileTextAlignment: heroData?.mobileTextAlignment || 'center',
          mobileVerticalAlignment: heroData?.mobileVerticalAlignment || 'center'
        }]
      };

  return (
    <div>
      <JsonLd data={webPageSchema({ path: '/', name: HOME_TITLE, description: 'Hi-fi and home cinema showroom in Chennai.' })} />
      {/* Critical LCP Section - Rendered immediately without animation to minimize LCP delay */}
      <Hero
        {...normalizedHero}
      />

      {/* Below-the-fold sections stream in behind the hero */}
      <Suspense fallback={<SectionSkeleton />}>
        <PressSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton rows="brands" />}>
        <CollectionSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton rows="products" />}>
        <FeaturedSection />
      </Suspense>

      <AboutTeaser />

      <Suspense fallback={<div className="mx-auto h-40 max-w-7xl px-4 md:px-8"><div className="h-full animate-pulse rounded-card bg-secondary/60" /></div>}>
        <TrustSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <GallerySection />
      </Suspense>

      <ContactSection />
    </div>
  );
}
