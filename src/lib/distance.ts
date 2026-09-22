/**
 * Travel adapter. A HERE key is optional: without one we never invent a
 * distance or fee — directory hits still resolve (free, offline), and anything
 * else returns an unconfirmed estimate so the UI shows "to be confirmed" plus
 * the manual distance-band fallback.
 *
 * Resolution order (mirrors live): built-in directory → HERE geocode →
 * HERE autosuggest → OSRM driving distance.
 * Type-ahead order: built-in directory → HERE (if a key is set) → keyless
 * OpenStreetMap Nominatim, so the suggesting UI still responds with no key.
 * Origin: Lustique Co. studio, La Montagne, Pretoria.
 */

import { DISTANCE_BANDS, PRICES, type DistanceBand } from "@/content/pricing";
import { site } from "@/content/site";
import {
  findVenueInDirectory,
  searchDirectory,
  venueLabel,
} from "@/lib/venues";

export type TravelStatus = "ok" | "unknown" | "destination";

export interface TravelEstimate {
  status: TravelStatus;
  oneWayKm: number | null;
  roundTripKm: number | null;
  /** Null means "to be confirmed" — never render it as a number. */
  fee: number | null;
  confirmed: boolean;
}

export interface DestinationIndicative {
  travelEstimate: number;
  artists: number;
  accommodationEstimate: number;
}

export const ORIGIN = { lat: site.coords.lat, lng: site.coords.lng };

export const TRAVEL_RULES = PRICES.travel;

/** Live artist heuristic for destination accommodation. */
export function artistsForHeads(heads: number): number {
  return heads >= 9 ? 3 : heads >= 5 ? 2 : 1;
}

export function unknownTravel(): TravelEstimate {
  return {
    status: "unknown",
    oneWayKm: null,
    roundTripKm: null,
    fee: null,
    confirmed: false,
  };
}

/** Great-circle distance in kilometres. */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Turn a one-way distance into a confirmed travel estimate.
 * Live formula: fee = roundTrip <= 40 ? 0 : round(roundTrip × 7) — R7/km on
 * the WHOLE round trip once past 40 km. A drive over 200 km one way is a
 * destination and is never auto-priced.
 */
export function computeTravel(oneWayKm: number): TravelEstimate {
  if (!Number.isFinite(oneWayKm) || oneWayKm <= 0) return unknownTravel();

  if (oneWayKm > TRAVEL_RULES.destinationOneWayKm) {
    return {
      status: "destination",
      oneWayKm,
      roundTripKm: oneWayKm * 2,
      fee: null,
      confirmed: false,
    };
  }

  const roundTripKm = oneWayKm * 2;
  const fee = roundTripKm <= TRAVEL_RULES.freeRoundTripKm
    ? 0
    : Math.round(roundTripKm * TRAVEL_RULES.perKm);

  return { status: "ok", oneWayKm, roundTripKm, fee, confirmed: true };
}

/** Convenience: distance from the studio to a lat/lng. */
export function travelFromLatLng(lat: number, lng: number): TravelEstimate {
  return computeTravel(haversineKm(ORIGIN, { lat, lng }));
}

/**
 * Indicative destination figures: travel is charged at the same R7/km on the
 * round trip; accommodation is `artists × R1 000 × 2 nights`, where the artist
 * count follows the live head-count heuristic.
 */
export function destinationIndicative(oneWayKm: number, heads: number): DestinationIndicative {
  const km = Number.isFinite(oneWayKm) && oneWayKm > 0 ? oneWayKm : 0;
  const artists = artistsForHeads(heads);
  return {
    travelEstimate: Math.round(km * 2 * TRAVEL_RULES.perKm),
    artists,
    accommodationEstimate:
      artists * TRAVEL_RULES.accommodationPerArtistNight * TRAVEL_RULES.accommodationNights,
  };
}

/**
 * Manual fallback when an address cannot be resolved. Each closed band carries
 * the confirmed fallback fee from the live estimator; the 200+ band is a
 * destination and is never priced automatically.
 */
export function travelFromBand(band: DistanceBand | null): TravelEstimate {
  if (!band) return unknownTravel();
  const entry = DISTANCE_BANDS.find((b) => b.value === band);
  if (!entry) return unknownTravel();

  if (entry.fee === null) return destinationTravel();

  return {
    status: "ok",
    oneWayKm: null,
    roundTripKm: null,
    fee: entry.fee,
    confirmed: true,
  };
}

function destinationTravel(): TravelEstimate {
  return {
    status: "destination",
    oneWayKm: null,
    roundTripKm: null,
    fee: null,
    confirmed: false,
  };
}

/**
 * Destination accommodation estimate: a nightly rate per artist, for the
 * number of nights a remote wedding keeps the team away from home.
 */
export function accommodationEstimate(artists: number): number {
  const n = Math.max(0, Math.round(artists));
  return n * TRAVEL_RULES.accommodationPerArtistNight * TRAVEL_RULES.accommodationNights;
}

/**
 * The HERE key, read from either documented name. `VITE_HERE_API_KEY` is the
 * canonical one; `VITE_MAPS_API_KEY` is accepted as an alias so an existing
 * deploy keeps working without a rename.
 */
export function getHereApiKey(): string | undefined {
  const env = import.meta.env;
  const names = [env?.VITE_HERE_API_KEY, env?.VITE_MAPS_API_KEY] as (string | undefined)[];
  for (const name of names) {
    if (name && name.trim().length > 0) return name;
  }
  return undefined;
}

export function hasHereKey(): boolean {
  return getHereApiKey() !== undefined;
}

/** Drive distance from the studio to the given point via public OSRM routing. */
async function osrmDriveKm(lat: number, lng: number): Promise<number | null> {
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${ORIGIN.lng},${ORIGIN.lat};${lng},${lat}?overview=false`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as { routes?: { distance?: number }[] };
    const metres = data.routes?.[0]?.distance;
    if (typeof metres !== "number") return null;
    return Math.round(metres / 1000);
  } catch {
    return null;
  }
}

/** Resolve coordinates to a travel estimate, preferring OSRM, then haversine. */
export async function travelToCoords(lat: number, lng: number): Promise<TravelEstimate> {
  const driveKm = await osrmDriveKm(lat, lng);
  if (driveKm != null) return computeTravel(driveKm);
  return travelFromLatLng(lat, lng);
}

/** HERE geocode a free-text address, biased to the studio and to South Africa. */
async function hereGeocode(
  address: string,
  key: string,
): Promise<{ lat: number; lng: number } | null> {
  try {
    const url =
      `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}` +
      `&in=countryCode:ZAF&at=${ORIGIN.lat},${ORIGIN.lng}&apiKey=${key}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      items?: { resultType?: string; position?: { lat: number; lng: number } }[];
    };
    // Reject imprecise locality/province/country matches so we never measure
    // to the centre of a town.
    const item = data.items?.find(
      (i) => i.resultType !== "locality" && i.resultType !== "administrativeArea",
    );
    const pos = item?.position;
    return pos ? { lat: pos.lat, lng: pos.lng } : null;
  } catch {
    return null;
  }
}

/**
 * Resolve a free-text venue to a travel estimate.
 * Directory match → HERE geocode → HERE autosuggest. Returns an unconfirmed
 * estimate when nothing resolves or no key is configured.
 */
export async function resolveDistance(address: string): Promise<TravelEstimate> {
  const text = address.trim();
  if (text.length < 3) return unknownTravel();

  // 1. Built-in directory — free, offline, instant.
  const match = findVenueInDirectory(text);
  if (match) return travelToCoords(match.venue.lat, match.venue.lng);

  // 2. HERE geocode (only with a key).
  const key = getHereApiKey();
  if (!key) return unknownTravel();

  const coords = await hereGeocode(text, key);
  if (coords) return travelToCoords(coords.lat, coords.lng);

  // 3. HERE autosuggest — take the first suggested position as a last resort.
  const suggested = await hereAutosuggest(text, key);
  if (suggested) return travelToCoords(suggested.lat, suggested.lng);

  return unknownTravel();
}

/** First HERE autosuggest hit for a partial venue name. */
export async function hereAutosuggest(
  query: string,
  key: string,
): Promise<{ lat: number; lng: number; title: string } | null> {
  try {
    const url =
      `https://autosuggest.search.hereapi.com/v1/autosuggest?q=${encodeURIComponent(query)}` +
      `&in=countryCode:ZAF&at=${ORIGIN.lat},${ORIGIN.lng}&limit=5&apiKey=${key}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      items?: { title?: string; position?: { lat: number; lng: number } }[];
    };
    const item = data.items?.find((i) => i.position);
    const pos = item?.position;
    if (!pos) return null;
    return { lat: pos.lat, lng: pos.lng, title: item?.title ?? query };
  } catch {
    return null;
  }
}

export interface VenueSuggestion {
  label: string;
  lat: number;
  lng: number;
  verified: boolean;
  source: "directory" | "here" | "nominatim";
}

/** Attribution shown wherever keyless OpenStreetMap results appear. */
export const NOMINATIM_ATTRIBUTION = "Search results © OpenStreetMap contributors";

/** HERE autosuggest mapped to suggestions (only called when a key is set). */
async function hereSuggest(
  text: string,
  limit: number,
  key: string,
): Promise<VenueSuggestion[]> {
  try {
    const url =
      `https://autosuggest.search.hereapi.com/v1/autosuggest?q=${encodeURIComponent(text)}` +
      `&in=countryCode:ZAF&at=${ORIGIN.lat},${ORIGIN.lng}&limit=${limit}&apiKey=${key}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = (await res.json()) as {
      items?: { title?: string; position?: { lat: number; lng: number } }[];
    };
    return (data.items ?? [])
      .filter((i) => i.position && i.title)
      .map<VenueSuggestion>((i) => ({
        label: i.title as string,
        lat: (i.position as { lat: number; lng: number }).lat,
        lng: (i.position as { lat: number; lng: number }).lng,
        verified: false,
        source: "here",
      }));
  } catch {
    return [];
  }
}

/**
 * Keyless geocoding via OpenStreetMap Nominatim — used only when no HERE key is
 * configured, so the type-ahead still responds. Nominatim is a free public
 * service with a fair-use policy: results are debounced by the caller and the
 * request carries a contact email, per their usage requirements.
 */
async function nominatimSuggest(text: string, limit: number): Promise<VenueSuggestion[]> {
  if (limit < 1) return [];
  try {
    const url =
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}` +
      `&format=jsonv2&limit=${limit}&countrycodes=za&accept-language=en` +
      `&email=${encodeURIComponent(site.email)}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return [];
    const data = (await res.json()) as { display_name?: string; lat?: string; lon?: string }[];
    return (data ?? [])
      .map((item) => ({
        label: item.display_name ?? "",
        lat: Number(item.lat),
        lng: Number(item.lon),
      }))
      .filter((i) => i.label.length > 0 && Number.isFinite(i.lat) && Number.isFinite(i.lng))
      .map<VenueSuggestion>((i) => ({
        label: i.label,
        lat: i.lat,
        lng: i.lng,
        verified: false,
        source: "nominatim",
      }));
  } catch {
    return [];
  }
}

/**
 * Suggestions for the type-ahead. Resolution order mirrors the rest of the
 * adapter: built-in directory → HERE (when a key is set) → keyless Nominatim.
 * Never invents a venue: an empty array simply means "no matches".
 */
export async function suggestVenues(
  query: string,
  limit = 5,
): Promise<VenueSuggestion[]> {
  const text = query.trim();
  if (text.length < 2) return [];

  const directory = searchDirectory(text, limit).map<VenueSuggestion>((m) => ({
    label: venueLabel(m.venue),
    lat: m.venue.lat,
    lng: m.venue.lng,
    verified: m.venue.verified,
    source: "directory",
  }));
  if (directory.length >= limit) return directory;

  const key = getHereApiKey();
  if (key) {
    const here = await hereSuggest(text, limit - directory.length, key);
    if (here.length > 0) return [...directory, ...here].slice(0, limit);
  }

  const osm = await nominatimSuggest(text, limit - directory.length);
  return [...directory, ...osm].slice(0, limit);
}