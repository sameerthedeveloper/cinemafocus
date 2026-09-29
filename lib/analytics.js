"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { incrementStat } from '@/lib/aws/adapter';

/**
 * Lightweight, cookie-free page-view counting for the owner portal.
 *  - page view:      one increment of the UTC-day row "YYYY-MM-DD" (same path at most once per 30 min per tab session)
 *  - unique visitor: one increment of "u:YYYY-MM-DD" per browser per UTC day (flag in localStorage)
 * Nothing personal is sent, only a date. Skipped for bots/automation, Do Not Track, non-production
 * builds (so local dev never writes to the live table) and admin/portal routes.
 */
const BOT = /bot|crawl|spider|slurp|preview|lighthouse|headless/i;
const REVISIT_MS = 30 * 60 * 1000;

export const shouldTrack = () => {
  if (process.env.NODE_ENV !== 'production') return false;
  if (typeof navigator === 'undefined') return false;
  if (navigator.webdriver || navigator.doNotTrack === '1' || BOT.test(navigator.userAgent)) return false;
  return true;
};

export const usePageTracking = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/portal') || !shouldTrack()) return;

    const today = new Date().toISOString().slice(0, 10);
    try {
      const key = `cf_pv:${pathname}`;
      const last = Number(sessionStorage.getItem(key) || 0);
      if (Date.now() - last > REVISIT_MS) {
        sessionStorage.setItem(key, String(Date.now()));
        incrementStat(today).catch(() => {});
      }
      if (localStorage.getItem('cf_uv') !== today) {
        localStorage.setItem('cf_uv', today);
        incrementStat(`u:${today}`).catch(() => {});
      }
    } catch {
      // storage blocked (private mode etc.): skip rather than double count
    }
  }, [pathname]);
};
