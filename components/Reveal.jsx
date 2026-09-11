"use client";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Drop-in replacement for the old CSS @keyframes entrance classes
// (.animate-fade-in / .animate-fade-in-up / .animate-float, still defined
// in globals.css for their resting pre-animation state). Scoped per
// instance via a ref + its own useEffect, so it only ever touches the DOM
// after this component's own commit — never races React's hydration of a
// streamed/Suspense-deferred subtree the way a global DOM scan would.
const ANIMATIONS = {
  'animate-fade-in': (el) =>
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' }),
  'animate-fade-in-up': (el) =>
    gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }),
  'animate-float': (el) =>
    gsap.to(el, { y: -15, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
};
const CLASSES = Object.keys(ANIMATIONS);

export default function Reveal({ as: As = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cls = CLASSES.find((c) => el.classList.contains(c));
    if (!cls) return;
    const tween = ANIMATIONS[cls](el);
    return () => tween.kill();
  }, []);

  return (
    <As ref={ref} className={className} {...rest}>
      {children}
    </As>
  );
}
