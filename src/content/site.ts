/**
 * Business ground truth. Everything factual about Lustique Co. lives here so
 * copy, schema and links never diverge. Fields under "TO CONFIRM" are pending
 * owner sign-off and should not be treated as final published facts.
 */

export interface OpeningHours {
  label: string;
  value: string;
}

export const site = {
  name: "Lustique Co.",
  legalName: "Lustique Cosmetology",
  tagline: "Bridal hair & makeup artistry",
  shortDescription:
    "Bridal hair & makeup artistry for brides across Pretoria and beyond — quiet, personal, and unhurried.",

  url: "https://www.lustiqueco.co.za",

  address: {
      street: "242 Frangipani Street",
      suburb: "La Montagne",
      city: "Pretoria",
      region: "Gauteng",
      country: "South Africa",
      countryCode: "ZA",
      full: "242 Frangipani Street, La Montagne, Pretoria, Gauteng, South Africa",
    },
  
    // Studio coordinates used as the travel-calculation origin (live site).
        coords: { lat: -25.7986, lng: 28.3127 },

  phone: "+27 67 925 3894",
  phoneDisplay: "067 925 3894",
  whatsapp: "27679253894",
  email: "hello@lustiqueco.co.za",

  socials: {
    // TO CONFIRM: exact handles to be supplied by the owner.
    instagram: "https://www.instagram.com/lustiqueco",
    facebook: "https://www.facebook.com/lustiqueco",
    tiktok: "https://www.tiktok.com/@lustiqueco",
  },

  hours: [
    { label: "Studio trials", value: "By appointment, Tue–Sat" },
    { label: "Wedding mornings", value: "From first light, travel to you" },
  ] as OpeningHours[],

  areasServed: [
    "Pretoria & surrounds",
    "Johannesburg & surrounds",
    "Gauteng-wide",
    "Destination weddings on request",
  ],

  foundedYear: 2018,
  yearsCombinedExperience: "40+",
} as const;

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function directionsLink(): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    site.address.full,
  )}`;
}