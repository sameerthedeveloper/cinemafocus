import JsonLd from '@/components/JsonLd';
import { webPageSchema } from '@/lib/schema';
import { CINEMA_FOCUS_GEO } from "@/lib/geoContext";
import LocationBreadcrumb from "@/components/LocationBreadcrumb";
import { buildMetadata } from '@/lib/metadata';
import { getIndexableContent } from '@/lib/seo';
import Button from '@/components/Button';
import OpenStatus from '@/components/OpenStatus';
import Link from 'next/link';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Visit Our Hi-Fi Showroom in Mylapore, Chennai',
  description: `Visit Cinema Focus, luxury audio showroom in ${CINEMA_FOCUS_GEO.city}. German & Danish high-end speakers. Address: ${CINEMA_FOCUS_GEO.street_address}, ${CINEMA_FOCUS_GEO.city}.`,
  path: '/location',
});

export default async function LocationPage() {
  // Brands that actually have products in the catalogue
  let brands = [];
  try {
    brands = (await getIndexableContent()).brands.map((b) => ({ name: b.name, slug: b.slug }));
  } catch (e) {
    console.error('Failed to load brands for /location:', e);
  }

  const geo = CINEMA_FOCUS_GEO;
  const { open, close } = geo.hours.weekday;
  const fmt = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return `${h % 12 || 12}${m ? `:${String(m).padStart(2, '0')}` : ''}\u00A0${h >= 12 ? 'pm' : 'am'}`;
  };
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(geo.address)}`;
  const actionClass = 'rounded-full normal-case! tracking-tight!';

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 md:px-8 md:pb-24 md:pt-40">
      <JsonLd data={webPageSchema({ path: '/location', name: metadata.title.absolute, description: metadata.description })} />

      <LocationBreadcrumb />
      <h1 className="text-4xl font-medium tracking-tight md:text-5xl">Visit Cinema Focus</h1>
      <p className="mt-3 max-w-xl text-lg text-muted-foreground md:text-xl">
        Luxury audio showroom in {geo.locality}, {geo.city}. Hear the systems before you decide.
      </p>

      <div className="mt-10 grid gap-4 lg:grid-cols-12 lg:gap-6">
        {/* Visit card */}
        <section
          className="flex flex-col gap-8 rounded-panel bg-secondary/40 p-6 md:p-8 lg:col-span-5"
          itemScope
          itemType="https://schema.org/LocalBusiness"
        >
          <OpenStatus open={open} close={close} className="self-start bg-background" />

          <div className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <address className="not-italic leading-relaxed">
              <div itemProp="name" className="text-lg font-medium">{geo.name}</div>
              <div className="text-muted-foreground" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <div itemProp="streetAddress">{geo.street_address}</div>
                <div>
                  <span itemProp="addressLocality">{geo.locality}</span>,{' '}
                  <span itemProp="addressRegion">{geo.city}</span>
                </div>
                <div>
                  {geo.state} <span itemProp="postalCode">{geo.postal_code}</span>,{' '}
                  <span itemProp="addressCountry">{geo.country}</span>
                </div>
              </div>
            </address>
          </div>

          <div className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background">
              <Clock className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="text-lg font-medium">Showroom hours</div>
              <div className="text-muted-foreground">Monday to Saturday, {fmt(open)}&nbsp;to&nbsp;{fmt(close)}</div>
              <div className="text-muted-foreground">Closed on Sundays</div>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background">
              <Phone className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <a href={`tel:${geo.mobile}`} itemProp="telephone" className="text-lg font-medium transition-colors hover:text-muted-foreground">
                {geo.mobile}
              </a>
              <div>
                <a href={`mailto:${geo.email}`} itemProp="email" className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {geo.email}
                </a>
              </div>
            </div>
          </div>

          <meta itemProp="latitude" content={geo.coordinates.lat} />
          <meta itemProp="longitude" content={geo.coordinates.lng} />

          <div className="mt-auto flex flex-wrap gap-3">
            <Button href={directions} target="_blank" rel="noopener noreferrer" icon className={actionClass}>
              Get directions
            </Button>
            <Button href={`tel:${geo.mobile}`} variant="outline" className={actionClass}>
              Call showroom
            </Button>
          </div>
        </section>

        {/* Map */}
        <section className="group relative min-h-[360px] overflow-hidden rounded-panel bg-secondary lg:col-span-7 lg:min-h-[560px]" aria-label="Map">
          <iframe
            title="Cinema Focus location map"
            src="https://maps.google.com/maps?q=Cinema%20Focus%2C%20Dr.%20Radhakrishnan%20Salai%2C%20Mylapore%2C%20Chennai%2C%20Tamil%20Nadu%20600004&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="absolute inset-0 h-full w-full border-0 grayscale transition-[filter] duration-700 group-hover:grayscale-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <p className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-background px-4 py-2 text-sm font-medium shadow-float">
            {geo.locality}, {geo.city}
          </p>
        </section>
      </div>

      <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-6">
        <section className="lg:col-span-5">
          <h2 className="text-xl font-medium md:text-2xl">Beyond the showroom</h2>
          <p className="mt-3 max-w-prose leading-relaxed text-muted-foreground">
            We ship across India. In-store consultations, installations and service are available in {geo.city} and the surrounding areas.
          </p>
        </section>

        {brands.length > 0 && (
          <section className="lg:col-span-7">
            <h2 className="text-xl font-medium md:text-2xl">Brands you can hear here</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {brands.map((brand) => (
                <li key={brand.slug || brand.name}>
                  <Link
                    href={brand.slug ? `/brand/${brand.slug}` : '/products'}
                    className="inline-flex h-10 items-center rounded-full bg-secondary/60 px-4 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
