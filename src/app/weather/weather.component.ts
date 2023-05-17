import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PlacesService } from '../places.service';
import { faClock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  city = 'Helsinki';
  currentPosition!: { latitude: number, longitude: number };
  key = '24f3dc36e8779f81f566b7850c7e3f5e';
  units = 'metric';
  lang = 'fi';
  //url = `http://api.openweathermap.org/data/2.5/forecast?lat=${this.currentPosition.latitude}&lon=${this.currentPosition.longitude}&appid=${this.key}&units=${this.units}&lang=${this.lang}`;
  weatherForcast: any = [];
  weather: any;
  day: any;
  faClock = faClock;

  constructor(private places: PlacesService){}

  ngOnInit(): void {
    this.places.getCurrentPositionObservable().subscribe((position) => {
      this.currentPosition = position;
    this.getWeatherForecast();
  });
  }

  getWeatherForecast(){
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${this.currentPosition.latitude}&lon=${this.currentPosition.longitude}&appid=${this.key}&units=${this.units}&lang=${this.lang}`)
    .then(resp=>{
      if(!resp.ok) throw new Error(resp.statusText)
      return resp.json()
    })
    .then(data => {
      this.weatherForcast = data.list;
      this.city = data.city.name;
      this.day = data.list[0].dt_txt.slice(0,10);
    })
    .catch(console.error);
  }

  date(value: number){
    return new Date(value * 1000).toLocaleTimeString().slice(0,5);
  }
}
