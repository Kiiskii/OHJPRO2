import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlacesComponent } from './places/places.component';
import { PlacesDetailComponent } from './places-detail/places-detail.component';
import { MapComponent } from './map/map.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: '', redirectTo: '/places', pathMatch: 'full' },
  { path: 'places', component: PlacesComponent },
  { path: 'places-detail', component: PlacesDetailComponent },
  { path: 'map', component: MapComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
