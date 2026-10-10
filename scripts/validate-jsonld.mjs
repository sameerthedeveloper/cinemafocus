/**
 * Validates JSON-LD + core head tags on key pages of a running build.
 *
 *   npm run build && npx next start -p 3100 &
 *   node scripts/validate-jsonld.mjs [baseUrl]          (default http://localhost:3100)
 *
 * Picks one brand, product and press page from the live sitemap, fetches each,
 * and asserts: JSON-LD parses, required fields exist, title/canonical/description
 * are present in the raw HTML, and forbidden properties (aggregateRating, review) are absent.
 * Exits 1 on any failure.
 */
const base = (process.argv[2] || 'http://localhost:3100').replace(/\/$/, '');
const failures = [];
const fail = (page, msg) => failures.push(`${page}: ${msg}`);

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'");

async function fetchHtml(path) {
  const res = await fetch(base + path, { redirect: 'manual' });
  if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function extractJsonLd(html, page) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const out = [];
  for (const raw of blocks) {
    if (raw.includes('<')) fail(page, 'raw "<" inside JSON-LD (must be escaped as \\u003c)');
    try {
      out.push(JSON.parse(raw));
    } catch (e) {
      fail(page, `JSON-LD does not parse: ${e.message}`);
    }
  }
  return out;
}

const flatten = (blocks) => blocks.flatMap((b) => (b['@graph'] ? b['@graph'] : [b]));
const typeOf = (n) => [].concat(n['@type'] || []);
const find = (nodes, type) => nodes.find((n) => typeOf(n).includes(type));

function checkHead(html, page, { canonical, noindex = false }) {
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  if (!title) fail(page, 'missing <title>');
  else if (decode(title).length > 60) fail(page, `title is ${decode(title).length} chars (>60)`);
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!desc) fail(page, 'missing meta description');
  else if (decode(desc).length < 100 || decode(desc).length > 160) fail(page, `description is ${decode(desc).length} chars`);
  const canon = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  if (canon !== canonical) fail(page, `canonical is ${canon}, expected ${canonical}`);
  if (/<meta name="(keywords|ICBM|geo\.[a-z]+)"/.test(html)) fail(page, 'legacy keywords/geo/ICBM meta present');
  if (!/twitter:card" content="summary_large_image"/.test(html)) fail(page, 'twitter:card not summary_large_image');
  if (noindex !== /<meta name="robots" content="[^"]*noindex/.test(html)) fail(page, `noindex expected=${noindex}`);
}

function requireFields(page, node, label, fields) {
  if (!node) return fail(page, `missing ${label}`);
  for (const f of fields) if (node[f] === undefined || node[f] === '') fail(page, `${label} missing "${f}"`);
}

async function check(path, canonical, verify) {
  let html;
  try {
    html = await fetchHtml(path);
  } catch (e) {
    return fail(path, e.message);
  }
  checkHead(html, path, { canonical });
  const nodes = flatten(extractJsonLd(html, path));
  if (nodes.some((n) => 'aggregateRating' in n || 'review' in n)) fail(path, 'aggregateRating/review must never be emitted');
  verify(nodes, path);
  console.log(`checked ${path} (${nodes.length} JSON-LD nodes)`);
}

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urls.some((u) => /\/press\/[0-9a-f]{8}-[0-9a-f]{4}-/i.test(u))) fail('sitemap', 'contains UUID press URL');
const pick = (seg) => urls.find((u) => u.includes(`/${seg}/`))?.replace(/^https?:\/\/[^/]+/, '');
const [brand, product, press] = [pick('brand'), pick('products'), pick('press')];
const canon = (p) => `https://cinemafocus.in${p === '/' ? '' : p}`;

await check('/', canon('/'), (nodes, p) => {
  requireFields(p, find(nodes, 'WebSite'), 'WebSite', ['@id', 'url', 'name']);
  const org = find(nodes, 'ElectronicsStore');
  requireFields(p, org, 'ElectronicsStore', ['@id', 'name', 'telephone', 'address', 'geo', 'openingHoursSpecification', 'areaServed', 'logo', 'sameAs']);
});
if (brand) {
  await check(brand, canon(brand), (nodes, p) => {
    requireFields(p, find(nodes, 'BreadcrumbList'), 'BreadcrumbList', ['itemListElement']);
    requireFields(p, find(nodes, 'CollectionPage'), 'CollectionPage', ['url', 'name', 'mainEntity']);
  });
}
if (product) {
  await check(product, canon(product), (nodes, p) => {
    requireFields(p, find(nodes, 'BreadcrumbList'), 'BreadcrumbList', ['itemListElement']);
    const prod = find(nodes, 'Product');
    requireFields(p, prod, 'Product', ['name', 'url', 'sku']);
    if (prod?.offers && !(Number(prod.offers.price) > 0)) fail(p, 'Offer without a positive numeric price');
  });
}
if (press) {
  await check(press, canon(press), (nodes, p) => {
    requireFields(p, find(nodes, 'BreadcrumbList'), 'BreadcrumbList', ['itemListElement']);
    requireFields(p, find(nodes, 'NewsArticle'), 'NewsArticle', ['headline', 'datePublished', 'dateModified', 'publisher']);
  });
}
await check('/products', canon('/products'), (nodes, p) => {
  requireFields(p, find(nodes, 'CollectionPage'), 'CollectionPage', ['mainEntity']);
});

if (failures.length) {
  console.error(`\n${failures.length} problem(s):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log('\nJSON-LD validation passed');
