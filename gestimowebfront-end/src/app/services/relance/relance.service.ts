import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppelLoyersFactureDto, OperationDto } from 'src/gs-api/src/models';

@Injectable({
  providedIn: 'root',
})
export class RelanceService {
  private readonly apiBaseUrl = environment.serverUrl
    .replace(/\/actuator\/?$/, '')
    .replace(/\/+$/, '');

  constructor(private readonly http: HttpClient) {}

  public getRelances(idAgence: number): Observable<AppelLoyersFactureDto[]> {
    return this.http.get<AppelLoyersFactureDto[]>(
      `${this.apiBaseUrl}/api/v1/appelloyer/findAllRelance/${idAgence}`
    );
  }

  public getBauxPresqueATerme(
    idAgence: number,
    jours = 60
  ): Observable<OperationDto[]> {
    return this.http.get<OperationDto[]>(
      `${this.apiBaseUrl}/api/v1/bail/presqueATerme/${idAgence}?jours=${jours}`
    );
  }

  public sendRelanceMail(id: number): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.apiBaseUrl}/api/v1/envoimail/sendmailrelance/${id}`,
      {}
    );
  }

  public sendGlobalRelanceMail(id: number): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.apiBaseUrl}/api/v1/envoimail/sendmailrelanceglobale/${id}`,
      {}
    );
  }

  public sendRelanceFinBailMail(idBail: number): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.apiBaseUrl}/api/v1/envoimail/sendmailrelancefinbail/${idBail}`,
      {}
    );
  }
}
