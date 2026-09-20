/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HERE_API_KEY?: string;
  readonly VITE_ENQUIRY_ENDPOINT?: string;
  readonly VITE_GA_ID?: string;
  /** Public Supabase project URL (safe to ship — anon key only). */
  readonly VITE_SUPABASE_URL?: string;
  /** Public Supabase anon key. Server-only keys must NEVER be VITE_-prefixed. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}