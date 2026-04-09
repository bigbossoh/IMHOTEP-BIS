import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import {
  AppelLoyersFactureDto,
  PeriodeDto,
  UtilisateurRequestDto,
} from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { PrintServiceService } from 'src/app/services/Print/print-service.service';
import { UserService } from 'src/app/services/user/user.service';
import { finalize } from 'rxjs/operators';
import { ReductionAppelLoyerComponent } from '../reduction-appel-loyer/reduction-appel-loyer.component';

type AppelStatusFilter = 'all' | 'solde' | 'impaye' | 'partiel';
type AppelStatusKey = Exclude<AppelStatusFilter, 'all'>;

@Component({
  standalone: false,
  selector: 'app-appels-loyers',
  templateUrl: './appels-loyers.component.html',
  styleUrls: ['./appels-loyers.component.css'],
})
export class AppelsLoyersComponent implements OnInit {
  public user: UtilisateurRequestDto | null = null;

  public availableYears: number[] = [];
  public availablePeriods: PeriodeDto[] = [];
  public appels: AppelLoyersFactureDto[] = [];
  public filteredAppels: AppelLoyersFactureDto[] = [];

  public selectedYear = Number.parseInt(
    formatDate(new Date(), 'yyyy', 'en'),
    10
  );
  public selectedPeriod = '';
  public selectedAppelId: number | null = null;

  public searchTerm = '';
  public statusFilter: AppelStatusFilter = 'all';

  public isLoadingYears = false;
  public isLoadingPeriods = false;
  public isLoadingAppels = false;
  public isPrintingPeriod = false;
  public isDownloadingPeriod = false;
  public isSendingGroupMail = false;
  public printingAppelId: number | null = null;
  public mailingAppelId: number | null = null;

  public pageErrorMessage = '';

  private readonly currentPeriod = this.buildCurrentPeriodString();

  constructor(
    private readonly apiService: ApiService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly printService: PrintServiceService,
    private readonly dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.user = this.getCurrentUser();

    if (!this.user?.idAgence) {
      this.pageErrorMessage =
        "Impossible de charger les appels de loyer : l'agence de l'utilisateur courant est introuvable.";
      return;
    }

    this.loadYears();
  }

  public get selectedAppel(): AppelLoyersFactureDto | undefined {
    if (this.selectedAppelId === null) {
      return undefined;
    }

    return (
      this.filteredAppels.find(
        (appel) => this.getAppelId(appel) === this.selectedAppelId
      ) ??
      this.appels.find((appel) => this.getAppelId(appel) === this.selectedAppelId)
    );
  }

  public get totalAppels(): number {
    return this.appels.length;
  }

  public get totalBilledAmount(): number {
    return this.appels.reduce(
      (total, appel) => total + this.getMontantLoyer(appel),
      0
    );
  }

  public get totalOutstandingAmount(): number {
    return this.appels.reduce(
      (total, appel) => total + (appel.soldeAppelLoyer ?? 0),
      0
    );
  }

  public get totalPaidAmount(): number {
    return Math.max(this.totalBilledAmount - this.totalOutstandingAmount, 0);
  }

  public get soldCount(): number {
    return this.appels.filter((appel) => this.getAppelStatusKey(appel) === 'solde')
      .length;
  }

  public get unpaidCount(): number {
    return this.appels.filter((appel) => this.getAppelStatusKey(appel) === 'impaye')
      .length;
  }

  public get partialCount(): number {
    return this.appels.filter((appel) => this.getAppelStatusKey(appel) === 'partiel')
      .length;
  }

  public get reductionRate(): number {
    return this.appels[0]?.pourcentageReduction ?? 0;
  }

  public get selectedPeriodLabel(): string {
    const period = this.availablePeriods.find(
      (entry) => entry.periodeAppelLoyer === this.selectedPeriod
    );

    return period?.periodeLettre || this.selectedPeriod || 'Aucune periode';
  }

  public get hasReductionMessage(): boolean {
    return !!this.selectedAppel?.messageReduction?.trim();
  }

  public reloadData(): void {
    if (this.availableYears.length === 0) {
      this.loadYears();
      return;
    }

    this.loadPeriods(this.selectedYear, false);
  }

  public onYearChange(valueOrEvent: Event | number | string | null): void {
    const value = this.extractYearValue(valueOrEvent);
    if (!Number.isFinite(value) || value <= 0) {
      return;
    }

    this.selectedYear = value;
    this.selectedPeriod = '';
    this.loadPeriods(this.selectedYear, true);
  }

  public onPeriodChange(valueOrEvent: Event | string | null): void {
    const value = this.extractPeriodValue(valueOrEvent);
    if (!value) {
      this.selectedPeriod = '';
      this.clearAppels();
      return;
    }

    this.selectedPeriod = value;
    this.loadAppels(this.selectedPeriod);
  }

  public onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value ?? '';
    this.applyFilters();
  }

  public setStatusFilter(filter: AppelStatusFilter): void {
    this.statusFilter = filter;
    this.applyFilters();
  }

  public selectAppel(appel: AppelLoyersFactureDto): void {
    const appelId = this.getAppelId(appel);
    if (appelId === null) {
      return;
    }

    this.selectedAppelId = appelId;
  }

  public openReductionDialog(): void {
    if (!this.selectedPeriod) {
      this.notify(
        NotificationType.ERROR,
        "Selectionnez d'abord une periode avant d'appliquer une reduction."
      );
      return;
    }

    const dialogRef = this.dialog.open(ReductionAppelLoyerComponent, {
      width: 'min(560px, 94vw)',
      maxWidth: '94vw',
      autoFocus: false,
      data: { id: this.selectedPeriod },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (this.selectedPeriod) {
        this.loadAppels(this.selectedPeriod);
      }
    });
  }

  public printCurrentPeriod(): void {
    if (!this.user?.idAgence || !this.selectedPeriod) {
      return;
    }

    this.isPrintingPeriod = true;
    this.printService
      .printQuittanceByPeriode(
        this.selectedPeriod,
        this.user.idAgence
      )
      .pipe(finalize(() => (this.isPrintingPeriod = false)))
      .subscribe({
        next: (blob) => {
          this.printBlob(blob);
        },
        error: (error) => {
          this.notify(
            NotificationType.ERROR,
            this.extractErrorMessage(
              error,
              "Impossible d'imprimer la quittance de la periode."
            )
          );
        },
      });
  }

  public downloadCurrentPeriod(): void {
    if (!this.user?.idAgence || !this.selectedPeriod) {
      return;
    }

    this.isDownloadingPeriod = true;
    this.printService
      .printQuittanceByPeriode(
        this.selectedPeriod,
        this.user.idAgence
      )
      .pipe(finalize(() => (this.isDownloadingPeriod = false)))
      .subscribe({
        next: (blob) => {
          saveAs(blob, this.buildPeriodFileName());
        },
        error: (error) => {
          this.notify(
            NotificationType.ERROR,
            this.extractErrorMessage(
              error,
              'Impossible de telecharger la quittance de la periode.'
            )
          );
        },
      });
  }

  public sendGroupedMail(): void {
    if (!this.user?.idAgence || !this.selectedPeriod) {
      return;
    }

    this.isSendingGroupMail = true;
    this.apiService
      .sendMailGrouperWithAttachment({
        periode: this.selectedPeriod,
        idAgence: this.user.idAgence,
      })
      .pipe(finalize(() => (this.isSendingGroupMail = false)))
      .subscribe({
        next: (sent) => {
          this.notify(
            sent ? NotificationType.SUCCESS : NotificationType.ERROR,
            sent
              ? 'Les quittances de la periode ont ete envoyees.'
              : "L'envoi groupe n'a pas pu aboutir."
          );
        },
        error: (error) => {
          this.notify(
            NotificationType.ERROR,
            this.extractErrorMessage(
              error,
              "Impossible d'envoyer les quittances de la periode."
            )
          );
        },
      });
  }

  public printAppel(appel: AppelLoyersFactureDto): void {
    const appelId = this.getAppelId(appel);
    if (appelId === null) {
      return;
    }

    this.printingAppelId = appelId;
    this.printService
      .printQuittanceById(appelId)
      .pipe(finalize(() => (this.printingAppelId = null)))
      .subscribe({
        next: (blob) => {
          this.printBlob(blob);
        },
        error: (error) => {
          this.notify(
            NotificationType.ERROR,
            this.extractErrorMessage(
              error,
              "Impossible d'imprimer cette quittance."
            )
          );
        },
      });
  }

  public sendAppelMail(appel: AppelLoyersFactureDto): void {
    const appelId = this.getAppelId(appel);
    if (appelId === null) {
      return;
    }

    this.mailingAppelId = appelId;
    this.apiService
      .sendMailQuittanceWithAttachment(appelId)
      .pipe(finalize(() => (this.mailingAppelId = null)))
      .subscribe({
        next: (sent) => {
          this.notify(
            sent ? NotificationType.SUCCESS : NotificationType.ERROR,
            sent
              ? 'La quittance a ete envoyee par mail.'
              : "L'envoi par mail de la quittance a echoue."
          );
        },
        error: (error) => {
          this.notify(
            NotificationType.ERROR,
            this.extractErrorMessage(
              error,
              "Impossible d'envoyer cette quittance par mail."
            )
          );
        },
      });
  }

  public exportFilteredRows(): void {
    if (this.filteredAppels.length === 0) {
      this.notify(
        NotificationType.ERROR,
        "Aucune ligne n'est disponible pour l'export."
      );
      return;
    }

    const headers = [
      'Periode',
      'Locataire',
      'Email',
      'Bien',
      'Designation',
      'Loyer',
      'Solde',
      'Statut',
      'Echeance',
    ];

    const rows = this.filteredAppels.map((appel) => [
      appel.periodeLettre || appel.periodeAppelLoyer || '',
      this.getLocataireName(appel),
      appel.emailLocatire || '',
      appel.abrvBienimmobilier || '',
      appel.bienImmobilierFullName || '',
      this.formatCurrency(this.getMontantLoyer(appel)),
      this.formatCurrency(appel.soldeAppelLoyer),
      this.getAppelStatusLabel(appel),
      appel.datePaiementPrevuAppelLoyer || '',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => this.escapeCsv(value)).join(';'))
      .join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    });

    saveAs(blob, `appels-loyers-${this.buildPeriodSlug()}.csv`);
  }

  public trackByAppel(index: number, appel: AppelLoyersFactureDto): number | string {
    return appel.id ?? appel.idBailLocation ?? appel.periodeAppelLoyer ?? index;
  }

  public getAppelId(appel: AppelLoyersFactureDto): number | null {
    return this.toPositiveNumber(appel.id);
  }

  public getMontantLoyer(appel: AppelLoyersFactureDto): number {
    return appel.montantLoyerBailLPeriode ?? appel.nouveauMontantLoyer ?? 0;
  }

  public getLocataireName(appel: AppelLoyersFactureDto): string {
    const name = [
      this.sanitizeDisplayValue(appel.nomLocataire),
      this.sanitizeDisplayValue(appel.prenomLocataire),
    ]
      .filter((value): value is string => !!value)
      .join(' ')
      .trim();

    return name || '-';
  }

  public getProprietaireName(appel: AppelLoyersFactureDto): string {
    const name = [
      this.sanitizeDisplayValue(appel.nomPropietaire),
      this.sanitizeDisplayValue(appel.prenomPropietaire),
    ]
      .filter((value): value is string => !!value)
      .join(' ')
      .trim();

    return name || '-';
  }

  public getAppelStatusLabel(appel: AppelLoyersFactureDto): string {
    const status = this.getAppelStatusKey(appel);

    if (status === 'solde') {
      return 'Solde';
    }
    if (status === 'partiel') {
      return 'Partiellement paye';
    }
    return 'Impaye';
  }

  public getAppelStatusClass(appel: AppelLoyersFactureDto): string {
    const status = this.getAppelStatusKey(appel);

    if (status === 'solde') {
      return 'status-badge status-badge--success';
    }
    if (status === 'partiel') {
      return 'status-badge status-badge--warning';
    }
    return 'status-badge status-badge--danger';
  }

  public isAppelPrinting(appel: AppelLoyersFactureDto): boolean {
    return this.printingAppelId === this.getAppelId(appel);
  }

  public isAppelMailing(appel: AppelLoyersFactureDto): boolean {
    return this.mailingAppelId === this.getAppelId(appel);
  }

  public formatCurrency(value: number | null | undefined): string {
    const amount = value ?? 0;
    return `${amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} FCFA`;
  }

  private loadYears(): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.isLoadingYears = true;
    this.pageErrorMessage = '';

    this.apiService
      .listOfDistinctAnneeAppel(this.user.idAgence)
      .pipe(finalize(() => (this.isLoadingYears = false)))
      .subscribe({
        next: (years) => {
          this.availableYears = [...(years ?? [])].sort((left, right) => left - right);

          if (this.availableYears.length === 0) {
            this.selectedYear = Number.parseInt(
              this.currentPeriod.slice(0, 4),
              10
            );
            this.availablePeriods = [];
            this.clearAppels();
            return;
          }

          const preferredYear = Number.parseInt(
            this.currentPeriod.slice(0, 4),
            10
          );
          this.selectedYear = this.availableYears.includes(preferredYear)
            ? preferredYear
            : this.availableYears[this.availableYears.length - 1];

          this.loadPeriods(this.selectedYear, true);
        },
        error: (error) => {
          this.pageErrorMessage = this.extractErrorMessage(
            error,
            "Impossible de charger les annees d'appel."
          );
          this.availableYears = [];
          this.availablePeriods = [];
          this.clearAppels();
        },
      });
  }

  private loadPeriods(year: number, preferCurrentPeriod: boolean): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.isLoadingPeriods = true;
    this.pageErrorMessage = '';

    this.apiService
      .findAllPeriodeByAnnee({
        annee: year,
        idAgence: this.user.idAgence,
      })
      .pipe(finalize(() => (this.isLoadingPeriods = false)))
      .subscribe({
        next: (periods) => {
          this.availablePeriods = this.sortPeriods(periods ?? []);

          if (this.availablePeriods.length === 0) {
            this.selectedPeriod = '';
            this.clearAppels();
            return;
          }

          this.selectedPeriod = this.resolvePreferredPeriod(preferCurrentPeriod);

          if (this.selectedPeriod) {
            this.loadAppels(this.selectedPeriod);
          } else {
            this.clearAppels();
          }
        },
        error: (error) => {
          this.pageErrorMessage = this.extractErrorMessage(
            error,
            'Impossible de charger les periodes.'
          );
          this.availablePeriods = [];
          this.selectedPeriod = '';
          this.clearAppels();
        },
      });
  }

  private loadAppels(period: string): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.isLoadingAppels = true;
    this.pageErrorMessage = '';

    this.apiService
      .AppelLoyersParPeriode({
        periode: period,
        idAgence: this.user.idAgence,
      })
      .pipe(finalize(() => (this.isLoadingAppels = false)))
      .subscribe({
        next: (appels) => {
          this.appels = this.sortAppels(appels ?? []);
          this.applyFilters();
        },
        error: (error) => {
          this.pageErrorMessage = this.extractErrorMessage(
            error,
            "Impossible de charger les appels de loyer de la periode."
          );
          this.clearAppels();
        },
      });
  }

  private applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredAppels = this.sortAppels(
      this.appels.filter((appel) => {
        const matchesStatus =
          this.statusFilter === 'all' ||
          this.getAppelStatusKey(appel) === this.statusFilter;

        if (!matchesStatus) {
          return false;
        }

        if (!term) {
          return true;
        }

        return [
          appel.id?.toString(),
          appel.periodeAppelLoyer,
          appel.periodeLettre,
          appel.nomLocataire,
          appel.prenomLocataire,
          appel.emailLocatire,
          appel.abrvBienimmobilier,
          appel.bienImmobilierFullName,
          appel.abrvCodeBail,
          appel.statusAppelLoyer,
        ]
          .filter((value): value is string => !!value)
          .some((value) => value.toLowerCase().includes(term));
      })
    );

    if (this.filteredAppels.length === 0) {
      this.selectedAppelId = null;
      return;
    }

    const selectedStillVisible = this.filteredAppels.some(
      (appel) => this.getAppelId(appel) === this.selectedAppelId
    );

    if (!selectedStillVisible) {
      this.selectedAppelId = this.getAppelId(this.filteredAppels[0]);
    }
  }

  private clearAppels(): void {
    this.appels = [];
    this.filteredAppels = [];
    this.selectedAppelId = null;
  }

  private sortPeriods(periods: PeriodeDto[]): PeriodeDto[] {
    return [...periods].sort(
      (left, right) =>
        this.comparePeriods(
          left.periodeAppelLoyer ?? '',
          right.periodeAppelLoyer ?? ''
        )
    );
  }

  private sortAppels(appels: AppelLoyersFactureDto[]): AppelLoyersFactureDto[] {
    return [...appels].sort((left, right) => {
      const statusDelta =
        this.getStatusPriority(left) - this.getStatusPriority(right);

      if (statusDelta !== 0) {
        return statusDelta;
      }

      const leftDate = Date.parse(left.datePaiementPrevuAppelLoyer ?? '');
      const rightDate = Date.parse(right.datePaiementPrevuAppelLoyer ?? '');

      if (Number.isFinite(leftDate) && Number.isFinite(rightDate) && leftDate !== rightDate) {
        return leftDate - rightDate;
      }

      return this.getLocataireName(left).localeCompare(
        this.getLocataireName(right),
        'fr',
        { sensitivity: 'base' }
      );
    });
  }

  private getStatusPriority(appel: AppelLoyersFactureDto): number {
    const status = this.getAppelStatusKey(appel);
    if (status === 'impaye') {
      return 0;
    }
    if (status === 'partiel') {
      return 1;
    }
    return 2;
  }

  private getAppelStatusKey(appel: AppelLoyersFactureDto): AppelStatusKey {
    if (appel.solderAppelLoyer === true || (appel.soldeAppelLoyer ?? 0) === 0) {
      return 'solde';
    }

    const normalizedStatus = (appel.statusAppelLoyer ?? '').trim().toLowerCase();
    if (normalizedStatus.includes('part')) {
      return 'partiel';
    }

    return 'impaye';
  }

  private getPrintIdentity(): string {
    const identity = [this.user?.prenom, this.user?.nom]
      .filter((value): value is string => !!value)
      .join(' ')
      .trim();

    return identity || this.user?.username || 'GESTIMO';
  }

  private buildPeriodFileName(): string {
    return `quittances-${this.buildPeriodSlug()}.pdf`;
  }

  private resolvePreferredPeriod(preferCurrentPeriod: boolean): string {
    if (this.availablePeriods.length === 0) {
      return '';
    }

    if (
      !preferCurrentPeriod &&
      this.selectedPeriod &&
      this.availablePeriods.some(
        (period) => period.periodeAppelLoyer === this.selectedPeriod
      )
    ) {
      return this.selectedPeriod;
    }

    const sortedAscending = [...this.availablePeriods]
      .map((period) => period.periodeAppelLoyer ?? '')
      .filter((period): period is string => !!period)
      .sort((left, right) => this.comparePeriods(left, right));

    const exactCurrentPeriod = sortedAscending.find(
      (period) => this.comparePeriods(period, this.currentPeriod) === 0
    );
    if (exactCurrentPeriod) {
      return exactCurrentPeriod;
    }

    const nearestPastOrCurrentPeriod = [...sortedAscending]
      .reverse()
      .find((period) => this.comparePeriods(period, this.currentPeriod) <= 0);

    const nearestFuturePeriod = sortedAscending.find(
      (period) => this.comparePeriods(period, this.currentPeriod) >= 0
    );

    return (
      nearestPastOrCurrentPeriod ||
      nearestFuturePeriod ||
      sortedAscending[sortedAscending.length - 1] ||
      ''
    );
  }

  private buildPeriodSlug(): string {
    const rawValue = this.selectedPeriod || this.selectedPeriodLabel || 'periode';

    return rawValue
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
  }

  private printBlob(blob: Blob): void {
    const blobUrl = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');

    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.src = blobUrl;

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      window.setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
        iframe.remove();
      }, 1000);
    };

    document.body.appendChild(iframe);
  }

  private escapeCsv(value: string): string {
    const normalized = String(value ?? '').replace(/"/g, '""');
    return `"${normalized}"`;
  }

  private extractYearValue(valueOrEvent: Event | number | string | null): number {
    if (
      typeof valueOrEvent === 'number' ||
      typeof valueOrEvent === 'string'
    ) {
      return Number(valueOrEvent);
    }

    if (valueOrEvent?.target instanceof HTMLSelectElement) {
      return Number(valueOrEvent.target.value);
    }

    return Number.NaN;
  }

  private extractPeriodValue(valueOrEvent: Event | string | null): string {
    if (typeof valueOrEvent === 'string') {
      return valueOrEvent;
    }

    if (valueOrEvent?.target instanceof HTMLSelectElement) {
      return valueOrEvent.target.value ?? '';
    }

    return '';
  }

  private comparePeriods(left: string, right: string): number {
    const leftParts = left.split('-').map((value) => Number.parseInt(value, 10));
    const rightParts = right
      .split('-')
      .map((value) => Number.parseInt(value, 10));

    if (
      leftParts.length !== 2 ||
      rightParts.length !== 2 ||
      leftParts.some((value) => !Number.isFinite(value)) ||
      rightParts.some((value) => !Number.isFinite(value))
    ) {
      return left.localeCompare(right, 'fr', { sensitivity: 'base' });
    }

    if (leftParts[0] !== rightParts[0]) {
      return leftParts[0] - rightParts[0];
    }

    return leftParts[1] - rightParts[1];
  }

  private sanitizeDisplayValue(value: string | null | undefined): string {
    return String(value ?? '')
      .replace(/\bnull\b/gi, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  private getCurrentUser(): UtilisateurRequestDto | null {
    try {
      return this.userService.getUserFromLocalCache();
    } catch (error) {
      return null;
    }
  }

  private toPositiveNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const normalized =
      typeof value === 'number' ? value : Number.parseInt(String(value), 10);

    return Number.isFinite(normalized) && normalized > 0 ? normalized : null;
  }

  private extractErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return (
          "Le navigateur n'arrive pas a joindre l'API locale de generation PDF sur http://localhost:8287. " +
          'Verifiez que le backend est demarre et que le navigateur n est pas en mode hors connexion.'
        );
      }

      if (typeof error.error === 'string' && error.error.trim()) {
        return error.error;
      }

      if (Array.isArray(error.error?.errors) && error.error.errors.length > 0) {
        return error.error.errors.join(' ');
      }

      if (
        typeof error.error?.message === 'string' &&
        error.error.message.trim()
      ) {
        return error.error.message;
      }

      if (
        typeof error.error?.errorMessage === 'string' &&
        error.error.errorMessage.trim()
      ) {
        return error.error.errorMessage;
      }

      if (typeof error.message === 'string' && error.message.trim()) {
        return error.message;
      }
    }

    return fallback;
  }

  private notify(type: NotificationType, message: string): void {
    this.notificationService.notify(type, message);
  }

  private buildCurrentPeriodString(): string {
    return formatDate(new Date(), 'yyyy-MM', 'en');
  }
}
