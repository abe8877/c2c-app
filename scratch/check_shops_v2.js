const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkColumns() {
  const { data, error } = await supabase.from('shops').select('*').limit(1);
  if (error) {
    console.error("Error fetching shops:", error);
    return;
  }
  if (data && data.length > 0) {
    console.log("Columns found in shops table:", Object.keys(data[0]));
    console.log("First row notify_url:", data[0].notify_url);
    console.log("First row notification_email:", data[0].notification_email);
  } else {
    console.log("No data in shops table.");
  }
}

checkColumns();
