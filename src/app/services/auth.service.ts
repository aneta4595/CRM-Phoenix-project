import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { HasDataModel } from '../models/has-data.model';
import { LoginModel } from '../models/login.model';
import { RegisterModel } from '../models/register.model';
import { UserCredentialsModel } from '../models/user-credentials.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _accessTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this._storage.getItem('accessToken'));
  public accessToken$: Observable<string | null> = this._accessTokenSubject.asObservable();

  private _refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this._storage.getItem('refreshToken'));
  public refreshToken$: Observable<string | null> = this._refreshTokenSubject.asObservable();

  constructor(private _httpClient: HttpClient, private _storage: Storage) {
  }

  login(login: HasDataModel<LoginModel>, rememberMe: boolean): Observable<any> {
    return this._httpClient.post<any>('https://us-central1-courses-auth.cloudfunctions.net/auth/login', login).pipe(
      map((response) => ({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken
      })),
      tap((token) => this.loginUser(token, rememberMe))
    )

  }

  register(register: HasDataModel<RegisterModel>): Observable<any> {
    return this._httpClient.post<any>('https://us-central1-courses-auth.cloudfunctions.net/auth/register2', register).pipe(
      map((response) => ({
        accessToken: response.data.user.stsTokenManager.accessToken,
        refreshToken: response.data.user.stsTokenManager.refreshToken
      })),
      tap((token) => this.loginUser(token, false)),

    )
  };



  loginUser(token: UserCredentialsModel, rememberMe: boolean): void {
    this._accessTokenSubject.next(token.accessToken);
    this._refreshTokenSubject.next(token.refreshToken)
    if (rememberMe) {
      this._storage.setItem('accessToken', token.accessToken)
      this._storage.setItem('refreshToken', token.refreshToken)
    }
  }

  logout(): void {
    this._accessTokenSubject.next(null);
    this._refreshTokenSubject.next(null);
    this._storage.clear()
  }

  refreshToken(token: string) {
    return this._httpClient.post<any>('https://us-central1-courses-auth.cloudfunctions.net/auth/refresh', {
      data: {
        refreshToken: token
      }
    }).pipe(take(1), switchMap((credentials) => {
      this._storage.setItem('token', credentials.data.accessToken);
      this._accessTokenSubject.next(credentials.data.accessToken);
      return of(credentials)
    }))
  }
}


