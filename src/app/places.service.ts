import { Injectable } from '@angular/core';
import { ScrollTapahtuma, Tapahtuma } from 'src/shared/interfaces';
import axios from 'axios';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  tapahtumat: Tapahtuma[] = [];
  scrollTapahtumat: ScrollTapahtuma[] = [];
  private tapahtumatSourse = new BehaviorSubject(this.tapahtumat);
  currentTapahtumat = this.tapahtumatSourse.asObservable();

  async haeTapahtumat(): Promise<void> {
    try {
      const response = 
        await axios.get(`/places/`);
        // console.log(response);
        this.tapahtumat = response.data.data.map((tapahtuma: any) => {
        const { street_address, postal_code, locality } = tapahtuma.location.address;
        const osoite = `${street_address}, ${postal_code}, ${locality}`;

      // if(this.searchTerm){
      //   this.tapahtumat = this.tapahtumat.filter(tapahtuma =>
      //   tapahtuma.nimi.toLocaleLowerCase().includes(this.searchTerm.toLocaleLowerCase())
      //   )};
        
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
      this.tapahtumatSourse.next(this.tapahtumat)
      // console.log(this.tapahtumat);
      
    } catch (error) {
      console.error(error);
    }
  }


  constructor() { }
}
