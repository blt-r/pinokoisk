import { Link } from 'react-router-dom';

import { type Movie } from '@/tmdb';
import FavoriteButton from '@/components/FavoriteButton';
import MoviePoster from '@/components/MoviePoster';
import { memo } from 'react';
import { StarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MovieCard = memo<{ movie: Movie }>(({ movie }) => {
  return (
    <article className="h-48 sm:h-64 shadow-sm rounded-xl bg-card border text-card-foreground flex overflow-hidden">
      <Link to={`/movie/${movie.id}`} className="h-full aspect-[2/3]">
        <MoviePoster
          poster_path={movie.poster_path}
          title={movie.title}
          sizes="(min-width:640px) calc(4px * 64 * 2/3), calc(4px * 48 * 2/3)"
        />
      </Link>
      <div className="p-3 grow-1 relative overflow-hidden">
        <Link
          to={`/movie/${movie.id}`}
          className="overflow-ellipsis whitespace-nowrap overflow-x-hidden block"
        >
          <h2 className="text-xl sm:text-2xl inline">{movie.title}</h2>
          {movie.original_title !== movie.title && (
            <p className="text-sm sm:text-lg text-muted-foreground inline">
              {' ' + movie.original_title}
            </p>
          )}
        </Link>
        <div className="flex gap-3 flex-wrap items-center text-xs sm:text-base">
          <p>{movie.release_date.split('-')[0]}</p>
          <div className="flex items-center gap-1">
            <StarIcon
              aria-label="Rating"
              className="stroke-primary fill-primary size-2.5 sm:size-3"
            />
            <p>
              {`${movie.vote_average.toFixed(1)} (${movie.vote_count.toLocaleString()})`}
            </p>
          </div>
        </div>
        <p className="line-clamp-2 sm:line-clamp-4">{movie.overview}</p>

        {/* TODO: fix genres colliding with the favorite button on phones */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {movie.genres.map((genre, i) => (
            <Badge key={i} variant="secondary" className="">
              {genre.name}
            </Badge>
          ))}
        </div>
        <div className="absolute bottom-4 right-4">
          <FavoriteButton id={movie.id} />
        </div>
      </div>
    </article>
  );
});

export default MovieCard;
