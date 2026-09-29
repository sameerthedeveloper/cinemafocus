"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, LayoutDashboard, Package, ExternalLink, Settings, Tag, Users, MessageSquare, Image, Search, Newspaper, Sparkles, Menu, X, Route, KeyRound, Bell } from 'lucide-react';
import { createClient } from '@/lib/aws/queryClient';
import clsx from 'clsx';
import logoPng from '@/assets/images/logo.png';
import Reveal from '@/components/Reveal';
import '../admin.css';

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
    { label: "Messages", path: "/admin/messages", icon: MessageSquare, badge: true },
  ]},
  { title: "System", items: [
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Site Control", path: "/admin/site-control", icon: Settings },
  ]},
];
const ALL_ITEMS = [...NAV_GROUPS.flatMap((g) => g.items), { label: "Account", path: "/admin/account", icon: KeyRound }];

// These pages don't add their own page padding.
const NEEDS_PADDING = ['/admin/custom-routes', '/admin/products/edit'];

const isActivePath = (pathname, path) => pathname === path || pathname.startsWith(path + '/');

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const current = ALL_ITEMS.find((i) => isActivePath(pathname, i.path));
  const email = session?.user?.email || '';
  const initials = (email.split('@')[0] || 'A').slice(0, 2).toUpperCase();
  const needsPadding = NEEDS_PADDING.some((p) => isActivePath(pathname, p));

  const navLink = (item) => {
    const Icon = item.icon;
    const active = isActivePath(pathname, item.path);
    return (
      <Link
        key={item.path}
        href={item.path}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-current={active ? 'page' : undefined}
        className={clsx(
          "relative flex items-center gap-2.5 h-9 px-3 rounded-lg text-[13px] font-medium transition-colors",
          active
            ? "bg-[#f3f4f6] text-[var(--admin-text)]"
            : "text-[var(--admin-muted)] hover:bg-[#f9fafb] hover:text-[var(--admin-text)]"
        )}
      >
        {active && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-[var(--admin-accent)]" />}
        <Icon size={16} strokeWidth={active ? 2.25 : 1.75} />
        <span className="flex-1">{item.label}</span>
        {item.badge && unread > 0 && (
          <span className="min-w-5 h-5 px-1.5 rounded-full bg-[var(--admin-accent-soft)] text-[var(--admin-accent)] text-[11px] font-semibold flex items-center justify-center tabular">
            {unread}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="admin-shell min-h-screen flex">
      {isMobileMenuOpen && (
        <Reveal
          className="fixed inset-0 bg-black/40 z-40 md:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-[248px] bg-white border-r border-[var(--admin-border)] flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 md:h-screen shrink-0",
          isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        <div className="h-16 px-5 border-b border-[var(--admin-border)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <img src={logoPng.src} alt="Cinema Focus Admin" className="h-8 w-auto" />
            <span className="text-[11px] font-semibold text-[var(--admin-muted)] uppercase tracking-[0.18em]">Admin</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-[var(--admin-muted)] hover:text-[var(--admin-text)]" aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">{group.title}</div>
              <div className="space-y-0.5">{group.items.map(navLink)}</div>
            </div>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-[var(--admin-border)] space-y-0.5 shrink-0">
          {navLink({ label: "Profile", path: "/admin/account", icon: KeyRound })}
          <button
            onClick={handleLogout}
            type="button"
            className="w-full flex items-center gap-2.5 h-9 px-3 rounded-lg text-[13px] font-medium text-[var(--admin-danger)] hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} strokeWidth={1.75} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col h-screen">
        <header className="h-16 shrink-0 bg-white border-b border-[var(--admin-border)] flex items-center justify-between px-4 md:px-8 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-[var(--admin-text)] hover:bg-[#f3f4f6] rounded-lg" aria-label="Open menu">
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <div className="text-[11px] text-[var(--admin-muted)] leading-none mb-1 hidden sm:block">Admin{current ? ` / ${current.label}` : ''}</div>
              <div className="text-[15px] font-semibold leading-none truncate">{current?.label || 'Admin'}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[var(--admin-border)] text-xs font-medium text-[var(--admin-muted)] hover:text-[var(--admin-text)] hover:bg-[#f9fafb] transition-colors"
            >
              View site <ExternalLink size={13} />
            </Link>
            <Link
              href="/admin/messages"
              className="relative h-8 w-8 flex items-center justify-center rounded-lg text-[var(--admin-muted)] hover:text-[var(--admin-text)] hover:bg-[#f3f4f6] transition-colors"
              aria-label={unread > 0 ? `${unread} unread messages` : 'Messages'}
            >
              <Bell size={17} strokeWidth={1.75} />
              {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--admin-accent)] ring-2 ring-white" />}
            </Link>
            <Link href="/admin/account" className="flex items-center gap-2 pl-1" title={email || 'Account'}>
              <span className="w-8 h-8 rounded-full bg-[var(--admin-accent-soft)] text-[var(--admin-accent)] text-xs font-semibold flex items-center justify-center">{initials}</span>
            </Link>
          </div>
        </header>

        <main className={clsx("flex-1 overflow-y-auto w-full", needsPadding && "p-4 md:p-8")}>
          {children}
        </main>
      </div>
    </div>
  );
}
