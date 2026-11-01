# Cinema Focus design system

Reference-class home cinema and Hi-Fi retailer, Chennai. The products carry the colour. The interface stays out of the way: white, black, grey, and photography of speakers, amplifiers and turntables.

This document records what the site already does and the rules for extending it. Tokens live in `app/globals.css`. Tailwind v4 reads them from `@theme`.

## Principles

1. **Product is the colour.** UI is monochrome. Never add a brand hue to chrome.
2. **One signal colour.** Orange (`signal`) marks "New". Nothing else uses it.
3. **Quiet surfaces, soft corners.** Cards are tinted fills with no border. Depth appears on hover only.
4. **Motion answers or introduces.** One hero intro, one header entrance, hover feedback. No scattered scroll fades.
5. **Content is real.** Brand names, model names, addresses and hours come from the catalogue or CMS. No invented copy or reviews.

## Colour

Components use semantic tokens (`bg-background`, `text-muted-foreground`), never raw hex.

| Token | Light value | Use |
|---|---|---|
| `background` | `#ffffff` | Page |
| `foreground` / `primary` | `#000000` | Text, primary button, focus ring |
| `secondary` | `hsl(0 0% 96%)` | Card fill (use `/40` at rest, `/70` on hover) |
| `card` | `hsl(0 0% 98%)` | Footer, raised panels |
| `accent` | `hsl(0 0% 90%)` | Hover fill for ghost and outline controls |
| `muted-foreground` | `hsl(0 0% 45%)` | Secondary text, metadata |
| `border` / `input` | `hsl(0 0% 90%)` | Hairlines, field outlines |
| `stage` | `#0a0a0a` | Hero, launch pages, dark header state |
| `signal` | `#e05600` | "New" marker |
| `danger` | `#d70015` | Errors, destructive actions |

Rules:
- Text on `secondary` or `card` uses `foreground` or `muted-foreground`. Both pass AA.
- Over `stage`, text is `white`, secondary text `white/70`.
- Replace stray hex values (`#1d1d1f`, `#86868b`, `#6e6e73`, `#6b7280`, `#9ca3af`, `#d2d2d7`, `#f5f5f7`) with tokens when you touch the file. See Debt below.
- Dark mode is not shipped. Tokens are `hsl` triplets in `:root`, so a `.dark` override is the only change needed when it is.

## Typography

One family: **Inter** (`--font-inter`), with `font-feature-settings: "cv11", "ss01"`. Headings use `font-medium` and `tracking-tight`.

| Role | Classes | Where |
|---|---|---|
| Hero title | `text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold leading-[1.1]` | Home hero |
| Page title (h1) | `text-4xl md:text-5xl font-medium tracking-tight` | Listing and detail pages |
| Section title (h2) | `text-4xl md:text-5xl font-medium tracking-tight` | Page sections |
| Subsection (h2) | `text-xl md:text-2xl font-medium` | Within a section |
| Card title | `text-[15px] sm:text-base font-semibold leading-snug line-clamp-2` | Product, press |
| Lead | `text-lg md:text-xl text-muted-foreground` | Under page titles |
| Body | `text-base leading-relaxed` | Articles, descriptions |
| Meta | `text-xs` or `text-sm text-muted-foreground` | Brand line, counts, dates |
| Price | `text-sm font-medium` | Cards |

Rules:
- Body line length stays under 70 characters (`max-w-3xl` on prose).
- Sentence case for headings, buttons and links.
- The meta line above a card title (brand name) is small, `muted-foreground`, and uppercase with `tracking-[0.12em]` today. Keep it to that one place. Do not add uppercase eyebrows above section headings.
- Off-scale sizes (`text-[10px]`, `text-[11px]`) are allowed only for badges and meta lines.

## Layout

- Page container: `max-w-7xl mx-auto px-4 md:px-8`. Use `<Section>`.
- Section rhythm: `py-16 md:py-24`.
- Prose pages: `max-w-3xl` or `max-w-4xl`, left aligned.
- Hero is full-bleed, `100dvh`, on `stage`.
- Grids: products 2 columns on phones, 3 at `sm`, 4 at `lg`. Gap `gap-x-3 gap-y-5 sm:gap-x-4 md:gap-x-6 md:gap-y-8`.
- Align text left. Centre only category tiles, empty states and the footer on mobile.

Breakpoints are Tailwind defaults (`sm 640`, `md 768`, `lg 1024`). The hero adds a `3xl` cap at 2560px.

## Shape and depth

| Token | Value | Use |
|---|---|---|
| `rounded-control` | 12px | Inputs, select |
| `rounded-media` | 16px | Image wells inside cards |
| `rounded-card` | 24px | Product and press cards |
| `rounded-panel` | 32px | Category tiles, large panels |
| `rounded-full` | pill | Buttons, badges, header |

| Token | Use |
|---|---|
| `shadow-lift` | Card hover only |
| `shadow-float` | Scrolled header pill |

Cards have no border and no resting shadow. Nested radii step down: panel > card > media.

## Components

### Button (`components/Button.jsx`)
Variants: `primary` (black fill), `secondary` (grey fill), `outline`, `ghost`, `link`. Sizes: `sm` 36px, `md` 44px, `lg` 56px, `icon` 40px square.
- Label says what happens: "View product", "Send message", not "Submit".
- One primary button per view.
- Add `icon` only for forward navigation. The arrow is the only icon used inside button text.
- The button currently sets uppercase labels with no radius. Migrate to sentence case and `rounded-full` when next touched. See Debt.

### Product card (`components/ProductCard.jsx`)
Square image well on a `secondary/40` fill, `rounded-card`. Order: brand line, product name (two lines max), price or "Learn more". "New" badge sits top left on `primary`, not `signal`. Hover: fill darkens to `/70`, image scales to 1.06, `shadow-lift`.

### Category tile (`components/CategoryCard.jsx`)
Round logo well on a `secondary/10` fill, `rounded-panel`, fixed width 160px (200px at `md`). Subtitle is the item count. The "New" subtitle is the only place `signal` text appears. Remove the pulse animation.

### Header (`components/Header.jsx`)
Floating pill, fit-to-content and centered from `lg`, `top-4`. Links are bold uppercase `tracking-widest`; a grey pill slides between them on hover, active link gets an underline, "New Launches" carries the `signal` dot. "Visit showroom" button (from `xl`) links to `/location`. Transparent over the home hero with white text and the light logo. Past 24px of scroll (back under 8px, so it never flickers) or with the mobile menu open it becomes a solid white pill with dark text, dark logo and `shadow-float`, on every page. No blur. The mobile menu expands the pill to `rounded-[28px]` and cascades links.

### Footer (`components/Footer.jsx`)
`card` fill, top border, four columns from `lg`. Column headings are `font-medium`. Links are `muted-foreground`, hover `primary`.

### Image (`LazyImage`, `OptimizedImage`)
Always pass `alt` and `sizes`. Product images use `object-contain` on the card fill. Hero and gallery images use `object-cover`.

## Motion

| Name | Value | Use |
|---|---|---|
| Hover | `duration-300` | Colour, opacity |
| Card | `duration-500 ease-out` | Fill, shadow |
| Image zoom | `duration-700 ease-out` | Product image hover |
| Settle | `0.7s var(--ease-settle)` | `hero-intro` |
| Header entrance | GSAP `power3.out`, 0.6s, stagger 0.06 | Once per load |

Rules:
- Every animation honours `prefers-reduced-motion`.
- Entrance fades on the home hero and header are the only non-hover motion. Do not wrap every section in `Reveal`.
- Hover lifts (`-translate-y`) are reserved for category tiles.

## Accessibility

- Visible focus on every interactive element: `focus-visible:ring-2 ring-primary ring-offset-2 ring-offset-background`. `Button` currently sets `focus:outline-none` with no replacement. Fix it.
- Touch targets are at least 40px.
- Heading order is sequential. `ProductCard` takes `headingLevel` for this.
- Text over photography needs a scrim. The hero uses `drop-shadow`. Prefer a gradient overlay.
- Links that open a new tab get `rel="noopener noreferrer"`.

## Voice

Plain and specific. A listener's vocabulary, not a marketer's: "Hear it in our Chennai showroom", not "Elevate your sonic journey".
- Name the product and the brand. Give a real model, price or address.
- Buttons are verbs: "View product", "Get directions", "Call the showroom".
- Errors say what failed and what to do next, with no apology.
- Empty states say how to fill them: "No press releases yet. Check back after the next launch."

## Do and don't

| Do | Don't |
|---|---|
| Use `bg-secondary/40` for a card fill | Add a border and a shadow to a resting card |
| Use `signal` for "New" text or dot | Use orange for buttons or links |
| Reach for a radius token | Write `rounded-[28px]` ad hoc |
| Use `text-muted-foreground` | Write `text-[#86868b]` |
| Keep one primary button per view | Stack two black buttons side by side |

## Debt found while writing this

Fix these when you next touch the file. Do not do a sweep.
1. Hard-coded greys and `#e05600` in components. Replace with tokens.
2. `Button` is uppercase, has no radius, and drops the focus ring.
3. `Footer` headings are uppercase with `tracking-widest`. Match the sentence-case rule.
4. `Footer` fallback data holds placeholder address, phone and email (`123 Audio Lane`, `+1 (555) 123-4567`). Replace with the real showroom details used on `/location`.
5. `Footer` and `Header` load the logo from `/images/logo.png` and `logo-light.webp`. Keep one asset pair and document it here.
6. Radii in components drift (`rounded-3xl`, `rounded-2xl`, `rounded-[2rem]`, `rounded-[28px]`). Map each to a token.
7. `--font-serif` points to `SF Pro Display`, which is not loaded. Remove it or load the font.
8. `.line-clamp-2` in `globals.css` duplicates the Tailwind v4 built-in.
