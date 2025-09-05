import { Play } from 'lucide-react';
import { Video } from '@/lib/types';
import { tmdbClient } from '@/lib/tmdb';

interface TrailerCardProps {
  video: Video;
  movieTitle: string;
  onClick: () => void;
}

export function TrailerCard({ video, movieTitle, onClick }: TrailerCardProps) {
  return (
    <div className="flex-shrink-0 w-80">
      <div className="relative group cursor-pointer" onClick={onClick}>
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            <button
              className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground group-hover:scale-110 transition-transform z-10"
              data-testid={`button-play-trailer-${video.id}`}
            >
              <Play className="ml-1 w-6 h-6 fill-current" />
            </button>
            <img
              src={tmdbClient.getYouTubeThumbnailUrl(video.key)}
              alt={`${movieTitle} trailer`}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/320x180?text=No+Thumbnail';
              }}
            />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="font-semibold text-foreground">{video.name}</h3>
          <p className="text-sm text-muted-foreground">{movieTitle}</p>
        </div>
      </div>
    </div>
  );
}
