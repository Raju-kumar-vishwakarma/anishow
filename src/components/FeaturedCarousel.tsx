import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
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
  categories: { name: string } | null;
}

export default function FeaturedCarousel() {
  const [featured, setFeatured] = useState<FeaturedAnime[]>([]);

  useEffect(() => {
    loadFeatured();
  }, []);

  const loadFeatured = async () => {
    // First try to load manually featured items
    const { data: featuredData } = await supabase
      .from("featured_carousel")
      .select("anime:anime_id(id, title, description, thumbnail_url, rating, categories(name))")
      .eq("is_featured", true)
      .order("featured_order", { ascending: true })
      .limit(5);

    if (featuredData && featuredData.length > 0) {
      const animeData = featuredData.map(item => item.anime).filter(Boolean) as FeaturedAnime[];
      setFeatured(animeData);
      return;
    }

    // Fallback to top-rated anime if no manual selection
    const { data } = await supabase
      .from("anime")
      .select("id, title, description, thumbnail_url, rating, categories(name)")
      .order("rating", { ascending: false, nullsFirst: false })
      .limit(5);
    
    if (data) setFeatured(data);
  };

  if (featured.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-8">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {featured.map((anime) => (
            <CarouselItem key={anime.id}>
              <Card className="relative overflow-hidden border-0 rounded-2xl aspect-[16/9] sm:aspect-[21/9] h-auto min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: anime.thumbnail_url 
                      ? `url(${anime.thumbnail_url})`
                      : 'linear-gradient(135deg, hsl(270 80% 65% / 0.2), hsl(200 90% 55% / 0.2))'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>
                
                <div className="relative h-full flex items-end p-8 md:p-12">
                  <div className="max-w-2xl space-y-4">
                    <div className="flex gap-2 flex-wrap">
                      <Badge className="bg-primary/20 text-primary border-primary/50">
                        Featured
                      </Badge>
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
                    
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                      {anime.title}
                    </h2>
                    
                    {anime.description && (
                      <p className="text-base md:text-lg text-muted-foreground line-clamp-3">
                        {anime.description}
                      </p>
                    )}
                    
                    <div className="flex gap-4">
                      <Button 
                        asChild
                        size="lg" 
                        className="bg-primary hover:bg-primary/90"
                        style={{ boxShadow: 'var(--shadow-neon)' }}
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
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </section>
  );
}
