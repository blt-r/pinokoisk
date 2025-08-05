import { cn } from '@/lib/utils';
import { FileIcon } from 'lucide-react';

type Props = {
  poster_path: string | null;
  title: string;
  sizes: string;
  className?: string;
};

const MoviePoster: React.FC<Props> = ({
  poster_path,
  title,
  sizes,
  className,
}) => {
  return poster_path ? (
    <img
      srcSet={[92, 154, 185, 300, 500, 780]
        .map(w => `https://image.tmdb.org/t/p/w${w}${poster_path} ${w}w`)
        .join(', ')}
      src={`https://image.tmdb.org/t/p/w185${poster_path}`}
      alt={`${title} poster`}
      sizes={sizes}
      className={cn('aspect-[2/3]', className)}
    />
  ) : (
    <div className={cn('aspect-[2/3] grid place-items-center', className)}>
      <FileIcon
        className="size-9 stroke-muted-foreground opacity-50"
        aria-label="poster missing"
      />
    </div>
  );
};

export default MoviePoster;
