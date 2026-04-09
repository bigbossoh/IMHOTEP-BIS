import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { VilleStateEnum, VilleState } from '../../../ngrx/ville/ville.reducer';
import { GetAllVilleActions } from '../../../ngrx/ville/ville.actions';
import { map } from 'rxjs/operators';
import {
  CommunesState,
  CommunesStateEnum,
} from '../../../ngrx/commune/commune.reducer';
import { GetAllCommunesByVilleActions } from '../../../ngrx/commune/commune.actions';
import {
  QuartiersState,
  QuartierStateEnum,
} from '../../../ngrx/quartier/quartier.reducer';
import { GetAllQuartierByCommuneActions } from '../../../ngrx/quartier/quartier.actions';
import { UserService } from '../../../services/user/user.service';
import { UtilisateurRequestDto } from '../../../../gs-api/src/models/utilisateur-request-dto';
import { CreateNewSiteAction } from '../../../ngrx/site/site.actions';
import { SiteStateEnum, SiteState } from '../../../ngrx/site/site.reducer';
import { SiteResponseDto } from '../../../../gs-api/src/models/site-response-dto';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-page-new-site',
  templateUrl: './page-new-site.component.html',
  styleUrls: ['./page-new-site.component.css'],
})
export class PageNewSiteComponent implements OnInit {
  submitted = false;

  villeState$: Observable<VilleState> | null = null;
  readonly VilleStateEnum = VilleStateEnum;
  siteDto: SiteResponseDto[] | null = null;
  siteState$: Observable<SiteState> | null = null;
  readonly SiteStateEnum = SiteStateEnum;

  communeState$: Observable<CommunesState> | null = null;
  readonly CommunesStateEnum = CommunesStateEnum;

  quartierState$: Observable<QuartiersState> | null = null;
  readonly QuartierStateEnum = QuartierStateEnum;

  siteRegisterForm!: UntypedFormGroup;

  villeModel = '';
  quartierModel = '';
  user?: UtilisateurRequestDto;
  constructor(
    private store: Store<any>,
    private fb: UntypedFormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<PageNewSiteComponent>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new GetAllVilleActions({}));
    this.villeState$ = this.store.pipe(map((state) => state.villeState));
    this.user = this.userService.getUserFromLocalCache();
    this.siteRegisterForm = this.fb.group({
      id: [0],
      idQuartier: [null, Validators.required],
      idAgence: [this.user?.idAgence],
      idCreateur:[this.user?.id]
    });
    this.changeCity(0);
  }
  onClose() {
    this.dialogRef.close();
  }
  public saveSite() {
    this.submitted = true;

    console.warn("this is the name of site registration ",this.siteRegisterForm.value);
    if (this.siteRegisterForm.invalid) {
      return;
    }
    this.submitted = false;
    this.store.dispatch(new CreateNewSiteAction(this.siteRegisterForm?.value));
    this.onClose();
  }

  public changeCity(idVille: number) {
    this.store.dispatch(new GetAllCommunesByVilleActions(idVille));
    this.communeState$ = this.store.pipe(map((state) => state.communeState));
  }
  changeCommune(idCommune: number) {
    this.store.dispatch(new GetAllQuartierByCommuneActions(idCommune));
    this.quartierState$ = this.store.pipe(map((state) => state.quartierState));
  }
  quartierChange(c: any) {
    this.quartierModel = c[0].abrvQuartier;
  }
  villeChange(v: any) {

  }
}
