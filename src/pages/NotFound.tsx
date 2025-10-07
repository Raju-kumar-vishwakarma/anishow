import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, HelpCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[hsl(250,60%,12%)] to-[hsl(250,60%,6%)]">
      {/* Animated background dots */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto max-w-2xl text-center space-y-8">
          {/* Rotating dashed circle with question mark */}
          <div className="flex justify-center animate-fade-in">
            <div className="relative w-52 h-52">
              {/* Rotating dashed circle */}
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary animate-spin-slow" />
              
              {/* Solid circle with question mark in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center w-32 h-32 ">
                  <HelpCircle className="w-16 h-16 text-primary mb-1" strokeWidth={2.5} />
                  <span className="text-lg text-muted-foreground font-bold text-red-600">Lost</span>
                </div>
              </div>
            </div>
          </div>

          {/* 404 Text */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-8xl md:text-9xl font-black text-destructive tracking-tight">
              404
            </h1>
          </div>

          {/* Page Not Found text */}
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-wide">
              PAGE NOT FOUND!
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              The page you are looking for seems to have drifted off.
            </p>
          </div>

          {/* Go to Home button */}
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Link to="/">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary/50"
              >
                <Home className="mr-2 h-5 w-5" />
                Go to Home
              </Button>
            </Link>
          </div>

          {/* Error info */}
          <p className="text-sm text-muted-foreground/60 font-mono animate-fade-in" style={{ animationDelay: "0.5s" }}>
            Error: Route not found | Path: {location.pathname}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
