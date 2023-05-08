import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profiili',
  templateUrl: './profiili.component.html',
  styleUrls: ['./profiili.component.css'],
})
export class ProfiiliComponent implements OnInit {
  bgimg: string = 'bg-login-desktop.jpg';
  favoriteIds?: number[];
  
  constructor (
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchFavoriteIds();
  }

  fetchFavoriteIds(): void {
    const userid = this.userId;
    if (userid) {
      this.http.get<any[]>(`http://localhost:3000/favorites/${userid}`)
        .subscribe({
          next: (response) => {
            this.setFavoriteIds(response);
          },
          error: (error) => {
            console.log(error);
          }
        });
    }
  }

  setFavoriteIds(ids: number[]): void {
    this.favoriteIds = ids;
  }

  get userId(): number {
    return this.authService.userId;
  }

  get userName(): string {
    return this.authService.userName;
  }
}
