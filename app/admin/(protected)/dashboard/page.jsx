"use client";

import React, { useEffect, useState } from 'react';
import { Package, MessageSquare, Users, LayoutGrid, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "Total Products", value: "-", icon: Package, link: "/admin/products" },
    { label: "Categories", value: "-", icon: LayoutGrid, link: "/admin/categories" },
    { label: "Total Users", value: "-", icon: Users, link: "/admin/users" },
    { label: "Messages", value: "-", icon: MessageSquare, link: "/admin/messages" },
  ]);

  const supabase = createClient();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch counts using count: 'exact'
      const [products, categories, messages, users] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true })
      ]);

      setStats([
        { label: "Total Products", value: products.count || 0, icon: Package, link: "/admin/products" },
        { label: "Categories", value: categories.count || 0, icon: LayoutGrid, link: "/admin/categories" },
        { label: "Total Users", value: users.count || 0, icon: Users, link: "/admin/users" },
        { label: "Messages", value: messages.count || 0, icon: MessageSquare, link: "/admin/messages" },
      ]);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in pb-20 md:pb-8">
      <header className="mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-medium tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Quick metrics from your Supabase backend.</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-pulse">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="h-32 bg-secondary/50 rounded-2xl border border-border"></div>
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Link key={idx} href={stat.link} className="bg-background p-6 rounded-2xl border border-border shadow-sm block hover:border-primary/50 transition-all hover:-translate-y-1">
                 <div className="flex items-center justify-between mb-4">
                   <span className="text-muted-foreground text-sm font-medium">{stat.label}</span>
                   <div className="p-2 bg-primary/5 rounded-lg text-primary">
                      <Icon size={20} />
                   </div>
                 </div>
                 <div className="text-3xl font-medium">{stat.value}</div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Analytics Placeholder */}
      <div className="mt-8 md:mt-12 bg-background p-6 md:p-8 rounded-2xl border border-border shadow-sm">
         <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-medium">Real-time Activity</h2>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold bg-secondary px-2 py-1 rounded">V5 Powered</div>
         </div>
         
         <div className="h-[300px] w-full flex items-center justify-center border-t border-border pt-8">
            <div className="text-center space-y-4">
              <div className="p-4 bg-secondary/20 rounded-full inline-block">
                 <Loader2 className="animate-spin text-primary" size={32} />
              </div>
              <div>
                <p className="font-medium">Analytics Gathering</p>
                <p className="text-sm text-muted-foreground">Post-migration metrics will appear here once users begin interacting.</p>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}
