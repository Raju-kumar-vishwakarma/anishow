import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Film, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export default function UploadMovie() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [rating, setRating] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [googleDriveUrl, setGoogleDriveUrl] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"file" | "gdrive">("file");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadCategories();
    }
  }, [isAdmin]);

  const loadCategories = async () => {
    const { data } = await supabase.from("categories").select("id, name").order("name");
    if (data) setCategories(data);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!movieTitle) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter movie title",
      });
      return;
    }

    if (uploadMethod === "file" && !videoFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a video file",
      });
      return;
    }

    if (uploadMethod === "gdrive" && !googleDriveUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a Google Drive URL",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      let thumbnailUrl = null;
      let videoUrl = googleDriveUrl;

      // Upload thumbnail if provided
      if (thumbnailFile) {
        const thumbExt = thumbnailFile.name.split(".").pop();
        const thumbFileName = `movies/${movieTitle.toLowerCase().replace(/\s+/g, '-')}-thumb.${thumbExt}`;

        setUploadProgress(20);
        const { error: thumbError } = await supabase.storage
          .from("anime-thumbnails")
          .upload(thumbFileName, thumbnailFile, { upsert: true });

        if (thumbError) throw thumbError;

        const { data: { publicUrl: thumbUrl } } = supabase.storage
          .from("anime-thumbnails")
          .getPublicUrl(thumbFileName);

        thumbnailUrl = thumbUrl;
      }

      // Upload video file if using file method
      if (uploadMethod === "file" && videoFile) {
        const fileExt = videoFile.name.split(".").pop();
        const fileName = `movies/${movieTitle.toLowerCase().replace(/\s+/g, '-')}.${fileExt}`;

        setUploadProgress(40);
        const { error: uploadError } = await supabase.storage
          .from("anime-videos")
          .upload(fileName, videoFile, { upsert: true });

        if (uploadError) throw uploadError;

        setUploadProgress(60);
        const { data: { publicUrl } } = supabase.storage
          .from("anime-videos")
          .getPublicUrl(fileName);

        videoUrl = publicUrl;
      } else {
        setUploadProgress(60);
      }

      // Insert movie into anime table with type 'movie'
      setUploadProgress(70);
      const { data: movieData, error: dbError } = await supabase
        .from("anime")
        .insert({
          title: movieTitle,
          description: description || null,
          thumbnail_url: thumbnailUrl,
          type: "movie",
          release_year: releaseYear ? parseInt(releaseYear) : null,
          rating: rating ? parseFloat(rating) : null,
          status: "completed",
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Insert categories
      if (selectedCategories.length > 0 && movieData) {
        setUploadProgress(80);
        const categoryInserts = selectedCategories.map((categoryId) => ({
          anime_id: movieData.id,
          category_id: categoryId,
        }));

        const { error: catError } = await supabase
          .from("anime_categories")
          .insert(categoryInserts);

        if (catError) throw catError;
      }

      // Create a single episode entry for the movie
      setUploadProgress(90);
      const { error: episodeError } = await supabase.from("anime_episodes").insert({
        anime_id: movieData.id,
        episode_number: 1,
        title: movieTitle,
        description: description || null,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
      });

      if (episodeError) throw episodeError;

      setUploadProgress(100);
      toast({
        title: "Success",
        description: "Movie uploaded successfully",
      });

      // Reset form
      setMovieTitle("");
      setDescription("");
      setReleaseYear("");
      setRating("");
      setSelectedCategories([]);
      setThumbnailFile(null);
      setVideoFile(null);
      setGoogleDriveUrl("");
      setUploadProgress(0);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

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
        <h1 className="text-4xl font-bold mb-8">Upload Movie</h1>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="h-5 w-5" />
              Upload Movie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Method</Label>
                <Select value={uploadMethod} onValueChange={(v: "file" | "gdrive") => setUploadMethod(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="file">Upload File</SelectItem>
                    <SelectItem value="gdrive">Google Drive Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Movie Title *</Label>
                <Input
                  id="title"
                  value={movieTitle}
                  onChange={(e) => setMovieTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Release Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={releaseYear}
                    onChange={(e) => setReleaseYear(e.target.value)}
                    placeholder="2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (0-10)</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    placeholder="8.5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-2 p-4 border rounded-md min-h-[60px]">
                  {categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleCategory(category.id)}
                    >
                      {category.name}
                      {selectedCategories.includes(category.id) && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Movie Thumbnail</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                />
                {thumbnailFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {thumbnailFile.name}
                  </p>
                )}
              </div>

              {uploadMethod === "file" ? (
                <div className="space-y-2">
                  <Label htmlFor="video">Video File *</Label>
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                  />
                  {videoFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="gdrive">Google Drive Share Link *</Label>
                  <Input
                    id="gdrive"
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    value={googleDriveUrl}
                    onChange={(e) => setGoogleDriveUrl(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Paste the Google Drive share link or file ID
                  </p>
                </div>
              )}

              {uploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-center text-muted-foreground">
                    Uploading: {uploadProgress.toFixed(0)}%
                  </p>
                </div>
              )}

              <Button type="submit" disabled={uploading} className="w-full">
                <Film className="mr-2 h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Movie"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
