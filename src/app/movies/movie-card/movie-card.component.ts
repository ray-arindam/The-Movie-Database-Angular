import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Movie } from '../../shared/types/movie';
import { Router } from '@angular/router';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css'],
})
export class MovieCardComponent {
  @Input() movie!: Movie;

  placeholder = 'assets/placeholder-movie.svg';

  constructor(private router: Router, public moviesService: MoviesService) {}

  /**
   * Handles image loading errors by setting a placeholder image.
   */
  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = this.placeholder;
  }

  /**
   * Navigates to the detail page for the current movie.
   */
  goToDetail() {
    this.router.navigate(['/movies', this.movie.id]);
  }

  /**
   * Toggles the movie's presence in the watchlist and prevents event bubbling.
   */
  toggleWatchlist(event: Event) {
    event.stopPropagation();
    if (this.moviesService.isInWatchlist(this.movie)) {
      this.moviesService.removeFromWatchlist(this.movie);
    } else {
      this.moviesService.addToWatchlist(this.movie);
    }
  }
}
