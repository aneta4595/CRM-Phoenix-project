import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { LoginService } from '../../services/login.service';

@Injectable({ providedIn: 'root' })
export class IsLoggedInGuard implements CanActivate {
  constructor(private _loginService: LoginService, private _router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
   return this._loginService.accessToken$.pipe(
    map((isLoggedIn) => {
        return isLoggedIn
        ? true
        : this._router.parseUrl('auth/login')
    })
   )
  }
}
