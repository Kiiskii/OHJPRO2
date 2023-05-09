import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router'

import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';

import { User } from '../models/user';
import { ErrorHandlerService } from './error-handler.service';

type TokenAndId = {
  token: string;
  userId: number;
  name: string
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "http://localhost:3000/auth";

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);

  userName!: string;

  userName$ = new BehaviorSubject<string | null>(localStorage.getItem("userName"));

  userId$ = new BehaviorSubject<number>(0);

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {}

  signup(user: Omit<User, "id">): Observable<User> {
    return this.http.post<User>(`${this.url}/signup`, user, this.httpOptions)
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<User>("signup")),
        tap(() => {
          this.router.navigate(["/login"]);
        })
      );    
  }

  login(
    name: string,
    email: Pick<User, "email">,
    password: Pick<User, "password">
  ): Observable<TokenAndId>{
    return this.http.post<TokenAndId>(
      `${this.url}/login`, { name, email, password }
    ).pipe(
        first(),
        tap(( tokenObject: TokenAndId ) => {
          const userId = tokenObject.userId;
          const userNameLogin = tokenObject.name;
          localStorage.setItem("token", tokenObject.token);
          localStorage.setItem("userName", userNameLogin);
          this.userName$.next(userNameLogin);
          this.userId$.next(userId);
          this.isUserLoggedIn$.next(true);
          this.router.navigate(["/places"]);
        }),

        catchError(
          this.errorHandlerService.handleError<{
            token: string;
            userId: number;
            name: string
          }>("login")
        )
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.userName$.next(null);
    this.isUserLoggedIn$.next(false);
    this.router.navigate(['/places']);
  }
}
