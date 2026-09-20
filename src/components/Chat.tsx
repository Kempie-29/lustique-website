import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/primitives/Button";
import {
  fetchMessages,
  markThreadRead,
  sendMessage,
  subscribeToMessages,
  type ChatMessage,
} from "@/lib/data/messages";

interface ChatProps {
  threadId: string;
  currentUserId: string;
  currentRole: string;
  /** Label for the empty state. */
  emptyText?: string;
  className?: string;
}

function formatTime(value: string): string {
  return new Date(value).toLocaleString("en-ZA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Real-time thread. Live inserts arrive via Supabase Realtime. */
export function Chat({
  threadId,
  currentUserId,
  currentRole,
  emptyText = "No messages yet — say hello.",
  className = "",
}: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    setMessages([]);

    fetchMessages(threadId)
      .then((rows) => {
        if (active) setMessages(rows);
      })
      .catch(() => {
        /* surfaced as an empty thread */
      });

    const unsubscribe = subscribeToMessages(threadId, (msg) => {
      setMessages((prev) => (prev.some((p) => p.id === msg.id) ? prev : [...prev, msg]));
    });

    void markThreadRead(threadId, currentUserId);

    return () => {
      active = false;
      unsubscribe();
    };
  }, [threadId, currentUserId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const submit = async () => {
    const text = body.trim();
    if (!text) return;
    setBusy(true);
    setError(null);
    const result = await sendMessage(threadId, currentUserId, currentRole, text);
    setBusy(false);
    if (!result.ok) setError(result.error ?? "Could not send that message.");
    else setBody("");
  };

  return (
    <div className={`chat ${className}`.trim()}>
      <div className="chat__scroll">
        {messages.length === 0 ? (
          <p className="muted chat__empty">{emptyText}</p>
        ) : (
          messages.map((message) => {
            const mine = message.sender_id === currentUserId;
            return (
              <div key={message.id} className={`chat__row ${mine ? "is-mine" : ""}`}>
                <div className="chat__bubble">
                  <p>{message.body}</p>
                  <span className="chat__meta">
                    {message.sender_role ? `${message.sender_role} · ` : ""}
                    {formatTime(message.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      {error ? <p className="chat__error">{error}</p> : null}

      <form
        className="chat__compose"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={2}
          placeholder="Write a message…"
          aria-label="Message"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void submit();
            }
          }}
        />
        <Button type="submit" variant="primary" size="sm" disabled={busy || !body.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}