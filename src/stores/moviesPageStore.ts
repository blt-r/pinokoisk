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
  loadedPages: number = 0;
  loading: boolean = false;
  noMoreMovies: boolean = false;
  error: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setFilters(newFilters: Filters) {
    this.filters = newFilters;
  }

  addPage(movies: Movie[]) {
    this.loadedMovies.push(...movies);
    this.loadedPages += 1;
  }

  resetMovies() {
    this.loadedMovies = [];
    this.loadedPages = 0;
    this.loading = false;
    this.noMoreMovies = false;
    this.error = false;
    this.currentFetchId += 1; // Invalidate ongoing fetches
  }

  get canLoadMore() {
    return !this.loading && !this.noMoreMovies && !this.error;
  }

  nextFetchId() {
    this.currentFetchId += 1;
    return this.currentFetchId;
  }

  async loadMoreMovies() {
    const fetchId = this.nextFetchId();
    this.loading = true;

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
        this.noMoreMovies = true;
      }
    } catch (error) {
      console.error('Error loading more movies:', error);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }
}

export const moviesPageStore = new MoviesPageStore();
