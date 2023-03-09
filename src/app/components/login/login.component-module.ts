import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { MatFormFieldModule } from '@angular/material/form-field';




@NgModule({
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule],
  declarations: [LoginComponent],
  providers: [],
  exports: [LoginComponent]
})
export class LoginComponentModule {
}
