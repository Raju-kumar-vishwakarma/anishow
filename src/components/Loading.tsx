import { Card, CardContent } from "@/components/ui/card"; // Assuming Card components are available
import { Play } from "lucide-react"; // Only used in the real component, but good to keep structure

// Define the number of skeleton cards to display (matching the limit of 8 in loadMovies)
const SKELETON_COUNT = 8; 

export default function MoviesSectionLoading() {
  const skeletons = Array(SKELETON_COUNT).fill(null);

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Skeleton for the Header/Title row */}
      <div className="flex items-center justify-between mb-6">
        {/* Animated placeholder for the 'Anime Movies' title */}
        <div className="h-8 w-40 bg-muted rounded-lg animate-pulse"></div>
        {/* Animated placeholder for the 'View All' link */}
        <div className="h-6 w-20 bg-muted rounded-lg animate-pulse"></div>
      </div>
      
      {/* Skeleton Grid for Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {skeletons.map((_, index) => (
          <Card key={index} className="rounded-lg border bg-card shadow-sm overflow-hidden">
            
            {/* Image Placeholder (aspect-[3/4] matches your movie card ratio) */}
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