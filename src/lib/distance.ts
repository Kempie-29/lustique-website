/**
 * Travel adapter. A Maps key is optional: without one we never invent a
 * distance or fee — we return an unconfirmed estimate and the UI shows
 * "to be confirmed" plus a manual distance-band fallback.
 *
 * Origin: Lustique Co. studio, La Montagne, Pretoria.
 */

import { PRICES, type DistanceBand } from "@/content/pricing";
import { site } from "@/content/site";

export type TravelStatus = "ok" | "unknown" | "destination";

export interface TravelEstimate {
  status: TravelStatus;
  oneWayKm: number | null;
  roundTripKm: number | null;
  /** Null means "to be confirmed" — never render it as a number. */
  fee: number | null;
  confirmed: boolean;
}

export const ORIGIN = { lat: site.coords.lat, lng: site.coords.lng };

export const TRAVEL_RULES = PRICES.travel;

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

/** Turn a one-way distance into a confirmed travel estimate. */
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
  const chargeable = Math.max(0, roundTripKm - TRAVEL_RULES.freeRoundTripKm);
  const fee = Math.round(chargeable * TRAVEL_RULES.perKm);

  return { status: "ok", oneWayKm, roundTripKm, fee, confirmed: true };
}

/** Convenience: distance from the studio to a lat/lng. */
export function travelFromLatLng(lat: number, lng: number): TravelEstimate {
  return computeTravel(haversineKm(ORIGIN, { lat, lng }));
}

/**
 * Manual fallback when an address cannot be resolved. Only the "200+" band is
 * decisive (destination); every other band stays unconfirmed so we never show a
 * guessed fee.
 */
export function travelFromBand(band: DistanceBand | null): TravelEstimate {
  if (band === "200+") {
    return {
      status: "destination",
      oneWayKm: null,
      roundTripKm: null,
      fee: null,
      confirmed: false,
    };
  }
  return unknownTravel();
}

export function getMapsApiKey(): string | undefined {
  const key = import.meta.env?.VITE_MAPS_API_KEY as string | undefined;
  return key && key.trim().length > 0 ? key : undefined;
}

export function hasMapsKey(): boolean {
  return getMapsApiKey() !== undefined;
}

/**
 * Resolve a free-text venue to a travel estimate. Returns an unconfirmed
 * estimate when no key is configured or the address cannot be geocoded.
 */
export async function resolveDistance(address: string): Promise<TravelEstimate> {
  const key = getMapsApiKey();
  if (!key || address.trim().length < 3) return unknownTravel();

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address,
    )}&region=za&key=${key}`;
    const res = await fetch(url);
    if (!res.ok) return unknownTravel();
    const data = (await res.json()) as {
      status: string;
      results?: { geometry?: { location?: { lat: number; lng: number } } }[];
    };
    const loc = data.results?.[0]?.geometry?.location;
    if (data.status !== "OK" || !loc) return unknownTravel();
    return travelFromLatLng(loc.lat, loc.lng);
  } catch {
    return unknownTravel();
  }
}