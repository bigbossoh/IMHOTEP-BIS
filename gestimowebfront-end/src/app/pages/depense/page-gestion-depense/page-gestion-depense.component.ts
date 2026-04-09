import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DepenseService } from 'src/app/services/depense/depense.service';
import { UserService } from 'src/app/services/user/user.service';
import {
  ExpenseActionPayload,
  ExpenseRecord,
  ExpenseWorkflowConfig,
} from 'src/app/services/depense/depense.models';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';
import {
  NouvelleDepenseDialogData,
  PageNouvelleDepenseComponent,
} from '../page-nouvelle-depense/page-nouvelle-depense.component';

@Component({
  standalone: false,
  selector: 'app-page-gestion-depense',
  templateUrl: './page-gestion-depense.component.html',
  styleUrls: ['./page-gestion-depense.component.css'],
})
export class PageGestionDepenseComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  user?: UtilisateurRequestDto;
  config?: ExpenseWorkflowConfig;

  dataSource = new MatTableDataSource<ExpenseRecord>([]);
  displayedColumns = [
    'referenceDepense', 'dateEncaissement', 'libelleDepense',
    'categorieDepense', 'montantDepense', 'modePaiement',
    'workflowStatus', 'actions',
  ];
  pageSizeOptions = [10, 25, 50, 100];

  loading = false;
  statusFilter = 'ALL';
  searchTerm = '';

  // Action dialog state
  actionTarget?: ExpenseRecord;
  showActionPanel = false;
  actionType: 'approve' | 'reject' | 'cancel' | null = null;
  actionForm!: FormGroup;
  actionLoading = false;

  // Detail panel
  detailExpense?: ExpenseRecord;
  showDetail = false;

  readonly ALL_STATUSES: Array<{ value: string; label: string }> = [
    { value: 'ALL', label: 'Tous les statuts' },
    { value: 'BROUILLON', label: 'Brouillon' },
    { value: 'SOUMISE', label: 'Soumise' },
    { value: 'EN_ATTENTE_VALIDATION_NIVEAU_1', label: 'Attente validation N.1' },
    { value: 'EN_ATTENTE_VALIDATION_NIVEAU_2', label: 'Attente validation N.2' },
    { value: 'EN_ATTENTE_VALIDATION_NIVEAU_3', label: 'Attente validation N.3' },
    { value: 'VALIDEE', label: 'Validée' },
    { value: 'REJETEE', label: 'Rejetée' },
    { value: 'ANNULEE', label: 'Annulée' },
  ];

  constructor(
    private depenseService: DepenseService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.actionForm = this.fb.group({ commentaire: [''] });
    this.loadConfig();
    this.loadExpenses();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private loadConfig(): void {
    if (!this.user?.idAgence) return;
    this.depenseService.getWorkflowConfig(this.user.idAgence).subscribe({
      next: (cfg) => (this.config = cfg),
    });
  }

  loadExpenses(): void {
    if (!this.user?.idAgence) return;
    this.loading = true;
    this.depenseService.getExpenses(this.user.idAgence).subscribe({
      next: (expenses) => {
        this.loading = false;
        this.dataSource.data = expenses ?? [];
        this.applyFilters();
      },
      error: () => {
        this.loading = false;
        this.showToast('Erreur lors du chargement des dépenses.', 'error');
      },
    });
  }

  applyFilters(): void {
    this.dataSource.filterPredicate = (row: ExpenseRecord, filter: string) => {
      const parsed = JSON.parse(filter);
      const matchStatus =
        parsed.status === 'ALL' || row.workflowStatus === parsed.status;
      const term = (parsed.term ?? '').toLowerCase();
      const matchSearch =
        !term ||
        (row.referenceDepense ?? '').toLowerCase().includes(term) ||
        (row.libelleDepense ?? '').toLowerCase().includes(term) ||
        (row.categorieDepense ?? '').toLowerCase().includes(term) ||
        (row.fournisseurNom ?? '').toLowerCase().includes(term);
      return matchStatus && matchSearch;
    };
    this.dataSource.filter = JSON.stringify({
      status: this.statusFilter,
      term: this.searchTerm,
    });
  }

  onSearch(value: string): void {
    this.searchTerm = value;
    this.applyFilters();
  }

  onStatusFilter(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  openNewExpenseDialog(expenseToEdit?: ExpenseRecord): void {
    const data: NouvelleDepenseDialogData = { expenseToEdit, config: this.config };
    const ref = this.dialog.open(PageNouvelleDepenseComponent, {
      width: '900px',
      maxWidth: '96vw',
      maxHeight: '90vh',
      data,
      panelClass: 'depense-dialog',
    });

    ref.afterClosed().subscribe((result) => {
      if (result?.saved) {
        this.loadExpenses();
      }
    });
  }

  openDetail(expense: ExpenseRecord): void {
    this.detailExpense = expense;
    this.showDetail = true;
  }

  closeDetail(): void {
    this.showDetail = false;
    this.detailExpense = undefined;
  }

  openActionPanel(expense: ExpenseRecord, type: 'approve' | 'reject' | 'cancel'): void {
    this.actionTarget = expense;
    this.actionType = type;
    this.actionForm.reset({ commentaire: '' });
    this.showActionPanel = true;
  }

  closeActionPanel(): void {
    this.showActionPanel = false;
    this.actionTarget = undefined;
    this.actionType = null;
  }

  confirmAction(): void {
    if (!this.actionTarget?.id || !this.actionType) return;
    const payload: ExpenseActionPayload = {
      utilisateurId: this.user?.id ?? undefined,
      utilisateurNom: `${this.user?.nom ?? ''} ${this.user?.prenom ?? ''}`.trim(),
      utilisateurRole: this.user?.roleRequestDto?.roleName ?? '',
      commentaire: this.actionForm.value.commentaire ?? '',
    };
    this.actionLoading = true;
    const id = this.actionTarget.id;
    const call =
      this.actionType === 'approve'
        ? this.depenseService.approveExpense(id, payload)
        : this.actionType === 'reject'
        ? this.depenseService.rejectExpense(id, payload)
        : this.depenseService.cancelExpense(id, payload);

    call.subscribe({
      next: () => {
        this.actionLoading = false;
        this.closeActionPanel();
        this.showToast(this.getActionSuccessMessage(), 'success');
        this.loadExpenses();
      },
      error: () => {
        this.actionLoading = false;
        this.showToast("Erreur lors de l'action.", 'error');
      },
    });
  }

  downloadAttachment(expense: ExpenseRecord): void {
    if (!expense.id) return;
    this.depenseService.downloadAttachment(expense.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = expense.justificatifNom ?? 'justificatif';
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.showToast('Impossible de télécharger le justificatif.', 'error'),
    });
  }

  canApprove(expense: ExpenseRecord): boolean {
    return (
      expense.workflowStatus === 'EN_ATTENTE_VALIDATION_NIVEAU_1' ||
      expense.workflowStatus === 'EN_ATTENTE_VALIDATION_NIVEAU_2' ||
      expense.workflowStatus === 'EN_ATTENTE_VALIDATION_NIVEAU_3'
    );
  }

  canReject(expense: ExpenseRecord): boolean {
    return this.canApprove(expense);
  }

  canCancel(expense: ExpenseRecord): boolean {
    return (
      expense.workflowStatus === 'BROUILLON' ||
      expense.workflowStatus === 'SOUMISE' ||
      this.canApprove(expense)
    );
  }

  canEdit(expense: ExpenseRecord): boolean {
    return expense.workflowStatus === 'BROUILLON';
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'BROUILLON': return 'badge badge--draft';
      case 'SOUMISE': return 'badge badge--submitted';
      case 'EN_ATTENTE_VALIDATION_NIVEAU_1':
      case 'EN_ATTENTE_VALIDATION_NIVEAU_2':
      case 'EN_ATTENTE_VALIDATION_NIVEAU_3': return 'badge badge--pending';
      case 'VALIDEE': return 'badge badge--approved';
      case 'REJETEE': return 'badge badge--rejected';
      case 'ANNULEE': return 'badge badge--cancelled';
      default: return 'badge badge--draft';
    }
  }

  getStatusLabel(status: string | undefined): string {
    const map: Record<string, string> = {
      BROUILLON: 'Brouillon',
      SOUMISE: 'Soumise',
      EN_ATTENTE_VALIDATION_NIVEAU_1: 'Attente N.1',
      EN_ATTENTE_VALIDATION_NIVEAU_2: 'Attente N.2',
      EN_ATTENTE_VALIDATION_NIVEAU_3: 'Attente N.3',
      VALIDEE: 'Validée',
      REJETEE: 'Rejetée',
      ANNULEE: 'Annulée',
    };
    return map[status ?? ''] ?? (status ?? '-');
  }

  getWorkflowProgressPercent(expense: ExpenseRecord): number {
    const max = expense.maxValidationLevel ?? 1;
    const current = expense.currentValidationLevel ?? 0;
    if (expense.workflowStatus === 'VALIDEE') return 100;
    if (expense.workflowStatus === 'REJETEE' || expense.workflowStatus === 'ANNULEE') return 0;
    return max > 0 ? Math.round((current / max) * 100) : 0;
  }

  getHistoryActionLabel(action: string): string {
    const map: Record<string, string> = {
      BROUILLON: 'Brouillon créé',
      SOUMIS: 'Soumis pour validation',
      APPROUVE: 'Approuvé',
      REJETE: 'Rejeté',
      ANNULE: 'Annulé',
    };
    return map[action] ?? action;
  }

  getHistoryActionClass(action: string): string {
    if (action === 'APPROUVE') return 'timeline-dot--approved';
    if (action === 'REJETE') return 'timeline-dot--rejected';
    if (action === 'ANNULE') return 'timeline-dot--cancelled';
    return 'timeline-dot--default';
  }

  getTotalMontant(): number {
    return (this.dataSource.filteredData ?? []).reduce(
      (sum, e) => sum + (e.montantDepense ?? 0), 0
    );
  }

  getTotalValidees(): number {
    return (this.dataSource.filteredData ?? []).filter(
      (e) => e.workflowStatus === 'VALIDEE'
    ).length;
  }

  getTotalEnAttente(): number {
    return (this.dataSource.filteredData ?? []).filter(
      (e) =>
        e.workflowStatus?.startsWith('EN_ATTENTE_VALIDATION') ||
        e.workflowStatus === 'SOUMISE'
    ).length;
  }

  get actionTitle(): string {
    if (this.actionType === 'approve') return 'Approuver la dépense';
    if (this.actionType === 'reject') return 'Rejeter la dépense';
    return 'Annuler la dépense';
  }

  get actionButtonLabel(): string {
    if (this.actionType === 'approve') return 'Approuver';
    if (this.actionType === 'reject') return 'Rejeter';
    return 'Annuler la dépense';
  }

  get actionButtonColor(): string {
    if (this.actionType === 'approve') return 'primary';
    return 'warn';
  }

  private getActionSuccessMessage(): string {
    if (this.actionType === 'approve') return 'Dépense approuvée avec succès.';
    if (this.actionType === 'reject') return 'Dépense rejetée.';
    return 'Dépense annulée.';
  }

  private showToast(message: string, type: 'success' | 'error' | 'warn'): void {
    const panelClass = type === 'success' ? 'snack-success' : type === 'error' ? 'snack-error' : 'snack-warn';
    this.snackBar.open(message, 'Fermer', { duration: 4000, panelClass: [panelClass] });
  }
}
