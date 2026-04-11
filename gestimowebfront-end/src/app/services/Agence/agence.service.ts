import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/gs-api/src/services';
import { AgenceImmobilierDTO } from '../../../gs-api/src/models/agence-immobilier-dto';
import { AgenceRequestDto } from '../../../gs-api/src/models/agence-request-dto';
import { AgenceResponseDto } from '../../../gs-api/src/models/agence-response-dto';

@Injectable({
  providedIn: 'root'
})
export class AgenceService {

  constructor(
    private apiService:ApiService,
    private http: HttpClient
  ) { }

  public getAllAgences(): Observable<AgenceImmobilierDTO[]> {
    return this.http.get<AgenceImmobilierDTO[]>(
      `${this.apiService.rootUrl}api/v1/agences/all`
    );
  }

  public saveAgence(agenceDto:AgenceRequestDto):Observable<AgenceImmobilierDTO>{
    return this.http.post<AgenceImmobilierDTO>(
      `${this.apiService.rootUrl}api/v1/agences/signup`,
      agenceDto
    );
  }

  public uploadLogoAgence(
    idAgence: number,
    file: File,
    idImage?: number | null
  ): Observable<AgenceImmobilierDTO> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    if (idImage) {
      formData.append('idImage', String(idImage));
    }

    return this.http.post<AgenceImmobilierDTO>(
      `${this.apiService.rootUrl}api/v1/agences/${idAgence}/logo`,
      formData
    );
  }

  public deleteAgence(idAgence: number): Observable<string> {
    return this.http.delete(
      `${this.apiService.rootUrl}api/v1/agences/deleteagence/${idAgence}`,
      { responseType: 'text' }
    );
  }

  public getAgenceById(idAgence:any):Observable<AgenceResponseDto>{
    return this.apiService.getAgenceByIDAgence(idAgence);

  }

}
