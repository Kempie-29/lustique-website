/**
 * Free guides — index data plus full body copy. Each body is general,
 * practical guidance only; nothing about the business is invented.
 * Links resolve through /guides/:slug.
 */

export interface GuideSection {
  heading?: string;
  paragraphs: string[];
  list?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  readingMinutes: number;
  body: GuideSection[];
}

export const guides: Guide[] = [
  {
    slug: "preparing-your-skin",
    title: "Preparing your skin before your trial",
    excerpt:
      "A calm, simple routine in the weeks before your trial so your makeup sits beautifully on the day.",
    readingMinutes: 4,
    body: [
      {
        paragraphs: [
          "The single most useful thing you can do for your bridal makeup is to arrive at your trial with skin that has been treated gently for a few weeks. Not perfect — just settled.",
          "There is no miracle product in the last week. What matters is consistency and restraint in the weeks before.",
        ],
      },
      {
        heading: "Four weeks out",
        paragraphs: [
          "If you have been meaning to see a skin therapist, this is the moment. New treatments need time to settle, and four weeks gives any redness or peeling room to pass.",
          "If you would rather keep things simple, a gentle cleanser, a moisturiser you already trust, and daily sun protection will do more than a shelf of new products.",
        ],
      },
      {
        heading: "The week of your trial",
        paragraphs: [
          "Keep to what your skin already knows. This is not the week for a new active serum, a facial, or a first-ever wax.",
        ],
        list: [
          "Drink water as you normally would — no dramatic changes.",
          "Arrive with a clean, moisturised face and no makeup.",
          "Bring a photo of a makeup look you love, and one you don't.",
          "Bring the jewellery or hair accessory you plan to wear, if you have it.",
        ],
      },
      {
        heading: "On the day",
        paragraphs: [
          "Come as you are, with your hair in its usual state of washing. We would rather see and work with the real thing than a version prepared for us.",
        ],
      },
    ],
  },
  {
    slug: "choosing-your-hair-length",
    title: "Choosing your bridal hair length",
    excerpt:
      "How length changes your look, your timeline and your estimate — and how to plan for it.",
    readingMinutes: 5,
    body: [
      {
        paragraphs: [
          "Length is one of the quiet decisions that shapes your whole morning. It changes how a style reads in photographs, how long styling takes, and — honestly — what your estimate comes to.",
          "There is no wrong answer. There is only the answer that suits the look you want and the morning you want to have.",
        ],
      },
      {
        heading: "The four bands we work in",
        paragraphs: [
          "We price and plan by four lengths: short, medium, long and extra long. Each sits a little further along the time and product it takes to style.",
        ],
        list: [
          "Short — chin to collarbone. Quick to style, lovely for soft, undone looks.",
          "Medium — collarbone to mid-back. The most versatile band, and the easiest to plan around.",
          "Long — mid-back to waist. Beautiful for low styles, braids and waves; allow more time.",
          "Extra long — below the waist. Wonderful volume and drama; the longest to prepare.",
        ],
      },
      {
        heading: "Planning your timeline",
        paragraphs: [
          "As a rough rule, the longer and thicker the hair, the earlier we start. If you and your bridal party sit across several bands, we build the running order so the longest sets begin first and the whole morning still finishes with room to breathe.",
          "If you are thinking about extensions or a length change before the wedding, mention it in your enquiry. It is much easier to plan for than to discover on the morning.",
        ],
      },
      {
        heading: "Where it shows up in your estimate",
        paragraphs: [
          "Your estimate scales automatically with the length you choose, for you and for each of your party. You can see the effect the moment you change a length in the estimator — no guesswork.",
        ],
      },
    ],
  },
  {
    slug: "wedding-morning-timeline",
    title: "Timing your wedding-morning schedule",
    excerpt:
      "A realistic running order for hair and makeup so you are ready with time to breathe.",
    readingMinutes: 6,
    body: [
      {
        paragraphs: [
          "A wedding morning goes wrong in one of two ways: too little time, or too much of it spent waiting. A good running order protects against both.",
          "This is the shape we use most often. Your own will move around your ceremony time, your venue and your people.",
        ],
      },
      {
        heading: "Build backwards from the ceremony",
        paragraphs: [
          "Start at the ceremony time and work backwards, allowing for the photographs, the dress, and the little things that always take longer than expected. The bride should be finished with time to spare.",
        ],
      },
      {
        heading: "A typical order",
        paragraphs: [
          "We begin with the longest hair and the largest group, then work towards the bride. Everyone gets a set moment rather than hovering.",
        ],
        list: [
          "Arrival and set-up, with the chairs and mirrors arranged in a quiet corner.",
          "Bridesmaids and guests, longest hair first.",
          "Mothers and flower girls, who often need less time and prefer to be near the action.",
          "The bride's hair, then a pause for the dress and photographs.",
          "The bride's makeup, finishing with a touch-up kit for the ceremony.",
        ],
      },
      {
        heading: "Small things that help",
        paragraphs: [
          "A pot of coffee, a fan if it is a warm month, and one person who knows the plan all make the morning calmer. If you have a photographer arriving early, tell us — we are happy to build around their schedule.",
          "If your party is large, an additional artist keeps the morning moving. It is always optional, and never added without you asking.",
        ],
      },
    ],
  },
];