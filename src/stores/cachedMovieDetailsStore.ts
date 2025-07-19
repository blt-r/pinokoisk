import { makeAutoObservable } from 'mobx';
import { type MovieDetails } from '@/tmdb';

export const InvalidId = Symbol('InvalidId');
export type InvalidId = typeof InvalidId;

class CachedMovieDetailsStore {
  private detailsCache: Map<number, MovieDetails | InvalidId> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  cache(id: number, details: MovieDetails | InvalidId) {
    this.detailsCache.set(id, details);
  }

  isCached(id: number): boolean {
    return this.detailsCache.has(id);
  }

  get(id: number): MovieDetails | InvalidId | undefined {
    return this.detailsCache.get(id);
  }
}

export const cachedMovieDetailsStore = new CachedMovieDetailsStore();
