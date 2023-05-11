import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { PlacesService } from '../places.service';
import { FavoritesService } from 'src/services/favorites.service';
import { Router } from '@angular/router';
import { faIcons } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profiili',
  templateUrl: './profiili.component.html',
  styleUrls: ['./profiili.component.css'],
})
export class ProfiiliComponent implements OnInit {
  token: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(
    null
  );
  userNameLogin!: Observable<string | null>;

  bgimg: string = 'bg-login-desktop.jpg';
  favoriteIds!: number[];

  subscription!: Subscription;

  faIcons = faIcons;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private favoritesservice: FavoritesService,
    public placesService: PlacesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.favoritesservice.fetchFavoriteIds(userId).subscribe((ids) => {
        this.favoriteIds = ids;
      });
    }
    this.placesService.haeTapahtumat();

    const token = localStorage.getItem('token');
    if (token) {
      this.token.next(token);
    } else {
      this.token.next(null);
    }
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

  @Output() tapahtumatLahetetty = new EventEmitter<string>();

  navigateToDetails(
    nimi: string,
    kuvaus: string,
    homesite: string,
    osoite: string
  ) {
    const data = {
      nimi: nimi,
      kuvaus: kuvaus,
      homesite: homesite,
      osoite: osoite,
    };
    this.router.navigate(['/places-detail'], { queryParams: data });
    this.tapahtumatLahetetty.emit(JSON.stringify(data));
    // console.log(data);
  }
}
