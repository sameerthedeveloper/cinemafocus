import { SITE, absoluteUrl } from '@/lib/site';

/**
 * METADATA HELPERS
 * Build consistent page metadata: absolute apex canonical, Open Graph, Twitter,
 * title <= 60 chars, description 120-160 chars. Titles are emitted as `absolute`
 * so the root layout's title template never double-suffixes them.
 */

export const HOME_TITLE = 'Hi-Fi & Home Cinema Showroom in Chennai | Cinema Focus';

const MAX_TITLE = 60;
const MIN_DESC = 120;
const MAX_DESC = 160;
const DESC_PAD = ` Cinema Focus showroom, Mylapore, Chennai, India.`;

const collapse = (s) => String(s ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

function truncate(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:|-]+$/, '')}…`;
}

export function clampTitle(title) {
  return truncate(collapse(title), MAX_TITLE);
}

/**
 * 120-160 chars: trims long copy; when short, appends the extra texts in order
 * until long enough, then pads with the showroom location.
 */
export function clampDescription(description, ...extras) {
  const sentence = (t) => (t && !/[.!?…]$/.test(t) ? `${t}.` : t);
  let text = sentence(collapse(description));
  for (const extra of extras) {
    if (text.length >= MIN_DESC) break;
    const more = sentence(collapse(extra));
    if (more && !text.includes(more)) text = `${text} ${more}`.trim();
  }
  if (text.length < MIN_DESC) text = `${text}${DESC_PAD}`.trim();
  return truncate(text, MAX_DESC);
}

/**
 * Title with an ordered list of progressively shorter variants; the first that fits wins.
 * e.g. pickTitle(`${name} | ${brand} | Cinema Focus Chennai`, `${name} | ${brand} | Cinema Focus`, name)
 */
export function pickTitle(...variants) {
  const clean = variants.map(collapse).filter(Boolean);
  return clampTitle(clean.find((v) => v.length <= MAX_TITLE) || clean[clean.length - 1] || SITE.name);
}

export function buildMetadata({
  title,
  description,
  path = '/',
  image,
  imageAlt,
  type = 'website',
  noindex = false,
  publishedTime,
  modifiedTime,
  extraDescriptions = [],
}) {
  const url = absoluteUrl(path);
  const fullTitle = clampTitle(title);
  const desc = clampDescription(description, ...extraDescriptions);
  const imageUrl = absoluteUrl(image || SITE.defaultOgImage);
  const images = [{ url: imageUrl, alt: imageAlt || fullTitle }];

  return {
    title: { absolute: fullTitle },
    description: desc,
    alternates: { canonical: url },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type,
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      images,
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      ...(type === 'article' && modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      site: SITE.twitter,
      creator: SITE.twitter,
      images: [imageUrl],
    },
  };
}
