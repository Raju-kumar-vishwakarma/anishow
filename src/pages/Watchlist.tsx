import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Star, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WatchlistAnime {
  id: string;
  title: string;
  thumbnail_url: string | null;
  rating: number | null;
  watchlist_id: string;
}

export default function Watchlist() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [anime, setAnime] = useState<WatchlistAnime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWatchlist();
    }
  }, [user]);

  const loadWatchlist = async () => {
    try {
      const { data: watchlistData, error: watchlistError } = await supabase
        .from("watchlist")
        .select("id, anime_id")
        .eq("user_id", user?.id);

      if (watchlistError) throw watchlistError;

      if (watchlistData && watchlistData.length > 0) {
        const animeIds = watchlistData.map((item) => item.anime_id);
        
        const { data: animeData, error: animeError } = await supabase
          .from("anime")
          .select("id, title, thumbnail_url, rating")
          .in("id", animeIds);

        if (animeError) throw animeError;
        
        const combined = animeData?.map((anime) => ({
          ...anime,
          watchlist_id: watchlistData.find((w) => w.anime_id === anime.id)?.id || "",
        })) || [];
        
        setAnime(combined);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading watchlist",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (watchlistId: string, title: string) => {
    try {
      const { error } = await supabase
        .from("watchlist")
        .delete()
        .eq("id", watchlistId);

      if (error) throw error;

      setAnime(anime.filter((item) => item.watchlist_id !== watchlistId));
      toast({
        title: "Removed from watchlist",
        description: `${title} has been removed from your watchlist`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error removing from watchlist",
        description: error.message,
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-12 flex-1">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">My Watchlist</h1>
            <p className="text-muted-foreground">Please login to view your watchlist</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-12 flex-1">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary via-electric to-hotpink bg-clip-text text-transparent">
          My Watchlist
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : anime.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {anime.map((item) => (
              <Card key={item.id} className="anime-card group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 bg-card">
                <Link to={`/anime/${item.id}`}>
                  <div className="relative aspect-[2/3] overflow-hidden">
                    {item.thumbnail_url ? (
                      <>
                        <img 
                          src={item.thumbnail_url} 
                          alt={item.title}
                          className="anime-img object-cover w-full h-full"
                        />
                        <div className="anime-overlay" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No Image</span>
                      </div>
                    )}
                    {item.rating && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className="bg-primary/90 text-primary-foreground px-2 py-1 rounded-md flex items-center gap-1 text-sm">
                          <Star className="w-3 h-3 fill-current" />
                          {item.rating.toFixed(1)}
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Link to={`/anime/${item.id}`}>
                    <h3 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeFromWatchlist(item.watchlist_id, item.title)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              Your watchlist is empty. Start adding your favorite anime!
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
