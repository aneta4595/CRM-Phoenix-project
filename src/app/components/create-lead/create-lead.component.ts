import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActivityModel } from '../../models/activity.model';
import { LeadModel } from '../../models/lead.model';
import { AuthService } from '../../services/auth.service';
import { LeadsService } from '../../services/leads.service';

@Component({
  selector: 'app-create-lead',
  templateUrl: './create-lead.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateLeadComponent {
  private _hamburgerMenuUserSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public hamburgerMenuUser$: Observable<boolean> =
    this._hamburgerMenuUserSubject.asObservable();

  readonly activitiesList$: Observable<ActivityModel[]> =
    this._leadsService.getAllActivities().pipe(
      tap(data => this.setControls(data))
    );

  readonly companySizeList$: Observable<string[]> = of(['totalSize', 'devSize', 'feSize'])

  readonly activities: FormGroup = new FormGroup({}, [Validators.required]);


  readonly createLeadForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    websiteLink: new FormControl('', [Validators.required, Validators.pattern(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)]),
    linkedinLink: new FormControl('', [Validators.required, Validators.pattern( /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)/)]),
    location: new FormControl('', [Validators.required]),
    industry: new FormControl('', [Validators.required]),
    annualRevenue: new FormControl('', [Validators.required]),
    activities: this.activities,
    total: new FormControl('', [Validators.required, Validators.min(1)]),
    dev: new FormControl('', [Validators.required, Validators.min(1)]),
    fe: new FormControl('', [Validators.required, Validators.min(1)]),
    active: new FormControl(false, [Validators.required]),
    junior: new FormControl(false, [Validators.required]),
    talentProgram: new FormControl(false, [Validators.required]),
    notes: new FormControl(),
  });
  readonly leadList$: Observable<LeadModel[]> = this._leadsService.getAllLeads();

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _leadsService: LeadsService
  ) { }


  onCreateLeadFormSubmitted(createLeadForm: FormGroup): void {
    console.log('form: ', createLeadForm)

    this._leadsService.createLeads({
        data: {
        name: createLeadForm.value.name,
        websiteLink: createLeadForm.value.websiteLink,
        linkedinLink: createLeadForm.value.linkedinLink,
        location: createLeadForm.value.location,
        industry: createLeadForm.value.industry,
        hiring: {
          active: createLeadForm.value.active,
          junior: createLeadForm.value.junior,
          talentProgram: createLeadForm.value.talentProgram
        },
        companySize: {
          total: createLeadForm.value.total,
          dev: createLeadForm.value.dev,
          fe: createLeadForm.value.fe
        },
        annualRevenue: createLeadForm.value.annualRevenue,
        activityIds: Object.keys(this.activities.value).filter((k) => this.activities.value[k] === true),
        
      }
    }).pipe(take(1)).subscribe({
      next: () => this._router.navigate(['/leads'])
    });

  }

  hamburgerMenuUser() {
    this.hamburgerMenuUser$
      .pipe(
        take(1),
        tap((isShow) => this._hamburgerMenuUserSubject.next(!isShow))
      )
      .subscribe();
  }

  logout(): void {
    this._authService.logout();
    this._router.navigate(['/logged-out']);
  }

  setControls(activitiesIds: ActivityModel[]): void {
    activitiesIds.forEach(
      activitiesIds => this.activities.addControl(
        activitiesIds.name, new FormControl(false)
      )
    )
  }

}
