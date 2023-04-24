import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router'

import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';

import { User } from '../models/user';
import { ErrorHandlerService } from './error-handler.service';

type TokenAndId = {
  token: string;
  userId: Pick<User, "id">;
  name: Pick<User, "name">
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "http://localhost:3000/auth";

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);

  userName$ = new BehaviorSubject<string>("");

  userId!: Pick<User, "id">;

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
        catchError(this.errorHandlerService.handleError<User>("signup"))
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
          this.userId = tokenObject.userId;
          localStorage.setItem("token", tokenObject.token);
          this.userName$.next(name);
          this.isUserLoggedIn$.next(true);
          this.router.navigate(["posts"]);
        }),
        catchError(
          this.errorHandlerService.handleError<{
            token: string;
            userId: Pick<User, "id">;
          }>("login")
        )
      );
  }
}
