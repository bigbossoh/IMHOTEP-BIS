import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ExpenseRecord } from 'src/app/services/depense/depense.models';
import { DepenseService } from 'src/app/services/depense/depense.service';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';

type WorkflowFilter =
  | 'ALL'
  | 'BROUILLON'
  | 'SOUMISE'
  | 'EN_ATTENTE_VALIDATION_NIVEAU_1'
  | 'EN_ATTENTE_VALIDATION_NIVEAU_2'
  | 'EN_ATTENTE_VALIDATION_NIVEAU_3'
  | 'VALIDEE'
  | 'REJETEE'
  | 'ANNULEE';

@Component({
  standalone: false,
  selector: 'app-page-consultation-depense',
  templateUrl: './page-consultation-depense.component.html',
  styleUrls: ['./page-consultation-depense.component.css'],
})
export class PageConsultationDepenseComponent implements OnInit, OnDestroy {
  user?: UtilisateurRequestDto;
  expenses: ExpenseRecord[] = [];
  selectedExpense: ExpenseRecord | null = null;

  loading = false;

  // Filtres
  searchTerm = '';
  workflowFilter: WorkflowFilter = 'ALL';
  categoryFilter = '';
  dateDebut = '';
  dateFin = '';

  // Pagination
  currentPage = 1;
  pageSize = 15;
  readonly pageSizeOptions = [10, 15, 25, 50, 100];

  readonly workflowFilterOptions: Array<{ value: WorkflowFilter; label: string }> = [
    { value: 'ALL', label: 'Tous les statuts' },
    { value: 'BROUILLON', label: 'Brouillon' },
    { value: 'SOUMISE', label: 'Soumise' },
    { value: 'EN_ATTENTE_VALIDATION_NIVEAU_1', label: 'En attente niveau 1' },
    { value: 'EN_ATTENTE_VALIDATION_NIVEAU_2', label: 'En attente niveau 2' },
    { value: 'EN_ATTENTE_VALIDATION_NIVEAU_3', label: 'En attente niveau 3' },
    { value: 'VALIDEE', label: 'Validée' },
    { value: 'REJETEE', label: 'Rejetée' },
    { value: 'ANNULEE', label: 'Annulée' },
  ];

  private readonly destroy$ = new Subject<void>();

  // ── KPI ──────────────────────────────────────────────────────────────────

  get totalCount(): number {
    return this.expenses.length;
  }

  get totalMontant(): number {
    return this.expenses.reduce((s, e) => s + Number(e.montantDepense ?? 0), 0);
  }

  get validatedCount(): number {
    return this.expenses.filter((e) => e.workflowStatus === 'VALIDEE').length;
  }

  get pendingCount(): number {
    return this.expenses.filter(
      (e) => (e.workflowStatus || '').startsWith('EN_ATTENTE_VALIDATION_NIVEAU_')
    ).length;
  }

  // ── Catégories uniques pour filtre ───────────────────────────────────────

  get availableCategories(): string[] {
    return [
      ...new Set(this.expenses.map((e) => e.categorieDepense || '').filter(Boolean)),
    ].sort();
  }

  // ── Filtrage ─────────────────────────────────────────────────────────────

  get filteredExpenses(): ExpenseRecord[] {
    const q = this.searchTerm.trim().toLowerCase();
    const debut = this.dateDebut ? new Date(this.dateDebut).getTime() : null;
    const fin = this.dateFin ? new Date(this.dateFin).getTime() + 86399999 : null;

    return this.expenses.filter((e) => {
      if (
        this.workflowFilter !== 'ALL' &&
        (e.workflowStatus || 'BROUILLON') !== this.workflowFilter
      ) {
        return false;
      }
      if (this.categoryFilter && e.categorieDepense !== this.categoryFilter) {
        return false;
      }
      if (debut !== null && e.dateEncaissement) {
        if (new Date(e.dateEncaissement).getTime() < debut) return false;
      }
      if (fin !== null && e.dateEncaissement) {
        if (new Date(e.dateEncaissement).getTime() > fin) return false;
      }
      if (q) {
        const hay = [
          e.referenceDepense,
          e.categorieDepense,
          e.libelleDepense,
          e.descriptionDepense,
          e.fournisseurNom,
          e.bienImmobilierLibelle,
          e.appartementLocalLibelle,
          e.demandeurNom,
          e.modePaiement,
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  get filteredTotalMontant(): number {
    return this.filteredExpenses.reduce((s, e) => s + Number(e.montantDepense ?? 0), 0);
  }

  // ── Pagination ────────────────────────────────────────────────────────────

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredExpenses.length / this.pageSize));
  }

  get paginatedExpenses(): ExpenseRecord[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredExpenses.slice(start, start + this.pageSize);
  }

  get paginationStart(): number {
    return this.filteredExpenses.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredExpenses.length);
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    const range: number[] = [1];
    const start = Math.max(2, current - delta);
    const end = Math.min(total - 1, current + delta);
    if (start > 2) range.push(-1);
    for (let i = start; i <= end; i++) range.push(i);
    if (end < total - 1) range.push(-1);
    if (total > 1) range.push(total);
    return range;
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────

  constructor(
    private readonly depenseService: DepenseService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.loadExpenses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  loadExpenses(): void {
    if (!this.user?.idAgence) return;
    this.loading = true;
    this.depenseService
      .getExpenses(this.user.idAgence)
      .pipe(
        finalize(() => (this.loading = false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {
          this.expenses = [...data].sort(
            (a, b) => Number(b.id ?? 0) - Number(a.id ?? 0)
          );
          this.currentPage = 1;
        },
        error: () => {},
      });
  }

  selectExpense(expense: ExpenseRecord): void {
    this.selectedExpense = this.selectedExpense?.id === expense.id ? null : expense;
  }

  closeDetail(): void {
    this.selectedExpense = null;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.workflowFilter = 'ALL';
    this.categoryFilter = '';
    this.dateDebut = '';
    this.dateFin = '';
    this.currentPage = 1;
  }

  onFilterChange(): void {
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    this.currentPage = Math.max(1, Math.min(page, this.totalPages));
  }

  // ── Export Excel ──────────────────────────────────────────────────────────

  exportToExcel(): void {
    const rows = this.filteredExpenses.map((e) => ({
      Référence: e.referenceDepense || '',
      Date: this.fmtDate(e.dateEncaissement),
      Catégorie: e.categorieDepense || '',
      Libellé: e.libelleDepense || '',
      Description: e.descriptionDepense || '',
      'Bien immobilier': e.bienImmobilierLibelle || '',
      'Local / Appartement': e.appartementLocalLibelle || '',
      Fournisseur: e.fournisseurNom || '',
      'Montant (FCFA)': Number(e.montantDepense ?? 0),
      'Mode paiement': e.modePaiement || '',
      'Statut workflow': this.workflowLabel(e.workflowStatus),
      'Statut paiement': this.paymentLabel(e.statutPaiement),
      Demandeur: e.demandeurNom || '',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dépenses');
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    const today = formatDate(new Date(), 'yyyy-MM-dd', 'fr');
    saveAs(
      new Blob([buf], { type: 'application/octet-stream' }),
      `Consultation_depenses_${today}.xlsx`
    );
  }

  // ── Helpers affichage ─────────────────────────────────────────────────────

  workflowLabel(status: string | null | undefined): string {
    const map: Record<string, string> = {
      BROUILLON: 'Brouillon',
      SOUMISE: 'Soumise',
      EN_ATTENTE_VALIDATION_NIVEAU_1: 'Attente niv. 1',
      EN_ATTENTE_VALIDATION_NIVEAU_2: 'Attente niv. 2',
      EN_ATTENTE_VALIDATION_NIVEAU_3: 'Attente niv. 3',
      VALIDEE: 'Validée',
      REJETEE: 'Rejetée',
      ANNULEE: 'Annulée',
    };
    return map[status || ''] ?? 'Brouillon';
  }

  workflowTone(status: string | null | undefined): string {
    switch (status) {
      case 'VALIDEE':
        return 'success';
      case 'REJETEE':
      case 'ANNULEE':
        return 'danger';
      case 'BROUILLON':
        return 'muted';
      case 'SOUMISE':
        return 'info';
      default:
        return 'warning';
    }
  }

  paymentLabel(status: string | null | undefined): string {
    const map: Record<string, string> = {
      PAYEE: 'Payée',
      EN_ATTENTE: 'En attente',
      A_PAYER: 'À payer',
    };
    return map[status || ''] ?? (status || '–');
  }

  paymentTone(status: string | null | undefined): string {
    switch (status) {
      case 'PAYEE':
        return 'success';
      case 'A_PAYER':
        return 'warning';
      default:
        return 'muted';
    }
  }

  fmtDate(value: string | null | undefined): string {
    if (!value) return '–';
    try {
      return formatDate(value, 'dd/MM/yyyy', 'fr-FR');
    } catch {
      return value;
    }
  }

  fmtDateTime(value: string | null | undefined): string {
    if (!value) return '–';
    try {
      return formatDate(value, 'dd/MM/yyyy HH:mm', 'fr-FR');
    } catch {
      return value;
    }
  }

  fmtCurrency(value: number | string | null | undefined): string {
    const n = Number(value ?? 0);
    return (
      n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' FCFA'
    );
  }

  localLabel(e: ExpenseRecord): string {
    return e.appartementLocalLibelle || e.bienImmobilierLibelle || '–';
  }

  hasActiveFilters(): boolean {
    return !!(
      this.searchTerm ||
      this.workflowFilter !== 'ALL' ||
      this.categoryFilter ||
      this.dateDebut ||
      this.dateFin
    );
  }
}
