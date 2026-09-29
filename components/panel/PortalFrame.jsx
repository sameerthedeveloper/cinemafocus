"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Tag, Image, Newspaper, MessageSquare } from 'lucide-react';
import PanelShell from '@/components/panel/PanelShell';

const GROUPS = [
  { title: "Overview", items: [{ label: "Dashboard", path: "/portal/dashboard", icon: LayoutDashboard }] },
  { title: "Website", items: [
    { label: "Products", path: "/portal/products", icon: Package },
    { label: "Brands", path: "/portal/brands", icon: Tag },
    { label: "Gallery", path: "/portal/gallery", icon: Image },
    { label: "Press Releases", path: "/portal/press", icon: Newspaper },
  ]},
  { title: "Inbox", items: [{ label: "Messages", path: "/portal/messages", icon: MessageSquare }] },
];

export default function PortalFrame({ email, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  // Badge loads after the shell is on screen; refreshed on the pages that show or change it.
  const refresh = pathname.startsWith('/portal/messages') ? 'messages' : pathname.startsWith('/portal/dashboard') ? 'dashboard' : 'other';
  useEffect(() => {
    if (refresh === 'other' && unread !== 0) return;
    let cancelled = false;
    fetch('/api/portal/unread', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!cancelled && d) setUnread(d.unread || 0); })
      .catch(() => {});
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const logout = async () => {
    try { await fetch('/api/portal/logout', { method: 'POST' }); } catch {}
    router.push('/portal/login');
    router.refresh();
  };
  return (
    <PanelShell
      brand="Portal"
      groups={GROUPS}
      email={email}
      onLogout={logout}
      badges={{ '/portal/messages': unread }}
      notifHref="/portal/messages"
      notifCount={unread}
    >
      {children}
    </PanelShell>
  );
}
