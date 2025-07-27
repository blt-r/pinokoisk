import Stack from '@mui/material/Stack';
import { observer } from 'mobx-react-lite';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import { cachedMovieDetailsStore } from '@/stores/cachedMovieDetailsStore';
import { type Movie } from '@/tmdb';
import MovieCard from '@/components/MovieCard';
import { favoriteStore } from '@/stores/favoriteStore';
import CardSpinner from '@/components/CardSpinner';

const FavoritesPage: React.FC = observer(() => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const promises = Array.from(favoriteStore.keys())
        .filter(id => cachedMovieDetailsStore.get(id) === undefined)
        .map(id => cachedMovieDetailsStore.fetchAndCache(id));

      await Promise.all(promises);

      setLoading(false);
    };

    fetchFavorites();
  }, []);

  const fetchedMovies = [] as Movie[];
  let error = false;

  for (const id of favoriteStore.keys()) {
    const movie = cachedMovieDetailsStore.get(id);
    if (movie === undefined || movie === 'loading') {
      break;
    }
    if (movie === 'invalid_id') {
      error = true;
      continue;
    }

    fetchedMovies.push(movie);
  }

  return (
    <Stack gap={2} my={2}>
      {favoriteStore.size() === 0 && (
        <Typography align="center" py={6}>
          Add movies to favorites and they will appear here
        </Typography>
      )}

      {fetchedMovies.map(movie => (
        // Movies can be removed from the list, and they are unique by id,
        // so use id as the key
        <MovieCard key={movie.id} movie={movie} />
      ))}

      {error && (
        <Alert severity="error">
          Error loading movies. Please try again later.
        </Alert>
      )}

      {loading && <CardSpinner />}
    </Stack>
  );
});

export default FavoritesPage;
