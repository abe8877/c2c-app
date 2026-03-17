-- Add new columns to shops table
ALTER TABLE shops ADD COLUMN IF NOT EXISTS free_offers_remaining INT DEFAULT 3;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS preset_address TEXT;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS preset_menu TEXT;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS preset_request TEXT;

-- Update existing shops to have 3 free offers if they are NULL
UPDATE shops SET free_offers_remaining = 3 WHERE free_offers_remaining IS NULL;
