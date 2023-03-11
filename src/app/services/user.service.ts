import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthMeResponse } from '../auth-me.response';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private _httpClient: HttpClient) {
  }

  getUser(): Observable<UserModel> {
    return this._httpClient.get<AuthMeResponse<UserModel>>('https://us-central1-courses-auth.cloudfunctions.net/auth/me').pipe(
      map((response) => response.data.user.context),
      shareReplay(1)
    )
  }

  postUserBio(bio: string): Observable<void> {
    return this._httpClient.post<void>(`https://us-central1-courses-auth.cloudfunctions.net/auth/add-bio`, {
      data: {
        content: bio
      }
    });
  }

  getUserBio(): Observable<void> {
    return this._httpClient.get<void>('https://us-central1-courses-auth.cloudfunctions.net/auth/my-bio');
  }
}
