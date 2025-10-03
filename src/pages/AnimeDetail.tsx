import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Anime {
  id: string;
  title: string;
  description: string | null;
  rating: number | null;
  status: string | null;
  categories: { name: string } | null;
}

interface Episode {
  id: string;
  episode_number: number;
  title: string | null;
  video_url: string;
}

export default function AnimeDetail() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadAnimeData();
    }
  }, [id]);

  const loadAnimeData = async () => {
    const { data: animeData } = await supabase
      .from("anime")
      .select("*, categories(name)")
      .eq("id", id)
      .single();

    const { data: episodesData } = await supabase
      .from("anime_episodes")
      .select("*")
      .eq("anime_id", id)
      .order("episode_number");

    if (animeData) setAnime(animeData);
    if (episodesData) {
      setEpisodes(episodesData);
      if (episodesData.length > 0) {
        setCurrentEpisode(episodesData[0]);
      }
    }
    setLoading(false);
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    if (!confirm("Are you sure you want to delete this episode?")) return;
    
    const { error } = await supabase
      .from("anime_episodes")
      .delete()
      .eq("id", episodeId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Episode deleted successfully",
      });
      
      // Reload episodes and set first episode if current was deleted
      await loadAnimeData();
      if (currentEpisode?.id === episodeId && episodes.length > 1) {
        setCurrentEpisode(episodes.find(ep => ep.id !== episodeId) || null);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">Anime not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {currentEpisode ? (
              <VideoPlayer
                videoUrl={currentEpisode.video_url}
                title={`Episode ${currentEpisode.episode_number}${
                  currentEpisode.title ? ": " + currentEpisode.title : ""
                }`}
              />
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No episodes available yet</p>
                </CardContent>
              </Card>
            )}

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{anime.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {anime.description && (
                  <p className="text-muted-foreground">{anime.description}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm">
                  {anime.categories && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
                      {anime.categories.name}
                    </span>
                  )}
                  {anime.rating && (
                    <span className="px-3 py-1 bg-secondary rounded-full">
                      Rating: {anime.rating}/10
                    </span>
                  )}
                  {anime.status && (
                    <span className="px-3 py-1 bg-secondary rounded-full capitalize">
                      {anime.status}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Episodes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {episodes.map((episode) => (
                    <div key={episode.id} className="flex gap-2">
                      <Button
                        variant={currentEpisode?.id === episode.id ? "default" : "outline"}
                        className="flex-1 justify-start"
                        onClick={() => setCurrentEpisode(episode)}
                      >
                        Episode {episode.episode_number}
                        {episode.title && <span className="ml-2 truncate">- {episode.title}</span>}
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteEpisode(episode.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {episodes.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No episodes available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
