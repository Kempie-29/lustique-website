import { useEffect, useRef, useState } from "react";
import { Field } from "@/components/primitives/Field";
import { Button } from "@/components/primitives/Button";
import { DISTANCE_BANDS, type DistanceBand } from "@/content/pricing";
import { formatZar } from "@/lib/format";
import {
  destinationIndicative,
  resolveDistance,
  suggestVenues,
  travelFromBand,
  type TravelEstimate,
  type VenueSuggestion,
} from "@/lib/distance";
import type { EnquiryErrors, EnquiryForm } from "@/lib/submitEnquiry";

interface VenueFieldProps {
  form: EnquiryForm;
  setField: <K extends keyof EnquiryForm>(key: K, value: EnquiryForm[K]) => void;
  travel: TravelEstimate;
  setTravel: (travel: TravelEstimate) => void;
  heads: number;
  errors: EnquiryErrors;
  hasKey: boolean;
  requireVenue: boolean;
}

/**
 * Venue entry with graceful degradation:
 * - type-ahead suggestions (verified directory hits first, then HERE);
 * - "find on map" resolves through directory → HERE → OSRM;
 * - with no HERE key, falls back to the manual distance bands.
 */
export function VenueField({
  form,
  setField,
  travel,
  setTravel,
  heads,
  errors,
  hasKey,
  requireVenue,
}: VenueFieldProps) {
  const [suggestions, setSuggestions] = useState<VenueSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = form.venueName.trim();
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    let active = true;
    const handle = window.setTimeout(async () => {
      const next = await suggestVenues(query, 5);
      if (active) {
        setSuggestions(next);
        setOpen(next.length > 0);
      }
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(handle);
    };
  }, [form.venueName]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const onFind = async () => {
    setBusy(true);
    const address = form.venueAddress.trim() || form.venueName.trim();
    const next = await resolveDistance(address);
    setTravel(next);
    setBusy(false);
  };

  const pickSuggestion = async (s: VenueSuggestion) => {
    setField("venueName", s.label);
    setOpen(false);
    setBusy(true);
    const next = await resolveDistance(s.label);
    setTravel(next);
    setBusy(false);
  };

  const onBandChange = (band: DistanceBand | "") => {
    setField("distanceBand", band);
    setTravel(travelFromBand(band === "" ? null : band));
  };

  const indicative =
    travel.status === "destination" && travel.oneWayKm != null
      ? destinationIndicative(travel.oneWayKm, heads)
      : null;

  return (
    <div ref={boxRef} className="venue-field">
      <div data-field="venue" className="venue-field__input">
        <Field
          label="Venue name or address"
          required={requireVenue}
          htmlFor="venueName"
          error={errors.venue}
          hint="Start typing — we'll suggest matching venues, or estimate travel from the distance bands."
        >
          <input
            id="venueName"
            type="text"
            autoComplete="off"
            value={form.venueName}
            aria-invalid={!!errors.venue}
            aria-expanded={open}
            aria-controls="venueSuggestions"
            onChange={(e) => setField("venueName", e.target.value)}
            onFocus={() => setOpen(suggestions.length > 0)}
          />
        </Field>
        {open ? (
          <ul id="venueSuggestions" className="venue-suggestions" role="listbox">
            {suggestions.map((s) => (
              <li key={`${s.label}-${s.lat}-${s.lng}`}>
                <button type="button" role="option" aria-selected="false" onClick={() => pickSuggestion(s)}>
                  <span>{s.label}</span>
                  <span className="venue-suggestions__tag">
                    {s.verified ? "Verified" : "Suggested"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <Field label="Venue address" htmlFor="venueAddress" hint="Street, suburb, city.">
        <input
          id="venueAddress"
          type="text"
          value={form.venueAddress}
          onChange={(e) => setField("venueAddress", e.target.value)}
        />
      </Field>

      <div className="btn-row" style={{ marginBottom: "1rem" }}>
        <Button variant="outline" size="sm" onClick={onFind} disabled={busy}>
          {busy ? "Finding…" : "Find travel to venue"}
        </Button>
      </div>

      {travel.status === "ok" && travel.confirmed && (
        <p className="field__hint">
          {travel.oneWayKm != null
            ? `≈ ${Math.round(travel.oneWayKm)} km one-way${
                travel.roundTripKm != null ? ` (${Math.round(travel.roundTripKm)} km round trip)` : ""
              } · `
            : ""}
          {travel.fee && travel.fee > 0 ? `travel ≈ ${formatZar(travel.fee)}` : "travel is included free"}
        </p>
      )}

      {travel.status === "destination" && (
        <div className="destination-panel" role="note">
          {indicative ? (
            <p>
              Indicative only: ≈ {formatZar(indicative.travelEstimate)} travel + from{" "}
              {formatZar(indicative.accommodationEstimate)} min. artist accommodation (
              {indicative.artists} {indicative.artists === 1 ? "artist" : "artists"} × 2 nights) — we
              confirm the exact total personally.
            </p>
          ) : (
            <p>
              That's a destination for us — we'll tailor the travel and accommodation with you rather
              than price it automatically.
            </p>
          )}
        </div>
      )}

      {travel.status === "unknown" && (
        <Field
          label="How far is the venue?"
          htmlFor="distanceBand"
          hint={
            hasKey
              ? "We couldn't resolve the address — choose a band and we'll confirm travel."
              : "Travel is confirmed with you before booking."
          }
        >
          <select
            id="distanceBand"
            value={form.distanceBand}
            onChange={(e) => onBandChange(e.target.value as DistanceBand | "")}
          >
            <option value="">Travel fee to be confirmed</option>
            {DISTANCE_BANDS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </Field>
      )}
    </div>
  );
}