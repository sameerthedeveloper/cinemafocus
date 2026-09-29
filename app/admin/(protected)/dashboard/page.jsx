"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Package, MessageSquare, Tag, Inbox, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { createClient } from '@/lib/aws/queryClient';
import Reveal from '@/components/Reveal';
import LineChart from '@/components/admin/LineChart';

const DAY = 24 * 60 * 60 * 1000;
const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const msgDate = (m) => {
  const raw = m.created_at || m.createdAt;
  const d = raw ? new Date(raw) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
};

function StatCard({ label, value, sub, icon: Icon, href, delta }) {
  const body = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-[var(--admin-muted)]">{label}</span>
        <span className="w-8 h-8 rounded-lg bg-[#f3f4f6] text-[var(--admin-muted)] flex items-center justify-center">
          <Icon size={16} strokeWidth={1.75} />
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-[28px] leading-none font-semibold tracking-tight tabular">{value}</span>
        {delta}
      </div>
      <div className="mt-2 text-xs text-[var(--admin-muted)]">{sub}</div>
    </>
  );
  const cls = "block bg-white border border-[var(--admin-border)] rounded-xl p-5 md:p-6 shadow-sm";
  return href
    ? <Link href={href} className={clsx(cls, "hover:border-[#d1d5db] transition-colors")}>{body}</Link>
    : <div className={cls}>{body}</div>;
}

function Delta({ pct }) {
  if (pct === null) return <span className="text-xs font-medium text-[var(--admin-info)] bg-blue-50 rounded-full px-2 py-0.5">New</span>;
  const up = pct > 0;
  const flat = pct === 0;
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={clsx("inline-flex items-center gap-0.5 text-xs font-medium rounded-full px-2 py-0.5 tabular",
      flat ? "text-[var(--admin-muted)] bg-[#f3f4f6]" : up ? "text-[var(--admin-success)] bg-green-50" : "text-[var(--admin-danger)] bg-red-50")}>
      <Icon size={12} />{Math.abs(pct).toFixed(0)}%
    </span>
  );
}

function StatusBadge({ unread }) {
  return (
    <span className={clsx("inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2 py-0.5",
      unread ? "text-[var(--admin-warning)] bg-amber-50" : "text-[var(--admin-success)] bg-green-50")}>
      <span className={clsx("w-1.5 h-1.5 rounded-full", unread ? "bg-[var(--admin-warning)]" : "bg-[var(--admin-success)]")} />
      {unread ? 'Unread' : 'Read'}
    </span>
  );
}

function Skeleton({ className }) {
  return <div className={clsx("bg-[#eef0f3] rounded-xl animate-pulse", className)} />;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState({ products: [], categories: [], messages: [] });

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      try {
        const [products, categories, messages] = await Promise.all([
          supabase.from('products').select('*'),
          supabase.from('categories').select('*'),
          supabase.from('messages').select('*'),
        ]);
        if (products.error || categories.error || messages.error) throw new Error('load failed');
        setData({ products: products.data || [], categories: categories.data || [], messages: messages.data || [] });
      } catch (e) {
        console.error("Error fetching dashboard data:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const m = useMemo(() => {
    const { products, categories, messages } = data;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Enquiries per day, last 30 days, and the 30 days before that (for growth).
    const series = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today.getTime() - (29 - i) * DAY);
      return { key: dayKey(d), label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), value: 0 };
    });
    const idx = new Map(series.map((s, i) => [s.key, i]));
    let previous = 0;
    const start = today.getTime() - 29 * DAY;
    messages.forEach((msg) => {
      const d = msgDate(msg);
      if (!d) return;
      const i = idx.get(dayKey(d));
      if (i !== undefined) series[i].value += 1;
      else if (d.getTime() < start && d.getTime() >= start - 30 * DAY) previous += 1;
    });
    const current = series.reduce((a, s) => a + s.value, 0);
    const growth = previous > 0 ? ((current - previous) / previous) * 100 : current > 0 ? null : 0;

    const active = products.filter((p) => p.is_active !== false).length;
    const unread = messages.filter((x) => x.status !== 'read').length;

    const counts = new Map();
    products.forEach((p) => p.category && counts.set(p.category, (counts.get(p.category) || 0) + 1));
    const names = new Map(categories.map((c) => [c.slug, c.name]));
    const brands = [...counts.entries()]
      .map(([slug, count]) => ({ slug, name: names.get(slug) || slug, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const recent = [...messages]
      .sort((a, b) => (msgDate(b)?.getTime() || 0) - (msgDate(a)?.getTime() || 0))
      .slice(0, 6);

    return { series, current, growth, active, unread, brands, recent, total: products.length, brandCount: categories.length, msgTotal: messages.length };
  }, [data]);

  const maxBrand = Math.max(...m.brands.map((b) => b.count), 1);

  return (
    <Reveal className="p-4 md:p-8 max-w-[1400px] mx-auto animate-fade-in pb-20 md:pb-10">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-[var(--admin-muted)] mt-1 text-sm">A snapshot of your catalog and customer enquiries.</p>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
          Couldn&apos;t load some dashboard data. Refresh to try again.
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[132px]" />)}</div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6"><Skeleton className="h-[360px] xl:col-span-2" /><Skeleton className="h-[360px]" /></div>
          <Skeleton className="h-64" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
            <StatCard label="Products" value={m.total} sub={`${m.active} active`} icon={Package} href="/admin/products" />
            <StatCard label="Brands" value={m.brandCount} sub="Product categories" icon={Tag} href="/admin/categories" />
            <StatCard label="Enquiries · 30 days" value={m.current} sub="vs previous 30 days" icon={MessageSquare} delta={<Delta pct={m.growth} />} href="/admin/messages" />
            <StatCard label="Unread messages" value={m.unread} sub={`${m.msgTotal} total`} icon={Inbox} href="/admin/messages" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
            <section className="xl:col-span-2 bg-white border border-[var(--admin-border)] rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold">Enquiries</h2>
                  <p className="text-xs text-[var(--admin-muted)] mt-0.5">Messages received per day, last 30 days</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold tabular">{m.current}</div>
                  <div className="text-xs text-[var(--admin-muted)]">total</div>
                </div>
              </div>
              {m.current === 0 ? (
                <div className="h-[260px] flex flex-col items-center justify-center text-center border border-dashed border-[var(--admin-border)] rounded-lg">
                  <p className="text-sm font-medium">No enquiries in the last 30 days</p>
                  <p className="text-xs text-[var(--admin-muted)] mt-1">New contact-form messages will chart here.</p>
                </div>
              ) : (
                <LineChart data={m.series} valueLabel="Enquiries" />
              )}
            </section>

            <section className="bg-white border border-[var(--admin-border)] rounded-xl p-5 md:p-6 shadow-sm">
              <h2 className="text-base font-semibold">Catalog by brand</h2>
              <p className="text-xs text-[var(--admin-muted)] mt-0.5 mb-5">Products per brand, top {m.brands.length || 6}</p>
              {m.brands.length === 0 ? (
                <p className="text-sm text-[var(--admin-muted)]">No products yet.</p>
              ) : (
                <ul className="space-y-4">
                  {m.brands.map((b) => (
                    <li key={b.slug}>
                      <div className="flex items-center justify-between text-[13px] mb-1.5">
                        <span className="font-medium truncate pr-3">{b.name}</span>
                        <span className="text-[var(--admin-muted)] tabular">{b.count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#f3f4f6] overflow-hidden">
                        <div className="h-full rounded-full bg-[var(--admin-accent)]" style={{ width: `${(b.count / maxBrand) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section className="bg-white border border-[var(--admin-border)] rounded-xl shadow-sm">
            <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-[var(--admin-border)]">
              <div>
                <h2 className="text-base font-semibold">Recent enquiries</h2>
                <p className="text-xs text-[var(--admin-muted)] mt-0.5">Latest messages from the contact forms</p>
              </div>
              <Link href="/admin/messages" className="text-xs font-medium text-[var(--admin-accent)] hover:underline">View all</Link>
            </div>
            {m.recent.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-[var(--admin-muted)]">No messages yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wider text-[var(--admin-muted)] border-b border-[var(--admin-border)]">
                      <th className="font-medium px-5 md:px-6 py-3">Name</th>
                      <th className="font-medium px-3 py-3">Subject</th>
                      <th className="font-medium px-3 py-3">Date</th>
                      <th className="font-medium px-5 md:px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {m.recent.map((msg) => {
                      const d = msgDate(msg);
                      return (
                        <tr key={msg.id} className="border-b border-[#f3f4f6] last:border-0 hover:bg-[#fafafa] transition-colors">
                          <td className="px-5 md:px-6 py-3">
                            <div className="font-medium">{msg.name || '—'}</div>
                            <div className="text-xs text-[var(--admin-muted)]">{msg.email}</div>
                          </td>
                          <td className="px-3 py-3 text-[var(--admin-muted)]">{msg.subject || 'New Inquiry'}</td>
                          <td className="px-3 py-3 text-[var(--admin-muted)] whitespace-nowrap tabular">
                            {d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                          </td>
                          <td className="px-5 md:px-6 py-3"><StatusBadge unread={msg.status !== 'read'} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </Reveal>
  );
}
