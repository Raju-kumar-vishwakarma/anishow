import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Play, Star } from "lucide-react";

interface Movie {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  rating: number | null;
  release_year: number | null;
  status: string | null;
}

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movies);
    }
  }, [searchQuery, movies]);

  const loadMovies = async () => {
    const { data } = await supabase
      .from("anime")
      .select("*")
      .eq("type", "movie")
      .order("rating", { ascending: false, nullsFirst: false });
    
    if (data) {
      setMovies(data);
      setFilteredMovies(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Anime Movies</h1>
          <p className="text-muted-foreground mb-6">
            Discover amazing anime movies from various genres
          </p>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? "No movies found matching your search" : "No movies available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => (
              <Link key={movie.id} to={`/anime/${movie.id}`}>
                <Card className="anime-card group relative anime-card group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[2/3] relative overflow-hidden">
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
                    
                    {movie.rating && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge className="bg-primary/90 text-primary-foreground">
                          <Star className="w-3 h-3 mr-1" />
                          {movie.rating}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{movie.title}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Movie</span>
                      {movie.release_year && <span>{movie.release_year}</span>}
                    </div>
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <div className="bg-primary/90 rounded-full p-4">
                    <Play className="w-8 h-8 text-primary-foreground" />
                  </div>
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
