import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Episode {
  id: string;
  anime_id: string;
  episode_number: number;
  title: string | null;
  description: string | null;
  video_url: string;
}

interface EditEpisodeDialogProps {
  episode: Episode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function EditEpisodeDialog({
  episode,
  open,
  onOpenChange,
  onSuccess,
}: EditEpisodeDialogProps) {
  const { toast } = useToast();
  const [episodeNumber, setEpisodeNumber] = useState(episode.episode_number);
  const [title, setTitle] = useState(episode.title || "");
  const [description, setDescription] = useState(episode.description || "");
  const [videoUrl, setVideoUrl] = useState(episode.video_url);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEpisodeNumber(episode.episode_number);
    setTitle(episode.title || "");
    setDescription(episode.description || "");
    setVideoUrl(episode.video_url);
  }, [episode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("anime_episodes")
      .update({
        episode_number: episodeNumber,
        title: title || null,
        description: description || null,
        video_url: videoUrl,
      })
      .eq("id", episode.id);

    setSaving(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Episode updated successfully",
      });
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Episode</DialogTitle>
          <DialogDescription>
            Update episode details and video information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="episode_number">Episode Number *</Label>
            <Input
              id="episode_number"
              type="number"
              min="1"
              value={episodeNumber}
              onChange={(e) => setEpisodeNumber(parseInt(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Episode Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., The Beginning"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Episode description..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video_url">Video URL *</Label>
            <Input
              id="video_url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              required
            />
            <p className="text-xs text-muted-foreground">
              Google Drive link or direct video URL
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
