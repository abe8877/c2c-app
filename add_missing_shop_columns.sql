-- Add is_premium to shops
ALTER TABLE shops ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS client_tag TEXT;

-- Add columns to assets for submission and approval flow
ALTER TABLE assets ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS client_tag TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS offer_details JSONB;

-- Update assets to include client_tag from shops if possible (migration)
UPDATE assets 
SET client_tag = s.client_tag 
FROM shops s 
WHERE assets.shop_id = s.id 
AND assets.client_tag IS NULL;
