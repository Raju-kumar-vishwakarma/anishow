import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import PlayOverlay from "@/components/ui/PlayOverlay";

interface Series {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  rating: number | null;
  release_year: number | null;
  status: string | null;
}

const Aniserise = () => {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadSeries();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSeries(seriesList);
    } else {
      const filtered = seriesList.filter((series) =>
        series.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSeries(filtered);
    }
  }, [searchQuery, seriesList]);

  const loadSeries = async () => {
    const { data } = await supabase
      .from("anime")
      .select("id, title, description, thumbnail_url, rating, release_year, status")
      .eq("type", "series")
      .order("rating", { ascending: false, nullsFirst: false });

    if (data) {
      setSeriesList(data);
      setFilteredSeries(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12">
         <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Anime Serise</h2>
        <Link 
          to="/series" 
          className="text-primary hover:text-primary/80 transition-colors"
        >
          View All 
        </Link>
      </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredSeries.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {filteredSeries.map((series) => (
              <Link key={series.id} to={`/anime/${series.id}`}>
                <Card className="anime-card group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                    {series.thumbnail_url ? (
                      <>
                        <img
                          src={series.thumbnail_url}
                          alt={series.title}
                          className="anime-img w-full h-full object-cover"
                        />
                        <div className="anime-overlay" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground">No Image</span>
                      </div>
                    )}
                      <PlayOverlay />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm truncate">{series.title}</h3>
                    {series.release_year && (
                      <p className="text-xs text-muted-foreground">{series.release_year}</p>
                    )}
                    {series.rating && (
                      <p className="text-xs text-primary">★ {series.rating}/10</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              {searchQuery ? "No series found matching your search." : "No series available yet."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Aniserise;
