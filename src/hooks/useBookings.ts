import { useCallback, useEffect, useState } from "react";
import { fetchBookingRequests, type BookingRequest } from "@/lib/data/bookings";

/** Loads booking requests (RLS scopes them to the signed-in user's role). */
export function useBookings() {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setRequests(await fetchBookingRequests());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { requests, loading, error, reload };
}