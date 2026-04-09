import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/gs-api/src/services';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  constructor( private apiService:ApiService,) { }
  // public getAllSites():Observable<Array<any> | HttpErrorResponse>{
  //   return this.apiService.findAllSites();
  // }
  // // public getAllVilles():Observable<Array<any> | HttpErrorResponse>{
  // //   return this.apiService.findAllVilles();
  // // }
  // public getAll():Observable<Array<any> | HttpErrorResponse>{
  //   return this.apiService.findAllVilles();
  // }
  // public getAllVilles():Observable<Array<any> | HttpErrorResponse>{
  //   return this.apiService.findAllVilles();
  // }
  // public onPostSite(any):Observable<any>{
  //   return this.apiService.authenticateAgence(agenceDto);
  // }
}
