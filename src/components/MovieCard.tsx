import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Star from '@mui/icons-material/Star';
import { Link } from 'react-router-dom';

import { type Movie } from '@/tmdb';
import FavoriteButton from '@/components/FavoriteButton';

type Props = {
  movie: Movie;
};

const MovieCard: React.FC<Props> = ({ movie }) => {
  return (
    <Paper
      sx={{
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        component={Link}
        to={'/movie/' + movie.id}
        sx={{
          textDecoration: 'none',
          height: { xs: 180, sm: 250 },
          color: 'inherit',
          display: 'flex',
        }}
      >
        <Box
          component="img"
          src={'https://image.tmdb.org/t/p/w500' + movie.poster_path}
          alt={movie.title + ' poster'}
          sx={{ height: '100%', aspectRatio: '500 / 720' }}
        />
        <Box
          sx={{
            fontSize: { xs: '0.7rem', sm: '1rem' },
            padding: { xs: 1.5, sm: 2 },
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 0.5, sm: 1 },
          }}
        >
          <Box>
            <Typography
              variant="h2"
              sx={{ fontSize: '1.7em', display: 'inline' }}
            >
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

          <Box
            sx={{
              display: 'flex',
              gap: 1.2,
              alignItems: 'center',
            }}
          >
            <Typography sx={{ fontSize: '1.1em' }}>
              {movie.release_date.split('-')[0]}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Star sx={{ fontSize: '1em' }} />

              <Typography sx={{ fontSize: '1.1em', ml: 0.2 }}>
                {movie.vote_average.toFixed(1)}
              </Typography>

              <Typography sx={{ fontSize: '1.1em', ml: 1.2 }}>
                ({movie.vote_count.toLocaleString()})
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={{
              display: { xs: 'none', sm: ['block', '-webkit-box'] },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {movie.overview}
          </Typography>

          <Stack
            sx={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 0.5,
              mt: { sm: 'auto' },
              pr: { sm: 4 },
            }}
          >
            {movie.genres.map((genre, i) => (
              <Chip key={i} label={genre.name} size="small" />
            ))}
          </Stack>
        </Box>
      </Box>
      <Box sx={{ position: 'absolute', bottom: '8px', right: '8px' }}>
        <FavoriteButton id={movie.id} />
      </Box>
    </Paper>
  );
};

export default MovieCard;
