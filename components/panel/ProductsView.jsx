"use client";

import React, { useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Badge, EmptyState } from '@/components/panel/ui';

const PAGE = 20;
const inr = (n) => (Number(n) > 0 ? `₹${new Intl.NumberFormat('en-IN').format(Number(n))}` : '—');

/** Read-only product catalogue: search, brand + status filters, paging. */
export default function ProductsView({ products, brands }) {
  const [q, setQ] = useState('');
  const [brand, setBrand] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(0);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter((p) => {
      if (brand && p.category !== brand) return false;
      if (status === 'active' && p.is_active === false) return false;
      if (status === 'inactive' && p.is_active !== false) return false;
      return !needle || [p.name, p.brand, p.slug].some((v) => String(v || '').toLowerCase().includes(needle));
    });
  }, [products, q, brand, status]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const current = Math.min(page, pages - 1);
  const slice = rows.slice(current * PAGE, current * PAGE + PAGE);
  const reset = (fn) => (e) => { fn(e.target.value); setPage(0); };
  const ctl = "h-10 rounded-full border border-transparent bg-black/[0.05] hover:bg-black/[0.07] focus:bg-white text-sm outline-none focus:border-[var(--admin-accent)] focus:shadow-[0_0_0_3px_var(--admin-accent-soft)]";

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative md:max-w-sm w-full">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--admin-muted)]" />
          <input value={q} onChange={reset(setQ)} placeholder="Search products" className={`${ctl} w-full pl-10 pr-4`} />
        </div>
        <select value={brand} onChange={reset(setBrand)} className={`${ctl} px-3`}>
          <option value="">All brands</option>
          {brands.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
        </select>
        <select value={status} onChange={reset(setStatus)} className={`${ctl} px-3`}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <div className="md:ml-auto self-center text-xs text-[var(--admin-muted)] tabular">{rows.length} of {products.length}</div>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No products match" hint="Try a different search or filter." />
      ) : (
        <div className="bg-white border border-[var(--admin-border)] rounded-[20px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-[var(--admin-muted)] border-b border-[var(--admin-border)]">
                  <th className="font-medium px-5 py-3">Product</th>
                  <th className="font-medium px-3 py-3">Brand</th>
                  <th className="font-medium px-3 py-3">Price</th>
                  <th className="font-medium px-3 py-3">Status</th>
                  <th className="font-medium px-5 py-3 w-10" />
                </tr>
              </thead>
              <tbody>
                {slice.map((p) => (
                  <tr key={p.id} className="border-b border-[var(--admin-hairline)] last:border-0 hover:bg-black/[0.025] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-11 h-11 rounded-lg bg-black/[0.045] border border-[var(--admin-border)] overflow-hidden shrink-0 flex items-center justify-center">
                          {p.images?.[0] ? <img src={p.images[0]} alt="" loading="lazy" className="w-full h-full object-contain" /> : null}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-medium truncate">{p.name}</span>
                          <span className="block text-xs text-[var(--admin-muted)] truncate">{p.slug}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[var(--admin-muted)]">{brands.find((b) => b.slug === p.category)?.name || p.brand || '—'}</td>
                    <td className="px-3 py-3 tabular">{inr(p.price)}</td>
                    <td className="px-3 py-3"><Badge tone={p.is_active === false ? 'neutral' : 'success'}>{p.is_active === false ? 'Inactive' : 'Active'}</Badge>{p.featured && <span className="ml-1.5"><Badge tone="info">Featured</Badge></span>}</td>
                    <td className="px-5 py-3">
                      {p.slug && p.is_active !== false && (
                        <a href={`/products/${p.slug}`} target="_blank" rel="noopener noreferrer" className="text-[var(--admin-muted)] hover:text-[var(--admin-text)]" aria-label={`View ${p.name} on the website`}><ExternalLink size={14} /></a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--admin-border)] text-xs text-[var(--admin-muted)]">
              <span className="tabular">Page {current + 1} of {pages}</span>
              <div className="flex gap-1.5">
                <button disabled={current === 0} onClick={() => setPage(current - 1)} className="press h-8 w-8 rounded-full bg-black/[0.045] flex items-center justify-center disabled:opacity-40 hover:bg-black/[0.08]" aria-label="Previous page"><ChevronLeft size={15} /></button>
                <button disabled={current >= pages - 1} onClick={() => setPage(current + 1)} className="press h-8 w-8 rounded-full bg-black/[0.045] flex items-center justify-center disabled:opacity-40 hover:bg-black/[0.08]" aria-label="Next page"><ChevronRight size={15} /></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
