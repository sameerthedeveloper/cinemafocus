"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Menu, X, Search, ShoppingBag, User } from 'lucide-react';

/**
 * Store header: the Cinema Focus floating pill, with search, account and cart.
 * Needs: Inter, Tailwind tokens from design.md (bg-background, border-border, bg-secondary,
 * bg-primary, shadow-float, ease-settle, bg-signal), lucide-react, clsx, next/image.
 * Put /public/images/logo.png in the project, or pass `logo`.
 *
 *   <StoreHeader cartCount={cart.count} />
 */
const DEFAULT_LINKS = [
  { name: 'New in', path: '/shop?sort=new', isNew: true },
  { name: 'Shop', path: '/shop' },
  { name: 'Brands', path: '/brands' },
  { name: 'Support', path: '/support' },
];

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';

function IconLink({ href, label, children, badge }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={clsx('relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary', focusRing)}
    >
      {children}
      {badge > 0 && (
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold tabular-nums text-primary-foreground">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
}

export default function StoreHeader({ links = DEFAULT_LINKS, cartCount = 0, logo = '/images/logo.png', searchHref = '/search', accountHref = '/account', cartHref = '/cart' }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpenOn, setMenuOpenOn] = useState(null); // path the menu was opened on, so a route change closes it
  const isMenuOpen = menuOpenOn === pathname;

  // Solid pill once the page scrolls. On at 24px, off under 8px, so it never flickers at the edge.
  useEffect(() => {
    let frame = 0;
    const sync = () => {
      frame = 0;
      const y = window.scrollY;
      setIsScrolled((prev) => (prev ? y > 8 : y > 24));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(sync); };
    sync();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMenuOpenOn(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  const isActive = (path) => {
    const base = path.split('?')[0];
    return pathname === base || pathname.startsWith(`${base}/`);
  };
  const activePath = links.find((l) => !l.path.includes('?') && isActive(l.path))?.path ?? null;
  const solid = isScrolled || isMenuOpen;

  return (
    <header
      className={clsx(
        'fixed inset-x-4 top-4 z-50 mx-auto flex w-auto max-w-[calc(100vw-2rem)] flex-col border transition-[background-color,border-color,box-shadow] duration-300 sm:inset-x-10 sm:top-5 lg:w-fit',
        solid ? 'border-border bg-background shadow-float' : 'border-transparent bg-background/0 shadow-none',
        isMenuOpen ? 'rounded-[28px]' : 'rounded-full'
      )}
    >
      <nav className="mx-auto flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:gap-8 lg:pl-7 lg:pr-3">
        <Link href="/" aria-label="Home" className={clsx('relative block h-10 w-36 shrink-0 rounded-full sm:w-44', focusRing)}>
          <Image src={logo} alt="Cinema Focus" fill priority sizes="200px" className="object-contain object-left" />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active = activePath === link.path;
            return (
              <li key={link.name}>
                <Link
                  href={link.path}
                  aria-current={active ? 'page' : undefined}
                  className={clsx(
                    'group relative flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-medium tracking-tight transition-colors hover:bg-secondary',
                    active ? 'text-foreground' : 'text-foreground/70 hover:text-foreground',
                    focusRing
                  )}
                >
                  {link.isNew && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal" />}
                  {link.name}
                  <span
                    aria-hidden="true"
                    className={clsx('absolute inset-x-4 bottom-1 h-0.5 origin-center rounded-full bg-current transition-transform duration-300 ease-settle', active ? 'scale-x-100' : 'scale-x-0')}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <IconLink href={searchHref} label="Search"><Search className="h-[18px] w-[18px]" /></IconLink>
          <span className="hidden sm:block"><IconLink href={accountHref} label="Account"><User className="h-[18px] w-[18px]" /></IconLink></span>
          <IconLink href={cartHref} label={cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart'} badge={cartCount}>
            <ShoppingBag className="h-[18px] w-[18px]" />
          </IconLink>
          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="store-mobile-nav"
            onClick={() => setMenuOpenOn(isMenuOpen ? null : pathname)}
            className={clsx('flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary lg:hidden', focusRing)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile panel: grid-rows trick animates height with no JS */}
      <div id="store-mobile-nav" className={clsx('grid w-full overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-settle lg:hidden', isMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
        <ul className="min-h-0 border-t border-border px-5 pb-4 pt-2" inert={!isMenuOpen}>
          {links.map((link) => {
            const active = activePath === link.path;
            return (
              <li key={link.name}>
                <Link
                  href={link.path}
                  aria-current={active ? 'page' : undefined}
                  className={clsx('flex min-h-12 items-center gap-2 text-[15px] transition-colors', active ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground')}
                >
                  {link.isNew && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal" />}
                  {link.name}
                  {active && <span aria-hidden="true" className="ml-auto h-1.5 w-1.5 rounded-full bg-current" />}
                </Link>
              </li>
            );
          })}
          <li><Link href={accountHref} className="flex min-h-12 items-center text-[15px] text-muted-foreground hover:text-foreground">Account</Link></li>
        </ul>
      </div>
    </header>
  );
}
