import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload as UploadIcon } from "lucide-react";

interface Anime {
  id: string;
  title: string;
}

export default function Upload() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [selectedAnime, setSelectedAnime] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [episodeDescription, setEpisodeDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
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
      loadAnime();
    }
  }, [isAdmin]);

  const loadAnime = async () => {
    const { data } = await supabase.from("anime").select("id, title").order("title");
    if (data) setAnimeList(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAnime || !episodeNumber) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select anime and episode number",
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
    setUploadProgress(25);

    try {
      let videoUrl = googleDriveUrl;
      let thumbnailUrl = null;

      // Upload thumbnail if provided
      if (thumbnailFile) {
        const thumbExt = thumbnailFile.name.split(".").pop();
        const thumbFileName = `${selectedAnime}/ep${episodeNumber}-thumb.${thumbExt}`;

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

      // Upload file if using file method
      if (uploadMethod === "file" && videoFile) {
        const fileExt = videoFile.name.split(".").pop();
        const fileName = `${selectedAnime}/${episodeNumber}.${fileExt}`;

        setUploadProgress(50);
        const { error: uploadError } = await supabase.storage
          .from("anime-videos")
          .upload(fileName, videoFile, { upsert: true });

        if (uploadError) throw uploadError;

        setUploadProgress(75);
        const { data: { publicUrl } } = supabase.storage
          .from("anime-videos")
          .getPublicUrl(fileName);

        videoUrl = publicUrl;
      } else {
        setUploadProgress(75);
      }

      const { error: dbError } = await supabase.from("anime_episodes").insert({
        anime_id: selectedAnime,
        episode_number: parseInt(episodeNumber),
        title: episodeTitle || null,
        description: episodeDescription || null,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
      });

      if (dbError) throw dbError;

      setUploadProgress(100);
      toast({
        title: "Success",
        description: "Episode uploaded successfully",
      });

      setSelectedAnime("");
      setEpisodeNumber("");
      setEpisodeTitle("");
      setEpisodeDescription("");
      setVideoFile(null);
      setThumbnailFile(null);
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
        <h1 className="text-4xl font-bold mb-8">Upload Episode</h1>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Upload Episode</CardTitle>
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
                <Label htmlFor="anime">Select Anime</Label>
                <Select value={selectedAnime} onValueChange={setSelectedAnime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose anime series" />
                  </SelectTrigger>
                  <SelectContent>
                    {animeList.map((anime) => (
                      <SelectItem key={anime.id} value={anime.id}>
                        {anime.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="episode">Episode Number</Label>
                <Input
                  id="episode"
                  type="number"
                  value={episodeNumber}
                  onChange={(e) => setEpisodeNumber(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Episode Title (Optional)</Label>
                <Input
                  id="title"
                  value={episodeTitle}
                  onChange={(e) => setEpisodeTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Episode Description (Optional)</Label>
                <Input
                  id="description"
                  value={episodeDescription}
                  onChange={(e) => setEpisodeDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Episode Thumbnail (Optional)</Label>
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
                  <Label htmlFor="video">Video File</Label>
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                  {videoFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="gdrive">Google Drive Share Link</Label>
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
                <UploadIcon className="mr-2 h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Episode"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
