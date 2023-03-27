import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import { Tapahtuma } from 'src/shared/interfaces';
@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit {
  tapahtumat: Tapahtuma[] = [];
  
  constructor(private http: HttpClient) { }

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
        kuvaus: tapahtuma.description.intro,
        sijaintiLeveys: tapahtuma.location.lat,
        sijaintiPituus: tapahtuma.location.lon
      }));
      this.tapahtumat = tapahtumat;
      console.log(this.tapahtumat);
    } catch (error) {
      console.error(error);
    }
  }
  
}