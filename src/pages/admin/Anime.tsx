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
import { Plus, Trash2, Edit, Upload as UploadIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EditAnimeDialog from "@/components/admin/EditAnimeDialog";

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
  categories: { name: string } | null;
}

export default function AnimeManagement() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [animeType, setAnimeType] = useState("series");
  const [rating, setRating] = useState("");
  const [status, setStatus] = useState("ongoing");
  const [releaseYear, setReleaseYear] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingAnime, setEditingAnime] = useState<Anime | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadCategories();
      loadAnime();
    }
  }, [isAdmin]);

  const loadCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data);
  };

  const loadAnime = async () => {
    const { data } = await supabase
      .from("anime")
      .select("*, categories(name)")
      .order("title");
    if (data) setAnimeList(data);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev => 
      prev.includes(catId) 
        ? prev.filter(id => id !== catId)
        : [...prev, catId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let thumbnailUrl = null;

      // Upload thumbnail if selected
      if (thumbnailFile) {
        const fileExt = thumbnailFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("anime-thumbnails")
          .upload(fileName, thumbnailFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("anime-thumbnails")
          .getPublicUrl(fileName);

        thumbnailUrl = publicUrl;
      }

      const { data, error } = await supabase.from("anime").insert({
        title,
        description: description || null,
        category_id: categoryId || null,
        type: animeType,
        rating: rating ? parseFloat(rating) : null,
        status,
        release_year: releaseYear ? parseInt(releaseYear) : null,
        thumbnail_url: thumbnailUrl,
      }).select();

      if (error) throw error;

      // Insert selected categories into anime_categories junction table
      if (data && selectedCategories.length > 0) {
        const animeId = data[0].id;
        const categoryInserts = selectedCategories.map(catId => ({
          anime_id: animeId,
          category_id: catId
        }));
        
        const { error: catError } = await supabase
          .from("anime_categories")
          .insert(categoryInserts);
        
        if (catError) throw catError;
      }

      toast({
        title: "Success",
        description: "Anime added successfully",
      });
      setTitle("");
      setDescription("");
      setCategoryId("");
      setSelectedCategories([]);
      setAnimeType("series");
      setRating("");
      setReleaseYear("");
      setThumbnailFile(null);
      loadAnime();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("anime").delete().eq("id", id);
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Anime deleted successfully",
      });
      loadAnime();
    }
  };

  const handleEdit = (anime: Anime) => {
    setEditingAnime(anime);
    setEditDialogOpen(true);
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
        <h1 className="text-4xl font-bold mb-8">Manage Anime</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Anime</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
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
                <div className="space-y-2">
                  <Label>Categories (Multiple Selection)</Label>
                  <div className="border rounded-md p-3 min-h-[100px] bg-background">
                    {selectedCategories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedCategories.map(catId => {
                          const cat = categories.find(c => c.id === catId);
                          return cat ? (
                            <Badge 
                              key={catId} 
                              className="bg-primary text-primary-foreground px-3 py-1 cursor-pointer hover:bg-primary/80"
                              onClick={() => toggleCategory(catId)}
                            >
                              {cat.name}
                              <X className="ml-1 h-3 w-3" />
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {categories.filter(cat => !selectedCategories.includes(cat.id)).map((cat) => (
                        <Badge 
                          key={cat.id}
                          variant="outline"
                          className="cursor-pointer hover:bg-secondary"
                          onClick={() => toggleCategory(cat.id)}
                        >
                          + {cat.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={animeType} onValueChange={setAnimeType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="series">Series</SelectItem>
                      <SelectItem value="movie">Movie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Release Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={releaseYear}
                      onChange={(e) => setReleaseYear(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                    />
                    <UploadIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {thumbnailFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {thumbnailFile.name}
                    </p>
                  )}
                </div>
                <Button type="submit" disabled={submitting}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Anime
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Anime List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {animeList.map((anime) => (
                  <div
                    key={anime.id}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    {anime.thumbnail_url && (
                      <img 
                        src={anime.thumbnail_url} 
                        alt={anime.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{anime.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {anime.categories?.name} • Rating: {anime.rating || "N/A"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(anime)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(anime.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {animeList.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No anime yet. Add one to get started!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <EditAnimeDialog
        anime={editingAnime}
        categories={categories}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={loadAnime}
      />
    </div>
  );
}
