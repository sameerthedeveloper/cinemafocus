import { SITE, absoluteUrl } from '@/lib/site';
import { getAeoGeoResolved, formatHours } from '@/lib/aeoGeo';
import { getIndexableContent } from '@/lib/seo';

/** First sentence of a description, capped at 160 chars, single line. */
function oneLine(text) {
  const clean = String(text || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  const sentence = clean.match(/^.*?[.!?](?=\s|$)/)?.[0] || clean;
  return sentence.length > 160 ? `${sentence.slice(0, 157).replace(/\s+\S*$/, '')}…` : sentence;
}

/**
 * Plain-text catalogue for LLM crawlers: brands, product names, canonical URLs and
 * one-line summaries straight from the CMS. Duplicates / noindex items are excluded
 * (same rules as the sitemap).
 */
export async function buildLlmsFull() {
  const [{ products, brands }, { business: BUSINESS, faqs, aiSummary }] = await Promise.all([getIndexableContent(), getAeoGeoResolved()]);

  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${aiSummary || `Hi-fi and home cinema showroom in ${BUSINESS.locality}, ${BUSINESS.city}, ${BUSINESS.country}.`}`,
    '',
    `- Website: ${SITE.url}`,
    `- Address: ${BUSINESS.streetAddress}, ${BUSINESS.locality}, ${BUSINESS.city} ${BUSINESS.postalCode}, ${BUSINESS.region}, ${BUSINESS.country}`,
    `- Phone: ${BUSINESS.phone}`,
    `- Email: ${BUSINESS.email}`,
    `- Hours: ${formatHours(BUSINESS.hours)}`,
    '',
    '## Brands',
    '',
    ...brands.map((b) => `- [${b.name}](${absoluteUrl(`/brand/${b.slug}`)}) (${b.indexableProductCount} products)`),
  ];

  for (const brand of brands) {
    const items = products.filter((p) => p.category === brand.slug);
    lines.push('', `## ${brand.name}`, '');
    for (const p of items) {
      const summary = oneLine(p.shortDescription || p.longDescription);
      lines.push(`- [${p.name}](${absoluteUrl(`/products/${p.slug}`)})${summary ? `: ${summary}` : ''}`);
    }
  }

  // Active products whose brand has no brand page
  const listed = new Set(brands.map((b) => b.slug));
  const others = products.filter((p) => !listed.has(p.category));
  if (others.length) {
    lines.push('', '## Other products', '');
    for (const p of others) {
      const summary = oneLine(p.shortDescription || p.longDescription);
      lines.push(`- [${p.name}](${absoluteUrl(`/products/${p.slug}`)})${p.brand ? ` (${p.brand})` : ''}${summary ? `: ${summary}` : ''}`);
    }
  }

  if (faqs.length) {
    lines.push('', '## Frequently asked questions', '');
    for (const f of faqs) lines.push(`### ${f.question}`, '', f.answer, '');
  }

  return `${lines.join('\n')}\n`;
}
