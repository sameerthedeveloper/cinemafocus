"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { getFooter } from '@/lib/db';
import { createClient } from '@/lib/supabase/client';

// Brand Social Icons as inline SVGs
const FacebookIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const InstagramIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const TwitterIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const logo = '/images/logo-light.webp';

const Footer = () => {
  const [footerData, setFooterData] = useState({
    address: '123 Audio Lane, Sound City, SC 90210',
    phone: '+1 (555) 123-4567',
    email: 'contact@cinemafocus.com',
    facebook: '#',
    instagram: '#',
    twitter: '#'
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const data = await getFooter(supabase);
        if (data) {
          // Merge with defaults to prevent missing fields issues
          setFooterData(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };
    fetchFooter();
  }, []);

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 mt-auto pt-16 pb-8">
      <div className="container px-4 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 text-center md:text-left">
        {/* Brand Column */}
        <div className="space-y-4 flex flex-col items-center md:items-start">
          <Link href="/" className="block mb-4" aria-label="Cinema Focus Home">
            <img src={logo} alt="Cinema Focus Logo" width="240" height="71" className="h-24 w-auto dark:mix-blend-normal object-contain" />
          </Link>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Immerse yourself in every note. We curate the finest audio and home cinema systems for the ultimate listening experience.
          </p>
          <div className="flex space-x-4 pt-2 justify-center md:justify-start text-white/40">
            {footerData.facebook && <a href={footerData.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-primary transition-colors"><FacebookIcon size={20} /></a>}
            {footerData.instagram && <a href={footerData.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary transition-colors"><InstagramIcon size={20} /></a>}
            {footerData.twitter && <a href={footerData.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-primary transition-colors"><TwitterIcon size={20} /></a>}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-primary font-medium tracking-widest uppercase mb-6 text-xs transition-opacity opacity-70">Explore</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">All Products</Link></li>
            <li><Link href="/gallery" className="text-muted-foreground hover:text-primary transition-colors">Gallery</Link></li>
            <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-primary font-medium tracking-widest uppercase mb-6 text-xs transition-opacity opacity-70">Categories</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/products?category=speakers" className="text-muted-foreground hover:text-primary transition-colors">Speakers</Link></li>
            <li><Link href="/products?category=subwoofers" className="text-muted-foreground hover:text-primary transition-colors">Subwoofers</Link></li>
            <li><Link href="/products?category=amplifiers" className="text-muted-foreground hover:text-primary transition-colors">Amplifiers</Link></li>
            <li><Link href="/products?category=turntables" className="text-muted-foreground hover:text-primary transition-colors">Turntables</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-primary font-medium tracking-widest uppercase mb-6 text-xs transition-opacity opacity-70">Contact Us</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3 text-muted-foreground justify-center md:justify-start">
              <MapPin size={20} className="text-primary shrink-0 mt-1" />
              <span>{footerData.address}</span>
            </li>
            <li className="flex items-start gap-3 text-muted-foreground justify-center md:justify-start">
              <Phone size={20} className="text-primary shrink-0 mt-1" />
              <div className="space-y-1">
                {(footerData.phones || [footerData.phone]).map((p, i) => (
                  <div key={i}>{p}</div>
                ))}
              </div>
            </li>
            <li className="flex items-center gap-3 text-muted-foreground justify-center md:justify-start">
              <Mail size={20} className="text-primary shrink-0" />
              <span>{footerData.email}</span>
            </li>
            <li className="flex items-start gap-3 text-muted-foreground justify-center md:justify-start">
              <Clock size={20} className="text-primary shrink-0 mt-1" />
              <div className="whitespace-pre-wrap">{footerData.workingHours || "Mon - Fri: 10am - 7pm\nSat - Sun: 11am - 5pm"}</div>
            </li>
          </ul>
        </div>
      </div>

      <div className="container px-4 mx-auto border-t border-border pt-8 text-center text-muted-foreground text-xs uppercase tracking-widest font-light">
        <p>&copy; {new Date().getFullYear()} Cinema Focus. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
