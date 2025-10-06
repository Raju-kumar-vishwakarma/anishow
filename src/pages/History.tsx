import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface HistoryItem {
  id: string;
  anime_id: string;
  episode_id: string;
  watched_at: string;
  watch_duration: number;
  anime: {
    title: string;
    thumbnail_url: string | null;
  };
  episode: {
    episode_number: number;
    title: string | null;
  };
}

export default function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "today" | "week" | "month">("all");

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user, filter]);

  const loadHistory = async () => {
    if (!user) return;

    let query = supabase
      .from("watch_history")
      .select(`
        id,
        anime_id,
        episode_id,
        watched_at,
        watch_duration,
        anime:anime_id (title, thumbnail_url),
        episode:episode_id (episode_number, title)
      `)
      .eq("user_id", user.id)
      .order("watched_at", { ascending: false });

    // Apply time filters
    const now = new Date();
    if (filter === "today") {
      const today = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      query = query.gte("watched_at", today);
    } else if (filter === "week") {
      const weekAgo = new Date(now.setDate(now.getDate() - 7)).toISOString();
      query = query.gte("watched_at", weekAgo);
    } else if (filter === "month") {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      query = query.gte("watched_at", monthAgo);
    }

    const { data, error } = await query;

    if (data && !error) {
      setHistory(data as any);
    }
    setLoading(false);
  };

  const clearHistory = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("watch_history")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to clear history");
    } else {
      toast.success("History cleared");
      setHistory([]);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-center">Please log in to view your watch history.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Watch History</h1>
          <Button variant="destructive" size="sm" onClick={clearHistory}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          {["all", "today", "week", "month"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f as any)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : history.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No watch history yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <Link key={item.id} to={`/anime/${item.anime_id}`}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex gap-4">
                    <div className="w-24 h-32 flex-shrink-0">
                      {item.anime.thumbnail_url ? (
                        <img
                          src={item.anime.thumbnail_url}
                          alt={item.anime.title}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{item.anime.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Episode {item.episode.episode_number}
                        {item.episode.title && ` - ${item.episode.title}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Watched {format(new Date(item.watched_at), "PPp")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
