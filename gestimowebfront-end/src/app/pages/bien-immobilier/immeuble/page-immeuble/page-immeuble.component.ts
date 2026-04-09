import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import {
  EtageAfficheDto,
  ImmeubleEtageDto,
  SiteResponseDto,
  UtilisateurAfficheDto,
  UtilisateurRequestDto,
} from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  standalone: false,
  selector: 'app-page-immeuble',
  templateUrl: './page-immeuble.component.html',
  styleUrls: ['./page-immeuble.component.css'],
})
export class PageImmeubleComponent implements OnInit {
  public immeubleForm!: UntypedFormGroup;
  public user: UtilisateurRequestDto | null = null;

  public immeubles: ImmeubleEtageDto[] = [];
  public sites: SiteResponseDto[] = [];
  public proprietaires: UtilisateurAfficheDto[] = [];
  public etages: EtageAfficheDto[] = [];

  public selectedImmeubleId: number | null = null;
  public searchTerm = '';

  public isLoadingImmeubles = false;
  public isLoadingSites = false;
  public isLoadingProprietaires = false;
  public isLoadingEtages = false;
  public isSaving = false;
  public deletingImmeubleId: number | null = null;

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
    this.immeubleForm = this.fb.group({
      id: [null],
      idAgence: [this.user?.idAgence ?? null],
      idCreateur: [this.user?.id ?? null],
      idSite: [null, Validators.required],
      idUtilisateur: [null, Validators.required],
      nomBaptiserImmeuble: [''],
      descriptionImmeuble: [''],
      nbrEtage: [1, [Validators.required, Validators.min(1)]],
      nbrePiecesDansImmeuble: [0, [Validators.required, Validators.min(0)]],
      garrage: [false],
    });

    if (!this.user?.idAgence) {
      this.pageErrorMessage =
        "Impossible de charger les immeubles : l'agence de l'utilisateur courant est introuvable.";
      return;
    }

    this.reloadData();
  }

  public get isEditMode(): boolean {
    return !!this.immeubleForm?.get('id')?.value;
  }

  public get filteredImmeubles(): ImmeubleEtageDto[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.immeubles;
    }

    return this.immeubles.filter((immeuble) =>
      [
        immeuble.id?.toString(),
        immeuble.codeNomAbrvImmeuble,
        immeuble.nomCompletImmeuble,
        immeuble.nomBaptiserImmeuble,
        immeuble.descriptionImmeuble,
        immeuble.nomPropio,
        immeuble.prenomProprio,
        this.getSiteName(immeuble.idSite),
      ]
        .filter((value): value is string => !!value)
        .some((value) => value.toLowerCase().includes(term))
    );
  }

  public get selectedSiteName(): string {
    return this.getSiteName(this.toPositiveNumber(this.immeubleForm.get('idSite')?.value));
  }

  public get selectedOwnerName(): string {
    return this.getOwnerName(
      this.toPositiveNumber(this.immeubleForm.get('idUtilisateur')?.value)
    );
  }

  public reloadData(): void {
    this.loadImmeubles();
    this.loadSites();
    this.loadProprietaires();
  }

  public startCreate(): void {
    this.formErrorMessage = '';
    this.immeubleForm.reset({
      id: null,
      idAgence: this.user?.idAgence ?? null,
      idCreateur: this.user?.id ?? null,
      idSite: null,
      idUtilisateur: null,
      nomBaptiserImmeuble: '',
      descriptionImmeuble: '',
      nbrEtage: 1,
      nbrePiecesDansImmeuble: 0,
      garrage: false,
    });
    this.immeubleForm.markAsPristine();
  }

  public editImmeuble(immeuble: ImmeubleEtageDto): void {
    if (!immeuble.id) {
      return;
    }

    this.formErrorMessage = '';
    this.immeubleForm.patchValue({
      id: immeuble.id,
      idAgence: this.user?.idAgence ?? null,
      idCreateur: this.user?.id ?? null,
      idSite: immeuble.idSite ?? null,
      idUtilisateur: immeuble.idUtilisateur ?? null,
      nomBaptiserImmeuble: immeuble.nomBaptiserImmeuble ?? '',
      descriptionImmeuble: immeuble.descriptionImmeuble ?? '',
      nbrEtage: immeuble.nbrEtage ?? 1,
      nbrePiecesDansImmeuble: immeuble.nbrePiecesDansImmeuble ?? 0,
      garrage: immeuble.garrage ?? false,
    });
  }

  public selectImmeuble(immeuble: ImmeubleEtageDto): void {
    const immeubleId = this.toPositiveNumber(immeuble.id);
    if (immeubleId === null) {
      return;
    }

    this.selectedImmeubleId = immeubleId;
    this.loadEtages(immeubleId);
  }

  public onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value ?? '';
  }

  public saveImmeuble(): void {
    this.formErrorMessage = '';

    if (!this.user?.idAgence || !this.user?.id) {
      this.formErrorMessage =
        "Impossible d'enregistrer l'immeuble : utilisateur courant incomplet.";
      return;
    }

    if (this.immeubleForm.invalid) {
      this.immeubleForm.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();
    if (!payload) {
      this.formErrorMessage =
        "Le formulaire contient des valeurs invalides. Veuillez vérifier les champs.";
      return;
    }

    const isEditMode = !!payload.id;
    this.isSaving = true;

    this.apiService
      .saveImmeubleEtage(payload)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (savedImmeuble) => {
          this.upsertImmeuble(savedImmeuble);
          if (savedImmeuble.id) {
            this.selectedImmeubleId = savedImmeuble.id;
            this.loadEtages(savedImmeuble.id);
          }
          this.notify(
            NotificationType.SUCCESS,
            isEditMode
              ? "L'immeuble a bien été mis à jour."
              : "L'immeuble a bien été créé."
          );
          this.startCreate();
        },
        error: (error) => {
          this.formErrorMessage = this.extractErrorMessage(
            error,
            "Impossible d'enregistrer l'immeuble."
          );
        },
      });
  }

  public deleteImmeuble(immeuble: ImmeubleEtageDto): void {
    if (!immeuble.id) {
      return;
    }

    const confirmation = window.confirm(
      `Voulez-vous vraiment supprimer l'immeuble "${immeuble.nomCompletImmeuble ?? immeuble.codeNomAbrvImmeuble ?? immeuble.id}" ?`
    );

    if (!confirmation) {
      return;
    }

    this.deletingImmeubleId = immeuble.id;
    this.apiService
      .deleteImmeuble(immeuble.id)
      .pipe(finalize(() => (this.deletingImmeubleId = null)))
      .subscribe({
        next: (deleted) => {
          if (!deleted) {
            this.notify(
              NotificationType.ERROR,
              "La suppression de l'immeuble a échoué."
            );
            return;
          }

          this.immeubles = this.immeubles.filter((item) => item.id !== immeuble.id);
          if (this.selectedImmeubleId === immeuble.id) {
            this.selectedImmeubleId = null;
            this.etages = [];
          }
          if (this.toPositiveNumber(this.immeubleForm.get('id')?.value) === immeuble.id) {
            this.startCreate();
          }
          this.notify(NotificationType.SUCCESS, "L'immeuble a bien été supprimé.");
        },
        error: (error) => {
          this.notify(
            NotificationType.ERROR,
            this.extractErrorMessage(error, "Impossible de supprimer l'immeuble.")
          );
        },
      });
  }

  public trackByImmeuble(index: number, immeuble: ImmeubleEtageDto): number | string {
    return immeuble.id ?? immeuble.codeNomAbrvImmeuble ?? index;
  }

  public trackByEtage(index: number, etage: EtageAfficheDto): number | string {
    return etage.id ?? etage.abrvEtage ?? index;
  }

  public getOwnerLabel(immeuble: ImmeubleEtageDto): string {
    const owner = [immeuble.nomPropio, immeuble.prenomProprio]
      .filter((value): value is string => !!value)
      .join(' ');

    return owner || this.getOwnerName(immeuble.idUtilisateur);
  }

  public getSiteName(siteId: number | null | undefined): string {
    const normalizedSiteId = this.toPositiveNumber(siteId);
    if (normalizedSiteId === null) {
      return '-';
    }

    const site = this.sites.find((item) => item.id === normalizedSiteId);
    return site?.nomSite || site?.abrSite || '-';
  }

  public getOwnerName(ownerId: number | null | undefined): string {
    const normalizedOwnerId = this.toPositiveNumber(ownerId);
    if (normalizedOwnerId === null) {
      return '-';
    }

    const owner = this.proprietaires.find((item) => item.id === normalizedOwnerId);
    if (!owner) {
      return '-';
    }

    const name = [owner.nom, owner.prenom]
      .filter((value): value is string => !!value)
      .join(' ');

    return name || owner.username || owner.mobile || '-';
  }

  private loadImmeubles(): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.isLoadingImmeubles = true;
    this.pageErrorMessage = '';

    this.apiService
      .affichageDesImmeubles(this.user.idAgence)
      .pipe(finalize(() => (this.isLoadingImmeubles = false)))
      .subscribe({
        next: (immeubles) => {
          this.immeubles = this.sortImmeubles(immeubles ?? []);
          if (
            this.selectedImmeubleId !== null &&
            this.immeubles.some((item) => item.id === this.selectedImmeubleId)
          ) {
            this.loadEtages(this.selectedImmeubleId);
          }
        },
        error: (error) => {
          this.pageErrorMessage = this.extractErrorMessage(
            error,
            "Impossible de charger les immeubles."
          );
        },
      });
  }

  private loadSites(): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.isLoadingSites = true;

    this.apiService
      .findAllSites(this.user.idAgence)
      .pipe(finalize(() => (this.isLoadingSites = false)))
      .subscribe({
        next: (sites) => {
          this.sites = [...(sites ?? [])].sort((left, right) =>
            (left.nomSite ?? left.abrSite ?? '').localeCompare(
              right.nomSite ?? right.abrSite ?? '',
              'fr',
              { sensitivity: 'base' }
            )
          );
        },
        error: (error) => {
          this.pageErrorMessage = this.extractErrorMessage(
            error,
            "Impossible de charger les sites."
          );
        },
      });
  }

  private loadProprietaires(): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.isLoadingProprietaires = true;

    this.apiService
      .getAllProprietaireByOrder(this.user.idAgence)
      .pipe(finalize(() => (this.isLoadingProprietaires = false)))
      .subscribe({
        next: (proprietaires) => {
          this.proprietaires = [...(proprietaires ?? [])].sort((left, right) =>
            this.getUserDisplayName(left).localeCompare(
              this.getUserDisplayName(right),
              'fr',
              { sensitivity: 'base' }
            )
          );
        },
        error: (error) => {
          this.pageErrorMessage = this.extractErrorMessage(
            error,
            'Impossible de charger les propriétaires.'
          );
        },
      });
  }

  private loadEtages(immeubleId: number): void {
    this.isLoadingEtages = true;

    this.apiService
      .affichageDesEtageParImmeuble(immeubleId)
      .pipe(finalize(() => (this.isLoadingEtages = false)))
      .subscribe({
        next: (etages) => {
          this.etages = [...(etages ?? [])].sort(
            (left, right) => (left.numEtage ?? 0) - (right.numEtage ?? 0)
          );
        },
        error: (error) => {
          this.notify(
            NotificationType.ERROR,
            this.extractErrorMessage(error, 'Impossible de charger les étages.')
          );
          this.etages = [];
        },
      });
  }

  private buildPayload(): ImmeubleEtageDto | null {
    const idSite = this.toPositiveNumber(this.immeubleForm.get('idSite')?.value);
    const idUtilisateur = this.toPositiveNumber(
      this.immeubleForm.get('idUtilisateur')?.value
    );
    const nbrEtage = this.toNonNegativeNumber(this.immeubleForm.get('nbrEtage')?.value);
    const nbrePiecesDansImmeuble = this.toNonNegativeNumber(
      this.immeubleForm.get('nbrePiecesDansImmeuble')?.value
    );

    if (
      !this.user?.idAgence ||
      !this.user?.id ||
      idSite === null ||
      idUtilisateur === null ||
      nbrEtage === null ||
      nbrEtage < 1 ||
      nbrePiecesDansImmeuble === null
    ) {
      return null;
    }

    return {
      id: this.toPositiveNumber(this.immeubleForm.get('id')?.value) ?? undefined,
      idAgence: this.user.idAgence,
      idCreateur: this.user.id,
      idSite,
      idUtilisateur,
      nomBaptiserImmeuble: this.normalizeText(
        this.immeubleForm.get('nomBaptiserImmeuble')?.value
      ),
      descriptionImmeuble: this.normalizeText(
        this.immeubleForm.get('descriptionImmeuble')?.value
      ),
      nbrEtage,
      nbrePiecesDansImmeuble,
      garrage: !!this.immeubleForm.get('garrage')?.value,
    };
  }

  private upsertImmeuble(savedImmeuble: ImmeubleEtageDto): void {
    const nextImmeubles = [...this.immeubles];
    const index = nextImmeubles.findIndex((item) => item.id === savedImmeuble.id);

    if (index >= 0) {
      nextImmeubles[index] = savedImmeuble;
    } else {
      nextImmeubles.unshift(savedImmeuble);
    }

    this.immeubles = this.sortImmeubles(nextImmeubles);
  }

  private sortImmeubles(immeubles: ImmeubleEtageDto[]): ImmeubleEtageDto[] {
    return [...immeubles].sort((left, right) =>
      (left.nomCompletImmeuble ?? left.codeNomAbrvImmeuble ?? '').localeCompare(
        right.nomCompletImmeuble ?? right.codeNomAbrvImmeuble ?? '',
        'fr',
        { sensitivity: 'base' }
      )
    );
  }

  private getUserDisplayName(user: UtilisateurAfficheDto): string {
    return (
      [user.nom, user.prenom].filter((value): value is string => !!value).join(' ') ||
      user.username ||
      user.mobile ||
      ''
    );
  }

  private normalizeText(value: unknown): string | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }

    const normalized = String(value).trim();
    return normalized ? normalized : undefined;
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

  private toNonNegativeNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const normalized =
      typeof value === 'number' ? value : Number.parseInt(String(value), 10);

    return Number.isFinite(normalized) && normalized >= 0 ? normalized : null;
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
