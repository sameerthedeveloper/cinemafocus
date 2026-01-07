import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
const logo = '/images/logo.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
        // Light mode: bg-white/70
        isScrolled ? 'bg-white/70 backdrop-blur-xl py-3 border-b border-black/5' : 'bg-transparent py-5'
      )}
    >
      <div className="container px-6 mx-auto  flex items-center">
        {/* Logo - Left aligned, No text, Icon source */}
        <Link to="/" className="block hover:opacity-80 transition-opacity">
          <img 
            src={logo} 
            alt="Cinema Focus" 
            className="h-15 w-auto object-contain" 
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
