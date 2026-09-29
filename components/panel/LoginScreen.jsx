"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import { Instrument_Serif } from 'next/font/google';
import { Eye, EyeOff, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import logoPng from '@/assets/images/logo.png';
import '@/app/admin/admin.css';

const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], display: 'swap' });

// Decorative "signal path": layered hairline waveforms, drawn once, drifting slowly.
const WAVES = [
  { amp: 34, freq: 2.1, phase: 0.0, opacity: 0.55, dur: 26 },
  { amp: 22, freq: 3.4, phase: 1.3, opacity: 0.35, dur: 34 },
  { amp: 48, freq: 1.4, phase: 2.6, opacity: 0.22, dur: 42 },
  { amp: 14, freq: 5.2, phase: 0.7, opacity: 0.3, dur: 30 },
];
const wavePath = ({ amp, freq, phase }) => {
  const W = 1200, mid = 90, steps = 120;
  return Array.from({ length: steps + 1 }, (_, i) => {
    const x = (i / steps) * W;
    const envelope = Math.sin((i / steps) * Math.PI); // fades at both ends
    const y = mid + Math.sin((i / steps) * Math.PI * 2 * freq + phase) * amp * envelope;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
};

/**
 * Sign-in screen shared by /admin/login and /portal/login so both match the panel UI.
 * variant: { eyebrow, title, blurb, placeholder, endpoint, redirectTo, footer?: { text, href, label } }
 */
export default function LoginScreen({ eyebrow, title, blurb, placeholder, endpoint, redirectTo, footer }) {
  const router = useRouter();
  const root = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (reduce) { gsap.set('[data-rise]', { opacity: 1, y: 0 }); return; }
      gsap.fromTo('[data-rise]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.09, delay: 0.05 });
      gsap.fromTo('[data-wave]', { opacity: 0 }, { opacity: (i, el) => Number(el.dataset.wave), duration: 1.6, ease: 'power2.out', stagger: 0.18 });
    }, root);
    return () => ctx.revert();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 403) { setError("This account doesn't have access here."); return; }
      if (!res.ok) { setError(res.status === 503 ? 'Sign-in is temporarily unavailable.' : 'Incorrect email or password.'); return; }
      router.refresh();
      router.push(redirectTo);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = "w-full h-12 px-4 rounded-xl border border-[var(--admin-border)] bg-white/80 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-subtle)] outline-none transition-shadow focus:border-[var(--admin-accent)] focus:shadow-[0_0_0_3px_var(--admin-accent-soft)]";

  return (
    <div ref={root} className="admin-shell min-h-screen grid lg:grid-cols-[1.08fr_1fr]">
      {/* Brand side */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#0e0e10] text-white p-12 xl:p-16">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 50% at 18% 12%, rgba(184,134,43,0.28), transparent 62%), radial-gradient(50% 45% at 90% 95%, rgba(184,134,43,0.14), transparent 60%)' }} />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay"
          style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }}
        />

        <div data-rise className="relative flex items-center gap-3">
          <img src={logoPng.src} alt="Cinema Focus" className="h-9 w-auto brightness-0 invert" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">{eyebrow}</span>
        </div>

        <div className="relative">
          <div className="absolute left-[-6%] right-[-6%] top-1/2 -translate-y-[62%] pointer-events-none" aria-hidden>
            <svg viewBox="0 0 1200 180" className="w-full h-auto">
              {WAVES.map((w, i) => (
                <path
                  key={i}
                  data-wave={w.opacity}
                  d={wavePath(w)}
                  fill="none"
                  stroke="#d4a24c"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                  style={{ opacity: 0, animation: `panel-drift ${w.dur}s ease-in-out ${i * -7}s infinite alternate` }}
                />
              ))}
            </svg>
          </div>

          <h2 data-rise className={`${serif.className} relative text-[64px] xl:text-[76px] leading-[0.98] tracking-[-0.02em]`}>
            Every detail,<br />
            <span className="italic text-[#d4a24c]">in focus.</span>
          </h2>
          <p data-rise className="relative mt-6 max-w-sm text-[15px] leading-relaxed text-white/60">{blurb}</p>
        </div>

        <div data-rise className="relative flex items-center gap-2 text-xs text-white/45">
          <ShieldCheck size={14} /> Encrypted sign-in · sessions expire automatically
        </div>
      </aside>

      {/* Form side */}
      <main className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[400px]">
          <div data-rise className="lg:hidden flex items-center gap-3 mb-10">
            <img src={logoPng.src} alt="Cinema Focus" className="h-9 w-auto" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--admin-muted)]">{eyebrow}</span>
          </div>

          <div data-rise>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--admin-accent)]">{eyebrow}</p>
            <h1 className="mt-2 text-[36px] leading-[1.08] font-bold tracking-[-0.03em]">{title}</h1>
            <p className="mt-2 text-sm text-[var(--admin-muted)]">Sign in with your account to continue.</p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-5" noValidate={false}>
            <div data-rise>
              <label htmlFor="email" className="block text-[13px] font-medium mb-1.5">Email</label>
              <input id="email" type="email" autoComplete="username" className={field} value={email} onChange={(e) => setEmail(e.target.value)} placeholder={placeholder} required autoFocus />
            </div>
            <div data-rise>
              <label htmlFor="password" className="block text-[13px] font-medium mb-1.5">Password</label>
              <div className="relative">
                <input id="password" type={show ? 'text' : 'password'} autoComplete="current-password" className={`${field} pr-11`} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-md text-[var(--admin-muted)] hover:text-[var(--admin-text)] hover:bg-black/[0.045]" aria-label={show ? 'Hide password' : 'Show password'}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div aria-live="polite" className="min-h-[1px]">
              {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">{error}</div>}
            </div>

            <button
              data-rise
              type="submit"
              disabled={loading}
              className="press group w-full h-12 rounded-full bg-[#1d1d1f] text-white text-[15px] font-medium flex items-center justify-center gap-2 transition-all hover:bg-black hover:shadow-[0_6px_18px_-6px_rgba(17,24,39,0.5)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (<><Loader2 size={16} className="animate-spin" /> Signing in…</>) : (<>Sign in <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" /></>)}
            </button>
          </form>

          {footer && (
            <p data-rise className="mt-8 text-center text-[13px] text-[var(--admin-muted)]">
              {footer.text}{' '}
              <Link href={footer.href} className="font-medium text-[var(--admin-text)] underline underline-offset-4 decoration-[var(--admin-accent)] hover:text-[var(--admin-accent)]">{footer.label}</Link>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
