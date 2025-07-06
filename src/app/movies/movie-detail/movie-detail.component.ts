import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
  imports: [CommonModule],
})
export class MovieDetailComponent implements OnInit {
  movie: any;
  trailerIndex = 0;
  safeTrailerUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    public moviesService: MoviesService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.movie = data['movie'];
      this.trailerIndex = 0;
      this.updateSafeTrailerUrl();
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  nextTrailer() {
    if (!this.movie?.videos?.results?.length) return;
    this.trailerIndex =
      (this.trailerIndex + 1) % this.movie.videos.results.length;
    this.updateSafeTrailerUrl();
  }

  prevTrailer() {
    if (!this.movie?.videos?.results?.length) return;
    this.trailerIndex =
      (this.trailerIndex - 1 + this.movie.videos.results.length) %
      this.movie.videos.results.length;
    this.updateSafeTrailerUrl();
  }

  updateSafeTrailerUrl() {
    if (
      this.movie?.videos?.results?.length &&
      this.movie.videos.results[this.trailerIndex]
    ) {
      const key = this.movie.videos.results[this.trailerIndex].key;
      this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${key}`
      );
    } else {
      this.safeTrailerUrl = null;
    }
  }

  toggleWatchlist() {
    if (this.moviesService.isInWatchlist(this.movie)) {
      this.moviesService.removeFromWatchlist(this.movie);
    } else {
      this.moviesService.addToWatchlist(this.movie);
    }
  }
}
