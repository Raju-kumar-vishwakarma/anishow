import { Play, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroBanner from "@/assets/hero-banner.jpg";

const Hero = () => {
  return (
    <section className="relative h-[600px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBanner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
      
      <div className="container relative mx-auto px-4 h-full flex items-end pb-16">
        <div className="max-w-2xl space-y-6">
          <div className="flex gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/50">Featured</Badge>
            <Badge className="bg-electric/20 text-electric border-electric/50">Action</Badge>
            <Badge className="bg-hotpink/20 text-hotpink border-hotpink/50">Adventure</Badge>
          </div>
          
          <h2 className="text-5xl font-bold leading-tight">
            Demon Slayer: Kimetsu no Yaiba
          </h2>
          
          <p className="text-lg text-muted-foreground">
            Follow Tanjiro on his quest to turn his sister back into a human and defeat the demons that destroyed his family. Epic battles and stunning animation await.
          </p>
          
          <div className="flex gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-neon">
              <Play className="mr-2 h-5 w-5" />
              Watch Now
            </Button>
            <Button size="lg" variant="secondary" className="bg-card/80 hover:bg-card border border-border">
              <Download className="mr-2 h-5 w-5" />
              Download
            </Button>
          </div>
          
          <div className="flex gap-4 text-sm">
            <span className="px-3 py-1 rounded-full bg-muted">Hindi</span>
            <span className="px-3 py-1 rounded-full bg-muted">English</span>
            <span className="px-3 py-1 rounded-full bg-muted">Japanese</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
