/**
 * Team roster. The artist count shown across the site is ALWAYS derived from
 * `artists.length` — never hard-coded — so copying a page to a new roster can
 * never drift out of sync.
 *
 * NOTE: display names are pending owner confirmation. Bios and photos are
 * intentionally left empty so no detail is invented; cards fall back to an
 * elegant monogram placeholder until real photos and copy are supplied.
 */

export interface Artist {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photoUrl?: string;
}

export const artists: Artist[] = [
  { id: "lindiwe", name: "Lindiwe Mokoena", role: "Lead Makeup Artist & Founder" },
  { id: "anelle", name: "Anelle van der Merwe", role: "Bridal Hair Stylist" },
  { id: "naledi", name: "Naledi Dlamini", role: "Makeup Artist" },
  { id: "chantelle", name: "Chantelle Botha", role: "Hair & Makeup Artist" },
  { id: "zanele", name: "Zanele Khumalo", role: "Makeup Artist" },
  { id: "megan", name: "Megan Pretorius", role: "Bridal Hair Stylist" },
  { id: "karabo", name: "Karabo Sithole", role: "Makeup & Hair Artist" },
];

export const artistCount = artists.length;