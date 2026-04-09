import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { finalize } from 'rxjs/operators';
import {
  AppelLoyerDto,
  OperationDto,
  UtilisateurRequestDto,
} from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { PrintServiceService } from 'src/app/services/Print/print-service.service';
import { UserService } from 'src/app/services/user/user.service';
import { ModifLoyerBailComponent } from '../modif-loyer-bail/modif-loyer-bail.component';
import { PageBauxNewComponent } from '../page-baux-new/page-baux-new.component';

export interface DialogData {
  idReservation: any;
  bienimmo: any;
  id: any;
}

interface CloseBailPeriodOption {
  periodCode: string;
  selected: boolean;
  isCurrentMonth: boolean;
  loyer: AppelLoyerDto;
}

type BailFilter = 'all' | 'encours' | 'cloture';

@Component({
  standalone: false,
  selector: 'app-page-baux',
  templateUrl: './page-baux.component.html',
  styleUrls: ['./page-baux.component.css'],
})
export class PageBauxComponent implements OnInit {
  private readonly loyerPeriodFormatter = new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
  });
  public readonly closeBailDateFormatter = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  public readonly bauxPageSizeOptions = [10, 25, 50];
  public readonly loyerPageSizeOptions = [5, 10, 25, 50];

  public user: UtilisateurRequestDto | null = null;

  public baux: OperationDto[] = [];
  public selectedBailId: number | null = null;
  public bailLoyers: AppelLoyerDto[] = [];
  public bauxCurrentPage = 1;
  public bauxPageSize = 10;
  public loyerCurrentPage = 1;
  public loyerPageSize = 10;
  public isCloseBailModalOpen = false;
  public isLoadingCloseBailOptions = false;
  public closeBailModalErrorMessage = '';
  public closeBailTarget: OperationDto | null = null;
  public closeBailPeriodOptions: CloseBailPeriodOption[] = [];

  public searchTerm = '';
  public statusFilter: BailFilter = 'all';

  public isLoadingBaux = false;
  public isLoadingDetails = false;
  public deletingBailId: number | null = null;
  public closingBailId: number | null = null;
  public printingBailId: number | null = null;

  public pageErrorMessage = '';

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
        "Impossible de charger les baux : l'agence de l'utilisateur courant est introuvable.";
      return;
    }

    this.loadBaux();
  }

  public get filteredBaux(): OperationDto[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.baux.filter((bail) => {
      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'encours' && bail.enCoursBail === true) ||
        (this.statusFilter === 'cloture' && bail.enCoursBail === false);

      if (!matchesStatus) {
        return false;
      }

      if (!term) {
        return true;
      }

      return [
        bail.id?.toString(),
        bail.designationBail,
        bail.abrvCodeBail,
        bail.codeAbrvBienImmobilier,
        bail.utilisateurOperation,
        bail.bienImmobilierOperation,
        bail.dateDebut,
        bail.dateFin,
      ]
        .filter((value): value is string => !!value)
        .some((value) => value.toLowerCase().includes(term));
    });
  }

  public get selectedBail(): OperationDto | undefined {
    if (this.selectedBailId === null) {
      return undefined;
    }

    return this.baux.find((bail) => bail.id === this.selectedBailId);
  }

  public get totalBaux(): number {
    return this.baux.length;
  }

  public get totalBauxEncours(): number {
    return this.baux.filter((bail) => bail.enCoursBail === true).length;
  }

  public get totalBauxClotures(): number {
    return this.baux.filter((bail) => bail.enCoursBail === false).length;
  }

  public get bauxTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredBaux.length / this.bauxPageSize));
  }

  public get currentBauxPageNumber(): number {
    return Math.min(this.bauxCurrentPage, this.bauxTotalPages);
  }

  public get paginatedBaux(): OperationDto[] {
    const start = (this.currentBauxPageNumber - 1) * this.bauxPageSize;
    return this.filteredBaux.slice(start, start + this.bauxPageSize);
  }

  public get bauxPaginationStart(): number {
    if (this.filteredBaux.length === 0) {
      return 0;
    }
    return (this.currentBauxPageNumber - 1) * this.bauxPageSize + 1;
  }

  public get bauxPaginationEnd(): number {
    return Math.min(
      this.currentBauxPageNumber * this.bauxPageSize,
      this.filteredBaux.length
    );
  }

  public get bauxVisiblePages(): number[] {
    return this.buildVisiblePages(this.currentBauxPageNumber, this.bauxTotalPages);
  }

  public get loyersTotalPages(): number {
    return Math.max(1, Math.ceil(this.bailLoyers.length / this.loyerPageSize));
  }

  public get currentLoyerPageNumber(): number {
    return Math.min(this.loyerCurrentPage, this.loyersTotalPages);
  }

  public get paginatedBailLoyers(): AppelLoyerDto[] {
    const start = (this.currentLoyerPageNumber - 1) * this.loyerPageSize;
    return this.bailLoyers.slice(start, start + this.loyerPageSize);
  }

  public get loyersPaginationStart(): number {
    if (this.bailLoyers.length === 0) {
      return 0;
    }
    return (this.currentLoyerPageNumber - 1) * this.loyerPageSize + 1;
  }

  public get loyersPaginationEnd(): number {
    return Math.min(
      this.currentLoyerPageNumber * this.loyerPageSize,
      this.bailLoyers.length
    );
  }

  public get loyersVisiblePages(): number[] {
    return this.buildVisiblePages(this.currentLoyerPageNumber, this.loyersTotalPages);
  }

  public get selectedCloseBailPeriodsCount(): number {
    return this.closeBailPeriodOptions.filter((option) => option.selected).length;
  }

  public get closeBailTargetLabel(): string {
    const bail = this.closeBailTarget;
    if (!bail) {
      return 'Bail';
    }

    return this.getBailTitleLabel(bail);
  }

  public get closeBailEffectiveDateLabel(): string {
    return this.closeBailDateFormatter.format(new Date());
  }

  public get selectedOutstandingBalance(): number {
    return this.bailLoyers.reduce(
      (total, loyer) => total + (loyer.soldeAppelLoyer ?? 0),
      0
    );
  }

  public reloadData(): void {
    this.loadBaux();
  }

  public openCreateDialog(): void {
    const dialogRef = this.dialog.open(PageBauxNewComponent, {
      width: 'min(1120px, 96vw)',
      maxWidth: '96vw',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadBaux();
    });
  }

  public openModifMontantDialog(bail: OperationDto): void {
    const dialogRef = this.dialog.open(ModifLoyerBailComponent, {
      width: 'min(980px, 96vw)',
      maxWidth: '96vw',
      maxHeight: '92vh',
      autoFocus: false,
      data: { id: bail },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadBaux();
      if (this.toPositiveNumber(bail.id) !== null) {
        this.loadLoyers(this.toPositiveNumber(bail.id)!);
      }
    });
  }

  public selectBail(bail: OperationDto): void {
    const bailId = this.toPositiveNumber(bail.id);
    if (bailId === null) {
      return;
    }

    this.selectedBailId = bailId;
    this.loadLoyers(bailId);
  }

  public deleteBail(bail: OperationDto): void {
    const bailId = this.toPositiveNumber(bail.id);
    if (bailId === null) {
      return;
    }

    const confirmation = window.confirm(
      `Voulez-vous vraiment supprimer le bail ${this.getBailTitleLabel(bail)} ?`
    );

    if (!confirmation) {
      return;
    }

    this.deletingBailId = bailId;
    this.apiService
      .supprimerBail(bailId)
      .pipe(finalize(() => (this.deletingBailId = null)))
      .subscribe({
        next: (deleted) => {
          if (!deleted) {
            this.notify(
              NotificationType.ERROR,
              'La suppression du bail a echoue.'
            );
            return;
          }

          if (this.selectedBailId === bailId) {
            this.selectedBailId = null;
            this.bailLoyers = [];
          }

          this.notify(NotificationType.SUCCESS, 'Le bail a bien ete supprime.');
          this.loadBaux();
        },
        error: (error) => {
          this.notify(
            NotificationType.ERROR,
            this.extractErrorMessage(error, 'Impossible de supprimer le bail.')
          );
        },
      });
  }

  public closeBail(bail: OperationDto): void {
    const bailId = this.toPositiveNumber(bail.id);
    if (bailId === null) {
      return;
    }

    if (bail.enCoursBail === false) {
      this.notify(NotificationType.ERROR, 'Ce bail est deja cloture.');
      return;
    }

    this.closeBailTarget = bail;
    this.isCloseBailModalOpen = true;
    this.isLoadingCloseBailOptions = true;
    this.closeBailModalErrorMessage = '';
    this.closeBailPeriodOptions = [];

    this.apiService
      .listDesLoyersParBail(bailId)
      .pipe(finalize(() => (this.isLoadingCloseBailOptions = false)))
      .subscribe({
        next: (loyers) => {
          this.closeBailPeriodOptions = this.buildCloseBailPeriodOptions(
            this.sortLoyers(loyers ?? [])
          );
        },
        error: (error) => {
          this.closeBailModalErrorMessage = this.extractErrorMessage(
            error,
            'Impossible de charger les periodes du bail avant cloture.'
          );
        },
      });
  }

  public cancelCloseBailModal(): void {
    if (this.closingBailId !== null) {
      return;
    }

    this.resetCloseBailModal();
  }

  public toggleCloseBailPeriod(periodCode: string, checked: boolean): void {
    this.closeBailPeriodOptions = this.closeBailPeriodOptions.map((option) =>
      option.periodCode === periodCode ? { ...option, selected: checked } : option
    );
  }

  public confirmCloseBail(): void {
    const bailId = this.toPositiveNumber(this.closeBailTarget?.id);
    if (bailId === null) {
      return;
    }

    this.closingBailId = bailId;
    this.closeBailModalErrorMessage = '';

    this.apiService
      .clotureBail(bailId, undefined, {
        periodesRecouvrement: this.closeBailPeriodOptions
          .filter((option) => option.selected)
          .map((option) => option.periodCode),
      })
      .pipe(finalize(() => (this.closingBailId = null)))
      .subscribe({
        next: () => {
          this.notify(NotificationType.SUCCESS, 'Le bail a bien ete cloture.');
          this.resetCloseBailModal();
          this.loadBaux();
        },
        error: (error) => {
          this.closeBailModalErrorMessage = this.extractErrorMessage(
            error,
            'Impossible de cloturer le bail.'
          );
          this.notify(NotificationType.ERROR, this.closeBailModalErrorMessage);
        },
      });
  }

  public printBail(bail: OperationDto): void {
    const bailId = this.toPositiveNumber(bail.id);
    if (bailId === null) {
      return;
    }

    this.printingBailId = bailId;
    this.printService
      .printBail(bailId)
      .pipe(finalize(() => (this.printingBailId = null)))
      .subscribe({
        next: (blob) => {
          saveAs(blob, this.buildBailFileName(bail));
        },
        error: (error) => {
          this.notify(
            NotificationType.ERROR,
            this.extractErrorMessage(error, "Impossible d'imprimer le bail.")
          );
        },
      });
  }

  public onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value ?? '';
    this.bauxCurrentPage = 1;
  }

  public setStatusFilter(filter: BailFilter): void {
    this.statusFilter = filter;
    this.bauxCurrentPage = 1;
  }

  public onBauxPageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (Number.isFinite(value) && value > 0) {
      this.bauxPageSize = value;
      this.bauxCurrentPage = 1;
    }
  }

  public goToBauxPage(page: number): void {
    this.bauxCurrentPage = Math.min(Math.max(1, page), this.bauxTotalPages);
  }

  public previousBauxPage(): void {
    this.goToBauxPage(this.currentBauxPageNumber - 1);
  }

  public nextBauxPage(): void {
    this.goToBauxPage(this.currentBauxPageNumber + 1);
  }

  public onLoyerPageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (Number.isFinite(value) && value > 0) {
      this.loyerPageSize = value;
      this.loyerCurrentPage = 1;
    }
  }

  public goToLoyerPage(page: number): void {
    this.loyerCurrentPage = Math.min(Math.max(1, page), this.loyersTotalPages);
  }

  public previousLoyerPage(): void {
    this.goToLoyerPage(this.currentLoyerPageNumber - 1);
  }

  public nextLoyerPage(): void {
    this.goToLoyerPage(this.currentLoyerPageNumber + 1);
  }

  public trackByBail(index: number, bail: OperationDto): number | string {
    return bail.id ?? bail.abrvCodeBail ?? index;
  }

  public trackByLoyer(index: number, loyer: AppelLoyerDto): number | string {
    return loyer.id ?? loyer.periodeAppelLoyer ?? index;
  }

  public isDeleting(bail: OperationDto): boolean {
    return this.deletingBailId === this.toPositiveNumber(bail.id);
  }

  public isClosing(bail: OperationDto): boolean {
    return this.closingBailId === this.toPositiveNumber(bail.id);
  }

  public isPrinting(bail: OperationDto): boolean {
    return this.printingBailId === this.toPositiveNumber(bail.id);
  }

  public getBailTypeLabel(bail: OperationDto): string {
    const source = [
      this.getBailCodeLabel(bail),
      this.sanitizeDisplayValue(bail.designationBail),
      this.sanitizeDisplayValue(bail.bienImmobilierOperation),
    ]
      .filter((value): value is string => !!value)
      .join(' ')
      .toUpperCase();

    if (source.includes('APPART')) {
      return 'Appartement';
    }
    if (source.includes('MAGASIN')) {
      return 'Magasin';
    }
    if (source.includes('VILLA')) {
      return 'Villa';
    }
    return 'Bail';
  }

  public getBailCodeLabel(bail: OperationDto | null | undefined): string {
    const code = this.sanitizeDisplayValue(bail?.abrvCodeBail);
    if (code) {
      return code;
    }

    const tenant = this.sanitizeDisplayValue(bail?.utilisateurOperation);
    const assetCode = this.sanitizeDisplayValue(bail?.codeAbrvBienImmobilier);
    if (tenant && assetCode) {
      return `${tenant}/${assetCode}`;
    }

    const designation = this.sanitizeDisplayValue(bail?.designationBail);
    if (designation) {
      return designation;
    }

    return bail?.id ? `BAIL-${bail.id}` : '-';
  }

  public getBailTitleLabel(bail: OperationDto | null | undefined): string {
    const designation = this.sanitizeDisplayValue(bail?.designationBail);
    return designation || this.getBailCodeLabel(bail);
  }

  public getBailTenantAssetLabel(bail: OperationDto | null | undefined): string {
    const tenant = this.sanitizeDisplayValue(bail?.utilisateurOperation) || '-';
    const assetCode = this.sanitizeDisplayValue(bail?.codeAbrvBienImmobilier) || '-';
    return `${tenant} / ${assetCode}`;
  }

  public getBailLocataireLabel(bail: OperationDto | null | undefined): string {
    return this.sanitizeDisplayValue(bail?.utilisateurOperation) || '-';
  }

  public getBailAssetCodeLabel(bail: OperationDto | null | undefined): string {
    return this.sanitizeDisplayValue(bail?.codeAbrvBienImmobilier) || '-';
  }

  public getBailStatusLabel(bail: OperationDto): string {
    return bail.enCoursBail ? 'En cours' : 'Cloture';
  }

  public getBailStatusClass(bail: OperationDto): string {
    return bail.enCoursBail ? 'status-badge status-badge--active' : 'status-badge';
  }

  public getLoyerStatusLabel(loyer: AppelLoyerDto): string {
    if (loyer.solderAppelLoyer === true || (loyer.soldeAppelLoyer ?? 0) === 0) {
      return 'Solde';
    }
    return loyer.statusAppelLoyer || 'Impaye';
  }

  public getLoyerStatusClass(loyer: AppelLoyerDto): string {
    if (loyer.solderAppelLoyer === true || (loyer.soldeAppelLoyer ?? 0) === 0) {
      return 'status-badge status-badge--active';
    }
    return 'status-badge';
  }

  public formatCurrency(value: number | null | undefined): string {
    const amount = value ?? 0;
    return `${amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} FCFA`;
  }

  public formatLoyerPeriod(loyer: AppelLoyerDto): string {
    const periodDate = this.resolveLoyerPeriodDate(loyer);
    if (!periodDate) {
      return loyer.periodeAppelLoyer || '-';
    }

    return this.loyerPeriodFormatter.format(periodDate);
  }

  private loadBaux(): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.isLoadingBaux = true;
    this.pageErrorMessage = '';

    this.apiService
      .findAllOperations(this.user.idAgence)
      .pipe(finalize(() => (this.isLoadingBaux = false)))
      .subscribe({
        next: (baux) => {
          this.baux = this.sortBaux(baux ?? []);
          this.bauxCurrentPage = 1;

          if (
            this.selectedBailId !== null &&
            this.baux.some((bail) => bail.id === this.selectedBailId)
          ) {
            this.loadLoyers(this.selectedBailId);
          } else if (this.baux.length > 0) {
            const defaultBailId = this.toPositiveNumber(this.baux[0].id);
            if (defaultBailId !== null) {
              this.selectedBailId = defaultBailId;
              this.loadLoyers(defaultBailId);
              return;
            }
            this.selectedBailId = null;
            this.bailLoyers = [];
          } else if (this.selectedBailId !== null) {
            this.selectedBailId = null;
            this.bailLoyers = [];
          } else {
            this.bailLoyers = [];
          }
        },
        error: (error) => {
          this.pageErrorMessage = this.extractErrorMessage(
            error,
            'Impossible de charger les baux.'
          );
        },
      });
  }

  private loadLoyers(bailId: number): void {
    this.isLoadingDetails = true;

    this.apiService
      .listDesLoyersParBail(bailId)
      .pipe(finalize(() => (this.isLoadingDetails = false)))
      .subscribe({
        next: (loyers) => {
          this.bailLoyers = this.sortLoyers(loyers ?? []);
          this.loyerCurrentPage = 1;
        },
        error: (error) => {
          this.notify(
            NotificationType.ERROR,
            this.extractErrorMessage(
              error,
              'Impossible de charger les appels de loyer.'
            )
          );
          this.bailLoyers = [];
          this.loyerCurrentPage = 1;
        },
      });
  }

  private sortBaux(baux: OperationDto[]): OperationDto[] {
    return [...baux].sort((left, right) => {
      const activeScore = Number(!!right.enCoursBail) - Number(!!left.enCoursBail);
      if (activeScore !== 0) {
        return activeScore;
      }

      const leftDate = Date.parse(left.dateDebut ?? '');
      const rightDate = Date.parse(right.dateDebut ?? '');

      if (Number.isFinite(leftDate) && Number.isFinite(rightDate)) {
        return rightDate - leftDate;
      }

      return (left.designationBail ?? left.abrvCodeBail ?? '').localeCompare(
        right.designationBail ?? right.abrvCodeBail ?? '',
        'fr',
        { sensitivity: 'base' }
      );
    });
  }

  private sortLoyers(loyers: AppelLoyerDto[]): AppelLoyerDto[] {
    return [...loyers].sort((left, right) => {
      const leftDate = this.resolveLoyerSortValue(left);
      const rightDate = this.resolveLoyerSortValue(right);

      if (Number.isFinite(leftDate) && Number.isFinite(rightDate)) {
        return leftDate - rightDate;
      }

      return (left.periodeAppelLoyer ?? '').localeCompare(
        right.periodeAppelLoyer ?? '',
        'fr',
        { sensitivity: 'base' }
      );
    });
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

  private buildBailFileName(bail: OperationDto): string {
    const rawName = this.getBailCodeLabel(bail);
    const normalized = rawName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();

    return `${normalized || 'bail'}.pdf`;
  }

  private buildCloseBailPeriodOptions(
    loyers: AppelLoyerDto[]
  ): CloseBailPeriodOption[] {
    const currentMonthStart = this.getCurrentMonthStart();

    return loyers
      .filter((loyer) => this.isCloseBailRecoveryCandidate(loyer, currentMonthStart))
      .map((loyer) => {
        const periodDate = this.resolveLoyerPeriodDate(loyer);
        const isCurrentMonth =
          !!periodDate &&
          periodDate.getFullYear() === currentMonthStart.getFullYear() &&
          periodDate.getMonth() === currentMonthStart.getMonth();

        return {
          periodCode: loyer.periodeAppelLoyer ?? '',
          selected: isCurrentMonth,
          isCurrentMonth,
          loyer,
        };
      });
  }

  private resolveLoyerSortValue(loyer: AppelLoyerDto): number {
    const periodDate = this.resolveLoyerPeriodDate(loyer);
    if (periodDate) {
      return periodDate.getTime();
    }

    const dueDate = Date.parse(loyer.datePaiementPrevuAppelLoyer ?? '');
    if (Number.isFinite(dueDate)) {
      return dueDate;
    }

    return Number.POSITIVE_INFINITY;
  }

  private resolveLoyerPeriodDate(loyer: AppelLoyerDto): Date | null {
    const periodStart = Date.parse(loyer.dateDebutMoisAppelLoyer ?? '');
    if (Number.isFinite(periodStart)) {
      return new Date(periodStart);
    }

    const periodCode = (loyer.periodeAppelLoyer ?? '').trim();
    const periodMatch = periodCode.match(/^(\d{4})-(\d{2})$/);
    if (!periodMatch) {
      return null;
    }

    const [, year, month] = periodMatch;
    return new Date(Number(year), Number(month) - 1, 1);
  }

  private isCloseBailRecoveryCandidate(
    loyer: AppelLoyerDto,
    currentMonthStart: Date
  ): boolean {
    if ((loyer.soldeAppelLoyer ?? 0) <= 0) {
      return false;
    }

    const periodDate = this.resolveLoyerPeriodDate(loyer);
    if (!periodDate) {
      return false;
    }

    return periodDate.getTime() >= currentMonthStart.getTime();
  }

  private getCurrentMonthStart(): Date {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }

  private buildVisiblePages(currentPage: number, totalPages: number): number[] {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    const adjustedStart = Math.max(1, end - 4);

    return Array.from(
      { length: end - adjustedStart + 1 },
      (_, index) => adjustedStart + index
    );
  }

  private extractErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      if (typeof error.error === 'string' && error.error.trim()) {
        return error.error;
      }

      if (Array.isArray(error.error?.errors) && error.error.errors.length > 0) {
        return error.error.errors.join(' ');
      }

      if (typeof error.error?.message === 'string' && error.error.message.trim()) {
        return error.error.message;
      }

      if (typeof error.error?.errorMessage === 'string' && error.error.errorMessage.trim()) {
        return error.error.errorMessage;
      }

      if (typeof error.message === 'string' && error.message.trim()) {
        return error.message;
      }
    }

    return fallback;
  }

  private sanitizeDisplayValue(value: string | null | undefined): string {
    return String(value ?? '')
      .replace(/\bnull\b/gi, ' ')
      .replace(/\s*\/\s*/g, '/')
      .replace(/\s{2,}/g, ' ')
      .replace(/^\/+|\/+$/g, '')
      .trim();
  }

  private notify(type: NotificationType, message: string): void {
    this.notificationService.notify(type, message);
  }

  private resetCloseBailModal(): void {
    this.isCloseBailModalOpen = false;
    this.isLoadingCloseBailOptions = false;
    this.closeBailModalErrorMessage = '';
    this.closeBailTarget = null;
    this.closeBailPeriodOptions = [];
  }
}
