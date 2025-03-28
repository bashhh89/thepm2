// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // In a real app, you might want more robust error handling or logging
  // For development, throwing an error is often sufficient.
  console.error('Supabase URL or Anon Key is missing from environment variables.');
  // Optionally throw error only if not in production
  // if (process.env.NODE_ENV !== 'production') {
  //  throw new Error('Supabase URL or Anon Key is missing from environment variables.');
  // }
}

// Create and export the Supabase client instance
// Note: Check if createClient needs specific generic types for your DB schema if using TS heavily later
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

console.log('Supabase client utility loaded.'); // Verify script loads