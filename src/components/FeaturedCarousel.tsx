import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";

interface FeaturedAnime {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  rating: number | null;
  status: string | null; // ✅ NEW FIELD
  categories: { name: string } | null;
}

export default function FeaturedCarousel() {
  const [featured, setFeatured] = useState<FeaturedAnime[]>([]);

  useEffect(() => {
    loadFeatured();
  }, []);

  const loadFeatured = async () => {
    // ✅ Now also selecting "status"
    const { data: featuredData } = await supabase
      .from("featured_carousel")
      .select("anime:anime_id(id, title, description, thumbnail_url, rating, status, categories(name))")
      .eq("is_featured", true)
      .order("featured_order", { ascending: true })
      .limit(5);

    if (featuredData && featuredData.length > 0) {
      const animeData = featuredData.map(item => item.anime).filter(Boolean) as FeaturedAnime[];
      setFeatured(animeData);
      return;
    }

    // Fallback: load top-rated anime with status
    const { data } = await supabase
      .from("anime")
      .select("id, title, description, thumbnail_url, rating, status, categories(name)")
      .order("rating", { ascending: false })
      .limit(5);

    if (data) setFeatured(data);
  };

  if (featured.length === 0) return null;

  return (
    <section className="w-full">
      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[Autoplay({ delay: 5000 })]}
        className="w-full"
      >
        <CarouselContent>
          {featured.map((anime) => (
            <CarouselItem key={anime.id}>
              <Card className="relative border-0 rounded-2xl h-auto min-h-[300px] sm:min-h-[450px] lg:min-h-[600px] flex mb-9">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: anime.thumbnail_url
                      ? `url(${anime.thumbnail_url})`
                      : 'linear-gradient(135deg, hsl(270 80% 65% / 0.2), hsl(200 90% 55% / 0.2))'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/0 to-background/70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>

                <div className="relative h-full flex items-end p-8 md:p-12 self-end">
                  <div className="max-w-2xl space-y-4">
                    {/* ✅ Status + Category + Rating Badges */}
                    <div className="flex gap-2 flex-wrap">
                      <Badge className="bg-primary/20 text-primary border-primary/50">
                        Featured
                      </Badge>

                      {anime.status && (
                        <Badge
                          className={`${
                            anime.status.toLowerCase() === "ongoing"
                              ? "bg-green-500/20 text-green-400 border-green-500/50"
                              : anime.status.toLowerCase() === "completed"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                          }`}
                        >
                          {anime.status}
                        </Badge>
                      )}

                      {anime.categories && (
                        <Badge className="bg-secondary/20 text-secondary border-secondary/50">
                          {anime.categories.name}
                        </Badge>
                      )}

                      {anime.rating && (
                        <Badge className="bg-accent/20 text-accent border-accent/50">
                          <Star className="w-3 h-3 mr-1" />
                          {anime.rating}
                        </Badge>
                      )}
                    </div>

                    <h2 className="text-2xl md:text-5xl font-bold leading-tight line-clamp-1">
                      {anime.title}
                    </h2>

                    {anime.description && (
                      <p className="text-base md:text-lg text-muted-foreground line-clamp-2">
                        {anime.description}
                      </p>
                    )}

                    <div className="flex gap-4">
                      <Button
                        asChild
                        size="lg"
                        className="bg-primary hover:bg-primary/90"
                        style={{ boxShadow: "var(--shadow-neon)" }}
                      >
                        <Link to={`/anime/${anime.id}`}>
                          <Play className="mr-2 h-5 w-5" />
                          Watch Now
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}