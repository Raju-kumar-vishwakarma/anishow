import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, ListVideo, FolderTree, Clapperboard } from "lucide-react";

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary via-electric to-hotpink bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin/categories")}>
            <CardHeader>
              <FolderTree className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Manage Categories</CardTitle>
              <CardDescription>Create and organize anime categories</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Go to Categories</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin/anime")}>
            <CardHeader>
              <ListVideo className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Manage Anime</CardTitle>
              <CardDescription>Add, edit, and organize anime series</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Go to Anime</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin/carousel")}>
            <CardHeader>
              <Clapperboard className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Featured Carousel</CardTitle>
              <CardDescription>Manage homepage featured anime</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Go to Carousel</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin/upload")}>
            <CardHeader>
              <Upload className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Upload Videos</CardTitle>
              <CardDescription>Upload anime episodes and thumbnails</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Go to Upload</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
