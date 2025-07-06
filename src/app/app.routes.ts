import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing/landing.component').then((m) => m.LandingComponent),
    pathMatch: 'full',
  },
  {
    path: 'movies',
    loadChildren: () =>
      import('./movies/movies.routes').then((m) => m.moviesRoutes),
  },
  {
    path: 'watchlist',
    loadComponent: () =>
      import('./movies/watchlist/watchlist.component').then(
        (m) => m.WatchlistComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
