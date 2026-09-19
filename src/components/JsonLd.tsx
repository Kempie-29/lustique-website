import { site } from "@/content/site";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Data is app-controlled, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * BeautySalon schema for the business. Deliberately omits review and
 * aggregateRating — we have no verified reviews to publish.
 */
export function beautySalonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: site.name,
    legalName: site.legalName,
    description: site.shortDescription,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    image: `${site.url}/assets/logo.svg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.coords.lat,
      longitude: site.coords.lng,
    },
    areaServed: site.areasServed.map((name) => ({ "@type": "Place", name })),
    sameAs: [site.socials.instagram, site.socials.facebook, site.socials.tiktok],
  };
}

export function breadcrumbSchema(items: { label: string; to?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.label,
        ...(item.to ? { item: `${site.url}${item.to}` } : {}),
      })),
    ],
  };
}