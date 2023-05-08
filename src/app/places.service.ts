import { Injectable } from '@angular/core';
import { ScrollTapahtuma, Tapahtuma } from 'src/shared/interfaces';
import axios from 'axios';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  tapahtumat: Tapahtuma[] = [];
  scrollTapahtumat: ScrollTapahtuma[] = [];
  searchTerm!: string;
  waitingPlaces = true;
  currentPosition = {latitude:60.1699, longitude: 24.9384}
  private tapahtumatSourse = new BehaviorSubject(this.tapahtumat);
  currentTapahtumat = this.tapahtumatSourse.asObservable();

 

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
            this.currentPosition.latitude,
            this.currentPosition.longitude
          ),
          luokka: tapahtuma.tags.map((tag: any) => tag.name).join(', '),
          homesite: tapahtuma.info_url,
          osoite: osoite,
        };
      });

      this.scrollTapahtumat = this.tapahtumat.slice(0, 8);
      this.tapahtumatSourse.next(this.tapahtumat)
   
      // console.log(this.tapahtumat);
    } catch (error) {
      console.error(error);
    }

    this.waitingPlaces = false;
  }


  setFilter(value:string){
  this.searchTerm = value;
 
   this.tapahtumatSourse.next(   this.tapahtumat.filter(t => t.luokka.toLowerCase().includes(value.toLowerCase())))

  }

  constructor() { }
}
