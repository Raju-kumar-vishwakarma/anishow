import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, GripVertical, Plus, Trash2 } from "lucide-react";
import Header from "@/components/Header";

interface Anime {
  id: string;
  title: string;
  thumbnail_url: string | null;
  rating: number | null;
  categories: { name: string } | null;
}

interface FeaturedItem {
  id: string;
  anime_id: string;
  is_featured: boolean;
  featured_order: number;
  anime: Anime;
}

export default function CarouselManagement() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [availableAnime, setAvailableAnime] = useState<Anime[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      setIsAdmin(true);
      loadData();
    } else {
      navigate("/");
    }
  };

  const loadData = async () => {
    // Load featured items
    const { data: featured } = await supabase
      .from("featured_carousel")
      .select("id, anime_id, is_featured, featured_order, anime:anime_id(id, title, thumbnail_url, rating, categories(name))")
      .order("featured_order", { ascending: true });

    if (featured) {
      setFeaturedItems(featured as any);
    }

    // Load available anime (not in carousel)
    const featuredIds = featured?.map(f => f.anime_id) || [];
    const { data: anime } = await supabase
      .from("anime")
      .select("id, title, thumbnail_url, rating, categories(name)")
      .not("id", "in", `(${featuredIds.join(",") || "00000000-0000-0000-0000-000000000000"})`)
      .order("rating", { ascending: false, nullsFirst: false })
      .limit(20);

    if (anime) {
      setAvailableAnime(anime);
    }

    setLoading(false);
  };

  const addToCarousel = async (animeId: string) => {
    const maxOrder = Math.max(...featuredItems.map(f => f.featured_order), 0);
    const { error } = await supabase
      .from("featured_carousel")
      .insert({
        anime_id: animeId,
        is_featured: true,
        featured_order: maxOrder + 1,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add anime to carousel",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Anime added to carousel",
      });
      loadData();
    }
  };

  const removeFromCarousel = async (id: string) => {
    const { error } = await supabase
      .from("featured_carousel")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove anime from carousel",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Anime removed from carousel",
      });
      loadData();
    }
  };

  const toggleFeatured = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from("featured_carousel")
      .update({ is_featured: !currentValue })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      });
    } else {
      loadData();
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = featuredItems.findIndex(item => item.id === draggedItem);
    const targetIndex = featuredItems.findIndex(item => item.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newItems = [...featuredItems];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, removed);

    setFeaturedItems(newItems);
  };

  const handleDragEnd = async () => {
    if (!draggedItem) return;

    // Update all orders in database
    const updates = featuredItems.map((item, index) => ({
      id: item.id,
      featured_order: index + 1,
    }));

    for (const update of updates) {
      await supabase
        .from("featured_carousel")
        .update({ featured_order: update.featured_order })
        .eq("id", update.id);
    }

    setDraggedItem(null);
    toast({
      title: "Success",
      description: "Carousel order updated",
    });
  };

  if (!isAdmin || loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/admin")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Manage Featured Carousel</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured Items */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Featured Items ({featuredItems.length})</h2>
            <div className="space-y-4">
              {featuredItems.map((item) => (
                <Card
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                  onDragOver={(e) => handleDragOver(e, item.id)}
                  onDragEnd={handleDragEnd}
                  className="cursor-move hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      
                      {item.anime.thumbnail_url && (
                        <img
                          src={item.anime.thumbnail_url}
                          alt={item.anime.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{item.anime.title}</h3>
                        {item.anime.categories && (
                          <p className="text-sm text-muted-foreground">{item.anime.categories.name}</p>
                        )}
                        {item.anime.rating && (
                          <Badge variant="secondary" className="mt-1">★ {item.anime.rating}</Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs text-muted-foreground">Active</span>
                          <Switch
                            checked={item.is_featured}
                            onCheckedChange={() => toggleFeatured(item.id, item.is_featured)}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCarousel(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {featuredItems.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No featured items yet. Add anime from the available list.
                </p>
              )}
            </div>
          </div>

          {/* Available Anime */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Available Anime</h2>
            <div className="space-y-4">
              {availableAnime.map((anime) => (
                <Card key={anime.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {anime.thumbnail_url && (
                        <img
                          src={anime.thumbnail_url}
                          alt={anime.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{anime.title}</h3>
                        {anime.categories && (
                          <p className="text-sm text-muted-foreground">{anime.categories.name}</p>
                        )}
                        {anime.rating && (
                          <Badge variant="secondary" className="mt-1">★ {anime.rating}</Badge>
                        )}
                      </div>

                      <Button
                        size="icon"
                        onClick={() => addToCarousel(anime.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {availableAnime.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No more anime available to add.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
