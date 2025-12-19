import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Play, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EditEpisodeDialog from "@/components/admin/EditEpisodeDialog";

interface Anime {
  id: string;
  title: string;
}

interface Episode {
  id: string;
  anime_id: string;
  episode_number: number;
  title: string | null;
  description: string | null;
  video_url: string;
  duration: number | null;
  created_at: string;
}

export default function Episodes() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [selectedAnimeId, setSelectedAnimeId] = useState<string>("");
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    loadAnimeList();
  }, []);

  useEffect(() => {
    if (selectedAnimeId) {
      loadEpisodes();
    } else {
      setEpisodes([]);
    }
  }, [selectedAnimeId]);

  const loadAnimeList = async () => {
    const { data } = await supabase
      .from("anime")
      .select("id, title")
      .order("title");

    if (data) setAnimeList(data);
  };

  const loadEpisodes = async () => {
    setLoadingEpisodes(true);
    const { data } = await supabase
      .from("anime_episodes")
      .select("*")
      .eq("anime_id", selectedAnimeId)
      .order("episode_number");

    if (data) setEpisodes(data);
    setLoadingEpisodes(false);
  };

  const handleEditEpisode = (episode: Episode) => {
    setEditingEpisode(episode);
    setIsEditDialogOpen(true);
  };

  const handleDeleteEpisode = async (episode: Episode) => {
    if (!confirm(`Are you sure you want to delete Episode ${episode.episode_number}?`)) return;

    const { error } = await supabase
      .from("anime_episodes")
      .delete()
      .eq("id", episode.id);

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
      loadEpisodes();
    }
  };

  const handlePreview = (episode: Episode) => {
    const anime = animeList.find(a => a.id === selectedAnimeId);
    if (anime) {
      navigate(`/anime/${anime.id}`);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-electric to-hotpink bg-clip-text text-transparent">
            Manage Episodes
          </h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Anime</CardTitle>
            <CardDescription>Choose an anime to view and manage its episodes</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedAnimeId} onValueChange={setSelectedAnimeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an anime..." />
              </SelectTrigger>
              <SelectContent>
                {animeList.map((anime) => (
                  <SelectItem key={anime.id} value={anime.id}>
                    {anime.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedAnimeId && (
          <Card>
            <CardHeader>
              <CardTitle>Episodes</CardTitle>
              <CardDescription>
                {episodes.length} episode{episodes.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingEpisodes ? (
                <div className="text-center py-8">Loading episodes...</div>
              ) : episodes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No episodes found. Upload episodes from the Upload page.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Ep #</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Video URL</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {episodes.map((episode) => (
                      <TableRow key={episode.id}>
                        <TableCell className="font-medium">
                          <Badge>{episode.episode_number}</Badge>
                        </TableCell>
                        <TableCell>
                          {episode.title || <span className="text-muted-foreground">No title</span>}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          <a 
                            href={episode.video_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm"
                          >
                            {episode.video_url}
                          </a>
                        </TableCell>
                        <TableCell>
                          {episode.duration ? `${Math.floor(episode.duration / 60)}m` : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handlePreview(episode)}
                              title="Preview"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditEpisode(episode)}
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDeleteEpisode(episode)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {editingEpisode && (
          <EditEpisodeDialog
            episode={editingEpisode}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSuccess={() => {
              loadEpisodes();
              setIsEditDialogOpen(false);
            }}
          />
        )}
      </main>
    </div>
  );
}
