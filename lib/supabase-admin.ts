import { createClient } from '@supabase/supabase-js'

// Bypasses row level security. Import only from server code (API routes), never from client components.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)
