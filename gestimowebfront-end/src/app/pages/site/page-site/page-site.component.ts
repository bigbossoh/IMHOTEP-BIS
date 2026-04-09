import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import {
  CommuneResponseDto,
  QuartierRequestDto,
  SiteRequestDto,
  SiteResponseDto,
  UtilisateurRequestDto,
  VilleDto,
} from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  standalone: false,
  selector: 'app-page-site',
  templateUrl: './page-site.component.html',
  styleUrls: ['./page-site.component.css'],
})
export class PageSiteComponent implements OnInit {
  public siteForm!: UntypedFormGroup;
  public user: UtilisateurRequestDto | null = null;

  public sites: SiteResponseDto[] = [];
  public villes: VilleDto[] = [];
  public communes: CommuneResponseDto[] = [];
  public quartiers: QuartierRequestDto[] = [];

  public searchTerm = '';
  public isLoadingSites = false;
  public isLoadingVilles = false;
  public isLoadingCommunes = false;
  public isLoadingQuartiers = false;
  public isSaving = false;
  public deletingSiteId: number | null = null;

  public pageErrorMessage = '';
  public formErrorMessage = '';

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly apiService: ApiService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) {}

  public ngOnInit(): void {
    this.user = this.getCurrentUser();
    this.siteForm = this.fb.group({
      id: [null],
      idAgence: [this.user?.idAgence ?? null],
      idCreateur: [this.user?.id ?? null],
      villeId: [null, Validators.required],
      communeId: [null, Validators.required],
      idQuartier: [null, Validators.required],
    });

    if (!this.user?.idAgence) {
      this.pageErrorMessage =
        "Impossible de charger les sites : l'agence de l'utilisateur courant est introuvable.";
      return;
    }

    this.reloadData();
  }

  public get isEditMode(): boolean {
    return !!this.siteForm?.get('id')?.value;
  }

  public get filteredSites(): SiteResponseDto[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.sites;
    }

    return this.sites.filter((site) =>
      [
        site.id?.toString(),
        site.abrSite,
        site.nomSite,
        site.quartierResponseDto?.nomQuartier,
        site.quartierResponseDto?.abrvQuartier,
        site.quartierResponseDto?.communeResponseDto?.nomCommune,
        site.quartierResponseDto?.communeResponseDto?.abrvCommune,
        site.quartierResponseDto?.communeResponseDto?.villeDto?.nomVille,
        site.quartierResponseDto?.communeResponseDto?.villeDto?.abrvVille,
      ]
        .filter((value): value is string => !!value)
        .some((value) => value.toLowerCase().includes(term))
    );
  }

  public get selectedVille(): VilleDto | undefined {
    return this.villes.find(
      (ville) => ville.id === this.toPositiveNumber(this.siteForm?.get('villeId')?.value)
    );
  }

  public get selectedCommune(): CommuneResponseDto | undefined {
    return this.communes.find(
      (commune) =>
        commune.id === this.toPositiveNumber(this.siteForm?.get('communeId')?.value)
    );
  }

  public get selectedQuartier(): QuartierRequestDto | undefined {
    return this.quartiers.find(
      (quartier) =>
        quartier.id === this.toPositiveNumber(this.siteForm?.get('idQuartier')?.value)
    );
  }

  public get locationPreview(): string {
    const parts = [
      this.selectedVille?.nomVille,
      this.selectedCommune?.nomCommune,
      this.selectedQuartier?.nomQuartier,
    ].filter((value): value is string => !!value);

    return parts.join(' / ');
  }

  public reloadData(): void {
    this.loadSites();
    this.loadVilles();
  }

  public startCreate(): void {
    this.formErrorMessage = '';
    this.communes = [];
    this.quartiers = [];
    this.siteForm.reset({
      id: null,
      idAgence: this.user?.idAgence ?? null,
      idCreateur: this.user?.id ?? null,
      villeId: null,
      communeId: null,
      idQuartier: null,
    });
    this.siteForm.markAsPristine();
  }

  public editSite(site: SiteResponseDto): void {
    const villeId = site.quartierResponseDto?.communeResponseDto?.villeDto?.id;
    const communeId = site.quartierResponseDto?.communeResponseDto?.id;
    const quartierId = site.quartierResponseDto?.id;

    if (!site.id || !villeId || !communeId || !quartierId) {
      this.notify(
        NotificationType.ERROR,
        "Impossible de préparer l'édition de ce site."
      );
      return;
    }

    this.formErrorMessage = '';
    this.siteForm.patchValue({
      id: site.id,
      idAgence: this.user?.idAgence ?? null,
      idCreateur: this.user?.id ?? null,
      villeId,
      communeId: null,
      idQuartier: null,
    });

    this.communes = [];
    this.quartiers = [];
    this.loadCommunes(villeId, communeId, quartierId);
  }

  public onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value ?? '';
  }

  public onVilleChange(event: Event): void {
    const villeId = this.parseSelectValue((event.target as HTMLSelectElement).value);

    this.formErrorMessage = '';
    this.communes = [];
    this.quartiers = [];
    this.siteForm.patchValue(
      {
        villeId,
        communeId: null,
        idQuartier: null,
      },
      { emitEvent: false }
    );

    if (villeId !== null) {
      this.loadCommunes(villeId);
    }
  }

  public onCommuneChange(event: Event): void {
    const communeId = this.parseSelectValue((event.target as HTMLSelectElement).value);

    this.formErrorMessage = '';
    this.quartiers = [];
    this.siteForm.patchValue(
      {
        communeId,
        idQuartier: null,
      },
      { emitEvent: false }
    );

    if (communeId !== null) {
      this.loadQuartiers(communeId);
    }
  }

  public onQuartierChange(event: Event): void {
    const quartierId = this.parseSelectValue((event.target as HTMLSelectElement).value);
    this.formErrorMessage = '';
    this.siteForm.patchValue({ idQuartier: quartierId }, { emitEvent: false });
  }

  public saveSite(): void {
    this.formErrorMessage = '';

    if (!this.user?.idAgence || !this.user?.id) {
      this.formErrorMessage =
        "Impossible d'enregistrer le site : utilisateur courant incomplet.";
      return;
    }

    if (this.siteForm.invalid) {
      this.siteForm.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();
    if (!payload) {
      this.formErrorMessage =
        "Le quartier sélectionné est invalide. Veuillez corriger le formulaire.";
      return;
    }

    const isEditMode = !!payload.id;
    this.isSaving = true;

    this.apiService
      .saveSite(payload)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (savedSite) => {
          this.upsertSite(savedSite);
          this.notify(
            NotificationType.SUCCESS,
            isEditMode
              ? 'Le site a bien été modifié.'
              : 'Le site a bien été créé.'
          );
          this.startCreate();
        },
        error: (error) => {
          this.formErrorMessage = this.extractErrorMessage(
            error,
            "Impossible d'enregistrer le site."
          );
        },
      });
  }

  public deleteSite(site: SiteResponseDto): void {
    if (!site.id) {
      return;
    }

    const confirmation = window.confirm(
      `Voulez-vous vraiment supprimer le site "${site.nomSite ?? site.abrSite ?? site.id}" ?`
    );

    if (!confirmation) {
      return;
    }

    this.deletingSiteId = site.id;
    this.apiService
      .deleteSite(site.id)
      .pipe(finalize(() => (this.deletingSiteId = null)))
      .subscribe({
        next: (deleted) => {
          if (!deleted) {
            this.notify(
              NotificationType.ERROR,
              'La suppression du site a échoué.'
            );
            return;
          }

          this.sites = this.sites.filter((item) => item.id !== site.id);
          if (this.toPositiveNumber(this.siteForm.get('id')?.value) === site.id) {
            this.startCreate();
          }
          this.notify(NotificationType.SUCCESS, 'Le site a bien été supprimé.');
        },
        error: (error) => {
          this.notify(
            NotificationType.ERROR,
            this.extractErrorMessage(error, 'Impossible de supprimer le site.')
          );
        },
      });
  }

  public trackBySite(index: number, site: SiteResponseDto): number | string {
    return site.id ?? site.nomSite ?? index;
  }

  public getSiteLocation(site: SiteResponseDto): string {
    const quartier = site.quartierResponseDto;
    const commune = quartier?.communeResponseDto;
    const ville = commune?.villeDto;

    return [ville?.nomVille, commune?.nomCommune, quartier?.nomQuartier]
      .filter((value): value is string => !!value)
      .join(' / ');
  }

  private loadSites(): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.isLoadingSites = true;
    this.pageErrorMessage = '';

    this.apiService
      .findAllSites(this.user.idAgence)
      .pipe(finalize(() => (this.isLoadingSites = false)))
      .subscribe({
        next: (sites) => {
          this.sites = this.sortSites(sites ?? []);
        },
        error: (error) => {
          this.pageErrorMessage = this.extractErrorMessage(
            error,
            'Impossible de charger les sites.'
          );
        },
      });
  }

  private loadVilles(): void {
    this.isLoadingVilles = true;

    this.apiService
      .findAllVilles()
      .pipe(finalize(() => (this.isLoadingVilles = false)))
      .subscribe({
        next: (villes) => {
          this.villes = this.sortByName(villes ?? [], 'nomVille');
        },
        error: (error) => {
          this.pageErrorMessage = this.extractErrorMessage(
            error,
            'Impossible de charger les villes.'
          );
        },
      });
  }

  private loadCommunes(
    villeId: number,
    communeIdToSelect: number | null = null,
    quartierIdToSelect: number | null = null
  ): void {
    this.isLoadingCommunes = true;

    this.apiService
      .findCommuneByIdPays(villeId)
      .pipe(finalize(() => (this.isLoadingCommunes = false)))
      .subscribe({
        next: (communes) => {
          this.communes = this.sortByName(communes ?? [], 'nomCommune');

          if (communeIdToSelect !== null) {
            this.siteForm.patchValue(
              {
                communeId: communeIdToSelect,
              },
              { emitEvent: false }
            );
            this.loadQuartiers(communeIdToSelect, quartierIdToSelect);
          }
        },
        error: (error) => {
          this.formErrorMessage = this.extractErrorMessage(
            error,
            'Impossible de charger les communes.'
          );
        },
      });
  }

  private loadQuartiers(
    communeId: number,
    quartierIdToSelect: number | null = null
  ): void {
    this.isLoadingQuartiers = true;

    this.apiService
      .findAllQuartierByIdCommune(communeId)
      .pipe(finalize(() => (this.isLoadingQuartiers = false)))
      .subscribe({
        next: (quartiers) => {
          this.quartiers = this.sortByName(quartiers ?? [], 'nomQuartier');

          if (quartierIdToSelect !== null) {
            this.siteForm.patchValue(
              {
                idQuartier: quartierIdToSelect,
              },
              { emitEvent: false }
            );
          }
        },
        error: (error) => {
          this.formErrorMessage = this.extractErrorMessage(
            error,
            'Impossible de charger les quartiers.'
          );
        },
      });
  }

  private buildPayload(): SiteRequestDto | null {
    const idQuartier = this.toPositiveNumber(this.siteForm.get('idQuartier')?.value);
    if (idQuartier === null || !this.user?.idAgence || !this.user?.id) {
      return null;
    }

    return {
      id: this.toPositiveNumber(this.siteForm.get('id')?.value) ?? undefined,
      idAgence: this.user.idAgence,
      idCreateur: this.user.id,
      idQuartier,
    };
  }

  private upsertSite(savedSite: SiteResponseDto): void {
    const nextSites = [...this.sites];
    const index = nextSites.findIndex((site) => site.id === savedSite.id);

    if (index >= 0) {
      nextSites[index] = savedSite;
    } else {
      nextSites.unshift(savedSite);
    }

    this.sites = this.sortSites(nextSites);
  }

  private sortSites(sites: SiteResponseDto[]): SiteResponseDto[] {
    return [...sites].sort((left, right) =>
      (left.nomSite ?? left.abrSite ?? '').localeCompare(
        right.nomSite ?? right.abrSite ?? '',
        'fr',
        { sensitivity: 'base' }
      )
    );
  }

  private sortByName<T extends Record<string, any>>(
    items: T[],
    key: keyof T
  ): T[] {
    return [...items].sort((left, right) =>
      String(left[key] ?? '').localeCompare(String(right[key] ?? ''), 'fr', {
        sensitivity: 'base',
      })
    );
  }

  private getCurrentUser(): UtilisateurRequestDto | null {
    try {
      return this.userService.getUserFromLocalCache();
    } catch (error) {
      return null;
    }
  }

  private parseSelectValue(value: string): number | null {
    return this.toPositiveNumber(value);
  }

  private toPositiveNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const normalizedValue =
      typeof value === 'number' ? value : Number.parseInt(String(value), 10);

    return Number.isFinite(normalizedValue) && normalizedValue > 0
      ? normalizedValue
      : null;
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
