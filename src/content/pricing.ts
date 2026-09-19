/**
 * Every price in the estimator is sourced from here — nothing is hard-coded in
 * markup. Figures follow the Lustique Co. pricing schedule.
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
      guest: 500,
      flowerGirlOver12: 550,
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

  /** Matric / group lessons — per attending face, tiered by group size. */
  lesson: {
    under10: 700,
    tenPlus: 600,
  },

  /** Optional additional artist, only ever added when the user asks for one. */
  extraArtist: 850,

  travel: {
    freeRoundTripKm: 40,
    perKm: 7,
    destinationOneWayKm: 200,
  },
} as const;

export const OCCASIONS = [
  { value: "wedding", label: "Wedding" },
  { value: "matric", label: "Matric farewell" },
  { value: "event", label: "Event" },
] as const;

export type Occasion = (typeof OCCASIONS)[number]["value"];

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

export const DISTANCE_BANDS = [
  { value: "0-20", label: "Within 20 km (one way)" },
  { value: "20-40", label: "20–40 km (one way)" },
  { value: "40-60", label: "40–60 km (one way)" },
  { value: "60-100", label: "60–100 km (one way)" },
  { value: "100-200", label: "100–200 km (one way)" },
  { value: "200+", label: "More than 200 km (one way)" },
] as const;

export type DistanceBand = (typeof DISTANCE_BANDS)[number]["value"];