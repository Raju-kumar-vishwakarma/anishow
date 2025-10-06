import Header from "@/components/Header";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import ContinueWatching from "@/components/ContinueWatching";
import MoviesSection from "@/components/MoviesSection";
import Footer from "@/components/Footer";
import LatastAnime from "@/components/LatastAnime";
import Hr from "./Hr";

import Aniserise from "@/components/AniSerise";

const Index = () => {
  return (

    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <Header />
      <main className="flex-1">
        <FeaturedCarousel />
        <ContinueWatching />
        <LatastAnime />
        <Hr />
        <Aniserise />
        <Hr />
         <MoviesSection />
      </main>
      <Footer />
    </div>
  );
}

export default Index



