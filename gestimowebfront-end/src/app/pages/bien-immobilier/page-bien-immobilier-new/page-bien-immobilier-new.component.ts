import { Component, EventEmitter, OnInit, Output, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  GetAppartementByIdActions,
  SaveAppartementActions,
} from 'src/app/ngrx/appartement/appartement.actions';
import {
  AppartementState,
  AppartementStateEnum,
} from 'src/app/ngrx/appartement/appartement.reducer';
import { GetAllEtagesByImmeubleActions } from 'src/app/ngrx/etage/etage.actions';
import { EtagesState, EtagesStateEnum } from 'src/app/ngrx/etage/etage.reducer';
import { GetAllImmeublesActions } from 'src/app/ngrx/immeuble/immeuble.actions';
import {
  ImmeubleState,
  ImmeubleStateEnum,
} from 'src/app/ngrx/immeuble/immeuble.reducer';
import { SaveMagasinActions } from 'src/app/ngrx/magasin/magasin.actions';
import {
  MagasinState,
  MagasinStateEnum,
} from 'src/app/ngrx/magasin/magasin.reducer';
import { GetAllSitesActions } from 'src/app/ngrx/site/site.actions';
import { SiteState, SiteStateEnum } from 'src/app/ngrx/site/site.reducer';

import { GetAllProprietairesActions } from 'src/app/ngrx/utulisateur/utilisateur.actions';
import {
  UtilisteurState,
  UtilisteurStateEnum,
} from 'src/app/ngrx/utulisateur/utlisateur.reducer';
import {
  GetVillaByIdActions,
  SaveVillaActions,
} from 'src/app/ngrx/villa/villa.action';
import { VillaState, VillaStateEnum } from 'src/app/ngrx/villa/villa.reducer';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';
import { DialogData } from '../../baux/page-baux/page-baux.component';
import { GetMagasinByIdActions } from '../../../ngrx/magasin/magasin.actions';
import { GetAllBiensActions } from '../../../ngrx/bien-immobilier/bienimmobilier.actions';
import { EtablissementState, EtablissementStateEnum } from 'src/app/ngrx/etablissement/etablissement.reducer';
import { GetDefaultEtabNameActions } from 'src/app/ngrx/etablissement/etablisement.action';

@Component({
  standalone: false,
  selector: 'app-page-bien-immobilier-new',
  templateUrl: './page-bien-immobilier-new.component.html',
  styleUrls: ['./page-bien-immobilier-new.component.css'],
})
export class PageBienImmobilierNewComponent implements OnInit {
  submitted = false;

  formGroup?: UntypedFormGroup;

  etageForm?: UntypedFormGroup;
  studioform?: UntypedFormGroup;
  appartementForm?: UntypedFormGroup;
  magasinForm?: UntypedFormGroup;
  immeubleForm?: UntypedFormGroup;
  villaForm?: UntypedFormGroup;

  ngselecttypeBien = '20000';
  ngIelecttypeImm = 0;
  userVilla = '';
  listTypeBiens: string[] = [];

  magasinState$: Observable<MagasinState> | null = null;
  appartementState$: Observable<AppartementState> | null = null;

  etageState$: Observable<EtagesState> | null = null;
  immeubleState$: Observable<ImmeubleState> | null = null;
  siteState$: Observable<SiteState> | null = null;
  utilisateurState$: Observable<UtilisteurState> | null = null;
  villaState$: Observable<VillaState> | null = null;
  public user?: UtilisateurRequestDto;
  leBienAModifier: any;
  readonly VillaStateEnum = VillaStateEnum;
  readonly MagasinStateEnum = MagasinStateEnum;
  readonly AppartementStateEnum = AppartementStateEnum;

  readonly EtagesStateEnum = EtagesStateEnum;
  readonly ImmeubleStateEnum = ImmeubleStateEnum;
  readonly UtilisteurStateEnum = UtilisteurStateEnum;
  readonly SiteStateEnum = SiteStateEnum;

  etablissementState$: Observable<EtablissementState> | null = null;

  readonly EtablissementStateEnum = EtablissementStateEnum;
  etablissId=0;
  @Output() eventEmitter: EventEmitter<any> = new EventEmitter();
  constructor(
    private store: Store<any>,
    private fb: UntypedFormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<PageBienImmobilierNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.listTypeBiens = ['Appartement', 'Magasin', 'Villa'];
  }
  visiblForm = 0;
  findEtageByImmeuble(immeuble: any) {
    this.store.dispatch(new GetAllEtagesByImmeubleActions(immeuble));
    this.etageState$ = this.store.pipe(map((state) => state.etageState));
  }

  onClose() {
    this.user = this.userService.getUserFromLocalCache();
    // RECUPERER LES BIENS
    if (this.user.idAgence != undefined) {
      this.store.dispatch(new GetAllBiensActions(this.user.idAgence));
      this.store.pipe(map((state) => state.biensState)).subscribe((data) => {
        console.log('La list des bien');
        console.log(data);
      });
    }

    this.dialogRef.close();
  }

  onSaveMagasin() {
    this.submitted = true;
console.log(this.magasinForm?.invalid);

    this.submitted = false;
    this.store.dispatch(new SaveMagasinActions(this.magasinForm?.value));
    this.magasinState$ = this.store.pipe(map((state) => state.magasinState));
    this.onClose();
  }
  onSaveAppartement() {
    if (this.appartementForm?.invalid) {
      return;
    }
    console.log(this.appartementForm?.value);

    this.submitted = false;
    this.store.dispatch(
      new SaveAppartementActions(this.appartementForm?.value)
    );
    console.log("After save");

    console.log(this.appartementForm?.value);
    this.appartementState$ = this.store.pipe(
      map((state) => state.appartementState)
    );
    this.onClose();
  }

  onSaveVilla() {
    this.submitted = true;
    // if (this.villaForm?.invalid) {
    //   return;
    // }
    this.submitted = false;
    this.store.dispatch(new SaveVillaActions(this.villaForm?.value));
    this.villaState$ = this.store.pipe(map((state) => state.villaState));
    this.onClose();
  }

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    if (this.user.idAgence != undefined) {
      this.store.dispatch(new GetAllSitesActions(this.user.idAgence));
      this.siteState$ = this.store.pipe(map((state) => state.siteState));
    }
    this.store.dispatch(new GetDefaultEtabNameActions(this.user.id));
    this.etablissementState$ = this.store.pipe(map((state) => state.etablissementState));
    this.store.pipe(map((state) => state.etablissementState)).subscribe(
      data=>{
        console.log("*********** THE BIEN ETABLISSEMENT IS THE NEXT ************");

        if (data.dataState= 'Loaded') {
          console.log(data.etabname);

        this.etablissId=data.etabname.chapite
        console.log(this.etablissId)
        }
        }


    )
    this.user = this.userService.getUserFromLocalCache();

    this.store.dispatch(new GetAllProprietairesActions(this.user.idAgence));
    this.utilisateurState$ = this.store.pipe(
      map((state) => state.utilisateurState)
    );

    this.store.dispatch(new GetAllImmeublesActions(this.user.idAgence));
    this.immeubleState$ = this.store.pipe(map((state) => state.immeubleState));
    if (this.data != null) {
      this.visiblForm = 1;
      if (this.data.bienimmo.codeAbrvBienImmobilier.indexOf('-MAG-') != -1) {
        this.ngselecttypeBien = 'Magasin';
        this.store.dispatch(new GetMagasinByIdActions(this.data.bienimmo.id));
        this.store
          .pipe(map((state) => state.magasinState))
          .subscribe((data) => {
            console.log('LE MAGASIN EST LE SUIVANT :');
            console.log(data.magasin);
            if (data.magasin != null) {
              this.magasinForm = this.fb.group({
                id: [data.magasin.id],
                idAgence: [this.user?.idAgence],
                idCreateur: [this.user?.id],
                numMagasin: [data.magasin.numMagasin],
                statutBien: [data.magasin.statutBien],
                abrvBienimmobilier: ['MAGASIN'],
                description: [data.magasin.description],

                superficieBien: [data.magasin.superficieBien],
                codeAbrvBienImmobilier: ['MAGASIN'],
                nombrePieceMagasin: [data.magasin.nombrePieceMagasin],
                nomBaptiserBienImmobilier: [
                  data.magasin.nomBaptiserBienImmobilier,
                ],
                idEtage: [data.magasin.idEtage],
                idSite: [data.magasin.idSite],
                idUtilisateur: [data.magasin.idUtilisateur],
                underBuildingMagasin: [data.magasin.underBuildingMagasin],
                occupied: [data.magasin.occupied],
                archived: [data.magasin.archive],
                idChapitre:[this.etablissId]
              });
            }
          });
      }
      if (this.data.bienimmo.codeAbrvBienImmobilier.indexOf('-VILLA-') != -1) {
        this.ngselecttypeBien = 'Villa';
        this.store.dispatch(new GetVillaByIdActions(this.data.bienimmo.id));
        this.store
          .pipe(map((state) => state.villaState))
          .subscribe((dataReceive) => {
            console.log('La villa');
            console.log(dataReceive.villa);

            if (dataReceive.villa != null) {
              this.villaForm = this.fb.group({
                id: [this.data.bienimmo.id],
                idCreateur: [this.user?.id],
                idAgence: [this.user?.idAgence],
                nbrChambreVilla: [dataReceive.villa.nbrChambreVilla],
                nbrePiece: [dataReceive.villa.nbrePieceVilla],
                nbrSalonVilla: [dataReceive.villa.nbrSalonVilla],
                nbrSalleEauVilla: [dataReceive.villa.nbrSalleEauVilla],
                nomBaptiserBienImmobilier: [
                  dataReceive.villa.nomBaptiserBienImmobilier,
                ],
                codeAbrvBienImmobilier: [
                  dataReceive.villa.codeAbrvBienImmobilier,
                ],
                garageVilla: [false],
                nbreVoitureGarageVilla: [0],
                numVilla: [dataReceive.villa.numVilla],
                description: [dataReceive.villa.description],
                superficieBien: [dataReceive.villa.superficieBien],
                bienMeublerResidence: [dataReceive.villabienMeublerResidence],
                idSite: [dataReceive.villa.idSite],
                idUtilisateur: [dataReceive.villa.idUtilisateur],
                occupied: [dataReceive.villa.occupied],
                archived: [false],
                idChapitre:[this.etablissId]
              });
            }
          });
      }
      if (this.data.bienimmo.codeAbrvBienImmobilier.indexOf('-APPT-') != -1) {
        this.ngselecttypeBien = 'Appartement';
        this.store.dispatch(
          new GetAppartementByIdActions(this.data.bienimmo.id)
        );
        this.store
          .pipe(map((state) => state.appartementState))
          .subscribe((data) => {
            if (data.appartement != null) {
              this.appartementForm = this.fb.group({
                id: [data.appartement.id],
                idAgence: [this.user?.idAgence],
                idCreateur: [this.user?.id],
                idEtageAppartement: [data.appartement.idEtageAppartement],
                bienMeublerResidence: [data.appartement.bienMeublerResidence],
                nbrPieceApp: [data.appartement.nbrPieceApp],
                nbreChambreApp: [data.appartement.nbreChambreApp],
                nbrSalonApp: [data.appartement.nbreSalonApp],
                nbreSalleEauApp: [data.appartement.nbreSalleEauApp],
                numeroApp: [0],
                abrvNomApp: ['APPART'],
                nomBaptiserBienImmobilier: [
                  data.appartement.nomBaptiserBienImmobilier,
                ],
                residence: [data.appartement.bienMeublerResidence],
                idChapitre:[this.etablissId]
              });
            }
          });
      }
    } else {
      this.ngselecttypeBien = '10';
      this.formGroup = this.fb.group({
        idTypeBien: [0],
        //VILLA
        id: [0],
        idAgence: [this.user?.idAgence],
        idCreateur: [this.user?.id],
        nbrChambreVilla: [0],
        nbrePiece: [0],
        nbrSalonVilla: [],
        nbrSalleeauVilla: [],
        nomVilla: [''],
        abrvVilla: [''],
        garageVilla: [true],
        nbreVoitureGarageVilla: [0],
        numBien: [0],
        statutBien: [''],
        abrvBienimmobilier: [''],
        description: [''],
        nomBien: [''],
        superficieBien: [0],
        idSite: [0],
        idUtilisateur: [0],
        occupied: [false],
        //MAGASIN
        abrvNomMagasin: [''],
        nmbrPieceMagasin: [0],
        nomMagasin: [''],
        archived: [false],
        underBuildingMagasin: [false],
        //IMMEUBLE
        etatBien: [''],
        denominationBien: [''],
        nbrEtage: [0],
        nbrePieceImmeuble: [0],
        abrvNomImmeuble: [''],
        descriptionImmeuble: [''],
        numeroImmeuble: [0],
        garrage: [false],
        idChapitre:[0]
      });
      this.villaForm = this.fb.group({
        id: [0],
        idCreateur: [this.user?.id],
        idAgence: [this.user?.idAgence],
        nbrChambreVilla: [0],
        nbrePiece: [0],
        nbrSalonVilla: [0],
        nbrSalleEauVilla: [0],
        nomBaptiserBienImmobilier: ['', Validators.required],
        codeAbrvBienImmobilier: ['VILLA'],
        garageVilla: [false],
        nbreVoitureGarageVilla: [0],
        numVilla: [0],
        description: [''],
        superficieBien: [0],
        bienMeublerResidence: [],
        idSite: ['', Validators.required],
        idUtilisateur: ['', Validators.required],
        occupied: [false],
        archived: [false],
        idChapitre:[this.etablissId]
      });

      this.magasinForm = this.fb.group({
        id: [0],
        idAgence: [this.user?.idAgence],
        idCreateur: [this.user?.id],
        numBien: [0],
        statutBien: [''],
        abrvBienimmobilier: ['MAGASIN'],
        description: [''],

        superficieBien: [0],
        codeAbrvBienImmobilier: ['MAGASIN'],
        nmbrPieceMagasin: [0],
        nomBaptiserBienImmobilier: [0, [Validators.required]],
        idEtage: [0],
        idSite: ['', [Validators.required]],
        //idUtilisateur: ['', [Validators.required]],
        underBuildingMagasin: [false],
        occupied: [false],
        archived: [false],
        idChapitre:[this.etablissId]
      });
      this.appartementForm = this.fb.group({
        id: [0],
        idAgence: [this.user?.idAgence],
        idCreateur: [this.user?.id],
        idEtageAppartement: [0, [Validators.required]],
        meubleApp: [false],
        nbrPieceApp: [0],
        nbreChambreApp: [0],
        nbrSalonApp: [0],
        nbreSalleEauApp: [0],
        numeroApp: [0],
        abrvNomApp: ['APPART'],
        nomBaptiserBienImmobilier: ['', Validators.required],
        residence: [false],
        idChapitre:[this.etablissId],
        bienMeublerResidence: [false],
      });
    }
  }
}
