"use client";
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const label = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, '0')}` : ''} ${suffix}`;
};

/**
 * Live "Open now / Closed" chip for a Mon–Sat showroom, computed in IST so it is
 * right for visitors in any timezone. Renders nothing until mounted (no hydration mismatch).
 */
export default function OpenStatus({ open, close, className }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const compute = () => {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }).formatToParts(new Date());
      const get = (t) => parts.find((p) => p.type === t)?.value;
      const now = Number(get('hour')) * 60 + Number(get('minute'));
      const isOpenDay = get('weekday') !== 'Sun';
      const isOpen = isOpenDay && now >= toMinutes(open) && now < toMinutes(close);
      setStatus(isOpen ? { isOpen, text: `Open now · closes ${label(close)}` } : { isOpen, text: `Closed · opens ${label(open)}` });
    };
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, [open, close]);

  if (!status) return <span className={clsx('inline-block h-8', className)} aria-hidden="true" />;

  return (
    <span className={clsx('inline-flex items-center gap-2 rounded-full bg-secondary px-3.5 py-1.5 text-sm font-medium', className)}>
      <span aria-hidden="true" className={clsx('h-2 w-2 rounded-full', status.isOpen ? 'bg-foreground' : 'bg-muted-foreground/50')} />
      {status.text}
    </span>
  );
}
