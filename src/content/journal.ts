/**
 * Journal — index data plus full body copy. General, studio-toned writing;
 * nothing factual about the business is invented. Links resolve through
 * /journal/:slug.
 */

export interface JournalSection {
  heading?: string;
  paragraphs: string[];
  list?: string[];
}

export interface JournalEntry {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingMinutes: number;
  body: JournalSection[];
}

export const journal: JournalEntry[] = [
  {
    slug: "quiet-mornings",
    title: "On quiet mornings",
    excerpt:
      "Why the calm of a wedding morning matters as much as the finished look.",
    date: "2026-02-10",
    readingMinutes: 3,
    body: [
      {
        paragraphs: [
          "People talk about bridal hair and makeup as a set of decisions — this shape, that shade. But most of what a bride remembers is the feeling of the room: whether it was calm, whether she had a moment to sit still.",
          "That feeling is not an accident. It is something you can plan for.",
        ],
      },
      {
        heading: "Calm is a schedule, not a mood",
        paragraphs: [
          "A quiet morning is usually one that was timed honestly in the week before, with a little slack built in. When the running order has room in it, no one has to hurry, and the bride is not watching the clock.",
        ],
      },
      {
        heading: "One chair at a time",
        paragraphs: [
          "We keep our diary small on purpose. Fewer weddings in a day means each bride gets attention rather than logistics, and the morning keeps its pace.",
        ],
      },
      {
        paragraphs: [
          "If you take one thing from this: plan the morning as carefully as you plan the look. The two are not separate.",
        ],
      },
    ],
  },
  {
    slug: "why-we-trial",
    title: "Why we always trial",
    excerpt:
      "A trial is not a formality — it is how we make the day itself effortless.",
    date: "2026-01-18",
    readingMinutes: 4,
    body: [
      {
        paragraphs: [
          "A trial is sometimes treated as a formality, an appointment to get through. We think of it as the opposite: it is the work that makes the wedding morning calm.",
        ],
      },
      {
        heading: "What a trial actually does",
        paragraphs: [
          "It tests the look against your real hair, your real skin and your real dress. Photographs help, but nothing replaces seeing a style on you, in daylight, and living with it for an hour.",
        ],
        list: [
          "We learn how your hair holds and how it moves.",
          "We agree the finish — how much coverage, how full the lash, how soft the style.",
          "We time it, so the morning plan is based on reality rather than hope.",
        ],
      },
      {
        heading: "What to bring",
        paragraphs: [
          "Bring your inspiration photos, your hair accessory, and anything you are unsure about. Bring the questions you have been saving up. The trial is the place for every one of them.",
        ],
      },
      {
        heading: "If you would rather not",
        paragraphs: [
          "A trial is included in every bridal estimate, but it is yours to decline. If you would rather plan without one, you can switch it off in the estimator and we will work from your references instead.",
        ],
      },
    ],
  },
  {
    slug: "supplier-spotlight",
    title: "Supplier spotlight",
    excerpt:
      "The people we love working alongside to make a wedding day run smoothly.",
    date: "2025-11-30",
    readingMinutes: 5,
    body: [
      {
        paragraphs: [
          "A wedding day is a relay, and the people around you decide how smoothly it runs. We are grateful for the suppliers who make our mornings easier and our brides calmer.",
        ],
      },
      {
        heading: "Who we love working with",
        paragraphs: [
          "Photographers who arrive early and shoot the getting-ready quietly. Planners who share a running order rather than guarding it. Venues with a corner of natural light and a spare plug point.",
        ],
        list: [
          "Photographers — for the calm, candid coverage of the morning.",
          "Planners and coordinators — for a running order everyone can see.",
          "Venues — for light, space and a steady supply of coffee.",
          "Florists — for the flowers we are lucky enough to style around.",
        ],
      },
      {
        heading: "For suppliers",
        paragraphs: [
          "If you plan or photograph weddings and would like to work together, we would love to hear from you. Introductions and referrals are always welcome.",
        ],
      },
    ],
  },
];