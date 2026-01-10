import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
const logo = '/images/logo.png';

const Footer = () => {
  const [footerData, setFooterData] = useState({
    address: '123 Audio Lane, Sound City, SC 90210',
    phone: '+1 (555) 123-4567',
    email: 'contact@cinemafocus.com',
    facebook: '#',
    instagram: '#',
    twitter: '#'
  });

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const docRef = doc(db, 'site_content', 'footer');
        const docSnap = await getDoc(docRef);
          
        if (docSnap.exists()) {
          // Merge with defaults to prevent missing fields issues
          setFooterData(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };
    fetchFooter();
  }, []);

  return (
    <footer className="bg-card border-t border-border mt-auto pt-16 pb-8">
      <div className="container px-4 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Brand Column */}
        <div className="space-y-4">
          <Link to="/" className="block mb-4" aria-label="Cinema Focus Home">
            <img src={logo} alt="Cinema Focus Logo" className="h-24 w-auto mix-blend-multiply dark:mix-blend-normal object-contain" />
          </Link>
          <p className="text-muted-foreground leading-relaxed">
            Immerse yourself in every note. We curate the finest audio and home cinema systems for the ultimate listening experience.
          </p>
          <div className="flex space-x-4 pt-2">
            {footerData.facebook && <a href={footerData.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={20} /></a>}
            {footerData.instagram && <a href={footerData.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={20} /></a>}
            {footerData.twitter && <a href={footerData.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={20} /></a>}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-primary font-medium tracking-widest uppercase mb-6">Explore</h3>
          <ul className="space-y-3">
            <li><Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">All Products</Link></li>
            <li><Link to="/gallery" className="text-muted-foreground hover:text-primary transition-colors">Gallery</Link></li>
            <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-primary font-medium tracking-widest uppercase mb-6">Categories</h3>
          <ul className="space-y-3">
            <li><Link to="/products?category=speakers" className="text-muted-foreground hover:text-primary transition-colors">Speakers</Link></li>
            <li><Link to="/products?category=subwoofers" className="text-muted-foreground hover:text-primary transition-colors">Subwoofers</Link></li>
            <li><Link to="/products?category=amplifiers" className="text-muted-foreground hover:text-primary transition-colors">Amplifiers</Link></li>
            <li><Link to="/products?category=turntables" className="text-muted-foreground hover:text-primary transition-colors">Turntables</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-primary font-medium tracking-widest uppercase mb-6">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-muted-foreground">
              <MapPin size={20} className="text-primary shrink-0 mt-1" />
              <span>{footerData.address}</span>
            </li>
            <li className="flex items-start gap-3 text-muted-foreground">
              <Phone size={20} className="text-primary shrink-0 mt-1" />
              <div className="space-y-1">
                {(footerData.phones || [footerData.phone]).map((p, i) => (
                  <div key={i}>{p}</div>
                ))}
              </div>
            </li>
            <li className="flex items-center gap-3 text-muted-foreground">
              <Mail size={20} className="text-primary shrink-0" />
              <span>{footerData.email}</span>
            </li>
            <li className="flex items-start gap-3 text-muted-foreground">
              <Clock size={20} className="text-primary shrink-0 mt-1" />
              <div className="whitespace-pre-wrap">{footerData.workingHours || "Mon - Fri: 10am - 7pm\nSat - Sun: 11am - 5pm"}</div>
            </li>
          </ul>
        </div>
      </div>

      <div className="container px-4 mx-auto border-t border-border pt-8 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Cinema Focus. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
