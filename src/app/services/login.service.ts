import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HasDataModel } from '../models/has-data.model';
import { LoginModel } from '../models/login.model';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private _accessTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this._storage.getItem('accessToken'));
  public accessToken$: Observable<string | null> = this._accessTokenSubject.asObservable();

  constructor(private _httpClient: HttpClient, private _storage: Storage) {
  }

  login(login: HasDataModel<LoginModel>): Observable<any> {
    return this._httpClient.post<any>('https://us-central1-courses-auth.cloudfunctions.net/auth/login', login).pipe(
      tap((response) => {
        this._accessTokenSubject.next(response.data.accessToken);
        this._storage.setItem('accessToken', response.data.accessToken)
      })
    )
  }
}
