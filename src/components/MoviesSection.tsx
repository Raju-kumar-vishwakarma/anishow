import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Star } from "lucide-react";

interface Movie {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  rating: number | null;
  release_year: number | null;
  categories: { name: string } | null;
}

export default function MoviesSection() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    const { data } = await supabase
      .from("anime")
      .select("id, title, description, thumbnail_url, rating, release_year, categories(name)")
      .eq("type", "movie")
      .order("rating", { ascending: false, nullsFirst: false })
      .limit(8);
    
    if (data) setMovies(data);
    setLoading(false);
  };

  if (loading || movies.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Anime Movies</h2>
        <Link 
          to="/movies" 
          className="text-primary hover:text-primary/80 transition-colors"
        >
          View All →
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <Link key={movie.id} to={`/anime/${movie.id}`}>
            <Card className="rounded-lg border bg-card text-card-foreground shadow-sm anime-card group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-[3/4] relative overflow-hidden">
                {movie.thumbnail_url ? (
                  <>
                    <img 
                      src={movie.thumbnail_url} 
                      alt={movie.title}
                      className="anime-img w-full h-full object-cover"
                    />
                    <div className="anime-overlay" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-anime flex items-center justify-center">
                    <Play className="w-16 h-16 text-primary/50" />
                  </div>
                )}
                
                <div className="absolute top-3 right-3 flex gap-2 z-10">
                  {movie.rating && (
                    <Badge className="bg-primary/90 text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      {movie.rating}
                    </Badge>
                  )}
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <div className="bg-primary/90 rounded-full p-4">
                    <Play className="w-8 h-8 text-primary-foreground" />
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{movie.title}</h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{movie.categories?.name || "Movie"}</span>
                  {movie.release_year && <span>{movie.release_year}</span>}
                  
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

