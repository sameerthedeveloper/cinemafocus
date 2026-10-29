import React, { useId } from 'react';
import clsx from 'clsx';

/** Shared form controls for the public site and the admin/portal. Sizes and states come from design tokens. */

const control = clsx(
  "w-full h-11 px-3.5 rounded-[var(--radius-sm)] border border-input bg-background text-foreground",
  "placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-[var(--dur-base)]",
  "hover:border-ring/50 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25",
  "aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/20 disabled:opacity-50 disabled:cursor-not-allowed"
);

/** Label + control + hint/error wired together with aria. Pass `as` = 'input' | 'textarea' | 'select'. */
export default function Field({ label, hint, error, as: As = 'input', className, children, ...props }) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <As
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={clsx(control, As === 'textarea' && "h-auto min-h-28 py-3")}
        {...props}
      >
        {children}
      </As>
      {error
        ? <p id={`${id}-error`} className="text-xs text-danger">{error}</p>
        : hint && <p id={`${id}-hint`} className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
