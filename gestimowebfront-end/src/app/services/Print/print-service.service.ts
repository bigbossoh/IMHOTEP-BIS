import { AgenceRequestDto } from 'src/gs-api/src/models';
import { ApiConfiguration } from './../../../gs-api/src/api-configuration';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrintServiceService {
  constructor(private http: HttpClient, private apiConfig: ApiConfiguration) {}

  private buildApiUrl(rootUrl: string, ...segments: Array<string | number>): string {
    const normalizedRootUrl = rootUrl.endsWith('/') ? rootUrl : `${rootUrl}/`;

    if (segments.length === 0) {
      return normalizedRootUrl;
    }

    // Le premier segment est le chemin statique de l'API (ne doit pas être encodé).
    // Les segments suivants sont des valeurs dynamiques (path variables) à encoder.
    const [staticPath, ...dynamicSegments] = segments;
    const normalizedStaticPath = String(staticPath).replace(/^\/+|\/+$/g, '');

    if (dynamicSegments.length === 0) {
      return `${normalizedRootUrl}${normalizedStaticPath}`;
    }

    const encodedDynamic = dynamicSegments
      .map((segment) => encodeURIComponent(String(segment)))
      .join('/');

    return `${normalizedRootUrl}${normalizedStaticPath}/${encodedDynamic}`;
  }

  private getPrintApiRootCandidates(): string[] {
    const configuredRootUrl = this.apiConfig.rootUrl;
    const protocol =
      typeof window !== 'undefined' && window.location.protocol === 'https:'
        ? 'https:'
        : 'http:';
    const hostname =
      typeof window !== 'undefined' && window.location.hostname
        ? window.location.hostname
        : 'localhost';

    return Array.from(
      new Set([
        configuredRootUrl,
        `${protocol}//${hostname}:8287/`,
        'http://127.0.0.1:8287/',
        'http://localhost:8287/',
      ])
    );
  }

  private shouldRetryWithAnotherRoot(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === 0;
  }

  private requestBlobWithFallback(
    ...segments: Array<string | number>
  ): Observable<Blob> {
    const candidateUrls = this.getPrintApiRootCandidates().map((rootUrl) =>
      this.buildApiUrl(rootUrl, ...segments)
    );

    return new Observable<Blob>((observer) => {
      let currentIndex = 0;
      let lastError: unknown = null;
      let requestSubscription: { unsubscribe(): void } | null = null;

      const tryNextUrl = (): void => {
        if (currentIndex >= candidateUrls.length) {
          observer.error(lastError);
          return;
        }

        const candidateUrl = candidateUrls[currentIndex++];
        requestSubscription = this.http
          .get(candidateUrl, { responseType: 'blob' })
          .subscribe({
            next: (blob) => {
              observer.next(blob);
              observer.complete();
            },
            error: (error) => {
              lastError = error;

              if (this.shouldRetryWithAnotherRoot(error)) {
                tryNextUrl();
                return;
              }

              observer.error(error);
            },
          });
      };

      tryNextUrl();

      return () => {
        requestSubscription?.unsubscribe();
      };
    });
  }

  printQuittanceById(id: number): Observable<Blob> {
    return this.requestBlobWithFallback('gestimoweb/api/v1/print/quittance', id);
  }
  printBail(idBail: number): Observable<Blob> {
    return this.requestBlobWithFallback('gestimoweb/api/v1/print/bail', idBail);
  }
  recureservation(  idEncaissement:any,  idAgence:any,proprio:any){
    return this.requestBlobWithFallback(
      'gestimoweb/api/v1/print/recureservation',
      idEncaissement,
      idAgence,
      proprio
    );
  }
  recureservationparid(  idReservation:any,  idAgence:any,proprio:any){
    return this.requestBlobWithFallback(
      'gestimoweb/api/v1/print/recuReservationParIdReservation',
      idReservation,
      idAgence,
      proprio
    );
  }
  printRecuEncaissement(idEncaissement: any): Observable<Blob> {
    return this.requestBlobWithFallback(
      'gestimoweb/api/v1/print/recupaiment',
      idEncaissement
    );
  }
  printQuittanceByPeriode(periode: string, idAgence: any): Observable<Blob> {
    return this.requestBlobWithFallback(
      'gestimoweb/api/v1/print/quittancegrouper',
      periode,
      idAgence
    );
  }
  savelogo(body: any) {
    // console.log('');
    // ABJECT WHICH PASS BODY PARAMETERS
    var myFormData = new FormData();
    //HEADERS
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    var leBody = body.logoAgence;
    myFormData.append('imageFile', body.logoAgence, body.id);
    myFormData.append('idAgence', body.idAgence);
    return this.http
      .post(
        this.apiConfig.rootUrl +
          'http://localhost:5000/gestimoweb/api/v1/agences/saveagencelogo',
        myFormData
      )
      .subscribe((respons) => {
        console.log('la reponse est la suivante ::: ');
        console.log(respons);
      });
  }
  saveAgenceLogo(idAgence: any, file: any) {}
}
