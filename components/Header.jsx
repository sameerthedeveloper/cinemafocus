"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import gsap from 'gsap';
const logo = '/images/logo.png';
const logoLight = '/images/logo-light.webp';

const NAV_LINKS = [
  { name: 'New Launches', path: '/products?category=new-arrivals' },
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
        'fixed inset-x-4 top-4 z-99 mx-auto w-auto max-w-5xl border backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 sm:inset-x-10 sm:top-5',
        // Chrome (bg/border/shadow) only appears once scrolled or while the mobile menu is open;
        // content colour still follows what's behind it (dark hero vs. themed page).
        showChrome
          ? overHero
            ? 'border-white/15 bg-black/60 text-white shadow-none'
            : 'border-border bg-background/90 text-foreground shadow-[0_8px_30px_-14px_rgba(0,0,0,0.35)]'
          : clsx('border-transparent bg-transparent shadow-none backdrop-blur-none', overHero ? 'text-white' : 'text-foreground'),
        isMenuOpen ? 'flex flex-col rounded-[28px]' : 'flex flex-col rounded-full'
      )}
    >
      <nav className="mx-auto flex h-16 w-full lg:h-[76px] items-center justify-between px-5 sm:px-8 lg:pl-6 lg:pr-8">
        {/* Logo */}
        <Link
          href="/"
          data-nav-item
          aria-label="Cinema Focus Home"
          className="relative block h-12 w-52 shrink-0 lg:h-14 lg:w-60 transition-transform duration-200 hover:scale-[1.03] lg:justify-self-start"
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
          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.name} data-nav-item>
                <Link
                  href={link.path}
                  data-path={link.path}
                  aria-current={activePath === link.path ? 'page' : undefined}
                  className={clsx(
                    'border-b-2 text-sm font-bold uppercase tracking-widest transition-all',
                    activePath === link.path
                      ? 'border-red-600 text-red-600'
                      : clsx('border-transparent hover:border-red-600 hover:text-red-600', overHero ? 'text-white' : 'text-foreground')
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Mobile toggle */}
        <button
          type="button"
          data-nav-item
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsMenuOpen((v) => !v)}
          className="-m-2.5 p-2.5 lg:hidden"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
      </nav>

      {/* Mobile panel */}
      <div id="mobile-nav" ref={mobilePanelRef} className="hidden w-full overflow-hidden lg:hidden" style={{ height: 0, opacity: 0 }}>
        <ul ref={mobileListRef} className={clsx('flex flex-col gap-1 border-t px-5 pb-5 pt-4', overHero ? 'border-white/15' : 'border-border')}>
          {NAV_LINKS.map((link) => (
            <li key={link.name} data-mobile-item>
              <Link
                href={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={clsx(
                  'block py-2 text-[15px]',
                  activePath === link.path ? 'text-red-600 font-medium' : overHero ? 'text-white/80' : 'text-foreground/80'
                )}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
