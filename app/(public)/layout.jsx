"use client";

import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { createClient } from '@/lib/supabase/client';
import { Loader2, Hammer, Mail, PhoneCall } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';

const logo = '/images/logo.png';
const logoLight = '/images/logo-light.webp';

export default function PublicLayout({ children }) {
  const [maintenance, setMaintenance] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function checkMaintenance() {
      try {
        let { data, error } = await supabase
          .from('site_settings')
          .select('data')
          .eq('id', 'maintenance')
          .single();

        let settings = data?.data;
        if (error && error.code === 'PGRST205') {
          const fallback = await supabase
            .from('site_content')
            .select('data')
            .eq('id', 'maintenance')
            .single();
          settings = fallback.data?.data;
        }

        if (settings) {
          setMaintenance(settings);
        }
      } catch (e) {
        console.error("Error loading maintenance mode settings:", e);
      } finally {
        setLoading(false);
      }
    }
    checkMaintenance();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-zinc-400">
        <Loader2 className="animate-spin text-primary mb-4" size={28} />
        <span className="text-xs font-semibold tracking-widest uppercase">Loading acoustic workspace...</span>
      </div>
    );
  }

  // Determine if we should show the maintenance mode
  const isLocal = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.')
  );

  const shouldShowMaintenance = maintenance?.enabled && (!isLocal || maintenance?.activeInDev);

  if (shouldShowMaintenance) {
    const useLightContent = true;
    return (
      <div className="bg-[#0a0a0a] text-white flex flex-col justify-between min-h-screen px-6 py-12 relative overflow-hidden select-none">
        
        {/* Soft background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        
        {/* Top brand header */}
        <div className="max-w-4xl mx-auto w-full z-10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            
            <Link href="/" className="block hover:opacity-80 transition-opacity z-50" aria-label="Cinema Focus Home">
          <div className={clsx(
              "block relative transition-all duration-500",
              useLightContent ? "h-14 md:h-16 w-64" : "h-10 md:h-12 w-48"
            )}>
            <Image 
              src={useLightContent ? logoLight : logo} 
              alt="Cinema Focus Logo" 
              fill
              priority
              className="object-contain object-left"
              sizes="300px"
            />
          </div>
        </Link>
          </div>
          <span className="text-[10px] md:text-xs text-zinc-400 border border-zinc-800 rounded-full px-4 py-1.5 bg-zinc-900/40 backdrop-blur-md flex items-center gap-1.5">
            <Hammer size={12} className="text-amber-500 animate-bounce" />
            Website Upgrade
          </span>
        </div>

        {/* Central visual statement */}
        <div className="max-w-2xl mx-auto w-full text-center my-auto z-10 space-y-6 pt-12 md:pt-0">
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-white leading-tight">
            {maintenance.title || "Refining the Sound."}
          </h1>
          <p className="text-sm md:text-base text-zinc-400 font-light leading-relaxed max-w-xl mx-auto">
            {maintenance.message || "We are currently upgrading our digital showroom to bring you a state-of-the-art visual and acoustic catalog. Please visit us again shortly."}
          </p>
          <div className="h-px w-16 bg-zinc-800 mx-auto my-8" />
        </div>

        {/* Footer and contact information */}
        <div className="max-w-4xl mx-auto w-full z-10 text-center space-y-6">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-xs text-zinc-500">
            <a href="mailto:support@cinemafocus.in" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Mail size={14} /> support@cinemafocus.in
            </a>
            <span className="hidden md:inline text-zinc-800">•</span>
            <a href="tel:+96899999999" className="hover:text-white transition-colors flex items-center gap-1.5">
              <PhoneCall size={14} /> Contact Advisor
            </a>
          </div>
          
          <div className="text-[10px] text-zinc-700">
            © {new Date().getFullYear()} Cinema Focus. All rights reserved.
            {isLocal && (
              <div className="mt-3">
                <Link href="/admin" className="text-zinc-600 hover:text-white transition-colors underline font-medium">
                  Return to Admin Dashboard (Local)
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="flex-grow flex flex-col pt-0">
         {children}
      </main>
      <Footer />
    </>
  );
}
