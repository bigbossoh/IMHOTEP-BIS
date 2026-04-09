import { UtilisateurRequestDto } from 'src/gs-api/src/models';
import { UserService } from './../../../services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetAllSitesActions } from 'src/app/ngrx/site/site.actions';
import { SiteState, SiteStateEnum } from 'src/app/ngrx/site/site.reducer';
import { DeleteSiteAction } from '../../../ngrx/site/site.actions';

@Component({
  standalone: false,
  selector: 'app-detail-site',
  templateUrl: './detail-site.component.html',
  styleUrls: ['./detail-site.component.css'],
})
export class DetailSiteComponent implements OnInit {
  siteState$: Observable<SiteState> | null = null;
  public user: UtilisateurRequestDto | undefined;
  readonly SiteStateEnum = SiteStateEnum;
  constructor(private store: Store<any>,
    private userService: UserService,) { }

  ngOnInit() {
    this.user = this.userService.getUserFromLocalCache();
    if (this.user.idAgence != undefined) {
  this.store.dispatch(new GetAllSitesActions(this.user.idAgence));
  this.siteState$ = this.store.pipe(map((state) => state.siteState));
  //this.counter = this.store.select('sites');

}
  }
  deleteSite(idSite: any, nomSite: any) {
    if (confirm('Vouvez-vous supprimer le site : ' + nomSite)) {
      this.store.dispatch(new DeleteSiteAction(idSite));
      this.ngOnInit();
    }
  }
}
