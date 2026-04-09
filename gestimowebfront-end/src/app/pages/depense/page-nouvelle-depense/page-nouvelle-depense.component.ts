import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetAllBiensActions } from 'src/app/ngrx/bien-immobilier/bienimmobilier.actions';
import {
  BienImmobilierState,
  BienImmobilierStateEnum,
} from 'src/app/ngrx/bien-immobilier/bienimmobilier.reducer';
import { DepenseService } from 'src/app/services/depense/depense.service';
import { UserService } from 'src/app/services/user/user.service';
import {
  ExpenseFormPayload,
  ExpenseRecord,
  ExpenseSupplierSuggestion,
  ExpenseWorkflowConfig,
} from 'src/app/services/depense/depense.models';
import { BienImmobilierAffiheDto, UtilisateurRequestDto } from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';
import { HttpClient } from '@angular/common/http';

export interface NouvelleDepenseDialogData {
  expenseToEdit?: ExpenseRecord;
  config?: ExpenseWorkflowConfig;
}

interface AppartementSimple {
  id: number;
  libelle: string;
}

@Component({
  standalone: false,
  selector: 'app-page-nouvelle-depense',
  templateUrl: './page-nouvelle-depense.component.html',
  styleUrls: ['./page-nouvelle-depense.component.css'],
})
export class PageNouvelleDepenseComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  user?: UtilisateurRequestDto;
  config?: ExpenseWorkflowConfig;

  biens: BienImmobilierAffiheDto[] = [];
  biensFiltres: BienImmobilierAffiheDto[] = [];
  appartements: AppartementSimple[] = [];
  supplierSuggestions: ExpenseSupplierSuggestion[] = [];

  justificatifFile: File | null = null;
  justificatifPreviewUrl: string | null = null;

  submitting = false;
  workflowWarning = false;

  readonly STATUS_OPTIONS = ['EN_ATTENTE_PAIEMENT', 'PAYEE', 'ANNULEE'];
  get categoriesOptions(): string[] {
    return this.config?.categories ?? ['Entretien', 'Reparation', 'Fournitures', 'Electricite', 'Eau', 'Securite'];
  }
  get paymentModesOptions(): string[] {
    return this.config?.paymentModes ?? ['Espece', 'Cheque', 'Virement bancaire', 'Mobile money'];
  }

  private bienSub?: Subscription;

  constructor(
    public dialogRef: MatDialogRef<PageNouvelleDepenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NouvelleDepenseDialogData,
    private fb: FormBuilder,
    private store: Store<any>,
    private depenseService: DepenseService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  get isEdit(): boolean {
    return !!this.data?.expenseToEdit?.id;
  }

  get dialogTitle(): string {
    return this.isEdit ? 'Modifier une dépense' : 'Nouvelle dépense';
  }

  get montant(): number {
    return Number(this.form?.get('montantDepense')?.value ?? 0);
  }

  get requiresWorkflow(): boolean {
    if (!this.config?.active || !this.config?.validationThreshold) return false;
    return this.montant > this.config.validationThreshold;
  }

  get datePaiementRequired(): boolean {
    return this.form?.get('statutPaiement')?.value === 'PAYEE';
  }

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.config = this.data?.config;
    this.buildForm();
    this.loadBiens();
    this.loadSupplierSuggestions();

    if (this.isEdit) {
      this.hydrateForm(this.data.expenseToEdit!);
    }

    this.form.get('montantDepense')?.valueChanges.subscribe(() => {
      this.workflowWarning = this.requiresWorkflow;
    });

    this.form.get('statutPaiement')?.valueChanges.subscribe(() => {
      this.updateDatePaiementValidator();
    });
  }

  ngOnDestroy(): void {
    this.bienSub?.unsubscribe();
  }

  private buildForm(): void {
    const expense = this.data?.expenseToEdit;
    this.form = this.fb.group({
      referenceDepense: [expense?.referenceDepense ?? '', [Validators.required]],
      dateEncaissement: [expense?.dateEncaissement ? new Date(expense.dateEncaissement) : new Date(), [Validators.required]],
      categorieDepense: [expense?.categorieDepense ?? '', [Validators.required]],
      libelleDepense: [expense?.libelleDepense ?? '', [Validators.required, Validators.maxLength(200)]],
      descriptionDepense: [expense?.descriptionDepense ?? ''],
      montantDepense: [expense?.montantDepense ?? 0, [Validators.required, Validators.min(0.01)]],
      modePaiement: [expense?.modePaiement ?? '', [Validators.required]],
      statutPaiement: [expense?.statutPaiement ?? 'EN_ATTENTE_PAIEMENT', [Validators.required]],
      datePaiement: [expense?.datePaiement ? new Date(expense.datePaiement) : null],
      bienImmobilierId: [expense?.bienImmobilierId ?? null, [Validators.required]],
      appartementLocalId: [expense?.appartementLocalId ?? null],
      fournisseurNom: [expense?.fournisseurNom ?? ''],
      fournisseurTelephone: [expense?.fournisseurTelephone ?? '', [Validators.pattern(/^[0-9+\s\-().]{7,20}$/)]],
      fournisseurEmail: [expense?.fournisseurEmail ?? '', [Validators.email]],
    });
  }

  private updateDatePaiementValidator(): void {
    const ctrl = this.form.get('datePaiement');
    if (this.datePaiementRequired) {
      ctrl?.setValidators([Validators.required]);
    } else {
      ctrl?.clearValidators();
    }
    ctrl?.updateValueAndValidity();
  }

  private loadBiens(): void {
    if (this.user?.idAgence) {
      this.store.dispatch(new GetAllBiensActions(this.user.idAgence));
    }
    this.bienSub = this.store
      .pipe(map((state) => state.biensState as BienImmobilierState))
      .subscribe((state) => {
        if (state.dataState === BienImmobilierStateEnum.LOADED) {
          this.biens = state.bienImmoblilier ?? [];
          this.biensFiltres = [...this.biens];
          if (this.isEdit && this.data.expenseToEdit?.bienImmobilierId) {
            this.loadAppartements(this.data.expenseToEdit.bienImmobilierId);
          }
        }
      });
  }

  private loadSupplierSuggestions(): void {
    if (!this.user?.idAgence) return;
    this.depenseService.listSupplierSuggestions(this.user.idAgence).subscribe({
      next: (suggestions) => (this.supplierSuggestions = suggestions ?? []),
    });
  }

  loadAppartements(bienId: number | null): void {
    this.appartements = [];
    this.form.get('appartementLocalId')?.setValue(null);
    if (!bienId) return;
    this.http
      .get<any[]>(
        `${this.apiService.rootUrl}gestimoweb/api/v1/appartement/all/${this.user?.idAgence}`
      )
      .subscribe({
        next: (list) => {
          this.appartements = (list ?? [])
            .filter((a) => a.idBienImmobilier === bienId || a.idBien === bienId || a.bienId === bienId)
            .map((a) => ({
              id: a.id,
              libelle: a.nomBaptiserBienImmobilier || a.designation || a.nomCompletBienImmobilier || `Unité #${a.id}`,
            }));
        },
      });
  }

  onBienChange(bienId: number): void {
    const selected = this.biens.find((b) => b.id === bienId);
    this.loadAppartements(selected?.id ?? null);
  }

  onSupplierSelect(suggestion: ExpenseSupplierSuggestion): void {
    this.form.patchValue({
      fournisseurNom: suggestion.fournisseurNom ?? '',
      fournisseurTelephone: suggestion.fournisseurTelephone ?? '',
      fournisseurEmail: suggestion.fournisseurEmail ?? '',
    });
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      this.showToast('Format non accepté. Utilisez PDF, JPG ou PNG.', 'warn');
      input.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.showToast('Fichier trop volumineux (max 5 Mo).', 'warn');
      input.value = '';
      return;
    }

    this.justificatifFile = file;
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => (this.justificatifPreviewUrl = e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      this.justificatifPreviewUrl = null;
    }
  }

  removeFile(): void {
    this.justificatifFile = null;
    this.justificatifPreviewUrl = null;
  }

  filterBiens(value: string): void {
    const term = (value ?? '').toLowerCase();
    this.biensFiltres = this.biens.filter(
      (b) =>
        (b.nomCompletBienImmobilier ?? '').toLowerCase().includes(term) ||
        (b.codeAbrvBienImmobilier ?? '').toLowerCase().includes(term)
    );
  }

  private hydrateForm(expense: ExpenseRecord): void {
    this.form.patchValue({
      referenceDepense: expense.referenceDepense ?? '',
      dateEncaissement: expense.dateEncaissement ? new Date(expense.dateEncaissement) : new Date(),
      categorieDepense: expense.categorieDepense ?? '',
      libelleDepense: expense.libelleDepense ?? '',
      descriptionDepense: expense.descriptionDepense ?? '',
      montantDepense: expense.montantDepense ?? 0,
      modePaiement: expense.modePaiement ?? '',
      statutPaiement: expense.statutPaiement ?? 'EN_ATTENTE_PAIEMENT',
      datePaiement: expense.datePaiement ? new Date(expense.datePaiement) : null,
      bienImmobilierId: expense.bienImmobilierId ?? null,
      appartementLocalId: expense.appartementLocalId ?? null,
      fournisseurNom: expense.fournisseurNom ?? '',
      fournisseurTelephone: expense.fournisseurTelephone ?? '',
      fournisseurEmail: expense.fournisseurEmail ?? '',
    });
  }

  private buildPayload(action: 'BROUILLON' | 'SOUMETTRE'): ExpenseFormPayload {
    const v = this.form.value;
    const bien = this.biens.find((b) => b.id === v.bienImmobilierId);
    const appart = this.appartements.find((a) => a.id === v.appartementLocalId);
    return {
      id: this.data?.expenseToEdit?.id ?? null,
      idAgence: this.user!.idAgence!,
      idCreateur: this.user!.id!,
      demandeurNom: `${this.user?.nom ?? ''} ${this.user?.prenom ?? ''}`.trim(),
      action,
      referenceDepense: v.referenceDepense,
      dateEncaissement: v.dateEncaissement instanceof Date
        ? v.dateEncaissement.toISOString().split('T')[0]
        : v.dateEncaissement,
      categorieDepense: v.categorieDepense,
      libelleDepense: v.libelleDepense,
      descriptionDepense: v.descriptionDepense,
      montantDepense: Number(v.montantDepense),
      modePaiement: v.modePaiement,
      statutPaiement: v.statutPaiement,
      datePaiement: v.datePaiement instanceof Date
        ? v.datePaiement.toISOString().split('T')[0]
        : v.datePaiement ?? null,
      bienImmobilierId: v.bienImmobilierId,
      bienImmobilierCode: bien?.codeAbrvBienImmobilier,
      bienImmobilierLibelle: bien?.nomCompletBienImmobilier,
      appartementLocalId: v.appartementLocalId ?? null,
      appartementLocalLibelle: appart?.libelle,
      fournisseurNom: v.fournisseurNom,
      fournisseurTelephone: v.fournisseurTelephone,
      fournisseurEmail: v.fournisseurEmail,
    };
  }

  saveDraft(): void {
    if (!this.validateBase()) return;
    this.submit('BROUILLON');
  }

  submitForValidation(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showToast('Veuillez corriger les erreurs du formulaire.', 'error');
      return;
    }
    this.submit('SOUMETTRE');
  }

  private validateBase(): boolean {
    const controls = ['referenceDepense', 'dateEncaissement', 'categorieDepense',
      'libelleDepense', 'montantDepense', 'modePaiement', 'bienImmobilierId'];
    let valid = true;
    controls.forEach((key) => {
      const ctrl = this.form.get(key);
      ctrl?.markAsTouched();
      if (ctrl?.invalid) valid = false;
    });
    if (!valid) this.showToast('Veuillez remplir les champs obligatoires.', 'error');
    return valid;
  }

  private submit(action: 'BROUILLON' | 'SOUMETTRE'): void {
    if (this.submitting) return;
    this.submitting = true;
    const payload = this.buildPayload(action);
    this.depenseService.saveExpense(payload, this.justificatifFile).subscribe({
      next: (result) => {
        this.submitting = false;
        const msg = action === 'SOUMETTRE' ? 'Dépense soumise pour validation.' : 'Brouillon enregistré.';
        this.showToast(msg, 'success');
        this.dialogRef.close({ saved: true, expense: result });
      },
      error: () => {
        this.submitting = false;
        this.showToast("Erreur lors de l'enregistrement. Veuillez réessayer.", 'error');
      },
    });
  }

  cancel(): void {
    this.dialogRef.close({ saved: false });
  }

  getErrorMessage(controlName: string): string {
    const ctrl = this.form.get(controlName);
    if (!ctrl?.touched || !ctrl.errors) return '';
    if (ctrl.errors['required']) return 'Ce champ est obligatoire.';
    if (ctrl.errors['min']) return 'La valeur doit être supérieure à 0.';
    if (ctrl.errors['email']) return 'Email invalide.';
    if (ctrl.errors['pattern']) return 'Format invalide.';
    if (ctrl.errors['maxlength']) return 'Trop long.';
    return 'Valeur invalide.';
  }

  getBienLabel(bien: BienImmobilierAffiheDto): string {
    return [bien.codeAbrvBienImmobilier, bien.nomCompletBienImmobilier]
      .filter(Boolean)
      .join(' — ');
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      EN_ATTENTE_PAIEMENT: 'En attente de paiement',
      PAYEE: 'Payée',
      ANNULEE: 'Annulée',
    };
    return labels[status] ?? status;
  }

  private showToast(message: string, type: 'success' | 'error' | 'warn'): void {
    const panelClass = type === 'success' ? 'snack-success' : type === 'error' ? 'snack-error' : 'snack-warn';
    this.snackBar.open(message, 'Fermer', { duration: 4000, panelClass: [panelClass] });
  }
}
