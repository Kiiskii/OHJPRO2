import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import axios from 'axios';
import { Tapahtuma } from 'src/shared/interfaces';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ScrollTapahtuma } from 'src/shared/interfaces';
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
  token: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  userNameLogin!: Observable<string | null>;

  private url = 'http://localhost:3000';
  selectedItems: boolean[] = [];
  favoriteIds?: number[];
  items?: any;
  showAnotherLogo = false;
  activeIcon = Number;

  subscription!: Subscription;
  page: number = 1;
  limit = 8;

  bgimg: string = 'bg-main-desktop.png';
  faUtensils = faUtensils;
  faCamera = faCamera;
  faBagsShopping = faBagShopping;
  faTicket = faTicket;
  faMugSaucer = faMugSaucer;
  faXmark = faXmark;
  faLocationDot = faLocationDot;
  faIcons = faIcons;

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

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
      if (userId) {
        this.favoritesService.fetchFavoriteIds(userId).subscribe(ids => {
          this.favoriteIds = ids;
      });
    }

    this.userGeolocation();

    this.places.haeTapahtumat();

    this.getSearch();
    this.selectedItems = new Array(this.items).fill(false);

    this.subscription = this.search.currentSearch.subscribe(searchTerm => this.places.searchTerm = searchTerm);
    const token = localStorage.getItem('token');
    if (token) {
      this.token.next(token);
    } else {
      this.token.next(null);
    };
    this.userNameLogin = this.authService.userName$;
  }

  // isFavorite(id: number): boolean {
  //   return this.favoriteIds?.includes(id) ?? false;
  // }
  

  get isUserLoggedIn$() {
    return this.authService.isUserLoggedIn$;
  }

  get userName(): Observable<string | null> {
    return this.authService.userName$;
  }

  userGeolocation() {
    if (!navigator.geolocation) {
      console.log('geolocation is not supported');
    }
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
    });
  }


 

  addSearchToScrollTapahtuma() {
    if (this.places.searchTerm) {
      const filteredTapahtumat = this.places.tapahtumat.filter((tapahtuma) =>

        tapahtuma.nimi
          .toLowerCase()
          .includes(this.places.searchTerm.toLowerCase())


      );
      this.places.scrollTapahtumat = filteredTapahtumat.slice(0, this.limit);
    } else {
      this.places.scrollTapahtumat = this.places.tapahtumat.slice(
        0,
        this.limit
      );
    }


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
    // console.log(data);
  }

  // käyttäjä voi lisätä suosikkeja funktio
  changeIcon(id: any, target: any, index: number) {
    const userid = localStorage.getItem('userId')
    const favid = id;
    if (this.selectedItems[index]) {
      // Tarkista, onko elementti jo valittu
      this.showAnotherLogo = !this.showAnotherLogo; // Vaihda ikonin tila vain, jos elementti on jo valittu
    }

    this.selectedItems[favid] = !this.selectedItems[favid];
    if (this.selectedItems[favid]) {
      return this.http
        .post(`${this.url}/favorites`, { userid, favid })
        .subscribe({
          next: (response) => {
            console.log("Favorite added to db!");
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      this.http.delete(`${this.url}/favorites/${favid}`).subscribe({
        next: (response) => {
          console.log("Favorite removed from db!");
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
    return null;

    // console.log(this.selectedItems);
  }

  //for the search bar ->
  getSearch() {


    this.subscription = this.search.currentSearch.subscribe(searchTerm => this.places.searchTerm = searchTerm)

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
    this.bgimg = 'bg-' + value + '-desktop.png';
    if (value === 'activity' || value === '')
      this.bgimg = 'bg-main-desktop.png';
      else if (value === 'cafés')
      this.bgimg = 'bg-coffee-desktop.png';
    else if (value === '') this.ngOnDestroy();
  }
}
