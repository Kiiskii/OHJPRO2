import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.css']
})
export class GeolocationComponent implements OnInit {
  latitude = 60.171944; 
  longitude = 24.941389;
  subscription!: Subscription;
  faLocationDot = faLocationDot;
  address: string = '';
  addressCoords = [];
  addressResult: string = '';

  private map!: L.Map;

  constructor(public places: PlacesService) {
  }

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
    });
  }

  findAddress() {
    var addressArr: any;
    var url = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q=" + this.address + ",helsinki";
    fetch(url)
      .then(response => response.json())
      .then(data => addressArr = data)
      //.then(show => console.log(addressArr))
      .then(lat => this.latitude = addressArr[0].lat)
      .then(lon => this.longitude = addressArr[0].lon)
      .then(log => this.addressResult = addressArr[0].display_name)
      .catch(err => console.log(err));
  }

  refreshCurrentCoords(){
    this.places.setCoords(this.latitude, this.longitude);
    }

  getGeolocation(){
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;    
      });
      this.places.setCoords(this.latitude, this.longitude);
  }
    
  }
  
