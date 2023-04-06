import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from './search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'OHJPRO2';

  searchTerm!: string;
  subscription!: Subscription;

  constructor(private search: SearchService) {}

  ngOnInit(): void {
    this.subscription = this.search.currentSearch.subscribe(searchTerm => this.searchTerm = searchTerm)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
