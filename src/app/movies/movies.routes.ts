import { Routes } from '@angular/router';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieDetailResolver } from './movie-detail/movie-detail.resolver';

export const moviesRoutes: Routes = [
  {
    path: ':id',
    loadComponent: () =>
      import('./movie-detail/movie-detail.component').then(
        (m) => m.MovieDetailComponent
      ),
    resolve: {
      movie: MovieDetailResolver,
    },
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
