import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';
const logo = '/images/logo.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    { name: 'Products', path: '/products' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
        // Mobile: Always visible background
        'bg-white/70 backdrop-blur-xl py-3 border-b border-black/5',
        // Desktop: Dynamic based on scroll
        isScrolled 
          ? 'md:bg-white/70 md:backdrop-blur-2xl md:shadow-sm md:py-3' 
          : 'md:bg-transparent md:py-5 md:border-none md:backdrop-blur-none'
      )}
    >
      <div className="container px-6 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="block hover:opacity-80 transition-opacity z-50">
          <img 
            src={logo} 
            alt="Cinema Focus" 
            className="h-10 md:h-12 w-auto object-contain" 
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-widest"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden z-50 p-2 -mr-2 text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Fullscreen Menu */}
        <div 
          className={clsx(
            "fixed top-50  inset-0 bg-white backdrop-blur-2xl z-40 flex flex-col items-center justify-center transition-all duration-500 ease-in-out md:hidden",
            isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <nav className="flex  flex-col items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-medium text-foreground hover:text-primary transition-colors tracking-tight"
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
