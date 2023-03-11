import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { map, share, shareReplay, tap } from 'rxjs/operators';
import { HasDataModel } from '../models/has-data.model';
import { LoginModel } from '../models/login.model';
import { RegisterModel } from '../models/register.model';
import { UserModel } from '../models/user.model';
import { AuthMeResponse } from '../auth-me.response';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _accessTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this._storage.getItem('accessToken'));
  public accessToken$: Observable<string | null> = this._accessTokenSubject.asObservable();

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
    console.log('register: ', register)
    return this._httpClient.post<any>('https://us-central1-courses-auth.cloudfunctions.net/auth/register2', register).pipe(
      map((response) => ({
        accessToken: response.data.user.stsTokenManager.accessToken,
      })),
      tap((token) => this.loginUser(token, false))
    )
  };



  loginUser(token: { accessToken: string }, rememberMe: boolean): void {
    this._accessTokenSubject.next(token.accessToken);
    if (rememberMe) {
      this._storage.setItem('accessToken', token.accessToken)
    }
  }


  getUser(): Observable<UserModel> {
    return this._httpClient.get<AuthMeResponse<UserModel>>('https://us-central1-courses-auth.cloudfunctions.net/auth/me').pipe(
      map((response) => response.data.user.context)
    )
  }
}


