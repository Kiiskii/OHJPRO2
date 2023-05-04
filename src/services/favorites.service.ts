import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private url = 'http://localhost:3000/favorites';

  constructor(private http: HttpClient) {}

  getAllFavorites(userId: number) {
    console.log(userId)
    return this.http.get<number[]>(`${this.url}/${userId}`);
  }
}
