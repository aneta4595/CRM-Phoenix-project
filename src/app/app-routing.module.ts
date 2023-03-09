import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LeadsComponent } from './components/leads/leads.component';
import { LoginComponentModule } from './components/login/login.component-module';
import { LeadsComponentModule } from './components/leads/leads.component-module';
import { IsLoggedInGuard } from './guards/is-logged-in/is-logged-in.guard';

const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'leads', component: LeadsComponent, canActivate: [IsLoggedInGuard] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    LoginComponentModule,
    LeadsComponentModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
