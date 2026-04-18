const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('assets').select(`
      id,
      status,
      shops:shop_id (id, name),
      creators:creator_id (id, name, avatar_url, followers)
  `).or('status.eq.OFFERED,status.eq.SUGGESTING_ALTERNATIVES,status.eq.WORKING,status.eq.COMPLETED,status.eq.APPROVED,status.eq.DELIVERED,status.eq.FINALIZED').limit(1);
  if (error) console.error("TEST ERROR:", error);
  else console.log("SUCCESS:", data);
}
test();
