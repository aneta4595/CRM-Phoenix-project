import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(true)
  });

  constructor(private _authService: AuthService, private _router: Router, private _cd: ChangeDetectorRef) {
  }

  onLoginFormSubmitted(loginForm: FormGroup): void {
    if(loginForm.invalid) {
      return
    }
    this._authService.login({
      data: {
        email: loginForm.value.email,
        password: loginForm.value.password,
      },
    },
    loginForm.value.rememberMe

    ).pipe(take(1)).subscribe({
      next: () => this._router.navigate(['/leads']),
      error: () => this.loginForm.setErrors({beValidation: true})
    });
    this._cd.markForCheck()
  }
}
