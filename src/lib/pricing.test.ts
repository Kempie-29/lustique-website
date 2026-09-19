import { describe, it, expect } from "vitest";
import {
  createInitialInput,
  estimate,
  estimateStateLine,
  emptyPartyGroup,
  type EstimateInput,
} from "@/lib/pricing";

function input(overrides: Partial<EstimateInput> = {}): EstimateInput {
  return { ...createInitialInput(), ...overrides };
}

describe("pricing — solo bride", () => {
  it("prices short through extra-long hair (R2 690 → R3 290)", () => {
    const cases = [
      { hairLength: "short" as const, total: 2690 },
      { hairLength: "medium" as const, total: 2890 },
      { hairLength: "long" as const, total: 3090 },
      { hairLength: "xlong" as const, total: 3290 },
    ];
    for (const c of cases) {
      const result = estimate(
        input({ bride: { makeup: true, hair: true, trial: true, hairLength: c.hairLength } }),
      );
      expect(result.total).toBe(c.total);
    }
  });

  it("drops the trial price when the trial is declined", () => {
    const result = estimate(
      input({ bride: { makeup: true, hair: true, trial: false, hairLength: "medium" } }),
    );
    // 850 day makeup + 595 day hair
    expect(result.total).toBe(1445);
  });
});

describe("pricing — bridal party", () => {
  it("prices mixed-length bridesmaids correctly", () => {
    const result = estimate(
      input({
        bride: { makeup: false, hair: false, trial: false, hairLength: "medium" },
        bridesmaids: { makeup: 2, hair: 3, hairCounts: { short: 1, medium: 2, long: 0, xlong: 0 } },
      }),
    );
    // makeup 2*550 = 1100 ; hair 1*395 + 2*495 = 1385
    expect(result.total).toBe(2485);
  });

  it("prices flower girls by age band", () => {
    const result = estimate(
      input({
        bride: { makeup: false, hair: false, trial: false, hairLength: "medium" },
        flowerGirlsUnder12: { makeup: 2, hair: 0, hairCounts: { short: 0, medium: 2, long: 0, xlong: 0 } },
        flowerGirlsOver12: { makeup: 1, hair: 1, hairCounts: { short: 0, medium: 1, long: 0, xlong: 0 } },
      }),
    );
    // under12 makeup 2*250 = 500 ; under12 hair 2*250 = 500 ; over12 550 + 495 = 1045
    expect(result.total).toBe(2045);
  });
});

describe("pricing — additional artist", () => {
  it("adds R850 only when explicitly requested", () => {
    const base = estimate(input());
    expect(base.lines.some((l) => l.group === "artist")).toBe(false);

    const one = estimate(input({ extraArtists: 1 }));
    expect(one.total).toBe(base.total + 850);

    const two = estimate(input({ extraArtists: 2 }));
    expect(two.total).toBe(base.total + 1700);
  });
});

describe("pricing — large parties are not double counted", () => {
  it("charges per person only, with no hidden assistant fee", () => {
    const result = estimate(
      input({
        bridesmaids: { makeup: 7, hair: 7, hairCounts: { short: 0, medium: 7, long: 0, xlong: 0 } },
      }),
    );
    // bride 2890 + 7*550 + 7*495 = 2890 + 3850 + 3465
    expect(result.total).toBe(10205);
    expect(result.lines.some((l) => l.group === "artist")).toBe(false);
  });
});

describe("pricing — lessons & events", () => {
  it("applies the 10+ group-lesson rate", () => {
    const nine = estimate(
      input({ occasion: "matric", lesson: { attendees: 9 } }),
    );
    const ten = estimate(input({ occasion: "matric", lesson: { attendees: 10 } }));
    expect(nine.total).toBe(9 * 700);
    expect(ten.total).toBe(10 * 600);
  });

  it("only charges travel for an event when meeting at the venue", () => {
    const atVenue = estimate(
      input({
        occasion: "event",
        event: { location: "venue", makeup: 2, hair: 0, hairCounts: { short: 0, medium: 0, long: 0, xlong: 0 } },
        travel: { status: "ok", oneWayKm: 30, roundTripKm: 60, fee: 140, confirmed: true },
      }),
    );
    expect(atVenue.total).toBe(2 * 550 + 140);

    const inStudio = estimate(
      input({
        occasion: "event",
        event: { location: "studio", makeup: 2, hair: 0, hairCounts: { short: 0, medium: 0, long: 0, xlong: 0 } },
        travel: { status: "ok", oneWayKm: 30, roundTripKm: 60, fee: 140, confirmed: true },
      }),
    );
    expect(inStudio.total).toBe(2 * 550);
  });
});

describe("pricing — state line", () => {
  it("describes wedding, lesson and async states", () => {
    const wedding = input();
    expect(estimateStateLine(wedding, estimate(wedding))).toContain("incl. trial & touch-ups");

    const lesson = input({ occasion: "matric", lesson: { attendees: 12 } });
    expect(estimateStateLine(lesson, estimate(lesson))).toBe("12 attending · group lesson");
  });

  it("reports a destination instead of a number", () => {
    const dest = input({
      travel: { status: "destination", oneWayKm: 300, roundTripKm: 600, fee: null, confirmed: false },
    });
    expect(estimateStateLine(dest, estimate(dest))).toBe("Destination — we'll tailor it");
  });
});

describe("helpers", () => {
  it("emptyPartyGroup starts empty", () => {
    expect(emptyPartyGroup()).toEqual({
      makeup: 0,
      hair: 0,
      hairCounts: { short: 0, medium: 0, long: 0, xlong: 0 },
    });
  });
});