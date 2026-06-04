import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Kensho = {
  id: number
  title: string
  description: string | null
  company: string | null
  deadline: string | null
  line_url: string
  image_url: string | null
  created_at: string
  approved: boolean
  source_url: string | null
}
