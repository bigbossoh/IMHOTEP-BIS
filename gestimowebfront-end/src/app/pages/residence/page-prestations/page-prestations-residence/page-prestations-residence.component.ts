import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';
import { PrestationSaveOrUpdateDto, UtilisateurRequestDto } from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';

@Component({
  standalone: false,
  selector: 'app-page-prestations-residence',
  templateUrl: './page-prestations-residence.component.html',
  styleUrls: ['./page-prestations-residence.component.css'],
})
export class PagePrestationsResidenceComponent implements OnInit, OnDestroy {
  public user?: UtilisateurRequestDto;

  public prestations: PrestationSaveOrUpdateDto[] = [];
  public filteredPrestations: PrestationSaveOrUpdateDto[] = [];

  public selectedPrestation: PrestationSaveOrUpdateDto | null = null;
  public searchTerm = '';
  public loading = false;
  public saving = false;
  public errorMessage = '';

  public prestationForm = this.formBuilder.group({
    id: [0],
    name: ['', [Validators.required, Validators.minLength(2)]],
    amount: [0],
  });

  private readonly subscriptions = new Subscription();

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.loadPrestations();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get totalPrestations(): number {
    return this.prestations.length;
  }

  get averageAmount(): number {
    if (!this.prestations.length) {
      return 0;
    }

    const total = this.prestations.reduce((sum, p) => sum + this.toAmount(p.amount), 0);
    return Math.round(total / this.prestations.length);
  }

  public loadPrestations(): void {
    this.loading = true;
    this.errorMessage = '';

    this.subscriptions.add(
      this.apiService
        .findAllServiceAdditionnelPrestation()
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: (data) => {
            const idAgence = this.user?.idAgence;
            const list = Array.isArray(data) ? data : [];
            this.prestations = [...list]
              .filter((p) => !idAgence || !p.idAgence || p.idAgence === idAgence)
              .sort((left, right) =>
                (left?.name ?? '').localeCompare(right?.name ?? '', 'fr', { sensitivity: 'base' })
              );
            this.applySearch();

            if (this.selectedPrestation?.id) {
              const refreshed = this.prestations.find((p) => p.id === this.selectedPrestation?.id) ?? null;
              if (refreshed) {
                this.selectPrestation(refreshed);
              }
            }
          },
          error: (error) => {
            this.errorMessage =
              error?.error?.messages ||
              error?.error?.message ||
              error?.message ||
              'Erreur lors du chargement des prestations.';
          },
        })
    );
  }

  public onSearchChange(value: string): void {
    this.searchTerm = value ?? '';
    this.applySearch();
  }

  public startNew(): void {
    this.selectedPrestation = null;
    this.prestationForm.reset({ id: 0, name: '', amount: 0 });
  }

  public selectPrestation(prestation: PrestationSaveOrUpdateDto): void {
    this.selectedPrestation = prestation;
    this.prestationForm.reset({
      id: prestation.id ?? 0,
      name: prestation.name ?? '',
      amount: this.toAmount(prestation.amount),
    });
  }

  public save(): void {
    if (this.saving) {
      return;
    }

    const idAgence = this.user?.idAgence;
    const idCreateur = this.user?.id;
    if (!idAgence || !idCreateur) {
      this.errorMessage = "Impossible d'enregistrer : utilisateur non charge.";
      return;
    }

    const formValue = this.prestationForm.getRawValue();
    const name = (formValue.name ?? '').trim();
    if (!name || name.length < 2) {
      this.prestationForm.markAllAsTouched();
      this.errorMessage = 'Veuillez renseigner un nom (min. 2 caracteres).';
      return;
    }

    const payload: PrestationSaveOrUpdateDto = {
      id: Number(formValue.id ?? 0),
      idAgence,
      idCreateur,
      name,
      amount: this.toAmount(formValue.amount),
    };

    this.saving = true;
    this.errorMessage = '';

    this.subscriptions.add(
      this.apiService
        .saveorupdatePrestation(payload)
        .pipe(finalize(() => (this.saving = false)))
        .subscribe({
          next: (saved) => {
            this.notificationService.notify(
              NotificationType.SUCCESS,
              payload.id ? 'Prestation mise a jour.' : 'Prestation creee.'
            );
            this.selectedPrestation = saved ?? payload;
            this.loadPrestations();
          },
          error: (error) => {
            this.errorMessage =
              error?.error?.messages ||
              error?.error?.message ||
              error?.message ||
              "Impossible d'enregistrer la prestation.";
          },
        })
    );
  }

  public deleteSelected(): void {
    const id = this.selectedPrestation?.id;
    if (!id) {
      return;
    }

    const confirmed = confirm('Supprimer cette prestation ?');
    if (!confirmed) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    this.subscriptions.add(
      this.apiService
        .deleteServiceAdditionnelPrestation(id)
        .pipe(finalize(() => (this.saving = false)))
        .subscribe({
          next: () => {
            this.notificationService.notify(NotificationType.SUCCESS, 'Prestation supprimee.');
            this.startNew();
            this.loadPrestations();
          },
          error: (error) => {
            this.errorMessage =
              error?.error?.messages ||
              error?.error?.message ||
              error?.message ||
              'Impossible de supprimer la prestation.';
          },
        })
    );
  }

  public trackByPrestation(index: number, prestation: PrestationSaveOrUpdateDto): number {
    return prestation.id ?? index;
  }

  public getInitials(value: string | undefined | null): string {
    const text = (value ?? '').trim();
    if (!text) {
      return 'PR';
    }
    const parts = text.split(/\s+/).filter(Boolean);
    const initials = parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
    return initials || text.substring(0, 2).toUpperCase();
  }

  private applySearch(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredPrestations = [...this.prestations];
      return;
    }

    this.filteredPrestations = this.prestations.filter((p) => {
      const haystack = [p.name, p.amount]
        .filter((value) => value !== null && value !== undefined)
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });
  }

  private toAmount(value: unknown): number {
    const numeric = Number(value ?? 0);
    return Number.isFinite(numeric) ? numeric : 0;
  }
}

