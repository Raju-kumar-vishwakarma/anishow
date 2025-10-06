import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import About from "./pages/About";
import AnimeDetail from "./pages/AnimeDetail";
import Watchlist from "./pages/Watchlist";
import History from "./pages/History";
import Movies from "./pages/Movies";
import AdminDashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import AnimeManagement from "./pages/admin/Anime";
import Episodes from "./pages/admin/Episodes";
import Upload from "./pages/admin/Upload";
import CarouselManagement from "./pages/admin/Carousel";
import NotFound from "./pages/NotFound";
import ContactPage from "./pages/ContactPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/anime/:id" element={<AnimeDetail />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/history" element={<History />} />
          <Route path="/movies" element={<Movies />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/anime" element={<AnimeManagement />} />
            <Route path="/admin/episodes" element={<Episodes />} />
            <Route path="/admin/upload" element={<Upload />} />
            <Route path="/admin/carousel" element={<CarouselManagement />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
