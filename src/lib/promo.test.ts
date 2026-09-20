import { describe, it, expect } from "vitest";
import { createInitialInput, estimate, type EstimateInput } from "@/lib/pricing";
import { evaluatePromotion, evaluateActivePromotion } from "@/lib/promo";
import { activePromotion, type PromotionConfig } from "@/content/promotions";

function input(overrides: Partial<EstimateInput> = {}): EstimateInput {
  return { ...createInitialInput(), ...overrides };
}

const threeBridesmaidLooks = {
  makeup: 3,
  hair: 3,
  hairCounts: { short: 0, medium: 3, long: 0, xlong: 0 },
};

const cheapestLookFree: PromotionConfig = {
  id: "clf",
  kind: "cheapestLookFree",
  minPeople: 4,
};

describe("promotion — cheapest full look free", () => {
  it("frees the cheapest eligible adult look at 4+ full looks", () => {
    const result = estimate(input({ bridesmaids: threeBridesmaidLooks }));
    const promo = evaluatePromotion(cheapestLookFree, result);
    expect(promo.thresholdMet).toBe(true);
    expect(promo.applied).toBe(true);
    // cheapest eligible = bridesmaid 550 makeup + 495 hair
    expect(promo.discount).toBe(-1045);
    expect(promo.freeLook).toBe(1045);
  });

  it("does not fire below the threshold", () => {
    const result = estimate(
      input({
        bride: { makeup: false, hair: false, trial: false, hairLength: "medium" },
        bridesmaids: { makeup: 3, hair: 3, hairCounts: { short: 0, medium: 3, long: 0, xlong: 0 } },
      }),
    );
    const promo = evaluatePromotion(cheapestLookFree, result);
    expect(promo.thresholdMet).toBe(false);
    expect(promo.discount).toBe(0);
  });

  it("never counts makeup-only or hair-only looks", () => {
    const makeupOnly = estimate(
      input({
        bride: { makeup: false, hair: false, trial: false, hairLength: "medium" },
        bridesmaids: { makeup: 6, hair: 0, hairCounts: { short: 0, medium: 0, long: 0, xlong: 0 } },
      }),
    );
    expect(evaluatePromotion(cheapestLookFree, makeupOnly).thresholdMet).toBe(false);

    const hairOnly = estimate(
      input({
        bride: { makeup: false, hair: false, trial: false, hairLength: "medium" },
        bridesmaids: { makeup: 0, hair: 6, hairCounts: { short: 0, medium: 6, long: 0, xlong: 0 } },
      }),
    );
    expect(evaluatePromotion(cheapestLookFree, hairOnly).thresholdMet).toBe(false);
  });

  it("never frees the bride", () => {
    const result = estimate(input({ bridesmaids: threeBridesmaidLooks }));
    const promo = evaluatePromotion(cheapestLookFree, result);
    // bride look value is 1445 — the bridesmaid look (1045) is what's freed
    expect(promo.discount).toBe(-1045);
    const brideLook = result.looks.find((l) => l.group === "bride");
    expect(brideLook?.eligible).toBe(false);
  });

  it("never frees an under-12 flower girl, even when she is cheapest", () => {
    const result = estimate(
      input({
        bridesmaids: threeBridesmaidLooks,
        flowerGirlsUnder12: {
          makeup: 1,
          hair: 1,
          hairCounts: { short: 0, medium: 1, long: 0, xlong: 0 },
        },
      }),
    );
    const promo = evaluatePromotion(cheapestLookFree, result);
    // under-12 look value = 250 + 250 = 500, but it is not eligible
    expect(promo.discount).toBe(-1045);
  });

  it("applies nothing when only ineligible looks reach the threshold", () => {
    const result = estimate(
      input({
        bride: { makeup: true, hair: true, trial: true, hairLength: "medium" },
        flowerGirlsUnder12: {
          makeup: 4,
          hair: 4,
          hairCounts: { short: 0, medium: 4, long: 0, xlong: 0 },
        },
      }),
    );
    const promo = evaluatePromotion(cheapestLookFree, result);
    expect(promo.thresholdMet).toBe(true);
    expect(promo.applied).toBe(false);
    expect(promo.discount).toBe(0);
  });

  it("excludes trials from the freed value", () => {
    const result = estimate(input({ bridesmaids: threeBridesmaidLooks }));
    const brideLook = result.looks.find((l) => l.group === "bride");
    // day makeup only (850), never day + trial
    expect(brideLook?.makeup).toBe(850);
  });
});

describe("promotion — other kinds", () => {
  it("the none kind never applies", () => {
    const result = estimate(input({ bridesmaids: threeBridesmaidLooks }));
    expect(evaluatePromotion({ id: "n", kind: "none" }, result).applied).toBe(false);
  });

  it("flat credit applies a fixed amount off above the minimum", () => {
    const result = estimate(input({ bridesmaids: threeBridesmaidLooks }));
    const promo = evaluatePromotion(
      { id: "fc", kind: "flatCreditOnMinParty", minPeople: 3, amount: 500 },
      result,
    );
    expect(promo.discount).toBe(-500);
    expect(promo.lines[0].label).toContain("R500 off your booking");
  });

  it("milestone tiers free the cheapest look at 100%", () => {
    const result = estimate(input({ bridesmaids: threeBridesmaidLooks }));
    const promo = evaluatePromotion(
      { id: "mt", kind: "milestoneTiers", tiers: [{ minPeople: 4, freeLookPercent: 100 }] },
      result,
    );
    expect(promo.discount).toBe(-1045);
    expect(promo.freeLook).toBe(1045);
  });

  it("weekday discount only applies on the chosen days", () => {
    const result = estimate(input({ bridesmaids: threeBridesmaidLooks }));
    const config: PromotionConfig = {
      id: "wd",
      kind: "weekdayDiscount",
      applyOnDays: [2, 3, 4],
      amount: 400,
    };
    expect(evaluatePromotion(config, result, { weddingDayOfWeek: 6 }).applied).toBe(false);
    expect(evaluatePromotion(config, result, { weddingDayOfWeek: 3 }).discount).toBe(-400);
  });

  it("early-bird needs enough lead time", () => {
    const result = estimate(input({ bridesmaids: threeBridesmaidLooks }));
    const config: PromotionConfig = {
      id: "eb",
      kind: "earlyBirdLeadTime",
      minMonthsAhead: 9,
      amount: 500,
    };
    expect(evaluatePromotion(config, result, { monthsUntilWedding: 4 }).applied).toBe(false);
    expect(evaluatePromotion(config, result, { monthsUntilWedding: 12 }).discount).toBe(-500);
  });

  it("seasonal window matches the wedding month (incl. wrap-around)", () => {
    const result = estimate(input({ bridesmaids: threeBridesmaidLooks }));
    const config: PromotionConfig = {
      id: "sw",
      kind: "seasonalWindow",
      startMonth: 5,
      endMonth: 8,
      amount: 600,
    };
    expect(evaluatePromotion(config, result, { weddingMonth: 4 }).applied).toBe(false);
    expect(evaluatePromotion(config, result, { weddingMonth: 6 }).discount).toBe(-600);
  });

  it("bundled value adds a perk without a discount", () => {
    const result = estimate(input({ bridesmaids: threeBridesmaidLooks }));
    const promo = evaluatePromotion(
      { id: "bv", kind: "bundledValueAdd", minPeople: 4, perkLabel: "Touch-up kit" },
      result,
    );
    expect(promo.applied).toBe(true);
    expect(promo.discount).toBe(0);
    expect(promo.perks).toContain("Touch-up kit");
  });

  it("waives travel when a milestone tier asks for it", () => {
    const result = estimate(
      input({
        bridesmaids: threeBridesmaidLooks,
        travel: { status: "ok", oneWayKm: 30, roundTripKm: 60, fee: 420, confirmed: true },
      }),
    );
    const promo = evaluatePromotion(
      {
        id: "waive",
        kind: "milestoneTiers",
        tiers: [{ minPeople: 4, freeLookPercent: 100, travelWaived: true }],
      },
      result,
    );
    expect(promo.travelWaived).toBe(true);
    // cheapest look (1045) + travel (420)
    expect(promo.discount).toBe(-1465);
  });
});

describe("promotion — active default", () => {
  it("exposes a meta for the offer toggle", () => {
    expect(activePromotion.meta?.name).toBeTruthy();
    expect(activePromotion.meta?.tagline).toBeTruthy();
  });

  it("evaluates the active promotion with its meta attached", () => {
    const result = estimate(input({ bridesmaids: threeBridesmaidLooks }));
    const promo = evaluateActivePromotion(activePromotion, result);
    expect(promo.applied).toBe(true);
    expect(promo.meta).toBe(activePromotion.meta);
      });
    });