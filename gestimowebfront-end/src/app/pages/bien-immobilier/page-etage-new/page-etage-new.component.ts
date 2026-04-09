import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UtilisteurState, UtilisteurStateEnum } from '../../../ngrx/utulisateur/utlisateur.reducer';
import { ImmeubleState, ImmeubleStateEnum } from '../../../ngrx/immeuble/immeuble.reducer';
import { SiteState } from '../../../ngrx/site/site.reducer';
import { EtagesStateEnum, EtagesState } from '../../../ngrx/etage/etage.reducer';
import { Store } from '@ngrx/store';
import { SaveEtageActions } from '../../../ngrx/etage/etage.actions';
import { map } from 'rxjs/operators';
import { GetAllImmeublesActions } from '../../../ngrx/immeuble/immeuble.actions';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurRequestDto } from 'src/gs-api/src/models/utilisateur-request-dto';

@Component({
  standalone: false,
  selector: 'app-page-etage-new',
  templateUrl: './page-etage-new.component.html',
  styleUrls: ['./page-etage-new.component.css']
})
export class PageEtageNewComponent implements OnInit {
  submitted = false;

  immeubleState$: Observable<ImmeubleState> | null = null;
  siteState$: Observable<SiteState> | null = null;
  utilisateurState$: Observable<UtilisteurState> | null = null;
  etageState$: Observable<EtagesState> | null = null;
  readonly EtagesStateEnum = EtagesStateEnum;
  readonly ImmeubleStateEnum = ImmeubleStateEnum;
  readonly UtilisteurStateEnum = UtilisteurStateEnum;

  public user?: UtilisateurRequestDto;
  etageForm?: UntypedFormGroup;
  constructor(public dialogRef: MatDialogRef<PageEtageNewComponent>
    , private fb: UntypedFormBuilder,
    private userService: UserService,
    private store: Store<any>,) { }

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    // RECUPERER LES BIENS
    if (this.user.idAgence != undefined) {
      this.store.dispatch(new GetAllImmeublesActions(this.user.idAgence));
      this.immeubleState$ = this.store.pipe(map((state) => state.immeubleState));
    }
    this.etageForm = this.fb.group({
      //ETAGE
      id: [0],
      nomEtage: ['', Validators.required],
      numEtage: [0],
      idImmeuble: ['', Validators.required],
      abrvEtage: ['ETAGE'],
    });
  }
  onClose() {
    this.dialogRef.close();
  }
  onSaveEtage() {
    this.submitted = true;
    if (this.etageForm?.invalid) {
      return;
    }
    this.submitted = false;
    this.store.dispatch(new SaveEtageActions(this.etageForm?.value));
    this.etageState$ = this.store.pipe(
      map((state) => state.etageByImmeubeState)
    );
    this.onClose();
  }
}
