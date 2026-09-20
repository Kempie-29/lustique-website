/**
 * Promotion engine. Evaluates the SINGLE active promotion against an estimate.
 *
 * Thresholds count "full looks" only — one person receiving both hair and
 * makeup. The bride counts toward the threshold but is never freed, an under-12
 * flower girl is never freed, and a trial is never freed (trials are excluded
 * from all look values). Every `kind` mirrors the live engine (`Xe`).
 */

import type { ActivePromotion, PromotionConfig } from "@/content/promotions";
import type { EstimateLine, EstimateResult, Look } from "@/lib/pricing";

export interface FreebieCandidate {
  cost: number;
}

/** Inputs the reasons-about-time kinds need, derived from the enquiry. */
export interface PromotionContextInput {
  weddingDayOfWeek?: number | null;
  weddingMonth?: number | null;
  monthsUntilWedding?: number | null;
}

interface PromotionContext extends Required<PromotionContextInput> {
  paidCount: number;
  freebieCandidates: FreebieCandidate[];
}

interface PromotionOutcome {
  lines: { label: string; amount: number }[];
  perks: string[];
  travelWaived: boolean;
}

export interface PromotionResult {
  applied: boolean;
  thresholdMet: boolean;
  fullLooks: number;
  /** Zero or negative. */
  discount: number;
  lines: EstimateLine[];
  perkLabel: string | null;
  perks: string[];
  travelWaived: boolean;
  /** Value of the freed look, when a look is actually freed. */
  freeLook: number | null;
  meta: ActivePromotion["meta"];
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

const EMPTY_OUTCOME: PromotionOutcome = { lines: [], perks: [], travelWaived: false };

function evaluate(config: PromotionConfig, ctx: PromotionContext): PromotionOutcome {
  switch (config.kind) {
    case "none":
      return EMPTY_OUTCOME;

    case "cheapestLookFree": {
      const min = config.minPeople;
      if (min == null || Number.isNaN(min) || ctx.paidCount < min || !ctx.freebieCandidates.length) {
        return EMPTY_OUTCOME;
      }
      const cheapest = Math.min(...ctx.freebieCandidates.map((c) => c.cost));
      return {
        lines: [{ label: "Promo — cheapest look free", amount: -cheapest }],
        perks: [],
        travelWaived: false,
      };
    }

    case "flatCreditOnMinParty": {
      if (ctx.paidCount < config.minPeople) return EMPTY_OUTCOME;
      return {
        lines: [{ label: `Promo — R${config.amount} off your booking`, amount: -config.amount }],
        perks: [],
        travelWaived: false,
      };
    }

    case "milestoneTiers": {
      const tiers = config.tiers
        .filter((t) => ctx.paidCount >= t.minPeople)
        .sort((a, b) => a.minPeople - b.minPeople);
      if (!tiers.length) return EMPTY_OUTCOME;

      const lines: PromotionOutcome["lines"] = [];
      const perks: string[] = [];
      let travelWaived = false;

      const percent = Math.max(0, ...tiers.map((t) => t.freeLookPercent ?? 0));
      if (percent > 0 && ctx.freebieCandidates.length) {
        const cheapest = Math.min(...ctx.freebieCandidates.map((c) => c.cost));
        const amount = Math.round(cheapest * (percent / 100));
        if (amount > 0) {
          lines.push({
            label:
              percent >= 100
                ? "Promo — cheapest look free"
                : `Promo — ${percent}% off cheapest look`,
            amount: -amount,
          });
        }
      }
      for (const tier of tiers) {
        if (tier.travelWaived) travelWaived = true;
        if (tier.perkLabel) perks.push(tier.perkLabel);
      }
      return { lines, perks, travelWaived };
    }

    case "weekdayDiscount": {
      if (ctx.weddingDayOfWeek == null || !config.applyOnDays.includes(ctx.weddingDayOfWeek)) {
        return EMPTY_OUTCOME;
      }
      return {
        lines:
          config.amount > 0
            ? [{ label: "Promo — weekday wedding discount", amount: -config.amount }]
            : [],
        perks: [],
        travelWaived: !!config.travelWaived,
      };
    }

    case "seasonalWindow": {
      const month = ctx.weddingMonth;
      const inWindow =
        month == null
          ? false
          : config.startMonth <= config.endMonth
            ? month >= config.startMonth && month <= config.endMonth
            : month >= config.startMonth || month <= config.endMonth;
      if (month == null || !inWindow) return EMPTY_OUTCOME;
      return {
        lines: [{ label: "Promo — off-peak season rate", amount: -config.amount }],
        perks: [],
        travelWaived: false,
      };
    }

    case "earlyBirdLeadTime": {
      if (ctx.monthsUntilWedding == null || ctx.monthsUntilWedding < config.minMonthsAhead) {
        return EMPTY_OUTCOME;
      }
      return {
        lines: [{ label: "Promo — early-bird booking bonus", amount: -config.amount }],
        perks: [],
        travelWaived: false,
      };
    }

    case "bundledValueAdd": {
      if (ctx.paidCount < config.minPeople) return EMPTY_OUTCOME;
      return { lines: [], perks: [config.perkLabel], travelWaived: false };
    }
  }
}

function gateMet(config: PromotionConfig, ctx: PromotionContext): boolean {
  switch (config.kind) {
    case "none":
      return false;
    case "cheapestLookFree":
    case "flatCreditOnMinParty":
    case "bundledValueAdd": {
      const min = config.minPeople;
      return min != null && !Number.isNaN(min) && ctx.paidCount >= min;
    }
    case "milestoneTiers":
      return config.tiers.some((t) => ctx.paidCount >= t.minPeople);
    case "weekdayDiscount":
      return ctx.weddingDayOfWeek != null && config.applyOnDays.includes(ctx.weddingDayOfWeek);
    case "seasonalWindow": {
      const month = ctx.weddingMonth;
      if (month == null) return false;
      return config.startMonth <= config.endMonth
        ? month >= config.startMonth && month <= config.endMonth
        : month >= config.startMonth || month <= config.endMonth;
    }
    case "earlyBirdLeadTime":
      return ctx.monthsUntilWedding != null && ctx.monthsUntilWedding >= config.minMonthsAhead;
  }
}

/** Value of the look a promotion frees outright, or null when none is freed. */
function freedLookValue(outcome: PromotionOutcome): number | null {
  const freeLine = outcome.lines.find((l) => l.label === "Promo — cheapest look free");
  return freeLine ? Math.abs(freeLine.amount) : null;
}

export function evaluatePromotion(
  config: PromotionConfig,
  result: EstimateResult,
  context: PromotionContextInput = {},
  meta: ActivePromotion["meta"] = null,
): PromotionResult {
  const fullLooks = countFullLooks(result);
  const ctx: PromotionContext = {
    paidCount: fullLooks,
    freebieCandidates: result.looks
      .filter((l) => isFullLook(l) && l.eligible)
      .map((l) => ({ cost: lookValue(l) })),
    weddingDayOfWeek: context.weddingDayOfWeek ?? null,
    weddingMonth: context.weddingMonth ?? null,
    monthsUntilWedding: context.monthsUntilWedding ?? null,
  };

  const thresholdMet = gateMet(config, ctx);
  const outcome = evaluate(config, ctx);

  const lines: EstimateLine[] = outcome.lines.map((line, index) => ({
    id: `promo-${config.id}-${index}`,
    label: line.label,
    amount: line.amount,
    group: "adjustment",
    section: "Adjustments",
  }));

  let travelWaived = outcome.travelWaived;
  if (travelWaived) {
    const travelLine = result.lines.find((l) => l.group === "travel" && l.amount > 0);
    if (travelLine) {
      lines.push({
        id: `promo-${config.id}-travel`,
        label: "Promo — travel waived",
        amount: -travelLine.amount,
        group: "travel",
        section: "Travel",
      });
    } else {
      travelWaived = false;
    }
  }

  const discount = lines.reduce((sum, line) => sum + Math.min(0, line.amount), 0);
  const applied = lines.length > 0 || outcome.perks.length > 0;

  return {
    applied,
    thresholdMet,
    fullLooks,
    discount,
    lines,
    perkLabel: outcome.perks[0] ?? null,
    perks: outcome.perks,
    travelWaived,
        freeLook: freedLookValue(outcome),
        meta,
      };
}

/** Convenience: evaluate the active promotion together with its meta. */
export function evaluateActivePromotion(
  active: ActivePromotion,
  result: EstimateResult,
  context: PromotionContextInput = {},
): PromotionResult {
  return evaluatePromotion(active.config, result, context, active.meta);
}