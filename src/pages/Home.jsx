
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Section from '../components/Section';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { Globe, ShieldCheck, Headphones, Award } from 'lucide-react';
import { getHero, getCategories, getFeaturedProducts, getTrustBadges, getProjects, getNewLaunches, getPressReleases } from '../lib/db';
import { hero as fallbackHero, categories as seedCategories, products as seedProducts, trustBadges as seedTrustBadges, newLaunches as seedNewLaunches, pressReleases as seedPressReleases } from '../lib/seed-data';
import NewLaunches from '../components/NewLaunches';
import PressReleases from '../components/PressReleases';
import HomeSkeleton from '../components/HomeSkeleton';

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

  if (loading) {
    return <HomeSkeleton />;
  }


  return (
    <div className="animate-fade-in pb-20">
      <SEO title="Home" />
      
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
       <Section id="projects">
          <div className="mb-16 text-center">
             <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Our Clients</h2>
             <Link to="/gallery" className="text-primary hover:underline text-lg">See All Our Clients ›</Link>
          </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Dynamic Project Grid - eventually fetched from Firestore */}
              {projects.length > 0 ? projects.slice(0, 3).map((project, i) => (
                <div key={project.id || i} className="relative aspect-video overflow-hidden rounded-2xl group cursor-pointer">
                  <img src={project.imageUrl} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={project.title} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="text-white font-medium text-lg tracking-wide border border-white/30 px-6 py-2 rounded-full backdrop-blur-sm">View Project</span>
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
                         <span className="text-white font-medium text-lg tracking-wide border border-white/30 px-6 py-2 rounded-full backdrop-blur-sm">View Project</span>
                      </div>
                    </div>
                 ))
              )}
           </div>
       </Section>
    </div>
  );
};

export default Home;
