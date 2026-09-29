"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, ExternalLink, Menu, X, Bell } from 'lucide-react';
import clsx from 'clsx';
import logoPng from '@/assets/images/logo.png';
import Reveal from '@/components/Reveal';
import '@/app/admin/admin.css';

const isActivePath = (pathname, path) => pathname === path || pathname.startsWith(path + '/');

/**
 * Sidebar + top bar shell shared by the admin panel and the owner portal.
 *
 * groups:      [{ title, items: [{ label, path, icon, badge? }] }]
 * footerItems: [{ label, path, icon }]  (e.g. Profile) shown above Logout
 * badges:      { [path]: number }        counts shown on nav items
 */
export default function PanelShell({
  brand = 'Admin',
  groups,
  footerItems = [],
  email = '',
  onLogout,
  badges = {},
  notifHref,
  notifCount = 0,
  needsPadding = false,
  children,
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const all = [...groups.flatMap((g) => g.items), ...footerItems];
  const current = all.find((i) => isActivePath(pathname, i.path));
  const initials = (email.split('@')[0] || brand[0]).slice(0, 2).toUpperCase();

  const navLink = (item) => {
    const Icon = item.icon;
    const active = isActivePath(pathname, item.path);
    const count = badges[item.path] || 0;
    return (
      <Link
        key={item.path}
        href={item.path}
        onClick={() => setOpen(false)}
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
        {count > 0 && (
          <span className="min-w-5 h-5 px-1.5 rounded-full bg-[var(--admin-accent-soft)] text-[var(--admin-accent)] text-[11px] font-semibold flex items-center justify-center tabular">
            {count}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="admin-shell min-h-screen flex">
      {open && (
        <Reveal className="fixed inset-0 bg-black/40 z-40 md:hidden animate-fade-in" onClick={() => setOpen(false)} />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-[248px] bg-white border-r border-[var(--admin-border)] flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 md:h-screen shrink-0",
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        <div className="h-16 px-5 border-b border-[var(--admin-border)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <img src={logoPng.src} alt={`Cinema Focus ${brand}`} className="h-8 w-auto" />
            <span className="text-[11px] font-semibold text-[var(--admin-muted)] uppercase tracking-[0.18em]">{brand}</span>
          </div>
          <button onClick={() => setOpen(false)} className="md:hidden text-[var(--admin-muted)] hover:text-[var(--admin-text)]" aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
          {groups.map((group) => (
            <div key={group.title}>
              <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">{group.title}</div>
              <div className="space-y-0.5">{group.items.map(navLink)}</div>
            </div>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-[var(--admin-border)] space-y-0.5 shrink-0">
          {footerItems.map(navLink)}
          <button
            onClick={onLogout}
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
            <button onClick={() => setOpen(true)} className="md:hidden p-2 -ml-2 text-[var(--admin-text)] hover:bg-[#f3f4f6] rounded-lg" aria-label="Open menu">
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <div className="text-[11px] text-[var(--admin-muted)] leading-none mb-1 hidden sm:block">{brand}{current ? ` / ${current.label}` : ''}</div>
              <div className="text-[15px] font-semibold leading-none truncate">{current?.label || brand}</div>
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
            {notifHref && (
              <Link
                href={notifHref}
                className="relative h-8 w-8 flex items-center justify-center rounded-lg text-[var(--admin-muted)] hover:text-[var(--admin-text)] hover:bg-[#f3f4f6] transition-colors"
                aria-label={notifCount > 0 ? `${notifCount} unread messages` : 'Messages'}
              >
                <Bell size={17} strokeWidth={1.75} />
                {notifCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--admin-accent)] ring-2 ring-white" />}
              </Link>
            )}
            <span className="flex items-center gap-2 pl-1" title={email}>
              <span className="w-8 h-8 rounded-full bg-[var(--admin-accent-soft)] text-[var(--admin-accent)] text-xs font-semibold flex items-center justify-center">{initials}</span>
            </span>
          </div>
        </header>

        <main className={clsx("flex-1 overflow-y-auto w-full", needsPadding && "p-4 md:p-8")}>
          {children}
        </main>
      </div>
    </div>
  );
}
