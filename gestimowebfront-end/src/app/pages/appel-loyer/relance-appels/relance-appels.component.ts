import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AppelLoyersFactureDto, UtilisateurRequestDto } from 'src/gs-api/src/models';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { RelanceService } from 'src/app/services/relance/relance.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  standalone: false,
  selector: 'app-relance-appels',
  templateUrl: './relance-appels.component.html',
  styleUrls: ['./relance-appels.component.css'],
})
export class RelanceAppelsComponent implements OnInit {
  public readonly pageSizeOptions = [10, 25, 50, 100];

  public user: UtilisateurRequestDto | null = null;
  public relances: AppelLoyersFactureDto[] = [];
  public searchTerm = '';
  public currentPage = 1;
  public pageSize = 10;
  public isLoading = false;
  public isSendingBulk = false;
  public isSendingGlobalBulk = false;
  public pageErrorMessage = '';

  private readonly selectedIds = new Set<number>();
  private readonly sendingIds = new Set<number>();
  private readonly sendingGlobalKeys = new Set<string>();

  constructor(
    private readonly relanceService: RelanceService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) {}

  public ngOnInit(): void {
    this.user = this.getCurrentUser();

    if (!this.user?.idAgence) {
      this.pageErrorMessage =
        "Impossible de charger les relances : agence utilisateur introuvable.";
      return;
    }

    this.loadRelances();
  }

  public get totalRelances(): number {
    return this.relances.length;
  }

  public get totalSolde(): number {
    return this.relances.reduce(
      (sum, relance) => sum + Number(relance.soldeAppelLoyer ?? 0),
      0
    );
  }

  public get withEmailCount(): number {
    return this.relances.filter((relance) => this.hasEmail(relance)).length;
  }

  public get missingEmailCount(): number {
    return this.relances.filter((relance) => !this.hasEmail(relance)).length;
  }

  public get filteredRelances(): AppelLoyersFactureDto[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.relances.filter((relance) => {
      if (!term) {
        return true;
      }

      return [
        this.getLocataireLabel(relance),
        relance.emailLocatire,
        relance.periodeLettre,
        relance.periodeAppelLoyer,
        relance.bienImmobilierFullName,
        relance.abrvBienimmobilier,
        relance.abrvCodeBail,
        relance.nomAgence,
      ]
        .filter((value) => !!value)
        .some((value) => value!.toLowerCase().includes(term));
    });
  }

  public get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRelances.length / this.pageSize));
  }

  public get currentPageNumber(): number {
    return Math.min(this.currentPage, this.totalPages);
  }

  public get pagedRelances(): AppelLoyersFactureDto[] {
    const start = (this.currentPageNumber - 1) * this.pageSize;
    return this.filteredRelances.slice(start, start + this.pageSize);
  }

  public get paginationStart(): number {
    if (this.filteredRelances.length === 0) {
      return 0;
    }

    return (this.currentPageNumber - 1) * this.pageSize + 1;
  }

  public get paginationEnd(): number {
    return Math.min(this.currentPageNumber * this.pageSize, this.filteredRelances.length);
  }

  public get visiblePages(): number[] {
    const start = Math.max(1, this.currentPageNumber - 2);
    const end = Math.min(this.totalPages, start + 4);
    const adjustedStart = Math.max(1, end - 4);

    return Array.from(
      { length: end - adjustedStart + 1 },
      (_, index) => adjustedStart + index
    );
  }

  public get selectedCount(): number {
    return this.selectedRelances.length;
  }

  public get selectedGlobalCount(): number {
    return this.selectedGlobalRelances.length;
  }

  public get canSendBulk(): boolean {
    return !this.isBulkActionRunning && this.selectedRelances.length > 0;
  }

  public get canSendBulkGlobal(): boolean {
    return !this.isBulkActionRunning && this.selectedGlobalRelances.length > 0;
  }

  public get isBulkActionRunning(): boolean {
    return this.isSendingBulk || this.isSendingGlobalBulk;
  }

  private get selectedRelances(): AppelLoyersFactureDto[] {
    return this.relances.filter((relance) => {
      const id = this.toPositiveNumber(relance.id);
      return id !== null && this.selectedIds.has(id) && this.hasEmail(relance);
    });
  }

  private get selectedGlobalRelances(): AppelLoyersFactureDto[] {
    const uniqueRelances = new Map<string, AppelLoyersFactureDto>();

    this.selectedRelances.forEach((relance) => {
      const key = this.getGlobalRelanceKey(relance);
      if (!key || uniqueRelances.has(key)) {
        return;
      }

      uniqueRelances.set(key, relance);
    });

    return Array.from(uniqueRelances.values());
  }

  public loadRelances(): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.isLoading = true;
    this.pageErrorMessage = '';
    this.selectedIds.clear();
    this.sendingIds.clear();
    this.sendingGlobalKeys.clear();

    this.relanceService.getRelances(this.user.idAgence).subscribe({
      next: (result) => {
        this.relances = [...(result ?? [])].sort((left, right) =>
          this.getPeriodSortValue(left).localeCompare(this.getPeriodSortValue(right), 'fr', {
            sensitivity: 'base',
          })
        );
        this.currentPage = 1;
        this.isLoading = false;
      },
      error: (error) => {
        this.pageErrorMessage = this.extractErrorMessage(
          error,
          "Impossible de charger les loyers a relancer."
        );
        this.isLoading = false;
      },
    });
  }

  public onSearchChange(value: string): void {
    this.searchTerm = value ?? '';
    this.currentPage = 1;
  }

  public onPageSizeChange(value: number | string): void {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return;
    }

    this.pageSize = parsed;
    this.currentPage = 1;
  }

  public goToPage(page: number): void {
    this.currentPage = Math.min(Math.max(1, page), this.totalPages);
  }

  public previousPage(): void {
    this.goToPage(this.currentPageNumber - 1);
  }

  public nextPage(): void {
    this.goToPage(this.currentPageNumber + 1);
  }

  public toggleSelection(relance: AppelLoyersFactureDto, checked: boolean): void {
    const id = this.toPositiveNumber(relance.id);
    if (id === null || !this.hasEmail(relance)) {
      return;
    }

    if (checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
  }

  public toggleCurrentPageSelection(checked: boolean): void {
    this.pagedRelances.forEach((relance) => {
      if (!this.hasEmail(relance)) {
        return;
      }

      const id = this.toPositiveNumber(relance.id);
      if (id === null) {
        return;
      }

      if (checked) {
        this.selectedIds.add(id);
      } else {
        this.selectedIds.delete(id);
      }
    });
  }

  public isSelected(relance: AppelLoyersFactureDto): boolean {
    const id = this.toPositiveNumber(relance.id);
    return id !== null && this.selectedIds.has(id);
  }

  public areAllCurrentPageSelected(): boolean {
    const selectableItems = this.pagedRelances.filter((relance) => this.hasEmail(relance));
    return (
      selectableItems.length > 0 &&
      selectableItems.every((relance) => this.isSelected(relance))
    );
  }

  public sendSingleRelance(relance: AppelLoyersFactureDto): void {
    const id = this.toPositiveNumber(relance.id);
    if (
      id === null ||
      !this.hasEmail(relance) ||
      this.sendingIds.has(id) ||
      this.isBulkActionRunning ||
      this.isSendingGlobal(relance)
    ) {
      return;
    }

    this.sendingIds.add(id);
    this.relanceService.sendRelanceMail(id).subscribe({
      next: (result) => {
        this.sendingIds.delete(id);
        if (result) {
          this.notify(
            NotificationType.SUCCESS,
            `Mail de relance envoye a ${this.getLocataireLabel(relance)}.`
          );
          return;
        }

        this.notify(
          NotificationType.ERROR,
          `Impossible d'envoyer la relance a ${this.getLocataireLabel(relance)}.`
        );
      },
      error: (error) => {
        this.sendingIds.delete(id);
        this.notify(
          NotificationType.ERROR,
          this.extractErrorMessage(
            error,
            `Impossible d'envoyer la relance a ${this.getLocataireLabel(relance)}.`
          )
        );
      },
    });
  }

  public sendSingleGlobalRelance(relance: AppelLoyersFactureDto): void {
    const id = this.toPositiveNumber(relance.id);
    const globalKey = this.getGlobalRelanceKey(relance);

    if (
      id === null ||
      !this.hasEmail(relance) ||
      !globalKey ||
      this.isBulkActionRunning ||
      this.isSending(relance) ||
      this.sendingGlobalKeys.has(globalKey)
    ) {
      return;
    }

    this.sendingGlobalKeys.add(globalKey);
    this.relanceService.sendGlobalRelanceMail(id).subscribe({
      next: (result) => {
        this.sendingGlobalKeys.delete(globalKey);

        if (result) {
          this.notify(
            NotificationType.SUCCESS,
            `Relance globale envoyee a ${this.getLocataireLabel(relance)} avec le releve de compte joint.`
          );
          return;
        }

        this.notify(
          NotificationType.ERROR,
          `Impossible d'envoyer la relance globale a ${this.getLocataireLabel(relance)}.`
        );
      },
      error: (error) => {
        this.sendingGlobalKeys.delete(globalKey);
        this.notify(
          NotificationType.ERROR,
          this.extractErrorMessage(
            error,
            `Impossible d'envoyer la relance globale a ${this.getLocataireLabel(relance)}.`
          )
        );
      },
    });
  }

  public sendBulkRelances(): void {
    const selected = this.selectedRelances;
    if (selected.length === 0 || this.isBulkActionRunning) {
      this.notify(NotificationType.ERROR, 'Aucune relance avec email n est selectionnee.');
      return;
    }

    this.isSendingBulk = true;
    selected.forEach((relance) => {
      const id = this.toPositiveNumber(relance.id);
      if (id !== null) {
        this.sendingIds.add(id);
      }
    });

    forkJoin(
      selected.map((relance) =>
        this.relanceService.sendRelanceMail(this.toPositiveNumber(relance.id)!)
      )
    ).subscribe({
      next: (results) => {
        this.isSendingBulk = false;
        selected.forEach((relance) => {
          const id = this.toPositiveNumber(relance.id);
          if (id !== null) {
            this.sendingIds.delete(id);
          }
        });

        const successCount = results.filter((result) => result === true).length;
        const errorCount = results.length - successCount;

        if (successCount > 0) {
          this.notify(
            NotificationType.SUCCESS,
            `${successCount} mail(s) de relance simple envoye(s).`
          );
        }

        if (errorCount > 0) {
          this.notify(
            NotificationType.ERROR,
            `${errorCount} mail(s) de relance simple n'ont pas pu etre envoyes.`
          );
        }
      },
      error: (error) => {
        this.isSendingBulk = false;
        selected.forEach((relance) => {
          const id = this.toPositiveNumber(relance.id);
          if (id !== null) {
            this.sendingIds.delete(id);
          }
        });
        this.notify(
          NotificationType.ERROR,
          this.extractErrorMessage(
            error,
            "Impossible d'envoyer les mails de relance simple selectionnes."
          )
        );
      },
    });
  }

  public sendBulkGlobalRelances(): void {
    const selected = this.selectedGlobalRelances;
    if (selected.length === 0 || this.isBulkActionRunning) {
      this.notify(
        NotificationType.ERROR,
        'Aucune relance globale avec email n est selectionnee.'
      );
      return;
    }

    this.isSendingGlobalBulk = true;
    selected.forEach((relance) => {
      const key = this.getGlobalRelanceKey(relance);
      if (key) {
        this.sendingGlobalKeys.add(key);
      }
    });

    forkJoin(
      selected.map((relance) =>
        this.relanceService.sendGlobalRelanceMail(this.toPositiveNumber(relance.id)!)
      )
    ).subscribe({
      next: (results) => {
        this.isSendingGlobalBulk = false;
        selected.forEach((relance) => {
          const key = this.getGlobalRelanceKey(relance);
          if (key) {
            this.sendingGlobalKeys.delete(key);
          }
        });

        const successCount = results.filter((result) => result === true).length;
        const errorCount = results.length - successCount;

        if (successCount > 0) {
          this.notify(
            NotificationType.SUCCESS,
            `${successCount} relance(s) globale(s) envoyee(s) avec releve joint.`
          );
        }

        if (errorCount > 0) {
          this.notify(
            NotificationType.ERROR,
            `${errorCount} relance(s) globale(s) n'ont pas pu etre envoyees.`
          );
        }
      },
      error: (error) => {
        this.isSendingGlobalBulk = false;
        selected.forEach((relance) => {
          const key = this.getGlobalRelanceKey(relance);
          if (key) {
            this.sendingGlobalKeys.delete(key);
          }
        });
        this.notify(
          NotificationType.ERROR,
          this.extractErrorMessage(
            error,
            "Impossible d'envoyer les relances globales selectionnees."
          )
        );
      },
    });
  }

  public hasEmail(relance: AppelLoyersFactureDto): boolean {
    return !!relance.emailLocatire?.trim();
  }

  public isSending(relance: AppelLoyersFactureDto): boolean {
    const id = this.toPositiveNumber(relance.id);
    return id !== null && this.sendingIds.has(id);
  }

  public isSendingGlobal(relance: AppelLoyersFactureDto): boolean {
    const key = this.getGlobalRelanceKey(relance);
    return !!key && this.sendingGlobalKeys.has(key);
  }

  public getLocataireLabel(relance: AppelLoyersFactureDto): string {
    const fullName = [relance.nomLocataire, relance.prenomLocataire]
      .filter((value): value is string => !!value && !!value.trim())
      .join(' ');
    return fullName || 'Locataire inconnu';
  }

  public formatCurrency(amount: number | undefined): string {
    return Number(amount ?? 0).toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + ' FCFA';
  }

  public formatPeriod(relance: AppelLoyersFactureDto): string {
    if (relance.periodeLettre?.trim()) {
      return relance.periodeLettre;
    }

    const period = relance.periodeAppelLoyer?.trim();
    if (!period) {
      return '-';
    }

    const [yearValue, monthValue] = period.split('-').map(Number);
    if (!yearValue || !monthValue) {
      return period;
    }

    return new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(yearValue, monthValue - 1, 1));
  }

  public trackByRelance(index: number, relance: AppelLoyersFactureDto): number | string {
    return relance.id ?? `${relance.periodeAppelLoyer}-${index}`;
  }

  private getPeriodSortValue(relance: AppelLoyersFactureDto): string {
    return relance.periodeAppelLoyer ?? '9999-12';
  }

  private getGlobalRelanceKey(relance: AppelLoyersFactureDto): string | null {
    const idLocataire = this.toPositiveNumber(relance.idLocataire);
    if (idLocataire !== null) {
      return `locataire:${idLocataire}`;
    }

    const email = relance.emailLocatire?.trim().toLowerCase();
    if (email) {
      return `email:${email}`;
    }

    const id = this.toPositiveNumber(relance.id);
    return id !== null ? `appel:${id}` : null;
  }

  private toPositiveNumber(value: number | undefined): number | null {
    return typeof value === 'number' && Number.isFinite(value) && value > 0
      ? value
      : null;
  }

  private extractErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      if (typeof error.error === 'string' && error.error.trim()) {
        return error.error;
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

  private notify(type: NotificationType, message: string): void {
    this.notificationService.notify(type, message);
  }

  private getCurrentUser(): UtilisateurRequestDto | null {
    try {
      return this.userService.getUserFromLocalCache();
    } catch (error) {
      return null;
    }
  }
}
