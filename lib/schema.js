import { SITE, BUSINESS, absoluteUrl } from '@/lib/site';

/**
 * JSON-LD BUILDERS (pure functions)
 * Only data that exists in the CMS / lib/site.js is emitted. Missing -> field omitted.
 * Never emits aggregateRating / review. `offers` only for prices explicitly marked verified.
 */

export const ORG_ID = `${SITE.url}/#org`;
export const WEBSITE_ID = `${SITE.url}/#website`;

const ctx = 'https://schema.org';

const plain = (v) =>
  typeof v === 'string' ? v.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';

/** Drops undefined / null / empty-string / empty-array values (recursively one level of arrays). */
function compact(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0))
  );
}

export function siteGraph(biz = BUSINESS, description) {
  return {
    '@context': ctx,
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE.url,
        name: SITE.name,
        inLanguage: 'en-IN',
        publisher: { '@id': ORG_ID },
      },
      {
        '@type': ['ElectronicsStore', 'LocalBusiness'],
        '@id': ORG_ID,
        name: biz.name,
        url: SITE.url,
        ...(description ? { description } : {}),
        logo: { '@type': 'ImageObject', url: SITE.logo },
        image: absoluteUrl(SITE.defaultOgImage),
        telephone: biz.phone,
        email: biz.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: biz.streetAddress,
          addressLocality: biz.city,
          addressRegion: biz.region,
          postalCode: biz.postalCode,
          addressCountry: biz.countryCode,
        },
        geo: { '@type': 'GeoCoordinates', ...biz.geo },
        hasMap: `https://www.google.com/maps/search/?api=1&query=${biz.geo.latitude},${biz.geo.longitude}`,
        openingHoursSpecification: biz.hours.map((h) => ({ '@type': 'OpeningHoursSpecification', ...h })),
        areaServed: { '@type': 'Country', name: biz.country },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          telephone: biz.phone,
          email: biz.email,
          areaServed: biz.countryCode,
        },
        sameAs: [SITE.twitterUrl, ...(biz.sameAs || [])].filter((u, i, a) => a.indexOf(u) === i),
      },
    ],
  };
}

export function breadcrumbSchema(items) {
  return {
    '@context': ctx,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

const hasVerifiedPrice = (p) => (p.price_verified ?? p.priceVerified) === true && Number(p.price) > 0;

export function productSchema(product) {
  const url = absoluteUrl(`/products/${product.slug}`);
  const images = (product.images || []).filter((i) => typeof i === 'string' && /^https?:\/\//.test(i));
  const specs = (product.specifications || [])
    .filter((s) => s?.key && s?.value)
    .slice(0, 25)
    .map((s) => ({ '@type': 'PropertyValue', name: String(s.key), value: String(s.value) }));

  return compact({
    '@context': ctx,
    '@type': 'Product',
    '@id': `${url}#product`,
    url,
    name: product.name,
    description: plain(product.shortDescription || product.longDescription) || undefined,
    image: images,
    sku: product.sku || product.productId || product.id,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    additionalProperty: specs,
    offers: hasVerifiedPrice(product)
      ? {
          '@type': 'Offer',
          url,
          priceCurrency: 'INR',
          price: Number(product.price),
          seller: { '@id': ORG_ID },
        }
      : undefined,
  });
}

export function collectionSchema({ path, name, description, items }) {
  const url = absoluteUrl(path);
  return compact({
    '@context': ctx,
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name,
    description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(`/products/${p.slug}`),
        name: p.name,
      })),
    },
  });
}

export function newsArticleSchema(release) {
  const url = absoluteUrl(`/press/${release.slug}`);
  const image = release.imageUrl || release.coverImages?.[0];
  return compact({
    '@context': ctx,
    '@type': 'NewsArticle',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: release.title,
    description: plain(release.excerpt) || undefined,
    datePublished: release.date || release.created_at,
    dateModified: release.updated_at || release.date || release.created_at,
    image: image ? [image] : undefined,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-IN',
  });
}

export function faqSchema(faqs) {
  return {
    '@context': ctx,
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/** WebPage node tied to the site graph (@id values from siteGraph). */
export function webPageSchema({ path, name, description, type = 'WebPage' }) {
  const url = absoluteUrl(path);
  return compact({
    '@context': ctx,
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: 'en-IN',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
  });
}
