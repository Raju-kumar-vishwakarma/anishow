-- Create featured_carousel table for manual carousel management
CREATE TABLE public.featured_carousel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anime_id UUID NOT NULL REFERENCES public.anime(id) ON DELETE CASCADE,
  is_featured BOOLEAN NOT NULL DEFAULT true,
  featured_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(anime_id)
);

-- Enable RLS
ALTER TABLE public.featured_carousel ENABLE ROW LEVEL SECURITY;

-- Everyone can view featured items
CREATE POLICY "Featured carousel items are viewable by everyone"
ON public.featured_carousel
FOR SELECT
USING (is_featured = true);

-- Only admins can manage featured carousel
CREATE POLICY "Only admins can manage featured carousel"
ON public.featured_carousel
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_featured_carousel_updated_at
BEFORE UPDATE ON public.featured_carousel
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Index for better performance
CREATE INDEX idx_featured_carousel_order ON public.featured_carousel(featured_order) WHERE is_featured = true;