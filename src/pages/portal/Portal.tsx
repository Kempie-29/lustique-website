import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Chat } from "@/components/Chat";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { Button } from "@/components/primitives/Button";
import { useAuth } from "@/lib/auth/auth";
import { useBookings } from "@/hooks/useBookings";
import { fetchThreads, type Thread } from "@/lib/data/messages";
import { STATUS_FLOW, statusLabel } from "@/lib/data/bookings";
import { formatZar } from "@/lib/format";

export default function Portal() {
  const { user, role, profile, isAdmin, isArtist } = useAuth();
  const { requests, loading, error } = useBookings();
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchThreads()
      .then(setThreads)
      .catch(() => setThreads([]));
  }, [user]);

  // Studio accounts belong in the dashboard.
  if (isAdmin || isArtist) return <Navigate to="/dashboard" replace />;

  const request = requests[0] ?? null;

  if (error) return <p className="dash__error">{error}</p>;

  if (loading) {
    return (
      <section className="section">
        <div className="wrap--narrow">
          <p className="muted">Loading your portal…</p>
        </div>
      </section>
    );
  }

  if (!request) {
    return (
      <>
        <Seo title="Your portal" description="Your Lustique Co. booking portal." path="/portal" />
        <section className="section">
          <div className="wrap--narrow">
            <h1>Welcome{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}.</h1>
            <p className="muted">
              You don't have a booking on file yet. Build an estimate and we'll take it from there.
            </p>
            <div className="btn-row">
              <Button to="/quote" variant="primary">
                Build your estimate
              </Button>
            </div>
          </div>
        </section>
      </>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(request.status as (typeof STATUS_FLOW)[number]);

  return (
    <>
      <Seo title="Your portal" description="Your Lustique Co. booking portal." path="/portal" />
      <section className="section">
        <div className="wrap--narrow">
          <header className="portal__head">
            <p className="eyebrow">Your portal</p>
            <h1>Hello{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}.</h1>
            <p className="muted">
              Booking {request.reference} · <StatusPill status={request.status} />
            </p>
          </header>

          <div className="portal__panel">
            <h2>Your booking so far</h2>
            <ol className="timeline">
              {STATUS_FLOW.map((step, i) => (
                <li
                  key={step}
                  className={`timeline__step ${i <= currentIndex ? "is-done" : ""} ${
                    i === currentIndex ? "is-current" : ""
                  }`.trim()}
                >
                  <span className="timeline__dot" aria-hidden="true" />
                  <span className="timeline__label">{statusLabel(step)}</span>
                </li>
              ))}
            </ol>

            <dl className="dash__facts">
              <div>
                <dt>Date</dt>
                <dd>{request.wedding_date ?? "To be confirmed"}</dd>
              </div>
              <div>
                <dt>Venue</dt>
                <dd>{request.venue_name ?? request.venue_address ?? "To be confirmed"}</dd>
              </div>
              <div>
                <dt>Estimate</dt>
                <dd>{request.estimate_total != null ? formatZar(request.estimate_total) : "—"}</dd>
              </div>
              {request.booking_fee_amount != null ? (
                <div>
                  <dt>Booking fee</dt>
                  <dd>
                    {formatZar(request.booking_fee_amount)}
                    {request.booking_fee_percent ? ` (${request.booking_fee_percent}%)` : ""}
                  </dd>
                </div>
              ) : null}
            </dl>

            <p className="muted">
              Questions about a payment or your contract? Message your artist below, or email{" "}
              <a href="mailto:hello@lustiqueco.co.za">hello@lustiqueco.co.za</a>.
            </p>
          </div>

          <div className="portal__panel">
            <h2>Messages</h2>
            {threads.length > 0 && user && role ? (
              <Chat
                key={threads[0].id}
                threadId={threads[0].id}
                currentUserId={user.id}
                currentRole={role}
                emptyText="Your artist will say hello here."
              />
            ) : (
              <p className="muted">
                Your conversation will open here once your artist is assigned.{" "}
                <Link to="/contact">Get in touch</Link> in the meantime.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}