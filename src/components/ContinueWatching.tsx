import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ContinueWatchingItem {
  id: string;
  anime_id: string;
  episode_id: string;
  progress_seconds: number;
  total_duration: number;
  anime: {
    title: string;
    thumbnail_url: string | null;
  };
  episode: {
    episode_number: number;
    title: string | null;
  };
}

export default function ContinueWatching() {
  const { user } = useAuth();
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadContinueWatching();
  }, [user]);

  const loadContinueWatching = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("watch_progress")
      .select(`
        id,
        anime_id,
        episode_id,
        progress_seconds,
        total_duration,
        anime:anime_id (title, thumbnail_url),
        episode:episode_id (episode_number, title)
      `)
      .eq("user_id", user.id)
      .eq("completed", false)
      .order("last_watched_at", { ascending: false })
      .limit(6);

    if (data && !error) {
      setItems(data as any);
    }
    setLoading(false);
  };

  if (!user || loading || items.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Continue Watching</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((item) => {
          const progress = (item.progress_seconds / item.total_duration) * 100;
          return (
            <Link key={item.id} to={`/anime/${item.anime_id}`}>
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                  {item.anime.thumbnail_url ? (
                    <img
                      src={item.anime.thumbnail_url}
                      alt={item.anime.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-muted-foreground">No Image</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80">
                    <Progress value={progress} className="h-1 mb-1" />
                    <p className="text-xs text-white">
                      EP {item.episode.episode_number}
                    </p>
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm truncate">{item.anime.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.episode.title || `Episode ${item.episode.episode_number}`}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
