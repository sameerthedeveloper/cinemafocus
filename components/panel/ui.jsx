import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

/** Shared building blocks for the admin panel and the owner portal. */

export function StatCard({ label, value, sub, icon: Icon, href, delta }) {
  const body = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-[var(--admin-muted)]">{label}</span>
        <span className="w-9 h-9 rounded-full bg-secondary text-[var(--admin-muted)] flex items-center justify-center">
          <Icon size={16} strokeWidth={1.75} />
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-[34px] leading-none font-medium tracking-[-0.03em] tabular">{value}</span>
        {delta}
      </div>
      <div className="mt-2 text-xs text-[var(--admin-muted)]">{sub}</div>
    </>
  );
  const cls = "block bg-white border border-[var(--admin-border)] rounded-card p-5 md:p-6";
  return href
    ? <Link href={href} className={clsx(cls, "lift press")}>{body}</Link>
    : <div className={cls}>{body}</div>;
}

export function Delta({ pct }) {
  if (pct === null) return <span className="text-xs font-medium text-white bg-signal rounded-full px-2 py-0.5">New</span>;
  const up = pct > 0;
  const flat = pct === 0;
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={clsx("inline-flex items-center gap-0.5 text-xs font-medium rounded-full px-2 py-0.5 tabular",
      flat ? "text-[var(--admin-muted)] bg-secondary" : up ? "text-[var(--admin-text)] bg-secondary" : "text-[var(--admin-danger)] bg-secondary")}>
      <Icon size={12} />{Math.abs(pct).toFixed(0)}%
    </span>
  );
}

const TONES = {
  success: "text-[var(--admin-text)] bg-secondary",
  warning: "text-[var(--admin-muted)] bg-secondary",
  danger: "text-[var(--admin-danger)] bg-secondary",
  info: "text-[var(--admin-text)] bg-secondary",
  neutral: "text-[var(--admin-muted)] bg-secondary",
};
const DOTS = {
  success: "bg-[var(--admin-success)]", warning: "bg-[var(--admin-warning)]",
  danger: "bg-[var(--admin-danger)]", info: "bg-[var(--admin-info)]", neutral: "bg-muted-foreground/50",
};

export function Badge({ tone = 'neutral', children }) {
  return (
    <span className={clsx("inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1 whitespace-nowrap", TONES[tone])}>
      <span className={clsx("w-1.5 h-1.5 rounded-full", DOTS[tone])} />
      {children}
    </span>
  );
}

export function Skeleton({ className }) {
  return <div className={clsx("shimmer rounded-media", className)} />;
}

/** Small "Loading…" cue with spinner, shown above skeletons. */
export function LoadingCue({ label = 'Loading' }) {
  return (
    <div className="flex items-center gap-2 text-xs text-[var(--admin-muted)] mb-4" role="status" aria-live="polite">
      <span className="w-3.5 h-3.5 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
      {label}…
    </div>
  );
}

export function Card({ title, subtitle, action, children, className, flush }) {
  return (
    <section className={clsx("bg-white border border-[var(--admin-border)] rounded-card", className)}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 px-5 md:px-6 pt-5 md:pt-6 pb-4">
          <div>
            {title && <h2 className="text-[17px] font-medium tracking-tight">{title}</h2>}
            {subtitle && <p className="text-xs text-[var(--admin-muted)] mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={clsx(!flush && "px-5 md:px-6 pb-5 md:pb-6")}>{children}</div>
    </section>
  );
}

export function PageHeader({ title, description, actions }) {
  // Same header pattern as the admin pages (the shared admin.css gives every h1 the large title style).
  return (
    <header className="mb-8 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-1 text-sm md:text-base">{description}</p>}
      </div>
      {actions}
    </header>
  );
}

export function EmptyState({ title, hint }) {
  // Same empty state as the admin lists.
  return (
    <div className="text-center py-20 rounded-card border-dashed border-2 border-border text-muted-foreground font-medium">
      <p>{title}</p>
      {hint && <p className="text-xs font-normal mt-1">{hint}</p>}
    </div>
  );
}
