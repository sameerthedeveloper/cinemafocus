/**
 * Regenerates public/llms.txt from the live catalogue (brands that have >= 1 indexable product).
 *   node scripts/generate-llms-txt.mjs        (reads API_GATEWAY_URL from .env.local)
 * Re-run after adding or removing a brand, then commit.
 */
import fs from 'node:fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', quiet: true });
const base = process.env.API_GATEWAY_URL?.replace(/\/$/, '');
if (!base) throw new Error('API_GATEWAY_URL is not set');

const get = async (p) => {
  const res = await fetch(base + p);
  if (!res.ok) throw new Error(`${p} -> ${res.status}`);
  return res.json();
};
const [products, categories] = await Promise.all([get('/products'), get('/categories')]);

const indexable = products.filter((p) => {
  const canon = p.canonical_slug ?? p.canonicalSlug;
  return p.slug && p.is_active !== false && !(canon && canon !== p.slug) && (p.seo_noindex ?? p.seoNoindex) !== true;
});
const counts = {};
for (const p of indexable) counts[p.category] = (counts[p.category] || 0) + 1;

const brands = categories
  .filter((c) => c.slug && counts[c.slug] > 0 && (c.seo_noindex ?? c.seoNoindex) !== true)
  .sort((a, b) => a.name.localeCompare(b.name));

const site = 'https://cinemafocus.in';
const out = `# Cinema Focus

> Hi-fi and home cinema showroom in Mylapore, Chennai, India. Browse and listen to high-end speakers, amplifiers, streamers, DACs and home cinema systems from the brands below.

## Visit

- Address: New Decor Towers, No. 71, Dr. Radhakrishnan Salai, Mylapore, Chennai 600004, Tamil Nadu, India
- Phone: +91 98410 35821
- Email: info@cinemafocus.in
- Hours: Monday to Saturday, 11:00 to 20:00

## Key pages

- [Home](${site}/): showroom overview
- [Products](${site}/products): full product catalogue
- [About](${site}/about): who we are
- [Gallery](${site}/gallery): installations
- [Press Room](${site}/press): news and launches
- [Contact](${site}/contact): enquiries
- [Location](${site}/location): directions and showroom details

## Brands

${brands.map((b) => `- [${b.name}](${site}/brand/${b.slug})`).join('\n')}

## Full catalogue

- [llms-full.txt](${site}/llms-full.txt): every brand and product with canonical URLs and one-line summaries
- [Sitemap](${site}/sitemap.xml)
`;
fs.writeFileSync('public/llms.txt', out);
console.log(`public/llms.txt written (${brands.length} brands)`);
