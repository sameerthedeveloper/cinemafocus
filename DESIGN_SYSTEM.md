# Cinema Focus design system

Live guide: `/design-system` (noindex). Tokens: `app/design-tokens.css`. Admin aliases: `app/admin/admin.css`.

## Concept
Listening room. Matte black, quiet white, one brass accent. Brass marks the primary action, active state and focus ring only.

## Rules
- Edit values in `design-tokens.css`. Never hardcode hex in components; use Tailwind roles (`bg-brand`, `text-muted-foreground`, `border-border`) or `--admin-*`.
- Dark band: wrap in `.theme-dark`. Roles flip automatically (`@theme inline` makes Tailwind colors follow the scope).
- Type: `.t-display` (hero, once per page), `.t-h1`, `.t-h2` use Instrument Serif; `.t-h3`, `.t-body`, `.t-small` use Hanken Grotesk. Admin headings stay sans.
- Radius by hierarchy: xs tags, sm inputs, md menus, lg cards, full pills/CTAs.
- Shadows on light surfaces only; dark surfaces use borders.
- Motion: `--ease-out`, 150/300/600ms. One entrance per page. Reduced motion is honored globally.
- Focus: brass 2px outline via `:focus-visible`. Do not remove.
- Copy: sentence case, verbs on buttons ("Save changes"), errors say what to fix.

## Components
`components/ui` re-exports `Button` (variants: primary, brand, secondary, outline, ghost, link), `Field` (input/select/textarea with label, hint, error), `Section`, and the panel set (`Card`, `StatCard`, `Badge`, `Delta`, `PageHeader`, `EmptyState`, `Skeleton`).
