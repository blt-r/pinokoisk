import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import type { MovieDetails } from '@/tmdb';
import FavoriteButton from '@/components/FavoriteButton';
import MoviePoster from '@/components/MoviePoster';
import { StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
});

const MovieDetailsContent: React.FC<{ details: MovieDetails }> = ({
  details,
}) => {
  const formattedDate = new Date(
    Date.parse(details.release_date)
  ).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
  });

  return (
    <div className="py-4 flex gap-4 flex-col sm:flex-row">
      <MoviePoster
        poster_path={details.poster_path}
        title={details.title}
        sizes="(min-width:640px) 240px, 50vw"
        className="rounded-2xl shadow-2xl w-[50%] sm:w-[240px] shrink-0 mx-auto h-fit"
      />
      <div className="grow flex flex-col gap-2">
        <div className="flex">
          <h1 className="text-2xl">{details.title}</h1>
          <div className="ml-auto">
            <FavoriteButton id={details.id} />
          </div>
        </div>
        {details.title !== details.original_title && (
          <p className="text-xl text-muted-foreground">
            {details.original_title}
          </p>
        )}

        <div className="flex gap-3 flex-wrap items-center">
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
                    <Link
                      className="text-blue-500 hover:underline"
                      to={'/?genres=' + g.name}
                    >
                      {g.name}
                    </Link>
                  }
                </Fragment>
              ))}
            </DetailInfo>
          )}
        </div>

        {details.overview && <p>{details.overview}</p>}

        <div className="flex gap-2 flex-wrap">
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

export default MovieDetailsContent;
