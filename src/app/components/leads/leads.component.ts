import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest, from, of } from 'rxjs';
import { filter, map, shareReplay, startWith, switchMap, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActivityModel } from '../../models/activity.model';
import { LeadSizeModel } from '../../models/lead-size.model';
import { LeadQueryModel } from '../../query-models/lead.query-model';
import { LeadModel } from '../../models/lead.model';
import { FilterValueQueryModel } from '../../query-models/filter-value.query-model';
import { AuthService } from '../../services/auth.service';
import { LeadsService } from '../../services/leads.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadsComponent {
  private _filterModalSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public filterModal$: Observable<boolean> =
    this._filterModalSubject.asObservable();

  private _hamburgerMenuUserSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public hamburgerMenuUser$: Observable<boolean> =
    this._hamburgerMenuUserSubject.asObservable();

  readonly scopeForm: FormGroup = new FormGroup({});
  readonly sizeForm: FormGroup = new FormGroup({});

  readonly filterForm: FormGroup = new FormGroup({
    scope: this.scopeForm,
    size: this.sizeForm,
  });

  readonly activitiesList$: Observable<ActivityModel[]> = this._leadsService
    .getAllActivities()
    .pipe(take(1),
      tap((data) => this.onActivityListAddControl(data)),
      shareReplay(1)
    );

  readonly leadSizeList$: Observable<LeadSizeModel[]> = of([
    { rangeId: '1', from: 0, to: 50 },
    { rangeId: '2', from: 51, to: 100 },
    { rangeId: '3', from: 101, to: 500 },
    { rangeId: '4', from: 501, to: 1000 },
    { rangeId: '5', from: 1001, to: null },
  ]).pipe(tap((data) => this.onLeadSizeListAddControls(data)),
  shareReplay(1));

  readonly selectedSize$: Observable<string[]> =
    this.sizeForm.valueChanges.pipe(
      startWith([]),
      map((sizeIds) =>
        Object.keys(sizeIds).reduce((acc: string[], curr) => {
          if (sizeIds[curr]) {
            return [...acc, curr];
          }
          return acc;
        }, [])
      )
    );

    readonly selectedScope$: Observable<string[]> =
    this.scopeForm.valueChanges.pipe(
      startWith([]),
      map((scopes) =>
        Object.keys(scopes).reduce((acc: string[], curr) => {
          if (scopes[curr]) {
            return [...acc, curr];
          }
          return acc;
        }, [])
      )
    );


    readonly selectedSizeList$: Observable<LeadSizeModel[]> = combineLatest([
      this.selectedSize$,
      this.leadSizeList$
    ]).pipe(map(([sizeIds, leadSizes]) => this.mapSizeIdsToSizeModelList(leadSizes, sizeIds)));
    

readonly leadListFilter$: Observable<LeadModel[]> = combineLatest([
  this._leadsService.getAllLeads().pipe(take(1)),
  this.selectedScope$,
  this.selectedSizeList$
]).pipe(
  map(([leadsList, scopes, sizes]) => {
    return leadsList.filter((lead) => {
      let setOfIds = new Set(lead.activityIds);
      return scopes.every((scope) => setOfIds.has(scope))
      || scopes.length === 0;
    })
    .filter((lead) => sizes.find((size) => lead.companySize.total >= size.from && (
      size.to ? lead.companySize.total <= size.to : true)
      ) || sizes.length === 0
      )
  })
);

readonly leadList$: Observable<LeadQueryModel[]> = this.leadListFilter$.pipe(
  switchMap((leadList) => 
  this.activitiesList$.pipe(map((activityList) => this._mapToLeadQuery(leadList, activityList)))
  )
)


  readonly leadsAndActivities$: Observable<LeadQueryModel[]> = combineLatest([
    this._leadsService.getAllLeads(),
    this._leadsService.getAllActivities(),
  ]).pipe(
    map(([leads, activities]: [LeadModel[], ActivityModel[]]) =>
      this._mapToLeadQuery(leads, activities)
    ),
    shareReplay(1)
  );


  readonly isAdmin$: Observable<boolean> = this._userService.getUser().pipe(
    map((response) => {
      return response.role === 'admin' ? true : false;
    })
  );

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _leadsService: LeadsService,
    private _userService: UserService
  ) {}

  logout(): void {
    this._authService.logout();
    this._router.navigate(['/logged-out']);
  }

  hamburgerMenuUser() {
    this.hamburgerMenuUser$
      .pipe(
        take(1),
        tap((isShow) => this._hamburgerMenuUserSubject.next(!isShow))
      )
      .subscribe();
  }

  private _mapToLeadQuery(
    leads: LeadModel[],
    activities: ActivityModel[]
  ): LeadQueryModel[] {
    const activitiesMap = activities.reduce(
      (a, c) => ({ ...a, [c.id]: c }),

      {}
    ) as Record<string, ActivityModel>;

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
        scopes: (l.activityIds ?? []).map((id) => activitiesMap[id]?.name),
      };
    });
  }
  showFilterModal() {
    console.log('show: ');
    this.filterModal$
      .pipe(
        take(1),
        tap(() => this._filterModalSubject.next(true))
      )
      .subscribe();
  }

  hideFilterModal() {
    this.filterModal$
      .pipe(
        take(1),
        tap(() => this._filterModalSubject.next(false))
      )
      .subscribe();
  }

  resetFilterForm(): void {
    this.filterForm.reset();
  }

  onLeadSizeListAddControls(leadSizeList: LeadSizeModel[]): void {
    leadSizeList.forEach((leadSize) =>
      this.sizeForm.addControl(leadSize.rangeId, new FormControl(false))
    );
  }
  onActivityListAddControl(activityList: ActivityModel[]): void {
    activityList.forEach((activity) =>
      this.scopeForm.addControl(activity.id, new FormControl(false))
    );
  }

  private mapSizeIdsToSizeModelList(sizeList: LeadSizeModel[], sizeIds: string[]): LeadSizeModel[] {
    const sizeMap = sizeList.reduce((a,c) => ({...a,[c.rangeId]:c}),
    {}
    ) as Record<string, LeadSizeModel>
    return sizeIds.map((sizeId) => sizeMap[sizeId])
  }
}
