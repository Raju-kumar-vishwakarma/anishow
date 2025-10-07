import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Star } from "lucide-react";
import PlayOverlay from "@/components/ui/PlayOverlay";

interface Movie {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  rating: number | null;
  release_year: number | null;
  categories: { name: string } | null;
}

// ======================================================================
// 1. MoviesSectionLoading Component (Move to src/components/MoviesSectionLoading.tsx)
// ======================================================================
const SKELETON_COUNT = 8; 

function MoviesSectionLoading() {
  const skeletons = Array(SKELETON_COUNT).fill(null);

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Skeleton for the Header/Title row */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-40 bg-muted rounded-lg animate-pulse"></div>
        <div className="h-6 w-20 bg-muted rounded-lg animate-pulse"></div>
      </div>
      
      {/* Skeleton Grid for Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {skeletons.map((_, index) => (
          <Card key={index} className="rounded-lg border bg-card shadow-sm overflow-hidden">
            {/* Image Placeholder */}
            <div className="aspect-[3/4] w-full bg-muted animate-pulse"></div>
            
            <CardContent className="p-4 space-y-2">
              {/* Title Placeholder */}
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
              {/* Metadata Placeholder */}
              <div className="h-3 w-1/2 bg-muted rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ======================================================================
// 2. MoviesSection Component
// ======================================================================
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
    
    if (data) setMovies(data as Movie[]);
    setLoading(false);
  };

  // Use the new Loading component while data is fetching
  if (loading) return <MoviesSectionLoading />;
  
  if (movies.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12 ">
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
              <div className="aspect-[3/4] relative overflow-hidden bg-muted">
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
                      <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
                      {movie.rating}
                    </Badge>
                  )}
                </div>

                <PlayOverlay />
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm truncate line-clamp-1">{movie.title}</h3>
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