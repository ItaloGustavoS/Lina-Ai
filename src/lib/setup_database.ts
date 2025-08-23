import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.argv[2];
const supabaseKey = process.argv[3];

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or service key');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  const { error: investmentsError } = await supabase.rpc('exec', {
    sql: `
      BEGIN;
      CREATE TABLE IF NOT EXISTS investments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id),
        ticker TEXT NOT NULL,
        quantity INT NOT NULL,
        purchase_price DECIMAL(10, 2) NOT NULL,
        purchase_date DATE NOT NULL,
        current_price DECIMAL(10, 2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes WHERE tablename = 'investments' AND indexname = 'investments_user_id_idx'
        ) THEN
          CREATE INDEX investments_user_id_idx ON investments(user_id);
        END IF;
      END
      $$;
      COMMIT;
    `,
  });

  if (investmentsError) {
    console.error('Error creating investments table:', investmentsError);
  } else {
    console.log('Investments table created successfully');
  }

  const { error: investmentHistoryError } = await supabase.rpc('exec', {
    sql: `
      BEGIN;
      CREATE TABLE IF NOT EXISTS investment_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        investment_id UUID REFERENCES investments(id),
        date DATE NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_investment_history_investment_id ON investment_history (investment_id);
      COMMIT;
    `,
  });

  if (investmentHistoryError) {
    console.error('Error creating investment_history table:', investmentHistoryError);
  } else {
    console.log('investment_history table created successfully');
  }
}

setupDatabase();
