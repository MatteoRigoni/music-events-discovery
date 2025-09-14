import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Event {
  id: number;
  created_at: string;
  title: string;
  date: string | null;
  time: string | null;
  duration: string | null;
  venue: string | null;
  price_range: string | null;
  capacity: number | null;
  organizer: string | null;
  description: string | null;
  rating: number | null;
  available: boolean | null;
  category: string | null;
  image: string | null;
}