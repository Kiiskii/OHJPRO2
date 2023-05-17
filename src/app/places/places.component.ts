import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { faMugSaucer } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faIcons } from '@fortawesome/free-solid-svg-icons';
import { PlacesService } from '../places.service';
import { FavoritesService } from 'src/services/favorites.service';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css'],
})
export class PlacesComponent implements OnInit, OnDestroy {
  token: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(
    null
  );
  userNameLogin!: Observable<string | null>;

  private url = 'http://localhost:3000';
  selectedItems: boolean[] = [];
  favoriteIds!: number[];
  items?: any;
  showAnotherLogo = false;
  activeIcon = Number;

  subscription!: Subscription;
  page: number = 1;
  limit = 8;

  bgimg: string = 'bg-main2-desktop.png';
  faUtensils = faUtensils;
  faCamera = faCamera;
  faBagsShopping = faBagShopping;
  faTicket = faTicket;
  faMugSaucer = faMugSaucer;
  faXmark = faXmark;
  faLocationDot = faLocationDot;
  faIcons = faIcons;
  filterValue: string = '';

  latitude = 60.171944;
  longitude = 24.941389;

  constructor(
    private http: HttpClient,
    private router: Router,
    private search: SearchService,
    public places: PlacesService,
    private authService: AuthService,
    private favoritesService: FavoritesService
  ) {}

  async ngOnInit(): Promise<void> {
    this.selectedItems = [];

    const userId = localStorage.getItem('userId');
    if (userId) {
      this.favoritesService.fetchFavoriteIds(userId).subscribe((ids) => {
        this.favoriteIds = ids;
        console.log(`favoriteids: ${this.favoriteIds}`);
      });
    }

    this.places.haeTapahtumat();
    this.getSearch();
    this.selectedItems = new Array(this.items).fill(false);

    this.subscription = this.search.currentSearch.subscribe(
      (searchTerm) => (this.places.searchTerm = searchTerm)
    );
    const token = localStorage.getItem('token');
    if (token) {
      this.token.next(token);
    } else {
      this.token.next(null);
    }
    this.userNameLogin = this.authService.userName$;
  }

  isFavorite(eventId: number): boolean {
    return (this.favoriteIds && this.favoriteIds.includes(eventId)) || false;
  }

  get isUserLoggedIn$() {
    return this.authService.isUserLoggedIn$;
  }

  get userName(): Observable<string | null> {
    return this.authService.userName$;
  }

  onScrollDown(): void {
    const startIndex = this.places.scrollTapahtumat.length;
    const endIndex = startIndex + this.limit;
    this.places.scrollTapahtumat = this.places.scrollTapahtumat.concat(
      this.places.tapahtumat.slice(startIndex, endIndex)
    );
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
  }

  // käyttäjä voi lisätä suosikkeja funktio
  changeIcon(id: any, target: any, index: number) {
    const userid = localStorage.getItem('userId');
    const favid = id;

    this.selectedItems[favid] = !this.selectedItems[favid];

    console.log(this.selectedItems[favid]);

    if (this.selectedItems[favid]) {
      return this.http
        .post(`${this.url}/favorites`, { userid, favid })
        .subscribe({
          next: (response) => {
            console.log('Favorite added to db!');
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      this.http.delete(`${this.url}/favorites/${favid}`).subscribe({
        next: (response) => {
          console.log('Favorite removed from db!');
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
    return null;
  }

  //for the search bar ->
  getSearch() {
    this.subscription = this.search.currentSearch.subscribe(
      (searchTerm) => (this.places.searchTerm = searchTerm)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  newSearch() {
    this.search.changeSearch(this.places.searchTerm);
  }
  //search end

  //gives searchTerm to filtter and changes bg image
  setFilter(value: string) {
    this.places.setFilter(value);
    this.bgimg = 'bg-' + value + '2-desktop.png';
    if (value === 'activity' || value === '')
      this.bgimg = 'bg-main2-desktop.png';
    else if (value === 'cafés') this.bgimg = 'bg-coffee2-desktop.png';
    else if (value === '') this.ngOnDestroy();
    if (value === 'restaurant') this.filterValue = 'ravintoloita';
    if (value === 'shopping') this.filterValue = 'kauppoja';
    if (value === 'activity') this.filterValue = 'aktiviteetteja';
    if (value === 'sights') this.filterValue = 'nähtävyyksiä';
    if (value === 'cafés') this.filterValue = 'kahviloita';
    if (value === '') this.filterValue = '';
  }
}
