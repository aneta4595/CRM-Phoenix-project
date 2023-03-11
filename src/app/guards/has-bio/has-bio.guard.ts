import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { UserService } from '../../services/user.service';

@Injectable({ providedIn: 'root' })
export class HasBioGuard implements CanActivate {
  constructor(private _userService: UserService, private _router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):

     Observable<boolean | UrlTree>
{
   return this._userService.getUserBio().pipe(
    catchError((err: HttpErrorResponse) => {
        if(err.status === 404) {
            return of('error');
        }
        return throwError(() => err);
    }),
    map((response) => {
        return response === 'error' 
        ? this._router.parseUrl('/complete-profile') 
        : true;
    })
   )
  }
}
