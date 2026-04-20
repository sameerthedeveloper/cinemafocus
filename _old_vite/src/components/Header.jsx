import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
const logo = '/images/logo.webp';
const logoLight = '/images/logo-light.webp';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, showDesktopMenu } = useSiteSettings();
  
  const isHome = location.pathname === '/';

  // "Dark Header" State (White Logo/Text)
  // Occurs if:
  // 1. We are in Global Dark Mode (if enabled)
  // 2. OR We are on the Home Hero (unscrolled) which has a dark background even in light mode
  const useLightContent = theme === 'dark' || (isHome && !isScrolled);

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
  }, []);

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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
        // Mobile: Always visible background
        'bg-background/80 backdrop-blur-xl py-3 border-b border-border',
        // Desktop: Dynamic based on scroll
        isScrolled 
          ? 'md:bg-background/80 md:backdrop-blur-2xl md:shadow-sm md:py-3' 
          : 'md:bg-transparent md:py-5 md:border-none md:backdrop-blur-none'
      )}
    >
      <div className="container px-6 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="block hover:opacity-80 transition-opacity z-50" aria-label="Cinema Focus Home">
          {/* Mobile Logo (Always Dark/Standard) */}
          <img 
            src={logo} 
            alt="Cinema Focus Logo" 
            width="240"
            height="71"
            className="h-10 w-auto object-contain md:hidden"
          />
          
          {/* Desktop Logo (Dynamic) */}
          <img 
            src={useLightContent ? logoLight : logo} 
            alt="Cinema Focus Logo" 
            width="240"
            height="71"
            className={clsx(
              "hidden md:block w-auto object-contain transition-all duration-500",
              useLightContent ? "h-14 md:h-16" : "h-10 md:h-12"
            )}
          />
        </Link>

        {/* Desktop Nav */}
        {/* Desktop Nav - Hidden by default as per user request */}
        {showDesktopMenu && (
          <nav className="hidden items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
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
          className={clsx(
            "fixed inset-0 mt-64 bg-background backdrop-blur-2xl z-40 flex flex-col items-center justify-center transition-all duration-500 ease-in-out md:hidden",
            isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <nav className="flex  flex-col items-start p-7 bg-background w-full gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
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
