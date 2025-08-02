import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nfsdbmaodmsfviivsalh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mc2RibWFvZG1zZnZpaXZzYWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNjIzMDQsImV4cCI6MjA2OTczODMwNH0.18xUWlcum9Q92M5U6NBsjhHu2J3a2dnGZtk9J4IKnRA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
