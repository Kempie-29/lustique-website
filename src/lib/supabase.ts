/**
 * Supabase client.
 *
 * The app runs on the shared Lustique Supabase project. All new app data lives
 * in a dedicated `lux` schema (never the existing public tables) and is guarded
 * by row-level security, so only the *public anon key* is ever shipped to the
 * browser. The service-role key, Yoco and Brevo secrets stay server-side.
 *
 * Everything here degrades gracefully: with no env configured `getSupabase()`
 * returns null and callers fall back to their static/local behaviour, so the
 * public site and estimator work identically whether or not the backend exists.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env?.VITE_SUPABASE_URL?.trim();
const anonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY?.trim();

/** True when both public credentials are present. */
export const isSupabaseConfigured = Boolean(url && anonKey);

/** The dedicated schema all application data lives in. */
export const APP_SCHEMA = "lux";

/** Client bound to the `lux` schema; loose generics keep callers flexible. */
type AppClient = SupabaseClient<any, any, any, any, any>;

let client: AppClient | null = null;

/**
 * Returns the shared client, or null when the backend is not configured. Safe to
 * call anywhere; never throws.
 */
export function getSupabase(): AppClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      db: { schema: APP_SCHEMA },
    });
  }
  return client;
}