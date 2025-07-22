import { makeAutoObservable } from 'mobx';

import { fetchMovieDetails, type MovieDetails } from '@/tmdb';

type MovieDetailsCache = MovieDetails | 'invalid_id' | 'loading';

class CachedMovieDetailsStore {
  private detailsCache: Map<number, MovieDetailsCache> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  set(id: number, details: MovieDetailsCache) {
    this.detailsCache.set(id, details);
  }

  get(id: number): MovieDetailsCache | undefined {
    return this.detailsCache.get(id);
  }

  async fetchAndCache(id: number) {
    if (this.get(id) !== undefined) {
      return;
    }

    this.set(id, 'loading');

    let fetchedDetails: MovieDetails | 'invalid_id';

    try {
      fetchedDetails = await fetchMovieDetails(id);
    } catch (error) {
      console.error(`Failed to fetch details for ID ${id}:`, error);
      fetchedDetails = 'invalid_id';
    }

    this.set(id, fetchedDetails);
  }
}

export const cachedMovieDetailsStore = new CachedMovieDetailsStore();
