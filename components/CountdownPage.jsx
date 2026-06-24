"use client";

import { useState, useEffect } from 'react';
import { Space_Mono } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

const ENV_LAUNCH_DATE = process.env.NEXT_PUBLIC_LAUNCH_DATE ?? '2026-01-01';

function getRemaining(dateStr) {
  const diff = new Date(dateStr + 'T00:00:00').getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    expired: false,
  };
}

const pad = (n) => String(n ?? 0).padStart(2, '0');

export default function CountdownPage({ slug = 'soon' }) {
  const [cfg, setCfg] = useState(null);
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('site_settings')
      .select('data')
      .eq('id', 'custom_routes')
      .single()
      .then(({ data }) => {
        const route = data?.data?.[slug] ?? {};
        const launchDate =
          route.widgets?.find((w) => w.type === 'countdown')?.launch_date || ENV_LAUNCH_DATE;
        setCfg({
          product_name: route.product_name || '',
          launch_date: launchDate,
        });
      })
      .catch(() => {
        setCfg({ product_name: '', launch_date: ENV_LAUNCH_DATE });
      });
  }, [slug]);

  useEffect(() => {
    if (!cfg) return;
    setRemaining(getRemaining(cfg.launch_date));
    const id = setInterval(() => setRemaining(getRemaining(cfg.launch_date)), 1000);
    return () => clearInterval(id);
  }, [cfg]);

  const units = [
    { label: 'Days', value: remaining?.days },
    { label: 'Hrs', value: remaining?.hours },
    { label: 'Min', value: remaining?.minutes },
    { label: 'Sec', value: remaining?.seconds },
  ];

  return (
    <div
      className={spaceMono.variable}
      style={{
        minHeight: '100vh',
        background: '#080808',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        padding: '2rem',
      }}
    >
      {/* logo */}
      <Image
        src="/images/logo-light.webp"
        alt="Cinema Focus"
        width={240}
        height={60}
        style={{ objectFit: 'contain' }}
      />

      {/* product name */}
      {cfg?.product_name && (
        <p
          style={{
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(245,239,230,0.55)',
            margin: '-0.5rem 0 0',
            textAlign: 'center',
          }}
        >
          {cfg.product_name} — Launching Soon
        </p>
      )}

      {/* countdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'clamp(1rem, 4vw, 2.5rem)',
          textAlign: 'center',
          marginTop: '1rem',
        }}
      >
        {units.map(({ label, value }) => (
          <div
            key={label}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
          >
            <span
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: 'clamp(2.5rem, 10vw, 6rem)',
                fontWeight: 700,
                lineHeight: 1,
                color: '#F5EFE6',
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {remaining ? pad(value) : '--'}
            </span>
            <span
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: 'clamp(0.55rem, 1.5vw, 0.7rem)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(245,239,230,0.4)',
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* back */}
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: '0.7rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(245,239,230,0.35)',
          textDecoration: 'none',
          borderBottom: '1px solid rgba(245,239,230,0.15)',
          paddingBottom: '2px',
          marginTop: '1rem',
          transition: 'color 0.2s, border-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'rgba(245,239,230,0.7)';
          e.currentTarget.style.borderColor = 'rgba(245,239,230,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(245,239,230,0.35)';
          e.currentTarget.style.borderColor = 'rgba(245,239,230,0.15)';
        }}
      >
        ← Back to site
      </Link>
    </div>
  );
}
