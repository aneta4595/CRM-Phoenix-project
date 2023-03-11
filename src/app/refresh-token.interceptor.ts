import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

  constructor(private _authService: AuthService, private _storage: Storage) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(err => {
      const newRefreshToken = this._storage.getItem('refreshToken')
      if(err.status === 403 && err.error.message === 'Token is invalid' && newRefreshToken) {

        return this._authService.refreshToken(newRefreshToken).pipe(
          switchMap((credentials) => {
            const newRequest = request.clone({
              headers: request.headers.set('Authorization', `Bearer ${credentials}`)
            });
            return next.handle(newRequest)
          })
        )
      }
      return throwError(() => err)
      
    }))
  }
}
