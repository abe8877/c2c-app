-- supabase/create_messages_table.sql

-- 1. Create the messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID NOT NULL, -- or match_id depending on your schema. Assuming UUID.
  sender_id TEXT NOT NULL, -- UUID or string identifier for user/shop
  sender_type TEXT NOT NULL CHECK (sender_type IN ('shop', 'creator')),
  content_original TEXT NOT NULL,
  content_translated TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- (Adjust these policies based on your authentication setup. Below is a permissive example for the demo)
CREATE POLICY "Enable read access for all users" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON messages
  FOR INSERT WITH CHECK (true);

-- 4. Enable Realtime for the messages table
-- This is critical for the ChatModal to receive updates instantly
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE messages;
COMMIT;
