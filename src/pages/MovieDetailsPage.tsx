import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import NotFoundPage from '@/pages/NotFoundPage';
import { fetchMovieDetails } from '@/tmdb';
import {
  cachedMovieDetailsStore,
  InvalidId,
} from '@/stores/cachedMovieDetailsStore';
import MovieDetailsContent from '@/components/MovieDetailsContent';
import Spinner from '@/components/Spinner';

const MovieDetailsPage: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);

  if (!Number.isFinite(movieId) || !Number.isInteger(movieId)) {
    return <NotFoundPage />;
  }

  useEffect(() => {
    const fetchAndCache = async () => {
      try {
        const movieDetails = await fetchMovieDetails(movieId);
        cachedMovieDetailsStore.cache(movieId, movieDetails);
      } catch (error) {
        console.error(
          `Failed to fetch movie details for ID ${movieId}:`,
          error
        );
        cachedMovieDetailsStore.cache(movieId, InvalidId);
      }
    };

    fetchAndCache();
  }, [movieId]);

  const movieDetails = cachedMovieDetailsStore.get(movieId);

  if (movieDetails === InvalidId) {
    return <NotFoundPage />;
  }

  if (movieDetails === undefined) {
    return <Spinner />;
  }

  return <MovieDetailsContent details={movieDetails} />;
});

export default MovieDetailsPage;
