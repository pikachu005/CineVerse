import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Star, Play, Calendar, Clock, DollarSign, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { tmdbClient } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id || '0');

  const { data: movie, isLoading: isLoadingMovie } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => tmdbClient.getMovieDetails(movieId),
    enabled: !!movieId,
  });

  const { data: credits, isLoading: isLoadingCredits } = useQuery({
    queryKey: ['movie', movieId, 'credits'],
    queryFn: () => tmdbClient.getMovieCredits(movieId),
    enabled: !!movieId,
  });

  const { data: videos } = useQuery({
    queryKey: ['movie', movieId, 'videos'],
    queryFn: () => tmdbClient.getMovieVideos(movieId),
    enabled: !!movieId,
  });

  const trailer = videos?.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const director = credits?.crew.find(c => c.job === 'Director');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoadingMovie || isLoadingCredits) {
    return (
      <div className="min-h-screen bg-background">
        <div className="relative h-96">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-8" />
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="text-center">
                    <Skeleton className="w-16 h-16 rounded-full mx-auto mb-2" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                    <Skeleton className="h-3 w-16 mx-auto mt-1" />
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Movie Header */}
      <div className="relative h-96">
        <img
          src={tmdbClient.getBackdropUrl(movie.backdrop_path)}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/1280x720?text=No+Image';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

        <Link href="/">
          <Button
            variant="outline"
            className="absolute top-4 left-4 bg-black/50 border-white/20 text-white hover:bg-black/70"
            data-testid="button-back-home"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>

        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-8">
            <img
              src={tmdbClient.getPosterUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              className="w-48 h-72 object-cover rounded-lg shadow-xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/300x450?text=No+Image';
              }}
            />
            <div className="flex-1 text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{movie.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-1 fill-current" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </span>
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span>{formatRuntime(movie.runtime)}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary" className="bg-primary/20 text-primary">
                    {genre.name}
                  </Badge>
                ))}
              </div>
              {trailer && (
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => window.open(tmdbClient.getYouTubeEmbedUrl(trailer.key), '_blank')}
                  data-testid="button-play-trailer"
                >
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  Play Trailer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Movie Details Content */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Storyline</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {movie.overview || 'No overview available.'}
            </p>

            {/* Cast Section */}
            <h2 className="text-2xl font-bold mb-4">Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {credits?.cast.slice(0, 8).map((actor) => (
                <div key={actor.id} className="text-center">
                  <img
                    src={tmdbClient.getProfileUrl(actor.profile_path)}
                    alt={actor.name}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/200x200?text=No+Photo';
                    }}
                  />
                  <h4 className="font-medium text-sm">{actor.name}</h4>
                  <p className="text-xs text-muted-foreground">{actor.character}</p>
                </div>
              ))}
            </div>

            {/* Crew Section */}
            <h2 className="text-2xl font-bold mb-4">Crew</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {credits?.crew
                .filter(c => ['Director', 'Writer', 'Producer', 'Executive Producer'].includes(c.job))
                .slice(0, 6)
                .map((crewMember) => (
                  <div key={`${crewMember.id}-${crewMember.job}`} className="text-center">
                    <img
                      src={tmdbClient.getProfileUrl(crewMember.profile_path)}
                      alt={crewMember.name}
                      className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/200x200?text=No+Photo';
                      }}
                    />
                    <h4 className="font-medium text-sm">{crewMember.name}</h4>
                    <p className="text-xs text-muted-foreground">{crewMember.job}</p>
                  </div>
                ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Movie Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Release Date:</span>
                    <span className="ml-2">
                      {new Date(movie.release_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Runtime:</span>
                    <span className="ml-2">{formatRuntime(movie.runtime)}</span>
                  </div>
                  {movie.budget > 0 && (
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="ml-2">{formatCurrency(movie.budget)}</span>
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="ml-2">{formatCurrency(movie.revenue)}</span>
                    </div>
                  )}
                  {director && (
                    <div>
                      <span className="text-muted-foreground">Director:</span>
                      <span className="ml-2">{director.name}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-2">{movie.status}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Language:</span>
                    <span className="ml-2">{movie.original_language.toUpperCase()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
