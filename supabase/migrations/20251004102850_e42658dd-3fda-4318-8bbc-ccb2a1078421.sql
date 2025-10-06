-- Create watch_progress table for tracking user viewing progress
CREATE TABLE public.watch_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  anime_id UUID NOT NULL REFERENCES public.anime(id) ON DELETE CASCADE,
  episode_id UUID NOT NULL REFERENCES public.anime_episodes(id) ON DELETE CASCADE,
  progress_seconds INTEGER NOT NULL DEFAULT 0,
  total_duration INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  last_watched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, episode_id)
);

-- Enable RLS
ALTER TABLE public.watch_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for watch_progress
CREATE POLICY "Users can view their own watch progress"
  ON public.watch_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watch progress"
  ON public.watch_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watch progress"
  ON public.watch_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watch progress"
  ON public.watch_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_watch_progress_user_id ON public.watch_progress(user_id);
CREATE INDEX idx_watch_progress_anime_id ON public.watch_progress(anime_id);
CREATE INDEX idx_watch_progress_last_watched ON public.watch_progress(last_watched_at DESC);

-- Create watch_history table for tracking viewing history
CREATE TABLE public.watch_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  anime_id UUID NOT NULL REFERENCES public.anime(id) ON DELETE CASCADE,
  episode_id UUID NOT NULL REFERENCES public.anime_episodes(id) ON DELETE CASCADE,
  watched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  watch_duration INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for watch_history
CREATE POLICY "Users can view their own watch history"
  ON public.watch_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watch history"
  ON public.watch_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watch history"
  ON public.watch_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_watch_history_user_id ON public.watch_history(user_id);
CREATE INDEX idx_watch_history_watched_at ON public.watch_history(watched_at DESC);

-- Add trigger for updating watch_progress updated_at
CREATE TRIGGER update_watch_progress_updated_at
  BEFORE UPDATE ON public.watch_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();