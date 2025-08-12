import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import { cachedMovieDetailsStore } from '@/stores/cachedMovieDetailsStore';
import { type Movie } from '@/tmdb';
import MovieCard from '@/components/MovieCard';
import { favoriteStore } from '@/stores/favoriteStore';
import CardSpinner from '@/components/CardSpinner';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const FavoritesPage: React.FC = observer(() => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Pinokoisk | Favorites';
  }, []);

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
    <div className="flex h-full flex-col gap-4 py-4">
      {favoriteStore.size() === 0 && (
        <div className="grid h-full place-items-center">
          <p className="text-center">
            Add movies to favorites and they will appear here
          </p>
        </div>
      )}

      {fetchedMovies.map(movie => (
        // Movies can be removed from the list, and they are unique by id,
        // so use id as the key
        <MovieCard key={movie.id} movie={movie} />
      ))}

      {error && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Error loading movies. Please try again later.</AlertTitle>
        </Alert>
      )}

      {loading && <CardSpinner />}
    </div>
  );
});

export default FavoritesPage;
