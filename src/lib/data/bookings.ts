import { lux } from "@/lib/supabase";

export interface BookingRequest {
  id: string;
  user_id: string | null;
  reference: string;
  status: string;
  occasion: string | null;
  full_name: string | null;
  email: string | null;
  mobile: string | null;
  wedding_date: string | null;
  venue_name: string | null;
  venue_address: string | null;
  estimate_total: number | null;
  booking_fee_percent: number | null;
  booking_fee_amount: number | null;
  assigned_artist_id: string | null;
  payload: Record<string, unknown>;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/** Human labels for the human-in-the-loop booking lifecycle. */
export const STATUS_LABELS: Record<string, string> = {
  new: "New request",
  reviewing: "In review",
  availability_confirmed: "Availability held",
  awaiting_fee: "Awaiting booking fee",
  fee_paid: "Booking fee paid",
  contract_signed: "Contract signed",
  confirmed: "Confirmed",
  assigned: "Artist assigned",
  completed: "Completed",
  declined: "Declined",
  cancelled: "Cancelled",
};

/** Ordered lifecycle used by the portal timeline. */
export const STATUS_FLOW = [
  "new",
  "reviewing",
  "availability_confirmed",
  "awaiting_fee",
  "fee_paid",
  "contract_signed",
  "confirmed",
  "assigned",
  "completed",
] as const;

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

export interface BookingInput {
  user_id?: string | null;
  occasion?: string | null;
  full_name?: string | null;
  email?: string | null;
  mobile?: string | null;
  wedding_date?: string | null;
  venue_name?: string | null;
  venue_address?: string | null;
  estimate_total?: number | null;
  payload?: Record<string, unknown>;
}

/**
 * RLS narrows this automatically: an admin sees every request, an artist sees
 * the ones assigned to them, a bride sees her own.
 */
export async function fetchBookingRequests(): Promise<BookingRequest[]> {
  const { data, error } = await lux()
    .from("booking_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as BookingRequest[]) ?? [];
}

export async function createBookingRequest(
  input: BookingInput,
): Promise<{ ok: boolean; reference?: string; error?: string }> {
  const { data, error } = await lux()
    .from("booking_requests")
    .insert(input)
    .select("reference")
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, reference: (data as { reference: string }).reference };
}

export async function updateBookingStatus(
  id: string,
  status: string,
  assignedArtistId?: string | null,
): Promise<{ ok: boolean; error?: string }> {
  const patch: Record<string, unknown> = { status };
  if (assignedArtistId !== undefined) patch.assigned_artist_id = assignedArtistId;
  const { error } = await lux().from("booking_requests").update(patch).eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function updateBookingNotes(
  id: string,
  notes: string,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await lux().from("booking_requests").update({ notes }).eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}