/**
 * Every price in the estimator is sourced from here — nothing is hard-coded in
 * markup. Figures follow the live Lustique Co. pricing schedule (the `R` object
 * in the live estimator bundle).
 */

export type HairLength = "short" | "medium" | "long" | "xlong";

export interface HairLengthOption {
  value: HairLength;
  label: string;
}

export const HAIR_LENGTHS: HairLengthOption[] = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
  { value: "xlong", label: "Extra long" },
];

export type HairLengthPrices = Record<HairLength, number>;

/** Beyond-bridal occasions share the live flat per-face pricing model. */
export const BEYOND_BRIDAL_OCCASIONS = [
  "matric",
  "editorial",
  "engagement",
  "corporate",
  "pageant",
] as const;

export type BeyondBridalOccasion = (typeof BEYOND_BRIDAL_OCCASIONS)[number];

export const PRICES = {
  /** The bride. Day + trial are the same price; trial is optional. */
  bride: {
    makeupDay: 850,
    makeupTrial: 850,
    hair: { short: 495, medium: 595, long: 695, xlong: 795 } as HairLengthPrices,
  },

  /** Bridal party — flat makeup, length-tiered hair. */
  party: {
    makeup: {
      bridesmaid: 550,
      mother: 500,
      /** Guests share the bridesmaid rate. */
      guest: 550,
      flowerGirlOver12: 500,
      flowerGirlUnder12: 250,
    } as const,
    hair: { short: 395, medium: 495, long: 595, xlong: 695 } as HairLengthPrices,
    flowerGirlUnder12Hair: {
      short: 200,
      medium: 250,
      long: 300,
      xlong: 400,
    } as HairLengthPrices,
  },

  /** Events — flat makeup, length-tiered hair, no trial. */
  event: {
    makeup: 550,
    hair: { short: 395, medium: 495, long: 595, xlong: 695 } as HairLengthPrices,
  },

  /**
   * Beyond-bridal flat per-face rates. Matric, editorial, engagement, corporate
   * and pageant reuse the event fields on the form (head count), then apply one
   * flat rate per face — whatever services they receive.
   */
  beyondBridal: {
    rates: {
      matric: 750,
      editorial: 750,
      engagement: 650,
      corporate: 650,
      pageant: 950,
    } as Record<BeyondBridalOccasion, number>,
    /** Fallback flat rate if a new occasion is added without a rate. */
    default: 750,
    /** Reference hair table for beyond-bridal occasions that include hair. */
    hairTable: { short: 395, medium: 495, long: 595, xlong: 695 } as HairLengthPrices,
  },

  /** Group lessons — per attending face, tiered by group size (minimum 6). */
  lesson: {
    under10: 700,
    tenPlus: 600,
    threshold: 10,
    minAttendees: 6,
  },

  /** Optional additional artist, only ever added when the user asks for one. */
  extraArtist: 850,

  travel: {
    freeRoundTripKm: 40,
    perKm: 7,
    destinationOneWayKm: 200,
    /** Destination accommodation estimate: per artist, per night. */
    accommodationPerArtistNight: 1000,
    accommodationNights: 2,
    /**
     * Manual band fallback fees (used when an address cannot be resolved).
     * `destination` bands carry no automatic price.
     */
    bands: {
      studio: 0,
      mid: 770,
      far: 1610,
      veryfar: 2450,
      destination: null,
    } as Record<string, number | null>,
  },
} as const;

export const OCCASIONS = [
  { value: "wedding", label: "Wedding" },
  { value: "event", label: "Event" },
  { value: "lessons", label: "Group lesson" },
  { value: "matric", label: "Matric farewell" },
  { value: "editorial", label: "Editorial / shoot" },
  { value: "engagement", label: "Engagement" },
  { value: "corporate", label: "Corporate" },
  { value: "pageant", label: "Pageant" },
] as const;

export type Occasion = (typeof OCCASIONS)[number]["value"];

export const OCCASION_LABELS: Record<Occasion, string> = {
  wedding: "Wedding",
  event: "Event",
  lessons: "Group lesson",
  matric: "Matric farewell",
  editorial: "Editorial",
  engagement: "Engagement",
  corporate: "Corporate",
  pageant: "Pageant",
};

export function isBeyondBridalOccasion(
  occasion: Occasion,
): occasion is BeyondBridalOccasion {
  return (BEYOND_BRIDAL_OCCASIONS as readonly string[]).includes(occasion);
}

export const STYLE_OPTIONS = [
  "Natural & soft",
  "Soft glam",
  "Full glam",
  "Editorial",
  "Boho",
  "Not sure yet",
] as const;

export const REFERRAL_OPTIONS = [
  "Instagram",
  "Google",
  "A friend / past bride",
  "TikTok",
  "Facebook",
  "Other",
] as const;

/**
 * Manual distance bands used when an address cannot be geocoded. Each closed
 * band carries the confirmed fallback fee from the live estimator; the 200+
 * band is a destination and carries no automatic price.
 */
export const DISTANCE_BANDS = [
  { value: "0-20", label: "Within 20 km (one way)", fee: 0 },
  { value: "20-80", label: "20–80 km (one way)", fee: 770 },
  { value: "80-150", label: "80–150 km (one way)", fee: 1610 },
  { value: "150-200", label: "150–200 km (one way)", fee: 2450 },
  { value: "200+", label: "More than 200 km (one way)", fee: null },
] as const;

export type DistanceBand = (typeof DISTANCE_BANDS)[number]["value"];