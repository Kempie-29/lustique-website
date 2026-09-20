import { useEffect, useState } from "react";
import { Seo } from "@/components/Seo";
import { Chat } from "@/components/Chat";
import { useAuth } from "@/lib/auth/auth";
import { fetchThreads, type Thread } from "@/lib/data/messages";
import { supabase } from "@/lib/supabase";

function threadTitle(thread: Thread): string {
  return thread.subject ?? `Conversation ${thread.id.slice(0, 6)}`;
}

export default function MessagesPage() {
  const { user, role } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = () =>
      fetchThreads()
        .then((rows) => {
          if (!active) return;
          setThreads(rows);
          setSelectedId((current) => current ?? rows[0]?.id ?? null);
        })
        .catch(() => undefined)
        .finally(() => active && setLoading(false));

    void load();

    const channel = supabase
      .channel("lux-threads")
      .on("postgres_changes", { event: "*", schema: "lux", table: "threads" }, () => void load())
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  const selected = threads.find((t) => t.id === selectedId) ?? null;

  return (
    <>
      <Seo title="Messages" description="Every conversation." path="/dashboard/messages" />
      <header className="dash__head">
        <h1>Messages</h1>
        <p className="muted">
          {role === "admin"
            ? "Every thread across the studio — the owner can read all conversations."
            : "Your threads with brides."}
        </p>
      </header>

      <div className="dash__split">
        <div className="dash__master">
          {loading ? (
            <p className="muted">Loading…</p>
          ) : threads.length === 0 ? (
            <p className="muted">No conversations yet.</p>
          ) : (
            <ul className="dash__list dash__list--select">
              {threads.map((thread) => (
                <li key={thread.id}>
                  <button
                    type="button"
                    className={`dash__list-row ${selectedId === thread.id ? "is-selected" : ""}`.trim()}
                    onClick={() => setSelectedId(thread.id)}
                  >
                    <span>
                      <span className="dash__list-name">{threadTitle(thread)}</span>
                      <span className="dash__list-meta">
                        {new Date(thread.last_message_at).toLocaleDateString("en-ZA")}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dash__aside">
          {selected && user && role ? (
            <Chat
              key={selected.id}
              threadId={selected.id}
              currentUserId={user.id}
              currentRole={role}
            />
          ) : (
            <p className="muted">Select a conversation.</p>
          )}
        </div>
      </div>
    </>
  );
}