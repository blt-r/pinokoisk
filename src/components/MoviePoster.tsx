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
  ...props
}) => {
  return poster_path ? (
    <img
      srcSet={`https://image.tmdb.org/t/p/w92${poster_path} 92w,
               https://image.tmdb.org/t/p/w154${poster_path} 154w,
               https://image.tmdb.org/t/p/w185${poster_path} 185w,
               https://image.tmdb.org/t/p/w300${poster_path} 300w,
               https://image.tmdb.org/t/p/w500${poster_path} 500w,
               https://image.tmdb.org/t/p/w780${poster_path} 780w`}
      src={`https://image.tmdb.org/t/p/w185${poster_path}`}
      alt={`${title} poster`}
      sizes={sizes}
      {...props}
    />
  ) : (
    <div {...props}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <text x="50" y="50" fontSize="12px" fill="black" opacity="0.7">
          <tspan textAnchor="middle" x="50" dy="-0.9em">
            Poster
          </tspan>
          <tspan textAnchor="middle" x="50" dy="1.2em">
            not available
          </tspan>
        </text>
      </svg>
    </div>
  );
};

export default MoviePoster;
