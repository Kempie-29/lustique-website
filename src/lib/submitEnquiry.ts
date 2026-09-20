/**
 * Enquiry submission layer — a real, swappable adapter.
 *
 * - If VITE_ENQUIRY_ENDPOINT is set, the payload is POSTed there.
 * - Otherwise (dev mode) it is validated, logged, and persisted to localStorage.
 *
 * The same payload shape is used either way, so wiring a live endpoint later
 * requires no rework.
 */

import { isBeyondBridalOccasion, type DistanceBand, type Occasion } from "@/content/pricing";
import {
  placedHairTotal,
  type BrideInput,
  type EventInput,
  type PartyGroupInput,
  type FlowerGirlsUnder12Input,
  type EstimateLine,
} from "@/lib/pricing";

export interface EnquiryForm {
  occasion: Occasion;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  referral: string;
  weddingDate: string;
  venueName: string;
  venueAddress: string;
  distanceBand: DistanceBand | "";
  bride: BrideInput;
  bridesmaids: PartyGroupInput;
  mothers: PartyGroupInput;
  guests: PartyGroupInput;
  flowerGirlsUnder12: FlowerGirlsUnder12Input;
  flowerGirlsOver12: PartyGroupInput;
  extraArtists: 0 | 1 | 2;
  event: EventInput;
  lesson: { attendees: number };
    style: string;
    inspirationUrl: string;
    notes: string;
    consent: boolean;
    /** Whether the client chose to apply the active offer to their estimate. */
    promoToggle: boolean;
  }

export interface EnquiryPayload extends EnquiryForm {
  submittedAt: string;
  estimate: {
    subtotal: number;
    discount: number;
    total: number;
    heads: number;
    isDestination: boolean;
    lines: EstimateLine[];
  };
}

export type EnquiryErrors = Partial<Record<string, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function reconcileError(
  group: PartyGroupInput | FlowerGirlsUnder12Input,
  label: string,
): string | null {
  const placed = placedHairTotal(group.hairCounts);
    if (group.hair <= 0) return null;
    if (placed !== group.hair) {
      const remaining = group.hair - placed;
      if (remaining > 0) {
        return `Place the remaining ${remaining} ${label} hair look(s) by length.`;
      }
      return `You've placed ${Math.abs(remaining)} more ${label} looks than need hair.`;
    }
    return null;
  }

export function validateEnquiry(form: EnquiryForm): EnquiryErrors {
  const errors: EnquiryErrors = {};

  if (!form.firstName.trim()) errors.firstName = "Please tell us your first name.";
  if (!form.email.trim()) errors.email = "Please add an email address.";
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = "That email doesn't look right.";
  if (!form.mobile.trim()) errors.mobile = "Please add a mobile or WhatsApp number.";

  if (form.occasion === "wedding") {
      if (!form.weddingDate) errors.weddingDate = "Please choose your wedding date.";
      if (!form.venueName.trim() && !form.venueAddress.trim())
        errors.venue = "Please add your venue name or address.";
      if (!form.bride.makeup && !form.bride.hair)
        errors.brideServices = "Choose makeup, hair, or both for the bride.";
    }
  
    // Event and beyond-bridal occasions meet away from the studio by default, so
    // they need a venue; a group lesson does not.
    if (
      (form.occasion === "event" || isBeyondBridalOccasion(form.occasion)) &&
      form.event.location === "venue" &&
      !form.venueName.trim() &&
      !form.venueAddress.trim()
    ) {
      errors.venue = "Please add the venue name or address.";
    }

  const groupErrors: [keyof EnquiryErrors, PartyGroupInput | FlowerGirlsUnder12Input, string][] = [
    ["bridesmaidsHair", form.bridesmaids, "bridesmaid"],
    ["mothersHair", form.mothers, "mother"],
    ["guestsHair", form.guests, "guest"],
    ["flowerGirlsOver12Hair", form.flowerGirlsOver12, "flower girl"],
    ["flowerGirlsUnder12Hair", form.flowerGirlsUnder12, "flower girl"],
  ];
  for (const [key, group, label] of groupErrors) {
    const message = reconcileError(group, label);
    if (message) errors[key] = message;
  }

  if (!form.consent) errors.consent = "Please agree to the POPIA consent to continue.";

  return errors;
}

export interface SubmitResult {
  ok: boolean;
  message: string;
}

const STORAGE_KEY = "lustique:enquiries";

export function getEndpoint(): string | undefined {
  const value = import.meta.env?.VITE_ENQUIRY_ENDPOINT as string | undefined;
  return value && value.trim().length > 0 ? value : undefined;
}

export async function submitEnquiry(payload: EnquiryPayload): Promise<SubmitResult> {
  const endpoint = getEndpoint();

  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        return { ok: false, message: "We couldn't send your enquiry. Please try again or message us on WhatsApp." };
      }
      return { ok: true, message: "Your enquiry is with us." };
    } catch {
      return { ok: false, message: "We couldn't send your enquiry. Please try again or message us on WhatsApp." };
    }
  }

  // Dev mode.
  // eslint-disable-next-line no-console
  console.info("[Lustique] enquiry (dev mode):", payload);
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown[];
    existing.push(payload);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    /* storage unavailable — the console log above is still the record */
  }
  return { ok: true, message: "Your enquiry is with us." };
  }
  
  export interface VenueMatchLog {
    query: string;
    matched: boolean;
    source: "directory" | "here" | "band" | "none";
    at: string;
  }
  
  /**
   * Optional analytics hook for venue resolution. There is no backend yet, so
   * this is a no-op; wire it to `/api/venue-match-log` later with no other change.
   */
  export async function logVenueMatch(entry: VenueMatchLog): Promise<void> {
    void entry;
  }