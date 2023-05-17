
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { Tapahtuma } from 'src/shared/interfaces';
import { PlacesService } from '../places.service';
import { PlacesComponent } from '../places/places.component';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  @ViewChild('map', { static: true }) mapContainer!: ElementRef;
  subscription!: Subscription;
  
  radius = 0.001
  markers:L.Marker<any> [] = []


  constructor(private places: PlacesService) { }

  ngOnInit(): void {
    this.getPlacesSubscription()
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
  getPlacesSubscription() {
    this.subscription = this.places.currentTapahtumat.subscribe(tapahtumat => this.placeMarkers(tapahtumat))
  }
  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([this.places.currentPosition.latitude, this.places.currentPosition.longitude], 13);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    const markerIcon = L.icon({
      iconUrl: `../../assets/img/markers/user-location-pointer.png`,
      iconSize: [46, 46], // size of the icon
      iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
    });
    const zooMarker = L.marker([60.1699, 24.9384], {
      icon: markerIcon
    }).addTo(this.map);
    
    
  }
  placeMarkers(tapahtumat: Tapahtuma[]){
    let filteredTapahtumat = tapahtumat.filter(t=>
      t.sijaintiLeveys<this.places.currentPosition.latitude+this.radius && 
      t.sijaintiLeveys > this.places.currentPosition.latitude - this.radius &&
      t.sijaintiPituus < this.places.currentPosition.longitude + this.radius &&
      t.sijaintiPituus > this.places.currentPosition.longitude - this.radius)
      
    this.markers.forEach(m=>this.map.removeLayer(m))
    this.markers = []

    
    filteredTapahtumat.forEach(t=> {
      const markerIcon = L.icon({
        iconUrl: `../../assets/img/markers/place-location-pointer.png`,
        iconSize: [46, 46], // size of the icon
        iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
      });
      const marker = L.marker([t.sijaintiLeveys, t.sijaintiPituus], {
        
        icon: markerIcon
      }).addTo(this.map);
      this.markers.push(marker)
    })

  }
}
