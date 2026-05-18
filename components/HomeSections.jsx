import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Section from './Section';
import CategoryCard from './CategoryCard';
import ProductCard from './ProductCard';
import Button from './Button';
import PressReleases from './PressReleases';
const HomeGallery = dynamic(() => import('./HomeGallery'), { 
  ssr: true,
  loading: () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[400px] bg-white/5 animate-pulse rounded-2xl" />
});
import { Globe, ShieldCheck, Headphones, Award } from 'lucide-react';
import { 
  getCategories, 
  getFeaturedProducts, 
  getTrustBadges, 
  getProjects, 
  getPressReleases 
} from '@/lib/cms';

const iconMap = {
  Globe,
  ShieldCheck,
  Headphones,
  Award
};

const CustomIcon = ({ name, ...props }) => {
  const LucideIcon = iconMap[name];
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
      <div className="text-center mb-16 md:mb-24 space-y-4">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight">Shop by Brand.</h2>
        <p className="text-xl text-muted font-light max-w-2xl mx-auto">
           World-class audio brands, curated for you.
        </p>
      </div>
      <div className="relative w-full max-w-7xl mx-auto px-4 md:px-0">
        <div className="flex items-start gap-6 md:gap-10 overflow-x-auto pb-8 pt-4 scrollbar-hide snap-x touch-pan-x justify-start md:justify-center">
          {data.map((category) => (
            <div key={category.slug} className="snap-center">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export async function FeaturedSection() {
  const data = await getFeaturedProducts();
  return (
    <Section id="featured" background="bg-secondary/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight">The Latest.</h2>
        <Button href="/products" variant="link" className="text-lg">View All Products ›</Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-16">
        {data.slice(0, 5).map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </Section>
  );
}

export async function TrustSection() {
  const data = await getTrustBadges();
  return (
    <Section id="trust" background="bg-card">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
        {data.map((badge, idx) => (
          <div key={idx} className="space-y-4">
            <div className="flex justify-center text-foreground">
              <CustomIcon name={badge.icon} size={32} strokeWidth={1.5} />
            </div>
            <h4 className="font-medium text-base text-muted">{badge.title}</h4>
          </div>
        ))}
      </div>
    </Section>
  );
}

export async function GallerySection() {
  const data = await getProjects();
  return (
    <Section id="gallery">
      <div className="mb-16 text-center">
         <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Gallery</h2>
         <Link href="/gallery" className="text-primary hover:underline text-lg">View Full Gallery ›</Link>
      </div>
      <HomeGallery projects={data} />
    </Section>
  );
}
