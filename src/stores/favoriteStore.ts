import { makeAutoObservable, reaction } from 'mobx';

const LOCALSTORAGE_KEY = 'pinokoisk.favorites';

class FavoriteStore {
  private favorites: Set<number>;

  constructor() {
    makeAutoObservable(this);
    const stored = localStorage.getItem(LOCALSTORAGE_KEY);
    if (stored) {
      this.favorites = new Set(JSON.parse(stored) as number[]);
    } else {
      this.favorites = new Set();
    }

    reaction(
      () => [...this.favorites],
      favorites => {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(favorites));
      }
    );
  }

  get set(): ReadonlySet<number> {
    return this.favorites;
  }

  add(movie_id: number) {
    this.favorites.add(movie_id);
  }

  remove(movie_id: number) {
    this.favorites.delete(movie_id);
  }

  isFavorite(movie_id: number) {
    return this.favorites.has(movie_id);
  }
}

export const favoriteStore = new FavoriteStore();
