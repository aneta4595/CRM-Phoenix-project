import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'passwordError'
})
export class PasswordErrorPipe implements PipeTransform {

  transform(value: ValidationErrors | null | undefined): string {
    if(value === null || value === undefined) return '';

    if(value['capitalCharacterValidator'] !== undefined) return 'Must contain at least 1 capital character';
    if(value['minLengthCharacterValidator'] !== undefined) return 'Minimum of 6 characters';
    if(value['numberCharacterValidator'] !== undefined) return 'Must contain at least 1 number character';
    if(value['specialCharacterValidator'] !== undefined) return 'Must contain at least 1 special character !@#$%^&*()';
    if(value['smallCharacterValidator'] !== undefined) return 'Must contain at least 1 small character';

    return 'Password is invalid'
  }

}
