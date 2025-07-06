import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MoviesService } from '../movies.service';
import { Movie } from '../../shared/types/movie';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent {
  watchlist: Movie[] = [];

  constructor(private moviesService: MoviesService, private router: Router) {
    this.loadWatchlist();
  }

  /**
   * Loads the current watchlist from the MoviesService.
   */
  loadWatchlist() {
    this.watchlist = this.moviesService.getWatchlist();
  }

  /**
   * Navigates to the detail page for the selected movie.
   */
  goToDetail(movie: Movie) {
    this.router.navigate(['/movies', movie.id]);
  }

  /**
   * Removes a movie from the watchlist and reloads the list. Prevents event bubbling.
   */
  removeFromWatchlist(movie: Movie, event: Event) {
    event.stopPropagation();
    this.moviesService.removeFromWatchlist(movie);
    this.loadWatchlist();
  }
}
