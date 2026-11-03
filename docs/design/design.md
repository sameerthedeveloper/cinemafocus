# Cinema Focus design system (with code)

Reference-class home cinema and Hi-Fi retailer, Chennai. This file is for building the **ecommerce store** in the same look as the brand site. Everything under "Component code" is copied from the live brand site, so it works as-is once the setup below is in place. Section 9 adds the few pieces a store needs that the brand site does not have; those are new and untested against your store.

Stack: Next.js 16 (App Router), React 19, Tailwind CSS 4, `lucide-react`, `clsx`, `gsap` (header entrance only).

```bash
npm install next@16 react@19 react-dom@19 tailwindcss@4 @tailwindcss/postcss lucide-react clsx gsap
```

## 1. Principles

1. **The product is the colour.** The interface is white, black and grey. Never add a brand hue to chrome.
2. **One signal colour.** Orange (`signal`) marks "New". Nothing else uses it.
3. **Quiet surfaces, soft corners.** Cards are tinted fills with no border and no resting shadow. Depth appears on hover.
4. **Motion answers or introduces.** One header entrance, one hover per control. No scroll-fade on every section.
5. **Content is real.** Names, prices, addresses and hours come from the catalogue. No placeholder copy.
6. **Pills for actions.** Buttons, chips, the header and badges are `rounded-full`. Cards use `rounded-card`.

## 2. Setup

### Font

One family, Inter. In `app/layout.jsx`:

```jsx
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

### Tokens: `app/globals.css`

Tailwind 4 reads the tokens from `@theme`. Components only use these semantic names (`bg-background`, `text-muted-foreground`, `rounded-card`), never raw hex.

```css
@import "tailwindcss";

@theme {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));

  --font-sans: var(--font-inter), system-ui, -apple-system, sans-serif;
  --font-serif: 'SF Pro Display', var(--font-inter), sans-serif;

  /* Design-system tokens — see DESIGN_SYSTEM.md */
  --color-signal: #e05600;   /* "New" markers only; never decorative */
  --color-danger: #d70015;   /* errors, destructive actions */
  --color-stage: #0a0a0a;    /* dark hero / launch surfaces (matches themeColor) */

  --radius-control: 0.75rem; /* inputs, small buttons */
  --radius-media: 1rem;      /* images inside cards */
  --radius-card: 1.5rem;     /* product / press cards */
  --radius-panel: 2rem;      /* category tiles, large panels */

  --shadow-lift: 0 8px 40px rgba(0, 0, 0, 0.08);   /* card hover */
  --shadow-float: 0 8px 30px -14px rgba(0, 0, 0, 0.35); /* header pill */

  --ease-settle: cubic-bezier(0.215, 0.61, 0.355, 1); /* hero intro, reveals */
}

@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color: var(--color-border, currentColor);
  }
}

/* Base Theme (Light / Default) */
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 0%;

  --primary: 0 0% 0%;
  --primary-foreground: 0 0% 100%;

  --secondary: 0 0% 96%;
  --secondary-foreground: 0 0% 0%;

  --muted: 0 0% 45%;
  --muted-foreground: 0 0% 45%;

  --accent: 0 0% 90%;
  --accent-foreground: 0 0% 0%;

  --card: 0 0% 98%;
  --card-foreground: 0 0% 0%;

  --border: 0 0% 90%;
  --input: 0 0% 90%;
  --ring: 0 0% 0%;
}

@layer base {
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    @apply font-sans antialiased selection:bg-black/10;
    font-feature-settings: "cv11", "ss01";
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  body::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }
  html::-webkit-scrollbar {
    display: none;
  }
  html {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  h1, h2, h3, h4, h5, h6 {
    @apply tracking-tight font-medium;
  }
}

/* ── Utility: hide scrollbar while keeping scroll functionality ───── */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE / Edge */
  scrollbar-width: none;     /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;             /* Chrome / Safari */
}
```

### Token reference

| Token | Value | Use |
|---|---|---|
| `background` | `#ffffff` | Page |
| `foreground` / `primary` | `#000000` | Text, primary button, focus ring |
| `secondary` | `hsl(0 0% 96%)` | Card fill (`/40` at rest, `/70` on hover) |
| `card` | `hsl(0 0% 98%)` | Footer, raised panels |
| `accent` | `hsl(0 0% 90%)` | Hover fill on pills and ghost controls |
| `muted-foreground` | `hsl(0 0% 45%)` | Secondary text, metadata |
| `border` / `input` | `hsl(0 0% 90%)` | Hairlines, field outlines |
| `signal` | `#e05600` | "New" marker only |
| `danger` | `#d70015` | Errors, destructive actions |
| `rounded-control` | 12px | Inputs |
| `rounded-media` | 16px | Images inside cards |
| `rounded-card` | 24px | Product cards, tiles |
| `rounded-panel` | 32px | Large panels |
| `shadow-lift` | `0 8px 40px rgb(0 0 0 / .08)` | Card hover only |
| `shadow-float` | `0 8px 30px -14px rgb(0 0 0 / .35)` | Header pill, floating labels |
| `ease-settle` | `cubic-bezier(.215,.61,.355,1)` | Underline and reveal transitions |

### Type scale

| Role | Classes |
|---|---|
| Page title (h1) | `text-4xl md:text-5xl font-medium tracking-tight` |
| Section title (h2) | `text-4xl md:text-5xl font-medium tracking-tight` |
| Subsection (h2) | `text-xl md:text-2xl font-medium` |
| Card title | `text-[15px] sm:text-base font-semibold leading-snug line-clamp-2` |
| Lead | `text-lg md:text-xl text-muted-foreground` |
| Body | `text-base leading-relaxed` |
| Meta | `text-sm text-muted-foreground` |

Sentence case everywhere. No uppercase eyebrows above headings. The nav links in the header are the one uppercase, bold, wide-tracked exception.

### Layout

- Page container: `mx-auto w-full max-w-7xl px-4 md:px-8`
- Page top padding clears the fixed header: `pt-32 md:pt-40`
- Section rhythm: `py-16 md:py-24`
- Product grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`, gap `gap-x-3 gap-y-5 sm:gap-x-4 md:gap-x-6 md:gap-y-8`
- Left-align text. Centre only empty states and tiles.
- Touch targets are at least 40px (`h-11`/`h-12`).
- Every interactive element has `focus-visible:ring-2 ring-primary ring-offset-2`.

## 3. Adapters

The components below import three small things that are specific to the brand site's CMS. Add these stand-ins in your store, then swap them for your own data layer later.

`hooks/useCurrency.js`:

```js
"use client";

// Formats rupees. Replace showPrice with your own switch if some products are enquiry-only.
export const useCurrency = () => {
  const formatPrice = (amount) => {
    if (!amount) return null;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };
  return { formatPrice, showPrice: true };
};
```

`components/LazyImage.jsx` (the brand site's version adds a skeleton and a fallback; this keeps the same props):

```jsx
"use client";
import Image from 'next/image';
import clsx from 'clsx';

export default function LazyImage({
  src, alt, className, containerClassName,
  aspectRatio = 'aspect-square', objectFit = 'cover', priority = false, sizes = '(min-width: 1024px) 25vw, 50vw',
}) {
  return (
    <div className={clsx('relative w-full overflow-hidden bg-secondary/40', aspectRatio, containerClassName)}>
      {src ? (
        <Image
          src={src} alt={alt || ''} fill sizes={sizes} priority={priority}
          className={clsx(objectFit === 'contain' ? 'object-contain' : 'object-cover', className)}
        />
      ) : null}
    </div>
  );
}
```

`context/SiteSettingsContext.jsx` (the header only reads `showDesktopMenu`):

```jsx
"use client";
import { createContext, useContext } from 'react';
const Ctx = createContext({ showDesktopMenu: true });
export const useSiteSettings = () => useContext(Ctx);
export const SiteSettingsProvider = ({ children }) => <Ctx.Provider value={{ showDesktopMenu: true }}>{children}</Ctx.Provider>;
```

Copy `public/images/logo.png` (dark logo) and `public/images/logo-light.webp` (light logo for dark backgrounds) from the brand site. If your product images come from a CDN, allow its host in `next.config.mjs` under `images.remotePatterns`.

## 4. Component code

All code in this section is verbatim from the brand site.

### Button

`components/Button.jsx`

Variants: `primary` (black), `secondary`, `outline`, `ghost`, `link`. Sizes `sm` 36px, `md` 44px, `lg` 56px. The base styles are uppercase from an older design; **pass `className="rounded-full normal-case! tracking-tight!"`** for the current look, as the components below do.

```jsx
"use client";

import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  to, 
  href,
  onClick, 
  className,
  icon = false,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium tracking-wide transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes = {
    sm: "h-9 px-3 text-xs uppercase",
    md: "h-11 px-8 text-sm uppercase",
    lg: "h-14 px-10 text-base uppercase",
    icon: "h-10 w-10",
  };

  const classes = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );

  const content = (
    <>
      {children}
      {icon && <ArrowRight className="ml-2 h-4 w-4" />}
    </>
  );

  // Next.js uses 'href' instead of 'to'
  const linkPath = to || href;

  if (linkPath) {
    return (
      <Link href={linkPath} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes} {...props}>
      {content}
    </button>
  );
};

export default Button;
```

### Section

`components/Section.jsx`

Vertical rhythm and the page container.

```jsx
import React from 'react';
import clsx from 'clsx';

const Section = ({ 
  children, 
  className, 
  id, 
  background = 'bg-transparent',
  container = true 
}) => {
  return (
    <section 
      id={id} 
      className={clsx(
        "py-16 md:py-24", // Standardized vertical rhythm
        background,
        className
      )}
    >
      {container ? (
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
};

export default Section;
```

### SectionHeader

`components/SectionHeader.jsx`

Left-aligned section title with an optional "see all" pill on the right.

```jsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Left-aligned section header with an optional "see all" link on the right.
export default function SectionHeader({ title, lead, href, linkLabel }) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 md:mb-12 md:flex-row md:items-end">
      <div className="max-w-2xl">
        <h2 className="text-4xl font-medium tracking-tight md:text-5xl">{title}</h2>
        {lead && <p className="mt-3 text-lg text-muted-foreground md:text-xl">{lead}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-secondary px-5 text-sm font-medium tracking-tight transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
```

### Header

`components/Header.jsx`

Floating pill. Transparent over a dark hero with white text, solid white with a shadow once scrolled (on every other page it is dark text from the start). The scroll state uses hysteresis (on past 24px, off under 8px) so it never flickers. The mobile menu expands the pill and cascades the links. `showDesktopMenu` comes from the adapter. On a store with no dark hero, `overHero` is simply always false.

```jsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import gsap from 'gsap';
const logo = '/images/logo.png';
const logoLight = '/images/logo-light.webp';

const NAV_LINKS = [
  { name: 'New Launches', path: '/products?category=new-arrivals', isNew: true },
  { name: 'Products', path: '/products' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Press Room', path: '/press' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // The hero tells us when its current slide is bright (e.g. a studio-white product stage),
  // so the transparent header can switch to dark text and the dark logo.
  const [heroIsLight, setHeroIsLight] = useState(false);
  const headerRef = useRef(null);
  const mobilePanelRef = useRef(null);
  const mobileListRef = useRef(null);
  const navListRef = useRef(null);
  // Sliding hover pill: follows the pointer across desktop links
  const [pill, setPill] = useState({ left: 0, width: 0, show: false });
  const movePill = (e) => {
    const li = e.currentTarget;
    setPill({ left: li.offsetLeft, width: li.offsetWidth, show: true });
  };
  const pathname = usePathname();
  const { showDesktopMenu } = useSiteSettings();

  // usePathname() can read the SSR pathname during hydration (mismatch risk from
  // the proxy.js request interception — see next/docs use-pathname.md), so resolve
  // the real location from the browser once mounted instead of trusting it outright.
  const [resolved, setResolved] = useState({ path: pathname, search: '' });
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResolved({ path: window.location.pathname, search: window.location.search });
  }, [pathname]);


  // Over the dark home hero the header is transparent with light content and the
  // light logo. Once scrolled (or with the mobile menu open) it becomes a solid
  // white pill with dark content, on every page.
  const overHero = resolved.path === '/' && !isScrolled && !isMenuOpen && !heroIsLight;
  const showChrome = isScrolled || isMenuOpen;

  const isActive = (path) => {
    const [base, query] = path.split('?');
    if (query) return resolved.path === base && resolved.search.includes(query);
    if (base === '/products') return resolved.path.startsWith('/products') && !resolved.search.includes('new-arrivals');
    return resolved.path === base || resolved.path.startsWith(`${base}/`);
  };
  const activePath = NAV_LINKS.find((l) => isActive(l.path))?.path ?? null;

  useEffect(() => {
    // Hysteresis (on past 24px, off under 8px) stops flicker at the threshold;
    // rAF keeps it to one state check per frame.
    let frame = 0;
    const sync = () => {
      frame = 0;
      const y = window.scrollY;
      setIsScrolled((prev) => (prev ? y > 8 : y > 24));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    const onBrightness = (e) => setHeroIsLight(Boolean(e.detail?.isLight));
    window.addEventListener('hero-brightness', onBrightness);
    return () => window.removeEventListener('hero-brightness', onBrightness);
  }, []);

  // Close menu on route change and on Escape
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setIsMenuOpen(false);
  }
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setIsMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  // Entrance: pill drops in, items cascade after it (once)
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const items = header.querySelectorAll('[data-nav-item]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.set(header, { opacity: 0, y: -18 });
      gsap.set(items, { opacity: 0, y: -8 });
      gsap.timeline({ delay: 0.1 })
        .to(header, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
        .to(items, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' }, '-=0.3');
    }, header);
    return () => ctx.revert();
  }, []);

  // Mobile panel expands/collapses; links cascade in
  useEffect(() => {
    const panel = mobilePanelRef.current;
    if (!panel) return;
    const items = mobileListRef.current?.querySelectorAll('[data-mobile-item]') ?? [];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.killTweensOf([panel, ...items]);
    if (reduced) {
      gsap.set(panel, { display: isMenuOpen ? 'block' : 'none', height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 });
      return;
    }
    if (isMenuOpen) {
      gsap.set(panel, { display: 'block' });
      gsap.set(items, { opacity: 0, x: -10 });
      gsap.timeline()
        .to(panel, { height: 'auto', opacity: 1, duration: 0.35, ease: 'power3.out' })
        .to(items, { opacity: 1, x: 0, duration: 0.35, stagger: 0.05, ease: 'power3.out' }, '-=0.15');
    } else {
      gsap.to(panel, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => gsap.set(panel, { display: 'none' }),
      });
    }
  }, [isMenuOpen]);

  return (
    <header
      ref={headerRef}
      className={clsx(
        'fixed inset-x-4 top-4 z-99 mx-auto w-auto max-w-[calc(100vw-2rem)] border lg:w-fit transition-[background-color,border-color,box-shadow] duration-300 sm:inset-x-10 sm:top-5',
        showChrome
          ? 'border-border bg-background text-foreground shadow-float'
          : clsx('border-transparent bg-transparent shadow-none', overHero ? 'text-white' : 'text-foreground'),
        isMenuOpen ? 'flex flex-col rounded-[28px]' : 'flex flex-col rounded-full'
      )}
    >
      <nav className="mx-auto flex h-16 w-full items-center justify-between gap-6 px-5 sm:px-8 lg:h-[76px] lg:pl-7 lg:pr-5 xl:gap-10">
        {/* Logo */}
        <Link
          href="/"
          data-nav-item
          aria-label="Cinema Focus Home"
          className="relative block h-12 w-40 shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-48 lg:h-14 lg:w-48"
        >
          <Image
            src={logoLight}
            alt="Cinema Focus"
            fill
            priority
            sizes="256px"
            className={clsx('object-contain object-left transition-opacity duration-300', overHero ? 'opacity-100' : 'opacity-0')}
          />
          <Image
            src={logo}
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="256px"
            className={clsx('object-contain object-left transition-opacity duration-300', overHero ? 'opacity-0' : 'opacity-100')}
          />
        </Link>

        {/* Desktop nav */}
        {showDesktopMenu && (
          <ul
            ref={navListRef}
            onMouseLeave={() => setPill((p) => ({ ...p, show: false }))}
            className="relative hidden items-center gap-0.5 lg:flex"
          >
            <span
              aria-hidden="true"
              className={clsx(
                'pointer-events-none absolute inset-y-0 my-auto h-10 rounded-full transition-[left,width,opacity] duration-300 ease-settle',
                overHero ? 'bg-white/15' : 'bg-secondary',
                pill.show ? 'opacity-100' : 'opacity-0'
              )}
              style={{ left: pill.left, width: pill.width }}
            />
            {NAV_LINKS.map((link) => {
              const active = activePath === link.path;
              return (
                <li key={link.name} data-nav-item onMouseEnter={movePill} onFocus={movePill}>
                  <Link
                    href={link.path}
                    data-path={link.path}
                    aria-current={active ? 'page' : undefined}
                    className={clsx(
                      'group relative flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm font-bold uppercase tracking-widest transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                      overHero
                        ? clsx('hover:text-white', active ? 'text-white' : 'text-white/75')
                        : clsx('hover:text-foreground', active ? 'text-foreground' : 'text-foreground/70')
                    )}
                  >
                    {link.isNew && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal" />}
                    {link.name}
                    <span
                      aria-hidden="true"
                      className={clsx(
                        'absolute inset-x-3 bottom-0.5 h-0.5 origin-center rounded-full bg-current transition-transform duration-300 ease-settle',
                        active ? 'scale-x-100' : 'scale-x-0'
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* Showroom CTA (desktop) */}
        {showDesktopMenu && (
          <Link
            href="/location"
            data-nav-item
            className={clsx(
              'group hidden h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-bold uppercase tracking-widest transition-colors xl:inline-flex',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              overHero ? 'bg-white text-black hover:bg-white/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
          >
            Visit showroom
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        )}

        {/* Mobile toggle */}
        <button
          type="button"
          data-nav-item
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsMenuOpen((v) => !v)}
          className={clsx(
            '-mr-2 flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:hidden',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            overHero ? 'hover:bg-white/10' : 'hover:bg-secondary'
          )}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
      </nav>

      {/* Mobile panel */}
      <div id="mobile-nav" ref={mobilePanelRef} className="hidden w-full overflow-hidden lg:hidden" style={{ height: 0, opacity: 0 }}>
        <ul ref={mobileListRef} className={clsx('flex flex-col border-t px-5 pb-4 pt-2', 'border-border')}>
          {NAV_LINKS.map((link) => {
            const active = activePath === link.path;
            return (
              <li key={link.name} data-mobile-item>
                <Link
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={clsx(
                    'flex min-h-12 items-center gap-2 text-[15px] transition-colors',
                    active
                      ? 'font-medium text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.isNew && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal" />}
                  {link.name}
                  {active && <span aria-hidden="true" className="ml-auto h-1.5 w-1.5 rounded-full bg-current" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
};

export default Header;
```

### ProductCard

`components/ProductCard.jsx`

The grid card: tinted fill, no border, hover lifts the fill and adds `shadow-lift`. `is_new_launch` shows the black "New" pill. Pass `headingLevel="h2"` on listing pages so the heading order stays sequential.

```jsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useCurrency } from '../hooks/useCurrency';
import LazyImage from './LazyImage';

const ProductCard = ({ product, headingLevel: Heading = 'h3' }) => {
  const { formatPrice, showPrice } = useCurrency();
  
  if (!product) return null;

  // Resolve the best available image source:
  // 1. image_url  — explicit URL set by admin (Supabase storage or external)
  // 2. images[0]  — first image from the local images array
  // 3. Fallback   — placeholder handled by LazyImage itself
  const imageSrc = product.image_url || product.images?.[0] || null;

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full rounded-card outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
      {/* Card container — Apple uses soft bg, no visible border, just shadow on hover */}
      <div className="relative flex h-full flex-col rounded-card overflow-hidden bg-secondary/40 transition-all duration-500 ease-out group-hover:bg-secondary/70 group-hover:shadow-lift">
        {/* Image area */}
        <div className="relative aspect-square overflow-hidden p-4 pb-2 sm:p-6 sm:pb-4">
          <LazyImage
            src={imageSrc}
            alt={product.name}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            containerClassName="rounded-media bg-transparent"
            objectFit="contain"
            aspectRatio="aspect-square"
          />

          {/* New badge */}
          {product.is_new_launch && (
            <span className="absolute top-4 left-4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest bg-primary text-primary-foreground rounded-full leading-none z-10">
              New
            </span>
          )}
        </div>

        {/* Content */}
        <div className="px-4 pb-5 pt-1 sm:px-5 sm:pb-6 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {product.brand || (product.category ? product.category.replace(/-/g, ' ') : 'Audio')}
          </p>
          <Heading className="text-[15px] sm:text-base font-semibold text-foreground leading-snug line-clamp-2 sm:min-h-[2.75rem] group-hover:text-primary transition-colors duration-300">
            {product.name}
          </Heading>
          {showPrice && product.price ? (
            <p className="text-sm font-medium text-foreground/80 pt-0.5">
              {formatPrice(product.price)}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
```

### LatestShowcase

`components/LatestShowcase.jsx`

"The latest" bento: one large product and up to four compact ones, with a mouse-only spotlight. Newest first.

```jsx
"use client";

import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import LazyImage from './LazyImage';
import { useCurrency } from '@/hooks/useCurrency';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';

// Mouse-only spotlight: a soft pool of light follows the pointer across the tile, like a
// showroom spot on a shelf. Touch and keyboard users simply get the hover colour change.
const trackPointer = (e) => {
  if (e.pointerType !== 'mouse') return;
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
};

function Tile({ product, featured = false, className }) {
  const { formatPrice, showPrice } = useCurrency();
  const image = product.image_url || product.images?.[0] || null;
  const brand = product.brand || (product.category ? product.category.replace(/-/g, ' ') : 'Audio');
  const price = showPrice && product.price ? formatPrice(product.price) : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      onPointerMove={trackPointer}
      style={{ '--x': '50%', '--y': '0%' }}
      className={clsx(
        'group relative flex overflow-hidden rounded-panel bg-secondary/60 transition-colors duration-500 hover:bg-secondary',
        featured ? 'flex-col p-4 md:p-6' : 'flex-row items-center gap-4 p-4 md:gap-6 md:p-5',
        focusRing,
        className
      )}
    >
      {/* spotlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-100"
        style={{ background: 'radial-gradient(420px circle at var(--x) var(--y), rgb(255 255 255 / 0.85), transparent 70%)' }}
      />

      <div
        className={clsx(
          'relative z-10 shrink-0 overflow-hidden bg-white',
          featured ? 'flex-1 rounded-card p-6 md:p-10' : 'w-28 rounded-card p-2 sm:w-36 md:w-44 md:p-3'
        )}
      >
        <LazyImage
          src={image}
          alt={product.name}
          aspectRatio={featured ? 'aspect-[4/3] md:aspect-auto md:h-full md:min-h-[320px]' : 'aspect-square'}
          objectFit="contain"
          containerClassName="bg-transparent"
          className="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        {product.is_new_launch && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs font-medium shadow-float">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal" />
            New
          </span>
        )}
      </div>

      <div className={clsx('relative z-10 min-w-0', featured ? 'mt-5 flex items-end justify-between gap-6 px-2 pb-2 md:mt-6' : 'flex-1')}>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{brand}</p>
          <h3 className={clsx('mt-1 font-medium tracking-tight text-foreground', featured ? 'text-2xl leading-tight md:text-4xl' : 'line-clamp-2 text-lg leading-snug md:text-xl')}>
            {product.name}
          </h3>
          {featured && product.short_description && (
            <p className="mt-3 line-clamp-2 max-w-xl leading-relaxed text-muted-foreground">{product.short_description}</p>
          )}
          {price && <p className="mt-3 text-sm font-medium">{price}</p>}
        </div>

        <span
          aria-hidden="true"
          className={clsx(
            'flex shrink-0 items-center justify-center rounded-full bg-background transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground',
            featured ? 'h-12 w-12' : 'ml-auto hidden h-10 w-10 sm:flex'
          )}
        >
          <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

/**
 * "The latest": one large featured product beside up to four compact ones, newest first.
 * Falls back gracefully for fewer products.
 */
export default function LatestShowcase({ products = [] }) {
  const [first, ...rest] = products.slice(0, 5);
  if (!first) return null;

  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-12">
      <Tile product={first} featured className={rest.length === 0 ? 'lg:col-span-12' : 'lg:col-span-7'} />
      {rest.length > 0 && (
        <div className="flex flex-col gap-4 md:gap-6 lg:col-span-5">
          {rest.map((p) => (
            <Tile key={p.slug} product={p} className="flex-1" />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Listing page: sticky search and brand chips

From `app/(public)/products/ProductsClient.jsx`. This block goes inside your products page component. It expects `searchQuery`/`setSearchQuery`, `filterTabs` (`{ key, label, imageSrc?, count?, onClick }`), `activeCategory`, `filtersRef`, `filtersSticky` and a `focusRing` string constant:

```jsx
const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';
```

```jsx
{/* ── Sticky filter bar: search + brand chips ──────────────────── */}
<div
  ref={filtersRef}
  className={clsx(
    'sticky top-[88px] z-40 w-full bg-background transition-shadow duration-300 lg:top-[104px]',
    filtersSticky ? 'shadow-[0_1px_0_0_hsl(var(--border))]' : ''
  )}
>
  <div className="mx-auto max-w-7xl space-y-3 px-4 py-3 md:px-8">
    <div className="relative max-w-md">
      <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        aria-label="Search products"
        placeholder="Search products"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={clsx(
          'h-11 w-full rounded-full bg-secondary pl-11 pr-11 text-base outline-none transition-colors placeholder:text-muted-foreground focus:bg-secondary/70 md:text-sm',
          '[&::-webkit-search-cancel-button]:hidden',
          focusRing
        )}
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          aria-label="Clear search"
          className={clsx('absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground', focusRing)}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>

    <div role="group" aria-label="Filter by brand" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide touch-pan-x md:-mx-8 md:px-8">
      {filterTabs.map((tab) => {
        const active = activeCategory === tab.key;
        return (
          <button
            key={tab.key}
            id={`filter-brand-${tab.key}`}
            type="button"
            aria-pressed={active}
            onClick={tab.onClick}
            className={clsx(
              'flex h-11 shrink-0 select-none items-center gap-2 rounded-full pr-4 text-sm font-medium tracking-tight transition-colors',
              tab.imageSrc ? 'pl-2' : 'pl-4',
              active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-accent',
              focusRing
            )}
          >
            {tab.imageSrc ? (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background p-1">
                <img src={tab.imageSrc} alt="" loading="lazy" className="h-full w-full object-contain" />
              </span>
            ) : tab.key === 'new-arrivals' ? (
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
            ) : null}
            <span className="whitespace-nowrap">{tab.label}</span>
            {typeof tab.count === 'number' && tab.count > 0 && (
              <span className={clsx('text-xs font-normal', active ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  </div>
</div>
```

### Product detail page

`app/(public)/products/[slug]/ProductDetailClient.jsx`

Breadcrumb, gallery with arrows and thumbnails, details, actions and specifications. Replace the three action buttons with your add-to-cart block (section 9).

```jsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import Button from '@/components/Button';
import { useCurrency } from '@/hooks/useCurrency';
import { ChevronRight, ChevronLeft, FileText } from 'lucide-react';
import LazyImage from '@/components/LazyImage';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const action = 'h-12 w-full rounded-full px-7 normal-case! tracking-tight! sm:w-auto';

export default function ProductDetailClient({ product }) {
  const { formatPrice, showPrice } = useCurrency();
  // Default to the most recently added image (last in the array) so a
  // newly uploaded image shows as the primary photo without requiring
  // the old one to be removed first.
  const [activeIndex, setActiveIndex] = useState(() =>
    product?.images?.length ? product.images.length - 1 : 0
  );

  // Reset to the newest image whenever we're showing a different product
  // (e.g. client-side navigation between product pages).
  const productKey = `${product?.id ?? ''}|${product?.slug ?? ''}`;
  const [seenProductKey, setSeenProductKey] = useState(productKey);
  if (seenProductKey !== productKey) {
    setSeenProductKey(productKey);
    setActiveIndex(product?.images?.length ? product.images.length - 1 : 0);
  }

  // Preload all gallery images in background so switching is instant
  useEffect(() => {
    if (product?.images?.length > 1) {
      product.images.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    }
  }, [product]);

  if (!product) return null;

  const images = product.images || [];
  const hasMany = images.length > 1;
  const go = (delta) => setActiveIndex((i) => (i + delta + images.length) % images.length);
  const brandLabel = product.brand || product.category?.replace(/-/g, ' ');
  const specs = product.specifications || [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 md:px-8 md:pb-24 md:pt-40">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground md:mb-8">
        <Link href="/products" className="transition-colors hover:text-foreground">Products</Link>
        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
        {product.category && (
          <>
            <Link href={`/brand/${product.category}`} className={clsx('transition-colors hover:text-foreground', !product.brand && 'capitalize')}>
              {brandLabel}
            </Link>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
          </>
        )}
        <span className="text-foreground" aria-current="page">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
        {/* Gallery */}
        <div className="h-fit space-y-4 lg:sticky lg:top-32">
          <div className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-card bg-white p-6 ring-1 ring-border/70 md:aspect-[4/3] md:p-8">
            <LazyImage
              key={activeIndex}
              src={images[activeIndex]}
              alt={product.name}
              aspectRatio="w-full h-full"
              objectFit="contain"
              priority={true}
            />

            {hasMany && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous image"
                  className={clsx(
                    'absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-float transition-opacity duration-300 md:left-4',
                    'md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100',
                    focusRing
                  )}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next image"
                  className={clsx(
                    'absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-float transition-opacity duration-300 md:right-4',
                    'md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100',
                    focusRing
                  )}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <p className="absolute bottom-3 left-3 z-20 rounded-full bg-background px-3 py-1 text-xs font-medium shadow-float md:bottom-4 md:left-4" aria-live="polite">
                  {activeIndex + 1} / {images.length}
                </p>
              </>
            )}
          </div>

          {hasMany && (
            <ul className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:gap-3">
              {images.map((img, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Show image ${idx + 1} of ${images.length}`}
                    aria-current={idx === activeIndex ? 'true' : undefined}
                    className={clsx(
                      'flex aspect-square w-full items-center justify-center overflow-hidden rounded-media bg-white p-1 ring-1 transition-all duration-300',
                      idx === activeIndex ? 'opacity-100 ring-2 ring-primary' : 'opacity-60 ring-border/70 hover:opacity-100',
                      focusRing
                    )}
                  >
                    <LazyImage
                      src={img}
                      alt=""
                      objectFit="contain"
                      aspectRatio="w-full h-full"
                      containerClassName="bg-transparent"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Details */}
        <div className="space-y-8 md:space-y-10 lg:py-2">
          <div>
            {brandLabel &&
              (product.category ? (
                <Link href={`/brand/${product.category}`} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  {brandLabel}
                </Link>
              ) : (
                <p className="text-sm font-medium text-muted-foreground">{brandLabel}</p>
              ))}
            <h1 className="mt-2 text-4xl font-medium leading-[1.1] tracking-tight text-balance md:text-5xl">{product.name}</h1>
            {showPrice && product.price && (
              <p className="mt-5 text-2xl font-medium">{formatPrice(product.price)}</p>
            )}
          </div>

          {product.longDescription && (
            <p className="max-w-[62ch] whitespace-pre-line text-base leading-relaxed text-muted-foreground md:text-lg">
              {product.longDescription}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/contact" className={action}>Enquire about this product</Button>
            <Button href="/location" variant="outline" className={action}>Visit showroom</Button>
            {product.catalogUrl && (
              <Button
                href={product.catalogUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                className={clsx(action, 'gap-2')}
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                Download catalogue
              </Button>
            )}
          </div>

          {/* Specs */}
          {specs.length > 0 && (
            <section className="border-t border-border pt-8">
              <h2 className="mb-4 text-xl font-medium md:text-2xl">Specifications</h2>
              <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
                {specs.map((spec, idx) => (
                  <div key={idx} className="border-b border-border py-4">
                    <dt className="mb-1 text-sm text-muted-foreground">{spec.key === 'Category' ? 'Brand category' : spec.key}</dt>
                    <dd className="text-base font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
```

## 5. Patterns worth copying

- **Pill row, not tiles, for filters.** Chips are `h-11 rounded-full`, black when active, grey when not, with a small round logo and a count.
- **Sticky bar is solid.** `bg-background` plus a hairline once stuck. No blur anywhere.
- **Captions on photos are white pills** with `shadow-float`, never text on a dark gradient.
- **Always-visible controls on touch.** Arrows and captions that only appear on hover also have a touch fallback (`md:opacity-0 md:group-hover:opacity-100`).
- **Empty states are a soft panel** (`rounded-panel bg-secondary/40`) with one sentence and one pill button.
- **Skeletons** use `bg-secondary/60` (never `white/10`, which is invisible on a white page).

## 6. Motion

| Where | What |
|---|---|
| Header | GSAP, `power3.out`, 0.6s, stagger 0.06. Once per load. Skipped for `prefers-reduced-motion`. |
| Card image | `scale-[1.04]`–`[1.06]`, `duration-700 ease-out` on hover |
| Pills and chips | `transition-colors`, 200ms |
| Nav underline | `scaleX` over 300ms with `ease-settle` |

Every animation must honour `prefers-reduced-motion`.

## 7. Accessibility checklist

- Visible focus on every control (see `focusRing`).
- Icon-only buttons have `aria-label`.
- Filter chips use `aria-pressed`. The gallery thumbnails use `aria-current`.
- Image `alt` is the product name for the main image and `""` for decorative thumbnails.
- Prices and counts are text, never part of an image.

## 8. Do not

- No colour other than black, white, greys, `signal` and `danger`.
- No uppercase eyebrows, numbered markers on non-sequences, or `→` appended to labels (use the arrow icon).
- No blur (`backdrop-blur`) on the header or sticky bars.
- No card borders at rest.
- No emoji as icons.

## 9. Ecommerce additions (new code, not yet on the brand site)

The brand site sells by enquiry, so it has no cart. These three pieces follow the same rules and use only the components above. They are untested in a running store.

`components/CartButton.jsx` for the header, next to the nav:

```jsx
"use client";
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function CartButton({ count = 0 }) {
  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
      className="relative flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <ShoppingBag className="h-5 w-5" aria-hidden="true" />
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-medium text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
```

`components/QuantityStepper.jsx`:

```jsx
"use client";
import { Minus, Plus } from 'lucide-react';

export default function QuantityStepper({ value, onChange, min = 1, max = 10 }) {
  const step = (d) => onChange(Math.min(max, Math.max(min, value + d)));
  const btn = 'flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-accent disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';
  return (
    <div className="inline-flex items-center rounded-full bg-secondary" role="group" aria-label="Quantity">
      <button type="button" className={btn} onClick={() => step(-1)} disabled={value <= min} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
      <span className="min-w-8 text-center text-sm font-medium" aria-live="polite">{value}</span>
      <button type="button" className={btn} onClick={() => step(1)} disabled={value >= max} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
    </div>
  );
}
```

`components/AddToCart.jsx`, to replace the action buttons on the product page. One primary button per view; the second action is a quiet outline:

```jsx
"use client";
import { useState } from 'react';
import { Check } from 'lucide-react';
import clsx from 'clsx';
import QuantityStepper from './QuantityStepper';

const pill = 'inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-medium tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export default function AddToCart({ onAdd, secondary }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const add = async () => {
    await onAdd(qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <QuantityStepper value={qty} onChange={setQty} />
      <button type="button" onClick={add} className={clsx(pill, 'w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto')}>
        {added ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
        <span aria-live="polite">{added ? 'Added to cart' : 'Add to cart'}</span>
      </button>
      {secondary}
    </div>
  );
}
```

Price on the product page stays `text-2xl font-medium`. Show "Price inclusive of GST. Shipping extra." as `text-sm text-muted-foreground` under it when that is true for the product.
