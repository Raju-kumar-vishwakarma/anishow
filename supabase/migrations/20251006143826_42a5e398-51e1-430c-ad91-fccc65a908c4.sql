-- Add type field to anime table to distinguish between series and movies
ALTER TABLE anime ADD COLUMN IF NOT EXISTS type text DEFAULT 'series' CHECK (type IN ('series', 'movie'));

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_anime_type ON anime(type);