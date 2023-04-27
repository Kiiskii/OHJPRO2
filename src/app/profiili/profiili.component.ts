import { Component, OnInit } from '@angular/core';
import { Tapahtuma } from 'src/shared/interfaces';
import axios from 'axios';

@Component({
  selector: 'app-profiili',
  templateUrl: './profiili.component.html',
  styleUrls: ['./profiili.component.css'],
})
export class ProfiiliComponent implements OnInit {
  bgimg: string = 'bg-login-desktop.jpg';
  tapahtumat: Tapahtuma[] = [];

  ngOnInit(): void {
    //this.haeFavorites();
  }
}
