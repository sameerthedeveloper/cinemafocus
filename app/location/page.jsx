import JsonLd from '@/components/JsonLd';
import { webPageSchema } from '@/lib/schema';
import { CINEMA_FOCUS_GEO } from "@/lib/geoContext";
import LocationBreadcrumb from "@/components/LocationBreadcrumb";
import { buildMetadata } from '@/lib/metadata';
import { getIndexableContent } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Visit Our Hi-Fi Showroom in Mylapore, Chennai',
  description: `Visit Cinema Focus, luxury audio showroom in ${CINEMA_FOCUS_GEO.city}. German & Danish high-end speakers. Address: ${CINEMA_FOCUS_GEO.street_address}, ${CINEMA_FOCUS_GEO.city}.`,
  path: '/location',
});

export default async function LocationPage() {
  // Brands that actually have products in the catalogue
  let brands = [];
  try {
    brands = (await getIndexableContent()).brands.map((b) => b.name);
  } catch (e) {
    console.error('Failed to load brands for /location:', e);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12">
      <JsonLd data={webPageSchema({ path: '/location', name: metadata.title.absolute, description: metadata.description })} />
      <div className="max-w-3xl mx-auto">
        <LocationBreadcrumb />

        <h1 className="text-5xl md:text-6xl font-bold mb-2">Visit Cinema Focus</h1>
        <h2 className="text-xl text-zinc-300 mb-12">
          Luxury Audio Showroom in {CINEMA_FOCUS_GEO.city}
        </h2>

        {/* Address Section */}
        <section className="mb-12" itemScope itemType="https://schema.org/LocalBusiness">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            📍 Address
          </h3>
          <address className="not-italic space-y-2 text-zinc-300 leading-relaxed">
            <div itemProp="name" className="font-medium text-white text-lg">
              {CINEMA_FOCUS_GEO.name}
            </div>
            <div itemProp="streetAddress">{CINEMA_FOCUS_GEO.street_address}</div>
            <div>
              <span itemProp="addressLocality">{CINEMA_FOCUS_GEO.locality}</span>,{" "}
              <span itemProp="addressCity">{CINEMA_FOCUS_GEO.city}</span>
            </div>
            <div>
              <span itemProp="addressRegion">{CINEMA_FOCUS_GEO.state}</span>{" "}
              <span itemProp="postalCode">{CINEMA_FOCUS_GEO.postal_code}</span>
            </div>
            <div itemProp="addressCountry">{CINEMA_FOCUS_GEO.country}</div>
          </address>
          <meta itemProp="latitude" content={CINEMA_FOCUS_GEO.coordinates.lat} />
          <meta itemProp="longitude" content={CINEMA_FOCUS_GEO.coordinates.lng} />
        </section>

        {/* Hours Section */}
        <section className="mb-12 bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            ⏰ Hours of Operation
          </h3>
          <div className="space-y-3 text-zinc-300">
            <div className="flex justify-between items-center">
              <span className="font-medium">Monday – Saturday:</span>
              <span>{CINEMA_FOCUS_GEO.hours.weekday.open} – {CINEMA_FOCUS_GEO.hours.weekday.close}</span>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            📞 Contact Us
          </h3>
          <div className="space-y-3">
            <p>
              <a
                href={`tel:${CINEMA_FOCUS_GEO.mobile}`}
                className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
              >
                {CINEMA_FOCUS_GEO.mobile}
              </a>
              <span className="text-zinc-500 text-sm ml-2">(Mobile)</span>
            </p>
            <p>
              <a
                href={`mailto:${CINEMA_FOCUS_GEO.email}`}
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {CINEMA_FOCUS_GEO.email}
              </a>
            </p>
          </div>
        </section>

        {/* Service Area Section */}
        <section className="mb-12 bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
          <h3 className="text-2xl font-semibold mb-4">🚚 Service Area</h3>
          <p className="text-zinc-300 leading-relaxed">
            Pan-India shipping available. In-store consultations, installations, and premium service across {CINEMA_FOCUS_GEO.city} & surrounding areas.
          </p>
        </section>

        {/* Brands Section */}
        {brands.length > 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-semibold mb-6">🎵 Premium Brands Stocked</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {brands.map(brand => (
                <div key={brand} className="bg-zinc-900/50 p-4 rounded border border-zinc-800 text-center hover:border-indigo-500/50 transition-colors">
                  {brand}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Map Embed */}
        <section className="mt-16">
          <h3 className="text-2xl font-semibold mb-6">📍 Location Map</h3>
          <div className="w-full h-96 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
            <iframe
              title="Cinema Focus Location Map"
              src="https://maps.google.com/maps?q=Cinema%20Focus%2C%20Dr.%20Radhakrishnan%20Salai%2C%20Mylapore%2C%20Chennai%2C%20Tamil%20Nadu%20600004&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="text-xs text-zinc-500 mt-4">
            Map shows approximate location of Cinema Focus in Mylapore, Chennai
          </p>
        </section>
      </div>
    </div>
  );
}
