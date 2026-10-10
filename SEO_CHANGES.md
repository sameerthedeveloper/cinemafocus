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
