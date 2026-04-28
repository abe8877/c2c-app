const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkColumns() {
  const { data, error } = await supabase.from('assets').select('*').limit(1);
  if (error) {
    console.error("Error fetching assets:", error);
    return;
  }
  if (data && data.length > 0) {
    console.log("Columns found in assets table:", Object.keys(data[0]));
  } else {
    console.log("No data in assets table to check columns.");
  }
}

checkColumns();
