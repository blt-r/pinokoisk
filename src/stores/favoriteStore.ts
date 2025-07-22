import { makeAutoObservable, reaction } from 'mobx';

const LOCALSTORAGE_KEY = 'pinokoisk.favorites';

class FavoriteStore {
  // Use Map instead of Set because mobx tracks Map keys individually
  private favorites: Map<number, null>;

  constructor() {
    makeAutoObservable(this);

    const stored = localStorage.getItem(LOCALSTORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as number[];
      this.favorites = new Map(parsed.map(id => [id, null]));
    } else {
      this.favorites = new Map();
    }

    reaction(
      () => [...this.favorites.keys()],
      favorites => {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(favorites));
      }
    );
  }

  size() {
    return this.favorites.size;
  }

  keys() {
    return this.favorites.keys();
  }

  add(movie_id: number) {
    this.favorites.set(movie_id, null);
  }

  remove(movie_id: number) {
    this.favorites.delete(movie_id);
  }

  isFavorite(movie_id: number) {
    return this.favorites.has(movie_id);
  }
}

export const favoriteStore = new FavoriteStore();
