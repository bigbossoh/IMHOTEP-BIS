import { SelectionModel } from '@angular/cdk/collections';
import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';
import {
  EncaissementPayloadDto,
  LocataireEncaisDTO,
  PeriodeDto,
  UtilisateurRequestDto,
} from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';
import { firstValueFrom } from 'rxjs';

type BatchMode = NonNullable<EncaissementPayloadDto['modePaiement']>;

interface PaymentModeOption {
  value: BatchMode;
  label: string;
  helper: string;
}

@Component({
  standalone: false,
  selector: 'app-page-reglement-groupe',
  templateUrl: './page-reglement-groupe.component.html',
  styleUrls: ['./page-reglement-groupe.component.css'],
})
export class PageReglementGroupeComponent implements OnInit {
  public user?: UtilisateurRequestDto;
  public periodes: PeriodeDto[] = [];
  public locatairesImpayer: LocataireEncaisDTO[] = [];
  public selection = new SelectionModel<LocataireEncaisDTO>(true, []);
  public periode = this.buildCurrentPeriod();
  public searchTerm = '';
  public modePaiement: BatchMode = 'ESPESE_MAGISER';
  public isLoadingPeriodes = false;
  public isLoadingLocataires = false;
  public isSubmitting = false;
  public errorMessage = '';
  public lastRefreshAt: Date | null = null;

  public readonly paymentModes: PaymentModeOption[] = [
    {
      value: 'ESPESE_MAGISER',
      label: 'Espece',
      helper: 'Paiement comptant en agence',
    },
    {
      value: 'MOBILE_MONEY_MAGISER',
      label: 'Mobile money',
      helper: 'Paiement via portefeuille electronique',
    },
    {
      value: 'CHEQUE_ECOBANK_MAGISER',
      label: 'Cheque',
      helper: 'Cheque bancaire',
    },
    {
      value: 'VIREMENT_ECOBANK_MAGISER',
      label: 'Virement',
      helper: 'Paiement par virement bancaire',
    },
  ];

  constructor(
    private readonly apiService: ApiService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    if (!this.user?.idAgence || !this.user?.id) {
      this.errorMessage =
        "Impossible de charger le reglement groupe : l'utilisateur courant est introuvable.";
      return;
    }

    this.loadPeriodes();
  }

  public async paiementGrouper(): Promise<void> {
    const selectedRows = this.selectedRows;
    if (!selectedRows.length || !this.user?.idAgence || !this.user?.id) {
      this.notificationService.notify(
        NotificationType.WARNING,
        'Selectionnez au moins un loyer deverrouille.'
      );
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    let completed = 0;

    try {
      let remainingRows = this.locatairesImpayer;

      for (const row of selectedRows) {
        remainingRows = await firstValueFrom(
          this.apiService.saveEncaissementMasseAvecretourDeListe(
            this.buildEncaissementPayload(row)
          )
        );
        completed += 1;
      }

      this.locatairesImpayer = this.sortLocataires(remainingRows ?? []);
      this.selection.clear();
      this.lastRefreshAt = new Date();
      this.notificationService.notify(
        NotificationType.SUCCESS,
        `${completed} reglement(s) groupe(s) enregistre(s) avec succes.`
      );
    } catch (error) {
      this.errorMessage = this.extractErrorMessage(
        error,
        "Le reglement groupe n'a pas pu etre termine."
      );
      this.notificationService.notify(NotificationType.ERROR, this.errorMessage);
      this.loadLocatairesImpayer(this.periode);
    } finally {
      this.isSubmitting = false;
    }
  }

  public reloadData(): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.loadPeriodes();
  }

  public onPeriodChange(periode: string | null | undefined): void {
    if (!periode || periode === this.periode) {
      return;
    }

    this.periode = periode;
    this.selection.clear();
    this.loadLocatairesImpayer(periode);
  }

  public onPeriodChangeFromSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.onPeriodChange(value);
  }

  public onModePaiementChange(event: Event): void {
    this.modePaiement = (event.target as HTMLSelectElement).value as BatchMode;
  }

  public onSearchChange(): void {
    this.selection = new SelectionModel<LocataireEncaisDTO>(
      true,
      this.selection.selected.filter((row) =>
        this.filteredLocataires.some(
          (item) => this.getRowIdentity(item) === this.getRowIdentity(row)
        )
      )
    );
  }

  public masterToggle(): void {
    const selectableRows = this.selectableRows;
    if (!selectableRows.length) {
      return;
    }

    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...selectableRows);
  }

  public toggleRow(row: LocataireEncaisDTO): void {
    if (!this.isRowSelectable(row)) {
      return;
    }

    this.selection.toggle(row);
  }

  public isAllSelected(): boolean {
    const selectableRows = this.selectableRows;
    return (
      selectableRows.length > 0 &&
      this.selection.selected.length === selectableRows.length
    );
  }

  public clearSelection(): void {
    this.selection.clear();
  }

  public isRowSelectable(row: LocataireEncaisDTO): boolean {
    if (!this.hasPayableBalance(row)) {
      return false;
    }

    if (this.unlockSelectionEnforced) {
      return row.unlock === true;
    }

    return true;
  }

  public trackByLocataire(index: number, row: LocataireEncaisDTO): number {
    return this.getRowIdentity(row) ?? index;
  }

  public get filteredLocataires(): LocataireEncaisDTO[] {
    const search = this.searchTerm.trim().toLowerCase();
    if (!search) {
      return this.locatairesImpayer;
    }

    return this.locatairesImpayer.filter((row) =>
      [
        row.codeDescBail,
        row.nom,
        row.prenom,
        row.moisEnLettre,
        row.username,
      ]
        .join(' ')
        .toLowerCase()
        .includes(search)
    );
  }

  public get selectableRows(): LocataireEncaisDTO[] {
    return this.filteredLocataires.filter((row) => this.isRowSelectable(row));
  }

  public get selectedRows(): LocataireEncaisDTO[] {
    return this.selection.selected.filter((row) => this.isRowSelectable(row));
  }

  public get unlockSelectionEnforced(): boolean {
    return this.locatairesImpayer.some((row) => row.unlock === true);
  }

  public get selectedCount(): number {
    return this.selectedRows.length;
  }

  public get selectedTotal(): number {
    return this.selectedRows.reduce(
      (total, row) => total + Number(row.soldeAppelLoyer ?? 0),
      0
    );
  }

  public get totalPendingAmount(): number {
    return this.locatairesImpayer.reduce(
      (total, row) => total + Number(row.soldeAppelLoyer ?? 0),
      0
    );
  }

  public get availableCount(): number {
    return this.locatairesImpayer.filter((row) => this.isRowSelectable(row))
      .length;
  }

  public get lockedCount(): number {
    return this.locatairesImpayer.length - this.availableCount;
  }

  public get averagePendingAmount(): number {
    if (!this.locatairesImpayer.length) {
      return 0;
    }

    return this.totalPendingAmount / this.locatairesImpayer.length;
  }

  public get selectedPeriodLabel(): string {
    const matchingPeriod = this.periodes.find(
      (period) => period.periodeAppelLoyer === this.periode
    );
    return matchingPeriod?.periodeLettre ?? this.periode;
  }

  public get processingDateLabel(): string {
    return formatDate(new Date(), 'EEEE d MMMM y', 'fr-FR');
  }

  public get selectedModeLabel(): string {
    return (
      this.paymentModes.find((mode) => mode.value === this.modePaiement)?.label ??
      this.modePaiement
    );
  }

  public get selectedPreviewRows(): LocataireEncaisDTO[] {
    return this.selectedRows.slice(0, 5);
  }

  public formatCurrency(value: number | null | undefined): string {
    const amount = Number(value ?? 0);
    return `${amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} FCFA`;
  }

  public getStatusLabel(row: LocataireEncaisDTO): string {
    if (this.isRowSelectable(row)) {
      return this.unlockSelectionEnforced ? 'Pret a encaisser' : 'Disponible';
    }

    return 'Verrouille';
  }

  public getStatusClass(row: LocataireEncaisDTO): string {
    return this.isRowSelectable(row)
      ? 'row-badge row-badge--success'
      : 'row-badge row-badge--locked';
  }

  private loadPeriodes(): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.isLoadingPeriodes = true;
    this.errorMessage = '';

    this.apiService.findAllPeriode(this.user.idAgence).subscribe({
      next: (periodes) => {
        this.periodes = this.sortPeriodes(periodes ?? []);
        const currentPeriod = this.buildCurrentPeriod();
        const periodExists = this.periodes.some(
          (period) => period.periodeAppelLoyer === currentPeriod
        );

        if (periodExists) {
          this.periode = currentPeriod;
        } else {
          // Choisir la période disponible la plus proche et <= au mois actuel
          const pastPeriods = this.periodes
            .filter((p) => p.periodeAppelLoyer && p.periodeAppelLoyer <= currentPeriod)
            .sort((a, b) =>
              String(b.periodeAppelLoyer).localeCompare(String(a.periodeAppelLoyer))
            );

          if (pastPeriods.length > 0) {
            this.periode = pastPeriods[0].periodeAppelLoyer!;
          } else if (this.periodes.length > 0) {
            // Toutes les périodes sont futures : prendre la plus ancienne
            const asc = [...this.periodes].sort((a, b) =>
              String(a.periodeAppelLoyer).localeCompare(String(b.periodeAppelLoyer))
            );
            this.periode = asc[0].periodeAppelLoyer!;
          }
        }

        this.isLoadingPeriodes = false;
        this.loadLocatairesImpayer(this.periode);
      },
      error: (error) => {
        this.isLoadingPeriodes = false;
        this.errorMessage = this.extractErrorMessage(
          error,
          "Impossible de charger les periodes d'encaissement."
        );
      },
    });
  }

  private loadLocatairesImpayer(periode: string): void {
    if (!this.user?.idAgence || !periode) {
      this.locatairesImpayer = [];
      this.selection.clear();
      return;
    }

    this.isLoadingLocataires = true;
    this.errorMessage = '';

    this.apiService
      .listeLocataireImpayerParAgenceEtPeriode({
        agence: this.user.idAgence,
        periode,
      })
      .subscribe({
        next: (locataires) => {
          this.locatairesImpayer = this.sortLocataires(
            this.normalizeLocataires(locataires ?? [])
          );
          this.selection.clear();
          this.lastRefreshAt = new Date();
          this.isLoadingLocataires = false;
        },
        error: (error) => {
          this.locatairesImpayer = [];
          this.selection.clear();
          this.isLoadingLocataires = false;
          this.errorMessage = this.extractErrorMessage(
            error,
            "Impossible de charger les loyers impayes de la periode."
          );
        },
      });
  }

  private buildEncaissementPayload(
    row: LocataireEncaisDTO
  ): EncaissementPayloadDto {
    return {
      idAgence: this.user?.idAgence,
      idCreateur: this.user?.id,
      idAppelLoyer: row.idAppel,
      modePaiement: this.modePaiement,
      operationType: 'CREDIT',
      montantEncaissement: Number(row.soldeAppelLoyer ?? row.montantloyer ?? 0),
      intituleDepense: '',
      entiteOperation: 'MAGISER',
      typePaiement: 'ENCAISSEMENT_GROUPE',
    };
  }

  private sortPeriodes(periodes: PeriodeDto[]): PeriodeDto[] {
    return [...periodes].sort((left, right) =>
      String(right.periodeAppelLoyer ?? '').localeCompare(
        String(left.periodeAppelLoyer ?? '')
      )
    );
  }

  private sortLocataires(locataires: LocataireEncaisDTO[]): LocataireEncaisDTO[] {
    return [...locataires].sort((left, right) => {
      const unlockDelta = Number(!!right.unlock) - Number(!!left.unlock);
      if (unlockDelta !== 0) {
        return unlockDelta;
      }

      return String(left.codeDescBail ?? '').localeCompare(
        String(right.codeDescBail ?? ''),
        'fr'
      );
    });
  }

  private getRowIdentity(row: LocataireEncaisDTO): number | undefined {
    return row.idAppel ?? row.idBail ?? row.idBien ?? row.id;
  }

  private hasPayableBalance(row: LocataireEncaisDTO): boolean {
    return (
      !!row.idAppel && Number(row.soldeAppelLoyer ?? row.montantloyer ?? 0) > 0
    );
  }

  private normalizeLocataires(
    locataires: LocataireEncaisDTO[]
  ): LocataireEncaisDTO[] {
    return locataires.map((row) => {
      const unlockCandidate = row as LocataireEncaisDTO & {
        isUnlock?: boolean;
        unLock?: boolean;
      };

      return {
        ...row,
        unlock:
          unlockCandidate.unlock ??
          unlockCandidate.isUnlock ??
          unlockCandidate.unLock ??
          false,
      };
    });
  }

  private buildCurrentPeriod(): string {
    return formatDate(new Date(), 'yyyy-MM', 'en');
  }

  private extractErrorMessage(
    error: unknown,
    fallbackMessage: string
  ): string {
    if (error instanceof HttpErrorResponse) {
      return (
        error.error?.message ||
        error.error?.error ||
        error.message ||
        fallbackMessage
      );
    }

    return fallbackMessage;
  }
}
