import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, forkJoin, of } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import {
  ExpenseWorkflowConfig,
  ExpenseWorkflowLevel,
} from 'src/app/services/depense/depense.models';
import { DepenseService } from 'src/app/services/depense/depense.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurAfficheDto, UtilisateurRequestDto } from 'src/gs-api/src/models';

@Component({
  standalone: false,
  selector: 'app-page-parametrage-depenses',
  templateUrl: './page-parametrage-depenses.component.html',
  styleUrls: ['./page-parametrage-depenses.component.css'],
})
export class PageParametrageDepensesComponent implements OnInit, OnDestroy {
  user?: UtilisateurRequestDto;
  validators: UtilisateurAfficheDto[] = [];
  categories: string[] = [];
  paymentModes: string[] = [];
  isLoading = true;
  isSaving = false;

  private readonly destroy$ = new Subject<void>();

  readonly form = this.fb.group({
    active: [true],
    validationThreshold: [100000, [Validators.required, Validators.min(0)]],
    levelCount: [2, [Validators.required, Validators.min(2), Validators.max(3)]],
    categoryInput: [''],
    paymentModeInput: [''],
    level1Active: [true],
    level1Label: ['Supérieur hiérarchique', Validators.required],
    level1RoleName: ['SUPERVISEUR'],
    level1UserId: [null as number | null],
    level1UserDisplayName: [''],
    level2Active: [true],
    level2Label: ['Directeur final', Validators.required],
    level2RoleName: ['GERANT'],
    level2UserId: [null as number | null],
    level2UserDisplayName: [''],
    level3Active: [true],
    level3Label: ['Directeur final'],
    level3RoleName: ['GERANT'],
    level3UserId: [null as number | null],
    level3UserDisplayName: [''],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly depenseService: DepenseService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    if (!this.user?.id || !this.user.idAgence) {
      this.notify(
        NotificationType.ERROR,
        'Session utilisateur introuvable pour charger le paramétrage.'
      );
      return;
    }

    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get levelCount(): number {
    return Number(this.form.controls.levelCount.value ?? 2);
  }

  get workflowPreview(): ExpenseWorkflowLevel[] {
    const maxLevel = this.levelCount;
    const levels: ExpenseWorkflowLevel[] = [];

    for (let level = 1; level <= maxLevel; level += 1) {
      const userId = this.getDynamicNumber(`level${level}UserId`);
      const userDisplayName = this.getDynamicString(`level${level}UserDisplayName`);
      levels.push({
        levelOrder: level,
        levelLabel: this.getDynamicString(`level${level}Label`) || `Niveau ${level}`,
        validatorRoleName: this.getDynamicString(`level${level}RoleName`) || null,
        validatorUserId: userId,
        validatorUserDisplayName: userDisplayName || null,
        active: !!this.form.get(`level${level}Active`)?.value,
      });
    }

    return levels;
  }

  addCategory(): void {
    const value = `${this.form.controls.categoryInput.value || ''}`.trim();
    if (!value) {
      return;
    }
    if (this.categories.some((item) => item.toLowerCase() === value.toLowerCase())) {
      this.notify(NotificationType.WARNING, 'Cette catégorie existe déjà.');
      return;
    }
    this.categories = [...this.categories, value];
    this.form.controls.categoryInput.setValue('');
  }

  removeCategory(category: string): void {
    this.categories = this.categories.filter((item) => item !== category);
  }

  addPaymentMode(): void {
    const value = `${this.form.controls.paymentModeInput.value || ''}`.trim();
    if (!value) {
      return;
    }
    if (this.paymentModes.some((item) => item.toLowerCase() === value.toLowerCase())) {
      this.notify(NotificationType.WARNING, 'Ce mode de paiement existe déjà.');
      return;
    }
    this.paymentModes = [...this.paymentModes, value];
    this.form.controls.paymentModeInput.setValue('');
  }

  removePaymentMode(mode: string): void {
    this.paymentModes = this.paymentModes.filter((item) => item !== mode);
  }

  onValidatorSelection(level: number, userIdValue: string | number | null): void {
    const userId = userIdValue ? Number(userIdValue) : null;
    const selectedUser = this.validators.find((user) => Number(user.id) === userId);
    this.setDynamicValue(`level${level}UserId`, userId);
    this.setDynamicValue(
      `level${level}UserDisplayName`,
      selectedUser
        ? [selectedUser.prenom, selectedUser.nom].filter(Boolean).join(' ').trim() ||
            selectedUser.username ||
            ''
        : ''
    );
  }

  saveConfig(): void {
    if (!this.user?.id || !this.user.idAgence) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notify(
        NotificationType.ERROR,
        'Veuillez corriger les informations du paramétrage.'
      );
      return;
    }

    if (!this.categories.length) {
      this.notify(NotificationType.WARNING, 'Ajoutez au moins une catégorie de dépense.');
      return;
    }

    if (!this.paymentModes.length) {
      this.notify(NotificationType.WARNING, 'Ajoutez au moins un mode de paiement.');
      return;
    }

    const payload: ExpenseWorkflowConfig = {
      idAgence: this.user.idAgence,
      idCreateur: this.user.id,
      active: !!this.form.controls.active.value,
      validationThreshold: Number(this.form.controls.validationThreshold.value ?? 0),
      levelCount: this.levelCount,
      categories: this.categories,
      paymentModes: this.paymentModes,
      levels: this.workflowPreview,
    };

    this.isSaving = true;
    this.depenseService
      .saveWorkflowConfig(payload)
      .pipe(
        finalize(() => {
          this.isSaving = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (config) => {
          this.applyConfig(config);
          this.notify(
            NotificationType.SUCCESS,
            'Le circuit de validation des dépenses a été enregistré.'
          );
        },
        error: () => {
          this.notify(
            NotificationType.ERROR,
            "Le paramétrage n'a pas pu être enregistré."
          );
        },
      });
  }

  getUserDisplay(user: UtilisateurAfficheDto): string {
    return [user.prenom, user.nom].filter(Boolean).join(' ').trim() || user.username || 'Utilisateur';
  }

  private loadData(): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.isLoading = true;
    forkJoin({
      config: this.depenseService
        .getWorkflowConfig(this.user.idAgence)
        .pipe(catchError(() => of(this.createFallbackConfig()))),
      users: this.userService
        .getUsersByAgence(this.user.idAgence)
        .pipe(catchError(() => of([] as UtilisateurAfficheDto[]))),
    })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (result) => {
          this.validators = (result.users || []).filter((user) => user.active !== false);
          this.applyConfig(result.config || this.createFallbackConfig());
        },
        error: () => {
          this.notify(
            NotificationType.ERROR,
            'Le paramétrage des dépenses n’a pas pu être chargé.'
          );
        },
      });
  }

  private applyConfig(config: ExpenseWorkflowConfig): void {
    const levels = [...(config.levels || [])].sort(
      (left, right) => left.levelOrder - right.levelOrder
    );

    this.categories = config.categories?.length
      ? [...config.categories]
      : ['Maintenance', 'Energie', 'Fournitures'];
    this.paymentModes = config.paymentModes?.length
      ? [...config.paymentModes]
      : ['Espèce', 'Mobile money', 'Virement'];

    this.form.patchValue({
      active: config.active ?? true,
      validationThreshold: Number(config.validationThreshold ?? 100000),
      levelCount: Number(config.levelCount ?? 2),
      categoryInput: '',
      paymentModeInput: '',
      level1Active: levels[0]?.active ?? true,
      level1Label: levels[0]?.levelLabel || 'Supérieur hiérarchique',
      level1RoleName: levels[0]?.validatorRoleName || 'SUPERVISEUR',
      level1UserId: levels[0]?.validatorUserId || null,
      level1UserDisplayName: levels[0]?.validatorUserDisplayName || '',
      level2Active: levels[1]?.active ?? true,
      level2Label: levels[1]?.levelLabel || 'Directeur final',
      level2RoleName: levels[1]?.validatorRoleName || 'GERANT',
      level2UserId: levels[1]?.validatorUserId || null,
      level2UserDisplayName: levels[1]?.validatorUserDisplayName || '',
      level3Active: levels[2]?.active ?? true,
      level3Label: levels[2]?.levelLabel || 'Directeur final',
      level3RoleName: levels[2]?.validatorRoleName || 'GERANT',
      level3UserId: levels[2]?.validatorUserId || null,
      level3UserDisplayName: levels[2]?.validatorUserDisplayName || '',
    });
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

  private notify(type: NotificationType, message: string): void {
    this.notificationService.notify(type, message);
  }

  private getDynamicString(controlName: string): string {
    return `${this.form.get(controlName)?.value || ''}`.trim();
  }

  private getDynamicNumber(controlName: string): number | null {
    const value = this.form.get(controlName)?.value;
    return value === null || value === undefined || value === '' ? null : Number(value);
  }

  private setDynamicValue(controlName: string, value: number | string | null): void {
    (this.form.get(controlName) as any)?.setValue(value);
  }
}
