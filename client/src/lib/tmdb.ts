import { Movie, MovieDetails, TVShow, TVShowDetails, Credits, Videos, TMDbResponse, MultiSearchResult } from './types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '2f0c4d355398a7cb7b60f0ffdb48222e';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const tmdbClient = {
  // Movie discovery endpoints
  async getPopularMovies(page = 1): Promise<TMDbResponse<Movie>> {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch popular movies');
    return response.json();
  },

  async getPopularMoviesByRegion(region: string, page = 1): Promise<TMDbResponse<Movie>> {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&region=${region}&with_origin_country=${region}&page=${page}&sort_by=popularity.desc`);
    if (!response.ok) throw new Error(`Failed to fetch popular movies for region ${region}`);
    return response.json();
  },

  async getBollywoodMovies(page = 1): Promise<TMDbResponse<Movie>> {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_origin_country=IN&with_original_language=hi&page=${page}&sort_by=popularity.desc`);
    if (!response.ok) throw new Error('Failed to fetch Bollywood movies');
    return response.json();
  },

  async getTollywoodMovies(page = 1): Promise<TMDbResponse<Movie>> {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_origin_country=IN&with_original_language=te|ta&page=${page}&sort_by=popularity.desc`);
    if (!response.ok) throw new Error('Failed to fetch Tollywood movies');
    return response.json();
  },

  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week', page = 1): Promise<TMDbResponse<Movie>> {
    const response = await fetch(`${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}&page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch trending movies');
    return response.json();
  },

  // Search endpoints
  async searchMovies(query: string, page = 1): Promise<TMDbResponse<Movie>> {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
    if (!response.ok) throw new Error('Failed to search movies');
    return response.json();
  },

  async searchMulti(query: string, page = 1): Promise<TMDbResponse<MultiSearchResult>> {
    const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
    if (!response.ok) throw new Error('Failed to search');
    return response.json();
  },

  async getTrendingTV(timeWindow: 'day' | 'week' = 'week', page = 1): Promise<TMDbResponse<TVShow>> {
    const response = await fetch(`${BASE_URL}/trending/tv/${timeWindow}?api_key=${API_KEY}&page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch trending TV shows');
    return response.json();
  },

  async getPopularTV(page = 1): Promise<TMDbResponse<TVShow>> {
    const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch popular TV shows');
    return response.json();
  },

  // Movie details endpoints
  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
    if (!response.ok) throw new Error('Failed to fetch movie details');
    return response.json();
  },

  async getMovieCredits(movieId: number): Promise<Credits> {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`);
    if (!response.ok) throw new Error('Failed to fetch movie credits');
    return response.json();
  },

  async getMovieVideos(movieId: number): Promise<Videos> {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
    if (!response.ok) throw new Error('Failed to fetch movie videos');
    return response.json();
  },

  async getTVDetails(tvId: number): Promise<TVShowDetails> {
    const response = await fetch(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}`);
    if (!response.ok) throw new Error('Failed to fetch TV show details');
    return response.json();
  },

  async getTVCredits(tvId: number): Promise<Credits> {
    const response = await fetch(`${BASE_URL}/tv/${tvId}/credits?api_key=${API_KEY}`);
    if (!response.ok) throw new Error('Failed to fetch TV show credits');
    return response.json();
  },

  async getTVVideos(tvId: number): Promise<Videos> {
    const response = await fetch(`${BASE_URL}/tv/${tvId}/videos?api_key=${API_KEY}`);
    if (!response.ok) throw new Error('Failed to fetch TV show videos');
    return response.json();
  },

  async getSimilarMovies(movieId: number, page = 1): Promise<TMDbResponse<Movie>> {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch similar movies');
    return response.json();
  },

  async getSimilarTV(tvId: number, page = 1): Promise<TMDbResponse<TVShow>> {
    const response = await fetch(`${BASE_URL}/tv/${tvId}/similar?api_key=${API_KEY}&page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch similar TV shows');
    return response.json();
  },

  // Utility functions for image URLs
  getPosterUrl(path: string | null, size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!path) return '/placeholder-poster.jpg';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },

  getBackdropUrl(path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'original'): string {
    if (!path) return '/placeholder-backdrop.jpg';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },

  getProfileUrl(path: string | null, size: 'w45' | 'w185' | 'h632' | 'original' = 'w185'): string {
    if (!path) return '/placeholder-profile.jpg';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },

  getYouTubeEmbedUrl(key: string): string {
    return `https://www.youtube.com/embed/${key}`;
  },

  getYouTubeThumbnailUrl(key: string): string {
    return `https://img.youtube.com/vi/${key}/hqdefault.jpg`;
  }
};
