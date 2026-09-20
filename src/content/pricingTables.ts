/**
 * Pricing tables for the /pricing page. Every figure is read from
 * `content/pricing.ts` so the tables and the estimator always agree.
 */

import { HAIR_LENGTHS, PRICES } from "@/content/pricing";
import { formatZar } from "@/lib/format";

export interface PriceRow {
  label: string;
  price: string;
  note?: string;
}

export interface PriceTable {
  id: string;
  title: string;
  intro?: string;
  rows: PriceRow[];
}

const hairLabel = (length: "short" | "medium" | "long" | "xlong") =>
  HAIR_LENGTHS.find((l) => l.value === length)?.label ?? length;

const brideHairRows: PriceRow[] = HAIR_LENGTHS.map((l) => ({
  label: `Bridal hair — ${l.label}`,
  price: formatZar(PRICES.bride.hair[l.value]),
  note: "day of · the same again for a trial",
}));

const partyHairRows: PriceRow[] = HAIR_LENGTHS.map((l) => ({
  label: `Party hair — ${l.label}`,
  price: formatZar(PRICES.party.hair[l.value]),
}));

const under12HairRows: PriceRow[] = HAIR_LENGTHS.map((l) => ({
  label: `Flower girl (under 12) hair — ${l.label}`,
  price: formatZar(PRICES.party.flowerGirlUnder12Hair[l.value]),
}));

export const pricingTables: PriceTable[] = [
  {
    id: "bride",
    title: "The bride",
    intro: "Your own makeup and hair, with an optional trial at our studio.",
    rows: [
      { label: "Bridal makeup — day of", price: formatZar(PRICES.bride.makeupDay) },
      {
        label: "Bridal makeup — trial",
        price: formatZar(PRICES.bride.makeupTrial),
        note: "included in the bridal estimate unless declined",
      },
      ...brideHairRows,
    ],
  },
  {
    id: "party",
    title: "The bridal party",
    intro: "Makeup is a flat rate by role; hair scales with length.",
    rows: [
      { label: "Bridesmaid makeup", price: formatZar(PRICES.party.makeup.bridesmaid) },
      { label: "Mother makeup", price: formatZar(PRICES.party.makeup.mother) },
      { label: "Guest makeup", price: formatZar(PRICES.party.makeup.guest) },
      {
        label: "Flower girl (12 and over) makeup",
        price: formatZar(PRICES.party.makeup.flowerGirlOver12),
      },
      {
        label: "Flower girl (under 12) makeup",
        price: formatZar(PRICES.party.makeup.flowerGirlUnder12),
      },
      ...partyHairRows,
      ...under12HairRows,
    ],
  },
  {
      id: "events",
      title: "Events & occasions",
      intro: "Matric farewells, birthdays and events — at the venue or in the studio.",
      rows: [
        { label: "Event makeup", price: formatZar(PRICES.event.makeup) },
        ...HAIR_LENGTHS.map((l) => ({
          label: `Event hair — ${l.label}`,
          price: formatZar(PRICES.event.hair[l.value]),
        })),
        {
          label: "Matric farewell — hair & makeup",
          price: `${formatZar(PRICES.beyondBridal.matric)} per face`,
        },
        {
          label: "Group lesson — under 10 attending",
          price: `${formatZar(PRICES.lesson.under10)} each`,
          note: `minimum ${PRICES.lesson.minAttendees} attending`,
        },
        {
          label: "Group lesson — 10 or more attending",
          price: `${formatZar(PRICES.lesson.tenPlus)} each`,
        },
      ],
    },
    {
      id: "beyond-bridal",
      title: "Beyond bridal",
      intro: "Editorial, engagement, corporate and pageant work — flat rate per look.",
      rows: [
        { label: "Editorial & shoot", price: formatZar(PRICES.beyondBridal.editorial) },
        { label: "Engagement & corporate", price: formatZar(PRICES.beyondBridal.engagement) },
        { label: "Pageant", price: formatZar(PRICES.beyondBridal.pageant) },
      ],
    },
  {
    id: "travel",
    title: "Travel & extras",
    intro: "We never charge travel we haven't calculated and confirmed with you.",
    rows: [
      {
        label: "Travel within 40 km round trip",
        price: "Free",
        note: "of our La Montagne studio",
      },
      {
        label: "Travel beyond 40 km",
        price: `${formatZar(PRICES.travel.perKm)} per km round trip`,
        note: "confirmed before you book",
      },
      {
        label: "Further than 200 km one way",
        price: "Tailored",
        note: "a destination wedding — we'll plan it with you",
      },
      {
        label: "Additional artist",
        price: `${formatZar(PRICES.extraArtist)} each`,
        note: "only ever added if you request one",
      },
    ],
  },
];

export { hairLabel };