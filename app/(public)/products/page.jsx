"use client";

import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { getProducts, getCategories, getNewLaunches } from '@/lib/db';
import { createClient } from '@/lib/supabase/client';
import clsx from 'clsx';
import { Search, X } from 'lucide-react';

/* ─── Skeleton card ──────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="rounded-3xl bg-secondary/40 overflow-hidden">
        <div className="aspect-square p-6">
          <div className="w-full h-full rounded-2xl bg-secondary/60" />
        </div>
        <div className="px-5 pb-6 pt-1 space-y-2">
          <div className="h-2.5 w-16 bg-secondary/60 rounded-full" />
          <div className="h-4 w-3/4 bg-secondary/60 rounded-full" />
          <div className="h-3.5 w-1/3 bg-secondary/40 rounded-full mt-1" />
        </div>
      </div>
    </div>
  );
}

/* ─── Main page content ──────────────────────────────────────────────── */
function ProductListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeCategory = searchParams.get('category') || 'all';
  const supabase = createClient();
  const filtersRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newLaunches, setNewLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersSticky, setFiltersSticky] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product) => {
    const q = searchQuery.toLowerCase();
    return (
      product.name?.toLowerCase().includes(q) ||
      product.brand?.toLowerCase().includes(q) ||
      (product.category && product.category.replace(/-/g, ' ').toLowerCase().includes(q)) ||
      product.short_description?.toLowerCase().includes(q)
    );
  });

  /* Sticky sentinel */
  useEffect(() => {
    const sentinel = document.getElementById('filters-sentinel');
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFiltersSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  /* Data fetching */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cats, nl] = await Promise.all([
          getCategories(supabase),
          getNewLaunches(supabase),
        ]);
        setCategories(cats);
        setNewLaunches(nl);

        let p = [];
        if (activeCategory === 'all') {
          p = await getProducts(supabase);
        } else if (activeCategory === 'new-arrivals') {
          p = nl;
        } else {
          p = await getProducts(supabase, { category: activeCategory });
        }
        setProducts(p);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeCategory]);

  const setSearchParams = (params) => {
    if (Object.keys(params).length === 0) {
      router.push('/products');
    } else {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([k, v]) => {
        v == null ? next.delete(k) : next.set(k, v);
      });
      router.push(`/products?${next.toString()}`);
    }
  };

  /* All filter tabs */
  const filterTabs = [
    { label: 'All', key: 'all', onClick: () => setSearchParams({}) },
    { label: 'New Arrivals', key: 'new-arrivals', onClick: () => setSearchParams({ category: 'new-arrivals' }) },
    ...categories.map((c) => ({
      label: c.name,
      key: c.slug,
      onClick: () => setSearchParams({ category: c.slug }),
    })),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero header ──────────────────────────────────────────────── */}
      <div className="pt-32 pb-10 text-center px-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Cinema Focus
        </p>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-foreground mb-5">
          Our Collection.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
          Discover premium audio equipment crafted for every&nbsp;experience.
        </p>
      </div>

      {/* ── Filters sentinel (triggers sticky) ───────────────────────── */}
      <div id="filters-sentinel" className="h-px" />

      {/* ── Filters bar ──────────────────────────────────────────────── */}
      <div
        ref={filtersRef}
        className={clsx(
          'sticky top-0 z-40 transition-all duration-300',
          filtersSticky
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-[0_1px_0_rgba(0,0,0,0.05)]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex overflow-x-auto gap-2 py-1 scrollbar-hide touch-pan-x w-full md:w-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                id={`filter-brand-${tab.key}`}
                onClick={tab.onClick}
                className={clsx(
                  'px-5 py-2 text-sm rounded-full font-medium whitespace-nowrap flex-shrink-0 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  activeCategory === tab.key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 flex-shrink-0">
            <Search className="absolute left-3.5 top-2.5 text-muted-foreground/60 w-4 h-4" />
            <input
              type="text"
              placeholder="Search our collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 rounded-full bg-secondary/50 border border-border/40 focus:bg-background focus:ring-1 focus:ring-primary/20 outline-none text-sm transition-all duration-300 placeholder:text-muted-foreground/60 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 p-0.5 rounded-full hover:bg-secondary/80 text-muted-foreground transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Product count ─────────────────────────────────────────────── */}
      {!loading && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-2">
          <p className="text-xs text-muted-foreground font-medium tracking-wide">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>
      )}

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-32">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-40 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-2">
              <svg className="w-7 h-7 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-foreground">No products found</p>
            <p className="text-sm text-muted-foreground max-w-sm px-4">
              {searchQuery 
                ? `We couldn't find any products matching "${searchQuery}". Try a different search term.` 
                : 'We couldn\'t find any products for this brand. Try browsing all products.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchParams({});
              }}
              className="mt-2 px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Page wrapper with Suspense ─────────────────────────────────────── */
export default function ProductList() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <ProductListContent />
    </Suspense>
  );
}
