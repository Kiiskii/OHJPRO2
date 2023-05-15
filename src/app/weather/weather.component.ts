import { Component, OnInit } from '@angular/core';
import { faClock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  city = 'Helsinki';
  lat = 60.1695;
  lon = 24.9355;
  key = '24f3dc36e8779f81f566b7850c7e3f5e';
  units = 'metric';
  lang = 'fi';
  url = `http://api.openweathermap.org/data/2.5/forecast?lat=${this.lat}&lon=${this.lon}&appid=${this.key}&units=${this.units}&lang=${this.lang}`;
  weatherForcast: any = [];
  weather: any;
  day: any;
  faClock = faClock;

  constructor(){}

  ngOnInit(): void {
    this.getWeatherForecast();
  }

  getWeatherForecast(){
    fetch(this.url)
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
