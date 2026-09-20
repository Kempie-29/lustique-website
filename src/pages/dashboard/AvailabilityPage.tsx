import { useCallback, useEffect, useState } from "react";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/primitives/Button";
import { Field } from "@/components/primitives/Field";
import { useAuth } from "@/lib/auth/auth";
import { lux } from "@/lib/supabase";

interface Block {
  id: string;
  artist_user_id: string;
  date: string;
  status: "open" | "hold" | "closed";
  note: string | null;
}

const STATUS_TEXT: Record<Block["status"], string> = {
  open: "Open",
  hold: "On hold",
  closed: "Closed",
};

export default function AvailabilityPage() {
  const { user, isAdmin } = useAuth();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<Block["status"]>("hold");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await lux()
      .from("availability_blocks")
      .select("*")
      .order("date", { ascending: true });
    setBlocks((data as Block[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    if (!date || !user) return;
    const { error } = await lux()
      .from("availability_blocks")
      .upsert(
        { artist_user_id: user.id, date, status, note: note || null },
        { onConflict: "artist_user_id,date" },
      );
    if (error) setMessage(error.message);
    else {
      setMessage("Availability saved.");
      setNote("");
      await load();
    }
  };

  const remove = async (id: string) => {
    await lux().from("availability_blocks").delete().eq("id", id);
    await load();
  };

  return (
    <>
      <Seo title="Calendar" description="Availability per date." path="/dashboard/availability" />
      <header className="dash__head">
        <h1>Calendar</h1>
        <p className="muted">
          Mark dates open, on hold or closed. The availability engine reads these before a
          booking can be confirmed.
        </p>
      </header>

      <div className="dash__panel">
        <div className="dash__form">
          <div className="dash__form-row">
            <Field label="Date" htmlFor="date">
              <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Availability" htmlFor="avail">
              <select
                id="avail"
                value={status}
                onChange={(e) => setStatus(e.target.value as Block["status"])}
              >
                <option value="open">Open</option>
                <option value="hold">On hold</option>
                <option value="closed">Closed</option>
              </select>
            </Field>
          </div>
          <Field label="Note" htmlFor="note">
            <input id="note" value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
          <Button variant="primary" size="sm" onClick={() => void save()} disabled={!date}>
            Save date
          </Button>
          {message ? <p className="dash__notice">{message}</p> : null}
        </div>
      </div>

      <section className="dash__panel">
        <div className="dash__panel-head">
          <h2>Marked dates</h2>
        </div>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : blocks.length === 0 ? (
          <p className="muted">No dates marked yet.</p>
        ) : (
          <ul className="dash__list">
            {blocks.map((block) => (
              <li key={block.id} className="dash__list-row">
                <span>
                  <span className="dash__list-name">{block.date}</span>
                  <span className="dash__list-meta">
                    {STATUS_TEXT[block.status]}
                    {block.note ? ` · ${block.note}` : ""}
                    {isAdmin ? ` · ${block.artist_user_id.slice(0, 8)}` : ""}
                  </span>
                </span>
                <button type="button" className="dash__more" onClick={() => void remove(block.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}