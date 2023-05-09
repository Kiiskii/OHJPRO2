import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from '../search.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  token: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  userNameLogin!: Observable<string | null>;
  faMagnifyingGlass = faMagnifyingGlass;
  faUser = faUser;

  searchTerm!: string;
  subscription!: Subscription;

  constructor(private search: SearchService, private authService: AuthService) {}

  get userName(): Observable<string | null> {
    return this.authService.userName$;
  }

  ngOnInit(): void {
    this.subscription = this.search.currentSearch.subscribe(searchTerm => this.searchTerm = searchTerm);
    const token = localStorage.getItem('token');
    if (token) {
      this.token.next(token);
    } else {
      this.token.next(null);
    };
    this.userNameLogin = this.authService.userName$;
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  newSearch() {
    this.search.changeSearch(this.searchTerm)
    //console.log(this.searchTerm)
  }

  logout(): void {
    this.authService.logout();
  }
    
}
