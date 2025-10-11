import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Play, Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  // 🔹 Load all movies on mount
  useEffect(() => {
    loadMovies();
  }, []);

  // 🔹 Filter when search changes
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

  // 🔹 Fetch anime movies from Supabase
  const loadMovies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("anime")
      .select("*")
      .eq("type", "movie")
      .order("rating", { ascending: false, nullsFirst: false });

    if (error) {
      console.error("Error fetching movies:", error.message);
    } else if (data) {
      setMovies(data);
      setFilteredMovies(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* 🔙 Back button */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="text-primary hover:bg-primary/10">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* 🔹 Title & Search */}
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

        {/* 🔹 Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery
                ? "No movies found matching your search."
                : "No movies available."}
            </p>
          </div>
        ) : (
          // 🔹 Movie Grid
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {filteredMovies.map((movie) => (
              <Link key={movie.id} to={`/movies/${movie.id}`}>
                <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                    {movie.thumbnail_url ? (
                      <>
                        <img
                          src={movie.thumbnail_url}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center">
                        <Play className="w-16 h-16 text-primary/50" />
                      </div>
                    )}

                    {movie.rating && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge className="bg-primary/90 text-primary-foreground flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {movie.rating}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-1">
                      {movie.title}
                    </h3>
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