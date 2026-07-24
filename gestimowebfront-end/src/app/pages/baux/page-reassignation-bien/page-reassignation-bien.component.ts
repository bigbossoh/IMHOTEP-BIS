import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  BienImmobilierAffiheDto,
  OperationDto,
  SiteResponseDto,
  UtilisateurRequestDto,
} from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';

const MAX_BIEN_SUGGESTIONS = 50;

@Component({
  standalone: false,
  selector: 'app-page-reassignation-bien',
  templateUrl: './page-reassignation-bien.component.html',
  styleUrls: ['./page-reassignation-bien.component.css'],
})
export class PageReassignationBienComponent implements OnInit {
  public user: UtilisateurRequestDto | null = null;
  public baux: OperationDto[] = [];
  public biens: BienImmobilierAffiheDto[] = [];
  public sites: SiteResponseDto[] = [];

  public searchTerm = '';
  public siteFilter: number | null = null;
  public isLoading = false;
  public savingBailId: number | null = null;
  public pageErrorMessage = '';

  private readonly pendingSelection = new Map<number, number | null>();
  private readonly rowSearchText = new Map<number, string>();
  private readonly rowFilteredBiens = new Map<number, BienImmobilierAffiheDto[]>();

  constructor(
    private readonly apiService: ApiService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) {}

  public ngOnInit(): void {
    this.user = this.getCurrentUser();

    if (!this.user?.idAgence) {
      this.pageErrorMessage =
        "Impossible de charger les baux : l'agence de l'utilisateur courant est introuvable.";
      return;
    }

    this.loadData();
  }

  public get filteredBaux(): OperationDto[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.baux;
    }

    return this.baux.filter((bail) =>
      [
        bail.id?.toString(),
        bail.designationBail,
        bail.abrvCodeBail,
        bail.codeAbrvBienImmobilier,
        bail.utilisateurOperation,
        bail.bienImmobilierOperation,
      ]
        .filter((value): value is string => !!value)
        .some((value) => value.toLowerCase().includes(term))
    );
  }

  public reloadData(): void {
    this.loadData();
  }

  public onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value ?? '';
  }

  public trackByBail(index: number, bail: OperationDto): number | string {
    return bail.id ?? index;
  }

  public trackByBien(index: number, bien: BienImmobilierAffiheDto): number | string {
    return bien.id ?? index;
  }

  public trackBySite(index: number, site: SiteResponseDto): number | string {
    return site.id ?? index;
  }

  public getCurrentBienLabel(bail: OperationDto): string {
    const code = bail.codeAbrvBienImmobilier?.trim();
    const description = bail.bienImmobilierOperation?.trim();
    if (code && description) {
      return `${code} - ${description}`;
    }
    return code || description || '-';
  }

  public getBienLabel(bien: BienImmobilierAffiheDto): string {
    const code = bien.codeAbrvBienImmobilier ?? '';
    const name = bien.nomCompletBienImmobilier || bien.nomBaptiserBienImmobilier || '';
    const label = [code, name].filter((value) => !!value).join(' - ') || `Bien #${bien.id}`;
    return bien.occupied ? `${label} (Occupe)` : label;
  }

  public getSelectedBienId(bail: OperationDto): number | null {
    const bailId = this.toPositiveNumber(bail.id);
    if (bailId === null) {
      return null;
    }

    if (this.pendingSelection.has(bailId)) {
      return this.pendingSelection.get(bailId) ?? null;
    }

    return this.toPositiveNumber(bail.idBienImmobilier);
  }

  public onSiteFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.siteFilter = value ? Number(value) : null;
    this.rowFilteredBiens.clear();
  }

  public getFilteredBiens(bail: OperationDto): BienImmobilierAffiheDto[] {
    const bailId = this.toPositiveNumber(bail.id);
    if (bailId === null) {
      return [];
    }

    if (!this.rowFilteredBiens.has(bailId)) {
      this.rowFilteredBiens.set(bailId, this.computeFilteredBiens(bailId));
    }

    return this.rowFilteredBiens.get(bailId) ?? [];
  }

  public getRowInputValue(bail: OperationDto): string {
    const bailId = this.toPositiveNumber(bail.id);
    if (bailId !== null && this.rowSearchText.has(bailId)) {
      return this.rowSearchText.get(bailId) ?? '';
    }

    const selectedId = this.getSelectedBienId(bail);
    const bien = this.biens.find((candidate) => candidate.id === selectedId);
    return bien ? this.getBienLabel(bien) : '';
  }

  public onBienSearchInput(bail: OperationDto, event: Event): void {
    const bailId = this.toPositiveNumber(bail.id);
    if (bailId === null) {
      return;
    }

    const value = (event.target as HTMLInputElement).value ?? '';
    this.rowSearchText.set(bailId, value);
    this.rowFilteredBiens.set(bailId, this.computeFilteredBiens(bailId));
  }

  public onBienOptionSelected(bail: OperationDto, event: MatAutocompleteSelectedEvent): void {
    const bailId = this.toPositiveNumber(bail.id);
    if (bailId === null) {
      return;
    }

    const selectedId = this.toPositiveNumber(event.option.value);
    this.pendingSelection.set(bailId, selectedId);

    const bien = this.biens.find((candidate) => candidate.id === selectedId);
    this.rowSearchText.set(bailId, bien ? this.getBienLabel(bien) : '');
  }

  public isSaveDisabled(bail: OperationDto): boolean {
    const bailId = this.toPositiveNumber(bail.id);
    if (bailId === null || this.savingBailId !== null) {
      return true;
    }

    const selected = this.getSelectedBienId(bail);
    const current = this.toPositiveNumber(bail.idBienImmobilier);
    return selected === null || selected === current;
  }

  public isSaving(bail: OperationDto): boolean {
    return this.savingBailId === this.toPositiveNumber(bail.id);
  }

  public saveBienChange(bail: OperationDto): void {
    const bailId = this.toPositiveNumber(bail.id);
    const selectedBienId = this.getSelectedBienId(bail);
    if (bailId === null || selectedBienId === null) {
      return;
    }

    const selectedBien = this.biens.find((bien) => bien.id === selectedBienId);
    if (selectedBien?.occupied === true) {
      const confirmation = window.confirm(
        `Le bien "${this.getBienLabel(selectedBien)}" est deja marque comme occupe par un autre bail. ` +
          `Voulez-vous vraiment l'assigner a ce bail malgre tout ?`
      );
      if (!confirmation) {
        return;
      }
    }

    this.savingBailId = bailId;
    this.apiService
      .changerBienBail({ idBail: bailId, idNouveauBien: selectedBienId })
      .pipe(finalize(() => (this.savingBailId = null)))
      .subscribe({
        next: () => {
          this.notify(NotificationType.SUCCESS, 'Le bien du bail a bien ete mis a jour.');
          this.pendingSelection.delete(bailId);
          this.rowSearchText.delete(bailId);
          this.rowFilteredBiens.delete(bailId);
          this.loadData();
        },
        error: (error) => {
          this.notify(
            NotificationType.ERROR,
            this.extractErrorMessage(error, 'Impossible de changer le bien de ce bail.')
          );
        },
      });
  }

  private loadData(): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.isLoading = true;
    this.pageErrorMessage = '';

    forkJoin({
      baux: this.apiService.findAllOperations(this.user.idAgence),
      biens: this.apiService.findAllBien({ idAgence: this.user.idAgence, chapitre: 0 }),
      sites: this.apiService.findAllSites(this.user.idAgence),
    })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: ({ baux, biens, sites }) => {
          this.baux = (baux ?? []).filter((bail) => bail.enCoursBail === true);
          this.biens = biens ?? [];
          this.sites = sites ?? [];
          this.pendingSelection.clear();
          this.rowSearchText.clear();
          this.rowFilteredBiens.clear();
        },
        error: (error) => {
          this.pageErrorMessage = this.extractErrorMessage(
            error,
            'Impossible de charger les baux et les biens immobiliers.'
          );
        },
      });
  }

  private computeFilteredBiens(bailId: number): BienImmobilierAffiheDto[] {
    const term = this.rowSearchText.get(bailId)?.trim().toLowerCase();

    return this.biens
      .filter((bien) => this.siteFilter === null || bien.idSite === this.siteFilter)
      .filter((bien) => {
        if (!term) {
          return true;
        }
        return [
          bien.codeAbrvBienImmobilier,
          bien.nomCompletBienImmobilier,
          bien.nomBaptiserBienImmobilier,
        ]
          .filter((value): value is string => !!value)
          .some((value) => value.toLowerCase().includes(term));
      })
      .slice(0, MAX_BIEN_SUGGESTIONS);
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

  private notify(type: NotificationType, message: string): void {
    this.notificationService.notify(type, message);
  }
}
