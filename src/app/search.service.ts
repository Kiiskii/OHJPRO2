import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchSourse = new BehaviorSubject('');
  currentSearch = this.searchSourse.asObservable();

  constructor() { }

  changeSearch(searchTerm: string) {
    this.searchSourse.next(searchTerm)
  }
  
}
