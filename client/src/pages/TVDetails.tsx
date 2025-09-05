import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Star, Play, Calendar, Clock, ArrowLeft, Tv } from 'lucide-react';
import { Link } from 'wouter';
import { tmdbClient } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function TVDetails() {
  const { id } = useParams<{ id: string }>();
  const tvId = parseInt(id || '0');

  const { data: show, isLoading: isLoadingShow } = useQuery({
    queryKey: ['tv', tvId],
    queryFn: () => tmdbClient.getTVDetails(tvId),
    enabled: !!tvId,
  });

  const { data: credits, isLoading: isLoadingCredits } = useQuery({
    queryKey: ['tv', tvId, 'credits'],
    queryFn: () => tmdbClient.getTVCredits(tvId),
    enabled: !!tvId,
  });

  const { data: videos } = useQuery({
    queryKey: ['tv', tvId, 'videos'],
    queryFn: () => tmdbClient.getTVVideos(tvId),
    enabled: !!tvId,
  });

  const { data: similarShows } = useQuery({
    queryKey: ['tv', tvId, 'similar'],
    queryFn: () => tmdbClient.getSimilarTV(tvId),
    enabled: !!tvId,
  });

  const trailer = videos?.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const creators = show?.created_by || [];

  const formatRuntime = (minutes: number[]) => {
    if (!minutes.length) return 'Unknown';
    const avgRuntime = Math.round(minutes.reduce((a, b) => a + b, 0) / minutes.length);
    return `~${avgRuntime}min per episode`;
  };

  if (isLoadingShow || isLoadingCredits) {
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

  if (!show) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">TV Show not found</h1>
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
      {/* TV Show Header */}
      <div className="relative h-96">
        <img
          src={tmdbClient.getBackdropUrl(show.backdrop_path)}
          alt={show.name}
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
              src={tmdbClient.getPosterUrl(show.poster_path, 'w500')}
              alt={show.name}
              className="w-48 h-72 object-cover rounded-lg shadow-xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/300x450?text=No+Image';
              }}
            />
            <div className="flex-1 text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{show.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-1 fill-current" />
                  <span>{show.vote_average.toFixed(1)}</span>
                </span>
                <span>{show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'Unknown'}</span>
                <span className="flex items-center">
                  <Tv className="w-4 h-4 mr-1" />
                  {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {show.genres.map((genre) => (
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

      {/* TV Show Details Content */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {show.overview || 'No overview available.'}
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

            {/* Creators Section */}
            {creators.length > 0 && (
              <>
                <h2 className="text-2xl font-bold mb-4">Creators</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {creators.map((creator) => (
                    <div key={creator.id} className="text-center">
                      <img
                        src={tmdbClient.getProfileUrl(creator.profile_path)}
                        alt={creator.name}
                        className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/200x200?text=No+Photo';
                        }}
                      />
                      <h4 className="font-medium text-sm">{creator.name}</h4>
                      <p className="text-xs text-muted-foreground">Creator</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Similar Shows */}
            {similarShows?.results.length ? (
              <>
                <h2 className="text-2xl font-bold mb-4">More Like This</h2>
                <div className="overflow-x-auto smooth-scroll">
                  <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
                    {similarShows.results.slice(0, 10).map((similarShow) => (
                      <div 
                        key={similarShow.id} 
                        className="w-48 flex-shrink-0 cursor-pointer"
                        onClick={() => window.location.href = `/tv/${similarShow.id}`}
                      >
                        <img
                          src={tmdbClient.getPosterUrl(similarShow.poster_path, 'w500')}
                          alt={similarShow.name}
                          className="w-full h-72 object-cover rounded-lg shadow-lg movie-card"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                          }}
                        />
                        <div className="mt-3">
                          <h3 className="font-semibold text-foreground truncate">{similarShow.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {similarShow.first_air_date ? new Date(similarShow.first_air_date).getFullYear() : 'Unknown'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Show Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">First Air Date:</span>
                    <span className="ml-2">
                      {show.first_air_date ? new Date(show.first_air_date).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                  {show.last_air_date && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Last Air Date:</span>
                      <span className="ml-2">
                        {new Date(show.last_air_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Episode Runtime:</span>
                    <span className="ml-2">{formatRuntime(show.episode_run_time)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Seasons:</span>
                    <span className="ml-2">{show.number_of_seasons}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Episodes:</span>
                    <span className="ml-2">{show.number_of_episodes}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-2">{show.status}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2">{show.type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Language:</span>
                    <span className="ml-2">{show.original_language.toUpperCase()}</span>
                  </div>
                  {show.networks.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Networks:</span>
                      <div className="mt-1">
                        {show.networks.map((network) => (
                          <span key={network.id} className="text-sm bg-muted px-2 py-1 rounded mr-1">
                            {network.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}