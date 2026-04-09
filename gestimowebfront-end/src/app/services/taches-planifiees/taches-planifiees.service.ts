import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ScheduledTaskConfig {
  id?: number;
  idAgence?: number;
  managerEmail?: string;
  dayOfMonth?: number;
  executionHour?: number;
  executionMinute?: number;
  enabled?: boolean;
  nextExecutionAt?: string | null;
  lastExecutionAt?: string | null;
  lastExecutionPeriod?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class TachesPlanifieesService {
  private readonly apiBaseUrl = environment.serverUrl
    .replace(/\/actuator\/?$/, '')
    .replace(/\/+$/, '');

  constructor(private readonly http: HttpClient) {}

  public getConfiguration(idAgence: number): Observable<ScheduledTaskConfig> {
    return this.http.get<ScheduledTaskConfig>(
      `${this.apiBaseUrl}/gestimoweb/api/v1/taches-planifiees/agence/${idAgence}`
    );
  }

  public saveConfiguration(
    payload: ScheduledTaskConfig
  ): Observable<ScheduledTaskConfig> {
    return this.http.post<ScheduledTaskConfig>(
      `${this.apiBaseUrl}/gestimoweb/api/v1/taches-planifiees/save`,
      payload
    );
  }

  public runNow(idAgence: number): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.apiBaseUrl}/gestimoweb/api/v1/taches-planifiees/run-now/${idAgence}`,
      {}
    );
  }
}
