import { site } from "@/content/site";
import { PRICES } from "@/content/pricing";
import { services } from "@/content/services";
import { artists } from "@/content/artists";
import { gallery } from "@/content/gallery";
import { faqs } from "@/content/faq";

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

/** Hosted brand assets referenced from structured data. */
const LOGO_URL = `${site.url}/assets/logo.svg`;
const SHARE_IMAGE_URL = `${site.url}/assets/og-image.svg`;

/** Cheapest to most-expensive known figure, for `priceRange`. */
function priceRange(): string {
  const points = [
    PRICES.party.makeup.flowerGirlUnder12,
    PRICES.party.hair.xlong,
    PRICES.bride.hair.xlong,
    PRICES.beyondBridal.rates.pageant,
    PRICES.travel.bands.veryfar ?? 0,
  ];
  return `R${Math.min(...points)}–R${Math.max(...points)}`;
}

/**
 * BeautySalon / LocalBusiness schema for the business. Deliberately omits
 * `review`, `aggregateRating` and precise `openingHoursSpecification` — we have
 * no verified reviews and no confirmed clock hours to publish.
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
    logo: LOGO_URL,
    image: SHARE_IMAGE_URL,
    priceRange: priceRange(),
    currenciesAccepted: "ZAR",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
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

/** WebSite entity so search and generative engines resolve the site identity. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.shortDescription,
    inLanguage: "en-ZA",
    publisher: { "@type": "Organization", name: site.legalName, url: site.url },
  };
}

/** Services as an ItemList of Service + Offer/PriceSpecification from pricing. */
export function serviceListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: service.name,
        description: service.summary,
        serviceType: service.name,
        provider: { "@type": "BeautySalon", name: site.name, url: site.url },
        areaServed: site.areasServed,
        offers: {
          "@type": "Offer",
          priceCurrency: "ZAR",
          price: service.fromPrice,
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "ZAR",
            minPrice: service.fromPrice,
          },
          url: `${site.url}${service.href}`,
        },
      },
    })),
  };
}

/** The team, as Person entries tied to the business. */
export function artistsSchema() {
  return artists.map((artist) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: artist.name,
    jobTitle: artist.role,
    worksFor: { "@type": "BeautySalon", name: site.name, url: site.url },
  }));
}

/** Gallery images as ImageObject. Empty while no photography has been supplied. */
export function gallerySchema() {
  return gallery.map((item) => ({
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: item.imageUrl.startsWith("http") ? item.imageUrl : `${site.url}${item.imageUrl}`,
    name: item.title,
    description: item.alt,
    ...(item.width ? { width: item.width } : {}),
    ...(item.height ? { height: item.height } : {}),
  }));
}

/** FAQPage from the same source the FAQ page renders. */
export function faqPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** Article for a journal entry or guide. */
export function articleSchema(article: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    ...(article.datePublished ? { datePublished: article.datePublished } : {}),
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}${article.path}`,
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