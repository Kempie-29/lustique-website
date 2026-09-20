/**
 * The pricing engine. Pure and deterministic — given an `EstimateInput` it
 * returns the ordered, section-grouped line items, the head count, and the
 * per-person "look" data the promotion engine needs.
 *
 * Mirrors the live estimator (`Fe`):
 * - weddings: bride (day + optional trial) then party groups then flower girls;
 * - events: the same block with the bride disabled and the party pulled from the
 *   event fields, priced at guest makeup (R550) and adult hair rates;
 * - beyond-bridal occasions (matric/editorial/engagement/corporate/pageant):
 *   one flat rate per face, head count taken from the event fields;
 * - group lessons: `max(6, attendees)` faces at a tiered rate;
 * - travel is added once, for whichever occasion meets away from the studio.
 *
 * Exactness note: an additional artist is ONLY ever added when the user
 * explicitly requests one. Larger parties' help is already priced inside the
 * per-person rates, so nothing is ever double-counted.
 */

import {
  PRICES,
  isBeyondBridalOccasion,
  OCCASION_LABELS,
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
  | "adjustment"
  | "travel";

export interface EstimateLine {
  id: string;
  label: string;
  amount: number;
  group: LineGroup;
  /** Section heading used to group the breakdown, e.g. "Bridesmaids". */
  section: string;
}

export interface EstimateSection {
  key: LineGroup;
  label: string;
  lines: EstimateLine[];
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
  sections: EstimateSection[];
  looks: Look[];
  /** Value of a freed look once the promotion engine runs (null otherwise). */
  freeLook: number | null;
  perks: string[];
  subtotal: number;
  total: number;
  heads: number;
  isDestination: boolean;
}

const SECTION_LABEL: Record<LineGroup, string> = {
  bride: "Bride",
  bridesmaid: "Bridesmaids",
  mother: "Mothers",
  guest: "Guests",
  flowergirl: "Flower Girl",
  event: "Your looks",
  lesson: "Lessons",
  artist: "Adjustments",
  adjustment: "Adjustments",
  travel: "Travel",
};

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

const LENGTHS: HairLength[] = ["short", "medium", "long", "xlong"];

/** Cheapest hair price in a distribution, defaulting to medium when unplaced. */
function cheapestHairPrice(counts: HairCounts, priceTable: Record<HairLength, number>): number {
  const placed = LENGTHS.filter((l) => counts[l] > 0);
  if (placed.length === 0) return priceTable.medium;
  return Math.min(...placed.map((l) => priceTable[l]));
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

interface Builder {
  lines: EstimateLine[];
  looks: Look[];
}

function addLine(
  builder: Builder,
  group: LineGroup,
  id: string,
  label: string,
  amount: number,
) {
  builder.lines.push({ id, label, amount, group, section: SECTION_LABEL[group] });
}

interface GroupSpec {
  key: LineGroup;
  lookGroup: LookGroup;
  label: string;
  makeupPrice: number;
  hairTable: Record<HairLength, number>;
  input: PartyGroupInput;
}

function addPartyGroup(builder: Builder, spec: GroupSpec): number {
  const { input } = spec;
  let heads = 0;

  if (input.makeup > 0) {
    addLine(
      builder,
      spec.key,
      `${spec.key}-makeup`,
      `${spec.label} makeup × ${input.makeup}`,
      input.makeup * spec.makeupPrice,
    );
  }

  for (const length of LENGTHS) {
    const count = input.hairCounts[length];
    if (count > 0) {
      addLine(
        builder,
        spec.key,
        `${spec.key}-hair-${length}`,
        `${spec.label} hair (${labelForLength(length)}) × ${count}`,
        count * spec.hairTable[length],
      );
    }
  }

  heads += Math.max(input.makeup, input.hair);

  const fullLooks = Math.min(input.makeup, input.hair);
  if (fullLooks > 0) {
    const cheapestHair = cheapestHairPrice(input.hairCounts, spec.hairTable);
    for (let i = 0; i < fullLooks; i += 1) {
      builder.looks.push({
        group: spec.lookGroup,
        makeup: spec.makeupPrice,
        hair: cheapestHair,
        eligible: true,
      });
    }
  }

  return heads;
}

/** Wedding / event block: invitees priced per person. */
function estimateParty(
  builder: Builder,
  input: EstimateInput,
  eventMode: boolean,
): number {
  let heads = 0;

  if (!eventMode) {
    const { bride } = input;
    if (bride.makeup) {
      addLine(builder, "bride", "bride-makeup-day", "Bridal makeup — day of", PRICES.bride.makeupDay);
      if (bride.trial) {
        addLine(builder, "bride", "bride-makeup-trial", "Bridal makeup — trial", PRICES.bride.makeupTrial);
      }
    }
    if (bride.hair) {
      const hairPrice = PRICES.bride.hair[bride.hairLength];
      addLine(
        builder,
        "bride",
        "bride-hair-day",
        `Bridal hair (${labelForLength(bride.hairLength)}) — day of`,
        hairPrice,
      );
      if (bride.trial) {
        addLine(builder, "bride", "bride-hair-trial", "Bridal hair — trial", hairPrice);
      }
    }
    if (bride.makeup || bride.hair) {
      heads += 1;
      builder.looks.push({
        group: "bride",
        makeup: bride.makeup ? PRICES.bride.makeupDay : 0,
        hair: bride.hair ? PRICES.bride.hair[bride.hairLength] : 0,
        eligible: false, // the bride is never freed
      });
    }
  }

  const groups: GroupSpec[] = eventMode
    ? [
        {
          key: "event",
          lookGroup: "guest",
          label: "Event",
          makeupPrice: PRICES.event.makeup,
                    hairTable: PRICES.event.hair,
                    input: {
                      makeup: input.event.makeup,
                      hair: input.event.hair,
                      hairCounts: input.event.hairCounts,
                    },
                  },
      ]
    : [
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
    heads += addPartyGroup(builder, spec);
  }

  // Flower girls under 12 use child rates and are never freed.
  if (!eventMode) {
    const under12 = input.flowerGirlsUnder12;
    if (under12.makeup > 0) {
      addLine(
        builder,
        "flowergirl",
        "flowergirl-under12-makeup",
        `Flower girl (under 12) makeup × ${under12.makeup}`,
        under12.makeup * PRICES.party.makeup.flowerGirlUnder12,
      );
    }
    for (const length of LENGTHS) {
      const count = under12.hairCounts[length];
      if (count > 0) {
        addLine(
          builder,
          "flowergirl",
          `flowergirl-under12-hair-${length}`,
          `Flower girl (under 12) hair (${labelForLength(length)}) × ${count}`,
          count * PRICES.party.flowerGirlUnder12Hair[length],
        );
      }
    }
    heads += Math.max(under12.makeup, under12.hair);
    const under12FullLooks = Math.min(under12.makeup, under12.hair);
    for (let i = 0; i < under12FullLooks; i += 1) {
      builder.looks.push({
        group: "flowergirlUnder12",
        makeup: PRICES.party.makeup.flowerGirlUnder12,
        hair: cheapestHairPrice(under12.hairCounts, PRICES.party.flowerGirlUnder12Hair),
        eligible: false, // under-12 flower girls are never freed
      });
    }
  }

  return heads;
}

/** Beyond-bridal: one flat rate per face, head count from the event fields. */
function estimateBeyondBridal(builder: Builder, input: EstimateInput): number {
  const occasion = input.occasion;
  const rate = isBeyondBridalOccasion(occasion)
    ? PRICES.beyondBridal.rates[occasion]
    : PRICES.beyondBridal.default;
  const faces = Math.max(0, input.event.makeup, input.event.hair);

  if (faces > 0) {
    addLine(
      builder,
      "event",
      `beyond-${occasion}`,
      `${OCCASION_LABELS[occasion]} look × ${faces}`,
      faces * rate,
    );
  }
  return faces;
}

/** Group lessons: `max(6, attendees)` faces at a tiered rate. */
function estimateLesson(builder: Builder, input: EstimateInput): number {
  const attendance = Math.max(PRICES.lesson.minAttendees, input.lesson.attendees || 0);
  const rate = attendance < PRICES.lesson.threshold ? PRICES.lesson.under10 : PRICES.lesson.tenPlus;
  addLine(
    builder,
    "lesson",
    "group-lesson",
    `Group lesson × ${attendance}`,
    attendance * rate,
  );
  return attendance;
}

function buildSections(lines: EstimateLine[]): EstimateSection[] {
  const sections: EstimateSection[] = [];
  for (const line of lines) {
    const existing = sections.find((s) => s.key === line.group);
    if (existing) existing.lines.push(line);
    else sections.push({ key: line.group, label: line.section, lines: [line] });
  }
  return sections;
}

export function estimate(input: EstimateInput): EstimateResult {
  const builder: Builder = { lines: [], looks: [] };
  let heads = 0;

  if (isBeyondBridalOccasion(input.occasion)) {
    heads = estimateBeyondBridal(builder, input);
  } else if (input.occasion === "lessons") {
    heads = estimateLesson(builder, input);
  } else {
    heads = estimateParty(builder, input, input.occasion === "event");
  }

  if (input.extraArtists > 0) {
    addLine(
      builder,
      "artist",
      "extra-artist",
      `Additional artist × ${input.extraArtists}`,
      input.extraArtists * PRICES.extraArtist,
    );
  }

  // Travel — added once, only when we meet away from the studio.
    const meetsAway = input.occasion !== "lessons" && input.event.location !== "studio";
    if (meetsAway && input.travel.status === "ok" && (input.travel.fee ?? 0) > 0) {
      addLine(builder, "travel", "travel", "Travel to venue", input.travel.fee as number);
    }

  const subtotal = builder.lines.reduce((sum, line) => sum + line.amount, 0);
  const isDestination =
    input.travel.status === "destination" &&
    input.occasion !== "lessons" &&
    input.event.location !== "studio";

  return {
    lines: builder.lines,
    sections: buildSections(builder.lines),
    looks: builder.looks,
    freeLook: null,
    perks: [],
    subtotal,
    total: subtotal,
    heads,
    isDestination,
  };
}

export function estimateStateLine(input: EstimateInput, result: EstimateResult): string {
  if (result.isDestination) return "Destination — we'll tailor it";

  if (input.occasion === "lessons") {
    return `${result.heads} attending · group lesson`;
  }

  if (input.occasion === "event" || isBeyondBridalOccasion(input.occasion)) {
    return `${result.heads} ${pluralise(result.heads, "face")} · approximate event estimate`;
  }

  return `${result.heads} ${pluralise(result.heads, "look")} · incl. trial & touch-ups`;
}