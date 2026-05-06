import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { UserService } from 'src/app/services/user/user.service';
import { ApiService } from 'src/gs-api/src/services';
import { AppelLoyerEncaissDto, UtilisateurRequestDto } from 'src/gs-api/src/models';

@Component({
  standalone: false,
  selector: 'app-page-compte-agence',
  templateUrl: './page-compte-agence.component.html',
  styleUrls: ['./page-compte-agence.component.css'],
})
export class PageCompteAgenceComponent implements OnInit, OnDestroy {
  public user?: UtilisateurRequestDto;
  public allReglements: AppelLoyerEncaissDto[] = [];
  public filteredReglements: AppelLoyerEncaissDto[] = [];
  public searchTerm = '';
  public isLoading = false;
  public errorMessage = '';
  public dateDebut = '2020-01-01';
  public dateFin = this.toInputDate(new Date());
  public montantEncaisse = 0;
  public montantLoyer = 0;

  public page = 1;
  public pageSize = 10;
  public readonly pageSizeOptions = [5, 10, 20, 50];

  private subscription?: Subscription;

  constructor(
    private readonly apiService: ApiService,
    private readonly userService: UserService
  ) {}

  public ngOnInit(): void {
    this.user = this.getCurrentUser();
    this.loadCompteAgence();
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public get totalReglements(): number {
    return this.allReglements.length;
  }

  public get totalSolde(): number {
    return Math.max(this.montantLoyer - this.montantEncaisse, 0);
  }

  public get tauxRecouvrement(): number {
    return this.montantLoyer > 0
      ? Math.min(Math.round((this.montantEncaisse / this.montantLoyer) * 100), 100)
      : 0;
  }

  public get moyenneEncaisse(): number {
    return this.totalReglements > 0
      ? Math.round(this.montantEncaisse / this.totalReglements)
      : 0;
  }

  public get derniereOperation(): AppelLoyerEncaissDto | null {
    return this.allReglements[0] ?? null;
  }

  public get currentAgenceId(): number {
    return this.getAgenceId();
  }

  public get totalPages(): number {
    return Math.max(Math.ceil(this.filteredReglements.length / this.pageSize), 1);
  }

  public get pagedReglements(): AppelLoyerEncaissDto[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredReglements.slice(start, start + this.pageSize);
  }

  public get pageStart(): number {
    return this.filteredReglements.length === 0
      ? 0
      : (this.page - 1) * this.pageSize + 1;
  }

  public get pageEnd(): number {
    return Math.min(this.page * this.pageSize, this.filteredReglements.length);
  }

  public loadCompteAgence(): void {
    const idAgence = this.getAgenceId();
    if (!idAgence) {
      this.errorMessage = "Impossible de charger le compte agence: agence utilisateur introuvable.";
      this.allReglements = [];
      this.filteredReglements = [];
      this.montantEncaisse = 0;
      this.montantLoyer = 0;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.subscription?.unsubscribe();
    const params = {
      idAgence,
      datedebut: this.toApiDate(this.dateDebut),
      datefin: this.toApiDate(this.dateFin),
    };

    this.subscription = forkJoin({
      reglements: this.apiService.listeEncaisseLoyerEntreDeuxDate(params),
      montantEncaisse: this.apiService.sommeEncaissementParAgenceEtParPeriode(params),
      montantLoyer: this.apiService.sommeLoyerParAgenceEtParPeriode(params),
    }).subscribe({
      next: ({ reglements, montantEncaisse, montantLoyer }) => {
        this.allReglements = this.sortReglements(reglements ?? []);
        this.montantEncaisse = Number(montantEncaisse ?? 0);
        this.montantLoyer = Number(montantLoyer ?? 0);
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.allReglements = [];
        this.filteredReglements = [];
        this.montantEncaisse = 0;
        this.montantLoyer = 0;
        this.isLoading = false;
        this.errorMessage = "Impossible de charger le compte agence.";
      },
    });
  }

  public onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.page = 1;
    this.applyFilter();
  }

  public onPageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.pageSize = Number.isFinite(value) && value > 0 ? value : 10;
    this.page = 1;
  }

  public previousPage(): void {
    this.page = Math.max(this.page - 1, 1);
  }

  public nextPage(): void {
    this.page = Math.min(this.page + 1, this.totalPages);
  }

  public printPage(): void {
    window.print();
  }

  public exportToExcel(): void {
    const rows = this.filteredReglements.map((row) => ({
      ID: row.id ?? '',
      Periode: row.periodeAppelLoyer ?? '',
      Locataire: this.getLocataireName(row),
      Bien: row.bienImmobilierFullName ?? row.abrvBienimmobilier ?? '',
      Commune: row.commune ?? '',
      'Montant loyer (FCFA)': Number(row.montantLoyerBailLPeriode ?? 0),
      'Montant paye (FCFA)': Number(row.montantPaye ?? 0),
      'Solde (FCFA)': Number(row.soldeAppelLoyer ?? 0),
      'Date encaissement': row.dateEncaissement ?? '',
      'Type paiement': row.typePaiement ?? '',
      Statut: row.statusAppelLoyer ?? '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Compte agence');
    const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    saveAs(
      new Blob([buffer], { type: 'application/octet-stream' }),
      'Compte_agence.xlsx'
    );
  }

  public formatCurrency(value: number | null | undefined): string {
    const amount = Number(value ?? 0);
    return `${amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} FCFA`;
  }

  public trackByReglement(index: number, row: AppelLoyerEncaissDto): number {
    return row.id ?? index;
  }

  public getLocataireName(row: AppelLoyerEncaissDto): string {
    return [row.nomLocataire, row.prenomLocataire].filter(Boolean).join(' ') || '-';
  }

  public onDateChange(): void {
    this.page = 1;
    this.loadCompteAgence();
  }

  private applyFilter(): void {
    const term = this.searchTerm;
    if (!term) {
      this.filteredReglements = [...this.allReglements];
    } else {
      this.filteredReglements = this.allReglements.filter((row) =>
        [
          row.id,
          row.periodeAppelLoyer,
          row.statusAppelLoyer,
          row.dateEncaissement,
          this.getLocataireName(row),
          row.bienImmobilierFullName,
          row.abrvBienimmobilier,
          row.commune,
          row.typePaiement,
          row.montantLoyerBailLPeriode,
          row.montantPaye,
          row.soldeAppelLoyer,
        ]
          .join(' ')
          .toLowerCase()
          .includes(term)
      );
    }

    this.page = Math.min(this.page, this.totalPages);
  }

  private sortReglements(rows: AppelLoyerEncaissDto[]): AppelLoyerEncaissDto[] {
    return [...rows].sort((left, right) =>
      String(right.dateEncaissement ?? right.dateDebutMoisAppelLoyer ?? '').localeCompare(
        String(left.dateEncaissement ?? left.dateDebutMoisAppelLoyer ?? '')
      )
    );
  }

  private getCurrentUser(): UtilisateurRequestDto | undefined {
    try {
      const user = this.userService.getUserFromLocalCache();
      return user ?? undefined;
    } catch (error) {
      return undefined;
    }
  }

  private toInputDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private toApiDate(inputDate: string): string {
    const [year, month, day] = inputDate.split('-');
    return `${day}-${month}-${year}`;
  }

  private getAgenceId(): number {
    return Number(this.user?.idAgence ?? this.user?.agenceDto ?? 0);
  }
}
