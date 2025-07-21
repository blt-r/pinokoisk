import { makeAutoObservable } from 'mobx';
import { type MovieDetails } from '@/tmdb';

class CachedMovieDetailsStore {
  private detailsCache: Map<number, MovieDetails | 'invalid_id'> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  cache(id: number, details: MovieDetails | 'invalid_id') {
    this.detailsCache.set(id, details);
  }

  get(id: number): MovieDetails | 'invalid_id' | undefined {
    return this.detailsCache.get(id);
  }
}

export const cachedMovieDetailsStore = new CachedMovieDetailsStore();
