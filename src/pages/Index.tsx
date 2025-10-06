import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import ContinueWatching from "@/components/ContinueWatching";
import MoviesSection from "@/components/MoviesSection";
import Footer from "@/components/Footer";
import { Play, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Anime {
  id: string;
  title: string;
  thumbnail_url: string | null;
  rating: number | null;
  categories: { name: string } | null;
}

const Index = () => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnime();
  }, []);

  const loadAnime = async () => {
    const { data } = await supabase
      .from("anime")
      .select("id, title, thumbnail_url, rating, categories(name)")
      .order("created_at", { ascending: false })
      .limit(12);
    
    if (data) setAnimeList(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <Header />
      <main className="flex-1">
        <FeaturedCarousel />
        <ContinueWatching />
        
     
        
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8">Latest Anime</h2>
          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : animeList.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {animeList.map((anime) => (
                <Link key={anime.id} to={`/anime/${anime.id}`}>
                  <Card className="anime-card group overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                      {anime.thumbnail_url ? (
                        <>
                          <img
                            src={anime.thumbnail_url}
                            alt={anime.title}
                            className="anime-img w-full h-full object-cover"
                          />
                          <div className="anime-overlay" />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-muted-foreground">No Image</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm truncate">{anime.title}</h3>
                      {anime.categories && (
                        <p className="text-xs text-muted-foreground">{anime.categories.name}</p>
                      )}
                      {anime.rating && (
                        <p className="text-xs text-primary">★ {anime.rating}/10</p>
                      )}
                    </CardContent>
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <div className="bg-primary/90 rounded-full p-4">
                    <Play className="w-8 h-8 text-primary-foreground" />
                  </div>
                </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              No anime available yet. Admins can add content through the admin panel.
            </p>
          )}
        </section>
           <div className="">
            <hr className=" w-[80%] mx-auto"></hr>
            <MoviesSection />
            
           </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
