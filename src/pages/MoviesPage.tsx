import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useEffect, useRef } from 'react';

import MovieCard from '@/components/MovieCard';
import {
  CURRENT_YEAR,
  defaultFilters,
  filtersAreSame,
  MAX_RATING,
  MIN_RATING,
  MIN_YEAR,
  type Filters,
} from '@/tmdb';
import FilterForm from '@/components/FilterForm';
import Spinner from '@/components/Spinner';
import { moviesPageStore } from '@/stores/moviesPageStore';
import { reaction } from 'mobx';
import { useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

const filtersFromParams = (params: URLSearchParams): Filters => {
  const f = defaultFilters();

  const minYearParam = params.get('year_min');
  const minYear = minYearParam !== null ? Number(minYearParam) : MIN_YEAR;
  if (minYear >= MIN_YEAR && minYear <= CURRENT_YEAR) {
    f.minYear = minYear;
  }

  const maxYearParam = params.get('year_max');
  const maxYear = maxYearParam !== null ? Number(maxYearParam) : CURRENT_YEAR;
  if (maxYear >= MIN_YEAR && maxYear <= CURRENT_YEAR) {
    f.maxYear = maxYear;
  }

  const minRatingParam = params.get('rating_min');
  const minRating =
    minRatingParam !== null ? Number(minRatingParam) : MIN_RATING;
  if (minRating >= MIN_RATING && minRating <= MAX_RATING) {
    f.minRating = minRating;
  }

  const maxRatingParam = params.get('rating_max');
  const maxRating =
    maxRatingParam !== null ? Number(maxRatingParam) : MAX_RATING;
  if (maxRating >= MIN_RATING && maxRating <= MAX_RATING) {
    f.maxRating = maxRating;
  }

  const genresParam = params.get('genres');
  if (genresParam) {
    for (const genre of genresParam.split(',')) {
      if (f.genres[genre] !== undefined) {
        f.genres[genre] = true;
      }
    }
  }

  return f;
};

const filtersToParams = (filters: Filters): Record<string, string> => {
  const params: Record<string, string> = {};

  if (filters.minYear > MIN_YEAR) params.year_min = filters.minYear.toString();
  if (filters.maxYear < CURRENT_YEAR)
    params.year_max = filters.maxYear.toString();

  if (filters.minRating > MIN_RATING)
    params.rating_min = filters.minRating.toString();
  if (filters.maxRating < MAX_RATING)
    params.rating_max = filters.maxRating.toString();

  // We assume internal state is always valid
  const genres = Object.keys(filters.genres)
    .filter(g => filters.genres[g])
    .join(',');

  if (genres) params.genres = genres;

  return params;
};

const MoviesPage: React.FC = observer(() => {
  const [searchParams, setSearchParams] = useSearchParams();

  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostElementRef = (node: HTMLDivElement) => {
    if (observer.current) observer.current.disconnect();
    if (!node) return;

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        console.log('End of scroll reached, loading more movies');
        moviesPageStore.loadMoreMovies();
      }
    });

    if (!moviesPageStore.loading) observer.current.observe(node);
  };

  useEffect(() => {
    const paramFilters = filtersFromParams(searchParams);

    if (!filtersAreSame(paramFilters, moviesPageStore.filters)) {
      setSearchParams(filtersToParams(paramFilters), { replace: true });
      moviesPageStore.setFilters(paramFilters);
      moviesPageStore.resetMovies();

      moviesPageStore.loadMoreMovies();
    } else if (moviesPageStore.loadedMovies.length === 0) {
      moviesPageStore.loadMoreMovies();
    }

    return reaction(
      () => moviesPageStore.filters,
      (filters, oldFilters) => {
        if (filtersAreSame(filters, oldFilters)) return;
        setSearchParams(filtersToParams(filters));

        console.log('Filters changed, resetting movies and loading more');
        moviesPageStore.resetMovies();
        moviesPageStore.loadMoreMovies();
      }
    );
  }, [searchParams, setSearchParams]);

  return (
    <Stack spacing={2} my={2}>
      <FilterForm />

      {moviesPageStore.loadedMovies.map((movie, i) => (
        <Box
          ref={
            i === moviesPageStore.loadedMovies.length - 1
              ? lastPostElementRef
              : null
          }
          // Movies are not unique by id, and they are only ever appended to the end of the list,
          // so use index as the key
          key={i}
        >
          <MovieCard movie={movie} />
        </Box>
      ))}

      {moviesPageStore.error ? (
        <Alert severity="error">
          Error loading movies. Please try again later.
        </Alert>
      ) : moviesPageStore.noMoreMovies ? (
        <Alert severity="info">No more movies match the filters.</Alert>
      ) : (
        <Spinner />
      )}
    </Stack>
  );
});

export default MoviesPage;
