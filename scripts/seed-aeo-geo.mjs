/**
 * Writes the `aeo_geo` site setting (Admin > SEO > AEO & GEO) to the live AWS CMS.
 * Content is limited to facts already in the catalogue and in the SEO brief.
 *
 *   ADMIN_EMAIL=you@x.com ADMIN_PASSWORD='...' node scripts/seed-aeo-geo.mjs          # dry run (prints payload)
 *   ADMIN_EMAIL=you@x.com ADMIN_PASSWORD='...' node scripts/seed-aeo-geo.mjs --write  # saves it
 *
 * Refuses to overwrite an existing `aeo_geo` setting unless --force is also passed.
 */
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', quiet: true });
const base = process.env.API_GATEWAY_URL?.replace(/\/$/, '');
const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
const write = process.argv.includes('--write');
const force = process.argv.includes('--force');
if (!base) throw new Error('API_GATEWAY_URL is not set');
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD');

const getJson = async (p) => {
  const res = await fetch(base + p);
  return { status: res.status, body: res.ok ? await res.json() : null };
};

const [products, categories, existing] = await Promise.all([
  getJson('/products'),
  getJson('/categories'),
  getJson('/site-settings/aeo_geo'),
]);

const indexable = products.body.filter((p) => {
  const canon = p.canonical_slug ?? p.canonicalSlug;
  return p.slug && p.is_active !== false && !(canon && canon !== p.slug) && (p.seo_noindex ?? p.seoNoindex) !== true;
});
const counts = {};
for (const p of indexable) counts[p.category] = (counts[p.category] || 0) + 1;
const brands = categories.body
  .filter((c) => counts[c.slug] > 0)
  .sort((a, b) => (counts[b.slug] || 0) - (counts[a.slug] || 0))
  .map((c) => c.name);
const brandList = brands.join(', ');

const address = 'New Decor Towers, No. 71, Dr. Radhakrishnan Salai, Mylapore, Chennai 600004, Tamil Nadu, India';

const data = {
  aiSummary: `Cinema Focus is a hi-fi and home cinema showroom in Mylapore, Chennai, India, with speakers, amplifiers, streamers, DACs and home cinema equipment from brands including ${brands.slice(0, 5).join(', ')}.`,
  faqs: [
    {
      question: 'Where is the Cinema Focus showroom?',
      answer: `Cinema Focus is at ${address}.`,
    },
    {
      question: 'What are the Cinema Focus opening hours?',
      answer: 'The showroom is open Monday to Saturday, 11:00 to 20:00.',
    },
    {
      question: 'How can I contact Cinema Focus?',
      answer: 'Call +91 98410 35821 or email info@cinemafocus.in. You can also use the contact form on the website.',
    },
    {
      question: 'Which brands does Cinema Focus carry?',
      answer: `Brands on the Cinema Focus website include ${brandList}.`,
    },
    {
      question: 'What kind of equipment does Cinema Focus sell?',
      answer: 'High-end hi-fi and home cinema equipment: loudspeakers, subwoofers, amplifiers, music streamers, DACs and related products. Browse the full range on the Products page.',
    },
  ],
  business: {
    phone: '+91 98410 35821',
    email: 'info@cinemafocus.in',
    streetAddress: 'New Decor Towers, No. 71, Dr. Radhakrishnan Salai',
    locality: 'Mylapore',
    city: 'Chennai',
    region: 'Tamil Nadu',
    postalCode: '600004',
    latitude: '13.0415',
    longitude: '80.2720',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '11:00',
    closes: '20:00',
    sameAs: [],
  },
};

console.log(JSON.stringify(data, null, 2));
console.log(`\nExisting aeo_geo setting: ${existing.status === 404 ? 'none' : `present (HTTP ${existing.status})`}`);
if (!write) {
  console.log('Dry run. Re-run with --write to save.');
  process.exit(0);
}
if (existing.status !== 404 && !force) {
  console.error('An aeo_geo setting already exists. Pass --force to overwrite it.');
  process.exit(1);
}

const login = await fetch(`${base}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
});
const auth = await login.json();
if (!login.ok || !auth.IdToken) throw new Error(`Login failed: ${auth.error || login.status}`);

const res = await fetch(`${base}/site-settings/aeo_geo`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.IdToken}` },
  body: JSON.stringify({ data }),
});
console.log(res.ok ? 'Saved aeo_geo.' : `Save failed: HTTP ${res.status} ${await res.text()}`);
process.exit(res.ok ? 0 : 1);
