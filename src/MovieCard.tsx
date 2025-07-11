import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { genreIdsToNames, type Movie } from './tmdb';
import { Star } from '@mui/icons-material';

type Props = {
  movie: Movie;
};

const MovieCard: React.FC<Props> = ({ movie }) => {
  return (
    <Card sx={{ display: 'flex', maxHeight: 250, overflow: 'hidden' }}>
      <CardMedia
        component="img"
        image={'https://image.tmdb.org/t/p/w500/' + movie.poster_path}
        alt={movie.title + ' poster'}
        sx={{ height: 250, aspectRatio: '500 / 720', width: 'auto' }}
      />
      <CardContent>
        <Box>
          <Typography variant="h2" sx={{ fontSize: '2em', display: 'inline' }}>
            {movie.title}
          </Typography>
          {movie.original_title === movie.title ? null : (
            <Typography
              variant="subtitle1"
              sx={{ display: 'inline', paddingLeft: 1, fontSize: '1.2em' }}
            >
              ({movie.original_title})
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'center' }}>
          <Typography variant="subtitle1">
            {movie.release_date.split('-')[0]}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
            <Star sx={{ fontSize: '.9em' }} />

            <Typography variant="subtitle1">
              {movie.vote_average.toFixed(1)}
            </Typography>
          </Box>

          <Typography variant="subtitle1">
            ({movie.vote_count.toLocaleString()})
          </Typography>
        </Box>

        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {movie.overview}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" mt={2}>
          {genreIdsToNames(movie.genre_ids).map((genre, i) => (
            <Chip key={i} label={genre} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
