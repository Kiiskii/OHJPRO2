import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Tapahtuma } from 'src/shared/interfaces';
import { PlacesService } from '../places.service';
import { PlacesComponent } from '../places/places.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit {
  public map!: L.Map;
  @ViewChild('map', { static: true })
  mapContainer!: ElementRef;
  subscription!: Subscription;
  currentPosition!: { latitude: number; longitude: number };
  radius = 0.005;
  markers: L.Marker<any>[] = [];

  constructor(private places: PlacesService) {}

  ngOnInit(): void {
    this.getPlacesSubscription();
    this.places.getCurrentPositionObservable().subscribe((position) => {
      this.currentPosition = position;
      this.initMap();
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  getPlacesSubscription() {
    this.subscription = this.places.currentTapahtumat.subscribe((tapahtumat) =>
      this.placeMarkers(tapahtumat)
    );
  }

  private initMap(): void {
    if (this.map) {
      this.map.remove();
    }
    if (!this.currentPosition) {
      return;
    }

    this.map = L.map(this.mapContainer.nativeElement).setView(
      [this.currentPosition.latitude, this.currentPosition.longitude],
      15
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    const markerIcon = L.icon({
      iconUrl: `../../assets/img/markers/user-location-pointer.png`,
      iconSize: [30, 30], // size of the icon
      iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
    });

    const zooMarker = L.marker(
      [this.currentPosition.latitude, this.currentPosition.longitude],
      {
        icon: markerIcon,
      }
    )
      .bindPopup(`<b class="text-orange-500">Olet tässä</b>`)
      .addTo(this.map);
  }

  placeMarkers(tapahtumat: Tapahtuma[]) {
    let filteredTapahtumat = tapahtumat;

    this.markers.forEach((m) => this.map.removeLayer(m));
    this.markers = [];

    filteredTapahtumat.forEach((t) => {
      const markerIcon = L.icon({
        iconUrl: `../../assets/img/markers/place2-location-pointer.png`,
        iconSize: [14, 14], // size of the icon
        iconAnchor: [10, 0], // point of the icon which will correspond to marker's location
        popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
      });

      const marker = L.marker([t.sijaintiLeveys, t.sijaintiPituus], {
        icon: markerIcon,
      })
        .bindPopup(
          `<a href="${t.homesite}" target="_blank"><b class="text-cyan-600">${t.nimi}</b></a><br><b class="lowercase">${t.luokka}</b>`
        )
        .addTo(this.map);
      this.markers.push(marker);
    });
  }
}
