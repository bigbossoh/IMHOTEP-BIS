import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import {
  SaveClotureCaisseActions,
} from 'src/app/ngrx/cloture-caisse/cloturecaisse.actions';
import {
  ClotureCaisseStateEnum,
} from 'src/app/ngrx/cloture-caisse/cloturecaisse.reducer';
import { GetDefaultEtabNameActions } from 'src/app/ngrx/etablissement/etablisement.action';
import {
  EtablissementStateEnum,
} from 'src/app/ngrx/etablissement/etablissement.reducer';
import { GetSuiviDepenseDeuxDateActions } from 'src/app/ngrx/journal-caisse/journal-caisse.actions';
import {
  SuiviDepenseStateEnum,
} from 'src/app/ngrx/journal-caisse/journal-caisse.reducer';
import { GetAllEncaissementClotureActions } from 'src/app/ngrx/reglement/reglement.actions';
import {
  EncaissementStateEnum,
} from 'src/app/ngrx/reglement/reglement.reducer';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';
import {
  EncaissementPrincipalDTO,
  SuivieDepenseDto,
  UtilisateurRequestDto,
} from 'src/gs-api/src/models';

@Component({
  standalone: false,
  selector: 'app-cloture-caisse',
  templateUrl: './cloture-caisse.component.html',
  styleUrls: ['./cloture-caisse.component.css'],
})
export class ClotureCaisseComponent implements OnInit, OnDestroy {
  readonly pageSizeOptions = [5, 10, 20, 40];
  readonly nextClosureDelayDays = 3;
  readonly EncaissementStateEnum = EncaissementStateEnum;
  readonly SuiviDepenseStateEnum = SuiviDepenseStateEnum;
  readonly EtablissementStateEnum = EtablissementStateEnum;
  readonly ClotureCaisseStateEnum = ClotureCaisseStateEnum;

  user?: UtilisateurRequestDto;
  etablissementName = '';
  etablissementId = 0;

  selectedStartDate = this.toIsoDate(this.getFirstDayOfMonth(new Date()));
  selectedEndDate = this.toIsoDate(new Date());

  encaissements: EncaissementPrincipalDTO[] = [];
  depenses: SuivieDepenseDto[] = [];

  encaissementSearch = '';
  depenseSearch = '';

  encaissementCurrentPage = 1;
  encaissementPageSize = 10;
  depenseCurrentPage = 1;
  depensePageSize = 10;

  isEtablissementLoading = true;
  isEncaissementsLoading = false;
  isDepensesLoading = false;
  isSubmittingCloture = false;
  private awaitingSaveRefresh = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly store: Store<any>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    if (!this.user?.id || !this.user.idAgence) {
      this.notify(
        NotificationType.ERROR,
        'Session utilisateur introuvable pour charger la cloture de caisse.'
      );
      return;
    }

    this.bindStoreStreams();
    this.store.dispatch(new GetDefaultEtabNameActions(this.user.id));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get filteredEncaissements(): EncaissementPrincipalDTO[] {
    const query = this.encaissementSearch.trim().toLowerCase();
    if (!query) {
      return this.encaissements;
    }

    return this.encaissements.filter((row) =>
      [
        this.getEncaissementLabel(row),
        this.getEncaissementPeriod(row),
        this.formatModePaiement(row.modePaiement),
        row.typePaiement,
        row.dateEncaissement,
        `${row.montantEncaissement ?? 0}`,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }

  get filteredDepenses(): SuivieDepenseDto[] {
    const query = this.depenseSearch.trim().toLowerCase();
    if (!query) {
      return this.depenses;
    }

    return this.depenses.filter((row) =>
      [
        row.designation,
        row.codeTransaction,
        this.formatModePaiement(row.modePaiement),
        row.dateEncaissement,
        `${row.montantDepense ?? 0}`,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }

  get pagedEncaissements(): EncaissementPrincipalDTO[] {
    return this.paginate(
      this.filteredEncaissements,
      this.encaissementCurrentPage,
      this.encaissementPageSize
    );
  }

  get pagedDepenses(): SuivieDepenseDto[] {
    return this.paginate(
      this.filteredDepenses,
      this.depenseCurrentPage,
      this.depensePageSize
    );
  }

  get totalEncaissements(): number {
    return this.encaissements.reduce(
      (sum, row) => sum + Number(row.montantEncaissement ?? 0),
      0
    );
  }

  get totalDepenses(): number {
    return this.depenses.reduce(
      (sum, row) => sum + Number(row.montantDepense ?? 0),
      0
    );
  }

  get soldeNet(): number {
    return this.totalEncaissements - this.totalDepenses;
  }

  get montantCloture(): number {
    return this.totalEncaissements + this.totalDepenses;
  }

  get totalOperations(): number {
    return this.encaissements.length + this.depenses.length;
  }

  get periodLabel(): string {
    return `${this.formatHumanDate(this.selectedStartDate)} au ${this.formatHumanDate(
      this.selectedEndDate
    )}`;
  }

  get nextClosureDateLabel(): string {
    return this.formatHumanDate(
      this.addDays(this.fromIsoDate(this.selectedEndDate), this.nextClosureDelayDays)
    );
  }

  get encaissementTotalPages(): number {
    return this.computeTotalPages(
      this.filteredEncaissements.length,
      this.encaissementPageSize
    );
  }

  get depenseTotalPages(): number {
    return this.computeTotalPages(this.filteredDepenses.length, this.depensePageSize);
  }

  get encaissementPageNumbers(): number[] {
    return this.buildPageNumbers(
      this.encaissementCurrentPage,
      this.encaissementTotalPages
    );
  }

  get depensePageNumbers(): number[] {
    return this.buildPageNumbers(this.depenseCurrentPage, this.depenseTotalPages);
  }

  get canSubmitCloture(): boolean {
    return (
      !!this.user?.id &&
      !!this.user.idAgence &&
      this.etablissementId > 0 &&
      !this.isSubmittingCloture &&
      !this.isEncaissementsLoading &&
      !this.isDepensesLoading &&
      this.totalOperations > 0
    );
  }

  refreshData(): void {
    if (!this.validatePeriod()) {
      return;
    }

    if (!this.user?.id || this.etablissementId <= 0) {
      return;
    }

    const dateDebut = this.selectedStartDate;
    const dateFin = this.selectedEndDate;

    this.isEncaissementsLoading = true;
    this.isDepensesLoading = true;

    this.store.dispatch(
      new GetAllEncaissementClotureActions({
        idEncaiss: this.user.id,
        idChapitre: this.etablissementId,
        debut: dateDebut,
        fin: dateFin,
      })
    );

    this.store.dispatch(
      new GetSuiviDepenseDeuxDateActions({
        idcaisse: this.user.id,
        idChapitre: this.etablissementId,
        dateFin,
        dateDebut,
      })
    );
  }

  resetToCurrentPeriod(): void {
    this.selectedStartDate = this.toIsoDate(this.getFirstDayOfMonth(new Date()));
    this.selectedEndDate = this.toIsoDate(new Date());
    this.refreshData();
  }

  saveFirstCloture(): void {
    if (!this.canSubmitCloture || !this.validatePeriod() || !this.user?.idAgence) {
      if (this.totalOperations === 0) {
        this.notify(
          NotificationType.WARNING,
          'Aucune operation non cloturee n est disponible sur cette periode.'
        );
      }
      return;
    }

    const confirmation = window.confirm(
      `Cloturer la caisse de ${this.etablissementName || 'cet etablissement'} pour la periode ${this.periodLabel} ?`
    );

    if (!confirmation) {
      return;
    }

    this.awaitingSaveRefresh = true;
    this.isSubmittingCloture = true;

    this.store.dispatch(
      new SaveClotureCaisseActions({
        id: 0,
        idAgence: this.user.idAgence,
        idCreateur: this.user.id,
        totalEncaisse: this.montantCloture,
        chapitreCloture: this.etablissementName,
        dateDeDCloture: this.selectedStartDate,
        intervalNextCloture: this.nextClosureDelayDays,
        dateFinCloture: this.selectedEndDate,
        dateNextCloture: this.toIsoDate(
          this.addDays(
            this.fromIsoDate(this.selectedEndDate),
            this.nextClosureDelayDays
          )
        ),
      })
    );
  }

  onEncaissementSearchChange(value: string): void {
    this.encaissementSearch = value;
    this.encaissementCurrentPage = 1;
  }

  onDepenseSearchChange(value: string): void {
    this.depenseSearch = value;
    this.depenseCurrentPage = 1;
  }

  onEncaissementPageSizeChange(value: string | number): void {
    this.encaissementPageSize = Number(value) || 10;
    this.encaissementCurrentPage = 1;
  }

  onDepensePageSizeChange(value: string | number): void {
    this.depensePageSize = Number(value) || 10;
    this.depenseCurrentPage = 1;
  }

  setEncaissementPage(page: number): void {
    this.encaissementCurrentPage = this.clampPage(page, this.encaissementTotalPages);
  }

  setDepensePage(page: number): void {
    this.depenseCurrentPage = this.clampPage(page, this.depenseTotalPages);
  }

  getEncaissementLabel(row: EncaissementPrincipalDTO): string {
    const facture = row.appelLoyersFactureDto;
    const nom = [facture?.nomLocataire, facture?.prenomLocataire]
      .filter((value): value is string => !!value && value.trim().length > 0)
      .join(' ')
      .trim();
    const bien = facture?.abrvBienimmobilier?.trim();
    return [nom, bien].filter(Boolean).join(' / ') || 'Encaissement locataire';
  }

  getEncaissementPeriod(row: EncaissementPrincipalDTO): string {
    return (
      row.appelLoyersFactureDto?.periodeLettre?.trim() ||
      row.appelLoyersFactureDto?.periodeAppelLoyer?.trim() ||
      'Non renseignee'
    );
  }

  formatModePaiement(value: string | null | undefined): string {
    const raw = value?.toString().trim();
    if (!raw) {
      return 'Non renseigne';
    }

    return raw
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\bespese\b/g, 'espece')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  formatCurrency(value: number | null | undefined): string {
    const amount = Number(value ?? 0);
    return `${amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} FCFA`;
  }

  formatHumanDate(value: string | Date | null | undefined): string {
    if (!value) {
      return 'Non renseignee';
    }

    const date = value instanceof Date ? value : this.fromIsoDate(value);
    return formatDate(date, 'dd MMM yyyy', 'fr-FR');
  }

  trackById(_: number, row: { id?: number | null }): number | string {
    return row.id ?? _;
  }

  private bindStoreStreams(): void {
    this.store
      .pipe(
        map((state) => state.etablissementState),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.isEtablissementLoading =
          data?.dataState === EtablissementStateEnum.LOADING;

        if (
          data?.dataState === EtablissementStateEnum.LOADED &&
          data.etabname
        ) {
          const nextEtablissementId = Number(data.etabname.chapite ?? 0);
          const nextEtablissementName = data.etabname.nomEtabless ?? '';
          const hasChanged =
            nextEtablissementId !== this.etablissementId ||
            nextEtablissementName !== this.etablissementName;

          this.etablissementId = nextEtablissementId;
          this.etablissementName = nextEtablissementName;

          if (hasChanged && this.etablissementId > 0) {
            this.refreshData();
          }
        }
      });

    this.store
      .pipe(
        map((state) => state.encaissementState),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        if (data?.dataState === EncaissementStateEnum.LOADED) {
          this.encaissements = Array.isArray(data.encaissementsCloture)
            ? data.encaissementsCloture
            : [];
          this.encaissementCurrentPage = this.clampPage(
            this.encaissementCurrentPage,
            this.encaissementTotalPages
          );
          this.isEncaissementsLoading = false;
        }

        if (data?.dataState === EncaissementStateEnum.ERROR) {
          this.encaissements = [];
          this.isEncaissementsLoading = false;
        }
      });

    this.store
      .pipe(
        map((state) => state.suiviDepenseState),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        if (data?.dataState === SuiviDepenseStateEnum.LOADED) {
          this.depenses = Array.isArray(data.suiviDepensesCloture)
            ? data.suiviDepensesCloture
            : [];
          this.depenseCurrentPage = this.clampPage(
            this.depenseCurrentPage,
            this.depenseTotalPages
          );
          this.isDepensesLoading = false;
        }

        if (data?.dataState === SuiviDepenseStateEnum.ERROR) {
          this.depenses = [];
          this.isDepensesLoading = false;
        }
      });

    this.store
      .pipe(
        map((state) => state.clotuteCaisseState),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        if (!this.awaitingSaveRefresh) {
          return;
        }

        if (
          data?.dataState === ClotureCaisseStateEnum.LOADED &&
          data.saveClotureCaisse
        ) {
          this.awaitingSaveRefresh = false;
          this.isSubmittingCloture = false;
          this.refreshData();
        }

        if (data?.dataState === ClotureCaisseStateEnum.ERROR) {
          this.awaitingSaveRefresh = false;
          this.isSubmittingCloture = false;
        }
      });
  }

  private validatePeriod(): boolean {
    if (!this.selectedStartDate || !this.selectedEndDate) {
      this.notify(
        NotificationType.ERROR,
        'Renseignez une date de debut et une date de fin.'
      );
      return false;
    }

    if (this.selectedStartDate > this.selectedEndDate) {
      this.notify(
        NotificationType.ERROR,
        'La date de debut doit etre inferieure ou egale a la date de fin.'
      );
      return false;
    }

    return true;
  }

  private getFirstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private toIsoDate(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en');
  }

  private fromIsoDate(value: string): Date {
    const parsed = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  private addDays(date: Date, days: number): Date {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
  }

  private paginate<T>(items: T[], currentPage: number, pageSize: number): T[] {
    const normalizedPageSize = pageSize > 0 ? pageSize : 10;
    const safePage = this.clampPage(
      currentPage,
      this.computeTotalPages(items.length, normalizedPageSize)
    );
    const start = (safePage - 1) * normalizedPageSize;
    return items.slice(start, start + normalizedPageSize);
  }

  private computeTotalPages(totalItems: number, pageSize: number): number {
    return Math.max(1, Math.ceil(totalItems / Math.max(pageSize, 1)));
  }

  private clampPage(page: number, totalPages: number): number {
    return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  }

  private buildPageNumbers(currentPage: number, totalPages: number): number[] {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    const normalizedStart = Math.max(1, end - 4);

    return Array.from(
      { length: end - normalizedStart + 1 },
      (_, index) => normalizedStart + index
    );
  }

  private notify(type: NotificationType, message: string): void {
    this.notificationService.notify(type, message);
  }
}
