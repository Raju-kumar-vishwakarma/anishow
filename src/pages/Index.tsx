import Header from "@/components/Header";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import ContinueWatching from "@/components/ContinueWatching";
import MoviesSection from "@/components/MoviesSection";
import Footer from "@/components/Footer";
import LatastAnime from "@/components/LatastAnime";
import Hr from "../components/Hr";
import Aniserise from "@/components/AniSerise";
import { HeaderAd, GridAd, ResponsiveAd } from "@/components/AdPlacements";
import Snowfall from "react-snowfall";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";
import Seo from "@/components/Seo";

const Index = () => {
  useEffect(() => {
    trackPageView('/', 'AniShow - Home');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <Seo
        title="AniShow - Watch Anime in Hindi, English & Japanese"
        description="Stream and download your favorite anime on AniShow in multiple languages including Hindi, English, and Japanese."
        canonical="https://anishow.com/"
      />
      {/* Subtle Snowfall Effect */}
      {/* <Snowfall
        color="#fff"
        snowflakeCount={50}
        speed={[0.5, 1.0]}
        wind={[-0.5, 0.5]}
        radius={[0.5, 2.0]}
        style={{
          position: 'fixed',
          width: '100vw',
      height: '100vh',
          zIndex: 9999,
          pointerEvents: 'none'
        }}
      /> */}
      
      <Header />
      <main className="flex-1">
        {/* <HeaderAd className="my-4" /> */}
        <FeaturedCarousel />
        <ContinueWatching />
        <LatastAnime />
        <Hr />
        <GridAd className="my-8" />
        <Aniserise />
        <Hr />
        <MoviesSection />
        <ResponsiveAd className="my-8" />
      </main>
      <Footer />
    </div>
  );
}

export default Index



