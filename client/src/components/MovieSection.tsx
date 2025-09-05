import { ArrowRight } from 'lucide-react';
import { MovieCard } from './MovieCard';
import { Movie } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface MovieSectionProps {
  title: string;
  movies: Movie[] | undefined;
  isLoading: boolean;
  icon?: string;
  onViewAll?: () => void;
}

export function MovieSection({ title, movies, isLoading, icon, onViewAll }: MovieSectionProps) {
  if (isLoading) {
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {icon && <span className="mr-3 text-2xl">{icon}</span>}
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="overflow-x-auto smooth-scroll">
          <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="w-48 flex-shrink-0">
                <Skeleton className="w-full h-72 rounded-lg" />
                <Skeleton className="mt-3 h-4 w-32" />
                <Skeleton className="mt-1 h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!movies?.length) {
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center">
            {icon && <span className="mr-3">{icon}</span>}
            {title}
          </h2>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          No movies available
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center">
          {icon && <span className="mr-3">{icon}</span>}
          {title}
        </h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-primary hover:text-accent transition-colors font-medium flex items-center"
            data-testid="button-view-all"
          >
            View All <ArrowRight className="ml-1 w-4 h-4" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto smooth-scroll">
        <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}
