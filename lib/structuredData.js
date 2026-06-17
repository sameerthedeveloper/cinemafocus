import { CINEMA_FOCUS_GEO } from "./geoContext";

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AudioStore",
    name: CINEMA_FOCUS_GEO.name,
    url: "https://cinemafocus.in",
    telephone: CINEMA_FOCUS_GEO.phone,
    email: CINEMA_FOCUS_GEO.email,
    description: "Luxury German and Danish high-end audio showroom in Chennai. Home theater systems, speakers, and audio equipment.",
    address: {
      "@type": "PostalAddress",
      streetAddress: CINEMA_FOCUS_GEO.street_address,
      addressLocality: CINEMA_FOCUS_GEO.locality,
      addressCity: CINEMA_FOCUS_GEO.city,
      addressRegion: CINEMA_FOCUS_GEO.state,
      postalCode: CINEMA_FOCUS_GEO.postal_code,
      addressCountry: CINEMA_FOCUS_GEO.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CINEMA_FOCUS_GEO.coordinates.lat,
      longitude: CINEMA_FOCUS_GEO.coordinates.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: CINEMA_FOCUS_GEO.hours.weekday.open,
        closes: CINEMA_FOCUS_GEO.hours.weekday.close,
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: CINEMA_FOCUS_GEO.hours.sunday.open,
        closes: CINEMA_FOCUS_GEO.hours.sunday.close,
      }
    ],
    image: "https://cinemafocus.in/logo.svg",
    priceRange: "₹50000 - ₹5000000",
    areaServed: {
      "@type": "Country",
      name: "India"
    },
    foundingDate: CINEMA_FOCUS_GEO.established,
    knowsAbout: ["Audio Equipment", "Home Theater Systems", "High-End Speakers", "Audio Consultation"]
  };
}

export function getServiceAreaSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: CINEMA_FOCUS_GEO.name,
    areaServed: {
      "@type": "Country",
      name: "India"
    },
    availableService: [
      {
        "@type": "Service",
        name: "Audio Equipment Sales & Installation",
        areaServed: "India",
        serviceType: "In-store consultation + Pan-India shipping"
      },
      {
        "@type": "Service",
        name: "Home Theater Setup & Consultation",
        areaServed: `${CINEMA_FOCUS_GEO.city} & surrounding areas`,
        serviceType: "On-site installation"
      }
    ]
  };
}
