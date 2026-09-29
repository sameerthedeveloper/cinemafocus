"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
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

export default function PortalFrame({ email, unread = 0, children }) {
  const router = useRouter();
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
