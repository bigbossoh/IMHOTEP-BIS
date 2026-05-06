import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { UserService } from 'src/app/services/user/user.service';
import { ApiService } from 'src/gs-api/src/services';
import { AppelLoyerEncaissDto, UtilisateurRequestDto } from 'src/gs-api/src/models';

interface GrandCompteBalanceRow {
  key: string;
  idLocataire?: number;
  idBailLocation?: number;
  locataire: string;
  bail: string;
  bien: string;
  commune: string;
  loyersAppeles: number;
  totalEncaisse: number;
  solde: number;
  nbOperations: number;
  derniereOperation?: string;
  statut: 'Solde' | 'Partiel' | 'Impaye';
}

@Component({
  standalone: false,
  selector: 'app-page-grand-compte',
  templateUrl: './page-grand-compte.component.html',
  styleUrls: ['./page-grand-compte.component.css'],
})
export class PageGrandCompteComponent implements OnInit, OnDestroy {
  public user?: UtilisateurRequestDto;
  public operations: AppelLoyerEncaissDto[] = [];
  public balanceRows: GrandCompteBalanceRow[] = [];
  public filteredBalanceRows: GrandCompteBalanceRow[] = [];
  public filteredOperations: AppelLoyerEncaissDto[] = [];
  public activeView: 'balance' | 'operations' = 'balance';
  public searchTerm = '';
  public statusFilter: 'Tous' | 'Solde' | 'Partiel' | 'Impaye' = 'Tous';
  public isLoading = false;
  public errorMessage = '';
  public dateDebut = '2020-01-01';
  public dateFin = this.toInputDate(new Date());
  public montantEncaisse = 0;
  public montantLoyer = 0;

  public page = 1;
  public pageSize = 10;
  public readonly pageSizeOptions = [5, 10, 20, 50];
  public readonly statusOptions = ['Tous', 'Solde', 'Partiel', 'Impaye'] as const;

  private subscription?: Subscription;

  constructor(
    private readonly apiService: ApiService,
    private readonly userService: UserService
  ) {}

  public ngOnInit(): void {
    this.user = this.getCurrentUser();
    this.loadGrandCompte();
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public get currentAgenceId(): number {
    return this.getAgenceId();
  }

  public get totalSolde(): number {
    return Math.max(this.montantLoyer - this.montantEncaisse, 0);
  }

  public get tauxRecouvrement(): number {
    return this.montantLoyer > 0
      ? Math.min(Math.round((this.montantEncaisse / this.montantLoyer) * 100), 100)
      : 0;
  }

  public get comptesDebiteurs(): number {
    return this.balanceRows.filter((row) => row.solde > 0).length;
  }

  public get sourceLength(): number {
    return this.activeView === 'balance'
      ? this.filteredBalanceRows.length
      : this.filteredOperations.length;
  }

  public get totalPages(): number {
    return Math.max(Math.ceil(this.sourceLength / this.pageSize), 1);
  }

  public get pagedBalanceRows(): GrandCompteBalanceRow[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredBalanceRows.slice(start, start + this.pageSize);
  }

  public get pagedOperations(): AppelLoyerEncaissDto[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredOperations.slice(start, start + this.pageSize);
  }

  public get pageStart(): number {
    return this.sourceLength === 0 ? 0 : (this.page - 1) * this.pageSize + 1;
  }

  public get pageEnd(): number {
    return Math.min(this.page * this.pageSize, this.sourceLength);
  }

  public loadGrandCompte(): void {
    const idAgence = this.getAgenceId();
    if (!idAgence) {
      this.errorMessage = "Impossible de charger le grand compte: agence utilisateur introuvable.";
      this.resetData();
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
      operations: this.apiService.listeEncaisseLoyerEntreDeuxDate(params),
      montantEncaisse: this.apiService.sommeEncaissementParAgenceEtParPeriode(params),
      montantLoyer: this.apiService.sommeLoyerParAgenceEtParPeriode(params),
    }).subscribe({
      next: ({ operations, montantEncaisse, montantLoyer }) => {
        this.operations = this.sortOperations(operations ?? []);
        this.balanceRows = this.buildBalanceRows(this.operations);
        this.montantEncaisse = Number(montantEncaisse ?? 0);
        this.montantLoyer = Number(montantLoyer ?? 0);
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.resetData();
        this.isLoading = false;
        this.errorMessage = 'Impossible de charger le grand compte.';
      },
    });
  }

  public onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.page = 1;
    this.applyFilters();
  }

  public onStatusChange(event: Event): void {
    this.statusFilter = (event.target as HTMLSelectElement).value as typeof this.statusFilter;
    this.page = 1;
    this.applyFilters();
  }

  public onPageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.pageSize = Number.isFinite(value) && value > 0 ? value : 10;
    this.page = 1;
  }

  public setView(view: 'balance' | 'operations'): void {
    this.activeView = view;
    this.page = 1;
  }

  public previousPage(): void {
    this.page = Math.max(this.page - 1, 1);
  }

  public nextPage(): void {
    this.page = Math.min(this.page + 1, this.totalPages);
  }

  public onDateChange(): void {
    this.page = 1;
    this.loadGrandCompte();
  }

  public printPage(): void {
    window.print();
  }

  public exportToExcel(): void {
    const workbook = XLSX.utils.book_new();
    const balanceSheet = XLSX.utils.json_to_sheet(
      this.filteredBalanceRows.map((row) => ({
        Locataire: row.locataire,
        Bail: row.bail,
        Bien: row.bien,
        Commune: row.commune,
        'Loyers appeles (FCFA)': row.loyersAppeles,
        'Total encaisse (FCFA)': row.totalEncaisse,
        'Solde (FCFA)': row.solde,
        Operations: row.nbOperations,
        'Derniere operation': row.derniereOperation ?? '',
        Statut: row.statut,
      }))
    );
    const operationsSheet = XLSX.utils.json_to_sheet(
      this.filteredOperations.map((row) => ({
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
      }))
    );

    XLSX.utils.book_append_sheet(workbook, balanceSheet, 'Balance');
    XLSX.utils.book_append_sheet(workbook, operationsSheet, 'Operations');
    const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    saveAs(
      new Blob([buffer], { type: 'application/octet-stream' }),
      'Grand_compte.xlsx'
    );
  }

  public formatCurrency(value: number | null | undefined): string {
    const amount = Number(value ?? 0);
    return `${amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} FCFA`;
  }

  public getLocataireName(row: AppelLoyerEncaissDto): string {
    return [row.nomLocataire, row.prenomLocataire].filter(Boolean).join(' ') || '-';
  }

  public getOperationStatus(row: AppelLoyerEncaissDto): string {
    if (row.statusAppelLoyer) {
      return row.statusAppelLoyer;
    }
    return row.solderAppelLoyer ? 'Solde' : Number(row.montantPaye ?? 0) > 0 ? 'Partiel' : 'Impaye';
  }

  public trackByBalance(index: number, row: GrandCompteBalanceRow): string {
    return row.key || String(index);
  }

  public trackByOperation(index: number, row: AppelLoyerEncaissDto): number {
    return row.id ?? index;
  }

  private buildBalanceRows(rows: AppelLoyerEncaissDto[]): GrandCompteBalanceRow[] {
    const grouped = new Map<string, GrandCompteBalanceRow>();

    rows.forEach((row) => {
      const key = String(row.idBailLocation ?? row.idLocataire ?? row.abrvCodeBail ?? row.id ?? '');
      const current = grouped.get(key) ?? {
        key,
        idLocataire: row.idLocataire,
        idBailLocation: row.idBailLocation,
        locataire: this.getLocataireName(row),
        bail: row.abrvCodeBail || (row.idBailLocation ? `Bail #${row.idBailLocation}` : '-'),
        bien: row.bienImmobilierFullName || row.abrvBienimmobilier || '-',
        commune: row.commune || '-',
        loyersAppeles: 0,
        totalEncaisse: 0,
        solde: 0,
        nbOperations: 0,
        derniereOperation: row.dateEncaissement,
        statut: 'Impaye' as const,
      };

      current.loyersAppeles += Number(row.montantLoyerBailLPeriode ?? 0);
      current.totalEncaisse += Number(row.montantPaye ?? 0);
      current.solde += Number(row.soldeAppelLoyer ?? 0);
      current.nbOperations += 1;
      current.derniereOperation = this.pickLatestDate(
        current.derniereOperation,
        row.dateEncaissement ?? row.dateDebutMoisAppelLoyer
      );
      current.statut =
        current.solde <= 0 ? 'Solde' : current.totalEncaisse > 0 ? 'Partiel' : 'Impaye';

      grouped.set(key, current);
    });

    return Array.from(grouped.values()).sort((left, right) => {
      if (right.solde !== left.solde) {
        return right.solde - left.solde;
      }
      return left.locataire.localeCompare(right.locataire);
    });
  }

  private applyFilters(): void {
    const term = this.searchTerm;
    this.filteredBalanceRows = this.balanceRows.filter((row) => {
      const matchesStatus = this.statusFilter === 'Tous' || row.statut === this.statusFilter;
      const matchesSearch =
        !term ||
        [
          row.locataire,
          row.bail,
          row.bien,
          row.commune,
          row.loyersAppeles,
          row.totalEncaisse,
          row.solde,
          row.statut,
        ]
          .join(' ')
          .toLowerCase()
          .includes(term);
      return matchesStatus && matchesSearch;
    });

    this.filteredOperations = this.operations.filter((row) => {
      const status = this.normalizeStatus(this.getOperationStatus(row));
      const matchesStatus = this.statusFilter === 'Tous' || status === this.statusFilter;
      const matchesSearch =
        !term ||
        [
          row.id,
          row.periodeAppelLoyer,
          this.getLocataireName(row),
          row.bienImmobilierFullName,
          row.abrvBienimmobilier,
          row.commune,
          row.typePaiement,
          row.montantLoyerBailLPeriode,
          row.montantPaye,
          row.soldeAppelLoyer,
          row.statusAppelLoyer,
        ]
          .join(' ')
          .toLowerCase()
          .includes(term);
      return matchesStatus && matchesSearch;
    });

    this.page = Math.min(this.page, this.totalPages);
  }

  private normalizeStatus(status: string): GrandCompteBalanceRow['statut'] {
    const normalized = status.toLowerCase();
    if (normalized.includes('sold') || normalized === 'solde') {
      return 'Solde';
    }
    if (normalized.includes('part')) {
      return 'Partiel';
    }
    return 'Impaye';
  }

  private sortOperations(rows: AppelLoyerEncaissDto[]): AppelLoyerEncaissDto[] {
    return [...rows].sort((left, right) =>
      String(right.dateEncaissement ?? right.dateDebutMoisAppelLoyer ?? '').localeCompare(
        String(left.dateEncaissement ?? left.dateDebutMoisAppelLoyer ?? '')
      )
    );
  }

  private pickLatestDate(current?: string, candidate?: string): string | undefined {
    if (!candidate) {
      return current;
    }
    if (!current) {
      return candidate;
    }
    return String(candidate).localeCompare(String(current)) > 0 ? candidate : current;
  }

  private resetData(): void {
    this.operations = [];
    this.balanceRows = [];
    this.filteredBalanceRows = [];
    this.filteredOperations = [];
    this.montantEncaisse = 0;
    this.montantLoyer = 0;
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
