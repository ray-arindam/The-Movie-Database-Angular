import { Component, Input } from '@angular/core';
import { MoviesService } from '../movies.service';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { CommonModule } from '@angular/common';
import { Movie } from '../../shared/types/movie';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
  imports: [MovieCardComponent, CommonModule],
})
export class MovieListComponent {
  @Input('movies') movies: Movie[] = [];
  @Input('title') title: string = 'Movies';
  @Input('showTitle') showTitle: boolean = true;

  constructor(private moviesService: MoviesService) {}
}
