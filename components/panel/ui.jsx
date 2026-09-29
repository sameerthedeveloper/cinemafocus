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
        <span className="w-8 h-8 rounded-lg bg-black/[0.045] text-[var(--admin-muted)] flex items-center justify-center">
          <Icon size={16} strokeWidth={1.75} />
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-[34px] leading-none font-semibold tracking-[-0.03em] tabular">{value}</span>
        {delta}
      </div>
      <div className="mt-2 text-xs text-[var(--admin-muted)]">{sub}</div>
    </>
  );
  const cls = "block bg-white border border-[var(--admin-border)] rounded-[20px] p-5 md:p-6 shadow-sm";
  return href
    ? <Link href={href} className={clsx(cls, "lift press")}>{body}</Link>
    : <div className={cls}>{body}</div>;
}

export function Delta({ pct }) {
  if (pct === null) return <span className="text-xs font-medium text-[var(--admin-info)] bg-blue-50 rounded-full px-2 py-0.5">New</span>;
  const up = pct > 0;
  const flat = pct === 0;
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={clsx("inline-flex items-center gap-0.5 text-xs font-medium rounded-full px-2 py-0.5 tabular",
      flat ? "text-[var(--admin-muted)] bg-black/[0.045]" : up ? "text-[var(--admin-success)] bg-green-50" : "text-[var(--admin-danger)] bg-red-50")}>
      <Icon size={12} />{Math.abs(pct).toFixed(0)}%
    </span>
  );
}

const TONES = {
  success: "text-[var(--admin-success)] bg-green-50",
  warning: "text-[var(--admin-warning)] bg-amber-50",
  danger: "text-[var(--admin-danger)] bg-red-50",
  info: "text-[var(--admin-info)] bg-blue-50",
  neutral: "text-[var(--admin-muted)] bg-black/[0.045]",
};
const DOTS = {
  success: "bg-[var(--admin-success)]", warning: "bg-[var(--admin-warning)]",
  danger: "bg-[var(--admin-danger)]", info: "bg-[var(--admin-info)]", neutral: "bg-[#9ca3af]",
};

export function Badge({ tone = 'neutral', children }) {
  return (
    <span className={clsx("inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2 py-0.5 whitespace-nowrap", TONES[tone])}>
      <span className={clsx("w-1.5 h-1.5 rounded-full", DOTS[tone])} />
      {children}
    </span>
  );
}

export function Skeleton({ className }) {
  return <div className={clsx("bg-black/[0.06] rounded-xl animate-pulse", className)} />;
}

export function Card({ title, subtitle, action, children, className, flush }) {
  return (
    <section className={clsx("bg-white border border-[var(--admin-border)] rounded-[20px] shadow-sm", className)}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 px-5 md:px-6 pt-5 md:pt-6 pb-4">
          <div>
            {title && <h2 className="text-[17px] font-semibold tracking-[-0.022em]">{title}</h2>}
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
  return (
    <header className="mb-6 md:mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[32px] md:text-[34px] leading-[1.1] font-bold tracking-[-0.03em]">{title}</h1>
        {description && <p className="text-[var(--admin-muted)] mt-1 text-sm">{description}</p>}
      </div>
      {actions}
    </header>
  );
}

export function EmptyState({ title, hint }) {
  return (
    <div className="py-14 text-center border border-dashed border-[var(--admin-border)] rounded-lg">
      <p className="text-sm font-medium">{title}</p>
      {hint && <p className="text-xs text-[var(--admin-muted)] mt-1">{hint}</p>}
    </div>
  );
}
