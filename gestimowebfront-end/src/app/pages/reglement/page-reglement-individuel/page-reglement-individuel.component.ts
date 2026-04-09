import { ActionsSubject } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UtilisteurState,
  UtilisteurStateEnum,
} from '../../../ngrx/utulisateur/utlisateur.reducer';
import { Observable, Subscription } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserService } from '../../../services/user/user.service';
import { GetAllLocatairesBailActions } from '../../../ngrx/utulisateur/utilisateur.actions';
import { filter, map } from 'rxjs/operators';
import {
  EncaissementState,
  EncaissementStateEnum,
} from '../../../ngrx/reglement/reglement.reducer';
import { UtilisateurRequestDto } from '../../../../gs-api/src/models/utilisateur-request-dto';
import {
  EncaissementActionsTypes,
  SaveEncaissementActions,
  GetEncaissementBienActions,
  GetLocataireEncaissementActions,
} from '../../../ngrx/reglement/reglement.actions';
import { PrintServiceService } from 'src/app/services/Print/print-service.service';
import { saveAs } from 'file-saver';

@Component({
  standalone: false,
  selector: 'app-page-reglement-individuel',
  templateUrl: './page-reglement-individuel.component.html',
  styleUrls: ['./page-reglement-individuel.component.css'],
})
export class PageReglementIndividuelComponent implements OnInit, OnDestroy {
  public user?: UtilisateurRequestDto;
  encaissementform?: UntypedFormGroup;
  leLocataire: any;
  submitted = false;

  allEncaissements: any[] = [];
  filteredEncaissements: any[] = [];
  searchTerm = '';

  listeEncaissementBien$: Observable<EncaissementState> | null = null;
  locataireEncaissement$: Observable<EncaissementState> | null = null;
  saveEncaissementState$: Observable<EncaissementState> | null = null;

  readonly EncaissementStateEnum = EncaissementStateEnum;
  readonly LocaEncaisseState = EncaissementStateEnum;
  readonly EncaissBienStateEnum = EncaissementStateEnum;

  locataireState$: Observable<UtilisteurState> | null = null;
  readonly UtilisteurStateEnum = UtilisteurStateEnum;
  montant_Loyer: number = 0;
  idDeAppel: any;
  private saveEncaissementSubscription?: Subscription;

  constructor(
    private fb: UntypedFormBuilder,
    private store: Store<any>,
    private userService: UserService,
    private printService: PrintServiceService,
    private actionsSubject: ActionsSubject
  ) {}

  public get hasSelectedLocataire(): boolean {
    return !!this.leLocataire && this.leLocataire !== 0;
  }

  public get selectedLocataireLabel(): string {
    if (!this.hasSelectedLocataire) return 'Aucun locataire sélectionné';
    return (
      this.leLocataire?.codeDescBail ||
      this.leLocataire?.designationBail ||
      'Bail en cours'
    );
  }

  public get selectedBienLabel(): string {
    return (
      this.leLocataire?.codeAbrvBienImmobilier ||
      this.leLocataire?.bienImmobilierOperation ||
      'Bien non renseigné'
    );
  }

  public get encaissementCount(): number {
    return this.allEncaissements.length;
  }

  public get totalEncaissements(): number {
    return this.allEncaissements.reduce(
      (total: number, row: any) => total + (row?.montantEncaissement ?? 0),
      0
    );
  }

  public get montantEncaisseSaisi(): number {
    return Number(this.encaissementform?.get('montantEncaissement')?.value ?? 0);
  }

  public get nombrePeriodesCouvrables(): number {
    if (this.montant_Loyer <= 0 || this.montantEncaisseSaisi <= 0) {
      return 0;
    }
    return Math.floor(this.montantEncaisseSaisi / this.montant_Loyer);
  }

  public get resteEstimeApresPeriodesCompletes(): number {
    if (this.montant_Loyer <= 0 || this.montantEncaisseSaisi <= 0) {
      return 0;
    }
    return this.montantEncaisseSaisi % this.montant_Loyer;
  }

  public get isPaiementParAvance(): boolean {
    return this.montantEncaisseSaisi > this.montant_Loyer;
  }

  public reloadData(): void {
    if (this.hasSelectedLocataire) {
      this.onLocataireChange(this.leLocataire);
      return;
    }
    if (this.user?.idAgence) {
      this.store.dispatch(new GetAllLocatairesBailActions(this.user.idAgence));
    }
  }

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();

    this.encaissementform = this.fb.group({
      idAgence: [this.user?.idAgence],
      idCreateur: [this.user?.id],
      idAppelLoyer: [],
      modePaiement: ['ESPESE_MAGISER'],
      operationType: ['CREDIT'],
      montantEncaissement: [0],
      intituleDepense: [''],
      entiteOperation: ['MAGISER'],
      typePaiement: ['ENCAISSEMENT_INDIVIDUEL'],
    });

    this.store.dispatch(new GetAllLocatairesBailActions(this.user!.idAgence));
    this.locataireState$ = this.store.pipe(
      map((state) => state.utilisateurState)
    );
    this.store.pipe(map((state) => state.utilisateurState)).subscribe((data) => {
      if (data.locataireBail.length > 0 && !this.hasSelectedLocataire) {
        this.onLocataireChange(data.locataireBail[0]);
      }
    });

    this.locataireEncaissement$ = this.store.pipe(
      map((state) => state.encaissementState)
    );
    this.store.pipe(map((state) => state.encaissementState)).subscribe((data) => {
      if (data.leLocataire) {
        this.idDeAppel = data.leLocataire.idAppel;
        this.montant_Loyer = data.leLocataire.montantloyer;
        this.syncEncaissementForm();
      }
    });

    this.saveEncaissementSubscription = this.actionsSubject
      .pipe(
        filter((action) => action.type === EncaissementActionsTypes.SAVE_ENCAISSEMENT_SUCCES)
      )
      .subscribe(() => {
        if (!this.hasSelectedLocataire) {
          return;
        }
        this.getAllEncaissementByBienImmobilier(this.leLocataire);
        this.getLocatairePourEncaissement(this.leLocataire);
      });
  }

  public onLocataireChange(locataire: any): void {
    if (!locataire || locataire === 0) return;

    this.leLocataire = locataire;
    this.idDeAppel = locataire.idAppel;
    this.montant_Loyer = locataire.montantloyer;
    this.syncEncaissementForm(true);
    this.getLocatairePourEncaissement(locataire);
    this.getAllEncaissementByBienImmobilier(locataire);
  }

  public onLocataireSelectChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const index = Number(select.value);
    this.store.pipe(map((state) => state.utilisateurState)).subscribe((data) => {
      const locataire = data.locataireBail[index];
      if (locataire) this.onLocataireChange(locataire);
    }).unsubscribe();
  }

  onSaveEncaissement() {
    this.submitted = false;
    this.syncEncaissementForm();
    this.store.dispatch(new SaveEncaissementActions(this.encaissementform?.value));
    this.saveEncaissementState$ = this.store.pipe(
      map((state) => state.encaissementState)
    );
    this.store.pipe(map((state) => state.encaissementState)).subscribe((donnee) => {
      this.updateEncaissements(donnee.encaissements);
    });
  }

  getLocatairePourEncaissement(locataire: any) {
    if (!locataire) return;
    this.store.dispatch(
      new GetLocataireEncaissementActions({
        locataire: locataire.id,
        bien: locataire.idBien,
      })
    );
    this.locataireEncaissement$ = this.store.pipe(
      map((state) => state.encaissementState)
    );
    this.store.pipe(map((state) => state.encaissementState)).subscribe((data) => {
      if (data.leLocataire) {
        this.idDeAppel = data.leLocataire.idAppel;
        this.montant_Loyer = data.leLocataire.montantloyer;
        this.syncEncaissementForm();
      }
    });
  }

  getAllEncaissementByBienImmobilier(p: any) {
    if (!p) return;
    this.store.dispatch(new GetEncaissementBienActions(p.idBien));
    this.store.pipe(map((state) => state.encaissementState)).subscribe((donnee) => {
      this.updateEncaissements(donnee.encaissements);
    });
  }

  public onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applySearchFilter();
  }

  public resetEncaissementForm(): void {
    this.syncEncaissementForm(true);
    if (!this.encaissementform) return;
    this.encaissementform.patchValue({
      modePaiement: 'ESPESE_MAGISER',
    });
  }

  public formatCurrency(value: number | null | undefined): string {
    const amount = value ?? 0;
    return `${amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} FCFA`;
  }

  public getModePaiementLabel(modePaiement: string | null | undefined): string {
    switch (modePaiement) {
      case 'ESPESE_MAGISER': return 'Espèce';
      case 'MOBILE_MONEY_MAGISER': return 'Mobile money';
      case 'CHEQUE_ECOBANK_MAGISER': return 'Chèque';
      case 'VIREMENT_ECOBANK_MAGISER': return 'Virement bancaire';
      default: return modePaiement || '-';
    }
  }

  public getStatusClass(status: string | null | undefined): string {
    const normalized = (status ?? '').toLowerCase();
    if (normalized.includes('sold')) return 'status-badge status-badge--success';
    if (normalized.includes('part')) return 'status-badge status-badge--warning';
    return 'status-badge status-badge--danger';
  }

  printRecu(p: any) {
    this.printService.printRecuEncaissement(p).subscribe((blob) => {
      saveAs(blob, 'appel_quittance_du_' + p + '.pdf');
    });
  }

  private syncEncaissementForm(resetAmount: boolean = false): void {
    if (!this.encaissementform) return;
    const currentMontant = Number(
      this.encaissementform.get('montantEncaissement')?.value ?? 0
    );

    const patchValue: Record<string, unknown> = {
      idAgence: this.user?.idAgence,
      idCreateur: this.user?.id,
      idAppelLoyer: this.idDeAppel ?? null,
      typePaiement: 'ENCAISSEMENT_INDIVIDUEL',
      operationType: 'CREDIT',
      entiteOperation: 'MAGISER',
    };

    if (resetAmount || currentMontant <= 0) {
      patchValue['montantEncaissement'] = this.montant_Loyer ?? 0;
    }

    this.encaissementform.patchValue(patchValue);
  }

  private updateEncaissements(encaissements: any[] | null | undefined): void {
    this.allEncaissements = encaissements ?? [];
    this.applySearchFilter();
  }

  private applySearchFilter(): void {
    if (!this.searchTerm) {
      this.filteredEncaissements = [...this.allEncaissements];
      return;
    }
    this.filteredEncaissements = this.allEncaissements.filter((row) => {
      const fields = [
        row.creationDate,
        row.appelLoyersFactureDto?.periodeLettre,
        row.modePaiement,
        this.getModePaiementLabel(row.modePaiement),
        row.appelLoyersFactureDto?.statusAppelLoyer,
        `${row.montantEncaissement ?? ''}`,
        `#${row.id ?? ''}`,
      ];
      return fields.some((f) =>
        `${f ?? ''}`.toLowerCase().includes(this.searchTerm)
      );
    });
  }

  ngOnDestroy(): void {
    this.saveEncaissementSubscription?.unsubscribe();
  }
}
