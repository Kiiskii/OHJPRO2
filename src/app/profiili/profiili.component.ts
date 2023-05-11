import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription  } from 'rxjs';

import { FavoritesService } from 'src/services/favorites.service';

@Component({
  selector: 'app-profiili',
  templateUrl: './profiili.component.html',
  styleUrls: ['./profiili.component.css'],
})
export class ProfiiliComponent implements OnInit {
  token: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  userNameLogin!: Observable<string | null>;
  
  bgimg: string = 'bg-login2-desktop.png';
  favoriteIds?: number[];

  subscription!: Subscription;
  
  constructor (
    private http: HttpClient,
    private authService: AuthService,
    private favoritesservice: FavoritesService
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
      if (userId) {
        this.favoritesservice.fetchFavoriteIds(userId).subscribe(ids => {
          this.favoriteIds = ids;
    });
  }

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

  setFavoriteIds(ids: number[]): void {
    this.favoriteIds = ids;
  }

  logout(): void {
    this.authService.logout();
  }
}
