import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateLeadComponent } from './create-lead.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [CreateLeadComponent],
  providers: [],
  exports: [CreateLeadComponent]
})
export class CreateLeadComponentModule {
}
