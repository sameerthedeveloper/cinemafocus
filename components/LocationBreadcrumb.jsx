import { ChevronRight } from 'lucide-react';

const Sep = () => <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />;

export default function LocationBreadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
        <a itemProp="item" href="https://cinemafocus.in" className="transition-colors hover:text-foreground">
          <span itemProp="name">Cinema Focus</span>
        </a>
        <meta itemProp="position" content="1" />
      </span>
      <Sep />
      <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
        <span itemProp="name">Chennai</span>
        <meta itemProp="position" content="2" />
      </span>
      <Sep />
      <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" aria-current="page" className="text-foreground">
        <span itemProp="name">Mylapore</span>
        <meta itemProp="position" content="3" />
      </span>
    </nav>
  );
}
