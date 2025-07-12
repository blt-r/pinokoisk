import Stack from '@mui/material/Stack';
import { observer } from 'mobx-react-lite';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import {
  cachedMovieDetailsStore,
  InvalidId,
} from '@/stores/cachedMovieDetailsStore';
import { fetchMovieDetails, type Movie } from '@/tmdb';
import MovieCard from '@/components/MovieCard';
import { favoriteStore } from '@/stores/favoriteStore';
import Spinner from '@/components/Spinner';

const FavoritesPage: React.FC = observer(() => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const awaitAndCache = async (id: number) => {
        try {
          const movie = await fetchMovieDetails(id);
          cachedMovieDetailsStore.cache(id, movie);
        } catch (error) {
          console.error(`Failed to fetch movie with ID ${id}:`, error);
          cachedMovieDetailsStore.cache(id, InvalidId);
        }
      };

      const promises = Array.from(favoriteStore.set)
        .filter(id => !cachedMovieDetailsStore.isCached(id))
        .map(id => awaitAndCache(id));

      await Promise.all(promises);

      setLoading(false);
    };

    fetchFavorites();
  }, []);

  const fetchedMovies = [] as Movie[];
  let error = false;

  for (const id of favoriteStore.set) {
    const movie = cachedMovieDetailsStore.get(id);
    if (movie === undefined) {
      break;
    }
    if (movie === InvalidId) {
      error = true;
      continue;
    }

    fetchedMovies.push(movie);
  }

  return (
    <Stack gap={2} my={2}>
      {favoriteStore.set.size === 0 && (
        <Typography align="center" py={6}>
          Add movies to favorites and they will appear here
        </Typography>
      )}

      {fetchedMovies.map((movie, i) => (
        <MovieCard key={i} movie={movie} />
      ))}

      {error && (
        <Alert severity="error">
          Error loading movies. Please try again later.
        </Alert>
      )}

      {loading && <Spinner />}
    </Stack>
  );
});

export default FavoritesPage;
