"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Settings, Tag, Users, MessageSquare, Image, Search, Newspaper, Sparkles, Route, KeyRound } from 'lucide-react';
import { createClient } from '@/lib/aws/queryClient';
import PanelShell from '@/components/panel/PanelShell';

const NAV_GROUPS = [
  { title: "Overview", items: [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  ]},
  { title: "Catalog", items: [
    { label: "Products", path: "/admin/products", icon: Package },
    { label: "New Launches", path: "/admin/new-launches", icon: Sparkles },
    { label: "Brands", path: "/admin/categories", icon: Tag },
    { label: "Gallery", path: "/admin/gallery", icon: Image },
  ]},
  { title: "Content", items: [
    { label: "Press Releases", path: "/admin/press-releases", icon: Newspaper },
    { label: "SEO", path: "/admin/seo", icon: Search },
    { label: "Custom Routes", path: "/admin/custom-routes", icon: Route },
  ]},
  { title: "Inbox", items: [
    { label: "Messages", path: "/admin/messages", icon: MessageSquare },
  ]},
  { title: "System", items: [
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Site Control", path: "/admin/site-control", icon: Settings },
  ]},
];
const FOOTER_ITEMS = [{ label: "Profile", path: "/admin/account", icon: KeyRound }];

// These pages don't add their own page padding.
const NEEDS_PADDING = ['/admin/custom-routes', '/admin/products/edit'];
const startsWithPath = (pathname, path) => pathname === path || pathname.startsWith(path + '/');

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/admin/login');
        } else {
          setSession(session);
        }
      } catch (err) {
        console.error("getSession failed:", err);
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
        setSession(null);
        router.push('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  // Unread-message count for the sidebar badge / bell. Refreshed when visiting the
  // pages that change or show it (not on every navigation, to spare the Lambda limit).
  const refreshKey = pathname.startsWith('/admin/messages') ? 'messages' : pathname.startsWith('/admin/dashboard') ? 'dashboard' : 'other';
  useEffect(() => {
    if (!session || refreshKey === 'other') return;
    let cancelled = false;
    supabase.from('messages').select('*').then(({ data }) => {
      if (!cancelled && Array.isArray(data)) setUnread(data.filter((m) => m.status !== 'read').length);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [session, refreshKey, supabase]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="admin-shell min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--admin-accent)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <PanelShell
      brand="Admin"
      groups={NAV_GROUPS}
      footerItems={FOOTER_ITEMS}
      email={session?.user?.email || ''}
      onLogout={handleLogout}
      badges={{ '/admin/messages': unread }}
      notifHref="/admin/messages"
      notifCount={unread}
      needsPadding={NEEDS_PADDING.some((p) => startsWithPath(pathname, p))}
    >
      {children}
    </PanelShell>
  );
}
