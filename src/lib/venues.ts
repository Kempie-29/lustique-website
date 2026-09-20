/**
 * Venue matcher. Pure and deterministic — it never touches the network. The
 * estimator uses it to resolve a typed venue against the built-in directory
 * before ever calling HERE or OSRM.
 *
 * Matching mirrors the live estimator: names are lower-cased, punctuation is
 * stripped, common venue stop-words are removed, then fuzzy-compared.
 */

import { venues as defaultDirectory, type Venue } from "@/content/venues";

/** Stop-words stripped before comparison (live estimator list). */
const STOP_WORDS = new Set([
  "wedding",
  "function",
  "conference",
  "venue",
  "and",
  "the",
  "estate",
  "centre",
  "center",
  "events",
  "hall",
]);

/** Lower-case, de-punctuate and drop stop-words, collapsing whitespace. */
export function normaliseName(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 0 && !STOP_WORDS.has(token))
    .join(" ")
    .trim();
}

/** Levenshtein edit distance between two strings. */
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const row = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    prev = row;
  }
  return prev[b.length];
}

/** Similarity in [0, 1] — 1 is an exact match. */
export function similarity(a: string, b: string): number {
  const na = normaliseName(a);
  const nb = normaliseName(b);
  if (na.length === 0 || nb.length === 0) return 0;
  if (na === nb) return 1;
  const distance = editDistance(na, nb);
  return 1 - distance / Math.max(na.length, nb.length);
}

/** A short human label for a venue, e.g. "The Plantation Venue, Lovemore Park". */
export function venueLabel(venue: Venue): string {
  return venue.town ? `${venue.name}, ${venue.town}` : venue.name;
}

export interface VenueMatch {
  venue: Venue;
  score: number;
}

/** Best directory match for a query, or null when nothing clears the bar. */
export function findVenueInDirectory(
  text: string,
  directory: Venue[] = defaultDirectory,
  threshold = 0.8,
): VenueMatch | null {
  const query = normaliseName(text);
  if (query.length < 3) return null;

  let best: VenueMatch | null = null;
  for (const venue of directory) {
    const score = Math.max(
      similarity(query, venue.name),
      similarity(query, `${venue.name} ${venue.town}`),
    );
    if (!best || score > best.score) best = { venue, score };
  }
  return best && best.score >= threshold ? best : null;
}

/** Ranked directory suggestions for a query (verified entries first). */
export function searchDirectory(
  text: string,
  limit = 5,
  directory: Venue[] = defaultDirectory,
): VenueMatch[] {
  const query = normaliseName(text);
  if (query.length < 2) return [];

  return directory
    .map((venue) => ({
      venue,
      score: Math.max(
        similarity(query, venue.name),
        similarity(query, `${venue.name} ${venue.town}`),
      ),
    }))
    .filter((match) => match.score > 0.3)
    .sort((a, b) => {
      if (a.venue.verified !== b.venue.verified) return a.venue.verified ? -1 : 1;
      return b.score - a.score;
    })
    .slice(0, limit);
}