import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Left-aligned section header with an optional "see all" link on the right.
export default function SectionHeader({ title, lead, href, linkLabel }) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 md:mb-12 md:flex-row md:items-end">
      <div className="max-w-2xl">
        <h2 className="text-4xl font-medium tracking-tight md:text-5xl">{title}</h2>
        {lead && <p className="mt-3 text-lg text-muted-foreground md:text-xl">{lead}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-secondary px-5 text-sm font-medium tracking-tight transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
