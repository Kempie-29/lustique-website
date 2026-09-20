import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { Button } from "@/components/primitives/Button";
import { Field } from "@/components/primitives/Field";
import { useAuth } from "@/lib/auth/auth";
import { useBookings } from "@/hooks/useBookings";
import { formatZar } from "@/lib/format";
import {
  STATUS_LABELS,
  updateBookingNotes,
  updateBookingStatus,
  type BookingRequest,
} from "@/lib/data/bookings";
import { fetchProfilesByRole } from "@/lib/data/profiles";
import { createThreadForRequest } from "@/lib/data/messages";
import type { Profile } from "@/lib/auth/auth";

const STATUS_OPTIONS = Object.keys(STATUS_LABELS);

function Detail({ request, onSaved }: { request: BookingRequest; onSaved: () => Promise<void> }) {
  const { isAdmin } = useAuth();
  const [status, setStatus] = useState(request.status);
  const [artist, setArtist] = useState(request.assigned_artist_id ?? "");
  const [notes, setNotes] = useState(request.notes ?? "");
  const [artists, setArtists] = useState<Profile[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setStatus(request.status);
    setArtist(request.assigned_artist_id ?? "");
    setNotes(request.notes ?? "");
  }, [request]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchProfilesByRole("artist")
      .then(setArtists)
      .catch(() => setArtists([]));
  }, [isAdmin]);

  const save = async () => {
    setBusy(true);
    setNotice(null);
    const result = await updateBookingStatus(
      request.id,
      status,
      isAdmin ? artist || null : undefined,
    );
    if (result.ok && isAdmin && notes !== (request.notes ?? "")) {
          await updateBookingNotes(request.id, notes);
        }
        await onSaved();
        setBusy(false);
    setNotice(result.ok ? "Saved." : result.error ?? "Could not save.");
  };

  const openThread = async () => {
    setBusy(true);
    setNotice(null);
    const result = await createThreadForRequest({
      request_id: request.id,
      bride_user_id: request.user_id,
      artist_user_id: request.assigned_artist_id,
      subject: `Booking ${request.reference}`,
    });
    setBusy(false);
    setNotice(result.ok ? "Thread opened — see Messages." : result.error ?? "Could not open a thread.");
  };

  return (
    <div className="dash__detail">
      <h2>{request.full_name ?? "Unnamed enquiry"}</h2>
      <p className="dash__detail-ref">
        {request.reference} · <StatusPill status={request.status} />
      </p>

      <dl className="dash__facts">
        <div>
          <dt>Occasion</dt>
          <dd>{request.occasion ?? "—"}</dd>
        </div>
        <div>
          <dt>Wedding date</dt>
          <dd>{request.wedding_date ?? "—"}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{request.email ?? "—"}</dd>
        </div>
        <div>
          <dt>Mobile</dt>
          <dd>{request.mobile ?? "—"}</dd>
        </div>
        <div>
          <dt>Venue</dt>
          <dd>{request.venue_name ?? request.venue_address ?? "—"}</dd>
        </div>
        <div>
          <dt>Estimate</dt>
          <dd>{request.estimate_total != null ? formatZar(request.estimate_total) : "—"}</dd>
        </div>
      </dl>

      <div className="dash__form">
        <Field label="Status" htmlFor="status">
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </Field>

        {isAdmin ? (
          <Field label="Assigned artist" htmlFor="artist">
            <select id="artist" value={artist} onChange={(e) => setArtist(e.target.value)}>
              <option value="">Unassigned</option>
              {artists.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.full_name ?? a.email ?? a.id}
                </option>
              ))}
            </select>
          </Field>
        ) : null}

        <Field label="Internal notes" htmlFor="notes">
          <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>

        <div className="btn-row">
          <Button variant="primary" size="sm" onClick={() => void save()} disabled={busy}>
            Save
          </Button>
          {isAdmin ? (
            <Button variant="outline" size="sm" onClick={() => void openThread()} disabled={busy}>
              Open thread
            </Button>
          ) : null}
        </div>
        {notice ? <p className="dash__notice">{notice}</p> : null}
      </div>
    </div>
  );
}

export default function RequestsPage() {
  const { requests, loading, error, reload } = useBookings();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = requests.find((r) => r.id === selectedId) ?? requests[0] ?? null;

  return (
    <>
      <Seo title="Requests & bookings" description="Booking requests inbox." path="/dashboard/requests" />
      <header className="dash__head">
        <h1>Requests &amp; bookings</h1>
        <p className="muted">Every enquiry the estimator has produced, with its status and assignment.</p>
      </header>

      {error ? <p className="dash__error">{error}</p> : null}

      <div className="dash__split">
        <div className="dash__master">
          {loading ? (
            <p className="muted">Loading…</p>
          ) : requests.length === 0 ? (
            <p className="muted">No requests yet.</p>
          ) : (
            <ul className="dash__list dash__list--select">
              {requests.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    className={`dash__list-row ${selected?.id === r.id ? "is-selected" : ""}`.trim()}
                    onClick={() => setSelectedId(r.id)}
                  >
                    <span>
                      <span className="dash__list-name">{r.full_name ?? "Unnamed enquiry"}</span>
                      <span className="dash__list-meta">
                        {r.reference}
                        {r.wedding_date ? ` · ${r.wedding_date}` : ""}
                      </span>
                    </span>
                    <StatusPill status={r.status} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dash__aside">
          {selected ? (
                      <Detail key={selected.id} request={selected} onSaved={reload} />
                    ) : (
            <p className="muted">Select a request to see its detail.</p>
          )}
          <p className="dash__aside-foot">
            <Link to="/dashboard/messages">Go to messages →</Link>
          </p>
        </div>
      </div>
    </>
  );
}