/**
 * Verified venue directory.
 *
 * The live estimator ships a built-in directory of South African wedding
 * venues. A directory hit resolves instantly, offline and without an API call —
 * which is why the site carries the data. This file mirrors the live entry
 * shape exactly so a directory export drops straight in.
 *
 * IMPORTANT — no fabricated data:
 * The complete live list (≈300 entries, each `{ name, town, province, address,
 * latitude, longitude, source, precision, verified }`) has NOT been transcribed
 * here yet. We will not invent coordinates, so the array starts empty and
 * is populated from the live directory (or a geocoding pass over a supplied
 * list). Until then the estimator resolves venues through HERE geocoding and
 * the manual distance bands — see `resolveDistance` in `src/lib/distance.ts`.
 *
 * To extend: append entries to `venues` below. `verified: true` entries are
 * trusted outright; `verified: false` entries are still matched but flagged.
 * `precision` records how exact the coordinate is, so a town-centre pin is
 * never mistaken for a street address.
 */

export type VenuePrecision = "street" | "suburb" | "town" | "province";

export interface Venue {
  /** Display name, e.g. "The Plantation Venue". */
  name: string;
  /** Nearest town / suburb, e.g. "Lovemore Park". */
  town: string;
  /** Province, e.g. "Eastern Cape". */
  province: string;
  /** Street address if known, otherwise the best locality string. */
    address: string;
    /** Latitude of the venue. */
    lat: number;
    /** Longitude of the venue. */
    lng: number;
  /** Where the entry came from, e.g. "live-directory" or "geocode". */
  source: string;
  precision: VenuePrecision;
  /** Whether the coordinates have been confirmed against the venue itself. */
  verified: boolean;
}

/** The complete, verified venue directory. See the note above before editing. */
export const venues: Venue[] = [];