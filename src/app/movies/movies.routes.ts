import { Routes } from '@angular/router';
import { MovieListComponent } from './movie-list/movie-list.component';

export const moviesRoutes: Routes = [
  {
    path: ':id',
    loadComponent: () =>
      import('./movie-detail/movie-detail.component').then(
        (m) => m.MovieDetailComponent
      ),
    resolve: {
      movie: import('./movie-detail/movie-detail.resolver').then(
        (m) => m.MovieDetailResolver
      ),
    },
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
