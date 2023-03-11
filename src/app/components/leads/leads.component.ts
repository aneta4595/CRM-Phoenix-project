import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadsComponent {
  private _hamburgerMenuUserSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public hamburgerMenuUser$: Observable<boolean> = this._hamburgerMenuUserSubject.asObservable();

  constructor(private _authService: AuthService, private _router: Router) {
  }

  logout(): void {
    this._authService.logout();
    this._router.navigate(['/logged-out'])
  }

  hamburgerMenuUser() {
    this.hamburgerMenuUser$.pipe(take(1),
    tap((isShow) => this._hamburgerMenuUserSubject.next(!isShow))).subscribe()
  }

}
