import AnimeCard from "./AnimeCard";
import anime1 from "@/assets/anime1.jpg";
import anime2 from "@/assets/anime2.jpg";
import anime3 from "@/assets/anime3.jpg";
import anime4 from "@/assets/anime4.jpg";
import anime5 from "@/assets/anime5.jpg";
import anime6 from "@/assets/anime6.jpg";

const animeList = [
  {
    id: 1,
    title: "Attack on Titan",
    image: anime1,
    rating: 9.0,
    episodes: 87,
    languages: ["Hindi", "Eng", "JP"],
  },
  {
    id: 2,
    title: "Jujutsu Kaisen",
    image: anime2,
    rating: 8.8,
    episodes: 47,
    languages: ["Hindi", "Eng", "JP"],
  },
  {
    id: 3,
    title: "Cyberpunk: Edgerunners",
    image: anime3,
    rating: 8.7,
    episodes: 10,
    languages: ["Eng", "JP"],
  },
  {
    id: 4,
    title: "My Hero Academia",
    image: anime4,
    rating: 8.5,
    episodes: 138,
    languages: ["Hindi", "Eng", "JP"],
  },
  {
    id: 5,
    title: "Your Name",
    image: anime5,
    rating: 9.1,
    episodes: 1,
    languages: ["Hindi", "Eng", "JP"],
  },
  {
    id: 6,
    title: "Death Note",
    image: anime6,
    rating: 9.0,
    episodes: 37,
    languages: ["Hindi", "Eng", "JP"],
  },
];

interface AnimeGridProps {
  title: string;
}

const AnimeGrid = ({ title }: AnimeGridProps) => {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-electric bg-clip-text text-transparent">
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {animeList.map((anime) => (
          <AnimeCard key={anime.id} {...anime} />
        ))}
      </div>
    </section>
  );
};

export default AnimeGrid;
