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
      imageSrc: c.imageUrl || c.image_url,
      count: c.product_count,
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
          'sticky top-[64px] md:top-[72px] z-40 transition-all duration-300',
          filtersSticky
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-[0_1px_0_rgba(0,0,0,0.05)] py-2'
            : 'bg-transparent py-4'
        )}
      >
        <div className={clsx(
          "max-w-7xl mx-auto px-4 md:px-8 transition-all duration-500 flex flex-col items-center",
          filtersSticky ? "gap-2" : "gap-6"
        )}>
          {/* Categories */}
          <div className={clsx(
            "flex overflow-x-auto scrollbar-hide touch-pan-x w-full gap-2 md:gap-4 transition-all duration-500 ease-in-out origin-top",
            filtersSticky 
              ? "max-h-0 opacity-0 overflow-hidden py-0 m-0 pointer-events-none" 
              : "max-h-[200px] opacity-100 py-2"
          )}>
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                id={`filter-brand-${tab.key}`}
                onClick={tab.onClick}
                className={clsx(
                  "flex-shrink-0 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all duration-300",
                  "group flex flex-col items-center text-center w-[120px] md:w-[140px] p-4 rounded-[1.5rem] ease-out border",
                  activeCategory === tab.key
                    ? "bg-secondary/30 border-primary/30 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.05)] -translate-y-0.5"
                    : "bg-secondary/10 border-border/10 hover:bg-secondary/20 hover:border-primary/20 hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.05)] hover:-translate-y-0.5"
                )}
              >
                <div className={clsx(
                  "w-16 h-16 md:w-20 md:h-20 rounded-full bg-background flex items-center justify-center p-3 transition-all duration-300 ease-out group-hover:scale-[1.05] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)] border mb-3",
                  activeCategory === tab.key ? "border-primary/20" : "border-border/5"
                )}>
                  {tab.key === 'all' ? (
                    <svg className="w-8 h-8 text-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  ) : tab.key === 'new-arrivals' ? (
                    <svg className="w-8 h-8 text-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  ) : tab.imageSrc ? (
                    <img src={tab.imageSrc} alt={tab.label} className="w-full h-full object-contain p-1" />
                  ) : (
                    <div className="text-muted-foreground/30 font-bold text-lg uppercase select-none">{tab.label.substring(0, 2)}</div>
                  )}
                </div>
                
                <div className="space-y-1 w-full">
                  <span className={clsx(
                    "transition-colors text-xs md:text-sm font-semibold tracking-tight leading-tight line-clamp-1 block",
                    activeCategory === tab.key ? "text-primary" : "text-foreground group-hover:text-primary"
                  )}>
                    {tab.label}
                  </span>
                  
                  <span className="text-[9px] md:text-[10px] text-muted-foreground/80 font-medium block">
                    {tab.key === 'all' ? 'View Everything' : 
                     tab.key === 'new-arrivals' ? 'Latest Products' : 
                     `${tab.count || 0} ${tab.count === 1 ? 'item' : 'items'}`}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className={clsx(
            "relative transition-all duration-500",
            filtersSticky ? "w-full max-w-3xl" : "w-full max-w-2xl"
          )}>
            <Search className={clsx(
              "absolute text-muted-foreground/60 transition-all",
              filtersSticky ? "left-4 top-3 w-5 h-5" : "left-4 top-3.5 w-5 h-5"
            )} />
            <input
              type="text"
              placeholder="Search our collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={clsx(
                "w-full rounded-full border focus:bg-background outline-none transition-all duration-300 shadow-sm",
                filtersSticky
                  ? "pl-12 pr-10 py-2.5 bg-secondary/50 border-border/40 focus:ring-1 focus:ring-primary/20 text-sm placeholder:text-muted-foreground/60"
                  : "pl-12 pr-10 py-3 bg-secondary/30 border-border/40 focus:ring-2 focus:ring-primary/20 text-base placeholder:text-muted-foreground/50"
              )}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={clsx(
                  "absolute rounded-full hover:bg-secondary/80 text-muted-foreground transition-colors cursor-pointer",
                  filtersSticky ? "right-3 top-2.5 p-1" : "right-4 top-3.5 p-1"
                )}
                title="Clear search"
              >
                <X className={clsx(filtersSticky ? "w-4 h-4" : "w-5 h-5")} />
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
