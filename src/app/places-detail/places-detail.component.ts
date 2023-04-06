import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-places-detail',
  templateUrl: './places-detail.component.html',
  styleUrls: ['./places-detail.component.css'],
})
export class PlacesDetailComponent {
  receivedData?: {
    nimi: string;
    kuvaus: string;
    homesite: string;
    osoite: string;
  };
  private subscription?: Subscription;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.subscription = this.route.queryParams.subscribe((params) => {
      if (
        params['nimi'] &&
        params['kuvaus'] &&
        params['homesite'] &&
        params['osoite']
      ) {
        this.receivedData = {
          nimi: params['nimi'],
          kuvaus: params['kuvaus'],
          homesite: params['homesite'],
          osoite: params['osoite'],
        };
        console.log(this.receivedData);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
