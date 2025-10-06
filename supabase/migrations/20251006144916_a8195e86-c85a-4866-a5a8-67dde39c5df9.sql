-- Create anime_categories junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS anime_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anime_id uuid NOT NULL REFERENCES anime(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(anime_id, category_id)
);

-- Enable RLS
ALTER TABLE anime_categories ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view anime categories
CREATE POLICY "Anime categories are viewable by everyone"
ON anime_categories FOR SELECT
USING (true);

-- Only admins can manage anime categories
CREATE POLICY "Only admins can manage anime categories"
ON anime_categories FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_anime_categories_anime_id ON anime_categories(anime_id);
CREATE INDEX IF NOT EXISTS idx_anime_categories_category_id ON anime_categories(category_id);