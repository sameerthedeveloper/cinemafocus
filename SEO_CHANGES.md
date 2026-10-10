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
