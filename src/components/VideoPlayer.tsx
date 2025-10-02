import { Card } from "@/components/ui/card";
import { isGoogleDriveUrl, convertGoogleDriveUrl } from "@/lib/googleDrive";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const isGoogleDrive = isGoogleDriveUrl(videoUrl);
  const embedUrl = isGoogleDrive ? convertGoogleDriveUrl(videoUrl) : videoUrl;

  return (
    <Card className="overflow-hidden">
      {isGoogleDrive ? (
        <iframe
          src={embedUrl}
          className="w-full aspect-video bg-black"
          allow="autoplay"
          allowFullScreen
        />
      ) : (
        <video
          controls
          className="w-full aspect-video bg-black"
          src={embedUrl}
        >
          <source src={embedUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
    </Card>
  );
}
