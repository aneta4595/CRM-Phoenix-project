import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordErrorPipe } from 'src/app/password-error.pipe';
import { RegisterComponent } from './register.component';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule],
  declarations: [RegisterComponent, PasswordErrorPipe],
  providers: [],
  exports: [RegisterComponent]
})
export class RegisterComponentModule {
}
