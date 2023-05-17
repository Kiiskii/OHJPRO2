import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription  } from 'rxjs';

@Component({
  selector: 'app-profiili',
  templateUrl: './profiili.component.html',
  styleUrls: ['./profiili.component.css'],
})
export class ProfiiliComponent implements OnInit {
  token: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  userNameLogin!: Observable<string | null>;
  
  bgimg: string = 'bg-login-desktop.jpg';
  favoriteIds?: number[];

  subscription!: Subscription;
  
  constructor (
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.token.next(token);
    } else {
      this.token.next(null);
    };
    this.userNameLogin = this.authService.userName$;
  }

  get userName(): Observable<string | null> {
    return this.authService.userName$;
  }

  get userId(): number {
    return this.authService.userId;
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

  logout(): void {
    this.authService.logout();
  }
}
