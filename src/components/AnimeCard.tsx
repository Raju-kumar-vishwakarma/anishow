import { Play, Download, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AnimeCardProps {
  title: string;
  image: string;
  rating: number;
  episodes: number;
  languages: string[];
}

const AnimeCard = ({ title, image, rating, episodes, languages }: AnimeCardProps) => {
  return (
    <Card className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-neon bg-card">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Badge className="bg-primary/90 text-primary-foreground border-0">
            <Star className="w-3 h-3 mr-1 fill-current" />
            {rating}
          </Badge>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex gap-2 mb-3">
            {languages.map((lang) => (
              <Badge key={lang} variant="secondary" className="text-xs bg-card/90">
                {lang}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
              <Play className="w-4 h-4 mr-1" />
              Watch
            </Button>
            <Button size="sm" variant="secondary" className="flex-1 bg-card/80 hover:bg-card">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{episodes} Episodes</p>
      </CardContent>
    </Card>
  );
};

export default AnimeCard;
