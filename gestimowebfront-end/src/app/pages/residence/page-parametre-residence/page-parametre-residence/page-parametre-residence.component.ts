import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { AppartementDto, UtilisateurRequestDto } from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';

type ResidenceStatusFilter = 'all' | 'available' | 'occupied';

@Component({
  standalone: false,
  selector: 'app-page-parametre-residence',
  templateUrl: './page-parametre-residence.component.html',
  styleUrls: ['./page-parametre-residence.component.css'],
})
export class PageParametreResidenceComponent implements OnInit, OnDestroy {
  public user?: UtilisateurRequestDto;
  public loading = false;
  public errorMessage = '';
  public searchTerm = '';

  public statusFilter: ResidenceStatusFilter = 'all';
  public categoryFilter = '';
  public readonly noCategoryValue = '__NONE__';
  public categoryOptions: string[] = [];
  public priceMin: number | null = null;
  public priceMax: number | null = null;

  public residences: AppartementDto[] = [];
  public filteredResidences: AppartementDto[] = [];
  public pagedResidences: AppartementDto[] = [];
  public lastRefreshLabel = '';

  public pageIndex = 0;
  public pageSize = 10;
  public readonly pageSizeOptions = [5, 10, 20, 50];

  private subscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.refresh();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get totalResidences(): number {
    return this.residences.length;
  }

  get occupiedResidences(): number {
    return this.residences.filter((residence) => residence.occupied === true).length;
  }

  get availableResidences(): number {
    return this.totalResidences - this.occupiedResidences;
  }

  get activeFilters(): string[] {
    const filters: string[] = [];

    const term = this.searchTerm.trim();
    if (term) {
      filters.push(`Recherche: ${term}`);
    }

    if (this.statusFilter === 'available') {
      filters.push('Statut: Libre');
    }

    if (this.statusFilter === 'occupied') {
      filters.push('Statut: Occupée');
    }

    if (this.categoryFilter) {
      filters.push(
        this.categoryFilter === this.noCategoryValue
          ? 'Catégorie: Sans catégorie'
          : `Catégorie: ${this.categoryFilter}`
      );
    }

    const min = this.toNumberOrNull(this.priceMin);
    const max = this.toNumberOrNull(this.priceMax);
    if (min !== null || max !== null) {
      if (min !== null && max !== null) {
        filters.push(`Prix: ${min.toLocaleString('fr-FR')} - ${max.toLocaleString('fr-FR')} FCFA`);
      } else if (min !== null) {
        filters.push(`Prix: ≥ ${min.toLocaleString('fr-FR')} FCFA`);
      } else if (max !== null) {
        filters.push(`Prix: ≤ ${max.toLocaleString('fr-FR')} FCFA`);
      }
    }

    return filters;
  }

  public refresh(): void {
    const idAgence = this.user?.idAgence;
    if (!idAgence) {
      this.errorMessage = "Impossible de charger les residences : agence non definie.";
      return;
    }

    this.subscription?.unsubscribe();
    this.loading = true;
    this.errorMessage = '';

    this.subscription = this.apiService.findAllAppartementMeuble(idAgence).subscribe({
      next: (data) => {
        this.residences = [...(data ?? [])].sort((left, right) =>
          this.getResidenceLabel(left).localeCompare(this.getResidenceLabel(right))
        );
        this.categoryOptions = this.buildCategoryOptions(this.residences);
        if (this.categoryFilter && this.categoryFilter !== this.noCategoryValue) {
          if (!this.categoryOptions.includes(this.categoryFilter)) {
            this.categoryFilter = '';
          }
        }
        this.applyFilter();
        this.lastRefreshLabel = new Date().toLocaleString();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error?.error?.messages ||
          error?.error?.message ||
          error?.message ||
          "Erreur lors du chargement des residences.";
      },
    });
  }

  public createResidence(): void {
    this.router.navigate(['/nouvelle-residence']);
  }

  public onSearchChange(value: string): void {
    this.searchTerm = value ?? '';
    this.pageIndex = 0;
    this.applyFilter();
  }

  public setStatusFilter(value: ResidenceStatusFilter): void {
    this.statusFilter = value;
    this.pageIndex = 0;
    this.applyFilter();
  }

  public onCategoryFilterChange(value: string): void {
    this.categoryFilter = value ?? '';
    this.pageIndex = 0;
    this.applyFilter();
  }

  public onPriceMinChange(value: string | number | null | undefined): void {
    this.priceMin = this.toNumberOrNull(value);
    this.pageIndex = 0;
    this.applyFilter();
  }

  public onPriceMaxChange(value: string | number | null | undefined): void {
    this.priceMax = this.toNumberOrNull(value);
    this.pageIndex = 0;
    this.applyFilter();
  }

  public resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.categoryFilter = '';
    this.priceMin = null;
    this.priceMax = null;
    this.pageIndex = 0;
    this.applyFilter();
  }

  public onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedResidences();
  }

  public trackByResidence(index: number, residence: AppartementDto): number {
    return residence.id ?? index;
  }

  public getResidenceLabel(residence: AppartementDto): string {
    return (
      residence.nomBaptiserBienImmobilier ||
      residence.nomCompletBienImmobilier ||
      residence.codeAbrvBienImmobilier ||
      `Residence ${residence.id ?? ''}`
    ).trim();
  }

  public getResidenceDisplayName(residence: AppartementDto): string {
    const value = (residence.nomBaptiserBienImmobilier ?? '').trim();
    return value || '-';
  }

  public getResidenceCategory(residence: AppartementDto): string {
    return (
      residence.idCategorieChambre?.name ||
      residence.nameCategorie ||
      'Non definie'
    ).trim();
  }

  public formatPrice(price?: number | null): string {
    if (price === null || price === undefined) {
      return '-';
    }
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice)) {
      return '-';
    }
    return numericPrice.toLocaleString('fr-FR');
  }

  private applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    const category = (this.categoryFilter ?? '').trim();
    const minPrice = this.toNumberOrNull(this.priceMin);
    const maxPrice = this.toNumberOrNull(this.priceMax);

    this.filteredResidences = this.residences.filter((residence) => {
      if (this.statusFilter === 'available' && residence.occupied === true) {
        return false;
      }

      if (this.statusFilter === 'occupied' && residence.occupied !== true) {
        return false;
      }

      if (category) {
        const residenceCategory = (residence.idCategorieChambre?.name || residence.nameCategorie || '').trim();
        if (category === this.noCategoryValue) {
          if (residenceCategory) {
            return false;
          }
        } else if (residenceCategory !== category) {
          return false;
        }
      }

      const price = this.toNumberOrNull(residence.priceCategorie);
      if (minPrice !== null && (price === null || price < minPrice)) {
        return false;
      }

      if (maxPrice !== null && (price === null || price > maxPrice)) {
        return false;
      }

      if (term) {
        const haystack = [
          residence.codeAbrvBienImmobilier,
          residence.nomCompletBienImmobilier,
          residence.nomBaptiserBienImmobilier,
          residence.description,
          residence.nameCategorie,
          residence.idCategorieChambre?.name,
          residence.occupied === true ? 'occupe' : 'libre',
        ]
          .filter((value) => !!value)
          .join(' ')
          .toLowerCase();

        return haystack.includes(term);
      }

      return true;
    });

    this.updatePagedResidences();
  }

  private updatePagedResidences(): void {
    if (!this.filteredResidences.length) {
      this.pagedResidences = [];
      this.pageIndex = 0;
      return;
    }

    const safePageSize = Math.max(Number(this.pageSize) || 10, 1);
    const maxPageIndex = Math.max(Math.ceil(this.filteredResidences.length / safePageSize) - 1, 0);
    this.pageIndex = Math.min(Math.max(Number(this.pageIndex) || 0, 0), maxPageIndex);
    this.pageSize = safePageSize;

    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedResidences = this.filteredResidences.slice(start, end);
  }

  private buildCategoryOptions(residences: AppartementDto[]): string[] {
    const set = new Set<string>();

    for (const residence of residences) {
      const value = (residence.idCategorieChambre?.name || residence.nameCategorie || '').trim();
      if (value) {
        set.add(value);
      }
    }

    return Array.from(set).sort((left, right) =>
      left.localeCompare(right, 'fr', { sensitivity: 'base' })
    );
  }

  private toNumberOrNull(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  }
}
