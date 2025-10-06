import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, ListVideo, FolderTree, Clapperboard, PlaySquare, Film } from "lucide-react";

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
        
        {/* Series Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-primary">Series Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin/anime")}>
              <CardHeader>
                <ListVideo className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Manage Series</CardTitle>
                <CardDescription>Add, edit, and organize anime series</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Go to Series</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin/episodes")}>
              <CardHeader>
                <PlaySquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Manage Episodes</CardTitle>
                <CardDescription>Edit and organize anime episodes</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Go to Episodes</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin/upload")}>
              <CardHeader>
                <Upload className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Upload Episodes</CardTitle>
                <CardDescription>Upload anime episodes and thumbnails</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Go to Upload</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Movies Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-primary">Movies Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin/movies")}>
              <CardHeader>
                <ListVideo className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Manage Movies</CardTitle>
                <CardDescription>View and delete movies</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Go to Movies</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin/upload-movie")}>
              <CardHeader>
                <Film className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Upload Movies</CardTitle>
                <CardDescription>Upload movies with categories</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Go to Upload</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* General Settings Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-primary">General Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </div>
      </main>
    </div>
  );
}
