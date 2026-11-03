# SEO launch checklist

Do these after the code is deployed and `SEO_CHANGES.md` CMS to-dos are done.

## Before launch
- [ ] Deploy; confirm `https://www.cinemafocus.in/anything` 301s to `https://cinemafocus.in/anything`.
- [ ] `https://cinemafocus.in/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt` all load.
- [ ] Sitemap has no `/press/<uuid>` URLs and none of the duplicates from `SEO_DUPLICATES.md`.
- [ ] Set `INDEXNOW_KEY` in the hosting env; confirm `https://cinemafocus.in/<key>.txt` returns the key.
- [ ] `npm run seo:validate` against the deployed build (`node scripts/validate-jsonld.mjs https://cinemafocus.in`).

## Google
- [ ] **Google Business Profile**: claim and verify the Mylapore listing. Name, address, phone and hours must match the site exactly: Cinema Focus, New Decor Towers, No. 71, Dr. Radhakrishnan Salai, Mylapore, Chennai 600004, +91 98410 35821, Mon-Sat 11:00-20:00. Add the website `https://cinemafocus.in` and a Twitter link.
- [ ] **Search Console**: add the domain property (DNS TXT), submit `https://cinemafocus.in/sitemap.xml`, check Pages report for "Duplicate" / "Excluded by noindex" matching your flags.
- [ ] Request indexing for `/`, `/products`, `/about`, `/contact`, `/location`, then your top 5 brand pages and top 10 product pages.
- [ ] Watch Search Console > Pages for 404s from old URLs; add redirects for any that still get traffic.

## Bing and other engines
- [ ] **Bing Webmaster Tools**: import from Search Console, submit the sitemap.
- [ ] Run `INDEXNOW_KEY=<key> node scripts/indexnow-submit.mjs` once, then confirm in Bing Webmaster > IndexNow.

## Local / citations (identical NAP everywhere)
- [ ] Directory listings with the exact NAP above: Bing Places, Apple Business Connect, Justdial, Sulekha, IndiaMART (if relevant), Facebook, Instagram, LinkedIn, YouTube channel About page.
- [ ] Use one phone format (`+91 98410 35821`) and one address string.

## Links and mentions
- [ ] Ask each manufacturer you carry (ATC, Aurender, Lumin, ProAc, Octave, Audio Vector, ...) to list Cinema Focus on their "where to buy" / dealer page with a link to the matching `/brand/<slug>` page. Only claim authorised-dealer status where it is true.
- [ ] Press / YouTube outreach: send audio-press and Indian hi-fi YouTubers and forums your press releases and invite them to the showroom; ask for a link to the relevant `/press/<slug>` or product page.

## Validation (5 URLs)
Run each through [Rich Results Test](https://search.google.com/test/rich-results) and [PageSpeed Insights](https://pagespeed.web.dev/) (mobile):
- [ ] `https://cinemafocus.in/`
- [ ] `https://cinemafocus.in/products`
- [ ] one brand page (e.g. `/brand/atc`)
- [ ] one product page
- [ ] one press page
Expect: valid Breadcrumb, Product (no offers until prices are marked verified), NewsArticle, LocalBusiness; no errors. Warnings about missing `offers`/`aggregateRating` are expected and intentional.

## Monthly
- [ ] AI-answer tracking: ask ChatGPT, Perplexity, Claude, Gemini and Google AI Overviews the same 10 prompts (e.g. "best hi-fi showroom in Chennai", "where to buy ATC speakers in India", "Aurender dealer Chennai", "home cinema installation Chennai"). Log whether Cinema Focus is named/cited and which URL.
- [ ] Search Console: queries, impressions, clicks for brand pages; fix pages with impressions but low CTR (SEO Title / Description fields).
- [ ] Re-run `generate-llms-txt.mjs` if brands changed; re-check duplicates after bulk imports.
