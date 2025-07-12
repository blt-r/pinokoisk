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

type Genre = { id: number; name: string };

export type Movie = {
  title: string;
  original_title: string;
  poster_path: string;
  id: number;
  release_date: string;
  genres: Genre[];
  overview: string;
  vote_average: number;
  vote_count: number;
};

const GENRES = new Map<number, string>(
  Object.entries(GENRE_IDS).map(([name, id]) => [id, name])
);

const genresFromIds = (ids: number[]): Genre[] => {
  return ids
    .map(id => ({ id, name: GENRES.get(id) }))
    .filter((g): g is Genre => g.name !== undefined) // They might add more genre ids we don't know about
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const CURRENT_YEAR = new Date().getFullYear();
export const MIN_YEAR = 1990;

export const MIN_RATING = 0;
export const MAX_RATING = 10;

export const fetchMovies = async (
  page: number,
  filters: Filters
): Promise<Movie[]> => {
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

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + import.meta.env.VITE_TMDB_API_KEY,
    },
  });

  type ResponseMovies = Omit<Movie, 'genres'> & { genre_ids: number[] };

  const json: { results: ResponseMovies[] } = await response.json();

  return json.results.map(movie => ({
    ...movie,
    genres: genresFromIds(movie.genre_ids),
  }));
};

export type MovieDetails = Movie & {
  budget: number;
  homepage: string;
  original_language: string;
  poster_path: string;
  revenue: number;
  runtime: number;
  imdb_id: string;
};

export const fetchMovieDetails = async (id: number): Promise<MovieDetails> => {
  const url = `https://api.themoviedb.org/3/movie/${id}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + import.meta.env.VITE_TMDB_API_KEY,
    },
  });

  return await response.json();
};
