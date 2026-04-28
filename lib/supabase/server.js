import { createServerClient } from '@supabase/ssr';
import { createClient as createPublicClientRaw } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Creates a standard client with cookie support. 
 * DO NOT use this inside unstable_cache.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have a proxy refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Creates a public client that DOES NOT use cookies.
 * Safe for use inside unstable_cache.
 */
export function createPublicClient() {
  return createPublicClientRaw(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
