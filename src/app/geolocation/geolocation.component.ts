import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.css']
})
export class GeolocationComponent implements OnInit {
  latitude?: Number; 
  longitude?: Number;

  faLocationDot = faLocationDot;
  address: string = '';
  addressCoords = [];

  constructor(public places: PlacesService) {}

  ngOnInit() {
    if (!navigator.geolocation) {
      console.log('location is not supported')
    }
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      // console.log(
      //   `lat: ${position.coords.latitude}, lon: ${position.coords.longitude}`
      // )
    })
  }

  findAddress() {
    var addressArr: any;
    var url = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q=" + this.address + ",helsinki";
    fetch(url)
      .then(response => response.json())
      .then(data => addressArr = data)
      .then(show => console.log(addressArr))
      .then(lat => this.latitude = addressArr[0].lat)
      .then(lon => this.longitude = addressArr[0].lon)
      .catch(err => console.log(err));
  }

}