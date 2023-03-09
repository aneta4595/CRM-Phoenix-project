import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { LoginService } from './services/login.service';

@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {

  constructor(private _loginService: LoginService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this._loginService.accessToken$.pipe(
      switchMap((token) => {
        const newRequest = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${token}`)
        });
        return next.handle(newRequest);
      })
    )
   
  }
}
