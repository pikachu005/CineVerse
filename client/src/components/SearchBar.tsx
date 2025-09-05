import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Link } from 'wouter';
import { useDebounce } from '@/hooks/useDebounce';
import { tmdbClient } from '@/lib/tmdb';
import { Movie } from '@/lib/types';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 800);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => tmdbClient.searchMovies(debouncedQuery),
    enabled: debouncedQuery.length >= 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedQuery.length >= 3 && searchResults) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [debouncedQuery, searchResults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleMovieClick = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="flex-1 max-w-2xl mx-8 relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search movies, shows, people..."
          value={query}
          onChange={handleInputChange}
          className="w-full px-4 py-2 pl-10 pr-4 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
          data-testid="input-search"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-xl search-dropdown max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-3 text-center text-muted-foreground">
              Searching...
            </div>
          ) : searchResults?.results.length ? (
            searchResults.results.slice(0, 8).map((movie: Movie) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                onClick={handleMovieClick}
                data-testid={`link-movie-${movie.id}`}
              >
                <div className="flex items-center p-3 hover:bg-muted cursor-pointer transition-colors">
                  <img
                    src={tmdbClient.getPosterUrl(movie.poster_path, 'w185')}
                    alt={movie.title}
                    className="w-12 h-16 object-cover rounded mr-3"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/92x138?text=No+Image';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{movie.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-3 text-center text-muted-foreground">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
