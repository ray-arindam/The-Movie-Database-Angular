import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MoviesService } from '../movies.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovieDetailResolver implements Resolve<any> {
  constructor(private moviesService: MoviesService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = route.paramMap.get('id')!;
    return this.moviesService.getMovieDetails(id);
  }
}
