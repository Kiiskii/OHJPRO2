import { Injectable } from '@angular/core';
import { ScrollTapahtuma, Tapahtuma } from 'src/shared/interfaces';
import axios from 'axios';
import { BehaviorSubject, filter } from 'rxjs';
import { MapComponent } from './map/map.component';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  tapahtumat: Tapahtuma[] = [];
  scrollTapahtumat: ScrollTapahtuma[] = [];
  searchTerm!: string;
  currentPosition = { latitude: 60.171944, longitude: 24.941389 };
  public currentPositionSubject = new BehaviorSubject(this.currentPosition);

  waitingPlaces = true;

  private tapahtumatSourse = new BehaviorSubject(this.tapahtumat);
  currentTapahtumat = this.tapahtumatSourse.asObservable();

  setCoords(lat: number, lon: number) {
    this.currentPosition.latitude = lat;
    this.currentPosition.longitude = lon;
    this.haeTapahtumat();
    this.currentPositionSubject.next(this.currentPosition);
  }

  getCurrentPositionObservable() {
    return this.currentPositionSubject.asObservable();
  }

  async haeTapahtumat(): Promise<void> {
    try {
      const response = await axios.get(`/places/`);
      this.tapahtumat = response.data.data.map((tapahtuma: any) => {
        const id = tapahtuma.id;
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

        //calculate distanse from given coords to place
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
          var gToLat = (toLat * Math.PI) / 180;
          var gFromLat = (fromLat * Math.PI) / 180;
          var deltaLat = ((toLat - fromLat) * Math.PI) / 180;
          var deltaLon = ((toLon - fromLon) * Math.PI) / 180;

          var a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(gToLat) *
              Math.cos(gFromLat) *
              Math.sin(deltaLon / 2) *
              Math.sin(deltaLon / 2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          var d = (radius * c) / 1000;
          return d.toFixed(3); //returns distance in 0.000 km
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
      this.tapahtumatSourse.next(this.tapahtumat);
    } catch (error) {
      console.error(error);
    }
    this.waitingPlaces = false;
  }

  setFilter(value: string) {
    this.searchTerm = value;
    this.tapahtumatSourse.next(
      this.tapahtumat.filter((t) =>
        t.luokka.toLowerCase().includes(value.toLowerCase())
      )
    );
  }

  constructor() {}
}
