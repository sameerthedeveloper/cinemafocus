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

  const isHome = resolved.path === '/';
  // Over the dark home hero the pill is a translucent dark glass with light
  // content and the light logo; everywhere else it's a solid themed surface.
  const overHero = isHome && !isScrolled;
  const showChrome = isScrolled || isMenuOpen;

  const isActive = (path) => {
    const [base, query] = path.split('?');
    if (query) return resolved.path === base && resolved.search.includes(query);
    if (base === '/products') return resolved.path.startsWith('/products') && !resolved.search.includes('new-arrivals');
    return resolved.path === base || resolved.path.startsWith(`${base}/`);
  };
  const activePath = NAV_LINKS.find((l) => isActive(l.path))?.path ?? null;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
        'fixed inset-x-4 top-4 z-99 mx-auto w-auto max-w-6xl border transition-[background-color,border-color,box-shadow] duration-300 sm:inset-x-10 sm:top-5',
        // Chrome (bg/border/shadow) only appears once scrolled or while the mobile menu is open;
        // content colour still follows what's behind it (dark hero vs. themed page).
        showChrome
          ? overHero
            ? 'border-white/15 bg-black/85 text-white shadow-none'
            : 'border-border bg-background text-foreground shadow-float'
          : clsx('border-transparent bg-transparent shadow-none', overHero ? 'text-white' : 'text-foreground'),
        isMenuOpen ? 'flex flex-col rounded-[28px]' : 'flex flex-col rounded-full'
      )}
    >
      <nav className="mx-auto flex h-16 w-full lg:h-[76px] items-center justify-between px-5 sm:px-8 lg:pl-6 lg:pr-8">
        {/* Logo */}
        <Link
          href="/"
          data-nav-item
          aria-label="Cinema Focus Home"
          className="relative block h-12 w-44 shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-52 lg:h-14 lg:w-52"
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
                overHero ? 'bg-white/12' : 'bg-secondary',
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
                        ? clsx('hover:text-white', active ? 'text-white' : 'text-white/70')
                        : clsx('hover:text-foreground', active ? 'text-foreground' : 'text-muted-foreground')
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
              'group hidden h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-bold uppercase tracking-widest transition-colors 2xl:inline-flex',
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
        <ul ref={mobileListRef} className={clsx('flex flex-col border-t px-5 pb-4 pt-2', overHero ? 'border-white/15' : 'border-border')}>
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
                      ? clsx('font-medium', overHero ? 'text-white' : 'text-foreground')
                      : overHero ? 'text-white/70 hover:text-white' : 'text-muted-foreground hover:text-foreground'
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
