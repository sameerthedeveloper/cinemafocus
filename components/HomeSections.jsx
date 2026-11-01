import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Section from './Section';
import CategoryCard from './CategoryCard';
import BrandMarquee from './BrandMarquee';
import Button from './Button';
import OpenStatus from './OpenStatus';
import SectionHeader from './SectionHeader';
import LatestShowcase from './LatestShowcase';
import { CINEMA_FOCUS_GEO as geo } from '@/lib/geoContext';
import PressReleases from './PressReleases';
const HomeGallery = dynamic(() => import('./HomeGallery'), { 
  ssr: true,
  loading: () => <div className="h-[400px] animate-pulse rounded-card bg-secondary/60" />
});
import * as LucideIcons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { 
  getCategories, 
  getFeaturedProducts,
  getProducts,
  getNewLaunches,
  getTrustBadges, 
  getProjects, 
  getPressReleases
} from '@/lib/cms';

const CustomIcon = ({ name, ...props }) => {
  const LucideIcon = LucideIcons[name];
  return LucideIcon ? <LucideIcon {...props} /> : null;
};

export async function PressSection() {
  const data = await getPressReleases();
  return <PressReleases releases={data} />;
}

export async function CollectionSection() {
  const data = await getCategories();
  return (
    <Section id="categories" className="bg-background">
      <SectionHeader title="Shop by brand" lead="World-class audio brands, curated for you." href="/products" linkLabel="All products" />
      <div className="relative mx-auto w-full max-w-7xl md:px-0">
        <BrandMarquee categories={data} />
      </div>
    </Section>
  );
}

export async function FeaturedSection() {
  const [featured, rawLaunches, catalogue] = await Promise.all([
    getFeaturedProducts(),
    getNewLaunches().catch(() => []),
    getProducts().catch(() => null),
  ]);
  // A New Launches entry whose product was deleted would link to a 404, so only keep ones that still exist
  const liveSlugs = catalogue ? new Set(catalogue.map((p) => p.slug)) : null;
  const launches = liveSlugs ? rawLaunches.filter((l) => liveSlugs.has(l.slug)) : rawLaunches;

  // New Launches entries are products too (same slug), so show them here as well. Newest first,
  // one card per product.
  const launchAsProduct = (l) => ({
    slug: l.slug,
    name: l.name,
    brand: l.brand,
    category: l.category,
    price: l.price,
    images: l.images,
    image_url: l.image_url || l.images?.[0],
    short_description: l.short_description || l.shortDescription,
    created_at: l.created_at,
    is_new_launch: true,
  });
  const seen = new Set();
  const data = [...launches.map(launchAsProduct), ...featured]
    .filter((p) => p?.slug && !seen.has(p.slug) && seen.add(p.slug))
    .sort((a, b) => (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0))
    .slice(0, 5);

  return (
    <Section id="featured" background="bg-secondary/5">
      <SectionHeader title="The latest" href="/products" linkLabel="View all products" />
      <LatestShowcase products={data} />
    </Section>
  );
}

// Mission statement set large, with the two supporting lines beneath. Copy is unchanged.
export function AboutTeaser() {
  return (
    <Section id="about-teaser" className="!pb-8 md:!pb-12">
      <p className="text-sm text-muted-foreground">Our mission</p>
      <p className="mt-4 max-w-4xl text-3xl font-medium leading-[1.15] tracking-tight text-balance md:text-5xl">
        To reveal the soul of the music. True high-fidelity is about emotion, texture, and presence.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 border-t border-border pt-8 md:mt-16 md:grid-cols-2 md:gap-12 md:pt-10">
        <div>
          <h2 className="text-xl font-medium md:text-2xl">Who we are</h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            A collective of audiophiles bridging the gap between artist and listener.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-medium md:text-2xl">What we do</h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            We curate world-class systems. From intimate 2-channel setups to immersive home cinemas.
          </p>
        </div>
      </div>

      <Link
        href="/about"
        className="mt-10 inline-flex h-11 items-center gap-1.5 rounded-full bg-secondary px-5 text-sm font-medium tracking-tight transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        More about Cinema Focus
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </Section>
  );
}

// Trust badges as one connected strip: hairline-divided cells, left aligned.
export async function TrustSection() {
  const data = await getTrustBadges();
  return (
    <Section id="trust" className="!pt-8 md:!pt-12">
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-card bg-border md:grid-cols-4">
        {data.map((badge, idx) => (
          <li key={idx} className="flex flex-col items-start gap-4 bg-background p-5 md:p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-foreground">
              <CustomIcon name={badge.icon} size={20} strokeWidth={1.5} />
            </span>
            <span className="text-base font-medium leading-snug md:text-lg">{badge.title}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export async function GallerySection() {
  const data = await getProjects();
  return (
    <Section id="gallery">
      <SectionHeader title="Gallery" href="/gallery" linkLabel="View full gallery" />
      <HomeGallery projects={data} />
    </Section>
  );
}

// Short "visit us" band; the full form and map live on /contact and /location.
export function ContactSection() {
  const { open, close } = geo.hours.weekday;
  const actionClass = 'h-12 rounded-full px-7 normal-case! tracking-tight!';
  return (
    <Section id="home-contact">
      <div className="grid gap-8 rounded-panel bg-secondary/40 p-6 md:p-12 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="lg:col-span-7">
          <OpenStatus open={open} close={close} className="bg-background" />
          <h2 className="mt-5 text-4xl font-medium tracking-tight md:text-5xl">Hear it for yourself</h2>
          <p className="mt-3 max-w-xl text-lg text-muted-foreground md:text-xl">
            Come and hear the systems at our {geo.locality} showroom, or send us a message and we will get back to you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/location" icon className={actionClass}>Visit showroom</Button>
            <Button href="/contact" variant="outline" className={actionClass}>Contact us</Button>
          </div>
        </div>
        <address className="not-italic text-muted-foreground lg:col-span-5">
          <div className="text-lg font-medium text-foreground">{geo.name}</div>
          <div className="mt-1 leading-relaxed">
            {geo.street_address}, {geo.locality}, {geo.city} {geo.postal_code}
          </div>
          <a href={`tel:${geo.mobile}`} className="mt-4 block text-lg font-medium text-foreground transition-colors hover:text-muted-foreground">
            {geo.mobile}
          </a>
          <a href={`mailto:${geo.email}`} className="transition-colors hover:text-foreground">{geo.email}</a>
        </address>
      </div>
    </Section>
  );
}
