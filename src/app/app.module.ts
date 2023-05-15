import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PlacesComponent } from './places/places.component';
import { PlacesDetailComponent } from './places-detail/places-detail.component';
import { FooterComponent } from './footer/footer.component';
import { MapComponent } from './map/map.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GeolocationComponent } from './geolocation/geolocation.component';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { OrderModule } from 'ngx-order-pipe';
import { ProfiiliComponent } from './profiili/profiili.component';
import { NgxPaginationModule } from 'ngx-pagination';

import * as L from 'leaflet';
import { WeatherComponent } from './weather/weather.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PlacesComponent,
    PlacesDetailComponent,
    FooterComponent,
    MapComponent,
    GeolocationComponent,
    LoginComponent,
    SignupComponent,
    ProfiiliComponent,
    WeatherComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    FontAwesomeModule,
    FormsModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule,
    OrderModule,
    NgxPaginationModule,
  ],
  providers: [MapComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
