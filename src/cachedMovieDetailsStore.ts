import { makeAutoObservable } from 'mobx';
import { type MovieDetails } from './tmdb';

class CackedMovieDetailsStore {
  private detailsCache: Map<number, MovieDetails> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  cache(id: number, details: MovieDetails) {
    this.detailsCache.set(id, details);
  }

  isCached(id: number): boolean {
    return this.detailsCache.has(id);
  }

  get(id: number): MovieDetails | undefined {
    return this.detailsCache.get(id);
  }
}

export const cachedMovieDetailsStore = new CackedMovieDetailsStore();
