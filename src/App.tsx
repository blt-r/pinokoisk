import { memo, useCallback, useRef, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Grid,
  Stack,
} from '@mui/material';
import MovieCard from './MovieCard';
import { fetchMovies, filtersAreSame, type Filters, type Movie } from './tmdb';
import FilterForm from './FilterForm';

function App() {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);
  const [noMoreMovies, setNoMoreMovies] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters | null>(null);

  const loadMoreMovies = async (page: number, filters: Filters) => {
    setLoading(true);

    try {
      const newMovies = await fetchMovies(page, filters!);
      if (newMovies.length > 0) {
        setMovieList(prevMovies => [...prevMovies, ...newMovies]);
        setPage(p => p + 1);
      }

      if (newMovies.length < 20) {
        setNoMoreMovies(true);
      }
    } catch (error) {
      console.error('Error loading more movies:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (observer.current) observer.current.disconnect();
      if (!node) return;

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && !loading && !noMoreMovies) {
            loadMoreMovies(page, filters!);
          }
        },
        { threshold: 1.0 }
      );

      if (!loading) observer.current.observe(node);
    },
    [loading, page, filters, noMoreMovies]
  );

  const handleFilterChange = useCallback(
    (newFilters: Filters) => {
      if (filters != null && filtersAreSame(filters, newFilters)) {
        return;
      }

      setFilters(newFilters);
      setMovieList([]);
      setPage(1);
      setError(false);
      setNoMoreMovies(false);
      loadMoreMovies(1, newFilters);
    },
    [filters]
  );

  return (
    <Container>
      <Stack spacing={3} mt={3} mb={3}>
        <FilterForm onFilterChange={handleFilterChange} />

        {movieList.map((movie, i) => (
          <Box
            ref={i === movieList.length - 1 ? lastPostElementRef : null}
            key={i}
          >
            <MovieCard movie={movie} />
          </Box>
        ))}

        <InfiniteScrollEnd error={error} noMoreMovies={noMoreMovies} />
      </Stack>
    </Container>
  );
}

export default App;

const InfiniteScrollEnd: React.FC<{
  error: boolean;
  noMoreMovies: boolean;
}> = memo(({ error, noMoreMovies }) => {
  console.log('InfiniteScrollEnd rendered', { error, noMoreMovies });

  if (error) {
    return (
      <Alert severity="error">
        Error loading movies. Please try again later.
      </Alert>
    );
  } else if (noMoreMovies) {
    return <Alert severity="info">No more movies match the filters.</Alert>;
  } else {
    return (
      <Grid justifyContent="center" container>
        <CircularProgress disableShrink />
      </Grid>
    );
  }
});
