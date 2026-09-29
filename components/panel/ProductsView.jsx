"use client";

import React, { useMemo, useState } from 'react';
import { Search, X, Eye, EyeOff, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE = 25;
const inr = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);
const ctl = "px-4 py-2.5 text-sm rounded-xl border border-border/80 bg-background/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all";

/** Read-only product table. Same columns, image cell and Active/Disabled pills as the admin Products page. */
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
      return !needle || [p.name, p.brand, p.category].some((v) => String(v || '').toLowerCase().includes(needle));
    });
  }, [products, q, brand, status]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const current = Math.min(page, pages - 1);
  const slice = rows.slice(current * PAGE, current * PAGE + PAGE);
  const reset = (fn) => (e) => { fn(e.target.value); setPage(0); };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="max-w-md w-full relative">
          <Search className="absolute left-3.5 top-3 text-muted-foreground w-4 h-4" />
          <input type="text" placeholder="Search products by name, brand, or category..." value={q} onChange={reset(setQ)} className={`w-full pl-10 pr-4 ${ctl}`} />
          {q && (
            <button onClick={() => { setQ(''); setPage(0); }} className="absolute right-3 top-3 p-0.5 rounded-full hover:bg-secondary/85 text-muted-foreground transition-colors" title="Clear search">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <select value={brand} onChange={reset(setBrand)} className={ctl}>
          <option value="">All brands</option>
          {brands.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
        </select>
        <select value={status} onChange={reset(setStatus)} className={ctl}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Disabled</option>
        </select>
        <div className="md:ml-auto self-center text-xs text-muted-foreground tabular">{rows.length} of {products.length}</div>
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="p-4 font-medium text-sm text-muted-foreground">Image</th>
                <th className="p-4 font-medium text-sm text-muted-foreground">Name</th>
                <th className="p-4 font-medium text-sm text-muted-foreground">Brand</th>
                <th className="p-4 font-medium text-sm text-muted-foreground">Brand Category</th>
                <th className="p-4 font-medium text-sm text-muted-foreground">Price</th>
                <th className="p-4 font-medium text-sm text-muted-foreground">Status</th>
                <th className="p-4 font-medium text-sm text-muted-foreground text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {slice.map((product, i) => (
                <tr key={product.id ?? i} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden">
                      {product.images?.[0] && <img src={product.images[0]} alt={product.name} loading="lazy" className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-muted-foreground">{product.brand}</td>
                  <td className="p-4 text-muted-foreground text-sm capitalize">{product.category?.replace('-', ' ')}</td>
                  <td className="p-4 font-medium">{inr(product.price)}</td>
                  <td className="p-4">
                    {product.is_active === false ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20"><EyeOff size={11} /> Disabled</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"><Eye size={11} /> Active</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {product.slug && product.is_active !== false && (
                      <a href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors" title="View on website">
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-muted-foreground font-light italic">
                    {q || brand || status !== 'all' ? 'No products match your search. Try adjusting your query.' : 'No products found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted-foreground">
            <span className="tabular">Page {current + 1} of {pages}</span>
            <div className="flex gap-1.5">
              <button disabled={current === 0} onClick={() => setPage(current - 1)} className="p-2 rounded-lg hover:bg-secondary disabled:opacity-40 transition-colors" aria-label="Previous page"><ChevronLeft size={16} /></button>
              <button disabled={current >= pages - 1} onClick={() => setPage(current + 1)} className="p-2 rounded-lg hover:bg-secondary disabled:opacity-40 transition-colors" aria-label="Next page"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
