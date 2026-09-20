import { lux, supabase } from "@/lib/supabase";

export interface Thread {
  id: string;
  request_id: string | null;
  bride_user_id: string | null;
  artist_user_id: string | null;
  subject: string | null;
  last_message_at: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  thread_id: string;
  sender_id: string | null;
  sender_role: string | null;
  body: string;
  read_at: string | null;
  created_at: string;
}

/** RLS narrows to threads the caller participates in (admin sees all). */
export async function fetchThreads(): Promise<Thread[]> {
  const { data, error } = await lux()
    .from("threads")
    .select("*")
    .order("last_message_at", { ascending: false });
  if (error) throw error;
  return (data as Thread[]) ?? [];
}

export async function fetchMessages(threadId: string): Promise<ChatMessage[]> {
  const { data, error } = await lux()
    .from("messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as ChatMessage[]) ?? [];
}

export async function sendMessage(
  threadId: string,
  senderId: string,
  senderRole: string,
  body: string,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await lux()
    .from("messages")
    .insert({ thread_id: threadId, sender_id: senderId, sender_role: senderRole, body });
  return error ? { ok: false, error: error.message } : { ok: true };
}

/** Live inserts for one thread. Returns an unsubscribe function. */
export function subscribeToMessages(
  threadId: string,
  onInsert: (message: ChatMessage) => void,
): () => void {
  const channel = supabase
    .channel(`lux-messages-${threadId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "lux", table: "messages", filter: `thread_id=eq.${threadId}` },
      (payload) => onInsert(payload.new as ChatMessage),
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

export async function createThreadForRequest(input: {
  request_id: string;
  bride_user_id: string | null;
  artist_user_id: string | null;
  subject: string | null;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  const { data, error } = await lux().from("threads").insert(input).select("id").single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, id: (data as { id: string }).id };
}

export async function markThreadRead(threadId: string, userId: string): Promise<void> {
  await lux()
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("thread_id", threadId)
    .is("read_at", null)
    .neq("sender_id", userId);
}