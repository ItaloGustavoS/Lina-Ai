const supabaseUrl = process.argv[2];
const supabaseKey = process.argv[3];

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or service key');
}

async function setupDatabase() {
  // No-op
}

setupDatabase();
