import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Anime {
  id: string;
  title: string;
  description: string | null;
  rating: number | null;
  status: string | null;
  category_id: string | null;
  release_year: number | null;
  thumbnail_url: string | null;
}

interface EditAnimeDialogProps {
  anime: Anime | null;
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function EditAnimeDialog({ anime, categories, open, onOpenChange, onSuccess }: EditAnimeDialogProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState(anime?.title || "");
  const [description, setDescription] = useState(anime?.description || "");
  const [categoryId, setCategoryId] = useState(anime?.category_id || "");
  const [rating, setRating] = useState(anime?.rating?.toString() || "");
  const [status, setStatus] = useState(anime?.status || "ongoing");
  const [releaseYear, setReleaseYear] = useState(anime?.release_year?.toString() || "");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(anime?.thumbnail_url || "");
  const [uploading, setUploading] = useState(false);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anime) return;
    
    setUploading(true);

    try {
      let thumbnailUrl = anime.thumbnail_url;

      // Upload new thumbnail if selected
      if (thumbnailFile) {
        const fileExt = thumbnailFile.name.split(".").pop();
        const fileName = `${anime.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("anime-thumbnails")
          .upload(fileName, thumbnailFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("anime-thumbnails")
          .getPublicUrl(fileName);

        thumbnailUrl = publicUrl;
      }

      const { error } = await supabase
        .from("anime")
        .update({
          title,
          description: description || null,
          category_id: categoryId || null,
          rating: rating ? parseFloat(rating) : null,
          status,
          release_year: releaseYear ? parseInt(releaseYear) : null,
          thumbnail_url: thumbnailUrl,
        })
        .eq("id", anime.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Anime updated successfully",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Anime</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-thumbnail">Thumbnail Image</Label>
            {thumbnailPreview && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail preview" 
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setThumbnailPreview("");
                    setThumbnailFile(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Input
                id="edit-thumbnail"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="flex-1"
              />
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-rating">Rating (0-10)</Label>
              <Input
                id="edit-rating"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-year">Release Year</Label>
              <Input
                id="edit-year"
                type="number"
                value={releaseYear}
                onChange={(e) => setReleaseYear(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
