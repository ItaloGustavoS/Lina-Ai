import { createClient } from '@supabase/supabase-js';

// IMPORTANT: This client is for server-side use only, with admin privileges.
// It uses the Supabase service role key and bypasses RLS.
// Never expose this client or its key to the client-side.

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable: SUPABASE_URL");
}

if (!serviceKey) {
  throw new Error("Missing environment variable: SUPABASE_SERVICE_KEY");
}

export const supabaseAdmin = createClient(supabaseUrl, serviceKey);
