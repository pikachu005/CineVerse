import { Star, Play } from 'lucide-react';
import { Link } from 'wouter';
import { Movie } from '@/lib/types';
import { tmdbClient } from '@/lib/tmdb';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export function MovieCard({ movie, className = '' }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`} data-testid={`link-movie-${movie.id}`}>
      <div className={`movie-card cursor-pointer ${className}`}>
        <div className="w-48 flex-shrink-0">
          <div className="relative group">
            <img
              src={tmdbClient.getPosterUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              className="w-full h-72 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/500x750?text=No+Image';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center justify-between text-white">
                <span className="flex items-center text-sm">
                  <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </span>
                <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors backdrop-blur-sm">
                  <Play className="w-3 h-3 fill-current" />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-semibold text-foreground truncate">{movie.title}</h3>
            <p className="text-sm text-muted-foreground">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
