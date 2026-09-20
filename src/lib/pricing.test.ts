import { describe, it, expect } from "vitest";
import {
  createInitialInput,
  estimate,
  estimateStateLine,
  emptyPartyGroup,
  emptyHairCounts,
  type EstimateInput,
} from "@/lib/pricing";

function input(overrides: Partial<EstimateInput> = {}): EstimateInput {
  return { ...createInitialInput(), ...overrides };
}

const noBride = { makeup: false, hair: false, trial: false, hairLength: "medium" } as const;

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
        bride: noBride,
        bridesmaids: { makeup: 2, hair: 3, hairCounts: { short: 1, medium: 2, long: 0, xlong: 0 } },
      }),
    );
    // makeup 2*550 = 1100 ; hair 1*395 + 2*495 = 1385
    expect(result.total).toBe(2485);
  });

  it("prices flower girls by age band", () => {
    const result = estimate(
      input({
        bride: noBride,
        flowerGirlsUnder12: { makeup: 2, hair: 0, hairCounts: { short: 0, medium: 2, long: 0, xlong: 0 } },
        flowerGirlsOver12: { makeup: 1, hair: 1, hairCounts: { short: 0, medium: 1, long: 0, xlong: 0 } },
      }),
    );
    // under12 makeup 2*250 = 500 ; under12 hair 2*250 = 500 ; over12 500 + 495 = 995
    expect(result.total).toBe(1995);
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

describe("pricing — event", () => {
  it("prices an event through the event fields (guest rate)", () => {
    const result = estimate(
      input({
        occasion: "event",
        event: { location: "studio", makeup: 2, hair: 0, hairCounts: emptyHairCounts() },
      }),
    );
    expect(result.total).toBe(2 * 550);
    expect(result.heads).toBe(2);
  });

  it("only charges travel for an event when meeting at the venue", () => {
    const atVenue = estimate(
      input({
        occasion: "event",
        event: { location: "venue", makeup: 2, hair: 0, hairCounts: emptyHairCounts() },
        travel: { status: "ok", oneWayKm: 30, roundTripKm: 60, fee: 420, confirmed: true },
      }),
    );
    expect(atVenue.total).toBe(2 * 550 + 420);

    const inStudio = estimate(
      input({
        occasion: "event",
        event: { location: "studio", makeup: 2, hair: 0, hairCounts: emptyHairCounts() },
        travel: { status: "ok", oneWayKm: 30, roundTripKm: 60, fee: 420, confirmed: true },
      }),
    );
    expect(inStudio.total).toBe(2 * 550);
  });
});

describe("pricing — beyond bridal (flat per face)", () => {
  it("charges matric R750 a face from the event fields", () => {
    const result = estimate(
      input({
        occasion: "matric",
        event: { location: "venue", makeup: 9, hair: 0, hairCounts: emptyHairCounts() },
      }),
    );
    expect(result.total).toBe(9 * 750);
    expect(result.heads).toBe(9);
  });

  it("prices each beyond-bridal occasion at its own flat rate", () => {
    const cases = [
      { occasion: "editorial" as const, rate: 750 },
      { occasion: "engagement" as const, rate: 650 },
      { occasion: "corporate" as const, rate: 650 },
      { occasion: "pageant" as const, rate: 950 },
    ];
    for (const c of cases) {
      const result = estimate(
        input({
          occasion: c.occasion,
          event: { location: "venue", makeup: 4, hair: 2, hairCounts: emptyHairCounts() },
        }),
      );
      // faces = max(makeup, hair) = 4
      expect(result.total).toBe(4 * c.rate);
    }
  });
});

describe("pricing — group lessons", () => {
  it("charges a minimum of six faces at R700 under ten", () => {
    const six = estimate(input({ occasion: "lessons", lesson: { attendees: 6 } }));
    expect(six.total).toBe(6 * 700);

    const few = estimate(input({ occasion: "lessons", lesson: { attendees: 3 } }));
    expect(few.total).toBe(6 * 700);
    expect(few.heads).toBe(6);
  });

  it("drops to R600 a face at ten or more", () => {
    const ten = estimate(input({ occasion: "lessons", lesson: { attendees: 10 } }));
    expect(ten.total).toBe(10 * 600);

    const fifteen = estimate(input({ occasion: "lessons", lesson: { attendees: 15 } }));
    expect(fifteen.total).toBe(15 * 600);
  });
});

describe("pricing — state line", () => {
  it("describes wedding, event, lesson and destination states", () => {
    const wedding = input({ bridesmaids: emptyPartyGroup() });
    expect(estimateStateLine(wedding, estimate(wedding))).toContain("incl. trial & touch-ups");

    const event = input({
      occasion: "event",
      event: { location: "venue", makeup: 3, hair: 0, hairCounts: emptyHairCounts() },
    });
    expect(estimateStateLine(event, estimate(event))).toBe(
      "3 faces · approximate event estimate",
    );

    const lesson = input({ occasion: "lessons", lesson: { attendees: 12 } });
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

  it("groups the breakdown into sections", () => {
    const result = estimate(
      input({ bridesmaids: { makeup: 1, hair: 0, hairCounts: emptyHairCounts() } }),
    );
    expect(result.sections.map((s) => s.label)).toContain("Bride");
    expect(result.sections.map((s) => s.label)).toContain("Bridesmaids");
  });
});