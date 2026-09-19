/**
 * Promotion engine. Evaluates the SINGLE active promotion against an estimate.
 *
 * Thresholds count "full looks" only — one person receiving both hair and
 * makeup. The bride counts toward the threshold but is never freed, an under-12
 * flower girl is never freed, and a trial is never freed (trials are excluded
 * from all look values).
 */

import type { PromotionConfig } from "@/content/promotions";
import type { EstimateLine, EstimateResult, Look } from "@/lib/pricing";

export interface PromotionResult {
  applied: boolean;
  thresholdMet: boolean;
  fullLooks: number;
  /** Zero or negative. */
  discount: number;
  lines: EstimateLine[];
  perkLabel: string | null;
}

function isFullLook(look: Look): boolean {
  return look.makeup > 0 && look.hair > 0;
}

function lookValue(look: Look): number {
  return look.makeup + look.hair;
}

export function countFullLooks(result: EstimateResult): number {
  return result.looks.filter(isFullLook).length;
}

const NONE: PromotionResult = {
  applied: false,
  thresholdMet: false,
  fullLooks: 0,
  discount: 0,
  lines: [],
  perkLabel: null,
};

export function evaluatePromotion(
  config: PromotionConfig,
  result: EstimateResult,
): PromotionResult {
  if (!config.active || config.type === "none") return NONE;

  const fullLooks = countFullLooks(result);
  const thresholdMet = fullLooks >= config.minBooks && config.minBooks > 0;
  const eligible = result.looks.filter((l) => isFullLook(l) && l.eligible);

  if (!thresholdMet || eligible.length === 0) {
    return { ...NONE, fullLooks, thresholdMet };
  }

  if (config.type === "cheapest-full-look-free") {
    const cheapest = Math.min(...eligible.map(lookValue));
    if (cheapest <= 0) return { ...NONE, fullLooks, thresholdMet };
    return {
      applied: true,
      thresholdMet: true,
      fullLooks,
      discount: -cheapest,
      lines: [
        {
          id: `promo-${config.id}`,
          label: "Promo — cheapest look free",
          amount: -cheapest,
          group: "artist",
        },
      ],
      perkLabel: "Least-expensive look free",
    };
  }

  if (config.type === "percent-off-full-looks") {
    const percent = config.percent ?? 0;
    const base = eligible.reduce((sum, l) => sum + lookValue(l), 0);
    const discount = Math.round((base * percent) / 100);
    if (discount <= 0) return { ...NONE, fullLooks, thresholdMet };
    return {
      applied: true,
      thresholdMet: true,
      fullLooks,
      discount: -discount,
      lines: [
        {
          id: `promo-${config.id}`,
          label: `Promo — ${percent}% off the party`,
          amount: -discount,
          group: "artist",
        },
      ],
      perkLabel: `${percent}% off the party`,
    };
  }

  return { ...NONE, fullLooks, thresholdMet };
}