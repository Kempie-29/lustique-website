/**
 * Promotions. Exactly ONE promotion is active at a time and it is
 * user-toggleable from the estimate. The engine in `lib/promo.ts` evaluates the
 * active config against a live estimate.
 *
 * This mirrors the live shapes (the eight `kind`s the live engine understands).
 * Live fetches the active promo + meta from `/api/promo/active`; a Vite SPA has
 * no backend, so `loadActivePromotion()` reads the local default below. Swap
 * that one function for a fetch later and nothing else changes.
 *
 * Thresholds count "full looks" only — one person receiving BOTH hair and
 * makeup. The bride always counts toward the threshold but is never freed, an
 * under-12 flower girl is never freed, and a trial is never freed.
 */

export type PromotionKind =
  | "none"
  | "cheapestLookFree"
  | "flatCreditOnMinParty"
  | "milestoneTiers"
  | "weekdayDiscount"
  | "seasonalWindow"
  | "earlyBirdLeadTime"
  | "bundledValueAdd";

export interface PromotionMeta {
  /** Display name, e.g. "Least-expensive look free". */
  name: string;
  /** Short supporting line shown beside the toggle. */
  tagline: string;
}

export interface MilestoneTier {
  minPeople: number;
  /** 100 = the cheapest look is free. */
  freeLookPercent?: number;
  travelWaived?: boolean;
  perkLabel?: string;
}

export type PromotionConfig =
  | { id: string; kind: "none" }
  | { id: string; kind: "cheapestLookFree"; minPeople: number }
  | { id: string; kind: "flatCreditOnMinParty"; minPeople: number; amount: number }
  | { id: string; kind: "milestoneTiers"; tiers: MilestoneTier[] }
  | {
      id: string;
      kind: "weekdayDiscount";
      /** Days the offer applies on, 0 = Sunday … 6 = Saturday. */
      applyOnDays: number[];
      amount: number;
      travelWaived?: boolean;
    }
  | { id: string; kind: "seasonalWindow"; startMonth: number; endMonth: number; amount: number }
  | { id: string; kind: "earlyBirdLeadTime"; minMonthsAhead: number; amount: number }
  | { id: string; kind: "bundledValueAdd"; minPeople: number; perkLabel: string };

export interface ActivePromotion {
  config: PromotionConfig;
  /** Present only when there is a running offer to advertise. */
  meta: PromotionMeta | null;
}

/** Sample configs — one per live `kind` — used by tests and admin previews. */
export const promotionPresets: PromotionConfig[] = [
  { id: "cheapest-look-free", kind: "cheapestLookFree", minPeople: 4 },
  { id: "flat-credit", kind: "flatCreditOnMinParty", minPeople: 3, amount: 500 },
  {
    id: "milestones",
    kind: "milestoneTiers",
    tiers: [
      { minPeople: 4, freeLookPercent: 100, perkLabel: "Least-expensive look free" },
      { minPeople: 6, freeLookPercent: 50, travelWaived: true, perkLabel: "Half your travel" },
    ],
  },
  { id: "weekday", kind: "weekdayDiscount", applyOnDays: [2, 3, 4], amount: 400 },
  { id: "off-peak", kind: "seasonalWindow", startMonth: 5, endMonth: 8, amount: 600 },
  { id: "early-bird", kind: "earlyBirdLeadTime", minMonthsAhead: 9, amount: 500 },
  { id: "bundle", kind: "bundledValueAdd", minPeople: 5, perkLabel: "Complimentary touch-up kit" },
  { id: "none", kind: "none" },
];

/**
 * The single active promotion the estimator offers. Returns the config plus the
 * meta used by the toggle label; replace with a `/api/promo/active` fetch when a
 * backend exists.
 */
export function loadActivePromotion(): ActivePromotion {
  return {
    config: { id: "cheapest-look-free", kind: "cheapestLookFree", minPeople: 4 },
    meta: {
      name: "Least-expensive look free",
      tagline: "Book hair & makeup for 4+ and the least-expensive look is on us.",
    },
  };
}

/** The promotion resolved at load time. */
export const activePromotion: ActivePromotion = loadActivePromotion();

export function promoTopBarCopy(): string {
  return "Now booking 2026 & 2027 weddings · Book hair & makeup for 4+ and the least-expensive look is on us";
}