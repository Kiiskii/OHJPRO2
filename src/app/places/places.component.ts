import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import { Tapahtuma } from 'src/shared/interfaces';
import { Router } from '@angular/router'
import { SearchService } from '../search.service';
import { Subscription } from 'rxjs';
import { ScrollTapahtuma } from 'src/shared/interfaces';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit, OnDestroy {
  tapahtumat: Tapahtuma[] = [];
  scrollTapahtumat: ScrollTapahtuma[] = [];
  selectedItems: boolean[] = [];
  items?: any;
  showAnotherLogo = false;
  activeIcon = Number;
  searchTerm!: string;
  subscription!: Subscription;
  page = 1;
  limit = 8;
  
  constructor(
    private http: HttpClient, 
    private router: Router, 
    private search: SearchService
    ) { }

  ngOnInit(): void {
    this.haeTapahtumat();
    this.getSearch();
    this.selectedItems = new Array(this.items).fill(false);
  }

  async haeTapahtumat(): Promise<void> {
    try {
      const response = 
        await axios.get(`/places/`);
        // console.log(response);
        this.tapahtumat = response.data.data.map((tapahtuma: any) => {
        const { street_address, postal_code, locality } = tapahtuma.location.address;
        const osoite = `${street_address}, ${postal_code}, ${locality}`;
        
        return {
          id: tapahtuma.id,
          nimi: tapahtuma.name?.fi ?? '',
          kuvaus: tapahtuma.description.body,
          sijaintiLeveys: tapahtuma.location.lat,
          sijaintiPituus: tapahtuma.location.lon,
          luokka: tapahtuma.tags.map((tag: any) => tag.name),
          homesite: tapahtuma.info_url,
          osoite: osoite
        };
      });
      this.scrollTapahtumat = this.tapahtumat.slice(0, 8);
      this.tapahtumat = this.tapahtumat;
      // console.log(this.tapahtumat);
      
    } catch (error) {
      console.error(error);
    }
  }

  onScrollDown(): void {
    const startIndex = this.scrollTapahtumat.length;
    const endIndex = startIndex + this.limit;
    this.scrollTapahtumat = this.scrollTapahtumat.concat(this.tapahtumat.slice(startIndex, endIndex));
  }

  @Output() tapahtumatLahetetty = new EventEmitter<string>();
    
  navigateToDetails(
    nimi: string, 
    kuvaus: string, 
    homesite:string, 
    osoite:string
    ){
    const data = {
      nimi: nimi, 
      kuvaus: kuvaus, 
      homesite: homesite, 
      osoite: osoite
    };
    this.router.navigate(['/places-detail'], { queryParams: data });
    this.tapahtumatLahetetty.emit(JSON.stringify(data));
    // console.log(data);
  }

  // käyttäjä voi lisätä suosikkeja funktio
  changeIcon(id: any, target: any, index: number) {
    if (this.selectedItems[index]) { // Tarkista, onko elementti jo valittu
      this.showAnotherLogo = !this.showAnotherLogo; // Vaihda ikonin tila vain, jos elementti on jo valittu
    }
    this.selectedItems[index] = !this.selectedItems[index]; // Vaihda elementin tila
    // console.log(this.selectedItems);
  }

  //for the search bar ->

  getSearch() {
    this.subscription = this.search.currentSearch.subscribe(searchTerm => this.searchTerm = searchTerm)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  newSearch() {
    this.search.changeSearch(this.searchTerm)
  }
  //search end
}