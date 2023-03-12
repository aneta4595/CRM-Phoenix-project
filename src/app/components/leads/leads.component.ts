import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LeadModel } from '../../models/lead.model';
import { ActivityModel } from '../../models/activity.model';
import { AuthService } from '../../services/auth.service';
import { LeadsService } from '../../services/leads.service';
import { LeadQueryModel } from 'src/app/query-models/lead.query-model';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadsComponent {
  private _hamburgerMenuUserSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public hamburgerMenuUser$: Observable<boolean> = this._hamburgerMenuUserSubject.asObservable();

readonly leadsAndActivities$: Observable<LeadQueryModel[]> = combineLatest([
  this._leadsService.getAllLeads(),
  this._leadsService.getAllActivities()
]).pipe(
map(([leads, activities]: [LeadModel[], ActivityModel[]]) => this._mapToLeadQuery(leads, activities))
)

  constructor(private _authService: AuthService, private _router: Router, private _leadsService: LeadsService) {
  }

  logout(): void {
    this._authService.logout();
    this._router.navigate(['/logged-out'])
  }

  hamburgerMenuUser() {
    this.hamburgerMenuUser$.pipe(take(1),
      tap((isShow) => this._hamburgerMenuUserSubject.next(!isShow))).subscribe()
  }


  private _mapToLeadQuery(leads: LeadModel[], activities: ActivityModel[]): LeadQueryModel[] {
    const activitiesMap = activities.reduce((a,c) => ({...a, [c.id]: c}),
    
    {}
    ) as Record <string, ActivityModel>;

    return leads.map((l) => {
      return {
        location: l.location,
        companySize: l.companySize,
        hiring: l.hiring,
        websiteLink: l.websiteLink,
        linkedinLink: l.linkedinLink,
        industry: l.industry,
        name: l.name,
        annualRevenue: l.annualRevenue,
        scopes: (l.activityIds ?? []).map((id) => activitiesMap[id]?.name)
      }
    })
  }
}
