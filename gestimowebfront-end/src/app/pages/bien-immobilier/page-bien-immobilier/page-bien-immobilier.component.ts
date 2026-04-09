import { formatDate } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { saveAs } from 'file-saver';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import {
  AppartementDto,
  EtablissementUtilisateurDto,
  EtageDto,
  ImmeubleEtageDto,
  MagasinDto,
  MagasinResponseDto,
  SiteResponseDto,
  UtilisateurAfficheDto,
  UtilisateurRequestDto,
  VillaDto,
} from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';

type BienType = 'appartement' | 'villa' | 'magasin';
type MagasinLocationMode = 'site' | 'immeuble';

interface BienTab {
  type: BienType;
  label: string;
  hint: string;
}

interface BienListItem {
  id: number;
  type: BienType;
  code: string;
  name: string;
  description: string;
  location: string;
  owner: string;
  details: string;
  occupied: boolean;
}

@Component({
  standalone: false,
  selector: 'app-page-bien-immobilier',
  templateUrl: './page-bien-immobilier.component.html',
  styleUrls: ['./page-bien-immobilier.component.css'],
})
export class PageBienImmobilierComponent implements OnInit {
  public readonly tabs: BienTab[] = [
    {
      type: 'appartement',
      label: 'Appartements',
      hint: 'CRUD des appartements relies a un immeuble et un etage.',
    },
    {
      type: 'villa',
      label: 'Villas',
      hint: 'CRUD des villas rattachees a un site et un proprietaire.',
    },
    {
      type: 'magasin',
      label: 'Magasins',
      hint: 'CRUD des magasins au niveau d’un site ou d’un etage.',
    },
  ];

  public activeType: BienType = 'appartement';
  public searchTerm = '';
  public currentPage = 1;
  public pageSize = 10;
  public readonly pageSizeOptions = [10, 25, 50, 100];

  public user: UtilisateurRequestDto | null = null;
  public defaultChapitreId = 1;

  public sites: SiteResponseDto[] = [];
  public proprietaires: UtilisateurAfficheDto[] = [];
  public immeubles: ImmeubleEtageDto[] = [];
  public etages: EtageDto[] = [];

  public appartements: AppartementDto[] = [];
  public villas: VillaDto[] = [];
  public magasins: MagasinResponseDto[] = [];

  public appartementForm!: UntypedFormGroup;
  public villaForm!: UntypedFormGroup;
  public magasinForm!: UntypedFormGroup;

  public pageErrorMessage = '';
  public formErrorMessage = '';

  public isLoadingReferences = false;
  public isLoadingAssets = false;
  public isSaving = false;
  public deletingKey = '';

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly http: HttpClient,
    private readonly apiService: ApiService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) {}

  public ngOnInit(): void {
    this.user = this.getCurrentUser();
    this.initializeForms();
    this.bindFormReactions();

    if (!this.user?.idAgence || !this.user?.id) {
      this.pageErrorMessage =
        "Impossible de charger la page des biens : utilisateur courant incomplet.";
      return;
    }

    this.reloadData();
  }

  public get isLoading(): boolean {
    return this.isLoadingReferences || this.isLoadingAssets;
  }

  public get currentTypeLabel(): string {
    return this.tabs.find((tab) => tab.type === this.activeType)?.label ?? 'Biens';
  }

  public get currentHint(): string {
    return (
      this.tabs.find((tab) => tab.type === this.activeType)?.hint ??
      'Gestion des biens immobiliers.'
    );
  }

  public get isEditMode(): boolean {
    return !!this.currentForm.get('id')?.value;
  }

  public get appartementEtages(): EtageDto[] {
    return this.getEtagesByImmeuble(
      this.toPositiveNumber(this.appartementForm.get('immeubleId')?.value)
    );
  }

  public get magasinEtages(): EtageDto[] {
    return this.getEtagesByImmeuble(
      this.toPositiveNumber(this.magasinForm.get('immeubleId')?.value)
    );
  }

  public get magasinLocationMode(): MagasinLocationMode {
    return (this.magasinForm.get('locationMode')?.value as MagasinLocationMode) ?? 'site';
  }

  public get appartementContext(): string {
    const etageId = this.toPositiveNumber(
      this.appartementForm.get('idEtageAppartement')?.value
    );
    if (etageId !== null) {
      return this.composeLocationFromEtageId(etageId);
    }

    const immeubleId = this.toPositiveNumber(this.appartementForm.get('immeubleId')?.value);
    if (immeubleId !== null) {
      return this.composeLocationFromImmeubleId(immeubleId);
    }

    return 'Selectionnez un immeuble puis un etage';
  }

  public get villaContext(): string {
    const siteId = this.toPositiveNumber(this.villaForm.get('idSite')?.value);
    const siteName = this.getSiteName(siteId);
    const ownerId = this.toPositiveNumber(this.villaForm.get('idUtilisateur')?.value);
    const ownerName = this.getOwnerName(ownerId);
    return `${siteName} | Proprietaire : ${ownerName}`;
  }

  public get magasinContext(): string {
    const ownerId = this.toPositiveNumber(this.magasinForm.get('idUtilisateur')?.value);
    const ownerName = this.getOwnerName(ownerId);

    if (this.magasinLocationMode === 'immeuble') {
      const etageId = this.toPositiveNumber(this.magasinForm.get('idEtage')?.value);
      const context = etageId !== null
        ? this.composeLocationFromEtageId(etageId)
        : 'Selectionnez un immeuble puis un etage';
      return `${context} | Proprietaire : ${ownerName}`;
    }

    const siteId = this.toPositiveNumber(this.magasinForm.get('idSite')?.value);
    return `${this.getSiteName(siteId)} | Proprietaire : ${ownerName}`;
  }

  public get currentForm(): UntypedFormGroup {
    switch (this.activeType) {
      case 'villa':
        return this.villaForm;
      case 'magasin':
        return this.magasinForm;
      case 'appartement':
      default:
        return this.appartementForm;
    }
  }

  public get currentCount(): number {
    switch (this.activeType) {
      case 'villa':
        return this.villas.length;
      case 'magasin':
        return this.magasins.length;
      case 'appartement':
      default:
        return this.appartements.length;
    }
  }

  public get filteredItems(): BienListItem[] {
    const term = this.searchTerm.trim().toLowerCase();
    const items = this.currentItems;
    if (!term) {
      return items;
    }

    return items.filter((item) =>
      [item.code, item.name, item.description, item.location, item.owner, item.details]
        .filter((value) => !!value)
        .some((value) => value.toLowerCase().includes(term))
    );
  }

  public get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredItems.length / this.pageSize));
  }

  public get currentPageNumber(): number {
    return Math.min(this.currentPage, this.totalPages);
  }

  public get paginatedItems(): BienListItem[] {
    const start = (this.currentPageNumber - 1) * this.pageSize;
    return this.filteredItems.slice(start, start + this.pageSize);
  }

  public get paginationStart(): number {
    if (this.filteredItems.length === 0) {
      return 0;
    }

    return (this.currentPageNumber - 1) * this.pageSize + 1;
  }

  public get paginationEnd(): number {
    return Math.min(this.currentPageNumber * this.pageSize, this.filteredItems.length);
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

  public get currentItems(): BienListItem[] {
    switch (this.activeType) {
      case 'villa':
        return this.villas
          .map((villa) => this.mapVillaToListItem(villa))
          .filter((item): item is BienListItem => item !== null);
      case 'magasin':
        return this.magasins
          .map((magasin) => this.mapMagasinToListItem(magasin))
          .filter((item): item is BienListItem => item !== null);
      case 'appartement':
      default:
        return this.appartements
          .map((appartement) => this.mapAppartementToListItem(appartement))
          .filter((item): item is BienListItem => item !== null);
    }
  }

  public reloadData(): void {
    this.currentPage = 1;
    this.loadReferenceData();
    this.loadAssetLists();
  }

  public setActiveType(type: BienType): void {
    this.activeType = type;
    this.formErrorMessage = '';
    this.currentPage = 1;
  }

  public onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value ?? '';
    this.currentPage = 1;
  }

  public onPageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (Number.isFinite(value) && value > 0) {
      this.pageSize = value;
      this.currentPage = 1;
    }
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

  public exportBiensToExcel(): void {
    if (this.filteredItems.length === 0) {
      this.notify(NotificationType.ERROR, 'Aucun bien a exporter.');
      return;
    }

    const rows = this.filteredItems.map((item) => ({
      Type: this.currentTypeLabel,
      Code: item.code,
      Bien: item.name,
      Emplacement: item.location,
      Proprietaire: item.owner,
      Details: item.details,
      Description: item.description || '',
      Statut: item.occupied ? 'Occupe' : 'Libre',
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, this.currentTypeLabel);

    const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const today = formatDate(new Date(), 'yyyy-MM-dd', 'fr');
    const typeSlug = this.currentTypeLabel
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    saveAs(
      new Blob([buffer], { type: 'application/octet-stream' }),
      `biens-${typeSlug || 'immobiliers'}-${today}.xlsx`
    );
  }

  public startCreate(type: BienType = this.activeType): void {
    this.formErrorMessage = '';

    if (type === 'appartement') {
      this.resetAppartementForm();
      return;
    }

    if (type === 'villa') {
      this.resetVillaForm();
      return;
    }

    this.resetMagasinForm();
  }

  public saveCurrentBien(): void {
    this.formErrorMessage = '';

    if (!this.user?.idAgence || !this.user?.id) {
      this.formErrorMessage =
        "Impossible d'enregistrer le bien : utilisateur courant incomplet.";
      return;
    }

    const form = this.currentForm;
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    switch (this.activeType) {
      case 'villa':
        this.saveVilla();
        return;
      case 'magasin':
        this.saveMagasin();
        return;
      case 'appartement':
      default:
        this.saveAppartement();
        return;
    }
  }

  public submitAppartement(): void {
    this.activeType = 'appartement';
    this.saveCurrentBien();
  }

  public submitVilla(): void {
    this.activeType = 'villa';
    this.saveCurrentBien();
  }

  public submitMagasin(): void {
    this.activeType = 'magasin';
    this.saveCurrentBien();
  }

  public editItem(item: BienListItem): void {
    this.setActiveType(item.type);
    this.formErrorMessage = '';

    if (item.type === 'appartement') {
      this.apiService.findByIDAppartement(item.id).subscribe({
        next: (appartement) => this.patchAppartementForm(appartement),
        error: (error) => {
          this.formErrorMessage = this.extractErrorMessage(
            error,
            "Impossible de charger l'appartement."
          );
        },
      });
      return;
    }

    if (item.type === 'villa') {
      this.apiService.findVillaById(item.id).subscribe({
        next: (villa) => this.patchVillaForm(villa),
        error: (error) => {
          this.formErrorMessage = this.extractErrorMessage(
            error,
            'Impossible de charger la villa.'
          );
        },
      });
      return;
    }

    this.apiService.findByIDMagasin(item.id).subscribe({
      next: (magasin) => this.patchMagasinForm(magasin),
      error: (error) => {
        this.formErrorMessage = this.extractErrorMessage(
          error,
          'Impossible de charger le magasin.'
        );
      },
    });
  }

  public deleteItem(item: BienListItem): void {
    const confirmation = window.confirm(
      `Voulez-vous vraiment supprimer ${this.getArticleForType(item.type)} ${item.name} ?`
    );
    if (!confirmation) {
      return;
    }

    this.deletingKey = this.buildDeleteKey(item.type, item.id);

    this.getDeleteRequest(item)
      .pipe(finalize(() => (this.deletingKey = '')))
      .subscribe({
        next: (deleted) => {
          if (!deleted) {
            this.notify(
              NotificationType.ERROR,
              'La suppression du bien a echoue.'
            );
            return;
          }

          if (this.isCurrentFormEditing(item.type, item.id)) {
            this.startCreate(item.type);
          }

          this.notify(NotificationType.SUCCESS, 'Le bien a bien ete supprime.');
          this.loadAssetLists();
        },
        error: (error) => {
          this.notify(
            NotificationType.ERROR,
            this.extractErrorMessage(error, 'Impossible de supprimer le bien.')
          );
        },
      });
  }

  public isDeleting(item: BienListItem): boolean {
    return this.deletingKey === this.buildDeleteKey(item.type, item.id);
  }

  public trackByItem(index: number, item: BienListItem): string {
    return this.buildDeleteKey(item.type, item.id);
  }

  public getTypeCount(type: BienType): number {
    if (type === 'appartement') {
      return this.appartements.length;
    }
    if (type === 'villa') {
      return this.villas.length;
    }
    return this.magasins.length;
  }

  public setMagasinLocationMode(mode: MagasinLocationMode): void {
    this.magasinForm.patchValue({
      locationMode: mode,
      idSite: mode === 'site' ? this.magasinForm.get('idSite')?.value : null,
      immeubleId: mode === 'immeuble' ? this.magasinForm.get('immeubleId')?.value : null,
      idEtage: mode === 'immeuble' ? this.magasinForm.get('idEtage')?.value : null,
    });
    this.applyMagasinLocationValidators();
  }

  private initializeForms(): void {
    this.appartementForm = this.fb.group({
      id: [null],
      immeubleId: [null, Validators.required],
      idEtageAppartement: [null, Validators.required],
      nomBaptiserBienImmobilier: ['', Validators.required],
      description: [''],
      nbrPieceApp: [0, [Validators.required, Validators.min(0)]],
      nbreChambreApp: [0, [Validators.required, Validators.min(0)]],
      nbreSalonApp: [0, [Validators.required, Validators.min(0)]],
      nbreSalleEauApp: [0, [Validators.required, Validators.min(0)]],
      superficieBien: [0, [Validators.required, Validators.min(0)]],
      occupied: [false],
    });

    this.villaForm = this.fb.group({
      id: [null],
      idSite: [null, Validators.required],
      idUtilisateur: [null, Validators.required],
      nomBaptiserBienImmobilier: ['', Validators.required],
      description: [''],
      nbrePieceVilla: [0, [Validators.required, Validators.min(0)]],
      nbrChambreVilla: [0, [Validators.required, Validators.min(0)]],
      nbrSalonVilla: [0, [Validators.required, Validators.min(0)]],
      nbrSalleEauVilla: [0, [Validators.required, Validators.min(0)]],
      superficieBien: [0, [Validators.required, Validators.min(0)]],
      occupied: [false],
    });

    this.magasinForm = this.fb.group({
      id: [null],
      locationMode: ['site'],
      idSite: [null, Validators.required],
      immeubleId: [null],
      idEtage: [null],
      idUtilisateur: [null, Validators.required],
      nomBaptiserBienImmobilier: ['', Validators.required],
      description: [''],
      nombrePieceMagasin: [0, [Validators.required, Validators.min(0)]],
      superficieBien: [0, [Validators.required, Validators.min(0)]],
      underBuildingMagasin: [false],
      occupied: [false],
    });

    this.applyMagasinLocationValidators();
  }

  private bindFormReactions(): void {
    this.appartementForm.get('immeubleId')?.valueChanges.subscribe(() => {
      const selectedEtageId = this.toPositiveNumber(
        this.appartementForm.get('idEtageAppartement')?.value
      );
      if (
        selectedEtageId !== null &&
        !this.appartementEtages.some((etage) => etage.id === selectedEtageId)
      ) {
        this.appartementForm.patchValue({ idEtageAppartement: null }, { emitEvent: false });
      }
    });

    this.magasinForm.get('locationMode')?.valueChanges.subscribe(() => {
      this.applyMagasinLocationValidators();
    });

    this.magasinForm.get('immeubleId')?.valueChanges.subscribe(() => {
      const selectedEtageId = this.toPositiveNumber(this.magasinForm.get('idEtage')?.value);
      if (
        selectedEtageId !== null &&
        !this.magasinEtages.some((etage) => etage.id === selectedEtageId)
      ) {
        this.magasinForm.patchValue({ idEtage: null }, { emitEvent: false });
      }
    });
  }

  private loadReferenceData(): void {
    if (!this.user?.idAgence || !this.user?.id) {
      return;
    }

    this.isLoadingReferences = true;
    this.pageErrorMessage = '';

    forkJoin({
      sites: this.apiService.findAllSites(this.user.idAgence),
      proprietaires: this.apiService.getAllProprietaireByOrder(this.user.idAgence),
      immeubles: this.apiService.affichageDesImmeubles(this.user.idAgence),
      etages: this.apiService.findAllEtage(this.user.idAgence),
      etablissement: this.apiService
        .getDefaultEtable(this.user.id)
        .pipe(catchError(() => of(undefined as EtablissementUtilisateurDto | undefined))),
    })
      .pipe(finalize(() => (this.isLoadingReferences = false)))
      .subscribe({
        next: ({ sites, proprietaires, immeubles, etages, etablissement }) => {
          this.sites = [...(sites ?? [])].sort((left, right) =>
            (left.nomSite ?? left.abrSite ?? '').localeCompare(
              right.nomSite ?? right.abrSite ?? '',
              'fr',
              { sensitivity: 'base' }
            )
          );
          this.proprietaires = [...(proprietaires ?? [])].sort((left, right) =>
            this.getUserLabel(left).localeCompare(this.getUserLabel(right), 'fr', {
              sensitivity: 'base',
            })
          );
          this.immeubles = [...(immeubles ?? [])].sort((left, right) =>
            (left.nomCompletImmeuble ?? left.codeNomAbrvImmeuble ?? '').localeCompare(
              right.nomCompletImmeuble ?? right.codeNomAbrvImmeuble ?? '',
              'fr',
              { sensitivity: 'base' }
            )
          );
          this.etages = [...(etages ?? [])].sort(
            (left, right) =>
              (left.idImmeuble ?? 0) - (right.idImmeuble ?? 0) ||
              (left.numEtage ?? 0) - (right.numEtage ?? 0)
          );
          this.defaultChapitreId = this.toPositiveNumber(etablissement?.chapite) ?? 1;
        },
        error: (error) => {
          this.pageErrorMessage = this.extractErrorMessage(
            error,
            'Impossible de charger les references des biens.'
          );
        },
      });
  }

  private loadAssetLists(): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.isLoadingAssets = true;

    forkJoin({
      appartements: this.apiService.findAllAppartement(this.user.idAgence),
      villas: this.apiService.findAllVilla(this.user.idAgence),
      magasins: this.apiService.findAllMagasin(this.user.idAgence),
    })
      .pipe(finalize(() => (this.isLoadingAssets = false)))
      .subscribe({
        next: ({ appartements, villas, magasins }) => {
          this.appartements = [...(appartements ?? [])].sort((left, right) =>
            (left.nomCompletBienImmobilier ?? left.codeAbrvBienImmobilier ?? '').localeCompare(
              right.nomCompletBienImmobilier ?? right.codeAbrvBienImmobilier ?? '',
              'fr',
              { sensitivity: 'base' }
            )
          );
          this.villas = [...(villas ?? [])].sort((left, right) =>
            (left.nomCompletBienImmobilier ?? left.codeAbrvBienImmobilier ?? '').localeCompare(
              right.nomCompletBienImmobilier ?? right.codeAbrvBienImmobilier ?? '',
              'fr',
              { sensitivity: 'base' }
            )
          );
          this.magasins = [...(magasins ?? [])].sort((left, right) =>
            (left.nomCompletBienImmobilier ?? left.codeAbrvBienImmobilier ?? '').localeCompare(
              right.nomCompletBienImmobilier ?? right.codeAbrvBienImmobilier ?? '',
              'fr',
              { sensitivity: 'base' }
            )
          );
          this.currentPage = 1;
        },
        error: (error) => {
          this.pageErrorMessage = this.extractErrorMessage(
            error,
            'Impossible de charger les biens immobiliers.'
          );
        },
      });
  }

  private saveAppartement(): void {
    const payload = this.buildAppartementPayload();
    if (!payload) {
      this.isSaving = false;
      this.formErrorMessage =
        "Le formulaire appartement contient des valeurs invalides.";
      return;
    }

    const isEdit = !!this.toPositiveNumber(payload.id);
    this.apiService
      .saveAppartement(payload)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.notify(
            NotificationType.SUCCESS,
            isEdit
              ? "L'appartement a bien ete mis a jour."
              : "L'appartement a bien ete cree."
          );
          this.startCreate('appartement');
          this.loadAssetLists();
        },
        error: (error) => {
          this.formErrorMessage = this.extractErrorMessage(
            error,
            "Impossible d'enregistrer l'appartement."
          );
        },
      });
  }

  private saveVilla(): void {
    const payload = this.buildVillaPayload();
    if (!payload) {
      this.isSaving = false;
      this.formErrorMessage = 'Le formulaire villa contient des valeurs invalides.';
      return;
    }

    const isEdit = !!this.toPositiveNumber(payload.id);
    this.apiService
      .saveVilla(payload)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.notify(
            NotificationType.SUCCESS,
            isEdit ? 'La villa a bien ete mise a jour.' : 'La villa a bien ete creee.'
          );
          this.startCreate('villa');
          this.loadAssetLists();
        },
        error: (error) => {
          this.formErrorMessage = this.extractErrorMessage(
            error,
            "Impossible d'enregistrer la villa."
          );
        },
      });
  }

  private saveMagasin(): void {
    const payload = this.buildMagasinPayload();
    if (!payload) {
      this.isSaving = false;
      this.formErrorMessage =
        'Le formulaire magasin contient des valeurs invalides.';
      return;
    }

    const isEdit = !!this.toPositiveNumber(payload.id);
    this.apiService
      .saveMagasinReturnDto(payload)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.notify(
            NotificationType.SUCCESS,
            isEdit
              ? 'Le magasin a bien ete mis a jour.'
              : 'Le magasin a bien ete cree.'
          );
          this.startCreate('magasin');
          this.loadAssetLists();
        },
        error: (error) => {
          this.formErrorMessage = this.extractErrorMessage(
            error,
            "Impossible d'enregistrer le magasin."
          );
        },
      });
  }

  private buildAppartementPayload(): AppartementDto | null {
    const idEtageAppartement = this.toPositiveNumber(
      this.appartementForm.get('idEtageAppartement')?.value
    );
    const nbrPieceApp = this.toNonNegativeNumber(this.appartementForm.get('nbrPieceApp')?.value);
    const nbreChambreApp = this.toNonNegativeNumber(
      this.appartementForm.get('nbreChambreApp')?.value
    );
    const nbreSalonApp = this.toNonNegativeNumber(
      this.appartementForm.get('nbreSalonApp')?.value
    );
    const nbreSalleEauApp = this.toNonNegativeNumber(
      this.appartementForm.get('nbreSalleEauApp')?.value
    );
    const superficieBien = this.toNonNegativeFloat(
      this.appartementForm.get('superficieBien')?.value
    );

    if (
      !this.user?.idAgence ||
      !this.user?.id ||
      idEtageAppartement === null ||
      nbrPieceApp === null ||
      nbreChambreApp === null ||
      nbreSalonApp === null ||
      nbreSalleEauApp === null ||
      superficieBien === null
    ) {
      return null;
    }

    return {
      id: this.toNullableId(this.appartementForm.get('id')?.value),
      idAgence: this.user.idAgence,
      idCreateur: this.user.id,
      idEtageAppartement,
      nomBaptiserBienImmobilier: this.normalizeText(
        this.appartementForm.get('nomBaptiserBienImmobilier')?.value
      ),
      description: this.normalizeText(this.appartementForm.get('description')?.value),
      nbrPieceApp,
      nbreChambreApp,
      nbreSalonApp,
      nbreSalleEauApp,
      superficieBien,
      bienMeublerResidence: false,
      idChapitre: this.defaultChapitreId,
      occupied: !!this.appartementForm.get('occupied')?.value,
    };
  }

  private buildVillaPayload(): VillaDto | null {
    const idSite = this.toPositiveNumber(this.villaForm.get('idSite')?.value);
    const idUtilisateur = this.toPositiveNumber(
      this.villaForm.get('idUtilisateur')?.value
    );
    const nbrePieceVilla = this.toNonNegativeNumber(
      this.villaForm.get('nbrePieceVilla')?.value
    );
    const nbrChambreVilla = this.toNonNegativeNumber(
      this.villaForm.get('nbrChambreVilla')?.value
    );
    const nbrSalonVilla = this.toNonNegativeNumber(
      this.villaForm.get('nbrSalonVilla')?.value
    );
    const nbrSalleEauVilla = this.toNonNegativeNumber(
      this.villaForm.get('nbrSalleEauVilla')?.value
    );
    const superficieBien = this.toNonNegativeFloat(
      this.villaForm.get('superficieBien')?.value
    );

    if (
      !this.user?.idAgence ||
      !this.user?.id ||
      idSite === null ||
      idUtilisateur === null ||
      nbrePieceVilla === null ||
      nbrChambreVilla === null ||
      nbrSalonVilla === null ||
      nbrSalleEauVilla === null ||
      superficieBien === null
    ) {
      return null;
    }

    return {
      id: this.toNullableId(this.villaForm.get('id')?.value),
      idAgence: this.user.idAgence,
      idCreateur: this.user.id,
      idSite,
      idUtilisateur,
      nomBaptiserBienImmobilier: this.normalizeText(
        this.villaForm.get('nomBaptiserBienImmobilier')?.value
      ),
      description: this.normalizeText(this.villaForm.get('description')?.value),
      nbrePieceVilla,
      nbrChambreVilla,
      nbrSalonVilla,
      nbrSalleEauVilla,
      superficieBien,
      bienMeublerResidence: false,
      idChapitre: this.defaultChapitreId,
      occupied: !!this.villaForm.get('occupied')?.value,
    };
  }

  private buildMagasinPayload(): MagasinDto | null {
    const idUtilisateur = this.toPositiveNumber(
      this.magasinForm.get('idUtilisateur')?.value
    );
    const nombrePieceMagasin = this.toNonNegativeNumber(
      this.magasinForm.get('nombrePieceMagasin')?.value
    );
    const superficieBien = this.toNonNegativeFloat(
      this.magasinForm.get('superficieBien')?.value
    );
    const idSite =
      this.magasinLocationMode === 'site'
        ? this.toPositiveNumber(this.magasinForm.get('idSite')?.value)
        : null;
    const idEtage =
      this.magasinLocationMode === 'immeuble'
        ? this.toPositiveNumber(this.magasinForm.get('idEtage')?.value)
        : null;

    if (
      !this.user?.idAgence ||
      !this.user?.id ||
      idUtilisateur === null ||
      nombrePieceMagasin === null ||
      superficieBien === null ||
      (this.magasinLocationMode === 'site' && idSite === null) ||
      (this.magasinLocationMode === 'immeuble' && idEtage === null)
    ) {
      return null;
    }

    return {
      id: this.toNullableId(this.magasinForm.get('id')?.value),
      idAgence: this.user.idAgence,
      idCreateur: this.user.id,
      idSite: idSite ?? undefined,
      idEtage: idEtage ?? undefined,
      idUtilisateur,
      nomBaptiserBienImmobilier: this.normalizeText(
        this.magasinForm.get('nomBaptiserBienImmobilier')?.value
      ),
      description: this.normalizeText(this.magasinForm.get('description')?.value),
      nombrePieceMagasin,
      superficieBien,
      underBuildingMagasin: !!this.magasinForm.get('underBuildingMagasin')?.value,
      bienMeublerResidence: false,
      idChapitre: this.defaultChapitreId,
      occupied: !!this.magasinForm.get('occupied')?.value,
    };
  }

  private patchAppartementForm(appartement: AppartementDto): void {
    const etageId = this.toPositiveNumber(appartement.idEtageAppartement);
    const etage = this.findEtageById(etageId);

    this.appartementForm.reset({
      id: appartement.id ?? null,
      immeubleId: etage?.idImmeuble ?? null,
      idEtageAppartement: etageId,
      nomBaptiserBienImmobilier: appartement.nomBaptiserBienImmobilier ?? '',
      description: appartement.description ?? '',
      nbrPieceApp: appartement.nbrPieceApp ?? 0,
      nbreChambreApp: appartement.nbreChambreApp ?? 0,
      nbreSalonApp: appartement.nbreSalonApp ?? 0,
      nbreSalleEauApp: appartement.nbreSalleEauApp ?? 0,
      superficieBien: appartement.superficieBien ?? 0,
      occupied: !!appartement.occupied,
    });
    this.appartementForm.markAsPristine();
  }

  private patchVillaForm(villa: VillaDto): void {
    this.villaForm.reset({
      id: villa.id ?? null,
      idSite: villa.idSite ?? null,
      idUtilisateur: villa.idUtilisateur ?? null,
      nomBaptiserBienImmobilier: villa.nomBaptiserBienImmobilier ?? '',
      description: villa.description ?? '',
      nbrePieceVilla: villa.nbrePieceVilla ?? 0,
      nbrChambreVilla: villa.nbrChambreVilla ?? 0,
      nbrSalonVilla: villa.nbrSalonVilla ?? 0,
      nbrSalleEauVilla: villa.nbrSalleEauVilla ?? 0,
      superficieBien: villa.superficieBien ?? 0,
      occupied: !!villa.occupied,
    });
    this.villaForm.markAsPristine();
  }

  private patchMagasinForm(magasin: MagasinDto): void {
    const etageId = this.toPositiveNumber(magasin.idEtage);
    const etage = this.findEtageById(etageId);
    const mode: MagasinLocationMode = etageId !== null ? 'immeuble' : 'site';

    this.magasinForm.reset({
      id: magasin.id ?? null,
      locationMode: mode,
      idSite: mode === 'site' ? magasin.idSite ?? null : null,
      immeubleId: etage?.idImmeuble ?? null,
      idEtage: etageId,
      idUtilisateur: magasin.idUtilisateur ?? null,
      nomBaptiserBienImmobilier: magasin.nomBaptiserBienImmobilier ?? '',
      description: magasin.description ?? '',
      nombrePieceMagasin: magasin.nombrePieceMagasin ?? 0,
      superficieBien: magasin.superficieBien ?? 0,
      underBuildingMagasin: !!magasin.underBuildingMagasin,
      occupied: !!magasin.occupied,
    });
    this.applyMagasinLocationValidators();
    this.magasinForm.markAsPristine();
  }

  private resetAppartementForm(): void {
    this.appartementForm.reset({
      id: null,
      immeubleId: null,
      idEtageAppartement: null,
      nomBaptiserBienImmobilier: '',
      description: '',
      nbrPieceApp: 0,
      nbreChambreApp: 0,
      nbreSalonApp: 0,
      nbreSalleEauApp: 0,
      superficieBien: 0,
      occupied: false,
    });
    this.appartementForm.markAsPristine();
  }

  private resetVillaForm(): void {
    this.villaForm.reset({
      id: null,
      idSite: null,
      idUtilisateur: null,
      nomBaptiserBienImmobilier: '',
      description: '',
      nbrePieceVilla: 0,
      nbrChambreVilla: 0,
      nbrSalonVilla: 0,
      nbrSalleEauVilla: 0,
      superficieBien: 0,
      occupied: false,
    });
    this.villaForm.markAsPristine();
  }

  private resetMagasinForm(): void {
    this.magasinForm.reset({
      id: null,
      locationMode: 'site',
      idSite: null,
      immeubleId: null,
      idEtage: null,
      idUtilisateur: null,
      nomBaptiserBienImmobilier: '',
      description: '',
      nombrePieceMagasin: 0,
      superficieBien: 0,
      underBuildingMagasin: false,
      occupied: false,
    });
    this.applyMagasinLocationValidators();
    this.magasinForm.markAsPristine();
  }

  private applyMagasinLocationValidators(): void {
    const siteControl = this.magasinForm.get('idSite');
    const immeubleControl = this.magasinForm.get('immeubleId');
    const etageControl = this.magasinForm.get('idEtage');

    if (!siteControl || !immeubleControl || !etageControl) {
      return;
    }

    if (this.magasinLocationMode === 'site') {
      siteControl.setValidators([Validators.required]);
      immeubleControl.clearValidators();
      etageControl.clearValidators();
      this.magasinForm.patchValue(
        {
          immeubleId: null,
          idEtage: null,
        },
        { emitEvent: false }
      );
    } else {
      siteControl.clearValidators();
      immeubleControl.setValidators([Validators.required]);
      etageControl.setValidators([Validators.required]);
      this.magasinForm.patchValue(
        {
          idSite: null,
        },
        { emitEvent: false }
      );
    }

    siteControl.updateValueAndValidity({ emitEvent: false });
    immeubleControl.updateValueAndValidity({ emitEvent: false });
    etageControl.updateValueAndValidity({ emitEvent: false });
  }

  private getDeleteRequest(item: BienListItem) {
    if (item.type === 'appartement') {
      return this.apiService.deleteAppartement(item.id);
    }

    if (item.type === 'villa') {
      return this.http.delete<boolean>(
        `${this.apiService.rootUrl}gestimoweb/api/v1/villa/delete/${item.id}`
      );
    }

    return this.http.delete<boolean>(
      `${this.apiService.rootUrl}gestimoweb/api/v1/magasin/delete/${item.id}`
    );
  }

  private mapAppartementToListItem(appartement: AppartementDto): BienListItem | null {
    const id = this.toPositiveNumber(appartement.id);
    if (id === null) {
      return null;
    }

    return {
      id,
      type: 'appartement',
      code: appartement.codeAbrvBienImmobilier ?? '-',
      name:
        appartement.nomBaptiserBienImmobilier ??
        appartement.nomCompletBienImmobilier ??
        '-',
      description: appartement.description ?? '',
      location: this.composeLocationFromEtageId(appartement.idEtageAppartement),
      owner: appartement.fullNameProprio ?? '-',
      details: this.buildDetails([
        this.formatCount(appartement.nbrPieceApp, 'piece'),
        this.formatCount(appartement.nbreChambreApp, 'chambre'),
        this.formatSurface(appartement.superficieBien),
      ]),
      occupied: !!appartement.occupied,
    };
  }

  private mapVillaToListItem(villa: VillaDto): BienListItem | null {
    const id = this.toPositiveNumber(villa.id);
    if (id === null) {
      return null;
    }

    return {
      id,
      type: 'villa',
      code: villa.codeAbrvBienImmobilier ?? '-',
      name: villa.nomBaptiserBienImmobilier ?? villa.nomCompletBienImmobilier ?? '-',
      description: villa.description ?? '',
      location: this.getSiteName(villa.idSite),
      owner: villa.proprietaire ?? this.getOwnerName(villa.idUtilisateur),
      details: this.buildDetails([
        this.formatCount(villa.nbrePieceVilla, 'piece'),
        this.formatCount(villa.nbrChambreVilla, 'chambre'),
        this.formatSurface(villa.superficieBien),
      ]),
      occupied: !!villa.occupied,
    };
  }

  private mapMagasinToListItem(magasin: MagasinResponseDto): BienListItem | null {
    const id = this.toPositiveNumber(magasin.id);
    if (id === null) {
      return null;
    }

    const displayName =
      magasin.nomBaptiserBienImmobilier ??
      magasin.nomCompletBienImmobilier ??
      '-';

    return {
      id,
      type: 'magasin',
      code: magasin.codeAbrvBienImmobilier ?? '-',
      name: displayName,
      description: magasin.description ?? '',
      location: magasin.underBuildingMagasin
        ? 'Rattache a un immeuble'
        : 'Rattache a un site',
      owner: magasin.proprietaire ?? '-',
      details: this.buildDetails([
        this.formatCount(magasin.nombrePieceMagasin, 'piece'),
        this.formatSurface(magasin.superficieBien),
        magasin.nomCompletBienImmobilier &&
        magasin.nomCompletBienImmobilier !== displayName
          ? magasin.nomCompletBienImmobilier
          : null,
      ]),
      occupied: !!magasin.occupied,
    };
  }

  private buildDetails(parts: Array<string | null | undefined>): string {
    const details = parts.filter((part): part is string => !!part && !!part.trim());
    return details.length > 0 ? details.join(' | ') : '-';
  }

  private formatCount(value: unknown, label: string): string | null {
    const count = this.toNonNegativeNumber(value);
    if (count === null) {
      return null;
    }

    return `${count} ${label}${count > 1 ? 's' : ''}`;
  }

  private formatSurface(value: unknown): string | null {
    const surface = this.toNonNegativeFloat(value);
    if (surface === null) {
      return null;
    }

    return `${surface.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })} m²`;
  }

  private composeLocationFromEtageId(etageId: unknown): string {
    const etage = this.findEtageById(etageId);
    if (!etage) {
      return '-';
    }

    const immeuble = this.findImmeubleById(etage.idImmeuble);
    const siteName = this.getSiteName(immeuble?.idSite);
    const immeubleLabel =
      immeuble?.nomBaptiserImmeuble ??
      immeuble?.nomCompletImmeuble ??
      immeuble?.codeNomAbrvImmeuble;
    const etageLabel =
      etage.nomBaptiserEtage ?? etage.nomCompletEtage ?? etage.codeAbrvEtage;

    return [siteName !== '-' ? siteName : null, immeubleLabel, etageLabel]
      .filter((value): value is string => !!value)
      .join(' / ');
  }

  private composeLocationFromImmeubleId(immeubleId: unknown): string {
    const immeuble = this.findImmeubleById(immeubleId);
    if (!immeuble) {
      return '-';
    }

    return [
      this.getSiteName(immeuble.idSite),
      immeuble.nomBaptiserImmeuble ??
        immeuble.nomCompletImmeuble ??
        immeuble.codeNomAbrvImmeuble,
    ]
      .filter((value): value is string => !!value && value !== '-')
      .join(' / ');
  }

  private getEtagesByImmeuble(immeubleId: unknown): EtageDto[] {
    const normalizedImmeubleId = this.toPositiveNumber(immeubleId);
    if (normalizedImmeubleId === null) {
      return [];
    }

    return this.etages
      .filter((etage) => etage.idImmeuble === normalizedImmeubleId)
      .sort((left, right) => (left.numEtage ?? 0) - (right.numEtage ?? 0));
  }

  private findImmeubleById(immeubleId: unknown): ImmeubleEtageDto | undefined {
    const normalizedImmeubleId = this.toPositiveNumber(immeubleId);
    if (normalizedImmeubleId === null) {
      return undefined;
    }

    return this.immeubles.find((immeuble) => immeuble.id === normalizedImmeubleId);
  }

  private findEtageById(etageId: unknown): EtageDto | undefined {
    const normalizedEtageId = this.toPositiveNumber(etageId);
    if (normalizedEtageId === null) {
      return undefined;
    }

    return this.etages.find((etage) => etage.id === normalizedEtageId);
  }

  private getSiteName(siteId: number | null | undefined): string {
    const normalizedSiteId = this.toPositiveNumber(siteId);
    if (normalizedSiteId === null) {
      return '-';
    }

    const site = this.sites.find((item) => item.id === normalizedSiteId);
    return site?.nomSite || site?.abrSite || '-';
  }

  private getOwnerName(ownerId: number | null | undefined): string {
    const normalizedOwnerId = this.toPositiveNumber(ownerId);
    if (normalizedOwnerId === null) {
      return '-';
    }

    const owner = this.proprietaires.find((item) => item.id === normalizedOwnerId);
    return owner ? this.getUserLabel(owner) : '-';
  }

  public getUserLabel(user: UtilisateurAfficheDto): string {
    return (
      [user.nom, user.prenom].filter((value): value is string => !!value).join(' ') ||
      user.username ||
      user.mobile ||
      user.email ||
      '-'
    );
  }

  private buildDeleteKey(type: BienType, id: number): string {
    return `${type}-${id}`;
  }

  private isCurrentFormEditing(type: BienType, id: number): boolean {
    const formId =
      type === 'appartement'
        ? this.toPositiveNumber(this.appartementForm.get('id')?.value)
        : type === 'villa'
          ? this.toPositiveNumber(this.villaForm.get('id')?.value)
          : this.toPositiveNumber(this.magasinForm.get('id')?.value);

    return formId === id;
  }

  private getArticleForType(type: BienType): string {
    if (type === 'appartement') {
      return "l'appartement";
    }

    if (type === 'villa') {
      return 'la villa';
    }

    return 'le magasin';
  }

  private toNullableId(value: unknown): number | undefined {
    return this.toPositiveNumber(value) ?? undefined;
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

  private toNonNegativeFloat(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const normalized =
      typeof value === 'number' ? value : Number.parseFloat(String(value));

    return Number.isFinite(normalized) && normalized >= 0 ? normalized : null;
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
