import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';

type Step = 'request' | 'otp' | 'done';
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
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);

  // ── États ──────────────────────────────────────────────────────────────────
  readonly step = signal<Step>('request');
  readonly feedbackMessage = signal<string | null>(null);
  readonly feedbackType = signal<FeedbackType>('info');
  readonly requestLoading = signal(false);
  readonly confirmLoading = signal(false);

  // ── Formulaire étape 1 : identifiant ───────────────────────────────────────
  readonly requestForm = this.formBuilder.nonNullable.group({
    identifier: ['', [Validators.required]],
  });

  // ── Formulaire étape 2 : OTP + nouveau mot de passe ────────────────────────
  readonly confirmForm = this.formBuilder.nonNullable.group(
    {
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [this.passwordMatchValidator()] }
  );

  // ── Étape 1 : demande OTP ──────────────────────────────────────────────────
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
        next: () => {
          this.step.set('otp');
          this.feedbackType.set('success');
          this.feedbackMessage.set(
            'Un code OTP à 6 chiffres a été envoyé à votre adresse email. Vérifiez votre boîte mail.'
          );
        },
        error: (err: HttpErrorResponse) => {
          this.feedbackType.set('error');
          this.feedbackMessage.set(this.extractErrorMessage(err));
        },
      });
  }

  // ── Étape 2 : validation OTP + nouveau mot de passe ───────────────────────
  submitConfirmation(): void {
    if (this.confirmForm.invalid) {
      this.confirmForm.markAllAsTouched();
      return;
    }

    this.confirmLoading.set(true);
    this.feedbackMessage.set(null);

    this.userService
      .confirmPasswordReset({
        token: this.confirmForm.controls.otp.getRawValue().trim(),
        newPassword: this.confirmForm.controls.newPassword.getRawValue(),
        confirmPassword: this.confirmForm.controls.confirmPassword.getRawValue(),
      })
      .pipe(finalize(() => this.confirmLoading.set(false)))
      .subscribe({
        next: (message) => {
          this.step.set('done');
          this.feedbackType.set('success');
          this.feedbackMessage.set(message);
          this.notificationService.notify(NotificationType.SUCCESS, message);
        },
        error: (err: HttpErrorResponse) => {
          const message = this.extractErrorMessage(err);
          this.feedbackType.set('error');
          this.feedbackMessage.set(message);
          this.notificationService.notify(NotificationType.ERROR, message);
        },
      });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  resendOtp(): void {
    this.step.set('request');
    this.feedbackMessage.set(null);
    this.confirmForm.reset();
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

    return 'Une erreur est survenue. Veuillez réessayer.';
  }

  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = control.get('newPassword')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      if (!newPassword || !confirmPassword) return null;
      return newPassword === confirmPassword ? null : { passwordMismatch: true };
    };
  }
}
