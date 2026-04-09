import { UtilisateurRequestDto } from 'src/gs-api/src/models';
import { UserService } from 'src/app/services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppelLoyerState } from 'src/app/ngrx/appelloyer/appelloyer.reducer';
import { GetAllOperationActions } from 'src/app/ngrx/baux/baux.actions';
import { BauxState, BauxStateEnum } from 'src/app/ngrx/baux/baux.reducer';
import { AppelLoyerStateEnum } from '../../../ngrx/appelloyer/appelloyer.reducer';
import { GetAllAppelLoyerActions } from '../../../ngrx/appelloyer/appelloyer.actions';

@Component({
  standalone: false,
  selector: 'app-page-baux-loyers',
  templateUrl: './page-baux-loyers.component.html',

  styleUrls: ['./page-baux-loyers.component.css'],
})
export class PageBauxLoyersComponent implements OnInit {
  public user?: UtilisateurRequestDto;
  bauxState$: Observable<BauxState> | null = null;
  appelloyerState$: Observable<AppelLoyerState> | null = null;
  readonly BauxStateEnum = BauxStateEnum;
  readonly AppelLoyerStateEnum = AppelLoyerStateEnum;
  constructor(private store: Store<any>, private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.store.dispatch(new GetAllOperationActions(this.user.idAgence));
    this.bauxState$ = this.store.pipe(map((state) => state.bauxState));
  }
  onActionEmmit(event: any) {
    this.ngOnInit();
  }
  afficheLesAppels(id: any) {
    this.store.dispatch(new GetAllAppelLoyerActions(id));
    this.appelloyerState$ = this.store.pipe(
      map((state) => state.appelLoyerState)
    );
  }
}
