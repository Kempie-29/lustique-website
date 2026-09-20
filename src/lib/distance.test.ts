import { describe, it, expect, vi } from "vitest";
import {
  accommodationEstimate,
  computeTravel,
  haversineKm,
  travelFromBand,
  unknownTravel,
  resolveDistance,
  ORIGIN,
} from "@/lib/distance";
import { formatZar, formatTotal, numberWord } from "@/lib/format";

describe("distance — confirmed estimates", () => {
  it("is free within 40 km round trip", () => {
    expect(computeTravel(20).fee).toBe(0);
    expect(computeTravel(20).status).toBe("ok");
  });

  it("charges R7 per km round trip beyond 40 km", () => {
    // 30 km one way = 60 km round trip -> 20 km chargeable -> 140
    expect(computeTravel(30).fee).toBe(140);
  });

  it("treats >200 km one way as a destination with no travel price", () => {
    const dest = computeTravel(250);
    expect(dest.status).toBe("destination");
    expect(dest.fee).toBeNull();
  });

  it("stays unknown without a resolvable distance", () => {
    expect(computeTravel(0).status).toBe("unknown");
    expect(unknownTravel().fee).toBeNull();
  });
});

describe("distance — band fallback", () => {
  it("gives each closed band its confirmed fee", () => {
    expect(travelFromBand("0-20").status).toBe("ok");
    expect(travelFromBand("0-20").fee).toBe(0);
    expect(travelFromBand("20-80").fee).toBe(770);
    expect(travelFromBand("80-150").fee).toBe(1610);
    expect(travelFromBand("150-200").fee).toBe(2450);
  });

  it("treats 200+ as a destination with no automatic fee", () => {
    expect(travelFromBand("200+").status).toBe("destination");
    expect(travelFromBand("200+").fee).toBeNull();
  });

  it("stays unknown without a band", () => {
    expect(travelFromBand(null).status).toBe("unknown");
  });
});

describe("distance — destination accommodation", () => {
  it("estimates two nights per artist at R1 000 a night", () => {
    expect(accommodationEstimate(2)).toBe(4000);
    expect(accommodationEstimate(0)).toBe(0);
  });
});

describe("distance — haversine", () => {
  it("is zero at the origin", () => {
    expect(haversineKm(ORIGIN, ORIGIN)).toBe(0);
  });
});

describe("distance — no key", () => {
  it("never invents a distance without a Maps key", async () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const result = await resolveDistance("Some Venue, Pretoria");
    expect(result.status).toBe("unknown");
    expect(result.fee).toBeNull();
    spy.mockRestore();
  });
});

describe("format", () => {
  it("formats en-ZA currency with space thousands and no decimals", () => {
    expect(formatZar(2690)).toBe("R2 690");
    expect(formatZar(10205)).toBe("R10 205");
    expect(formatZar(-995)).toBe("−R995");
  });

  it("prefixes wedding-style totals with 'from'", () => {
    expect(formatTotal(2890, true)).toBe("from R2 890");
    expect(formatTotal(2890, false)).toBe("R2 890");
  });

  it("spells artist counts", () => {
    expect(numberWord(7)).toBe("Seven");
  });
});