import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movie } from '../shared/types/movie';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  private apiKey = environment.tmdbApiKey;
  private baseUrl = environment.tmdbBaseUrl;

  // Persisted state
  public persistedMovies: Movie[] = [];
  public persistedRequestPayload: {
    searchText: string;
    page: number;
    mood: string;
  } = { searchText: '', page: 1, mood: '' };
  public persistedTotalPages = 1;
  public persistedSelectedPage = 1;
  public persistedPages: number[] = [];
  public initialMoviesLoaded = false;

  // --- Watchlist functionality ---
  private watchlistKey = 'movieWatchlist';

  constructor(private http: HttpClient) {}

  getMoviesByMood(mood: string, page: number = 1): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${mood}&page=${page}`
    );
  }

  searchMovies(query: string, page: number = 1): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${query}&page=${page}`
    );
  }

  getMovieDetails(id: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&append_to_response=videos,credits,similar`
    );
  }

  getGenres(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}`
    );
  }

  getWatchlist(): Movie[] {
    const list = localStorage.getItem(this.watchlistKey);
    return list ? JSON.parse(list) : [];
  }

  isInWatchlist(movie: Movie): boolean {
    return this.getWatchlist().some((m) => m.id === movie.id);
  }

  addToWatchlist(movie: Movie): void {
    const list = this.getWatchlist();
    if (!list.some((m) => m.id === movie.id)) {
      list.push(movie);
      localStorage.setItem(this.watchlistKey, JSON.stringify(list));
    }
  }

  removeFromWatchlist(movie: Movie): void {
    const list = this.getWatchlist().filter((m) => m.id !== movie.id);
    localStorage.setItem(this.watchlistKey, JSON.stringify(list));
  }
}
