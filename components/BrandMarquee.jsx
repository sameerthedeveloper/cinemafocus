"use client";

import React, { useRef, useEffect, useState } from 'react';
import CategoryCard from './CategoryCard';

export default function BrandMarquee({ categories }) {
  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const speed = 0.5;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId;
    let currentScroll = container.scrollLeft;

    const scroll = () => {
      if (!isPaused) {
        currentScroll += speed;
        
        // Sync back in case of manual native scrolling
        if (Math.abs(container.scrollLeft - currentScroll) > 2) {
          currentScroll = container.scrollLeft;
        }

        // Loop back when we scroll past the end
        if (currentScroll >= container.scrollWidth - container.clientWidth) {
          currentScroll = 0;
          container.scrollLeft = 0;
        } else {
          container.scrollLeft = currentScroll;
        }
      } else {
        // Keep synced when paused (e.g., user is manually scrolling or hovering)
        currentScroll = container.scrollLeft;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        ref={containerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex w-full overflow-x-auto scrollbar-hide touch-pan-x"
        style={{ scrollBehavior: 'auto' }}
      >
        <div className="flex gap-6 md:gap-10 pr-6 md:pr-10 pb-8 pt-4 w-max">
            {categories.map((category, index) => (
            <div key={`${category.slug}-${index}`} className="flex-shrink-0">
                <CategoryCard category={category} />
            </div>
            ))}
        </div>
      </div>
    </div>
  );
}
