import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { UserService } from '../../services/user.service';

@Injectable({ providedIn: 'root' })
export class IsAdminGuard implements CanActivate {
  constructor(private _userService: UserService, private _router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this._userService.getUser().pipe(
        map((response) => {
            return response.role === 'admin'
            ? true
            : this._router.parseUrl('/verify')
        })
    )
  }
}
