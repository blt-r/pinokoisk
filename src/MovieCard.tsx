import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Star from '@mui/icons-material/Star';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { genreIdsToNames, type Movie } from './tmdb';
import { favoriteStore } from './favoriteStore';

type Props = {
  movie: Movie;
};

const MovieCard: React.FC<Props> = ({ movie }) => {
  return (
    <Paper
      sx={{
        display: 'flex',
        height: { xs: 180, sm: 250 },
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        src={'https://image.tmdb.org/t/p/w500/' + movie.poster_path}
        alt={movie.title + ' poster'}
        sx={{ height: '100%', aspectRatio: '500 / 720', width: 'auto' }}
      />
      <Box
        sx={{
          fontSize: { xs: '0.7rem', sm: '1rem' },
          padding: { xs: 1.5, sm: 2 },
          flexGrow: 1,
          position: 'relative',
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

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
            <Star sx={{ fontSize: '1em' }} />

            <Typography sx={{ fontSize: '1.1em' }}>
              {movie.vote_average.toFixed(1)}
            </Typography>
          </Box>

          <Typography sx={{ fontSize: '1.1em' }}>
            ({movie.vote_count.toLocaleString()})
          </Typography>
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
          {genreIdsToNames(movie.genre_ids).map((genre, i) => (
            <Chip key={i} label={genre} size="small" />
          ))}
        </Stack>

        <Box sx={{ position: 'absolute', bottom: '8px', right: '8px' }}>
          <FavoriteButton id={movie.id} />
        </Box>
      </Box>
    </Paper>
  );
};

const FavoriteButton: React.FC<{ id: number }> = observer(({ id }) => {
  const isFavorite = favoriteStore.isFavorite(id);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [lastDialogForRemoving, setLastDialogForRemoving] = useState(false);

  const handleClose = (confirmed: boolean) => {
    setDialogOpen(false);

    if (!confirmed) {
      return;
    }

    if (isFavorite) {
      favoriteStore.remove(id);
    } else {
      favoriteStore.add(id);
    }
  };

  return (
    <>
      <IconButton
        aria-label="favorite"
        onClick={() => {
          setLastDialogForRemoving(isFavorite);
          setDialogOpen(true);
        }}
        sx={{
          color: isFavorite ? '#d654b3' : null,
          transition: 'color .3s ease',
        }}
      >
        {isFavorite ? <Favorite /> : <FavoriteBorder />}
      </IconButton>

      <Dialog open={dialogOpen} onClose={() => handleClose(false)}>
        <DialogTitle>
          {lastDialogForRemoving
            ? 'Remove from Favorites?'
            : 'Add to Favorites?'}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => handleClose(false)}>Cancel</Button>
          <Button
            onClick={() => handleClose(true)}
            autoFocus
            variant="contained"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default MovieCard;
