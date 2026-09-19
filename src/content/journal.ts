/**
 * Journal index. Phase 1 ships the index data only; full journal pages arrive in
 * Phase 2. Links resolve through /journal/:slug so nothing is a dead link.
 */

export interface JournalEntry {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingMinutes: number;
}

export const journal: JournalEntry[] = [
  {
    slug: "quiet-mornings",
    title: "On quiet mornings",
    excerpt:
      "Why the calm of a wedding morning matters as much as the finished look.",
    date: "2026-02-10",
    readingMinutes: 3,
  },
  {
    slug: "why-we-trial",
    title: "Why we always trial",
    excerpt:
      "A trial is not a formality — it is how we make the day itself effortless.",
    date: "2026-01-18",
    readingMinutes: 4,
  },
  {
    slug: "supplier-spotlight",
    title: "Supplier spotlight",
    excerpt:
      "The people we love working alongside to make a wedding day run smoothly.",
    date: "2025-11-30",
    readingMinutes: 5,
  },
];