/**
 * The pricing engine. Pure and deterministic — given an `EstimateInput` it
 * returns the line items, the number of heads, and the per-person "look" data
 * the promotion engine needs.
 *
 * Exactness note: an additional artist is ONLY ever added when the user
 * explicitly requests one. Larger parties' help is already priced inside the
 * per-person rates, so nothing is ever double-counted.
 */

import {
  PRICES,
  type HairLength,
  type Occasion,
} from "@/content/pricing";
import type { TravelEstimate } from "@/lib/distance";
import { pluralise } from "@/lib/format";

export interface HairCounts {
  short: number;
  medium: number;
  long: number;
  xlong: number;
}

export interface PartyGroupInput {
  makeup: number;
  hair: number;
  hairCounts: HairCounts;
}

export interface FlowerGirlsUnder12Input {
  makeup: number;
  hair: number;
  hairCounts: HairCounts;
}

export interface BrideInput {
  makeup: boolean;
  hair: boolean;
  trial: boolean;
  hairLength: HairLength;
}

export interface EventInput {
  location: "venue" | "studio";
  makeup: number;
  hair: number;
  hairCounts: HairCounts;
}

export interface EstimateInput {
  occasion: Occasion;
  bride: BrideInput;
  bridesmaids: PartyGroupInput;
  mothers: PartyGroupInput;
  guests: PartyGroupInput;
  flowerGirlsUnder12: FlowerGirlsUnder12Input;
  flowerGirlsOver12: PartyGroupInput;
  extraArtists: 0 | 1 | 2;
  event: EventInput;
  lesson: { attendees: number };
  travel: TravelEstimate;
}

export type LineGroup =
  | "bride"
  | "bridesmaid"
  | "mother"
  | "flowergirl"
  | "guest"
  | "event"
  | "lesson"
  | "artist"
  | "travel";

export interface EstimateLine {
  id: string;
  label: string;
  amount: number;
  group: LineGroup;
}

export type LookGroup =
  | "bride"
  | "bridesmaid"
  | "mother"
  | "guest"
  | "flowergirlOver12"
  | "flowergirlUnder12";

export interface Look {
  group: LookGroup;
  makeup: number;
  hair: number;
  /** The bride, an under-12 flower girl and trials are never freed. */
  eligible: boolean;
}

export interface EstimateResult {
  lines: EstimateLine[];
  looks: Look[];
  subtotal: number;
  total: number;
  heads: number;
  isDestination: boolean;
}

export function emptyHairCounts(): HairCounts {
  return { short: 0, medium: 0, long: 0, xlong: 0 };
}

export function emptyPartyGroup(): PartyGroupInput {
  return { makeup: 0, hair: 0, hairCounts: emptyHairCounts() };
}

export function createInitialInput(): EstimateInput {
  return {
    occasion: "wedding",
    bride: { makeup: true, hair: true, trial: true, hairLength: "medium" },
    bridesmaids: emptyPartyGroup(),
    mothers: emptyPartyGroup(),
    guests: emptyPartyGroup(),
    flowerGirlsUnder12: { makeup: 0, hair: 0, hairCounts: emptyHairCounts() },
    flowerGirlsOver12: emptyPartyGroup(),
    extraArtists: 0,
    event: { location: "venue", makeup: 0, hair: 0, hairCounts: emptyHairCounts() },
    lesson: { attendees: 1 },
    travel: { status: "unknown", oneWayKm: null, roundTripKm: null, fee: null, confirmed: false },
  };
}

export function placedHairTotal(counts: HairCounts): number {
  return counts.short + counts.medium + counts.long + counts.xlong;
}

/** Cheapest hair price in a distribution, defaulting to medium when unplaced. */
function cheapestHairPrice(counts: HairCounts, priceTable: Record<HairLength, number>): number {
  const lengths: HairLength[] = ["short", "medium", "long", "xlong"];
  const placed = lengths.filter((l) => counts[l] > 0);
  if (placed.length === 0) return priceTable.medium;
  return Math.min(...placed.map((l) => priceTable[l]));
}

interface GroupSpec {
  key: LineGroup;
  lookGroup: LookGroup;
  label: string;
  makeupPrice: number;
  hairTable: Record<HairLength, number>;
  input: PartyGroupInput;
}

function addPartyGroup(lines: EstimateLine[], looks: Look[], spec: GroupSpec) {
  const { input } = spec;

  if (input.makeup > 0) {
    lines.push({
      id: `${spec.key}-makeup`,
      label: `${spec.label} makeup × ${input.makeup}`,
      amount: input.makeup * spec.makeupPrice,
      group: spec.key,
    });
  }

  const lengths: HairLength[] = ["short", "medium", "long", "xlong"];
  for (const length of lengths) {
    const count = input.hairCounts[length];
    if (count > 0) {
      lines.push({
        id: `${spec.key}-hair-${length}`,
        label: `${spec.label} hair (${labelForLength(length)}) × ${count}`,
        amount: count * spec.hairTable[length],
        group: spec.key,
      });
    }
  }

  const fullLooks = Math.min(input.makeup, input.hair);
  if (fullLooks > 0) {
    const cheapestHair = cheapestHairPrice(input.hairCounts, spec.hairTable);
    for (let i = 0; i < fullLooks; i += 1) {
      looks.push({
        group: spec.lookGroup,
        makeup: spec.makeupPrice,
        hair: cheapestHair,
        eligible: spec.lookGroup !== "flowergirlUnder12",
      });
    }
  }
}

function labelForLength(length: HairLength): string {
  switch (length) {
    case "short":
      return "Short";
    case "medium":
      return "Medium";
    case "long":
      return "Long";
    case "xlong":
      return "Extra long";
  }
}

export function estimate(input: EstimateInput): EstimateResult {
  const lines: EstimateLine[] = [];
  const looks: Look[] = [];
  let heads = 0;

  if (input.occasion === "matric") {
    const attendees = Math.max(0, input.lesson.attendees);
    if (attendees > 0) {
      const rate = attendees >= 10 ? PRICES.lesson.tenPlus : PRICES.lesson.under10;
      lines.push({
        id: "lesson",
        label: `Group lesson × ${attendees} ${pluralise(attendees, "attending", "attending")}`,
        amount: attendees * rate,
        group: "lesson",
      });
      heads += attendees;
    }
  } else if (input.occasion === "event") {
    const { event } = input;
    if (event.makeup > 0) {
      lines.push({
        id: "event-makeup",
        label: `Event makeup × ${event.makeup}`,
        amount: event.makeup * PRICES.event.makeup,
        group: "event",
      });
    }
    const lengths: HairLength[] = ["short", "medium", "long", "xlong"];
    for (const length of lengths) {
      const count = event.hairCounts[length];
      if (count > 0) {
        lines.push({
          id: `event-hair-${length}`,
          label: `Event hair (${labelForLength(length)}) × ${count}`,
          amount: count * PRICES.event.hair[length],
          group: "event",
        });
      }
    }
    heads += Math.max(event.makeup, event.hair);

    if (event.location === "venue" && input.travel.status === "ok" && (input.travel.fee ?? 0) > 0) {
      lines.push({
        id: "travel",
        label: "Travel to venue",
        amount: input.travel.fee as number,
        group: "travel",
      });
    }
  } else {
    // Wedding.
    const { bride } = input;

    if (bride.makeup) {
      lines.push({
        id: "bride-makeup-day",
        label: "Bridal makeup — day of",
        amount: PRICES.bride.makeupDay,
        group: "bride",
      });
      if (bride.trial) {
        lines.push({
          id: "bride-makeup-trial",
          label: "Bridal makeup — trial",
          amount: PRICES.bride.makeupTrial,
          group: "bride",
        });
      }
    }
    if (bride.hair) {
      const hairPrice = PRICES.bride.hair[bride.hairLength];
      lines.push({
        id: "bride-hair-day",
        label: `Bridal hair (${labelForLength(bride.hairLength)}) — day of`,
        amount: hairPrice,
        group: "bride",
      });
      if (bride.trial) {
        lines.push({
          id: "bride-hair-trial",
          label: "Bridal hair — trial",
          amount: hairPrice,
          group: "bride",
        });
      }
    }
    if (bride.makeup || bride.hair) {
      heads += 1;
      looks.push({
        group: "bride",
        makeup: bride.makeup ? PRICES.bride.makeupDay : 0,
        hair: bride.hair ? PRICES.bride.hair[bride.hairLength] : 0,
        eligible: false, // the bride is never freed
      });
    }

    const groups: GroupSpec[] = [
      {
        key: "bridesmaid",
        lookGroup: "bridesmaid",
        label: "Bridesmaid",
        makeupPrice: PRICES.party.makeup.bridesmaid,
        hairTable: PRICES.party.hair,
        input: input.bridesmaids,
      },
      {
        key: "mother",
        lookGroup: "mother",
        label: "Mother",
        makeupPrice: PRICES.party.makeup.mother,
        hairTable: PRICES.party.hair,
        input: input.mothers,
      },
      {
        key: "guest",
        lookGroup: "guest",
        label: "Guest",
        makeupPrice: PRICES.party.makeup.guest,
        hairTable: PRICES.party.hair,
        input: input.guests,
      },
      {
        key: "flowergirl",
        lookGroup: "flowergirlOver12",
        label: "Flower girl (12+)",
        makeupPrice: PRICES.party.makeup.flowerGirlOver12,
        hairTable: PRICES.party.hair,
        input: input.flowerGirlsOver12,
      },
    ];

    for (const spec of groups) {
      addPartyGroup(lines, looks, spec);
      heads += Math.max(spec.input.makeup, spec.input.hair);
    }

    // Under-12 flower girls — child makeup and child hair rates.
    const under12 = input.flowerGirlsUnder12;
    if (under12.makeup > 0) {
      lines.push({
        id: "flowergirl-under12-makeup",
        label: `Flower girl (under 12) makeup × ${under12.makeup}`,
        amount: under12.makeup * PRICES.party.makeup.flowerGirlUnder12,
        group: "flowergirl",
      });
    }
    const lengths: HairLength[] = ["short", "medium", "long", "xlong"];
    for (const length of lengths) {
      const count = under12.hairCounts[length];
      if (count > 0) {
        lines.push({
          id: `flowergirl-under12-hair-${length}`,
          label: `Flower girl (under 12) hair (${labelForLength(length)}) × ${count}`,
          amount: count * PRICES.party.flowerGirlUnder12Hair[length],
          group: "flowergirl",
        });
      }
    }
    heads += Math.max(under12.makeup, under12.hair);
    const under12FullLooks = Math.min(under12.makeup, under12.hair);
    for (let i = 0; i < under12FullLooks; i += 1) {
      looks.push({
        group: "flowergirlUnder12",
        makeup: PRICES.party.makeup.flowerGirlUnder12,
        hair: cheapestHairPrice(under12.hairCounts, PRICES.party.flowerGirlUnder12Hair),
        eligible: false, // under-12 flower girls are never freed
      });
    }

    // Travel — only rendered once it is actually calculated.
    if (input.travel.status === "ok" && (input.travel.fee ?? 0) > 0) {
      lines.push({
        id: "travel",
        label: "Travel to venue",
        amount: input.travel.fee as number,
        group: "travel",
      });
    }
  }

  if (input.extraArtists > 0) {
    lines.push({
      id: "extra-artist",
      label: `Additional artist × ${input.extraArtists}`,
      amount: input.extraArtists * PRICES.extraArtist,
      group: "artist",
    });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
  const isDestination =
    input.travel.status === "destination" &&
    (input.occasion !== "event" || input.event.location === "venue");

  return {
    lines,
    looks,
    subtotal,
    total: subtotal,
    heads,
    isDestination,
  };
}

export function estimateStateLine(input: EstimateInput, result: EstimateResult): string {
  if (result.isDestination) return "Destination — we'll tailor it";

  if (input.occasion === "matric") {
    const n = Math.max(0, input.lesson.attendees);
    return `${n} attending · group lesson`;
  }
  if (input.occasion === "event") {
    return `${result.heads} ${pluralise(result.heads, "face")} · approximate event estimate`;
  }
  return `${result.heads} ${pluralise(result.heads, "look")} · incl. trial & touch-ups for weddings`;
}