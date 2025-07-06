import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Movie } from '../../shared/types/movie';

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

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = this.placeholder;
  }
}
