# SEO / AI-visibility audit (code side) and status

Scope agreed: canonical host stays the apex `https://cinemafocus.in` (the master prompt's `www` URL is not used; `www` 301s to apex). Code-side gaps only; no new written content was published. Verified with `npm run build`, `npm run seo:audit` and `npm run seo:validate` on 2026-10-10 against a production build.

## Findings

### Critical (fixed earlier in this branch)
- `public/robots.txt` shadowed the dynamic robots, sitemap used UUID press URLs and fake `lastmod`, JSON-LD had wrong hours/geo/`www` URLs and an invented `priceRange`, product `offers` used `price: 0` and "InStock" for every product, missing OG image file. See `SEO_CHANGES.md`.

### High
- **Preview deployments could be indexed**: Vercel previews run with `NODE_ENV=production`, so robots allowed them. Fixed: `robots.js` checks `VERCEL_ENV`, and `next.config.mjs` adds `X-Robots-Tag: noindex, nofollow` on non-production Vercel deploys. (Needs a real preview deploy to confirm.)
- **Crawler policy missed two bots**: `Claude-User` and `Perplexity-User` were absent. Added after checking the Anthropic and Perplexity docs (OpenAI roles: OAI-SearchBot search, ChatGPT-User user fetch, GPTBot training; Google-Extended is a Gemini data-use control and does not affect Search; Applebot-Extended is a training opt-out). Owner policy kept: allow all, including training bots; to opt out of training only, disallow GPTBot, ClaudeBot, Google-Extended, Applebot-Extended in `app/robots.js`.
- **Duplicate listings** (two identical titles in the sitemap now): `cda2-mk2-cd-dac-pre-amplifier(-2)`, `wandla(-2)`, plus the pairs in `SEO_DUPLICATES.md`. Needs CMS action (`canonical_slug`).
- **Broken internal links**: product pages link to `/brand/act-pro` and `/brand/beyond-line`, which have no brand row (404). Needs CMS action (add brand rows or recategorise 9 products).

### Medium
- `WebPage`/`AboutPage`/`ContactPage` schema was missing and the organization had no `ContactPoint`. Added (phone/email from verified business details).
- Duplicate meta descriptions on the three Lumin L2 pages (`lumin-l2`, `-4tb`, `-8tb`): set `SEO Description` per product.
- Heading hierarchy skips h2 on listing/detail pages (see `SEO_CHANGES.md`); `/about` H1 comes from CMS.
- `/location` visible hours/phones come from `lib/geoContext.js` and disagree with the verified details; it also shows an unsourced 4.3-star / 72-review block.
- Press detail pages show lorem ipsum and a placeholder media contact when a release has no body.

### Low
- `images.unsplash.com` still in `next.config.mjs` (seed data only). Brand filter tabs on `/products` are buttons, not links.

## Verification results (actual)

| Check | Result |
|---|---|
| Production build | pass |
| ESLint | 43 errors / 69 warnings, all pre-existing (baseline 44 errors); none introduced |
| TypeScript | not applicable (JS repo) |
| Unit / integration tests | none exist in the repo (`scripts/test-*.mjs` need live AWS/credentials and were not run) |
| Sitemap XML valid, no duplicate/non-canonical URLs | pass (191 URLs) |
| robots.txt (private paths, sitemap, search/retrieval bots) | pass |
| Every sitemap URL: 200, canonical == URL, not noindex | pass |
| Duplicate titles | **fail: 2 pairs (data, above)** |
| Broken internal links | **fail: 2 (data, above)** |
| Legacy redirects (8 WordPress patterns), www -> apex 301 | pass |
| Private routes (`/admin`, `/portal`) redirect to login; unauthenticated `POST /api/aws/products` rejected | pass |
| JSON-LD parse + required fields | pass |
| Lighthouse / Core Web Vitals | **not measured** (no Lighthouse run here). Run PageSpeed Insights on 5 URLs (checklist). Targets: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 |
| Rich Results Test / Schema.org validator | **manual** (needs the public URL) |
| Mobile + accessibility audit | **manual / not run** |

The two failing checks are content-data problems that need your CMS edits; they are not code regressions. This is therefore not "all green": do the CMS to-do list in `SEO_CHANGES.md`, then re-run `npm run seo:audit`.

## Needs owner access (cannot be done from code)
Google Business Profile and Bing Places verification, Search Console / Bing Webmaster ownership and sitemap submission, `INDEXNOW_KEY` env, DNS/host `www` domain, directory listings, manufacturer dealer-page links, review requests to real customers. Step-by-step in `SEO_LAUNCH_CHECKLIST.md`.

## Unknown / unverified facts (not published anywhere)
Showroom visit/demonstration policy, installation and consultation services, delivery coverage, authorised-dealer status per brand, founding year, social profile URLs. Add them in Admin > SEO > AEO & GEO once confirmed.
