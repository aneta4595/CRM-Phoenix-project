import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LeadsComponent } from './components/leads/leads.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyComponent } from './components/verify/verify.component';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { LogoutComponent } from './components/logout/logout.component';
import { LeadsTableComponent } from './components/leads-table/leads-table.component';
import { LoginComponentModule } from './components/login/login.component-module';
import { LeadsComponentModule } from './components/leads/leads.component-module';
import { RegisterComponentModule } from './components/register/register.component-module';
import { VerifyComponentModule } from './components/verify/verify.component-module';
import { CompleteProfileComponentModule } from './components/complete-profile/complete-profile.component-module';
import { LogoutComponentModule } from './components/logout/logout.component-module';
import { LeadsTableComponentModule } from './components/leads-table/leads-table.component-module';
import { AutoLoginGuard } from './guards/auto-login/auto-login.guard';
import { IsLoggedInGuard } from './guards/is-logged-in/is-logged-in.guard';
import { VerifiedGuard } from './guards/verified/verified.guard';
import { HasBioGuard } from './guards/has-bio/has-bio.guard';

const routes: Routes = [
  { path: 'auth/login', component: LoginComponent, canActivate: [AutoLoginGuard] },
  { path: 'leads', component: LeadsComponent, canActivate: [IsLoggedInGuard, VerifiedGuard, HasBioGuard] },
  { path: 'auth/register', component: RegisterComponent, canActivate: [AutoLoginGuard] },
  { path: 'verify', component: VerifyComponent },
  { path: 'complete-profile', component: CompleteProfileComponent },
  { path: 'logged-out', component: LogoutComponent },
  { path: 'leads-table', component: LeadsTableComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    LoginComponentModule,
    LeadsComponentModule,
    RegisterComponentModule,
    VerifyComponentModule,
    CompleteProfileComponentModule,
    LogoutComponentModule,
    LeadsTableComponentModule
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
