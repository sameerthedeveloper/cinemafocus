"use client";

import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { getProducts, getCategories, getNewLaunches } from '@/lib/aws/adapter';
import clsx from 'clsx';
import { Search, X } from 'lucide-react';

/* ─── Skeleton card ──────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="rounded-card bg-secondary/40 overflow-hidden">
        <div className="aspect-square p-6">
          <div className="w-full h-full rounded-media bg-secondary/60" />
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
function ProductListContent({ initialProducts, initialCategories, initialNewLaunches }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeCategory = searchParams.get('category') || 'all';
  const filtersRef = useRef(null);

  // Server-rendered data for the default ("all") view so the grid is in the first HTML
  const [products, setProducts] = useState(initialProducts || []);
  const [categories, setCategories] = useState(initialCategories || []);
  const [newLaunches, setNewLaunches] = useState(initialNewLaunches || []);
  const [loading, setLoading] = useState(!initialProducts);
  const skipInitialFetch = useRef(Boolean(initialProducts) && activeCategory === 'all');
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
      { threshold: 0, rootMargin: '-100px 0px 0px 0px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  /* Data fetching */
  useEffect(() => {
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cats, nl] = await Promise.all([
          getCategories(),
          getNewLaunches(),
        ]);
        setCategories(cats);
        setNewLaunches(nl);

        let p = [];
        if (activeCategory === 'all') {
          p = await getProducts();
        } else if (activeCategory === 'new-arrivals') {
          p = nl;
        } else {
          p = await getProducts({ category: activeCategory });
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
      router.push('/products', { scroll: false });
    } else {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([k, v]) => {
        v == null ? next.delete(k) : next.set(k, v);
      });
      router.push(`/products?${next.toString()}`, { scroll: false });
    }
  };

  /* All filter tabs */
  const filterTabs = [
    { label: 'All', key: 'all', onClick: () => setSearchParams({}) },
    { label: 'New arrivals', key: 'new-arrivals', onClick: () => setSearchParams({ category: 'new-arrivals' }) },
    ...categories.map((c) => ({
      label: c.name,
      key: c.slug,
      onClick: () => setSearchParams({ category: c.slug }),
      imageSrc: c.imageUrl || c.image_url,
      count: c.product_count,
    })),
  ];

  const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';
  const activeLabel = filterTabs.find((t) => t.key === activeCategory)?.label;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Page header ──────────────────────────────────────────────── */}
      <header className="mx-auto max-w-7xl px-4 pb-8 pt-32 md:px-8 md:pb-10 md:pt-40">
        <h1 className="text-4xl font-medium tracking-tight md:text-5xl">Our collection</h1>
        <p className="mt-3 max-w-xl text-lg text-muted-foreground md:text-xl">
          Premium audio equipment from the brands we stock, ready to hear at the showroom.
        </p>
      </header>

      {/* ── Filters sentinel (triggers sticky) ───────────────────────── */}
      <div id="filters-sentinel" className="h-px" />

      {/* ── Sticky filter bar: search + brand chips ──────────────────── */}
      <div
        ref={filtersRef}
        className={clsx(
          'sticky top-[88px] z-40 w-full bg-background transition-shadow duration-300 lg:top-[104px]',
          filtersSticky ? 'shadow-[0_1px_0_0_hsl(var(--border))]' : ''
        )}
      >
        <div className="mx-auto max-w-7xl space-y-3 px-4 py-3 md:px-8">
          <div className="relative max-w-md">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              aria-label="Search products"
              placeholder="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={clsx(
                'h-11 w-full rounded-full bg-secondary pl-11 pr-11 text-base outline-none transition-colors placeholder:text-muted-foreground focus:bg-secondary/70 md:text-sm',
                '[&::-webkit-search-cancel-button]:hidden',
                focusRing
              )}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className={clsx('absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground', focusRing)}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div role="group" aria-label="Filter by brand" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide touch-pan-x md:-mx-8 md:px-8">
            {filterTabs.map((tab) => {
              const active = activeCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  id={`filter-brand-${tab.key}`}
                  type="button"
                  aria-pressed={active}
                  onClick={tab.onClick}
                  className={clsx(
                    'flex h-11 shrink-0 select-none items-center gap-2 rounded-full pr-4 text-sm font-medium tracking-tight transition-colors',
                    tab.imageSrc ? 'pl-2' : 'pl-4',
                    active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-accent',
                    focusRing
                  )}
                >
                  {tab.imageSrc ? (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background p-1">
                      <img src={tab.imageSrc} alt="" loading="lazy" className="h-full w-full object-contain" />
                    </span>
                  ) : tab.key === 'new-arrivals' ? (
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                  ) : null}
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {typeof tab.count === 'number' && tab.count > 0 && (
                    <span className={clsx('text-xs font-normal', active ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{tab.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Result count ─────────────────────────────────────────────── */}
      {!loading && (
        <div className="mx-auto max-w-7xl px-4 pb-1 pt-5 md:px-8">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            {activeCategory !== 'all' && activeLabel ? ` in ${activeLabel}` : ''}
            {searchQuery ? ` matching "${searchQuery}"` : ''}
          </p>
        </div>
      )}

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-4 md:px-8 md:pb-32">
        {loading ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 md:gap-x-6 md:gap-y-8 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 md:gap-x-6 md:gap-y-8 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} headingLevel="h2" />
            ))}
          </div>
        ) : (
          <div className="rounded-panel bg-secondary/40 px-6 py-20 text-center md:py-28">
            <h2 className="text-xl font-medium md:text-2xl">No products found</h2>
            <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
              {searchQuery
                ? `Nothing matches "${searchQuery}". Try a different word or clear the search.`
                : 'There are no products here yet. Browse the full collection instead.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSearchParams({});
              }}
              className={clsx('mt-8 inline-flex h-12 items-center rounded-full bg-primary px-7 text-sm font-medium tracking-tight text-primary-foreground transition-colors hover:bg-primary/90', focusRing)}
            >
              Show all products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Page wrapper with Suspense ─────────────────────────────────────── */
export default function ProductList(props) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <ProductListContent {...props} />
    </Suspense>
  );
}
