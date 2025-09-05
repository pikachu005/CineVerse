import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TypingAnimation } from '@/components/TypingAnimation';
import { MovieSection } from '@/components/MovieSection';
import { TrailerCard } from '@/components/TrailerCard';
import { tmdbClient } from '@/lib/tmdb';
import { Movie, TVShow, Video } from '@/lib/types';
import { Button } from '@/components/ui/button';
import heroImage from '@assets/CineVerseMain_1757064916734.png';

export default function Home() {
  const [selectedTrendingMovies, setSelectedTrendingMovies] = useState<'week' | 'day'>('week');
  const [selectedTrendingTV, setSelectedTrendingTV] = useState<'week' | 'day'>('week');
  const [selectedTrailer, setSelectedTrailer] = useState<{ video: Video; movieTitle: string } | null>(null);

  // Fetch different movie categories
  const { data: popularMovies, isLoading: isLoadingPopular } = useQuery({
    queryKey: ['movies', 'popular'],
    queryFn: () => tmdbClient.getPopularMovies(),
  });

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

  const { data: trendingMovies, isLoading: isLoadingTrendingMovies } = useQuery({
    queryKey: ['movies', 'trending', selectedTrendingMovies],
    queryFn: () => tmdbClient.getTrendingMovies(selectedTrendingMovies),
  });

  const { data: trendingTV, isLoading: isLoadingTrendingTV } = useQuery({
    queryKey: ['tv', 'trending', selectedTrendingTV],
    queryFn: () => tmdbClient.getTrendingTV(selectedTrendingTV),
  });

  const { data: popularTV, isLoading: isLoadingPopularTV } = useQuery({
    queryKey: ['tv', 'popular'],
    queryFn: () => tmdbClient.getPopularTV(),
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="CineVerse Cinema"
            className="w-full h-full object-cover object-center"
            style={{ filter: 'blur(1px)' }}
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl leading-tight"
              aria-label="Welcome to CineVerse – Your Gateway to the World of Cinema!"
            >
              <TypingAnimation 
                text="Welcome to CineVerse – Your Gateway to the World of Cinema!"
                className="inline-block"
              />
            </h1>
          </div>
        </div>
      </section>

      {/* Movie Discovery Sections */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Popular Movies */}
          <MovieSection
            title="Popular Movies"
            movies={popularMovies?.results}
            isLoading={isLoadingPopular}
            icon="⭐"
          />

          {/* Trending Content */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold flex items-center">
                <span className="mr-3">🔥</span>
                Trending Movies
              </h2>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={selectedTrendingMovies === 'week' ? 'default' : 'outline'}
                  onClick={() => setSelectedTrendingMovies('week')}
                  data-testid="button-trending-movies-week"
                >
                  This Week
                </Button>
                <Button
                  size="sm"
                  variant={selectedTrendingMovies === 'day' ? 'default' : 'outline'}
                  onClick={() => setSelectedTrendingMovies('day')}
                  data-testid="button-trending-movies-day"
                >
                  Today
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto smooth-scroll">
              <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
                {isLoadingTrendingMovies
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="w-48 flex-shrink-0">
                        <div className="w-full h-72 bg-muted rounded-lg animate-pulse"></div>
                        <div className="mt-3 h-4 bg-muted rounded animate-pulse"></div>
                        <div className="mt-1 h-3 bg-muted rounded animate-pulse w-16"></div>
                      </div>
                    ))
                  : trendingMovies?.results.slice(0, 10).map((movie, index) => (
                      <div key={movie.id} className="w-48 flex-shrink-0">
                        <div className="relative group cursor-pointer">
                          <img
                            src={tmdbClient.getPosterUrl(movie.poster_path, 'w500')}
                            alt={movie.title}
                            className="w-full h-72 object-cover rounded-lg shadow-lg movie-card"
                            onClick={() => window.location.href = `/movie/${movie.id}`}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                            }}
                          />
                          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold">
                            #{index + 1}
                          </div>
                        </div>
                        <div className="mt-3">
                          <h3 className="font-semibold text-foreground truncate">{movie.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}
                          </p>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>

          {/* Trending TV Shows */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold flex items-center">
                <span className="mr-3">📺</span>
                Trending TV Shows
              </h2>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={selectedTrendingTV === 'week' ? 'default' : 'outline'}
                  onClick={() => setSelectedTrendingTV('week')}
                  data-testid="button-trending-tv-week"
                >
                  This Week
                </Button>
                <Button
                  size="sm"
                  variant={selectedTrendingTV === 'day' ? 'default' : 'outline'}
                  onClick={() => setSelectedTrendingTV('day')}
                  data-testid="button-trending-tv-day"
                >
                  Today
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto smooth-scroll">
              <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
                {isLoadingTrendingTV
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="w-48 flex-shrink-0">
                        <div className="w-full h-72 bg-muted rounded-lg animate-pulse"></div>
                        <div className="mt-3 h-4 bg-muted rounded animate-pulse"></div>
                        <div className="mt-1 h-3 bg-muted rounded animate-pulse w-16"></div>
                      </div>
                    ))
                  : trendingTV?.results.slice(0, 10).map((show, index) => (
                      <div key={show.id} className="w-48 flex-shrink-0">
                        <div className="relative group cursor-pointer">
                          <img
                            src={tmdbClient.getPosterUrl(show.poster_path, 'w500')}
                            alt={show.name}
                            className="w-full h-72 object-cover rounded-lg shadow-lg movie-card"
                            onClick={() => window.location.href = `/tv/${show.id}`}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                            }}
                          />
                          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold">
                            #{index + 1}
                          </div>
                        </div>
                        <div className="mt-3">
                          <h3 className="font-semibold text-foreground truncate">{show.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'Unknown'}
                          </p>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>

          {/* Popular TV Shows */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
              <span className="mr-3">📺</span>
              Popular TV Shows & Web Series
            </h2>
            <div className="overflow-x-auto smooth-scroll">
              <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
                {isLoadingPopularTV
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="w-48 flex-shrink-0">
                        <div className="w-full h-72 bg-muted rounded-lg animate-pulse"></div>
                        <div className="mt-3 h-4 bg-muted rounded animate-pulse"></div>
                        <div className="mt-1 h-3 bg-muted rounded animate-pulse w-16"></div>
                      </div>
                    ))
                  : popularTV?.results.slice(0, 10).map((show) => (
                      <div key={show.id} className="w-48 flex-shrink-0">
                        <div className="relative group cursor-pointer">
                          <img
                            src={tmdbClient.getPosterUrl(show.poster_path, 'w500')}
                            alt={show.name}
                            className="w-full h-72 object-cover rounded-lg shadow-lg movie-card"
                            onClick={() => window.location.href = `/tv/${show.id}`}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="mt-3">
                          <h3 className="font-semibold text-foreground truncate">{show.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'Unknown'}
                          </p>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>

          {/* Regional Categories */}
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
                      <div className="aspect-video bg-muted rounded-lg animate-pulse"></div>
                      <div className="mt-3 h-4 bg-muted rounded animate-pulse w-32"></div>
                      <div className="mt-1 h-3 bg-muted rounded animate-pulse w-24"></div>
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