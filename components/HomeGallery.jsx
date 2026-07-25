"use client";

import React, { useState, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import LazyImage from './LazyImage';

export default function HomeGallery({ projects }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
            // Fallback UI if no projects
            [1, 2, 3].map((_, i) => (
                <div key={i} className="aspect-video rounded-2xl bg-secondary animate-pulse" />
            ))
        )}
      </div>

      {lightboxIndex !== null && isMounted && createPortal(
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
            <button 
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 z-50 rounded-full hover:bg-white/10"
            >
              <X size={32} strokeWidth={1.5} />
            </button>

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
                className="relative max-w-7xl h-[80vh] w-full p-4 flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="relative w-full h-full">
                    <OptimizedImage 
                        src={displayedProjects[lightboxIndex].imageUrl} 
                        alt={displayedProjects[lightboxIndex].title}
                        fill
                        className="object-contain shadow-2xl rounded-sm"
                        sizes="90vw"
                        priority
                    />
                </div>
                <div className="mt-6 text-center">
                    <h3 className="text-white text-xl md:text-2xl font-light tracking-wide">{displayedProjects[lightboxIndex].title}</h3>
                    <p className="text-white/40 text-sm mt-2 font-mono">
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
