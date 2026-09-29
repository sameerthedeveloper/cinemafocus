"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight, Loader2, Lock } from 'lucide-react';
import logoPng from '@/assets/images/logo.png';
import '@/app/admin/admin.css';

/**
 * Centered, single-column sign-in used by /admin/login and /portal/login.
 * Layout follows the familiar account-login pattern: logo, large headline, two stacked
 * floating-label fields in one rounded container, and a circular arrow submit button that
 * becomes active once both fields are filled.
 *
 * props: { eyebrow, title, blurb, endpoint, redirectTo, footer?: { text, href, label } }
 */
export default function LoginScreen({ eyebrow, title, blurb, endpoint, redirectTo, footer }) {
  const router = useRouter();
  const root = useRef(null);
  const box = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ready = email.trim() !== '' && password !== '';

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (reduce) { gsap.set('[data-rise]', { opacity: 1, y: 0 }); return; }
      gsap.fromTo('[data-rise]', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.05 });
    }, root);
    return () => ctx.revert();
  }, []);

  const shake = () => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !box.current) return;
    gsap.fromTo(box.current, { x: -8 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.25)' });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!ready || loading) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (res.status === 403) { setError("This account doesn't have access here."); shake(); return; }
      if (!res.ok) {
        setError(res.status === 503 ? 'Sign-in is temporarily unavailable. Please try again shortly.' : 'Your email or password was incorrect.');
        shake();
        return;
      }
      router.refresh();
      router.push(redirectTo);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      shake();
    } finally {
      setLoading(false);
    }
  };

  // Floating label: sits inside the field, shrinks up when focused or filled.
  const label = "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[17px] text-[#86868b] origin-left transition-all duration-200 ease-out peer-focus:top-[19px] peer-focus:scale-[0.75] peer-[:not(:placeholder-shown)]:top-[19px] peer-[:not(:placeholder-shown)]:scale-[0.75]";
  const input = "peer block w-full h-[58px] px-4 pt-[18px] bg-transparent text-[17px] text-[#1d1d1f] outline-none placeholder-transparent";

  return (
    <div ref={root} className="admin-shell min-h-screen bg-white flex flex-col">
      <header data-rise className="h-14 flex items-center justify-center border-b border-black/[0.06]">
        <img src={logoPng.src} alt="Cinema Focus" className="h-7 w-auto" />
      </header>

      <main className="flex-1 flex flex-col items-center px-5 pt-14 sm:pt-20 pb-12">
        <div className="w-full max-w-[380px] text-center">
          <div data-rise className="mx-auto mb-6 w-14 h-14 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] flex items-center justify-center text-[#1d1d1f]">
            <Lock size={24} strokeWidth={1.5} />
          </div>

          <h1 data-rise className="text-[32px] sm:text-[40px] font-semibold tracking-[-0.03em] leading-[1.08]">{title}</h1>
          <p data-rise className="mt-3 text-[17px] leading-snug text-[#6e6e73]">{blurb}</p>

          <form onSubmit={submit} className="mt-9 text-left" autoComplete="on">
            <div
              ref={box}
              data-rise
              className={`relative rounded-xl border bg-white transition-shadow duration-200 focus-within:border-[#0071e3] focus-within:shadow-[0_0_0_4px_rgba(0,113,227,0.25)] ${error ? 'border-[#d70015]' : 'border-[#d2d2d7]'}`}
            >
              <div className="relative">
                <input id="email" type="email" name="username" autoComplete="username" autoFocus required className={input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder=" " aria-label="Email" />
                <label htmlFor="email" className={label}>Email</label>
              </div>
              <div className="border-t border-[#d2d2d7]" />
              <div className="relative">
                <input id="password" type="password" name="password" autoComplete="current-password" required className={`${input} pr-14`} value={password} onChange={(e) => setPassword(e.target.value)} placeholder=" " aria-label="Password" />
                <label htmlFor="password" className={label}>Password</label>
                <button
                  type="submit"
                  disabled={!ready || loading}
                  aria-label="Sign in"
                  className={`press absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${ready ? 'bg-[#1d1d1f] border-[#1d1d1f] text-white hover:bg-black' : 'border-[#d2d2d7] text-[#c7c7cc] cursor-default'}`}
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} strokeWidth={2.25} />}
                </button>
              </div>
            </div>

            <div aria-live="polite" className="mt-3 min-h-[20px]">
              {error && <p className="text-[13px] text-[#d70015] text-center">{error}</p>}
            </div>
          </form>

          <p data-rise className="mt-4 text-[13px] text-[#86868b] text-center">
            Forgotten your password? Ask your administrator to reset it.
          </p>

          {footer && (
            <p data-rise className="mt-8 text-[14px] text-[#6e6e73] text-center">
              {footer.text}{' '}
              <Link href={footer.href} className="text-[#0066cc] hover:underline">{footer.label} ›</Link>
            </p>
          )}
        </div>
      </main>

      <footer data-rise className="border-t border-black/[0.06] bg-[#f5f5f7] px-5 py-5 text-center text-[12px] text-[#86868b]">
        Cinema Focus · {eyebrow} · Secure sign-in. Sessions expire automatically.
      </footer>
    </div>
  );
}
