import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, forkJoin, of } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import {
  ExpenseActionPayload,
  ExpenseFormPayload,
  ExpenseRecord,
  ExpenseSupplierSuggestion,
  ExpenseWorkflowConfig,
} from 'src/app/services/depense/depense.models';
import { AgenceService } from 'src/app/services/Agence/agence.service';
import { DepenseService } from 'src/app/services/depense/depense.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';
import {
  AgenceResponseDto,
  AppartementDto,
  EtageDto,
  ImmeubleDto,
  MagasinDto,
  SiteResponseDto,
  UtilisateurAfficheDto,
  UtilisateurRequestDto,
  VillaDto,
} from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';

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

type AttachmentPreviewKind = 'image' | 'document' | null;

interface BienImmobilierItem {
  key: string;
  id: number;
  label: string;
  code: string;
  type: 'Appartement' | 'Villa' | 'Local commercial' | 'Immeuble';
  idSite: number;
  idChapitre: number | null;
  parentImmeubleId: number | null;
  etageNumber: number | null;
}

@Component({
  standalone: false,
  selector: 'app-page-journal-caisse',
  templateUrl: './page-journal-caisse.component.html',
  styleUrls: ['./page-journal-caisse.component.css'],
})
export class PageJournalCaisseComponent implements OnInit, OnDestroy {
  readonly pageSizeOptions = [6, 12, 24, 48];
  readonly workflowFilters: Array<{ value: WorkflowFilter; label: string }> = [
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
  readonly paymentStatusOptions = [
    { value: 'A_PAYER', label: 'A payer' },
    { value: 'EN_ATTENTE', label: 'En attente de paiement' },
    { value: 'PAYEE', label: 'Payée' },
  ];
  readonly acceptedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ];

  user?: UtilisateurRequestDto;
  agenceCode = '';
  workflowConfig?: ExpenseWorkflowConfig;
  expenses: ExpenseRecord[] = [];
  validators: UtilisateurAfficheDto[] = [];
  supplierSuggestions: ExpenseSupplierSuggestion[] = [];
  sites: SiteResponseDto[] = [];
  etages: EtageDto[] = [];
  allBiens: BienImmobilierItem[] = [];
  selectedExpense: ExpenseRecord | null = null;

  selectedAttachment: File | null = null;
  attachmentPreviewUrl: string | null = null;
  attachmentPreviewKind: AttachmentPreviewKind = null;
  attachmentPreviewName = '';

  searchTerm = '';
  workflowFilter: WorkflowFilter = 'ALL';
  currentPage = 1;
  pageSize = 12;
  actionComment = '';

  isPageLoading = true;
  isSavingDraft = false;
  isSubmitting = false;
  isWorkflowActionLoading = false;

  private readonly destroy$ = new Subject<void>();

  readonly form = this.fb.group({
    id: [null as number | null],
    referenceDepense: ['', [Validators.required, Validators.maxLength(80)]],
    dateEncaissement: [this.toIsoDate(new Date()), Validators.required],
    categorieDepense: ['', Validators.required],
    libelleDepense: ['', [Validators.required, Validators.maxLength(255)]],
    descriptionDepense: ['', Validators.maxLength(1000)],
    montantDepense: [null as number | null, [Validators.required, Validators.min(1)]],
    modePaiement: ['', Validators.required],
    statutPaiement: ['A_PAYER', Validators.required],
    datePaiement: [''],
    siteId: [null as number | null, Validators.required],
    bienImmobilierSelection: [null as string | null],
    bienImmobilierId: [null as number | null, Validators.required],
    bienImmobilierCode: [''],
    bienImmobilierLibelle: [''],
    typeBienImmobilier: [''],
    appartementLocalSelection: [null as string | null],
    appartementLocalId: [null as number | null],
    appartementLocalLibelle: [''],
    idChapitre: [null as number | null],
    fournisseurNom: ['', Validators.maxLength(255)],
    fournisseurTelephone: ['', [Validators.maxLength(30), this.phoneValidator]],
    fournisseurEmail: ['', [Validators.maxLength(255), Validators.email]],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly apiService: ApiService,
    private readonly agenceService: AgenceService,
    private readonly depenseService: DepenseService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    if (!this.user?.id || !this.user.idAgence) {
      this.notify(
        NotificationType.ERROR,
        'Session utilisateur introuvable pour charger la gestion des dépenses.'
      );
      return;
    }

    this.watchPaymentStatus();
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.revokeAttachmentPreview();
  }

  get categories(): string[] {
    return this.workflowConfig?.categories?.length
      ? this.workflowConfig.categories
      : ['Maintenance', 'Energie', 'Fournitures'];
  }

  get paymentModes(): string[] {
    return this.workflowConfig?.paymentModes?.length
      ? this.workflowConfig.paymentModes
      : ['Espèce', 'Mobile money', 'Virement'];
  }

  get filteredExpenses(): ExpenseRecord[] {
    const query = this.searchTerm.trim().toLowerCase();

    return this.expenses.filter((expense) => {
      if (
        this.workflowFilter !== 'ALL' &&
        (expense.workflowStatus || 'BROUILLON') !== this.workflowFilter
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        expense.referenceDepense,
        expense.categorieDepense,
        expense.libelleDepense,
        expense.descriptionDepense,
        expense.fournisseurNom,
        expense.bienImmobilierLibelle,
        expense.appartementLocalLibelle,
        expense.demandeurNom,
        this.getWorkflowStatusLabel(expense.workflowStatus),
        this.getPaymentStatusLabel(expense.statutPaiement),
        `${expense.montantDepense ?? 0}`,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }

  get pagedExpenses(): ExpenseRecord[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredExpenses.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredExpenses.length / Math.max(this.pageSize, 1)));
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    if (total <= 5) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(total, start + 4);
    const normalizedStart = Math.max(1, end - 4);
    return Array.from({ length: end - normalizedStart + 1 }, (_, index) => normalizedStart + index);
  }

  get totalMontant(): number {
    return this.expenses.reduce((sum, expense) => sum + Number(expense.montantDepense ?? 0), 0);
  }

  get pendingValidationCount(): number {
    return this.expenses.filter((expense) => this.isPendingStatus(expense.workflowStatus)).length;
  }

  get myApprovalCount(): number {
    return this.expenses.filter((expense) => this.canApprove(expense)).length;
  }

  get validatedCount(): number {
    return this.expenses.filter((expense) => expense.workflowStatus === 'VALIDEE').length;
  }

  get attachmentAccept(): string {
    return '.pdf,.jpg,.jpeg,.png';
  }

  get canSaveDraft(): boolean {
    return !this.isSavingDraft && !this.isSubmitting && !this.isPageLoading;
  }

  get canSubmit(): boolean {
    return !this.isSavingDraft && !this.isSubmitting && !this.isPageLoading;
  }

  get amountValue(): number {
    return Number(this.form.controls.montantDepense.value ?? 0);
  }

  get thresholdAmount(): number {
    return Number(this.workflowConfig?.validationThreshold ?? 100000);
  }

  get exceedsThreshold(): boolean {
    return this.amountValue > this.thresholdAmount;
  }

  get workflowEnabled(): boolean {
    return this.workflowConfig?.active ?? true;
  }

  get workflowPreviewText(): string {
    if (!this.workflowEnabled) {
      return 'Circuit désactivé : la dépense sera validée directement après soumission.';
    }

    if (!this.exceedsThreshold) {
      return `Montant inférieur ou égal au seuil de ${this.formatCurrency(this.thresholdAmount)} : validation simplifiée.`;
    }

    const levelCount = Number(this.workflowConfig?.levelCount ?? 2);
    return `Montant supérieur au seuil : la dépense passera dans un circuit à ${levelCount} niveau(x).`;
  }

  get currentStepLabel(): string {
    if (!this.selectedExpense) {
      return 'Aucune dépense sélectionnée';
    }
    return this.getWorkflowStatusLabel(this.selectedExpense.workflowStatus);
  }

  get biensForSelectedSite(): BienImmobilierItem[] {
    const siteId = Number(this.form.controls.siteId.value);
    if (!siteId) return [];
    return this.allBiens.filter((b) => b.idSite === siteId);
  }

  get selectedBien(): BienImmobilierItem | undefined {
    return this.findBienBySelection(this.form.controls.bienImmobilierSelection.value);
  }

  get linkedBiensForSelectedImmeuble(): BienImmobilierItem[] {
    const selectedBien = this.selectedBien;
    if (!selectedBien || selectedBien.type !== 'Immeuble') {
      return [];
    }

    return this.allBiens
      .filter((bien) => bien.parentImmeubleId === selectedBien.id)
      .sort((left, right) => {
        const etageDiff = (left.etageNumber ?? 999) - (right.etageNumber ?? 999);
        if (etageDiff !== 0) {
          return etageDiff;
        }

        const typeDiff = this.getBienTypeOrder(left.type) - this.getBienTypeOrder(right.type);
        if (typeDiff !== 0) {
          return typeDiff;
        }

        return this.getBienStorageLabel(left).localeCompare(
          this.getBienStorageLabel(right),
          'fr',
          { sensitivity: 'base' }
        );
      });
  }

  get hasSelectedImmeuble(): boolean {
    return this.selectedBien?.type === 'Immeuble';
  }

  navigateToWorkflowSettings(): void {
    this.router.navigate(['/parametrage-depenses']);
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.currentPage = 1;
  }

  onWorkflowFilterChange(value: WorkflowFilter): void {
    this.workflowFilter = value;
    this.currentPage = 1;
  }

  onPageSizeChange(value: number | string): void {
    this.pageSize = Number(value) || 12;
    this.currentPage = 1;
  }

  setPage(page: number): void {
    this.currentPage = Math.min(Math.max(page, 1), this.totalPages);
  }

  onSiteChange(): void {
    // Réinitialise le bien sélectionné quand le site change
    this.clearBienSelection();
  }

  onBienChange(): void {
    const bien = this.findBienBySelection(this.form.controls.bienImmobilierSelection.value);
    if (!bien) {
      this.clearBienSelection();
      return;
    }

    const basePatch = {
      bienImmobilierSelection: bien.key,
      bienImmobilierId: bien.id,
      bienImmobilierCode: bien.code,
      bienImmobilierLibelle: bien.label,
      typeBienImmobilier: bien.type,
    };

    if (bien.type === 'Immeuble') {
      this.form.patchValue({
        ...basePatch,
        appartementLocalSelection: null,
        appartementLocalId: null,
        appartementLocalLibelle: '',
        idChapitre: bien.idChapitre,
      });
      return;
    }

    this.form.patchValue({
      ...basePatch,
      appartementLocalSelection: bien.key,
      appartementLocalId: bien.id,
      appartementLocalLibelle: this.getBienStorageLabel(bien),
      idChapitre: bien.idChapitre,
    });
  }

  onAppartementLocalChange(): void {
    const selectedBien = this.selectedBien;
    if (!selectedBien) {
      this.clearAppartementLocalSelection();
      return;
    }

    const linkedBien = this.findBienBySelection(
      this.form.controls.appartementLocalSelection.value
    );

    if (!linkedBien) {
      this.clearAppartementLocalSelection(selectedBien.idChapitre ?? null);
      return;
    }

    this.form.patchValue({
      appartementLocalSelection: linkedBien.key,
      appartementLocalId: linkedBien.id,
      appartementLocalLibelle: this.getBienStorageLabel(linkedBien),
      idChapitre: linkedBien.idChapitre ?? selectedBien.idChapitre ?? null,
    });
  }

  onSupplierBlur(): void {
    const supplierName = (this.form.controls.fournisseurNom.value || '').trim().toLowerCase();
    if (!supplierName) {
      return;
    }

    const supplier = this.supplierSuggestions.find(
      (item) => item.fournisseurNom?.trim().toLowerCase() === supplierName
    );

    if (!supplier) {
      return;
    }

    this.form.patchValue({
      fournisseurNom: supplier.fournisseurNom || '',
      fournisseurTelephone: supplier.fournisseurTelephone || '',
      fournisseurEmail: supplier.fournisseurEmail || '',
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    if (!this.isSupportedAttachment(file)) {
      input.value = '';
      this.notify(
        NotificationType.WARNING,
        'Formats autorisés : PDF, JPG, JPEG ou PNG.'
      );
      return;
    }

    this.selectedAttachment = file;
    this.attachmentPreviewName = file.name;
    this.revokeAttachmentPreview();

    if (file.type.startsWith('image/')) {
      this.attachmentPreviewKind = 'image';
      this.attachmentPreviewUrl = URL.createObjectURL(file);
    } else {
      this.attachmentPreviewKind = 'document';
    }
  }

  clearAttachmentSelection(): void {
    this.selectedAttachment = null;
    this.attachmentPreviewName = '';
    this.revokeAttachmentPreview();
    this.attachmentPreviewKind = null;
  }

  resetForm(): void {
    this.form.reset({
      id: null,
      referenceDepense: this.generateNextReference(),
      dateEncaissement: this.toIsoDate(new Date()),
      categorieDepense: this.categories[0] || '',
      libelleDepense: '',
      descriptionDepense: '',
      montantDepense: null,
      modePaiement: this.paymentModes[0] || '',
      statutPaiement: 'A_PAYER',
      datePaiement: '',
      siteId: null,
      bienImmobilierSelection: null,
      bienImmobilierId: null,
      bienImmobilierCode: '',
      bienImmobilierLibelle: '',
      typeBienImmobilier: '',
      appartementLocalSelection: null,
      appartementLocalId: null,
      appartementLocalLibelle: '',
      idChapitre: null,
      fournisseurNom: '',
      fournisseurTelephone: '',
      fournisseurEmail: '',
    });
    this.form.markAsPristine();
    this.selectedExpense = null;
    this.actionComment = '';
    this.clearAttachmentSelection();
  }

  saveDraft(): void {
    this.persistExpense('BROUILLON');
  }

  submitExpense(): void {
    this.persistExpense('SOUMETTRE');
  }

  refreshExpenses(): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.isPageLoading = true;
    this.depenseService
      .getExpenses(this.user.idAgence)
      .pipe(
        finalize(() => {
          this.isPageLoading = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (expenses) => {
          this.applyExpenses(expenses, this.selectedExpense?.id);
        },
        error: () => {
          this.notify(
            NotificationType.ERROR,
            'Impossible de rafraîchir la liste des dépenses.'
          );
        },
      });
  }

  selectExpense(expense: ExpenseRecord): void {
    this.selectedExpense = expense;
    this.actionComment = '';
  }

  editExpense(expense: ExpenseRecord): void {
    const matchingBien = this.findBienFromExpense(expense);
    const linkedBien = this.findAppartementLocalFromExpense(matchingBien, expense);

    this.form.patchValue({
      id: expense.id ?? null,
      referenceDepense: expense.referenceDepense || '',
      dateEncaissement: expense.dateEncaissement || this.toIsoDate(new Date()),
      categorieDepense: expense.categorieDepense || '',
      libelleDepense: expense.libelleDepense || '',
      descriptionDepense: expense.descriptionDepense || '',
      montantDepense: Number(expense.montantDepense ?? 0) || null,
      modePaiement: expense.modePaiement || '',
      statutPaiement: expense.statutPaiement || 'A_PAYER',
      datePaiement: expense.datePaiement || '',
      siteId: matchingBien?.idSite ?? null,
      bienImmobilierSelection: matchingBien?.key ?? null,
      bienImmobilierId: expense.bienImmobilierId ?? null,
      bienImmobilierCode: expense.bienImmobilierCode || '',
      bienImmobilierLibelle: expense.bienImmobilierLibelle || '',
      typeBienImmobilier: expense.typeBienImmobilier || '',
      appartementLocalSelection:
        linkedBien?.key ??
        (matchingBien && matchingBien.type !== 'Immeuble' ? matchingBien.key : null),
      appartementLocalId:
        linkedBien?.id ??
        expense.appartementLocalId ??
        (matchingBien?.type !== 'Immeuble' ? expense.bienImmobilierId ?? null : null),
      appartementLocalLibelle:
        expense.appartementLocalLibelle ||
        (linkedBien
          ? this.getBienStorageLabel(linkedBien)
          : matchingBien && matchingBien.type !== 'Immeuble'
          ? this.getBienStorageLabel(matchingBien)
          : ''),
      idChapitre:
        expense.idChapitre ?? linkedBien?.idChapitre ?? matchingBien?.idChapitre ?? null,
      fournisseurNom: expense.fournisseurNom || '',
      fournisseurTelephone: expense.fournisseurTelephone || '',
      fournisseurEmail: expense.fournisseurEmail || '',
    });

    this.form.markAsPristine();
    this.selectedExpense = expense;
    this.actionComment = '';
    this.clearAttachmentSelection();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  approveSelectedExpense(): void {
    if (!this.selectedExpense?.id || !this.user?.id) {
      return;
    }

    this.isWorkflowActionLoading = true;
    this.depenseService
      .approveExpense(this.selectedExpense.id, this.buildActionPayload())
      .pipe(
        finalize(() => {
          this.isWorkflowActionLoading = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (expense) => {
          this.notify(NotificationType.SUCCESS, 'La dépense a été approuvée.');
          this.actionComment = '';
          this.refreshCollectionAfterAction(expense);
        },
        error: () => {
          this.notify(NotificationType.ERROR, "L'approbation a échoué.");
        },
      });
  }

  rejectSelectedExpense(): void {
    if (!this.selectedExpense?.id || !this.user?.id) {
      return;
    }

    const confirmed = window.confirm('Confirmer le rejet de cette dépense ?');
    if (!confirmed) {
      return;
    }

    this.isWorkflowActionLoading = true;
    this.depenseService
      .rejectExpense(this.selectedExpense.id, this.buildActionPayload())
      .pipe(
        finalize(() => {
          this.isWorkflowActionLoading = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (expense) => {
          this.notify(NotificationType.WARNING, 'La dépense a été rejetée.');
          this.actionComment = '';
          this.refreshCollectionAfterAction(expense);
        },
        error: () => {
          this.notify(NotificationType.ERROR, 'Le rejet a échoué.');
        },
      });
  }

  cancelSelectedExpense(): void {
    if (!this.selectedExpense?.id || !this.user?.id) {
      return;
    }

    const confirmed = window.confirm('Confirmer l’annulation de cette demande ?');
    if (!confirmed) {
      return;
    }

    this.isWorkflowActionLoading = true;
    this.depenseService
      .cancelExpense(this.selectedExpense.id, this.buildActionPayload())
      .pipe(
        finalize(() => {
          this.isWorkflowActionLoading = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (expense) => {
          this.notify(NotificationType.WARNING, 'La dépense a été annulée.');
          this.actionComment = '';
          this.refreshCollectionAfterAction(expense);
        },
        error: () => {
          this.notify(NotificationType.ERROR, "L'annulation a échoué.");
        },
      });
  }

  downloadAttachment(expense: ExpenseRecord): void {
    if (!expense.id || !expense.hasJustificatif) {
      return;
    }

    this.depenseService
      .downloadAttachment(expense.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const fileName = expense.justificatifNom || `justificatif-${expense.id}`;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          link.click();
          URL.revokeObjectURL(url);
        },
        error: () => {
          this.notify(
            NotificationType.ERROR,
            'Le justificatif n’a pas pu être téléchargé.'
          );
        },
      });
  }

  isCurrentUserRequester(expense: ExpenseRecord): boolean {
    if (!this.user?.id) {
      return false;
    }
    return Number(expense.demandeurId ?? expense.idCreateur ?? 0) === Number(this.user.id);
  }

  canEdit(expense: ExpenseRecord): boolean {
    return (
      this.isCurrentUserRequester(expense) &&
      ['BROUILLON', 'REJETEE'].includes(expense.workflowStatus || 'BROUILLON')
    );
  }

  canCancel(expense: ExpenseRecord): boolean {
    if (!this.isCurrentUserRequester(expense)) {
      return false;
    }

    return !['VALIDEE', 'ANNULEE'].includes(expense.workflowStatus || '');
  }

  canApprove(expense: ExpenseRecord): boolean {
    if (!this.user?.id) {
      return false;
    }

    const status = expense.workflowStatus || '';
    const level = Number(expense.currentValidationLevel ?? 0);
    if (!status.startsWith('EN_ATTENTE_VALIDATION_NIVEAU_') || level < 1 || level > 3) {
      return false;
    }

    const expectedUserId = this.getLevelUserId(expense, level);
    const expectedRole = this.getLevelRole(expense, level);
    const currentRole = this.normalizeRole(this.user.roleUsed);

    if (expectedUserId && Number(expectedUserId) === Number(this.user.id)) {
      return true;
    }

    return !!expectedRole && this.normalizeRole(expectedRole) === currentRole;
  }

  trackByExpenseId(index: number, expense: ExpenseRecord): number | string {
    return expense.id ?? index;
  }

  getStatusTone(status: string | null | undefined): string {
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

  getPaymentTone(status: string | null | undefined): string {
    switch (status) {
      case 'PAYEE':
        return 'success';
      case 'A_PAYER':
        return 'warning';
      default:
        return 'muted';
    }
  }

  getWorkflowStatusLabel(status: string | null | undefined): string {
    switch (status) {
      case 'BROUILLON':
        return 'Brouillon';
      case 'SOUMISE':
        return 'Soumise';
      case 'EN_ATTENTE_VALIDATION_NIVEAU_1':
        return 'En attente validation niveau 1';
      case 'EN_ATTENTE_VALIDATION_NIVEAU_2':
        return 'En attente validation niveau 2';
      case 'EN_ATTENTE_VALIDATION_NIVEAU_3':
        return 'En attente validation niveau 3';
      case 'VALIDEE':
        return 'Validée';
      case 'REJETEE':
        return 'Rejetée';
      case 'ANNULEE':
        return 'Annulée';
      default:
        return 'Brouillon';
    }
  }

  getPaymentStatusLabel(status: string | null | undefined): string {
    switch (status) {
      case 'PAYEE':
        return 'Payée';
      case 'EN_ATTENTE':
        return 'En attente';
      case 'A_PAYER':
        return 'A payer';
      default:
        return status?.trim() || 'Non renseigné';
    }
  }

  getLevelLabel(expense: ExpenseRecord, level: number): string {
    if (level === 1) {
      return expense.validationNiveau1Label || 'Niveau 1';
    }
    if (level === 2) {
      return expense.validationNiveau2Label || 'Niveau 2';
    }
    return expense.validationNiveau3Label || 'Niveau 3';
  }

  getWorkflowSteps(expense: ExpenseRecord): Array<{ label: string; state: 'done' | 'current' | 'pending' }> {
    const steps: Array<{ label: string; state: 'done' | 'current' | 'pending' }> = [
      {
        label: 'Demande créée',
        state: expense.workflowStatus === 'BROUILLON' ? 'current' : 'done',
      },
    ];

    const maxLevel = Math.max(1, Number(expense.maxValidationLevel ?? 0));
    for (let level = 1; level <= maxLevel; level += 1) {
      const currentLevel = Number(expense.currentValidationLevel ?? 0);
      const stepState: 'done' | 'current' | 'pending' =
        expense.workflowStatus === 'VALIDEE' || currentLevel > level
          ? 'done'
          : currentLevel === level && this.isPendingStatus(expense.workflowStatus)
          ? 'current'
          : 'pending';

      steps.push({
        label: this.getLevelLabel(expense, level),
        state: stepState,
      });
    }

    steps.push({
      label: 'Validation finale',
      state: expense.workflowStatus === 'VALIDEE' ? 'done' : 'pending',
    });

    return steps;
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'Ce champ est obligatoire.';
    }
    if (control.errors['min']) {
      return 'La valeur doit être supérieure à 0.';
    }
    if (control.errors['email']) {
      return 'Adresse email invalide.';
    }
    if (control.errors['phone']) {
      return 'Numéro de téléphone invalide.';
    }
    if (control.errors['selection']) {
      return 'Sélectionnez une valeur proposée dans la liste.';
    }
    if (control.errors['maxlength']) {
      return 'La valeur saisie est trop longue.';
    }
    return 'Champ invalide.';
  }

  formatCurrency(value: number | string | null | undefined): string {
    const amount = Number(value ?? 0);
    return `${amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} FCFA`;
  }

  formatDate(value: string | null | undefined): string {
    if (!value) {
      return 'Non renseignée';
    }
    return formatDate(value, 'dd/MM/yyyy', 'fr-FR');
  }

  formatDateTime(value: string | null | undefined): string {
    if (!value) {
      return 'Non renseignée';
    }
    return formatDate(value, 'dd/MM/yyyy HH:mm', 'fr-FR');
  }

  private loadInitialData(): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.isPageLoading = true;

    forkJoin({
      config: this.depenseService
        .getWorkflowConfig(this.user.idAgence)
        .pipe(catchError(() => of(undefined))),
      expenses: this.depenseService
        .getExpenses(this.user.idAgence)
        .pipe(catchError(() => of([] as ExpenseRecord[]))),
      suppliers: this.depenseService
        .listSupplierSuggestions(this.user.idAgence)
        .pipe(catchError(() => of([] as ExpenseSupplierSuggestion[]))),
      users: this.userService
        .getUsersByAgence(this.user.idAgence)
        .pipe(catchError(() => of([] as UtilisateurAfficheDto[]))),
      agence: this.agenceService
        .getAgenceById(this.user.idAgence)
        .pipe(catchError(() => of(undefined as AgenceResponseDto | undefined))),
      sites: this.apiService
        .findAllSites(this.user.idAgence)
        .pipe(catchError(() => of([] as SiteResponseDto[]))),
      immeubles: this.apiService
        .findAllImmeuble(this.user.idAgence)
        .pipe(catchError(() => of([] as ImmeubleDto[]))),
      etages: this.apiService
        .findAllEtage(this.user.idAgence)
        .pipe(catchError(() => of([] as EtageDto[]))),
      appartements: this.apiService
        .findAllAppartement(this.user.idAgence)
        .pipe(catchError(() => of([] as AppartementDto[]))),
      magasins: this.apiService
        .findAllMagasin(this.user.idAgence)
        .pipe(catchError(() => of([] as MagasinDto[]))),
      villas: this.apiService
        .findAllVilla(this.user.idAgence)
        .pipe(catchError(() => of([] as VillaDto[]))),
    })
      .pipe(
        finalize(() => {
          this.isPageLoading = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (result) => {
          this.workflowConfig = result.config || this.createFallbackConfig();
          this.agenceCode = this.buildAgenceCode(result.agence);
          this.validators = (result.users || []).filter((user) => user.active !== false);
          this.supplierSuggestions = result.suppliers || [];
          this.sites = (result.sites || []).sort((a, b) =>
            (a.nomSite || '').localeCompare(b.nomSite || '', 'fr', { sensitivity: 'base' })
          );
          this.etages = result.etages || [];
          this.buildBiensCatalog(
            result.immeubles || [],
            result.etages || [],
            result.appartements || [],
            result.magasins || [],
            result.villas || []
          );
          this.applyExpenses(result.expenses || []);
          this.applyDefaultFormValues();
        },
        error: () => {
          this.notify(
            NotificationType.ERROR,
            'La page des dépenses n’a pas pu être initialisée.'
          );
        },
      });
  }

  private applyDefaultFormValues(): void {
    if (!this.form.controls.categorieDepense.value) {
      this.form.patchValue({
        referenceDepense: this.generateNextReference(),
        categorieDepense: this.categories[0] || '',
        modePaiement: this.paymentModes[0] || '',
      });
    }
  }

  private buildBiensCatalog(
    immeubles: ImmeubleDto[],
    etages: EtageDto[],
    appartements: AppartementDto[],
    magasins: MagasinDto[],
    villas: VillaDto[]
  ): void {
    const immeubleById = new Map<number, ImmeubleDto>();
    immeubles.forEach((immeuble) => {
      if (immeuble.id) {
        immeubleById.set(immeuble.id, immeuble);
      }
    });

    const etageById = new Map<number, EtageDto>();
    etages.forEach((etage) => {
      if (etage.id) {
        etageById.set(etage.id, etage);
      }
    });

    const biens: BienImmobilierItem[] = [];

    immeubles.forEach((item) => {
      if (!item.id) return;
      const displayName =
        item.nomBaptiserImmeuble ||
        item.nomCompletImmeuble ||
        item.descriptionImmeuble ||
        (item.numImmeuble ? `Immeuble ${item.numImmeuble}` : `Immeuble #${item.id}`);
      biens.push({
        key: this.createBienKey(item.id, 'Immeuble'),
        id: item.id,
        label: item.codeNomAbrvImmeuble
          ? `${item.codeNomAbrvImmeuble}${displayName ? ` — ${displayName}` : ''}`
          : displayName,
        code: item.codeNomAbrvImmeuble || '',
        type: 'Immeuble',
        idSite: item.idSite ?? 0,
        idChapitre: null,
        parentImmeubleId: null,
        etageNumber: null,
      });
    });

    appartements.forEach((item) => {
      if (!item.id) return;
      const etage = item.idEtageAppartement
        ? etageById.get(item.idEtageAppartement)
        : undefined;
      const parentImmeubleId = etage?.idImmeuble ?? null;
      const parentImmeuble = parentImmeubleId
        ? immeubleById.get(parentImmeubleId)
        : undefined;
      const numLabel = item.numApp ? `Appt. ${item.numApp}` : `Appt. #${item.id}`;
      const immLabel =
        parentImmeuble?.codeNomAbrvImmeuble ||
        item.nomCompletBienImmobilier ||
        item.nomBaptiserBienImmobilier ||
        '';
      biens.push({
        key: this.createBienKey(item.id, 'Appartement'),
        id: item.id,
        label: immLabel ? `${numLabel} — ${immLabel}` : numLabel,
        code: item.codeAbrvBienImmobilier || '',
        type: 'Appartement',
        idSite: parentImmeuble?.idSite ?? 0,
        idChapitre: item.idChapitre ?? null,
        parentImmeubleId,
        etageNumber: etage?.numEtage ?? null,
      });
    });

    magasins.forEach((item) => {
      if (!item.id) return;
      const etage = item.idEtage ? etageById.get(item.idEtage) : undefined;
      const parentImmeubleId = etage?.idImmeuble ?? item.idmmeuble ?? null;
      const parentImmeuble = parentImmeubleId
        ? immeubleById.get(parentImmeubleId)
        : undefined;
      const numLabel = item.numMagasin ? `Local ${item.numMagasin}` : `Local #${item.id}`;
      const immLabel =
        parentImmeuble?.codeNomAbrvImmeuble ||
        item.nomCompletBienImmobilier ||
        item.nomBaptiserBienImmobilier ||
        '';
      biens.push({
        key: this.createBienKey(item.id, 'Local commercial'),
        id: item.id,
        label: immLabel ? `${numLabel} — ${immLabel}` : numLabel,
        code: item.codeAbrvBienImmobilier || '',
        type: 'Local commercial',
        idSite: parentImmeuble?.idSite ?? item.idSite ?? 0,
        idChapitre: item.idChapitre ?? null,
        parentImmeubleId,
        etageNumber: etage?.numEtage ?? null,
      });
    });

    villas.forEach((item) => {
      if (!item.id) return;
      const numLabel = item.numVilla ? `Villa ${item.numVilla}` : `Villa #${item.id}`;
      const immLabel = item.nomCompletBienImmobilier || item.nomBaptiserBienImmobilier || '';
      biens.push({
        key: this.createBienKey(item.id, 'Villa'),
        id: item.id,
        label: immLabel ? `${numLabel} — ${immLabel}` : numLabel,
        code: item.codeAbrvBienImmobilier || '',
        type: 'Villa',
        idSite: item.idSite ?? 0,
        idChapitre: item.idChapitre ?? null,
        parentImmeubleId: null,
        etageNumber: null,
      });
    });

    this.allBiens = biens.sort((a, b) => {
      const typeOrderDiff = this.getBienTypeOrder(a.type) - this.getBienTypeOrder(b.type);
      if (typeOrderDiff !== 0) {
        return typeOrderDiff;
      }
      return a.label.localeCompare(b.label, 'fr', { sensitivity: 'base' });
    });
  }

  private applyExpenses(expenses: ExpenseRecord[], preferredId?: number | null): void {
    this.expenses = [...expenses].sort((left, right) => Number(right.id ?? 0) - Number(left.id ?? 0));
    this.currentPage = Math.min(this.currentPage, this.totalPages);

    const selectionId = preferredId ?? this.selectedExpense?.id;
    if (selectionId) {
      const matchingExpense = this.expenses.find((expense) => expense.id === selectionId);
      this.selectedExpense = matchingExpense || null;
      return;
    }

    this.selectedExpense = this.expenses.length ? this.expenses[0] : null;
  }

  private refreshCollectionAfterAction(expense: ExpenseRecord): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.depenseService
      .getExpenses(this.user.idAgence)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (expenses) => {
          this.applyExpenses(expenses, expense.id);
        },
        error: () => {
          this.notify(
            NotificationType.WARNING,
            'La liste n’a pas pu être synchronisée après l’action.'
          );
        },
      });
  }

  private persistExpense(action: 'BROUILLON' | 'SOUMETTRE'): void {
    if (!this.user?.id || !this.user.idAgence) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notify(
        NotificationType.ERROR,
        'Veuillez corriger les erreurs du formulaire avant de continuer.'
      );
      return;
    }

    const payload = this.buildPayload(action);
    if (action === 'BROUILLON') {
      this.isSavingDraft = true;
    } else {
      this.isSubmitting = true;
    }

    this.depenseService
      .saveExpense(payload, this.selectedAttachment)
      .pipe(
        finalize(() => {
          this.isSavingDraft = false;
          this.isSubmitting = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (expense) => {
          this.notify(
            NotificationType.SUCCESS,
            action === 'BROUILLON'
              ? 'La dépense a été enregistrée en brouillon.'
              : 'La dépense a bien été soumise.'
          );
          this.clearAttachmentSelection();
          this.refreshCollectionAfterAction(expense);
          this.resetForm();
        },
        error: (error) => {
          const message =
            error?.error?.message ||
            error?.error?.error ||
            'La dépense n’a pas pu être enregistrée.';
          this.notify(NotificationType.ERROR, message);
        },
      });
  }

  private buildPayload(action: 'BROUILLON' | 'SOUMETTRE'): ExpenseFormPayload {
    const value = this.form.getRawValue();

    return {
      id: value.id,
      idAgence: Number(this.user?.idAgence),
      idCreateur: Number(this.user?.id),
      demandeurNom: this.buildCurrentUserDisplayName(),
      action,
      referenceDepense: value.referenceDepense?.trim() || '',
      dateEncaissement: value.dateEncaissement || this.toIsoDate(new Date()),
      categorieDepense: value.categorieDepense?.trim() || '',
      libelleDepense: value.libelleDepense?.trim() || '',
      descriptionDepense: value.descriptionDepense?.trim() || '',
      montantDepense: Number(value.montantDepense ?? 0),
      modePaiement: value.modePaiement?.trim() || '',
      statutPaiement: value.statutPaiement?.trim() || '',
      datePaiement: value.datePaiement || null,
      bienImmobilierId: Number(value.bienImmobilierId),
      bienImmobilierCode: value.bienImmobilierCode || '',
      bienImmobilierLibelle: value.bienImmobilierLibelle || '',
      typeBienImmobilier: value.typeBienImmobilier || '',
      appartementLocalId: value.appartementLocalId,
      appartementLocalLibelle: value.appartementLocalLibelle || '',
      fournisseurNom: value.fournisseurNom?.trim() || '',
      fournisseurTelephone: value.fournisseurTelephone?.trim() || '',
      fournisseurEmail: value.fournisseurEmail?.trim() || '',
      idChapitre: value.idChapitre,
    };
  }

  private buildActionPayload(): ExpenseActionPayload {
    return {
      utilisateurId: Number(this.user?.id),
      utilisateurNom: this.buildCurrentUserDisplayName(),
      utilisateurRole: this.user?.roleUsed || '',
      commentaire: this.actionComment?.trim() || '',
    };
  }

  private buildCurrentUserDisplayName(): string {
    const fullName = [this.user?.prenom, this.user?.nom].filter(Boolean).join(' ').trim();
    return fullName || this.user?.username || 'Utilisateur';
  }

  private isSupportedAttachment(file: File): boolean {
    return this.acceptedMimeTypes.includes(file.type.toLowerCase());
  }

  private revokeAttachmentPreview(): void {
    if (this.attachmentPreviewUrl) {
      URL.revokeObjectURL(this.attachmentPreviewUrl);
      this.attachmentPreviewUrl = null;
    }
  }

  private watchPaymentStatus(): void {
    this.form.controls.statutPaiement.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        const paymentDateControl = this.form.controls.datePaiement;
        if (status === 'PAYEE') {
          paymentDateControl.setValidators([Validators.required]);
        } else {
          paymentDateControl.clearValidators();
          paymentDateControl.setValue('', { emitEvent: false });
        }
        paymentDateControl.updateValueAndValidity({ emitEvent: false });
      });
  }

  private clearBienSelection(): void {
    this.form.patchValue({
      bienImmobilierSelection: null,
      bienImmobilierId: null,
      bienImmobilierCode: '',
      bienImmobilierLibelle: '',
      typeBienImmobilier: '',
      appartementLocalSelection: null,
      appartementLocalId: null,
      appartementLocalLibelle: '',
      idChapitre: null,
    });
  }

  private clearAppartementLocalSelection(idChapitre: number | null = null): void {
    this.form.patchValue({
      appartementLocalSelection: null,
      appartementLocalId: null,
      appartementLocalLibelle: '',
      idChapitre,
    });
  }

  private createBienKey(
    id: number,
    type: BienImmobilierItem['type']
  ): string {
    return `${type}:${id}`;
  }

  private findBienBySelection(selection: string | null | undefined): BienImmobilierItem | undefined {
    if (!selection) {
      return undefined;
    }
    return this.allBiens.find((bien) => bien.key === selection);
  }

  private findAppartementLocalFromExpense(
    selectedBien: BienImmobilierItem | undefined,
    expense: ExpenseRecord
  ): BienImmobilierItem | undefined {
    if (!selectedBien) {
      return undefined;
    }

    if (selectedBien.type !== 'Immeuble') {
      return selectedBien;
    }

    const appartementLocalId = Number(expense.appartementLocalId ?? 0);
    const appartementLocalLibelle = (expense.appartementLocalLibelle || '')
      .trim()
      .toLowerCase();
    const bienLibelle = (expense.bienImmobilierLibelle || '').trim().toLowerCase();

    if (!appartementLocalId && !appartementLocalLibelle) {
      return undefined;
    }

    if (
      appartementLocalId === selectedBien.id &&
      (!appartementLocalLibelle || appartementLocalLibelle === bienLibelle)
    ) {
      return undefined;
    }

    const candidates = this.allBiens.filter(
      (bien) => bien.parentImmeubleId === selectedBien.id
    );

    if (appartementLocalLibelle) {
      const matchByLabel = candidates.find((bien) =>
        this.matchesBienReference(bien, appartementLocalLibelle)
      );
      if (matchByLabel) {
        return matchByLabel;
      }
    }

    if (!appartementLocalId) {
      return undefined;
    }

    const matchById = candidates.filter((bien) => bien.id === appartementLocalId);
    return matchById.length === 1 ? matchById[0] : undefined;
  }

  private findBienFromExpense(expense: ExpenseRecord): BienImmobilierItem | undefined {
    const bienId = Number(expense.bienImmobilierId ?? 0);
    if (!bienId) {
      return undefined;
    }

    const normalizedType = this.normalizeBienType(expense.typeBienImmobilier);
    if (normalizedType) {
      const bien = this.allBiens.find(
        (item) => item.id === bienId && item.type === normalizedType
      );
      if (bien) {
        return bien;
      }
    }

    return this.allBiens.find((item) => item.id === bienId);
  }

  private normalizeBienType(
    value: string | null | undefined
  ): BienImmobilierItem['type'] | undefined {
    const normalized = (value || '').trim().toUpperCase();
    switch (normalized) {
      case 'APPARTEMENT':
        return 'Appartement';
      case 'VILLA':
        return 'Villa';
      case 'LOCAL COMMERCIAL':
      case 'MAGASIN':
        return 'Local commercial';
      case 'IMMEUBLE':
        return 'Immeuble';
      default:
        return undefined;
    }
  }

  private getBienTypeOrder(type: BienImmobilierItem['type']): number {
    switch (type) {
      case 'Immeuble':
        return 1;
      case 'Appartement':
        return 2;
      case 'Local commercial':
        return 3;
      case 'Villa':
        return 4;
      default:
        return 99;
    }
  }

  private getBienStorageLabel(bien: BienImmobilierItem): string {
    return bien.code?.trim() || bien.label;
  }

  private matchesBienReference(
    bien: BienImmobilierItem,
    normalizedReference: string
  ): boolean {
    return [
      bien.code,
      bien.label,
      this.getBienStorageLabel(bien),
    ].some((value) => (value || '').trim().toLowerCase() === normalizedReference);
  }

  private getLevelRole(expense: ExpenseRecord, level: number): string | undefined {
    if (level === 1) {
      return expense.validationNiveau1Role || undefined;
    }
    if (level === 2) {
      return expense.validationNiveau2Role || undefined;
    }
    return expense.validationNiveau3Role || undefined;
  }

  private getLevelUserId(expense: ExpenseRecord, level: number): number | undefined {
    if (level === 1) {
      return expense.validationNiveau1UserId || undefined;
    }
    if (level === 2) {
      return expense.validationNiveau2UserId || undefined;
    }
    return expense.validationNiveau3UserId || undefined;
  }

  private isPendingStatus(status: string | null | undefined): boolean {
    return (status || '').startsWith('EN_ATTENTE_VALIDATION_NIVEAU_');
  }

  private normalizeRole(value: string | null | undefined): string {
    return (value || '').replace(/^ROLE_/i, '').trim().toUpperCase();
  }

  private buildAgenceCode(agence: AgenceResponseDto | undefined): string {
    const sigle = agence?.sigleAgence?.trim();
    if (sigle) {
      return sigle.toUpperCase();
    }
    const nom = agence?.nomAgence?.trim() || '';
    const initials = nom
      .split(/\s+/)
      .filter((word) => word.length > 2)
      .map((word) => word[0].toUpperCase())
      .join('');
    return initials || 'AG';
  }

  generateNextReference(): string {
    const yy = new Date().getFullYear().toString().slice(-2);
    const code = this.agenceCode || 'AG';
    const prefix = `DEP-${yy}-${code}-`;

    let maxSeq = 0;
    for (const expense of this.expenses) {
      const ref = expense.referenceDepense || '';
      if (ref.startsWith(prefix)) {
        const seq = parseInt(ref.slice(prefix.length), 10);
        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }
    }

    return `${prefix}${String(maxSeq + 1).padStart(5, '0')}`;
  }

  private createFallbackConfig(): ExpenseWorkflowConfig {
    return {
      active: true,
      validationThreshold: 100000,
      levelCount: 2,
      categories: ['Maintenance', 'Energie', 'Fournitures'],
      paymentModes: ['Espèce', 'Mobile money', 'Virement'],
      levels: [
        {
          levelOrder: 1,
          levelLabel: 'Supérieur hiérarchique',
          validatorRoleName: 'SUPERVISEUR',
          validatorUserId: null,
          validatorUserDisplayName: null,
          active: true,
        },
        {
          levelOrder: 2,
          levelLabel: 'Directeur final',
          validatorRoleName: 'GERANT',
          validatorUserId: null,
          validatorUserDisplayName: null,
          active: true,
        },
      ],
    };
  }

  private phoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = `${control.value || ''}`.trim();
    if (!value) {
      return null;
    }

    return /^[0-9+\s().-]{6,30}$/.test(value) ? null : { phone: true };
  }

  private toIsoDate(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en');
  }

  private notify(type: NotificationType, message: string): void {
    this.notificationService.notify(type, message);
  }
}
