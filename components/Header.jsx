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

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const pathname = usePathname();
  const { theme, showDesktopMenu } = useSiteSettings();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isHome = pathname === '/';

  // Text/icon color: follows theme or transparent-header state
  const useLightContent = theme === 'dark' || (isHome && !isScrolled);
  // Logo swap: ONLY based on whether header is transparent over dark hero
  // theme must NOT override — white logo on white bg = invisible
  const useLightLogo = isHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // GSAP Animation for Mobile Menu
  useEffect(() => {
    if (menuRef.current) {
      if (isMenuOpen) {
        gsap.to(menuRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          pointerEvents: "auto",
        });
      } else {
        gsap.to(menuRef.current, {
          y: -50,
          opacity: 0,
          duration: 0.4,
          ease: "power3.in",
          pointerEvents: "none",
        });
      }
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'New Launches', path: '/products?category=new-arrivals' },
    { name: 'Products', path: '/products' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Press Room', path: '/press' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-99 transition-all duration-500 ease-in-out',
        // Mobile: Always visible background
        'bg-background m-3 rounded-3xl py-3 shadow gap-8 border border-gray-300',
        // Desktop: Dynamic based on scroll
        isScrolled 
          ? 'md:bg-background md:backdrop-blur-2xl md:m-3 md:rounded-4xl md:border md:border-gray-300 md:shadow-lg md:py-3' 
          : 'md:bg-transparent md:py-5 md:border-transparent md:m-3 md:rounded-4xl md:shadow-none md:backdrop-blur-none'
      )}
    >
      <div className="container px-6 mx-auto flex items-center justify-between ">
        {/* Logo */}
        <Link href="/" className="block hover:opacity-80 transition-opacity z-50" aria-label="Cinema Focus Home">
          {/* Mobile Logo — always dark logo (mobile header always has white bg) */}
          <div className="h-10 w-48 relative md:hidden">
            <Image
              src={logo}
              alt="Cinema Focus Logo"
              fill
              priority
              className="object-contain object-left"
              sizes="240px"
            />
          </div>
          
          {/* Desktop Logo (Dynamic) */}
          <div className={clsx(
              "hidden md:block relative transition-all duration-500",
              useLightLogo ? "h-14 md:h-16 w-64 " : "h-10 md:h-12 w-48"
            )}>
            {/* Light Logo (used on home hero) */}
            <Image
              src={logoLight}
              alt="Cinema Focus Logo Light"
              fill
              priority
              className={clsx(
                "object-contain object-left transition-opacity duration-500",
                useLightLogo ? "opacity-100" : "opacity-0"
              )}
              sizes="300px"
            />
            {/* Dark Logo (used when scrolled or on other pages) */}
            <Image
              src={logo}
              alt="Cinema Focus Logo Dark"
              fill
              priority
              className={clsx(
                "object-contain object-left transition-opacity duration-500",
                useLightLogo ? "opacity-0" : "opacity-100"
              )}
              sizes="300px"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        {showDesktopMenu && (
          <nav className="hidden md:flex justify-between items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.path} 
                className={clsx(
                  "text-sm font-bold transition-all uppercase tracking-widest border-b-2 border-transparent",
                  useLightContent 
                    ? "text-white hover:text-red-500 hover:border-red-500" 
                    : "text-foreground hover:text-red-600 hover:border-red-600"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        )}

        {/* Mobile Menu Toggle - Hidden on Desktop */}
        <button 
          className={clsx(
            "md:hidden z-50 p-2 -mr-2 transition-colors",
            useLightContent ? "text-black" : "text-foreground"
          )}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Fullscreen Menu - Hidden on Desktop */}
        <div 
          ref={menuRef}
          className="fixed inset-0 mt-65 bg-background backdrop-blur-2xl z-40 flex flex-col items-center justify-center md:hidden  rounded-xl  opacity-0 pointer-events-none border-2 "
          style={{ transform: 'translateY(-50px)' }}
        >
          <nav className="flex  flex-col items-start p-7 rounded-4xl bg-background w-full gap-8 border border-gray-300 shadow mt-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.path} 
                onClick={() => setIsMenuOpen(false)}
                className="text-xl font-medium text-foreground hover:text-primary transition-colors tracking-tight"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
