import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import NotFoundPage from '@/pages/NotFoundPage';
import { cachedMovieDetailsStore } from '@/stores/cachedMovieDetailsStore';
import MovieDetailsContent from '@/components/MovieDetailsContent';
import Spinner from '@/components/Spinner';

const MovieDetailsPage: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const idIsValid =
    Number.isFinite(movieId) && Number.isInteger(movieId) && movieId > 0;

  useEffect(() => {
    if (!idIsValid) {
      return;
    }
    cachedMovieDetailsStore.fetchAndCache(movieId);
  }, [idIsValid, movieId]);

  if (!idIsValid) {
    return <NotFoundPage />;
  }

  const movieDetails = cachedMovieDetailsStore.get(movieId);

  if (movieDetails === 'invalid_id') {
    return <NotFoundPage />;
  }

  if (movieDetails === undefined || movieDetails === 'loading') {
    return <Spinner />;
  }

  return <MovieDetailsContent details={movieDetails} />;
});

export default MovieDetailsPage;
