import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { Router } from '@angular/router';
import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';

const minTenWordsValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const bioTextArea = control.value as string;
  if(bioTextArea) {
    return bioTextArea.match(/(\s\S+){9,}/)
    ? null
    : {minTenWordsValidator: true}
  } else return null
};

const minTwoSentenceValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const bioTextArea = control.value as string;
  if(bioTextArea) {
    return bioTextArea.match(/.+[.!?].+\w+/)
    ? null
    : {minTwoSentenceValidator: true}
  } else return null
};

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteProfileComponent {
  readonly bioForm: FormGroup = new FormGroup({ 
    bioTextArea: new FormControl('', [Validators.required, minTenWordsValidator, minTwoSentenceValidator]) 
  });

  readonly user$: Observable<UserModel> = this._userService.getUser();

  constructor(private _userService: UserService, private _router: Router) {
  }

  onLoginFormSubmitted(bioForm: FormGroup): void {
    if(bioForm.invalid) {
      return 
    }
    this._userService.postUserBio(bioForm.value.bioTextArea).pipe(take(1)).subscribe({
      next: () => this._router.navigate(['/leads'])
    });


  }
}
