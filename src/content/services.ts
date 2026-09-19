/**
 * Service descriptions. Prices are read from `content/pricing.ts` — never
 * re-typed here — so the marketing copy and the estimator can never disagree.
 */

import { PRICES } from "@/content/pricing";
import { formatZar } from "@/lib/format";

export interface ServiceDetail {
  id: string;
  name: string;
  fromLabel: string;
  summary: string;
  includes: string[];
  href: string;
}

export const services: ServiceDetail[] = [
  {
    id: "bridal-makeup",
    name: "Bridal makeup",
    fromLabel: `from ${formatZar(PRICES.bride.makeupDay)}`,
    summary:
      "A considered, long-wearing bridal look, designed with you at your trial and finished with a touch-up kit for the ceremony.",
    includes: [
      "Full trial at our studio, if you'd like one",
      "Skin prepared and primed for a long day",
      "Day-of makeup, plus a touch-up kit",
      "A look built to read beautifully in photographs",
    ],
    href: "/quote",
  },
  {
    id: "bridal-hair",
    name: "Bridal hair",
    fromLabel: `from ${formatZar(PRICES.bride.hair.short)}`,
    summary:
      "Soft, structured styling that holds from your first look to your last dance — priced by length so there are no surprises.",
    includes: [
      "Trial styling so we agree the finish in advance",
      "A style matched to your hair's own weight and movement",
      "Pins, product and hold that last the whole day",
      "Priced by length: short through extra long",
    ],
    href: "/quote",
  },
  {
    id: "the-party",
    name: "The whole party",
    fromLabel: `bridesmaid makeup ${formatZar(PRICES.party.makeup.bridesmaid)}`,
    summary:
      "Bridesmaids, mothers, flower girls and guests — looked after in turn, with a running order that keeps the morning calm.",
    includes: [
      "Flat makeup rates by role, from flower girls to guests",
      "Hair priced by length for every member of the party",
      "A running order built around your ceremony time",
      "Optional additional artists for larger groups",
    ],
    href: "/quote",
  },
  {
    id: "events-from-me",
    name: "Events & occasions",
    fromLabel: `from ${formatZar(PRICES.event.makeup)}`,
    summary:
      "Beyond weddings: matric farewells, milestone birthdays and events, at the venue or in our studio.",
    includes: [
      "Event makeup and hair, priced per person",
      "Meet at the venue, or come to the studio",
      "Group lessons for matric farewells",
      "Travel calculated and confirmed up front",
    ],
    href: "/quote",
  },
];