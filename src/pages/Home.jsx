
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Section from '../components/Section';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { Globe, ShieldCheck, Headphones, Award, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getHero, getCategories, getFeaturedProducts, getTrustBadges, getProjects, getNewLaunches, getPressReleases } from '../lib/db';
import { hero as fallbackHero, categories as seedCategories, products as seedProducts, trustBadges as seedTrustBadges, newLaunches as seedNewLaunches, pressReleases as seedPressReleases } from '../lib/seed-data';
import NewLaunches from '../components/NewLaunches';
import PressReleases from '../components/PressReleases';
import HomeSkeleton from '../components/HomeSkeleton';
import LazyImage from '../components/LazyImage';

// Local Assets for Fallback
const imgSpeakers = '/images/speakers.webp';
const imgTurntables = '/images/turntables.webp';
const imgAmps = '/images/amplifiers.webp';

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

const Home = () => {
  const [heroData, setHeroData] = useState(fallbackHero);
  const [categoriesData, setCategoriesData] = useState(seedCategories);
  const [featuredProducts, setFeaturedProducts] = useState(seedProducts.slice(0, 3));
  const [newLaunchesData, setNewLaunchesData] = useState(seedNewLaunches);
  const [pressReleasesData, setPressReleasesData] = useState(seedPressReleases);
  const [trustBadgesData, setTrustBadgesData] = useState(seedTrustBadges);
  const [projects, setProjects] = useState([]); // Projects don't have seed export in import list, check imports?
  const [loading, setLoading] = useState(true); // Start with loading state (Skeleton)
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data
        const [h, c, f, t, p, nl, pr] = await Promise.all([
          getHero(),
          getCategories(),
          getFeaturedProducts(),
          getTrustBadges(),
          getProjects(),
          getNewLaunches(),
          getPressReleases()
        ]);
        
        // Update state with fetched data
        if (h) setHeroData(h);
        if (c) setCategoriesData(c);
        if (f) setFeaturedProducts(f.slice(0, 3));
        if (t) setTrustBadgesData(t);
        if (p) setProjects(p);
        if (nl) setNewLaunchesData(nl);
        if (pr) setPressReleasesData(pr);
        
      } catch (error) {
        console.error("Home Page Fetch Error:", error);
      } finally {
        setLoading(false); // Remove loading state immediately when done
      }
    };
    fetchData();
  }, []);

  // Lightbox Handlers
  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  
  const nextImage = (e) => {
    e.stopPropagation();
    if (projects.length > 0) {
      // Create a subset for lightbox if we are only showing first 3, OR show all?
      // The grid shows projects.slice(0, 3). Let's restrict lightbox to these 3 for consistency with what's visible?
      // Or show all projects? Usually lightbox shows what's in the context. 
      // The grid maps `projects.slice(0, 3)`. So let's use that subset for navigation or just map index 0-2?
      // Actually simpler to just use the `projects.slice(0, 3)` array as the context.
      // But `projects` contains all. 
      // Let's define the displayed items to be clear.
      
      const displayedProjects = projects.slice(0, 3);
      setLightboxIndex((prev) => (prev + 1) % displayedProjects.length);
    }
  };
  
  const prevImage = (e) => {
    e.stopPropagation();
    if (projects.length > 0) {
      const displayedProjects = projects.slice(0, 3);
      setLightboxIndex((prev) => (prev - 1 + displayedProjects.length) % displayedProjects.length);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage(e);
      if (e.key === 'ArrowLeft') prevImage(e);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, projects]);

  if (loading) {
    return <HomeSkeleton />;
  }


  return (
    <div className="animate-fade-in pb-20">
      <SEO 
        title="Premium Audio & Home Cinema Systems" 
        description="Cinema Focus delivers reference-class Home Cinema & Hi-Fi audio systems in Oman. Explore speakers, subwoofers, amplifiers, and turntables from world-renowned brands."
        keywords="home cinema, hi-fi audio, speakers, subwoofers, amplifiers, turntables, premium audio, Oman, Cinema Focus, home theater"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Cinema Focus",
            "url": "https://cinemafocus.in",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://cinemafocus.in/products?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Cinema Focus",
            "url": "https://cinemafocus.in",
            "logo": "https://cinemafocus.in/logo.svg",
            "sameAs": [],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "availableLanguage": ["English", "Arabic"]
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Cinema Focus",
            "url": "https://cinemafocus.in",
            "image": "https://cinemafocus.in/logo.svg",
            "@id": "https://cinemafocus.in/#localbusiness",
            "description": "Premium audio and home cinema showroom in Oman, curating the finest speakers, amplifiers, and turntables.",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "OM"
            },
            "priceRange": "$$$$"
          }
        ]}
      />
      
      {/* 1. New Launches Section (Apple Style Hero) */}
      {/* 1. New Launches Section (Apple Style Hero) OR Standard Hero Fallback */}
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

      {/* 6.1.6 Press Release Section */}
      <PressReleases releases={pressReleasesData} />

      {/* 6.2 Categories Section - Deduplicated, Grid */}
      <Section id="categories" className="bg-background">
        <div className="text-center mb-16 md:mb-24 space-y-4">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight">Our Collection.</h2>
          <p className="text-xl text-muted font-light max-w-2xl mx-auto">
             Precision engineering meets acoustic artistry.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 md:px-0">
          {categoriesData.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </Section>

      {/* 6.3 Featured Products - Curated */}
      <Section id="featured" background="bg-secondary/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight">The Latest.</h2>
          <Button to="/products" variant="link" className="text-lg">View All Products ›</Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-16">
          {featuredProducts.slice(0, 3).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Section>

      {/* 6.4 Explore / Philosophy - Simplified text */}
      <Section id="philosophy">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 text-center md:text-left">
          <div className="space-y-4">
            <h3 className="text-2xl font-medium text-foreground">Who We Are.</h3>
            <p className="text-muted leading-relaxed text-lg font-light">
              A collective of audiophiles bridging the gap between artist and listener.
            </p>
            <Link to="/about" className="text-primary hover:underline block pt-2">Learn more ›</Link>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-medium text-foreground">What We Do.</h3>
            <p className="text-muted leading-relaxed text-lg font-light">
              We curate world-class systems. From intimate 2-channel setups to immersive home cinemas.
            </p>
            <Link to="/about" className="text-primary hover:underline block pt-2">Learn more ›</Link>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-medium text-foreground">Our Mission.</h3>
            <p className="text-muted leading-relaxed text-lg font-light">
              To reveal the soul of the music. True high-fidelity is about emotion, texture, and presence.
            </p>
            <Link to="/about" className="text-primary hover:underline block pt-2">Learn more ›</Link>
          </div>
        </div>
      </Section>

      {/* 6.5 Trust - Minimal Icons */}
      <Section id="trust" background="bg-card">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {trustBadgesData.map((badge, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex justify-center text-foreground">
                <CustomIcon name={badge.icon} size={32} strokeWidth={1.5} />
              </div>
              <h4 className="font-medium text-base text-muted">{badge.title}</h4>
            </div>
          ))}
        </div>
      </Section>

       {/* 6.6 Gallery Preview - Clean Grid */}
       <Section id="gallery">
          <div className="mb-16 text-center">
             <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Gallery</h2>
             <Link to="/gallery" className="text-primary hover:underline text-lg">View Full Gallery ›</Link>
          </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Dynamic Project Grid - eventually fetched from Firestore */}
              {projects.length > 0 ? projects.slice(0, 3).map((project, i) => (
                <div 
                  key={project.id || i} 
                  className="relative group cursor-pointer"
                  onClick={() => openLightbox(i)}
                >
                  <LazyImage 
                    src={project.imageUrl} 
                    alt={project.title}
                    aspectRatio="aspect-video"
                    containerClassName="rounded-2xl"
                    className="transition-transform duration-1000 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                     <span className="text-white font-medium text-lg tracking-wide border border-white/30 px-6 py-2 rounded-full backdrop-blur-sm">View Photo</span>
                  </div>
                </div>
              )) : (
                 // Fallback to local assets if no dynamic projects found
                 [
                   { img: imgSpeakers, title: "Custom Speakers" },
                   { img: imgTurntables, title: "Vintage Turntables" },
                   { img: imgAmps, title: "Hi-Fi Amplifiers" }
                 ].map((item, i) => (
                    <div key={i} className="relative aspect-video overflow-hidden rounded-2xl group cursor-pointer">
                      <img src={item.img} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={item.title} />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span className="text-white font-medium text-lg tracking-wide border border-white/30 px-6 py-2 rounded-full backdrop-blur-sm">View Photo</span>
                      </div>
                    </div>
                 ))
              )}
           </div>
       </Section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && projects.length > 0 && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-300">
           {/* Close Button */}
           <button 
             onClick={closeLightbox}
             className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 z-50 rounded-full hover:bg-white/10"
           >
             <X size={32} strokeWidth={1.5} />
           </button>

           {/* Navigation */}
           <button 
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-50 hidden md:block"
           >
              <ChevronLeft size={40} strokeWidth={1} />
           </button>

           <button 
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-50 hidden md:block"
           >
              <ChevronRight size={40} strokeWidth={1} />
           </button>

             <div 
               className="relative max-w-7xl max-h-[90vh] w-full p-4 flex flex-col items-center justify-center"
               onClick={(e) => e.stopPropagation()} 
             >
                <img 
                  src={projects[lightboxIndex].imageUrl} 
                  alt={projects[lightboxIndex].title}
                  className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm"
                />
                <div className="mt-6 text-center">
                   <h3 className="text-white text-xl md:text-2xl font-light tracking-wide">{projects[lightboxIndex].title}</h3>
                   <p className="text-white/40 text-sm mt-2 font-mono">
                     {lightboxIndex + 1} / {Math.min(projects.length, 3)}
                   </p>
                </div>
             </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Home;
