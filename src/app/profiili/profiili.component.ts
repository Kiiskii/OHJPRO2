import { Component, OnInit } from '@angular/core';
import { Tapahtuma } from 'src/shared/interfaces';
import axios from 'axios';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profiili',
  templateUrl: './profiili.component.html',
  styleUrls: ['./profiili.component.css'],
})
export class ProfiiliComponent implements OnInit {
  bgimg: string = 'bg-login-desktop.jpg';
  tapahtumat: Tapahtuma[] = [];
  favoriteIds?: any[];
  
  constructor (
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    //this.haeFavorites();
    this.http.get<any[]>('http://localhost:3000/favorites')
    .subscribe({
      next: (response) => {
        this.favoriteIds = response.map((item) => item.favid);
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
