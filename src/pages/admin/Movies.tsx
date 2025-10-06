import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Movie {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  release_year: number | null;
  rating: number | null;
  created_at: string;
}

export default function Movies() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadMovies();
    }
  }, [isAdmin]);

  const loadMovies = async () => {
    try {
      setLoadingMovies(true);
      const { data, error } = await supabase
        .from("anime")
        .select("*")
        .eq("type", "movie")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMovies(data || []);
    } catch (error: any) {
      toast.error("Failed to load movies: " + error.message);
    } finally {
      setLoadingMovies(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("anime").delete().eq("id", id);

      if (error) throw error;
      toast.success("Movie deleted successfully");
      loadMovies();
      setDeleteId(null);
    } catch (error: any) {
      toast.error("Failed to delete movie: " + error.message);
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-electric to-hotpink bg-clip-text text-transparent">
            Manage Movies
          </h1>
          <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Movies List</CardTitle>
            <CardDescription>View and delete movies</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingMovies ? (
              <div className="text-center py-8">Loading movies...</div>
            ) : movies.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No movies found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {movies.map((movie) => (
                  <Card key={movie.id} className="overflow-hidden">
                    {movie.thumbnail_url && (
                      <img
                        src={movie.thumbnail_url}
                        alt={movie.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">{movie.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {movie.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span>{movie.release_year}</span>
                        {movie.rating && <span>⭐ {movie.rating}</span>}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => setDeleteId(movie.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the movie and all its associated data. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
