import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private url = 'http://localhost:3000/favorites/';

  constructor(
    private http: HttpClient,
    private authservice: AuthService) { }

  fetchFavoriteIds(): Observable<any[]> {
    const userId = this.authservice.userId$.value;
    // console.log(`Favoriteservice userId: ${userId}`)
    if (userId > 0) {
      return this.http.get<number[]>(`${this.url}${userId}`).pipe(
        map(response => {
          // console.log(response);
          return response;
        }));
    } else {
      return of([]);
    }
  }
}
