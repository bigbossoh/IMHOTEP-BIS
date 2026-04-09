import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/gs-api/src/services';

@Injectable({
  providedIn: 'root',
})
export class StatistiqueService {
  public user: UtilisateurRequestDto;
  v_user = 0;
  constructor(
    private userService: UserService,
    private apiService: ApiService
  ) {
    this.user = this.userService.getUserFromLocalCache();
    if (this.user.idAgence != null) {
      this.v_user = this.user!.idAgence;
    }
  }
  public getAllBienImmobilier(chapitre: any,agence:any): Observable<any>
  {

    return this.apiService.findAllBien({idAgence:agence,chapitre: chapitre});
  }
  public getAllBienImmobilierOccuper(chapitre: number,agence:any): Observable<any> {
    return this.apiService.findAllBienOqp({idAgence:agence,chapitre: chapitre});
  }
  // public getAllLocatire(idAgence:number):Observable<any>{
  //   return this.apiService.getUtilisateurByAgence(idAgence);
  // }
  public getAllLocatire(agence:any): Observable<any> {
    return this.apiService.getAllLocatairesByOrder(agence);
  }

  public getAlllocataireAyantBail(agence:any): Observable<any> {
    return this.apiService.getAllLocatairesAvecBail(agence);
  }

  public getAllBauxActif(agence:any): Observable<any> {
    return this.apiService.nombrebailactif(agence);
  }

  public getAllBauxNonActif(agence:any): Observable<any> {
    return this.apiService.nombrebailnonactif(agence);
  }
}
