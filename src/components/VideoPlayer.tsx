import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isGoogleDriveUrl, convertGoogleDriveUrl } from "@/lib/googleDrive";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  episodeId?: string;
  animeId?: string;
  nextEpisodeId?: string;
  onNextEpisode?: () => void;
}

export default function VideoPlayer({ 
  videoUrl, 
  title, 
  episodeId, 
  animeId,
  nextEpisodeId,
  onNextEpisode 
}: VideoPlayerProps) {
  const isGoogleDrive = isGoogleDriveUrl(videoUrl);
  const embedUrl = isGoogleDrive ? convertGoogleDriveUrl(videoUrl) : videoUrl;
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showNextEpisode, setShowNextEpisode] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  // Save watch progress to database
  const saveProgress = async () => {
    if (!user || !episodeId || !animeId || !videoRef.current) return;

    const currentTime = Math.floor(videoRef.current.currentTime);
    const duration = Math.floor(videoRef.current.duration);
    const completed = currentTime / duration > 0.9;

    try {
      await supabase.from("watch_progress").upsert({
        user_id: user.id,
        anime_id: animeId,
        episode_id: episodeId,
        progress_seconds: currentTime,
        total_duration: duration,
        completed,
        last_watched_at: new Date().toISOString(),
      });

      // Also log to watch history
      await supabase.from("watch_history").insert({
        user_id: user.id,
        anime_id: animeId,
        episode_id: episodeId,
        watch_duration: currentTime,
      });
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  // Load saved progress
  useEffect(() => {
    const loadProgress = async () => {
      if (!user || !episodeId || !videoRef.current) return;

      const { data } = await supabase
        .from("watch_progress")
        .select("progress_seconds, completed")
        .eq("user_id", user.id)
        .eq("episode_id", episodeId)
        .single();

      if (data && !data.completed && data.progress_seconds > 10) {
        videoRef.current.currentTime = data.progress_seconds;
      }
    };

    loadProgress();
  }, [user, episodeId]);

  // Track progress every 10 seconds
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(saveProgress, 10000);
    }
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // Handle video end - show next episode countdown
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const timeRemaining = video.duration - video.currentTime;
      if (timeRemaining < 10 && timeRemaining > 0 && nextEpisodeId && !showNextEpisode) {
        setShowNextEpisode(true);
      }
      if (showNextEpisode) {
        setCountdown(Math.ceil(timeRemaining));
      }
    };

    const handleEnded = () => {
      saveProgress();
      if (nextEpisodeId && onNextEpisode) {
        onNextEpisode();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [showNextEpisode, nextEpisodeId, onNextEpisode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "arrowleft":
          videoRef.current.currentTime -= 5;
          break;
        case "arrowright":
          videoRef.current.currentTime += 5;
          break;
        case "arrowup":
          e.preventDefault();
          videoRef.current.volume = Math.min(1, videoRef.current.volume + 0.1);
          break;
        case "arrowdown":
          e.preventDefault();
          videoRef.current.volume = Math.max(0, videoRef.current.volume - 0.1);
          break;
        case "f":
          if (videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen();
          }
          break;
        case "m":
          toggleMute();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      saveProgress();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeSpeed = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <Card className="overflow-hidden relative">
      {isGoogleDrive ? (
        <iframe
          src={embedUrl}
          className="w-full aspect-video bg-black"
          allow="autoplay"
          allowFullScreen
        />
      ) : (
        <div className="relative group">
          <video
            ref={videoRef}
            className="w-full aspect-video bg-black"
            src={embedUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={embedUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Next Episode Countdown Overlay */}
          {showNextEpisode && nextEpisodeId && (
            <div className="absolute top-4 right-4 bg-background/90 backdrop-blur p-4 rounded-lg border">
              <p className="text-sm mb-2">Next episode in {countdown}s</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setShowNextEpisode(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={onNextEpisode}>
                  Play Now
                </Button>
              </div>
            </div>
          )}

          {/* Custom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    <Settings className="h-4 w-4 mr-2" />
                    {playbackSpeed}x
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                    <DropdownMenuItem key={speed} onClick={() => changeSpeed(speed)}>
                      {speed}x
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {nextEpisodeId && (
                <Button variant="ghost" size="icon" onClick={onNextEpisode}>
                  <SkipForward className="h-5 w-5" />
                </Button>
              )}

              <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
    </Card>
  );
}
