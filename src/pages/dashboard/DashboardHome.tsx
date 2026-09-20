import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { useAuth } from "@/lib/auth/auth";
import { useBookings } from "@/hooks/useBookings";
import { formatZar } from "@/lib/format";

export default function DashboardHome() {
  const { profile, isAdmin } = useAuth();
  const { requests, loading, error } = useBookings();

  const open = requests.filter(
    (r) => !["completed", "declined", "cancelled"].includes(r.status),
  );
  const pipeline = open.reduce((sum, r) => sum + (r.estimate_total ?? 0), 0);
  const awaiting = requests.filter((r) =>
    ["new", "reviewing", "availability_confirmed", "awaiting_fee"].includes(r.status),
  ).length;
  const confirmed = requests.filter((r) => ["confirmed", "assigned"].includes(r.status)).length;

  const first = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <>
      <Seo title="Dashboard" description="Owner and artist control panel." path="/dashboard" />

      <header className="dash__head">
        <h1>Good day, {first}.</h1>
        <p className="muted">
          {isAdmin
            ? "Everything from new requests to confirmed dates, in one place."
            : "Your assigned bookings, calendar and conversations."}
        </p>
      </header>

      {error ? <p className="dash__error">{error}</p> : null}

      <div className="dash__stats">
        <div className="dash__stat">
          <span className="dash__stat-label">Open requests</span>
          <strong>{loading ? "—" : open.length}</strong>
        </div>
        <div className="dash__stat">
          <span className="dash__stat-label">Awaiting action</span>
          <strong>{loading ? "—" : awaiting}</strong>
        </div>
        <div className="dash__stat">
          <span className="dash__stat-label">Confirmed</span>
          <strong>{loading ? "—" : confirmed}</strong>
        </div>
        <div className="dash__stat">
          <span className="dash__stat-label">Open pipeline</span>
          <strong>{loading ? "—" : formatZar(pipeline)}</strong>
        </div>
      </div>

      <section className="dash__panel">
        <div className="dash__panel-head">
          <h2>Recent requests</h2>
          <Link to="/dashboard/requests" className="dash__more">
            View all
          </Link>
        </div>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : requests.length === 0 ? (
          <p className="muted">No requests yet.</p>
        ) : (
          <ul className="dash__list">
            {requests.slice(0, 5).map((r) => (
              <li key={r.id} className="dash__list-row">
                <div>
                  <Link to="/dashboard/requests" className="dash__list-name">
                    {r.full_name ?? "Unnamed enquiry"}
                  </Link>
                  <span className="dash__list-meta">
                    {r.reference}
                    {r.wedding_date ? ` · ${r.wedding_date}` : ""}
                    {r.occasion ? ` · ${r.occasion}` : ""}
                  </span>
                </div>
                <StatusPill status={r.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}