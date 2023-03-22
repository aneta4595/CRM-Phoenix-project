import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LeadModel } from '../models/lead.model';
import { LeadsResponse } from '../response/leads.response';
import { ActivityModel } from '../models/activity.model';
import { ActivitiesResponse } from '../response/activities.response';

@Injectable({ providedIn: 'root' })
export class LeadsService {
  constructor(private _httpClient: HttpClient) {}

  getAllLeads(): Observable<LeadModel[]> {
    return this._httpClient
      .get<LeadsResponse<LeadModel[]>>(
        'https://us-central1-courses-auth.cloudfunctions.net/leads'
      )
      .pipe(map((response) => response.data));
  }

  getAllActivities(): Observable<ActivityModel[]> {
    return this._httpClient
      .get<ActivitiesResponse<ActivityModel[]>>(
        'https://us-central1-courses-auth.cloudfunctions.net/leads/activities'
      )
      .pipe(map((response) => response.data));
  }

  createLeads(createLead: LeadsResponse<LeadModel>): Observable<any> {
    return this._httpClient.post<any>(
      'https://us-central1-courses-auth.cloudfunctions.net/leads',
      createLead
    )
  }
}
