import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import {
  AppartementDto,
  EtageDto,
  ImmeubleEtageDto,
  MagasinResponseDto,
  SiteResponseDto,
  UtilisateurRequestDto,
  VillaDto,
} from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';

type BienFilterType = 'all' | 'appartement' | 'villa' | 'magasin';
type AvailableBienType = Exclude<BienFilterType, 'all'>;

interface ReportItem {
  id: number;
  type: AvailableBienType;
  typeLabel: string;
  code: string;
  name: string;
  description: string;
  location: string;
  owner: string;
  details: string;
}

interface SummaryCard {
  type: BienFilterType;
  label: string;
  hint: string;
  icon: string;
  tone: 'primary' | 'success' | 'warning' | 'danger';
}

@Component({
  standalone: false,
  selector: 'app-page-rapport-biens-disponibles',
  templateUrl: './page-rapport-biens-disponibles.component.html',
  styleUrls: ['./page-rapport-biens-disponibles.component.css'],
})
export class PageRapportBiensDisponiblesComponent implements OnInit {
  public readonly summaryCards: SummaryCard[] = [
    {
      type: 'all',
      label: 'Tous',
      hint: 'Vue globale des biens libres de l agence.',
      icon: 'fas fa-layer-group',
      tone: 'primary',
    },
    {
      type: 'appartement',
      label: 'Appartements',
      hint: 'Appartements libres exploitables en bail.',
      icon: 'fas fa-building',
      tone: 'success',
    },
    {
      type: 'villa',
      label: 'Villas',
      hint: 'Villas disponibles sur les sites de l agence.',
      icon: 'fas fa-home',
      tone: 'warning',
    },
    {
      type: 'magasin',
      label: 'Magasins',
      hint: 'Magasins libres rattaches a un site ou un immeuble.',
      icon: 'fas fa-store',
      tone: 'danger',
    },
  ];

  public readonly pageSizeOptions = [10, 25, 50, 100];

  public user: UtilisateurRequestDto | null = null;
  public searchTerm = '';
  public activeType: BienFilterType = 'all';
  public currentPage = 1;
  public pageSize = 10;

  public sites: SiteResponseDto[] = [];
  public immeubles: ImmeubleEtageDto[] = [];
  public etages: EtageDto[] = [];

  public appartements: AppartementDto[] = [];
  public villas: VillaDto[] = [];
  public magasins: MagasinResponseDto[] = [];

  public pageErrorMessage = '';
  public isLoading = false;
  public lastRefreshLabel = '';

  constructor(
    private readonly apiService: ApiService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) {}

  public ngOnInit(): void {
    this.user = this.getCurrentUser();

    if (!this.user?.idAgence) {
      this.pageErrorMessage =
        "Impossible de charger le rapport des biens disponibles : agence introuvable.";
      return;
    }

    this.reloadData();
  }

  public get totalAvailable(): number {
    return this.allItems.length;
  }

  public get appartementCount(): number {
    return this.appartements.length;
  }

  public get villaCount(): number {
    return this.villas.length;
  }

  public get magasinCount(): number {
    return this.magasins.length;
  }

  public get currentFilterLabel(): string {
    switch (this.activeType) {
      case 'appartement':
        return 'Appartements libres';
      case 'villa':
        return 'Villas libres';
      case 'magasin':
        return 'Magasins libres';
      case 'all':
      default:
        return 'Tous les biens libres';
    }
  }

  public get allItems(): ReportItem[] {
    const mapped = [
      ...this.appartements
        .map((appartement) => this.mapAppartementToItem(appartement))
        .filter((item): item is ReportItem => item !== null),
      ...this.villas
        .map((villa) => this.mapVillaToItem(villa))
        .filter((item): item is ReportItem => item !== null),
      ...this.magasins
        .map((magasin) => this.mapMagasinToItem(magasin))
        .filter((item): item is ReportItem => item !== null),
    ];

    return mapped.sort((left, right) => {
      const order =
        this.getTypeOrder(left.type) - this.getTypeOrder(right.type);
      if (order !== 0) {
        return order;
      }

      return `${left.code} ${left.name}`.localeCompare(
        `${right.code} ${right.name}`,
        'fr',
        { sensitivity: 'base' }
      );
    });
  }

  public get filteredItems(): ReportItem[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.allItems.filter((item) => {
      if (this.activeType !== 'all' && item.type !== this.activeType) {
        return false;
      }

      if (!term) {
        return true;
      }

      return [
        item.typeLabel,
        item.code,
        item.name,
        item.description,
        item.location,
        item.owner,
        item.details,
      ]
        .filter((value) => !!value)
        .some((value) => value.toLowerCase().includes(term));
    });
  }

  public get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredItems.length / this.pageSize));
  }

  public get currentPageNumber(): number {
    return Math.min(this.currentPage, this.totalPages);
  }

  public get pagedItems(): ReportItem[] {
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

  public reloadData(): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.isLoading = true;
    this.pageErrorMessage = '';

    forkJoin({
      sites: this.apiService.findAllSites(this.user.idAgence),
      immeubles: this.apiService.affichageDesImmeubles(this.user.idAgence),
      etages: this.apiService.findAllEtage(this.user.idAgence),
      appartementsLibres: this.apiService
        .findAllAppartementLibre(this.user.idAgence)
        .pipe(catchError(() => of([] as AppartementDto[]))),
      appartements: this.apiService
        .findAllAppartement(this.user.idAgence)
        .pipe(catchError(() => of([] as AppartementDto[]))),
      villas: this.apiService
        .findAllVillaLibre(this.user.idAgence)
        .pipe(catchError(() => of([] as VillaDto[]))),
      magasins: this.apiService
        .findAllMagasinLibre(this.user.idAgence)
        .pipe(catchError(() => of([] as MagasinResponseDto[]))),
    })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: ({
          sites,
          immeubles,
          etages,
          appartementsLibres,
          appartements,
          villas,
          magasins,
        }) => {
          this.sites = [...(sites ?? [])].sort((left, right) =>
            (left.nomSite ?? left.abrSite ?? '').localeCompare(
              right.nomSite ?? right.abrSite ?? '',
              'fr',
              { sensitivity: 'base' }
            )
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

          this.appartements = this.resolveAvailableAppartements(
            appartementsLibres ?? [],
            appartements ?? []
          );
          this.villas = this.sortByCode(
            (villas ?? []).filter((villa) => villa.occupied !== true)
          );
          this.magasins = this.sortByCode(
            (magasins ?? []).filter((magasin) => magasin.occupied !== true)
          );
          this.lastRefreshLabel = formatDate(
            new Date(),
            "dd/MM/yyyy 'a' HH:mm",
            'fr-FR'
          );
          this.currentPage = 1;
        },
        error: (error) => {
          this.pageErrorMessage = this.extractErrorMessage(
            error,
            'Impossible de charger le rapport des biens disponibles.'
          );
        },
      });
  }

  public setActiveType(type: BienFilterType): void {
    this.activeType = type;
    this.currentPage = 1;
  }

  public getCountForCard(type: BienFilterType): number {
    switch (type) {
      case 'appartement':
        return this.appartementCount;
      case 'villa':
        return this.villaCount;
      case 'magasin':
        return this.magasinCount;
      case 'all':
      default:
        return this.totalAvailable;
    }
  }

  public onSearchChange(value: string): void {
    this.searchTerm = value ?? '';
    this.currentPage = 1;
  }

  public onPageSizeChange(value: number | string): void {
    const parsedValue = Number(value);
    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      return;
    }

    this.pageSize = parsedValue;
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

  public exportToExcel(): void {
    if (this.filteredItems.length === 0) {
      this.notify(NotificationType.ERROR, 'Aucun bien disponible a exporter.');
      return;
    }

    const rows = this.filteredItems.map((item) => ({
      Type: item.typeLabel,
      Statut: 'Libre',
      Code: item.code,
      Bien: item.name,
      Localisation: item.location,
      Proprietaire: item.owner,
      Details: item.details,
      Description: item.description || '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Biens disponibles');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const fileName = `rapport-biens-disponibles-${formatDate(
      new Date(),
      'yyyy-MM-dd',
      'fr-FR'
    )}.xlsx`;

    saveAs(
      new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
      fileName
    );
  }

  public trackByItem(index: number, item: ReportItem): string {
    return `${item.type}-${item.id}`;
  }

  private resolveAvailableAppartements(
    appartementsLibres: AppartementDto[],
    appartements: AppartementDto[]
  ): AppartementDto[] {
    const appartementsLibresFiltres = this.sortByCode(
      appartementsLibres.filter(
        (appartement) =>
          appartement.occupied !== true &&
          appartement.bienMeublerResidence !== true
      )
    );

    if (appartementsLibresFiltres.length > 0) {
      return appartementsLibresFiltres;
    }

    return this.sortByCode(
      appartements.filter(
        (appartement) =>
          appartement.occupied !== true &&
          appartement.bienMeublerResidence !== true
      )
    );
  }

  private sortByCode<T extends { codeAbrvBienImmobilier?: string }>(items: T[]): T[] {
    return [...items].sort((left, right) =>
      (left.codeAbrvBienImmobilier ?? '').localeCompare(
        right.codeAbrvBienImmobilier ?? '',
        'fr',
        { sensitivity: 'base' }
      )
    );
  }

  private mapAppartementToItem(appartement: AppartementDto): ReportItem | null {
    const id = this.toPositiveNumber(appartement.id);
    if (id === null) {
      return null;
    }

    return {
      id,
      type: 'appartement',
      typeLabel: 'Appartement',
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
    };
  }

  private mapVillaToItem(villa: VillaDto): ReportItem | null {
    const id = this.toPositiveNumber(villa.id);
    if (id === null) {
      return null;
    }

    return {
      id,
      type: 'villa',
      typeLabel: 'Villa',
      code: villa.codeAbrvBienImmobilier ?? '-',
      name: villa.nomBaptiserBienImmobilier ?? villa.nomCompletBienImmobilier ?? '-',
      description: villa.description ?? '',
      location: this.getSiteName(villa.idSite),
      owner: villa.proprietaire ?? '-',
      details: this.buildDetails([
        this.formatCount(villa.nbrePieceVilla, 'piece'),
        this.formatCount(villa.nbrChambreVilla, 'chambre'),
        this.formatSurface(villa.superficieBien),
      ]),
    };
  }

  private mapMagasinToItem(magasin: MagasinResponseDto): ReportItem | null {
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
      typeLabel: 'Magasin',
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

  private getTypeOrder(type: AvailableBienType): number {
    switch (type) {
      case 'appartement':
        return 1;
      case 'villa':
        return 2;
      case 'magasin':
        return 3;
      default:
        return 99;
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

  private toNonNegativeFloat(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const normalized =
      typeof value === 'number' ? value : Number.parseFloat(String(value));

    return Number.isFinite(normalized) && normalized >= 0 ? normalized : null;
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
