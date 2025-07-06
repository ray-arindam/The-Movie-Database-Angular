import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MoviesService } from '../movies/movies.service';
import { MovieListComponent } from '../movies/movie-list/movie-list.component';
import { Movie } from '../shared/types/movie';
import { SearchBarComponent } from '../shared/components/search-bar/search-bar.component';
import { ButtonComponent } from '../shared/components/button/button.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { finalize, first, Subscription, tap } from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    MovieListComponent,
    SearchBarComponent,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    ButtonComponent,
    RouterModule,
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit, OnDestroy {
  moods: { label: string; value: string }[] = [];
  movies: Movie[] = [];
  initialMoviesLoaded = false;
  moviesLoading = false;
  totalPages = 1;
  pages: number[] = [];
  selectedPage = 1;

  // Request payload
  requestPayload = {
    searchText: '',
    page: 1,
    mood: '',
  };

  searchControl = new FormControl('');
  subscription: Subscription = new Subscription();

  constructor(private moviesService: MoviesService, private router: Router) {}

  ngOnInit() {
    this.moviesService
      .getGenres()
      .pipe(first())
      .subscribe((genres: any) => {
        const shuffled = genres.genres.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        this.moods = selected.map((genre: any) => ({
          label: genre.name,
          value: genre.id.toString(),
        }));
      });

    // Restore persisted state if available
    if (this.moviesService.persistedMovies.length > 0) {
      this.movies = this.moviesService.persistedMovies;
      this.requestPayload = { ...this.moviesService.persistedRequestPayload };
      this.totalPages = this.moviesService.persistedTotalPages;
      this.selectedPage = this.moviesService.persistedSelectedPage;
      this.pages = this.moviesService.persistedPages;
      this.initialMoviesLoaded = this.moviesService.initialMoviesLoaded;
      this.searchControl.setValue(this.requestPayload.searchText, {
        emitEvent: false,
      });
    }

    this.subscription.add(
      this.searchControl.valueChanges.subscribe((value) => {
        this.onSearch(value ?? '');
      })
    );
  }

  goToWatchlist() {
    this.router.navigate(['/watchlist']);
  }

  onSearch(value: string) {
    this.requestPayload.searchText = value;
    this.requestPayload.page = 1;
    this.requestPayload.mood = '';
    this.selectedPage = 1;
    this.fetchMovies();
  }

  onMoodSelect(mood: string) {
    this.requestPayload.mood = mood;
    this.requestPayload.page = 1;
    this.requestPayload.searchText = '';
    this.selectedPage = 1;
    this.searchControl.setValue('', { emitEvent: false });
    this.fetchMovies();
  }

  onPageSelect(page: number) {
    this.requestPayload.page = Number(page);
    this.selectedPage = Number(page);
    this.pages = this.getPages(this.totalPages, this.selectedPage);
    this.fetchMovies();
  }

  private persistMoviesState() {
    this.moviesService.persistedMovies = this.movies;
    this.moviesService.persistedRequestPayload = { ...this.requestPayload };
    this.moviesService.persistedTotalPages = this.totalPages;
    this.moviesService.persistedSelectedPage = this.selectedPage;
    this.moviesService.persistedPages = this.pages;
    this.moviesService.initialMoviesLoaded = true;
  }

  fetchMovies() {
    if (this.requestPayload.searchText) {
      this.moviesLoading = true;
      this.moviesService
        .searchMovies(this.requestPayload.searchText, this.requestPayload.page)
        .pipe(first())
        .subscribe({
          next: (movies: any) => {
            this.movies = movies.results;
            this.totalPages = Math.min(movies.total_pages, 100);
            this.pages = this.getPages(this.totalPages, this.selectedPage);
            this.initialMoviesLoaded = true;
            this.persistMoviesState();
          },
          error: (error) => {
            console.error('Error fetching movies:', error);
            this.movies = [];
            this.totalPages = 1;
            this.pages = [];
          },
          complete: () => {
            this.moviesLoading = false;
          },
        });
    } else if (this.requestPayload.mood) {
      this.moviesLoading = true;
      this.moviesService
        .getMoviesByMood(this.requestPayload.mood, this.requestPayload.page)
        .pipe(first())
        .subscribe({
          next: (movies: any) => {
            this.movies = movies.results;
            this.totalPages = Math.min(movies.total_pages, 100);
            this.pages = this.getPages(this.totalPages, this.selectedPage);
            this.initialMoviesLoaded = true;
            this.persistMoviesState();
          },
          error: (error) => {
            console.error('Error fetching movies:', error);
            this.movies = [];
            this.totalPages = 1;
            this.pages = [];
          },
          complete: () => {
            this.moviesLoading = false;
          },
        });
    } else {
      this.movies = [];
      this.pages = [];
      this.totalPages = 1;
      // Clear persisted state
      this.moviesService.persistedMovies = [];
      this.moviesService.persistedRequestPayload = {
        searchText: '',
        page: 1,
        mood: '',
      };
      this.moviesService.persistedTotalPages = 1;
      this.moviesService.persistedSelectedPage = 1;
      this.moviesService.persistedPages = [];
      this.moviesService.initialMoviesLoaded = false;
    }
  }

  getPages(total_pages: number, page: number = 1): number[] {
    // Show pages around the current page
    // e.g., if page is 3, show pages 1, 2, 3, 4, 5
    // if page is 8 and total pages is 10, show pages 6, 7, 8, 9, 10
    // if page is 5 and total pages is 10, show pages 3, 4, 5, 6, 7
    // if page is 1 and total pages is 10, show pages 1, 2, 3, 4, 5
    // if page is 10 and total pages is 10, show pages 6, 7, 8, 9, 10
    if (page < 3) {
      return Array.from({ length: 5 }, (_, i) => page + i);
    } else if (page > total_pages - 2) {
      return Array.from({ length: 5 }, (_, i) => total_pages - 4 + i);
    }
    if (total_pages < 10) {
      return Array.from({ length: total_pages }, (_, i) => i + 1);
    }
    return Array.from({ length: total_pages }, (_, i) => i + 1)
      .filter((p) => p >= page - 2 && p <= page + 2)
      .slice(0, 5); // Show up to 5 pages around the current page
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
