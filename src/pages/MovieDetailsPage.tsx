import { observer } from 'mobx-react-lite';
import { Fragment, useEffect, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import NotFoundPage from '@/pages/NotFoundPage';
import { cachedMovieDetailsStore } from '@/stores/cachedMovieDetailsStore';
import { LoaderCircle, StarIcon } from 'lucide-react';
import type { MovieDetails } from '@/tmdb';
import MoviePoster from '@/components/MoviePoster';
import FavoriteButton from '@/components/FavoriteButton';
import { Button } from '@/components/ui/button';

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
    return (
      <div className="grid h-full place-content-center">
        <LoaderCircle className="size-14 animate-spin" />
      </div>
    );
  }

  return <MovieDetailsContent details={movieDetails} />;
});

export default MovieDetailsPage;

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
});

const MovieDetailsContent: React.FC<{ details: MovieDetails }> = ({
  details,
}) => {
  useEffect(() => {
    document.title = `Pinokoisk | ${details.title}`;
  }, [details.title]);

  const formattedDate = new Date(
    Date.parse(details.release_date)
  ).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <MoviePoster
        poster_path={details.poster_path}
        title={details.title}
        sizes="(min-width:640px) 240px, 50vw"
        className="mx-auto h-fit w-[50%] shrink-0 rounded-2xl shadow-2xl sm:w-[240px]"
      />
      <div className="flex grow flex-col gap-2">
        <div className="flex">
          <h1 className="text-2xl">{details.title}</h1>
          <div className="ml-auto">
            <FavoriteButton id={details.id} />
          </div>
        </div>
        {details.title !== details.original_title && (
          <p className="text-muted-foreground text-xl">
            {details.original_title}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <p>{formattedDate}</p>
          <div className="flex items-center gap-1">
            <StarIcon
              aria-label="Rating"
              className="stroke-primary fill-primary size-3"
            />
            <p>
              {`${details.vote_average.toFixed(1)} (${details.vote_count.toLocaleString()})`}
            </p>
          </div>
          <p>{details.runtime} min</p>
        </div>

        <div>
          {details.budget !== 0 && (
            <DetailInfo name="budget">
              {currencyFormatter.format(details.budget)}
            </DetailInfo>
          )}
          {details.revenue !== 0 && (
            <DetailInfo name="revenue">
              {currencyFormatter.format(details.revenue)}
            </DetailInfo>
          )}
          {details.production_companies.length !== 0 && (
            <DetailInfo name="production">
              {details.production_companies.map(c => c.name).join(', ')}
            </DetailInfo>
          )}
          {details.production_countries.length !== 0 && (
            <DetailInfo name="countries">
              {details.production_countries.map(c => c.name).join(', ')}
            </DetailInfo>
          )}
          {details.spoken_languages.length !== 0 && (
            <DetailInfo name="languages">
              {details.spoken_languages.map(l => l.name).join(', ')}
            </DetailInfo>
          )}
          {details.tagline && (
            <DetailInfo name="tagline">{details.tagline}</DetailInfo>
          )}
          {details.genres.length && (
            <DetailInfo name="genres">
              {details.genres.map((g, i) => (
                <Fragment key={i}>
                  {i !== 0 && ', '}
                  {
                    <Link className="underline" to={'/?genres=' + g.name}>
                      {g.name}
                    </Link>
                  }
                </Fragment>
              ))}
            </DetailInfo>
          )}
        </div>

        {details.overview && <p>{details.overview}</p>}

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <a
              href={'https://www.themoviedb.org/movie/' + details.id}
              target="_blank"
            >
              TMDB
            </a>
          </Button>
          {details.imdb_id && (
            <Button asChild variant="outline">
              <a
                href={'https://www.imdb.com/title/' + details.imdb_id}
                target="_blank"
              >
                IMDb
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailInfo: React.FC<{ name: string; children: ReactNode }> = ({
  name,
  children,
}) => {
  return (
    <p>
      <span className="text-muted-foreground">{name + ': '}</span>
      {children}
    </p>
  );
};
