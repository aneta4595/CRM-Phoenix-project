import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from '../../services/auth.service';

const minLengthCharacterValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const regex = /[a-zA-Z0-9!@#$%^&*()]{8,}/;
  if(regex.test(control.value)) {
    return null;
  }
  return {
    minLengthCharacterValidator: true
  }
};

const numberCharacterValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const regex = /[0-9]/;
  if(regex.test(control.value)) {
    return null;
  }
  return {
    numberCharacterValidator: true
  }
};

const specialCharacterValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const regex = /[!@#$%^&*()]/;
  if(regex.test(control.value)) {
    return null;
  }
  return {
    specialCharacterValidator: true
  }
};

const capitalCharacterValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const regex = /[A-Z]/;
  if(regex.test(control.value)) {
    return null;
  }
  return {
    capitalCharacterValidator: true
  }
};

const smallCharacterValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const regex = /[a-z]/;
  if(regex.test(control.value)) {
    return null;
  }
  return {
    smallCharacterValidator: true
  }
};

const samePasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value
  
  if(password === confirmPassword) {
    return null;
  }
  return {
    samePasswordValidator: true
  }
};


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  readonly registerForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      minLengthCharacterValidator,
      numberCharacterValidator,
      specialCharacterValidator,
      capitalCharacterValidator,
      smallCharacterValidator
    ]),
    confirmPassword: new FormControl(),
    termsPolicy: new FormControl(false, [Validators.requiredTrue])
  },
  { validators: samePasswordValidator}
  );

  constructor(private _authService: AuthService, private _router: Router, private cd: ChangeDetectorRef) {
  }

  onRegisterFormSubmitted(registerForm: FormGroup): void {
    if(registerForm.invalid) {
      return 
    }
    this._authService.register({
      data: {
        email: registerForm.value.email,
        password: registerForm.value.password
      }
    }).pipe(take(1)).subscribe({
      next: () => this._router.navigate(['/leads']),
      error: (err) => registerForm.setErrors({beValidation: err.error.message})
      
    });
    this.cd.markForCheck()
    
  }
}
