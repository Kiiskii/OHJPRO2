import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private url = 'http://localhost:3000/favorites/';

  constructor(private http: HttpClient) {}

  fetchFavoriteIds(userId: string): Observable<any[]> {
    return this.http.get<number[]>(`${this.url}${userId}`).pipe(
      map((response) => {
        return response;
      }),
      catchError(() => of([]))
    );
  }
}
