import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';

import { favoriteStore } from '@/stores/favoriteStore';

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

export default FavoriteButton;
