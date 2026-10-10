/**
 * SITE CONFIG (SEO / metadata / structured data only)
 * Not used for visible UI copy. Visible contact details come from the CMS
 * (footer settings) and lib/geoContext.js.
 */

export const SITE = {
  name: 'Cinema Focus',
  url: 'https://cinemafocus.in',
  locale: 'en_IN',
  twitter: '@cinemafocus',
  twitterUrl: 'https://twitter.com/cinemafocus',
  logo: 'https://cinemafocus.in/images/logo.png',
  defaultOgImage: '/images/default-og.jpg',
};

export const BUSINESS = {
  name: 'Cinema Focus',
  streetAddress: 'New Decor Towers, No. 71, Dr. Radhakrishnan Salai',
  locality: 'Mylapore',
  city: 'Chennai',
  region: 'Tamil Nadu',
  postalCode: '600004',
  countryCode: 'IN',
  country: 'India',
  geo: { latitude: 13.0415, longitude: 80.2720 },
  phone: '+91 98410 35821',
  email: 'info@cinemafocus.in',
  hours: [
    {
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '11:00',
      closes: '20:00',
    },
  ],
};

/** Absolute URL on the canonical (apex) host. */
export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.url}${p === '/' ? '' : p}`;
}
