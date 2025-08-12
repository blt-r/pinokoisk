import { Link } from 'react-router-dom';

import { type Movie } from '@/tmdb';
import FavoriteButton from '@/components/FavoriteButton';
import MoviePoster from '@/components/MoviePoster';
import { memo } from 'react';
import { StarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MovieCard = memo<{ movie: Movie }>(({ movie }) => {
  return (
    <article className="bg-card text-card-foreground flex h-48 overflow-hidden rounded-xl border shadow-sm sm:h-64">
      <Link
        to={`/movie/${movie.id}`}
        className="aspect-[2/3] h-full"
        tabIndex={-1}
      >
        <MoviePoster
          poster_path={movie.poster_path}
          title={movie.title}
          sizes="(min-width:640px) calc(4px * 64 * 2/3), calc(4px * 48 * 2/3)"
        />
      </Link>
      <div className="relative grow-1 overflow-hidden p-3">
        <Link
          to={`/movie/${movie.id}`}
          className="block overflow-x-hidden overflow-ellipsis whitespace-nowrap"
        >
          <h2 className="inline text-xl sm:text-2xl">{movie.title}</h2>
          {movie.original_title !== movie.title && (
            <p className="text-muted-foreground inline text-sm sm:text-lg">
              {' ' + movie.original_title}
            </p>
          )}
        </Link>
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-base">
          <p>{movie.release_date.split('-')[0]}</p>
          <div className="flex items-center gap-1">
            <StarIcon
              aria-label="Rating"
              className="size-2.5 fill-current sm:size-3"
            />
            <p>
              {`${movie.vote_average.toFixed(1)} (${movie.vote_count.toLocaleString()})`}
            </p>
          </div>
        </div>
        <p className="line-clamp-2 sm:line-clamp-4">{movie.overview}</p>

        {/* TODO: fix genres colliding with the favorite button on phones */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {movie.genres.map((genre, i) => (
            <Badge key={i} variant="secondary" className="">
              {genre.name}
            </Badge>
          ))}
        </div>
        <div className="absolute right-4 bottom-4">
          <FavoriteButton id={movie.id} />
        </div>
      </div>
    </article>
  );
});

export default MovieCard;
