import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CompleteProfileComponent } from './complete-profile.component';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule],
  declarations: [CompleteProfileComponent],
  providers: [],
  exports: [CompleteProfileComponent]
})
export class CompleteProfileComponentModule {
}
