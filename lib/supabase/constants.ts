/**
 * ------------------------------------------------------------------------
 * Supabase fallback credentials
 * ------------------------------------------------------------------------
 * The v0 preview sandbox has no access to your environment variables,
 * which causes @supabase/auth-helpers-nextjs to throw an error.
 *
 * We therefore read the usual NEXT_PUBLIC_* env-vars and, if missing,
 * fall back to a public project that returns **no data** but satisfies
 * the client initialisation.  Replace these strings with your real
 * project details or set the env-vars in your local `.env.local`
 * or the Vercel project settings before deploying.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo-pub.supabase.co" // ← placeholder – safe to keep in preview

export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "demo-public-anon-key" // ← placeholder – safe to keep in preview
