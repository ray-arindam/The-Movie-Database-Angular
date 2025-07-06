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

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = this.placeholder;
  }

  goToDetail() {
    this.router.navigate(['/movies', this.movie.id]);
  }

  toggleWatchlist(event: Event) {
    event.stopPropagation();
    if (this.moviesService.isInWatchlist(this.movie)) {
      this.moviesService.removeFromWatchlist(this.movie);
    } else {
      this.moviesService.addToWatchlist(this.movie);
    }
  }
}
