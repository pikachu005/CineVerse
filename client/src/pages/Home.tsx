import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Play, Info } from 'lucide-react';
import { Link } from 'wouter';
import { tmdbClient } from '@/lib/tmdb';
import { MovieSection } from '@/components/MovieSection';
import { TrailerCard } from '@/components/TrailerCard';
import { Movie, Video } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [selectedTrending, setSelectedTrending] = useState<'week' | 'day'>('week');
  const [selectedTrailer, setSelectedTrailer] = useState<{ video: Video; movieTitle: string } | null>(null);

  // Fetch different movie categories
  const { data: hollywoodMovies, isLoading: isLoadingHollywood } = useQuery({
    queryKey: ['movies', 'hollywood'],
    queryFn: () => tmdbClient.getPopularMoviesByRegion('US'),
  });

  const { data: bollywoodMovies, isLoading: isLoadingBollywood } = useQuery({
    queryKey: ['movies', 'bollywood'],
    queryFn: () => tmdbClient.getBollywoodMovies(),
  });

  const { data: tollywoodMovies, isLoading: isLoadingTollywood } = useQuery({
    queryKey: ['movies', 'tollywood'],
    queryFn: () => tmdbClient.getTollywoodMovies(),
  });

  const { data: trendingMovies, isLoading: isLoadingTrending } = useQuery({
    queryKey: ['movies', 'trending', selectedTrending],
    queryFn: () => tmdbClient.getTrendingMovies(selectedTrending),
  });

  // Fetch featured movie for hero section
  const { data: featuredMovie } = useQuery({
    queryKey: ['movies', 'featured'],
    queryFn: async () => {
      const popular = await tmdbClient.getPopularMovies();
      return popular.results[0];
    },
  });

  // Fetch popular trailers
  const { data: trailersData, isLoading: isLoadingTrailers } = useQuery({
    queryKey: ['trailers', 'popular'],
    queryFn: async () => {
      const popular = await tmdbClient.getPopularMovies();
      const trailersPromises = popular.results.slice(0, 6).map(async (movie: Movie) => {
        try {
          const videos = await tmdbClient.getMovieVideos(movie.id);
          const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
          return trailer ? { video: trailer, movieTitle: movie.title } : null;
        } catch {
          return null;
        }
      });
      const trailers = await Promise.all(trailersPromises);
      return trailers.filter(Boolean);
    },
  });

  const handleTrailerClick = (video: Video, movieTitle: string) => {
    setSelectedTrailer({ video, movieTitle });
  };

  const closeTrailer = () => {
    setSelectedTrailer(null);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient">
          {featuredMovie ? (
            <img
              src={tmdbClient.getBackdropUrl(featuredMovie.backdrop_path)}
              alt={featuredMovie.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/1280x720?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900"></div>
          )}
        </div>

        <div className="relative z-10 container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl">
            {featuredMovie ? (
              <>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
                  {featuredMovie.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed line-clamp-3">
                  {featuredMovie.overview}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={`/movie/${featuredMovie.id}`}>
                    <Button
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                      data-testid="button-hero-more-info"
                    >
                      <Info className="mr-2 h-4 w-4" />
                      More Info
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm font-semibold"
                    data-testid="button-hero-watch-trailer"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Watch Trailer
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Skeleton className="h-16 w-96 mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-3/4 mb-8" />
                <div className="flex flex-col sm:flex-row gap-4">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-12 w-40" />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Movie Sections */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <MovieSection
            title="Popular in Hollywood"
            movies={hollywoodMovies?.results}
            isLoading={isLoadingHollywood}
            icon="🇺🇸"
          />

          <MovieSection
            title="Popular in Bollywood"
            movies={bollywoodMovies?.results}
            isLoading={isLoadingBollywood}
            icon="🇮🇳"
          />

          <MovieSection
            title="Popular in Tollywood"
            movies={tollywoodMovies?.results}
            isLoading={isLoadingTollywood}
            icon="🎭"
          />

          {/* Trending Movies with Toggle */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold flex items-center">
                <span className="mr-3">🔥</span>
                Trending Movies
              </h2>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={selectedTrending === 'week' ? 'default' : 'outline'}
                  onClick={() => setSelectedTrending('week')}
                  data-testid="button-trending-week"
                >
                  This Week
                </Button>
                <Button
                  size="sm"
                  variant={selectedTrending === 'day' ? 'default' : 'outline'}
                  onClick={() => setSelectedTrending('day')}
                  data-testid="button-trending-day"
                >
                  Today
                </Button>
              </div>
            </div>

            {isLoadingTrending ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index}>
                    <Skeleton className="w-full h-64 md:h-72 rounded-lg" />
                    <Skeleton className="mt-3 h-4 w-24" />
                    <Skeleton className="mt-1 h-3 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {trendingMovies?.results.slice(0, 12).map((movie, index) => (
                  <Link key={movie.id} href={`/movie/${movie.id}`} data-testid={`link-trending-${movie.id}`}>
                    <div className="movie-card cursor-pointer">
                      <div className="relative group">
                        <img
                          src={tmdbClient.getPosterUrl(movie.poster_path, 'w500')}
                          alt={movie.title}
                          className="w-full h-64 md:h-72 object-cover rounded-lg shadow-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                          }}
                        />
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold">
                          #{index + 1}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="mt-3">
                        <h3 className="font-semibold text-foreground truncate">{movie.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Popular Trailers */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold flex items-center">
                <span className="mr-3">🎬</span>
                Popular Trailers
              </h2>
            </div>

            {isLoadingTrailers ? (
              <div className="overflow-x-auto smooth-scroll">
                <div className="flex space-x-6 pb-4" style={{ width: 'max-content' }}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex-shrink-0 w-80">
                      <Skeleton className="aspect-video rounded-lg" />
                      <Skeleton className="mt-3 h-4 w-32" />
                      <Skeleton className="mt-1 h-3 w-24" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto smooth-scroll">
                <div className="flex space-x-6 pb-4" style={{ width: 'max-content' }}>
                  {trailersData?.map((trailerData, index) => 
                    trailerData && (
                      <TrailerCard
                        key={index}
                        video={trailerData.video}
                        movieTitle={trailerData.movieTitle}
                        onClick={() => handleTrailerClick(trailerData.video, trailerData.movieTitle)}
                      />
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trailer Modal */}
      {selectedTrailer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full aspect-video bg-black rounded-lg overflow-hidden">
            <button
              onClick={closeTrailer}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              data-testid="button-close-trailer"
            >
              ✕
            </button>
            <iframe
              src={tmdbClient.getYouTubeEmbedUrl(selectedTrailer.video.key)}
              title={selectedTrailer.video.name}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      )}
    </main>
  );
}
