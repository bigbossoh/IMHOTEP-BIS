import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError } from 'rxjs';
import { SystemHealth } from 'src/app/interfaces/system-health';
import { SystemCpu } from '../../interfaces/system-cpu';
import { MonitoringOverview } from 'src/app/interfaces/monitoring-overview';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
private readonly serverUrl = environment.serverUrl;
  constructor( private http:HttpClient) { }

  public getHttpTrace():Observable<any>{
   return this.http.get<any>(this.buildActuatorUrl('httpexchanges')).pipe(
    catchError(() => this.http.get<any>(this.buildActuatorUrl('httptrace')))
   );
  }

  public getSystemHealth():Observable<SystemHealth>{
    return this.http.get<SystemHealth>(this.buildActuatorUrl('health'));
   }

   public getSystemCpu():Observable<SystemCpu>{
    return this.http.get<SystemCpu>(this.buildActuatorUrl('metrics/system.cpu.count'));
   }

  public getProcessUptime():Observable<any>{
    return this.http.get<any>(this.buildActuatorUrl('metrics/process.uptime'));
   }

   public getMonitoringOverview(idAgence: number): Observable<MonitoringOverview> {
    return this.http.get<MonitoringOverview>(
      this.buildApiUrl(`gestimoweb/api/v1/monitoring/overview/${idAgence}`)
    );
   }

   private buildActuatorUrl(path: string): string {
    const baseUrl = this.serverUrl.replace(/\/+$/, '');
    const normalizedPath = path.replace(/^\/+/, '');
    return `${baseUrl}/${normalizedPath}`;
   }

   private buildApiUrl(path: string): string {
    const baseUrl = this.serverUrl
      .replace(/\/actuator\/?$/, '')
      .replace(/\/+$/, '');
    const normalizedPath = path.replace(/^\/+/, '');
    return `${baseUrl}/${normalizedPath}`;
   }

}
