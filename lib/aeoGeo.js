import { getAeoGeo } from '@/lib/cms';
import { BUSINESS } from '@/lib/site';

/**
 * AEO / GEO SETTINGS (Server-Only)
 * Admin-editable (SEO > AEO & GEO) setting `aeo_geo`:
 *   { faqs: [{ question, answer }],
 *     business: { phone, email, streetAddress, locality, city, region, postalCode,
 *                 latitude, longitude, days: [..], opens, closes, sameAs: [urls] },
 *     aiSummary: string }
 * Everything is optional and validated here; anything invalid falls back to lib/site.js.
 */

const str = (v, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function cleanFaqs(faqs) {
  if (!Array.isArray(faqs)) return [];
  return faqs
    .map((f) => ({ question: str(f?.question, 300), answer: str(f?.answer, 2000) }))
    .filter((f) => f.question && f.answer)
    .slice(0, 50);
}

export function cleanSameAs(list) {
  if (!Array.isArray(list)) return [];
  return list.map((u) => str(u, 300)).filter((u) => /^https:\/\/[^\s]+$/.test(u)).slice(0, 20);
}

/** Merge admin overrides onto the code defaults. */
export function resolveBusiness(raw) {
  const b = raw?.business || {};
  const lat = Number(b.latitude);
  const lng = Number(b.longitude);
  const days = Array.isArray(b.days) ? b.days.filter((d) => DAYS.includes(d)) : [];
  const hasHours = days.length > 0 && TIME.test(b.opens) && TIME.test(b.closes);

  return {
    ...BUSINESS,
    phone: str(b.phone, 40) || BUSINESS.phone,
    email: str(b.email, 120) || BUSINESS.email,
    streetAddress: str(b.streetAddress, 200) || BUSINESS.streetAddress,
    locality: str(b.locality, 80) || BUSINESS.locality,
    city: str(b.city, 80) || BUSINESS.city,
    region: str(b.region, 80) || BUSINESS.region,
    postalCode: str(b.postalCode, 12) || BUSINESS.postalCode,
    geo:
      b.latitude !== '' && b.longitude !== '' && Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
        ? { latitude: lat, longitude: lng }
        : BUSINESS.geo,
    hours: hasHours ? [{ dayOfWeek: days, opens: b.opens, closes: b.closes }] : BUSINESS.hours,
    sameAs: cleanSameAs(b.sameAs),
  };
}

/** One cached read; never throws (defaults apply if the setting is missing or the API is down). */
export async function getAeoGeoResolved() {
  let raw = null;
  try {
    raw = await getAeoGeo();
  } catch (e) {
    console.error('Failed to load AEO/GEO settings:', e);
  }
  return {
    business: resolveBusiness(raw),
    faqs: cleanFaqs(raw?.faqs),
    aiSummary: str(raw?.aiSummary, 600),
  };
}

export function formatHours(hours) {
  const h = hours?.[0];
  if (!h) return '';
  const d = h.dayOfWeek;
  const range = d.length > 1 ? `${d[0]} to ${d[d.length - 1]}` : d[0];
  return `${range}, ${h.opens} to ${h.closes}`;
}
