import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Supabase client instance.
 * - Returns a valid `SupabaseClient` when `VITE_SUPABASE_URL` and
 *   `VITE_SUPABASE_ANON_KEY` environment variables are defined.
 * - Returns `null` when either variable is missing (e.g. during local
 *   development without a Supabase project configured). In that case the
 *   app falls back to `localStorage` for data persistence.
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
