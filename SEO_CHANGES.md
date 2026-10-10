# SEO / AEO / GEO changes

Living log. One section per phase.

## Reality check vs. the brief (assumptions)

| Brief said | Repo is | What I did |
|---|---|---|
| TypeScript, strict | Plain JS/JSX (`jsconfig.json`), no `tsc` | Matched conventions: `.js`/`.jsx`/`.mjs`. "Typecheck" = lint + build. |
| Supabase | Data now lives in **AWS** (API Gateway + DynamoDB), read via `lib/cms.js` -> `lib/aws/adapter.js`. Supabase loader is legacy. | All SEO data reads go through `lib/cms.js`. |
| SQL migrations | DynamoDB is schemaless | New fields (`canonical_slug`, `seo_noindex`, `seo_title`, `seo_description`) are plain optional attributes; no migration to run. See Phase 3. |
| `app/robots.ts`, `app/sitemap.ts`, `next.config.js` | `app/robots.js`, `app/sitemap.js`, `next.config.mjs` | Edited the existing files. |
| Pages table, FAQ/guides routes | No `pages` table, no `/faq`, no `/guides` routes | Not added to sitemap; no `FAQPage` schema. |

## Phase 1: Config + redirects

- Added `lib/site.js` exporting `SITE`, `BUSINESS`, `absoluteUrl()`. Used by metadata + JSON-LD only, never rendered as visible copy.
- `next.config.mjs` `redirects()`: first rule, host `www.cinemafocus.in` -> `https://cinemafocus.in/:path*`, **301** (`statusCode: 301`; Next's `permanent: true` would emit 308).
- Hosting note: in Vercel (Project > Settings > Domains) add both `cinemafocus.in` and `www.cinemafocus.in`; the app-level rule handles the redirect. Setting Vercel's own "Redirect to cinemafocus.in" on the www entry is equivalent and faster. DNS: `www` CNAME -> `cname.vercel-dns.com`.

### Hardcoded placeholders found (report only, NOT changed)

| File | Line(s) | Content |
|---|---|---|
| `components/Footer.jsx` | 23-25 | fallback `123 Audio Lane, Sound City, SC 90210`, `+1 (555) 123-4567`, `contact@cinemafocus.com` |
| `lib/aws/adapter.js` | 339-343 | `DEFAULT_FOOTER` same placeholder set (returned when the `footer` setting 404s) |
| `lib/db.js` | 271-283 | legacy Supabase loader, same placeholders |
| `lib/seeder.js` | 146-166 | seed data, same placeholders |
| `scripts/init_site_settings.js` | 23 | `supportEmail: contact@cinemafocus.com` |
| `app/(public)/press/[id]/page.jsx` | 158-159 | visible "Isabella Chen / media@cinemafocus.com" media contact |
| `app/(public)/press/[id]/page.jsx` | 122-132 | visible **lorem ipsum** + fake quote shown when a release has no content |
| `proxy.js` | 496 | maintenance page `tel:+96899999999` (Oman number) |
| `app/(public)/page.jsx` | 21-24, 34-35, 38-50 | home JSON-LD had `www.` URLs, wrong geo (13.0401, 80.2662), wrong hours (Mon-Thu+Sun 09-18). **Replaced in Phase 5** (schema only, not visible). |

Proposed minimal diffs (not applied):

```diff
# lib/aws/adapter.js  DEFAULT_FOOTER (and components/Footer.jsx fallback)
-    address: "123 Audio Lane, Sound City, SC 90210",
-    phones: ["+1 (555) 123-4567"],
-    email: "contact@cinemafocus.com",
+    address: "New Decor Towers, No. 71, Dr. Radhakrishnan Salai, Mylapore, Chennai 600004",
+    phones: ["+91 98410 35821"],
+    email: "info@cinemafocus.in",
```
```diff
# app/(public)/press/[id]/page.jsx
-<a href="mailto:media@cinemafocus.com" ...>media@cinemafocus.com</a>
+<a href="mailto:info@cinemafocus.in" ...>info@cinemafocus.in</a>
```
Also: the lorem-ipsum fallback block should be removed (empty releases should render nothing), and `/location` visible hours (Mon-Sat 10-19, Sun 11-17) and phone numbers come from `lib/geoContext.js` and **disagree** with the hours/phone you gave (Mon-Sat 11-20). Schema uses your values; reconcile `geoContext.js` yourself.

## Phase 2: robots + sitemap

- `app/robots.js`: `*` plus explicit blocks for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended, all with the same disallows (`/admin/`, `/portal/`, `/api/`, `/*?bypass=true`, `/*?offline=true`). Sitemap line points at `https://cinemafocus.in/sitemap.xml`. Non-production still returns `Disallow: /`.
- Removed `public/robots.txt`. It shadowed `app/robots.js` (static file wins), so the dynamic rules never shipped.
- `app/sitemap.js` rewritten: static routes + `/products` + brands with >= 1 indexable product + indexable products + press **by slug**. `lastModified` from real `updated_at` (old code read a non-existent `updatedAt`, so everything got "now"). Static pages with no real date omit `lastmod`; `/`, `/products`, `/press` use the newest child date. No `changefreq`/`priority`. `revalidate = 3600`.
- Shared rules in `lib/seo.js` (`getIndexableContent`), reused by `llms-full.txt`.
- Pagination: not needed. The AWS API returns full lists (no 1000-row cap). Revisit if the data layer moves back to Supabase.
- `/faq` and `/guides` do not exist, so not in the sitemap.
- `/press/<uuid>` -> `/press/<slug>` **308**. Press detail page split into server `page.jsx` + `PressDetailClient.jsx` (markup unchanged, now server-rendered instead of fetched in `useEffect`).

### Real 308 / 404 status codes (`lib/seoRoutes.js` + `proxy.js`)

`app/(public)/loading.jsx` streams the shell with HTTP 200 before a page can call `redirect()`/`notFound()`, so page-level calls only yield meta-refresh / soft-404. The proxy now resolves, for `/products/:slug`, `/press/:id`, `/brand/:slug` only:
- press UUID -> 308 slug
- product with `canonical_slug` -> 308 target
- unknown / inactive product, unknown press, unknown brand -> real 404 (renders `app/not-found.jsx`)

It keeps a 5-minute in-memory index (3 GET calls per instance per 5 min) and **fails open** if the API is down. Behaviour change worth knowing: unknown `/brand/<slug>` used to redirect to `/products`; it now 404s.

## Phase 3: Duplicates + indexing control

- Data is DynamoDB (schemaless), so there is **no migration to run**. New optional attributes: products `canonical_slug`, `seo_noindex`, `seo_title`, `seo_description`, `price_verified`; categories (brands) `seo_noindex`, `seo_title`, `seo_description`; press `seo_title`, `seo_description`. `lib/supabase/migrations/002_seo_fields.sql` is provided only for the legacy Supabase schema.
- Product page: `canonical_slug` -> 308 (proxy gate, with a `permanentRedirect` fallback in the page); `seo_noindex` -> `robots: noindex`.
- Brand page: `noindex` when it has 0 indexable products (e.g. `aune-audio`) or `seo_noindex`; excluded from sitemap by the same rule.
- Admin: new **Search & Indexing** card on Edit Product and extra inputs in the Brand modal. Both forms rebuild the saved object, so the fields are included in the save payload (otherwise an edit would wipe them). The "New product" form was not touched; set the fields after creating.
- `SEO_DUPLICATES.md` written from live data.

## Phase 4: Metadata

- `lib/metadata.js` (`buildMetadata`, `pickTitle`, `clampDescription`): absolute apex canonical, Open Graph, Twitter `summary_large_image` + `@cinemafocus`. Titles <= 60 chars (shorter variants tried before truncating), descriptions 120-160 (long copy trimmed; short copy extended with the long description, then a location tag line).
- Applied to: `/`, `/about`, `/contact`, `/gallery`, `/location`, `/press`, `/press/[slug]`, `/products`, `/products/[slug]`, `/brand/[slug]`. Templates as specified: Home `Hi-Fi & Home Cinema Showroom in Chennai | Cinema Focus`; Brand `{Brand} in India | Buy {Brand} at Cinema Focus, Chennai`; Product `{Name} | {Brand} | Cinema Focus Chennai`; Press `{Headline} | Cinema Focus Press Room`.
- CMS overrides honoured (`seo_title`, `seo_description` on products, brands, press). Products also still honour the older `product_seo` setting by slug. There is no `pages` table, so static pages use code defaults.
- Removed: `keywords` (layout, product, brand, static pages), `geo.*`, `ICBM`, the fake `<meta name="preconnect">`/`dns-prefetch` entries, root-level `alternates.canonical: "/"` (it was inherited by every page without its own canonical), layout-level `og:url`.
- Kept: theme-color, Google verification, apple web app tags, icons.
- Fixed: default OG image pointed at `/images/og-image.jpg`, which **does not exist**; now `/images/default-og.jpg`.
- `noindex` added to `/admin` (new `app/admin/layout.jsx`) and `/soon`. `/portal` and admin login already had it. `/launch/[slug]` countdown pages are left as they were.

## Phase 5: Structured data

- `components/JsonLd.jsx` escapes `<` as `<`. Builders in `lib/schema.js`.
- Root layout: one `@graph` with `WebSite` (`#website`) + `ElectronicsStore`/`LocalBusiness` (`#org`): your NAP, geo, Mon-Sat 11:00-20:00, `areaServed` India, logo, image, `sameAs` = `https://twitter.com/cinemafocus`. Replaced two old blocks (and three on the home page) that had wrong hours/geo, `www.` URLs and an invented `priceRange`. `lib/structuredData.js` deleted.
- `Product`: name, brand, description, images, sku (`sku` field, else the DB `productId`), url, `additionalProperty` from specifications. **`offers` only when the product has `price_verified = true` and a price > 0** (new checkbox in the admin). No product has it yet, so none emit offers. Reason: prices are in mixed currencies (e.g. SCM12i Pro 2,400 vs LUMIN L2 382,000). Never `aggregateRating`/`review`; the 4.3 / 72 reviews in `geoContext.js` are deliberately not used.
- `BreadcrumbList` on brand/product/press/products. Product crumbs link the brand only when a brand page exists.
- `NewsArticle` on press. `CollectionPage` + `ItemList` on `/products` and brand pages (duplicates/noindex products excluded).
- No `FAQPage`: there is no FAQ route or content.
- `scripts/validate-jsonld.mjs` (`npm run seo:validate`): run against a running build; checks parse, required fields, title/description/canonical, no keywords/geo meta, no aggregateRating, no UUID press URLs in the sitemap. (`.mjs`, not `.ts`, because the repo is JS.)

## Phase 6: Rendering + links (no visual change)

- **Server rendering**: verified by `curl` of the production build. Brand, product, press, contact, gallery, press list, about and home all carry their text in the raw HTML. `/products` was the exception: it fetched everything in `useEffect` and `useSearchParams` forced a spinner into the HTML. It is now a server page (`page.jsx`) that passes cached CMS data to the same client component (`ProductsClient.jsx`, markup unchanged); the raw HTML now contains all 169 product links. `/products?category=x` still loads client-side as before. The page now renders per request (reads `searchParams`), data is still cached 1h.
- **Press detail** now server-rendered (see Phase 2).
- **Links**: header, footer, cards, breadcrumbs already use `next/link`. Not changed: the brand filter tabs on `/products` are `<button>`s that call `router.push` (JS-only). Brand pages are still crawlable from the sitemap, home and footer. Converting them to `<Link>` changes the DOM element, so I left it for you to decide.
- **Images**: alt fallbacks added in code for gallery / home gallery / brand tabs (`Cinema Focus installation`, `Brand`). Product and press images already fall back to the product name / title. Hero and product main image already `priority`; the rest lazy. Map iframes (`/contact`, home, `/location`) were already `loading="lazy"`.
- **Preconnect**: now a real `<link rel="preconnect">` to the CloudFront origin only (`NEXT_PUBLIC_CDN_DOMAIN`, falling back to `d2x0o69dm3vdcd.cloudfront.net`). Supabase and unsplash removed. `images.unsplash.com` is still in `next.config.mjs` `remotePatterns` because `lib/seed-data.js` references it; harmless, remove with the seed data.
- **Trailing slash**: Next default, `/x/` -> 308 `/x`. Canonicals have no trailing slash.
- **404s**: real 404 status for unknown routes (verified `/foo`, `/products/nope`, `/brand/nope`, `/press/nope`); see Phase 2 gate.

### Heading audit (fix via CMS, nothing changed in code)

Every page has exactly one `<h1>`. Skipped levels (h1 -> h3 with no h2): `/gallery`, `/press`, `/products`, `/brand/*`, `/products/*`, `/press/*`. `/about` has H1 "Our Philosophy" (the CMS `philosophy.title`), so the page's H1 is not "About Cinema Focus". `/location` uses h2 for a tagline then h3 sections (fine). Home h1 is the hero slide title.

## Phase 7: GEO files

- `public/llms.txt`: business summary (your NAP and hours), key pages, 12 brands that have >= 1 indexable product (`aune-audio` excluded). Generated by `node scripts/generate-llms-txt.mjs` from the live catalogue; re-run when brands change.
- `/llms-full.txt` (`app/llms-full.txt/route.js`, `lib/llms.js`): every brand, product name, canonical URL and a one-line summary (first sentence of the description). Uses the same indexable rules as the sitemap, so duplicates and noindex items drop out as soon as you flag them. `revalidate = 3600`.
- No claims beyond CMS/config data (no "authorised dealer", ratings, awards).
- **IndexNow**: `lib/indexnow.js` (no-op when `INDEXNOW_KEY` is unset). Key file `public/32318fb24cc469d417aaa7a15007dbeb.txt`. To enable, set `INDEXNOW_KEY=32318fb24cc469d417aaa7a15007dbeb` in the hosting env (or generate your own key: replace the file name and contents and the env value together). Admin publishes (`revalidateData` for products/categories/press, and `revalidatePressCache`) call `after(() => pingRecentlyChanged())`, which submits pages modified in the last 24h, at most once per 5 min per instance. `node scripts/indexnow-submit.mjs` submits the whole sitemap manually (use once after launch).
- **Cache headers** (`next.config.mjs` `headers()`): `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt` -> `public, s-maxage=3600, stale-while-revalidate=86400`.

## Data issues found

- Placeholder NAP in code: see Phase 1 table.
- `lib/geoContext.js` (visible on `/location`) disagrees with your details: hours Mon-Sat 10:00-19:00 + Sun 11:00-17:00 (you: Mon-Sat 11:00-20:00), phones +91-44-2811-7722 / -7755 / mobile, plus a visible 4.3 / 72 "verified reviews" block that has no source. I did not use any of it in schema.
- Prices: 68 of 180 products priced, in mixed scales (2,400 to 3,399,000). No `offers` emitted until you tick "Price is verified INR".
- Brand pages 404: categories `act-pro` and `beyond-line` have products but no brand row (9 products). Add the brand rows in Admin > Brands or re-categorise the products.
- Brand label typos on products ("ACT PRO", "Hifi Rose" vs "Hifirose", ORBID AUDIO / ORBID SOUND).
- `aune-audio` brand has 0 active products (thin page, noindex).
- 117 / 180 products have `short_description` identical to `long_description`.
- `/press/<slug>` shows lorem ipsum + a fake quote when a release has no body; media contact "Isabella Chen / media@cinemafocus.com".
- Missing OG image `/images/og-image.jpg` was referenced before; fixed to `default-og.jpg`. A dedicated 1200x630 social image would be better than reusing `default-og.jpg`.
- `/location` hard-codes a brand list (ATC, PROAC, Krell, Esoteric, Perreaux, MIT, ...) and a Google Maps embed with a placeholder `pb=` place id ("0x5e5e5e..."), so the map may not pin the showroom. Neither is touched.
- Missing alts: none found with empty values after the fallbacks; the second header logo has `alt=""` on purpose (decorative duplicate).

## CMS / manual to-do list

1. Admin > Products: set **Canonical Product Slug** on confirmed duplicates (see `SEO_DUPLICATES.md`). Fix `atc-hts40` (title "SCM7") and `audio-vector-qr-5-copy` (copied row).
2. Add brand rows for `act-pro` / `beyond-line` (or re-categorise their 9 products); fix the "ACT PRO" brand text.
3. Decide on `aune-audio`: add products or leave it noindex.
4. Tick **Price is verified INR** only on products with a correct rupee price.
5. Optionally fill **SEO Title / SEO Description** (products, brands, press). Keep titles <= 60 and descriptions 120-160.
6. Replace the footer fallback / `DEFAULT_FOOTER` placeholders and make sure the `footer` setting is populated with the real NAP (Phase 1 diffs).
7. Press: give every release a slug and body; remove media contact placeholder.
8. About: set `philosophy.title` so the H1 reads as the about page; add h2s where headings jump h1 -> h3.
9. Reconcile `lib/geoContext.js` (hours, phones, reviews block) with the real details.
10. Hosting: add the `www` domain redirect (Phase 1), set `INDEXNOW_KEY`, and verify `NEXT_PUBLIC_CDN_DOMAIN` is set so image preconnect hits the right origin.
11. Re-run `node scripts/generate-llms-txt.mjs` after brand changes.

## Verification

- `npm run lint`: 43 errors / 69 warnings, all pre-existing (baseline was 44 errors before my changes; none new). `npm run build`: passes. There is no `tsc` step (JS repo).
- `npm run seo:validate`: passes against the production build.
- `curl` of `/`, `/brand/atc`, `/products/a20`, `/press/atc-launch`: title, absolute apex canonical and JSON-LD all present in raw HTML.
- Sitemap: 0 UUID URLs, no flagged duplicates (none flagged yet), real `lastmod`.
- Status codes: `www` -> apex 301 (verified with a `Host` header), press UUID -> 308 slug, unknown product/brand/press -> 404, `/x/` -> 308 `/x`.
- Screenshots (Playwright, 1440px full page, original commit `5c45da8` vs. now): `/brand/atc`, `/products`, `/press/atc-launch`, `/contact` pixel-identical (contact: sub-threshold antialiasing only). Home differs only by the auto-scrolling brand marquee offset (animation timing).
- Found while comparing: product-page thumbnails could stay invisible. `LazyImage` reset its "loaded" state after hydration even when the image had already loaded (the preconnect makes this more likely). Fixed in `components/LazyImage.jsx` (no look change; re-verified thumbnails render).

## Admin: AEO & GEO tab (Admin > SEO > "AEO & GEO")

Stored as the `aeo_geo` site setting (read via `lib/aeoGeo.js`, cached with the `settings` tag, validated server-side; blanks/invalid values fall back to `lib/site.js`).
- **FAQs** -> new public `/faq` page (server-rendered, `FAQPage` JSON-LD from the same data, added to sitemap and `llms-full.txt`). With zero FAQs the page is `noindex`, not in the sitemap, and renders the 404 UI (status is 200 because of the streamed shell; harmless while it's noindex). Not linked from header/footer (that would change the visible UI); link it yourself if you want.
- **AI summary** -> `description` in the Organization schema and the intro line of `llms-full.txt`.
- **Business details** (phone, email, address, PIN, lat/lng, open days + hours, official profile URLs) -> Organization schema (NAP, geo, `openingHoursSpecification`, `sameAs`) and `llms-full.txt`. Never changes visible text. `public/llms.txt` is still generated by `scripts/generate-llms-txt.mjs` from the built-in details.
