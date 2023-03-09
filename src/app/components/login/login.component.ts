import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { LoginService } from '../../services/login.service';

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
  });

  constructor(private _loginService: LoginService, private _router: Router, private _cd: ChangeDetectorRef) {
  }

  onLoginFormSubmitted(loginForm: FormGroup): void {
    if(loginForm.invalid) {
      return
    }
    this._loginService.login({
      data: {
        email: loginForm.value.password,
        password: loginForm.value.password,
      },
    },
    
    ).pipe(take(1)).subscribe({
      next: () => this._router.navigate(['/leads']),
      error: () => this.loginForm.setErrors({beValidation: true})
    });
    this._cd.markForCheck()
  }
}
