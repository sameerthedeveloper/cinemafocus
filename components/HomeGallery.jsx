"use client";

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import OptimizedImage from './OptimizedImage';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import LazyImage from './LazyImage';

export default function HomeGallery({ projects }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const isMounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  
  const featuredProjects = Array.isArray(projects) ? projects.filter(p => p.featured) : [];
  const displayedProjects = featuredProjects.length > 0 
    ? featuredProjects.slice(0, 6) 
    : (Array.isArray(projects) ? projects.slice(0, 3) : []);

  const nextImage = (e) => {
    if (e) e.stopPropagation();
    if (displayedProjects.length > 0) {
      setLightboxIndex((prev) => (prev + 1) % displayedProjects.length);
    }
  };
  
  const prevImage = (e) => {
    if (e) e.stopPropagation();
    if (displayedProjects.length > 0) {
      setLightboxIndex((prev) => (prev - 1 + displayedProjects.length) % displayedProjects.length);
    }
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage(e);
      if (e.key === 'ArrowLeft') prevImage(e);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, displayedProjects]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedProjects.length > 0 ? displayedProjects.map((project, i) => (
          <button
            type="button"
            key={project.id || i}
            aria-label={`View photo: ${project.title || 'Cinema Focus photo'}`}
            className="group relative block w-full overflow-hidden rounded-card text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={() => openLightbox(i)}
          >
            <LazyImage 
              src={project.imageUrl} 
              alt={project.title || 'Cinema Focus photo'}
              aspectRatio="aspect-video"
              containerClassName="rounded-card"
              className="transition-transform duration-700 ease-out group-hover:scale-[1.04]" 
              style={{ objectPosition: project.imagePosition || project.image_position || 'center' }}
            />
            {project.title && (
              <span className="absolute bottom-4 left-4 z-10 line-clamp-1 max-w-[calc(100%-2rem)] rounded-full bg-background px-4 py-2 text-sm font-medium shadow-float">
                {project.title}
              </span>
            )}
          </button>
        )) : (
            // Fallback UI if no projects
            [1, 2, 3].map((_, i) => (
                <div key={i} className="aspect-video rounded-card bg-secondary/60 animate-pulse" />
            ))
        )}
      </div>

      {lightboxIndex !== null && isMounted && createPortal(
        <div 
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
            <button 
              onClick={closeLightbox}
              aria-label="Close photo"
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 z-50 rounded-full hover:bg-white/10"
            >
              <X size={32} strokeWidth={1.5} />
            </button>

            <button 
                onClick={prevImage}
                aria-label="Previous photo"
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-50 hidden md:block"
            >
                <ChevronLeft size={40} strokeWidth={1} />
            </button>

            <button 
                onClick={nextImage}
                aria-label="Next photo"
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-50 hidden md:block"
            >
                <ChevronRight size={40} strokeWidth={1} />
            </button>

            <div 
                className="relative max-w-7xl h-[80vh] w-full p-4 flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="relative w-full h-full">
                    <OptimizedImage 
                        src={displayedProjects[lightboxIndex].imageUrl} 
                        alt={displayedProjects[lightboxIndex].title || 'Cinema Focus photo'}
                        fill
                        optimize
                        className="object-contain shadow-2xl rounded-sm"
                        sizes="90vw"
                        priority
                    />
                </div>
                <div className="mt-6 text-center">
                    <h3 className="text-white text-xl md:text-2xl font-medium">{displayedProjects[lightboxIndex].title}</h3>
                    <p className="text-white/70 text-sm mt-2">
                        {lightboxIndex + 1} / {displayedProjects.length}
                    </p>
                </div>
            </div>
        </div>,
        document.body
      )}
    </>
  );
}
