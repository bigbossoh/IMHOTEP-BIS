import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DepenseService } from 'src/app/services/depense/depense.service';
import { UserService } from 'src/app/services/user/user.service';
import { ExpenseWorkflowConfig, ExpenseWorkflowLevel } from 'src/app/services/depense/depense.models';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';

@Component({
  standalone: false,
  selector: 'app-page-parametre-depense',
  templateUrl: './page-parametre-depense.component.html',
  styleUrls: ['./page-parametre-depense.component.css'],
})
export class PageParametreDepenseComponent implements OnInit {
  user?: UtilisateurRequestDto;
  config?: ExpenseWorkflowConfig;

  workflowForm!: FormGroup;
  level1Form!: FormGroup;
  level2Form!: FormGroup;
  level3Form!: FormGroup;

  newCategory = '';
  newPaymentMode = '';

  categories: string[] = [];
  paymentModes: string[] = [];

  loading = false;
  saving = false;

  readonly LEVEL_COUNT_OPTIONS = [
    { value: 2, label: '2 niveaux' },
    { value: 3, label: '3 niveaux' },
  ];

  constructor(
    private fb: FormBuilder,
    private depenseService: DepenseService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  get levelCount(): number {
    return Number(this.workflowForm?.get('levelCount')?.value ?? 2);
  }

  get workflowActive(): boolean {
    return !!this.workflowForm?.get('active')?.value;
  }

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.buildForms();
    this.loadConfig();
  }

  private buildForms(): void {
    this.workflowForm = this.fb.group({
      active: [false],
      validationThreshold: [100000, [Validators.required, Validators.min(1)]],
      levelCount: [2, [Validators.required]],
    });

    this.level1Form = this.fb.group({
      levelOrder: [1],
      levelLabel: ['Supérieur hiérarchique', [Validators.required]],
      validatorRoleName: [''],
      validatorUserId: [null],
      validatorUserDisplayName: [''],
      active: [true],
    });

    this.level2Form = this.fb.group({
      levelOrder: [2],
      levelLabel: ['Directeur final', [Validators.required]],
      validatorRoleName: [''],
      validatorUserId: [null],
      validatorUserDisplayName: [''],
      active: [true],
    });

    this.level3Form = this.fb.group({
      levelOrder: [3],
      levelLabel: ['Directeur général', [Validators.required]],
      validatorRoleName: [''],
      validatorUserId: [null],
      validatorUserDisplayName: [''],
      active: [true],
    });
  }

  private loadConfig(): void {
    if (!this.user?.idAgence) return;
    this.loading = true;
    this.depenseService.getWorkflowConfig(this.user.idAgence).subscribe({
      next: (cfg) => {
        this.loading = false;
        if (cfg) {
          this.config = cfg;
          this.hydrateFromConfig(cfg);
        }
      },
      error: () => {
        this.loading = false;
        this.showToast('Impossible de charger la configuration.', 'error');
      },
    });
  }

  private hydrateFromConfig(cfg: ExpenseWorkflowConfig): void {
    this.workflowForm.patchValue({
      active: cfg.active ?? false,
      validationThreshold: cfg.validationThreshold ?? 100000,
      levelCount: cfg.levelCount ?? 2,
    });

    this.categories = [...(cfg.categories ?? [])];
    this.paymentModes = [...(cfg.paymentModes ?? [])];

    const levels = cfg.levels ?? [];
    const l1 = levels.find((l) => l.levelOrder === 1);
    const l2 = levels.find((l) => l.levelOrder === 2);
    const l3 = levels.find((l) => l.levelOrder === 3);

    if (l1) this.level1Form.patchValue(l1);
    if (l2) this.level2Form.patchValue(l2);
    if (l3) this.level3Form.patchValue(l3);
  }

  saveConfig(): void {
    if (this.workflowForm.invalid) {
      this.workflowForm.markAllAsTouched();
      this.showToast('Vérifiez les paramètres du workflow.', 'error');
      return;
    }

    const levels: ExpenseWorkflowLevel[] = [
      { ...this.level1Form.value },
      { ...this.level2Form.value },
    ];

    if (this.levelCount >= 3) {
      levels.push({ ...this.level3Form.value });
    }

    const payload: ExpenseWorkflowConfig = {
      id: this.config?.id,
      idAgence: this.user?.idAgence,
      idCreateur: this.user?.id,
      active: this.workflowForm.value.active,
      validationThreshold: Number(this.workflowForm.value.validationThreshold),
      levelCount: this.levelCount,
      categories: [...this.categories],
      paymentModes: [...this.paymentModes],
      levels,
    };

    this.saving = true;
    this.depenseService.saveWorkflowConfig(payload).subscribe({
      next: (saved) => {
        this.saving = false;
        this.config = saved;
        this.showToast('Configuration sauvegardée avec succès.', 'success');
      },
      error: () => {
        this.saving = false;
        this.showToast('Erreur lors de la sauvegarde.', 'error');
      },
    });
  }

  addCategory(): void {
    const cat = (this.newCategory ?? '').trim();
    if (!cat || this.categories.includes(cat)) {
      if (this.categories.includes(cat)) {
        this.showToast('Cette catégorie existe déjà.', 'warn');
      }
      return;
    }
    this.categories = [...this.categories, cat];
    this.newCategory = '';
  }

  removeCategory(cat: string): void {
    this.categories = this.categories.filter((c) => c !== cat);
  }

  addPaymentMode(): void {
    const mode = (this.newPaymentMode ?? '').trim();
    if (!mode || this.paymentModes.includes(mode)) {
      if (this.paymentModes.includes(mode)) {
        this.showToast('Ce mode existe déjà.', 'warn');
      }
      return;
    }
    this.paymentModes = [...this.paymentModes, mode];
    this.newPaymentMode = '';
  }

  removePaymentMode(mode: string): void {
    this.paymentModes = this.paymentModes.filter((m) => m !== mode);
  }

  getThresholdFormatted(): string {
    const v = Number(this.workflowForm?.get('validationThreshold')?.value ?? 0);
    return v.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' XOF';
  }

  private showToast(message: string, type: 'success' | 'error' | 'warn'): void {
    const panelClass = type === 'success' ? 'snack-success' : type === 'error' ? 'snack-error' : 'snack-warn';
    this.snackBar.open(message, 'Fermer', { duration: 4000, panelClass: [panelClass] });
  }
}
