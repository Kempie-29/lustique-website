/**
 * Single Supabase entry point for the app.
 *
 * The generated client lives in `src/integrations/supabase/client.ts`; app code
 * imports it from here so there is exactly one client instance. All new app data
 * lives in the dedicated `lux` schema (the existing `public` tables belong to the
 * live backend and are never written to), so we scope queries with `lux()`.
 */
import { supabase } from "@/integrations/supabase/client";

export { supabase };

/** The dedicated schema all application data lives in. */
export const APP_SCHEMA = "lux";

/** A client scoped to the `lux` schema — use for every app table. */
export function lux() {
  return supabase.schema(APP_SCHEMA);
}

export type { User, Session } from "@supabase/supabase-js";