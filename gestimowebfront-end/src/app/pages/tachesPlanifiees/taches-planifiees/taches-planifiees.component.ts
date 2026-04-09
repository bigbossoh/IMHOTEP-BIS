import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { finalize, switchMap } from 'rxjs/operators';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';
import {
  ScheduledTaskConfig,
  TachesPlanifieesService,
} from 'src/app/services/taches-planifiees/taches-planifiees.service';
import { AgenceService } from 'src/app/services/Agence/agence.service';
import { AgenceResponseDto, UtilisateurRequestDto } from 'src/gs-api/src/models';

@Component({
  standalone: false,
  selector: 'app-taches-planifiees',
  templateUrl: './taches-planifiees.component.html',
  styleUrls: ['./taches-planifiees.component.css'],
})
export class TachesPlanifieesComponent implements OnInit {
  public user: UtilisateurRequestDto | null = null;
  public agence: AgenceResponseDto | null = null;
  public cronForm!: UntypedFormGroup;
  public loadErrorMessage = '';
  public isLoading = false;
  public isSaving = false;
  public isRunningNow = false;
  public configuration: ScheduledTaskConfig | null = null;

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly tachesPlanifieesService: TachesPlanifieesService,
    private readonly agenceService: AgenceService
  ) {}

  public ngOnInit(): void {
    this.user = this.getCurrentUser();
    this.initForm();

    if (!this.user?.idAgence) {
      this.loadErrorMessage =
        "Impossible de charger la planification : agence utilisateur introuvable.";
      return;
    }

    this.loadAgence();
    this.loadConfiguration();
  }

  public get agenceLabel(): string {
    return (
      this.agence?.nomAgence?.trim() ||
      `Agence ${this.user?.idAgence ?? ''}`.trim() ||
      'Agence'
    );
  }

  public get cronExpression(): string {
    const { dayOfMonth, executionTime } = this.cronForm.getRawValue();
    const parsedTime = this.parseTime(executionTime);
    return `0 ${parsedTime.minute} ${parsedTime.hour} ${Number(dayOfMonth || 1)} * *`;
  }

  public get nextExecutionPreviewLabel(): string {
    if (!this.cronForm.get('enabled')?.value) {
      return 'Planification désactivée';
    }

    const preview = this.computeNextExecutionPreview();
    return preview ? this.formatDateTime(preview) : '-';
  }

  public get lastExecutionLabel(): string {
    return this.configuration?.lastExecutionAt
      ? this.formatDateTime(this.configuration.lastExecutionAt)
      : 'Aucune exécution enregistrée';
  }

  public get lastExecutionPeriodLabel(): string {
    return this.formatPeriod(this.configuration?.lastExecutionPeriod ?? null);
  }

  public refresh(): void {
    this.loadConfiguration();
  }

  public saveConfiguration(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSaving = true;
    this.tachesPlanifieesService
      .saveConfiguration(this.buildPayload())
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (configuration) => {
          this.syncConfiguration(configuration);
          this.notificationService.notify(
            NotificationType.SUCCESS,
            'La planification mensuelle a été enregistrée.'
          );
        },
        error: (error) => {
          this.notificationService.notify(
            NotificationType.ERROR,
            this.extractErrorMessage(
              error,
              "Impossible d'enregistrer la planification."
            )
          );
        },
      });
  }

  public saveAndRunNow(): void {
    if (!this.user?.idAgence || !this.validateForm()) {
      return;
    }

    this.isRunningNow = true;
    this.tachesPlanifieesService
      .saveConfiguration(this.buildPayload())
      .pipe(
        switchMap((configuration) => {
          this.syncConfiguration(configuration);
          return this.tachesPlanifieesService.runNow(this.user!.idAgence!);
        }),
        finalize(() => (this.isRunningNow = false))
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.notificationService.notify(
              NotificationType.SUCCESS,
              "L'appel de loyer du mois suivant a été lancé et le mail avec l'état en pièce jointe a été envoyé."
            );
            this.loadConfiguration();
            return;
          }

          this.notificationService.notify(
            NotificationType.ERROR,
            "Le traitement n'a pas pu être exécuté."
          );
        },
        error: (error) => {
          this.notificationService.notify(
            NotificationType.ERROR,
            this.extractErrorMessage(
              error,
              "Impossible d'exécuter l'appel de loyer maintenant."
            )
          );
        },
      });
  }

  private initForm(): void {
    this.cronForm = this.fb.group({
      managerEmail: ['', [Validators.required, Validators.email]],
      dayOfMonth: [1, [Validators.required, Validators.min(1), Validators.max(28)]],
      executionTime: ['08:00', Validators.required],
      enabled: [false],
    });
  }

  private loadAgence(): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.agenceService.getAgenceById(this.user.idAgence).subscribe({
      next: (agence) => {
        this.agence = agence;
      },
      error: () => {
        this.agence = null;
      },
    });
  }

  private loadConfiguration(): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.isLoading = true;
    this.loadErrorMessage = '';

    this.tachesPlanifieesService
      .getConfiguration(this.user.idAgence)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (configuration) => {
          this.syncConfiguration(configuration);
        },
        error: (error) => {
          this.loadErrorMessage = this.extractErrorMessage(
            error,
            'Impossible de charger la planification mensuelle.'
          );
        },
      });
  }

  private syncConfiguration(configuration: ScheduledTaskConfig): void {
    this.configuration = configuration;
    this.cronForm.patchValue(
      {
        managerEmail: configuration.managerEmail ?? '',
        dayOfMonth: configuration.dayOfMonth ?? 1,
        executionTime: this.toTimeString(
          configuration.executionHour ?? 8,
          configuration.executionMinute ?? 0
        ),
        enabled: configuration.enabled ?? false,
      },
      { emitEvent: false }
    );
  }

  private validateForm(): boolean {
    if (this.cronForm.invalid) {
      this.cronForm.markAllAsTouched();
      return false;
    }

    if (!this.user?.idAgence) {
      this.notificationService.notify(
        NotificationType.ERROR,
        "Aucune agence n'est associée à l'utilisateur connecté."
      );
      return false;
    }

    return true;
  }

  private buildPayload(): ScheduledTaskConfig {
    const rawValue = this.cronForm.getRawValue();
    const parsedTime = this.parseTime(rawValue.executionTime);

    return {
      id: this.configuration?.id,
      idAgence: this.user?.idAgence ?? undefined,
      managerEmail: rawValue.managerEmail?.trim(),
      dayOfMonth: Number(rawValue.dayOfMonth ?? 1),
      executionHour: parsedTime.hour,
      executionMinute: parsedTime.minute,
      enabled: !!rawValue.enabled,
      lastExecutionAt: this.configuration?.lastExecutionAt ?? null,
      lastExecutionPeriod: this.configuration?.lastExecutionPeriod ?? null,
      nextExecutionAt: this.configuration?.nextExecutionAt ?? null,
    };
  }

  private parseTime(value: string | null | undefined): { hour: number; minute: number } {
    const [hourValue, minuteValue] = String(value ?? '08:00')
      .split(':')
      .map((part) => Number(part));

    const hour = Number.isFinite(hourValue) ? Math.min(Math.max(hourValue, 0), 23) : 8;
    const minute = Number.isFinite(minuteValue)
      ? Math.min(Math.max(minuteValue, 0), 59)
      : 0;

    return { hour, minute };
  }

  private toTimeString(hour: number, minute: number): string {
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  private computeNextExecutionPreview(): Date | null {
    const rawValue = this.cronForm.getRawValue();
    const { hour, minute } = this.parseTime(rawValue.executionTime);
    const dayOfMonth = Math.min(Math.max(Number(rawValue.dayOfMonth ?? 1), 1), 28);
    const now = new Date();
    const currentMonthCandidate = new Date(
      now.getFullYear(),
      now.getMonth(),
      dayOfMonth,
      hour,
      minute,
      0,
      0
    );

    if (currentMonthCandidate.getTime() > now.getTime()) {
      return currentMonthCandidate;
    }

    return new Date(now.getFullYear(), now.getMonth() + 1, dayOfMonth, hour, minute, 0, 0);
  }

  private formatDateTime(value: string | Date | null): string {
    if (!value) {
      return '-';
    }

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  }

  private formatPeriod(period: string | null): string {
    if (!period?.trim()) {
      return 'Aucune période exécutée';
    }

    const [yearValue, monthValue] = period.split('-').map(Number);
    if (!yearValue || !monthValue) {
      return period;
    }

    return new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(yearValue, monthValue - 1, 1));
  }

  private extractErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      if (typeof error.error === 'string' && error.error.trim()) {
        return error.error;
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

  private getCurrentUser(): UtilisateurRequestDto | null {
    try {
      return this.userService.getUserFromLocalCache();
    } catch {
      return null;
    }
  }
}
