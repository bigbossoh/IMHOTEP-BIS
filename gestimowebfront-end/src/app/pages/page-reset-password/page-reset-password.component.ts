import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, map } from 'rxjs';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';

type FeedbackType = 'success' | 'error' | 'info';

@Component({
  standalone: false,
  selector: 'app-page-reset-password',
  templateUrl: './page-reset-password.component.html',
  styleUrls: ['./page-reset-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageResetPasswordComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);

  readonly feedbackMessage = signal<string | null>(null);
  readonly feedbackType = signal<FeedbackType>('info');
  readonly requestLoading = signal(false);
  readonly confirmLoading = signal(false);
  readonly requestSubmitted = signal(false);
  readonly resetCompleted = signal(false);

  readonly token = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('token')?.trim() ?? '')),
    { initialValue: '' }
  );

  readonly hasToken = computed(() => this.token().length > 0);
  readonly isBusy = computed(() => this.requestLoading() || this.confirmLoading());

  readonly pageTitle = computed(() =>
    this.hasToken() ? 'Choisir un nouveau mot de passe' : 'Mot de passe oublie'
  );

  readonly pageDescription = computed(() =>
    this.hasToken()
      ? 'Definissez un nouveau mot de passe puis confirmez-le pour retrouver l acces a votre espace.'
      : 'Saisissez votre identifiant. Un lien de reinitialisation sera envoye a l adresse email associee.'
  );

  readonly requestForm = this.formBuilder.nonNullable.group({
    identifier: ['', [Validators.required]],
  });

  readonly confirmForm = this.formBuilder.nonNullable.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [this.passwordMatchValidator()],
    }
  );

  constructor() {
    effect(() => {
      this.token();
      this.feedbackMessage.set(null);
      this.feedbackType.set('info');
      this.requestSubmitted.set(false);
      this.resetCompleted.set(false);
      this.confirmForm.reset();
    });
  }

  submitRequest(): void {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    const identifier = this.requestForm.controls.identifier.getRawValue().trim();
    this.requestLoading.set(true);
    this.feedbackMessage.set(null);

    this.userService
      .requestPasswordReset(identifier)
      .pipe(finalize(() => this.requestLoading.set(false)))
      .subscribe({
        next: (message) => {
          this.requestSubmitted.set(true);
          this.feedbackType.set('success');
          this.feedbackMessage.set(message);
          this.notificationService.notify(NotificationType.SUCCESS, message);
        },
        error: (errorResponse: HttpErrorResponse) => {
          const message = this.extractErrorMessage(errorResponse);
          this.feedbackType.set('error');
          this.feedbackMessage.set(message);
          this.notificationService.notify(NotificationType.ERROR, message);
        },
      });
  }

  submitConfirmation(): void {
    if (!this.hasToken()) {
      this.feedbackType.set('error');
      this.feedbackMessage.set('Le token de reinitialisation est introuvable.');
      return;
    }

    if (this.confirmForm.invalid) {
      this.confirmForm.markAllAsTouched();
      return;
    }

    this.confirmLoading.set(true);
    this.feedbackMessage.set(null);

    this.userService
      .confirmPasswordReset({
        token: this.token(),
        newPassword: this.confirmForm.controls.newPassword.getRawValue(),
        confirmPassword: this.confirmForm.controls.confirmPassword.getRawValue(),
      })
      .pipe(finalize(() => this.confirmLoading.set(false)))
      .subscribe({
        next: (message) => {
          this.resetCompleted.set(true);
          this.feedbackType.set('success');
          this.feedbackMessage.set(message);
          this.notificationService.notify(NotificationType.SUCCESS, message);
        },
        error: (errorResponse: HttpErrorResponse) => {
          const message = this.extractErrorMessage(errorResponse);
          this.feedbackType.set('error');
          this.feedbackMessage.set(message);
          this.notificationService.notify(NotificationType.ERROR, message);
        },
      });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  sendAnotherLink(): void {
    this.requestSubmitted.set(false);
    this.feedbackMessage.set(null);
    this.requestForm.reset();
  }

  private extractErrorMessage(errorResponse: HttpErrorResponse): string {
    const errorPayload = errorResponse.error;

    if (typeof errorPayload === 'string' && errorPayload.trim().length > 0) {
      return errorPayload;
    }

    if (
      errorPayload &&
      typeof errorPayload === 'object' &&
      'message' in errorPayload &&
      typeof errorPayload.message === 'string' &&
      errorPayload.message.trim().length > 0
    ) {
      return errorPayload.message;
    }

    return 'Une erreur est survenue. Veuillez reessayer.';
  }

  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = control.get('newPassword')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;

      if (!newPassword || !confirmPassword) {
        return null;
      }

      return newPassword === confirmPassword ? null : { passwordMismatch: true };
    };
  }
}
