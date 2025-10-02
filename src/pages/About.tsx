import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-4xl bg-gradient-to-r from-primary via-electric to-hotpink bg-clip-text text-transparent">
              About AniShow
            </CardTitle>
            <CardDescription className="text-lg">
              Your ultimate destination for anime streaming
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                AniShow is dedicated to bringing the best anime content to fans worldwide. 
                We strive to provide a seamless streaming experience with high-quality videos, 
                multiple language options, and an extensive library of both classic and modern anime series.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-3">What We Offer</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Vast collection of anime across all genres</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>High-definition video streaming</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Multiple language audio tracks and subtitles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Regular updates with the latest episodes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>User-friendly interface for easy navigation</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-3">Join Our Community</h2>
              <p className="text-muted-foreground leading-relaxed">
                Become part of a growing community of anime enthusiasts. Create an account to 
                track your favorite series, rate episodes, and get personalized recommendations.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
