import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private url = 'http://localhost:3000/favorites/';

  constructor(
    private http: HttpClient,
    private authservice: AuthService) { }

    fetchFavoriteIds(userId: string): Observable<any[]> {
      // console.log(`Favoriteservice userId: ${userId}`)
      return this.http.get<number[]>(`${this.url}${userId}`).pipe(
        map(response => {
          // console.log(response);
          return response;
        }),
        catchError(() => of([]))
      );
  }
}
