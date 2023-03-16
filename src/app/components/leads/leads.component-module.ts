import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LeadsComponent } from './leads.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [LeadsComponent],
  providers: [],
  exports: [LeadsComponent]
})
export class LeadsComponentModule {
}
