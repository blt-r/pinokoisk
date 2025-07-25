import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Heart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { favoriteStore } from '@/stores/favoriteStore';
import clsx from 'clsx';

const FavoriteButton: React.FC<{ id: number }> = observer(({ id }) => {
  const isFavorite = favoriteStore.isFavorite(id);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [lastDialogForRemoving, setLastDialogForRemoving] = useState(false);

  const handleConfirm = () => {
    setDialogOpen(false);
    if (isFavorite) {
      favoriteStore.remove(id);
    } else {
      favoriteStore.add(id);
    }
  };

  const openDialog = () => {
    setLastDialogForRemoving(isFavorite);
    setDialogOpen(true);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild onClick={openDialog}>
        <Button
          className="size-9"
          aria-label="favorite"
          variant="ghost"
          size="icon"
        >
          <Heart
            className={clsx('transition-colors duration-300 size-5', {
              'stroke-fuchsia-400 fill-fuchsia-400': isFavorite,
            })}
          />
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {lastDialogForRemoving
              ? 'Remove from Favorites?'
              : 'Add to Favorites?'}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleConfirm}>Ok</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default FavoriteButton;
