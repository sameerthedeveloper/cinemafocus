import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Section from '../components/Section';
import SEO from '../components/SEO';
import { getProjects } from '../lib/db';
import { Loader2, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import ScrollToTop from '../components/ScrollToTop';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setGalleryItems(data);
      } catch (error) {
        console.error("Error fetching gallery items:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  
  const nextImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % galleryItems.length);
  };
  
  const prevImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
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
  }, [lightboxIndex, galleryItems.length]);

  return (
    <div className="animate-fade-in min-h-screen bg-background">
      <ScrollToTop />
      <SEO 
        title="Installation Gallery" 
        description="A visual journey through Cinema Focus's most exquisite home cinema and audio installations. See how we bring premium sound to life."
        keywords="home cinema installations, audio setup gallery, premium speaker installations, Cinema Focus projects, showroom gallery"
        schema={{
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          "name": "Cinema Focus Installation Gallery",
          "description": "A curated collection of bespoke home cinema and audio installations by Cinema Focus.",
          "url": "https://cinemafocus.in/gallery",
          "isPartOf": { "@type": "WebSite", "name": "Cinema Focus", "url": "https://cinemafocus.in" }
        }}
      />
      
      {/* Header Section */}
      <Section className="text-center pt-32 pb-16">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-secondary-foreground/60 uppercase tracking-[0.2em] text-sm font-medium">Gallery</span>
          <h1 className="text-5xl md:text-7xl font-sans font-medium tracking-tight text-foreground">
            Visual Harmony.
          </h1>
          <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
             Where technology meets design. Explore our curated selection of bespoke installations.
          </p>
        </div>
      </Section>

      <div className="container px-4 mx-auto pb-32">
        {loading ? (
           <div className="flex justify-center py-32">
             <div className="flex flex-col items-center gap-4">
               <Loader2 className="animate-spin text-primary opacity-50" size={32} />
               <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading Collection...</p>
             </div>
           </div>
        ) : galleryItems.length > 0 ? (
          /* Standard Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {galleryItems.map((item, idx) => (
              <div 
                key={item.id || idx} 
                className="relative overflow-hidden rounded-xl group cursor-pointer bg-secondary/10 aspect-[4/3]"
                onClick={() => openLightbox(idx)}
              >
                {/* Image */}
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                   <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center gap-3">
                      <ZoomIn className="text-white/80" size={32} strokeWidth={1.5} />
                      <span className="text-white font-medium text-sm tracking-widest uppercase border border-white/30 px-4 py-1.5 rounded-full">
                        View Photo
                      </span>
                   </div>
                </div>
                
                {/* Title (Always visible bottom label styling option, or keep it clean? Keeping clean for premium feel, title on hover or lightbox) */}
                 <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-medium text-lg">{item.title}</p>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-secondary/5 rounded-3xl border border-dashed border-secondary">
            <p className="text-muted-foreground text-lg">Our gallery is currently being curated. Check back soon.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal - Portal to Body to escape stacking contexts */}
      {lightboxIndex !== null && createPortal(
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
                  src={galleryItems[lightboxIndex].imageUrl} 
                  alt={galleryItems[lightboxIndex].title}
                  className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm"
                />
                <div className="mt-6 text-center">
                   <h3 className="text-white text-xl md:text-2xl font-light tracking-wide">{galleryItems[lightboxIndex].title}</h3>
                   <p className="text-white/40 text-sm mt-2 font-mono">
                     {lightboxIndex + 1} / {galleryItems.length}
                   </p>
                </div>
             </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Gallery;
