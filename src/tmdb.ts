export const GENRE_IDS: Record<string, number> = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  ScienceFiction: 878,
  TVMovie: 10770,
  Thriller: 53,
  War: 10752,
  Western: 37,
};

export const GENRES = new Map<number, string>(
  Object.entries(GENRE_IDS).map(([name, id]) => [id, name])
);

export type Movie = {
  title: string;
  original_title: string;
  poster_path: string;
  id: number;
  release_date: string;
  genre_ids: number[];
  overview: string;
  vote_average: number;
  vote_count: number;
};

export function genreIdsToNames(ids: number[]): string[] {
  return ids
    .filter(id => GENRES.has(id)) // In case they add more ids
    .map(id => GENRES.get(id)!)
    .sort((a, b) => a.localeCompare(b));
}

export function genreNamesToIds(names: string[]): number[] {
  return names
    .filter(name => GENRE_IDS[name] !== undefined)
    .map(name => GENRE_IDS[name]);
}

export type Filters = {
  minYear: number;
  maxYear: number;
  minRating: number;
  maxRating: number;
  genres: number[];
};

export const filtersAreSame = (a: Filters, b: Filters): boolean => {
  return (
    a.minYear === b.minYear &&
    a.maxYear === b.maxYear &&
    a.minRating === b.minRating &&
    a.maxRating === b.maxRating &&
    a.genres.length === b.genres.length &&
    a.genres.every((genre, index) => genre === b.genres[index])
  );
};

export const CURRENT_YEAR = new Date().getFullYear();
export const MIN_YEAR = 1990;

export const MIN_RATING = 0;
export const MAX_RATING = 10;

export async function fetchMovies(
  page: number,
  filters: Filters
): Promise<Movie[]> {
  const params = new URLSearchParams();

  params.append('page', page.toString());

  if (filters.minYear > MIN_YEAR) {
    params.append('primary_release_date.gte', `${filters.minYear}-01-01`);
  }

  if (filters.maxYear < CURRENT_YEAR) {
    params.append('primary_release_date.lte', `${filters.maxYear}-12-31`);
  }

  if (filters.minRating > MIN_RATING) {
    params.append('vote_average.gte', filters.minRating.toString());
  }

  if (filters.maxRating < MAX_RATING) {
    params.append('vote_average.lte', filters.maxRating.toString());
  }

  if (filters.genres.length > 0) {
    params.append('with_genres', filters.genres.join(','));
  }

  const url = 'https://api.themoviedb.org/3/discover/movie?' + params;

  console.log('Fetching movies from:', url);

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + import.meta.env.VITE_TMDB_API_KEY,
    },
  });

  const movies = await response.json();
  console.log('movies:', movies);
  return movies.results;
}
