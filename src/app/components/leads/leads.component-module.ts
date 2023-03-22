import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LeadsComponent } from './leads.component';
import { RouterModule } from '@angular/router';



@NgModule({
    declarations: [LeadsComponent],
    providers: [],
    exports: [LeadsComponent],
    imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class LeadsComponentModule {
}
