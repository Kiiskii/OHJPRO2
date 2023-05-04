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
import { Subscription } from 'rxjs';
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

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css'],
})
export class PlacesComponent implements OnInit, OnDestroy {
  private url = 'http://localhost:3000';
  tapahtumat: Tapahtuma[] = [];
  scrollTapahtumat: ScrollTapahtuma[] = [];

  selectedItems: boolean[] = [];
  items?: any;
  showAnotherLogo = false;
  activeIcon = Number;
 
  subscription!: Subscription;
  page = 1;
  limit = 8;

  bgimg: string = 'bg-main-desktop.jpg';
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
  waitingPlaces = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private search: SearchService,
    private places: PlacesService,

    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // const userid = this.userId;
    // console.log('User id:', userId);
    this.userGeolocation();
    this.haeTapahtumat();

    this.getSearch();
    this.selectedItems = new Array(this.items).fill(false);
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

  async haeTapahtumat(): Promise<void> {
    try {
      const response = await axios.get(`/places/`);
      // console.log(response);
      this.tapahtumat = response.data.data.map((tapahtuma: any) => {
        const id = tapahtuma.id;
        // console.log(id)
        const { street_address, postal_code, locality } =
          tapahtuma.location.address;
        const osoite = `${street_address}, ${postal_code}, ${locality}`;

        if (this.searchTerm) {
          this.tapahtumat = this.tapahtumat.filter((tapahtuma) =>
            tapahtuma.nimi
              .toLocaleLowerCase()
              .includes(this.searchTerm.toLocaleLowerCase())
          );
        }

        //calculate distanse from user if geolocation is on or Helsinki Railway Station if not
        var fromLat: number;
        var fromLon: number;
        var toLat: number;
        var toLon: number;
        function distance(
          fromLat: number,
          fromLon: number,
          toLat: number,
          toLon: number
        ) {
          var radius = 6378137; // approximate Earth radius, *in meters*
          var deltaLat = toLat - fromLat;
          var deltaLon = toLon - fromLon;
          var angle =
            2 *
            Math.asin(
              Math.sqrt(
                Math.pow(Math.sin(deltaLat / 2), 2) +
                  Math.cos(fromLat) *
                    Math.cos(toLat) *
                    Math.pow(Math.sin(deltaLon / 2), 2)
              )
            );
          return radius * angle;
        }
        return {
          id: tapahtuma.id,
          nimi: tapahtuma.name?.fi ?? '',
          kuvaus: tapahtuma.description.body,
          sijaintiLeveys: tapahtuma.location.lat,
          sijaintiPituus: tapahtuma.location.lon,
          sijainti: distance(
            tapahtuma.location.lat,
            tapahtuma.location.lon,
            this.latitude,
            this.longitude
          ),
          luokka: tapahtuma.tags.map((tag: any) => tag.name).join(', '),
          homesite: tapahtuma.info_url,
          osoite: osoite,
        };
      });

      this.scrollTapahtumat = this.tapahtumat.slice(0, 8);
      this.tapahtumat = this.tapahtumat;
      // console.log(this.tapahtumat);
    } catch (error) {
      console.error(error);
    }

    this.waitingPlaces = false;
  }

  addSearchToScrollTapahtuma() {
    if (this.places.searchTerm) {
      const filteredTapahtumat = this.places.tapahtumat.filter((tapahtuma) =>
        tapahtuma.nimi.toLowerCase().includes(this.places.searchTerm.toLowerCase())
      );
      this.places.scrollTapahtumat = filteredTapahtumat.slice(0, this.limit);
    } else {
      this.places.scrollTapahtumat = this.places.tapahtumat.slice(
        0,
        this.limit
      );
    }

    console.log(this.searchTerm);

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

  get userId(): number {
    return this.authService.userId;
  }

  // käyttäjä voi lisätä suosikkeja funktio
  changeIcon(id: any, target: any, index: number) {
    const userid = this.userId;
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
            console.log(response);
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      this.http
      .delete(`${this.url}/favorites/${favid}`)
      .subscribe({
        next: (response) => {
          console.log(response);
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

    this.subscription = this.search.currentSearch.subscribe(
      (searchTerm) => (this.searchTerm = searchTerm)
    );

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  newSearch() {

    this.search.changeSearch(this.searchTerm);

  }
  //search end

  //gives searchTerm to filtter and changes bg image

  setFilter(value: string) {
    this.searchTerm = value;

    this.bgimg = 'bg-' + value + '-desktop.jpg';
    if (value === 'activity' || value === '')
      this.bgimg = 'bg-main-desktop.jpg';
    if (value === '') this.ngOnDestroy();
  }
}
