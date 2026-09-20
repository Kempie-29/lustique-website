/**
 * Promotions. Exactly ONE active promotion is applied at a time. The engine in
 * `lib/promo.ts` evaluates the active config against an estimate.
 *
 * Thresholds count "full looks" only — one person receiving BOTH hair and
 * makeup. The bride always counts toward the threshold but is never freed, an
 * under-12 flower girl is never freed, and a trial is never freed.
 */

export type PromotionType = "none" | "cheapest-full-look-free" | "percent-off-full-looks";

export interface PromotionConfig {
  id: string;
  label: string;
  type: PromotionType;
  active: boolean;
  /** Minimum number of full looks required to unlock the promotion. */
  minBooks: number;
  /** Only used by `percent-off-full-looks`. */
  percent?: number;
  description: string;
}

export const promotionPresets: PromotionConfig[] = [
  {
    id: "cheapest-look-free",
    label: "Least-expensive look free",
    type: "cheapest-full-look-free",
    active: true,
    minBooks: 4,
    description:
      "Book hair & makeup for 4+ and the least-expensive look is on us.",
  },
  {
    id: "none",
    label: "No active promotion",
    type: "none",
    active: false,
    minBooks: 0,
    description: "No promotion currently running.",
  },
  {
    id: "ten-off-party",
    label: "10% off the party",
    type: "percent-off-full-looks",
    active: false,
    minBooks: 4,
    percent: 10,
    description: "Book 4+ full looks and take 10% off the party.",
  },
  {
    id: "fifteen-off-party",
    label: "15% off the party",
    type: "percent-off-full-looks",
    active: false,
    minBooks: 6,
    percent: 15,
    description: "Book 6+ full looks and take 15% off the party.",
  },
  {
    id: "cheapest-look-free-5",
    label: "Least-expensive look free (5+)",
    type: "cheapest-full-look-free",
    active: false,
    minBooks: 5,
    description:
      "Book hair & makeup for 5+ and the least-expensive look is on us.",
  },
  {
    id: "twenty-off-party",
    label: "20% off the party",
    type: "percent-off-full-looks",
    active: false,
    minBooks: 8,
    percent: 20,
    description: "Book 8+ full looks and take 20% off the party.",
  },
];

/** The single promotion the estimator will apply. */
export const activePromotion: PromotionConfig =
  promotionPresets.find((p) => p.active) ?? promotionPresets[0];

export function promoTopBarCopy(): string {
  return `Now booking 2026 & 2027 weddings · Book hair & makeup for 4+ and the least-expensive look is on us`;
}