import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.css']
})
export class GeolocationComponent implements OnInit {
  latitude?: Number;
  longitude?: Number;

  ngOnInit() {
    if (!navigator.geolocation) {
      console.log('location is not supported')
    }
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      console.log(
        `lat: ${position.coords.latitude}, lon: ${position.coords.longitude}`
      )
    })
  }
}