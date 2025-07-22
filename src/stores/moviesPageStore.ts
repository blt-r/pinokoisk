import {
  defaultFilters,
  fetchMovies,
  PAGE_SIZE,
  type Filters,
  type Movie,
} from '@/tmdb';
import { makeAutoObservable } from 'mobx';

class MoviesPageStore {
  private currentFetchId: number = 0;
  filters: Filters = defaultFilters();
  loadedMovies: Movie[] = [];
  private loadedPages: number = 0;
  loading: boolean = false;
  noMoreMovies: boolean = false;
  error: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setFilters(newFilters: Filters) {
    this.filters = newFilters;
  }

  resetMovies() {
    this.loadedMovies = [];
    this.loadedPages = 0;
    this.loading = false;
    this.noMoreMovies = false;
    this.error = false;
    this.currentFetchId += 1; // Invalidate ongoing fetches
  }

  private addPage(movies: Movie[]) {
    this.loadedMovies.push(...movies);
    this.loadedPages += 1;
  }

  private nextFetchId() {
    this.currentFetchId += 1;
    return this.currentFetchId;
  }
  private setNoMoreMovies() {
    this.noMoreMovies = true;
  }
  private setLoading(value: boolean) {
    this.loading = value;
  }
  private setError() {
    this.error = true;
  }

  async loadMoreMovies() {
    if (this.loading || this.noMoreMovies || this.error) {
      return;
    }

    const fetchId = this.nextFetchId();
    this.setLoading(true);

    try {
      const newMovies = await fetchMovies(this.loadedPages + 1, this.filters);

      if (fetchId !== this.currentFetchId) {
        console.log('Fetch aborted due to new request');
        return;
      }

      if (newMovies.length > 0) {
        this.addPage(newMovies);
      }

      if (newMovies.length < PAGE_SIZE) {
        this.setNoMoreMovies();
      }
    } catch (error) {
      console.error('Error loading more movies:', error);
      this.setError();
    }

    this.setLoading(false);
  }
}

export const moviesPageStore = new MoviesPageStore();
