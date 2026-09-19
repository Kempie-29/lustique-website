/**
 * Free guides index. Phase 1 ships the index data only; full guide pages arrive
 * in Phase 2. Links resolve through /guides/:slug so nothing is a dead link.
 */

export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  readingMinutes: number;
}

export const guides: Guide[] = [
  {
    slug: "preparing-your-skin",
    title: "Preparing your skin before your trial",
    excerpt:
      "A calm, simple routine in the weeks before your trial so your makeup sits beautifully on the day.",
    readingMinutes: 4,
  },
  {
    slug: "choosing-your-hair-length",
    title: "Choosing your bridal hair length",
    excerpt:
      "How length changes your look, your timeline and your estimate — and how to plan for it.",
    readingMinutes: 5,
  },
  {
    slug: "wedding-morning-timeline",
    title: "Timing your wedding-morning schedule",
    excerpt:
      "A realistic running order for hair and makeup so you are ready with time to breathe.",
    readingMinutes: 6,
  },
];