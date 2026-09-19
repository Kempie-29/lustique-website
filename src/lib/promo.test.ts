import { describe, it, expect } from "vitest";
import { createInitialInput, estimate, type EstimateInput } from "@/lib/pricing";
import { evaluatePromotion } from "@/lib/promo";
import { activePromotion, promotionPresets } from "@/content/promotions";

function input(overrides: Partial<EstimateInput> = {}): EstimateInput {
  return { ...createInitialInput(), ...overrides };
}

const threeBridesmaidLooks = {
  makeup: 3,
  hair: 3,
  hairCounts: { short: 0, medium: 3, long: 0, xlong: 0 },
};

describe("promotion — cheapest full look free", () => {
  it("frees the cheapest eligible adult look at 4+ full looks", () => {
    // bride (1 full look) + 3 bridesmaids = 4 full looks
    const result = estimate(input({ bridesmaids: threeBridesmaidLooks }));
    const promo = evaluatePromotion(activePromotion, result);
    expect(promo.thresholdMet).toBe(true);
    expect(promo.applied).toBe(true);
    // cheapest eligible = bridesmaid 550 makeup + 495 hair
    expect(promo.discount).toBe(-1045);
  });

  it("does not fire below the threshold", () => {
    const result = estimate(
      input({
        bride: { makeup: false, hair: false, trial: false, hairLength: "medium" },
        bridesmaids: { makeup: 3, hair: 3, hairCounts: { short: 0, medium: 3, long: 0, xlong: 0 } },
      }),
    );
    const promo = evaluatePromotion(activePromotion, result);
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
    expect(evaluatePromotion(activePromotion, makeupOnly).thresholdMet).toBe(false);

    const hairOnly = estimate(
      input({
        bride: { makeup: false, hair: false, trial: false, hairLength: "medium" },
        bridesmaids: { makeup: 0, hair: 6, hairCounts: { short: 0, medium: 6, long: 0, xlong: 0 } },
      }),
    );
    expect(evaluatePromotion(activePromotion, hairOnly).thresholdMet).toBe(false);
  });

  it("never frees the bride", () => {
    const result = estimate(input({ bridesmaids: threeBridesmaidLooks }));
    const promo = evaluatePromotion(activePromotion, result);
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
    const promo = evaluatePromotion(activePromotion, result);
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
    const promo = evaluatePromotion(activePromotion, result);
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

describe("promotion — presets", () => {
  it("the none preset never applies", () => {
    const none = promotionPresets.find((p) => p.id === "none")!;
    const result = estimate(input({ bridesmaids: threeBridesmaidLooks }));
    expect(evaluatePromotion(none, result).applied).toBe(false);
  });

  it("the 5+ preset needs five full looks", () => {
    const fivePlus = promotionPresets.find((p) => p.id === "cheapest-look-free-5")!;
    const four = estimate(input({ bridesmaids: threeBridesmaidLooks }));
    expect(evaluatePromotion(fivePlus, four).applied).toBe(false);

    const five = estimate(
      input({
        bridesmaids: { makeup: 4, hair: 4, hairCounts: { short: 0, medium: 4, long: 0, xlong: 0 } },
      }),
    );
    expect(evaluatePromotion(fivePlus, five).applied).toBe(true);
  });

  it("the 10%-off preset discounts eligible looks only", () => {
    const ten = promotionPresets.find((p) => p.id === "ten-off-party")!;
    const result = estimate(input({ bridesmaids: threeBridesmaidLooks }));
    // 3 bridesmaid looks * 1045 = 3135 ; 10% -> 314
    expect(evaluatePromotion(ten, result).discount).toBe(-314);
  });
});