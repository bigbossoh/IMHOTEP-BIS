import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/gs-api/src/services';

@Injectable({
  providedIn: 'root'
})
export class VilleService {

  constructor( private apiService:ApiService,) { }
  public getAllVilles():Observable<Array<any> | HttpErrorResponse>{
    return this.apiService.findAllVilles();
  }
}
