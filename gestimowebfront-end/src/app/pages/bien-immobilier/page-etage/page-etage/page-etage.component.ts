import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BienImmobilierState,
  BienImmobilierStateEnum,
} from '../../../../ngrx/bien-immobilier/bienimmobilier.reducer';
import {
  VilleState,
  VilleStateEnum,
} from '../../../../ngrx/ville/ville.reducer';
import {
  CommunesState,
  CommunesStateEnum,
} from '../../../../ngrx/commune/commune.reducer';
import { GetAllCommunesByVilleActions } from '../../../../ngrx/commune/commune.actions';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import {
  EtagesState,
  EtagesStateEnum,
} from '../../../../ngrx/etage/etage.reducer';
import { GetAllEtagesActions } from '../../../../ngrx/etage/etage.actions';
import { GetAllBiensActions } from '../../../../ngrx/bien-immobilier/bienimmobilier.actions';

@Component({
  standalone: false,
  selector: 'app-page-etage',
  templateUrl: './page-etage.component.html',
  styleUrls: ['./page-etage.component.css'],
})
export class PageEtageComponent implements OnInit {
  etageState$: Observable<EtagesState> | null = null;

  bienState$: Observable<BienImmobilierState> | null = null;
  villeState$: Observable<VilleState> | null = null;
  commeState$: Observable<CommunesState> | null = null;

  readonly EtagesStateEnum = EtagesStateEnum;

  readonly VilleStateEnum = VilleStateEnum;
  readonly CommunesStateEnum = CommunesStateEnum;
  readonly BienImmobilierStateEnum = BienImmobilierStateEnum;
  constructor(private store: Store<any>) {}

  ngOnInit() {
    // RECUPERER LES BIENS
    this.store.dispatch(new GetAllBiensActions({}));
    this.bienState$ = this.store.pipe(map((state) => state.biensState));
    // RECUPERR LES ETAGES
    this.store.dispatch(new GetAllEtagesActions({}));
    this.etageState$ = this.store.pipe(map((state) => state.etageState));
  }
  onActionEvent(event: any) {
    //this.ngOnInit();
  }
  onEditdele(id: any) {}
  findCommuneByPays(pays: any) {
    this.store.dispatch(new GetAllCommunesByVilleActions(pays.target.value));
    this.commeState$ = this.store.pipe(map((state) => state.communeState));
    this.ngOnInit();
  }
}
