"use client";

import Reveal from '@/components/Reveal';

// Re-mounts on every navigation, so each portal page eases in (same GSAP entrance the site uses).
export default function PortalTemplate({ children }) {
  return <Reveal className="animate-fade-in-up">{children}</Reveal>;
}
