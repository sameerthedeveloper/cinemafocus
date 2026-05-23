"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, LayoutDashboard, Package, ArrowLeft, Settings, Tag, Users, MessageSquare, Image, Search, Newspaper, Sparkles, Menu, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import clsx from 'clsx';
import logoPng from '@/assets/images/logo.png';


export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      // Sandbox Backdoor: Check for offline bypass session first
      if (typeof window !== 'undefined') {
        const bypassSessionRaw = localStorage.getItem('sb-bypass-session');
        if (bypassSessionRaw) {
          try {
            const bypassSession = JSON.parse(bypassSessionRaw);
            if (bypassSession.expires_at > Math.floor(Date.now() / 1000)) {
              setSession(bypassSession);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error(e);
          }
        }
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/admin/login');
        } else {
          setSession(session);
        }
      } catch (err) {
        console.error("Supabase getSession failed:", err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
      } else {
        // If there's a local storage session, keep it
        const bypassSessionRaw = localStorage.getItem('sb-bypass-session');
        if (bypassSessionRaw) {
          try {
            const bypassSession = JSON.parse(bypassSessionRaw);
            if (bypassSession.expires_at > Math.floor(Date.now() / 1000)) {
              setSession(bypassSession);
              return;
            }
          } catch (e) {}
        }
        setSession(null);
        router.push('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sb-bypass-session');
    }
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    router.push('/admin/login');
  };

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Products", path: "/admin/products", icon: Package },
    { label: "New Launches", path: "/admin/new-launches", icon: Sparkles },
    { label: "Press Releases", path: "/admin/press-releases", icon: Newspaper },
    { label: "Brands", path: "/admin/categories", icon: Tag },
    { label: "Gallery", path: "/admin/gallery", icon: Image },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Messages", path: "/admin/messages", icon: MessageSquare },
    { label: "SEO", path: "/admin/seo", icon: Search },
    { label: "Site Control", path: "/admin/site-control", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col md:flex-row">
      <div className="md:hidden bg-background border-b border-border p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
         <div className="flex items-center gap-3">
             <img src={logoPng.src} alt="Cinema Focus" className="h-10 w-auto" />
             <span className="font-medium text-sm text-foreground uppercase tracking-widest">Admin</span>
         </div>
         <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2 text-foreground hover:bg-secondary rounded-lg">
             <Menu size={24} />
         </button>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside 
        className={clsx(
            "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 md:left-auto md:bottom-auto md:h-screen shadow-2xl md:shadow-none",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
           <div className="flex items-center gap-3">
             <img src={logoPng.src} alt="Cinema Focus Admin" className="h-10 w-auto" />
             <span className="font-medium text-sm text-muted-foreground uppercase tracking-widest">Admin</span>
           </div>
           <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-muted-foreground hover:text-foreground">
             <X size={20} />
           </button>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
            
            return (
              <Link 
                key={item.path} 
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border space-y-2 mt-auto">
           <Link 
             href="/" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
           >
              <ArrowLeft size={18} />
              Back to Site
           </Link>
           <button 
             onClick={handleLogout}
             type="button"
             className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
           >
             <svg 
               xmlns="http://www.w3.org/2000/svg" 
               width="18" 
               height="18" 
               viewBox="0 0 24 24" 
               fill="none" 
               stroke="currentColor" 
               strokeWidth="2" 
               strokeLinecap="round" 
               strokeLinejoin="round" 
               className="lucide lucide-log-out"
             >
               <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
               <polyline points="16 17 21 12 16 7" />
               <line x1="21" x2="9" y1="12" y2="12" />
             </svg>
             Logout
           </button>
        </div>
      </aside>

      <main className="flex-1 bg-background h-[calc(100vh-64px)] md:h-screen overflow-y-auto w-full p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
