import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import { Tapahtuma } from 'src/shared/interfaces';
import { Router } from '@angular/router'
@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit {
  tapahtumat: Tapahtuma[] = [];
  
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.haeTapahtumat();
  }

  async haeTapahtumat(): Promise<void> {
    try {
      const response = 
        await axios.get('/places/');
      console.log(response);
      const tapahtumat = response.data.data.map((tapahtuma: any) => ({
        nimi: tapahtuma.name?.fi ?? '',
        kuvaus: tapahtuma.description.body.split('.')[0],
        sijaintiLeveys: tapahtuma.location.lat,
        sijaintiPituus: tapahtuma.location.lon,
        luokka: tapahtuma.tags.map((tag: any) => tag.name),
        email: tapahtuma.info_url
      }));
      this.tapahtumat = tapahtumat;
      // console.log(this.tapahtumat);
      
    } catch (error) {
      console.error(error);
    }
  }
@Output() tapahtumatLahetetty = new EventEmitter<string>();
  
navigateToDetails(nimi: string, kuvaus: string, email:string) {
  const data = {nimi: nimi, kuvaus: kuvaus, email: email};
  this.router.navigate(['/places-detail'], { queryParams: data });
  this.tapahtumatLahetetty.emit(JSON.stringify(data));
  // console.log(data);
}

}