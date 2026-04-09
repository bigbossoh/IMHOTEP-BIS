import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import {
  AgenceImmobilierDTO,
  AgenceRequestDto,
  UtilisateurRequestDto,
} from 'src/gs-api/src/models';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { AgenceService } from '../../../services/Agence/agence.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  standalone: false,
  selector: 'app-page-agence',
  templateUrl: './page-agence.component.html',
  styleUrls: ['./page-agence.component.css'],
})
export class PageAgenceComponent implements OnInit {
  public user?: UtilisateurRequestDto;
  public agences: AgenceImmobilierDTO[] = [];
  public filteredAgences: AgenceImmobilierDTO[] = [];
  public agenceForm!: UntypedFormGroup;
  public searchTerm = '';
  public loadErrorMessage = '';
  public isLoading = false;
  public isSubmitting = false;
  public isFormVisible = false;
  public editingAgenceId: number | null = null;
  public deletingAgenceId: number | null = null;
  public selectedLogoFile: File | null = null;
  public logoPreviewUrl = '';
  public acceptedLogoFormats = 'image/png,image/jpeg,image/jpg,image/svg+xml,image/webp';
  private persistedLogoPreviewUrl = '';

  constructor(
    private fb: UntypedFormBuilder,
    private agenceService: AgenceService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.initForm();
    this.loadAgences();
  }

  get isEditionMode(): boolean {
    return this.editingAgenceId !== null;
  }

  get formTitle(): string {
    return this.isEditionMode ? 'Modifier une agence' : 'Créer une agence';
  }

  get nomAgenceControl() {
    return this.agenceForm.get('nomAgence');
  }

  get emailAgenceControl() {
    return this.agenceForm.get('emailAgence');
  }

  get mobileAgenceControl() {
    return this.agenceForm.get('mobileAgence');
  }

  get mobileAgenceSecondaireControl() {
    return this.agenceForm.get('mobileAgenceSecondaire');
  }

  get nomPrenomGerantControl() {
    return this.agenceForm.get('nomPrenomGerant');
  }

  get motdepasseControl() {
    return this.agenceForm.get('motdepasse');
  }

  public openCreateForm(): void {
    this.editingAgenceId = null;
    this.isFormVisible = true;
    this.agenceForm.reset(this.getDefaultFormValue());
    this.resetLogoState();
    this.updateFormMode(false);
  }

  public openEditForm(agence: AgenceImmobilierDTO): void {
    const agenceId = this.getAgenceIdentifier(agence);
    if (agenceId === null) {
      this.sendNotification(
        NotificationType.ERROR,
        "Impossible d'ouvrir cette agence"
      );
      return;
    }

    this.editingAgenceId = agenceId;
    this.isFormVisible = true;
    this.agenceForm.reset({
      ...this.getDefaultFormValue(),
      id: agenceId,
      idAgence: agence.idAgence ?? agenceId,
      nomAgence: agence.nomAgence ?? '',
      sigleAgence: agence.sigleAgence ?? '',
      telAgence: agence.telAgence ?? '',
      emailAgence: agence.emailAgence ?? '',
      mobileAgence: agence.mobileAgence ?? '',
      mobileAgenceSecondaire: agence.mobileAgenceSecondaire ?? '',
      compteContribuable: agence.compteContribuable ?? '',
      capital: agence.capital ?? 0,
      regimeFiscaleAgence: agence.regimeFiscaleAgence ?? '',
      faxAgence: agence.faxAgence ?? '',
      adresseAgence: agence.adresseAgence ?? '',
      boitePostaleAgence: agence.boitePostaleAgence ?? '',
      nomPrenomGerant: '',
      motdepasse: '',
    });
    this.resetLogoState(agence.profileAgenceUrl ?? '');
    this.updateFormMode(true);
  }

  public closeForm(): void {
    this.isFormVisible = false;
    this.editingAgenceId = null;
    this.agenceForm.reset(this.getDefaultFormValue());
    this.resetLogoState();
    this.updateFormMode(false);
  }

  public refreshAgences(): void {
    this.loadAgences();
  }

  public onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilter();
  }

  public saveAgence(): void {
    if (this.agenceForm.invalid) {
      this.agenceForm.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();
    const logoFile = this.selectedLogoFile;
    let logoWarningMessage = '';
    this.isSubmitting = true;

    this.agenceService
      .saveAgence(payload)
      .pipe(
        switchMap((savedAgence) =>
          this.uploadLogoIfNeeded(savedAgence, logoFile).pipe(
            catchError((error) => {
              logoWarningMessage = this.getErrorMessage(
                error,
                "L'agence a été enregistrée mais le logo n'a pas pu être téléversé."
              );
              return of(savedAgence);
            })
          )
        ),
        finalize(() => (this.isSubmitting = false))
      )
      .subscribe({
        next: (savedAgence) => {
          this.upsertAgence(savedAgence);
          this.sendNotification(
            NotificationType.SUCCESS,
            this.isEditionMode
              ? "L'agence a été modifiée avec succès."
              : "L'agence a été créée avec succès."
          );
          if (logoWarningMessage) {
            this.sendNotification(NotificationType.WARNING, logoWarningMessage);
          }
          this.closeForm();
          this.loadAgences();
        },
        error: (error) => {
          this.sendNotification(
            NotificationType.ERROR,
            this.getErrorMessage(
              error,
              "La sauvegarde de l'agence a échoué."
            )
          );
        },
      });
  }

  public deleteAgence(agence: AgenceImmobilierDTO): void {
    const agenceId = this.getAgenceIdentifier(agence);
    if (agenceId === null) {
      this.sendNotification(
        NotificationType.ERROR,
        "Impossible d'identifier cette agence."
      );
      return;
    }

    const confirmation = window.confirm(
      `Supprimer l'agence "${agence.nomAgence ?? agence.sigleAgence ?? agenceId}" ?`
    );
    if (!confirmation) {
      return;
    }

    this.deletingAgenceId = agenceId;
    this.agenceService
      .deleteAgence(agenceId)
      .pipe(finalize(() => (this.deletingAgenceId = null)))
      .subscribe({
        next: () => {
          this.removeAgenceFromList(agenceId);
          this.sendNotification(
            NotificationType.SUCCESS,
            "L'agence a été supprimée avec succès."
          );
          if (this.editingAgenceId === agenceId) {
            this.closeForm();
          }
          this.loadAgences();
        },
        error: (error) => {
          this.sendNotification(
            NotificationType.ERROR,
            this.getErrorMessage(
              error,
              "Cette agence ne peut pas être supprimée."
            )
          );
        },
      });
  }

  public readonly trackByAgence = (
    index: number,
    agence: AgenceImmobilierDTO
  ): number => this.getAgenceIdentifier(agence) ?? index;

  public onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = '';

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.sendNotification(
        NotificationType.ERROR,
        'Le logo doit être un fichier image.'
      );
      return;
    }

    if (file.size > 512 * 1024) {
      this.sendNotification(
        NotificationType.ERROR,
        'Le logo dépasse la taille maximale autorisée de 512 Ko.'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedLogoFile = file;
      this.logoPreviewUrl = typeof reader.result === 'string' ? reader.result : '';
    };
    reader.readAsDataURL(file);
  }

  public clearSelectedLogo(): void {
    this.selectedLogoFile = null;
    this.logoPreviewUrl = this.persistedLogoPreviewUrl;
  }

  public getAgenceInitials(agence?: AgenceImmobilierDTO | null): string {
    const source = String(
      agence?.sigleAgence?.trim() ||
      agence?.nomAgence?.trim() ||
      this.agenceForm?.get('sigleAgence')?.value ||
      this.agenceForm?.get('nomAgence')?.value ||
      'AG'
    );

    return source
      .split(/\s+/)
      .filter((part: string) => part.length > 0)
      .slice(0, 2)
      .map((part: string) => part[0]?.toUpperCase() ?? '')
      .join('') || 'AG';
  }

  private initForm(): void {
    this.agenceForm = this.fb.group({
      id: [0],
      idAgence: [null],
      idCreateur: [this.user?.id ?? null],
      idUtilisateurCreateur: [this.user?.id ?? null],
      nomAgence: ['', Validators.required],
      sigleAgence: [''],
      telAgence: [''],
      emailAgence: ['', [Validators.required, Validators.email]],
      mobileAgence: ['', [Validators.required, Validators.minLength(8)]],
      mobileAgenceSecondaire: ['', [Validators.minLength(8)]],
      compteContribuable: [''],
      capital: [0],
      regimeFiscaleAgence: [''],
      faxAgence: [''],
      adresseAgence: [''],
      boitePostaleAgence: [''],
      nomPrenomGerant: ['', Validators.required],
      motdepasse: ['', [Validators.required, Validators.minLength(4)]],
      active: [true],
      idEtable: [null],
    });
    this.updateFormMode(false);
  }

  private loadAgences(): void {
    this.isLoading = true;
    this.loadErrorMessage = '';
    this.agenceService
      .getAllAgences()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (agences) => {
          this.agences = this.normalizeAgenceList(agences);
          this.applyFilter();
        },
        error: (error) => {
          this.agences = [];
          this.filteredAgences = [];
          this.loadErrorMessage = this.getErrorMessage(
            error,
            'Impossible de charger les agences.'
          );
          this.sendNotification(
            NotificationType.ERROR,
            this.loadErrorMessage
          );
        },
      });
  }

  private applyFilter(): void {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      this.filteredAgences = [...this.agences];
      return;
    }

    this.filteredAgences = this.agences.filter((agence) =>
      [
        agence.nomAgence,
        agence.sigleAgence,
        agence.telAgence,
        agence.emailAgence,
        agence.mobileAgence,
        agence.mobileAgenceSecondaire,
        agence.compteContribuable,
        agence.adresseAgence,
        agence.boitePostaleAgence,
      ]
        .filter((value): value is string => !!value)
        .some((value) => value.toLowerCase().includes(normalizedSearch))
    );
  }

  private buildPayload(): AgenceRequestDto {
    const formValue = this.agenceForm.getRawValue();
    return {
      id: this.isEditionMode ? this.editingAgenceId ?? formValue.id : 0,
      idAgence: this.isEditionMode
        ? formValue.idAgence ?? this.editingAgenceId ?? formValue.id
        : undefined,
      idCreateur: formValue.idCreateur ?? this.user?.id ?? undefined,
      idUtilisateurCreateur:
        formValue.idUtilisateurCreateur ?? this.user?.id ?? undefined,
      nomAgence: formValue.nomAgence?.trim(),
      sigleAgence: formValue.sigleAgence?.trim(),
      telAgence: formValue.telAgence?.trim(),
      emailAgence: formValue.emailAgence?.trim(),
      mobileAgence: formValue.mobileAgence?.trim(),
      mobileAgenceSecondaire: formValue.mobileAgenceSecondaire?.trim(),
      compteContribuable: formValue.compteContribuable?.trim(),
      capital: Number(formValue.capital ?? 0),
      regimeFiscaleAgence: formValue.regimeFiscaleAgence?.trim(),
      faxAgence: formValue.faxAgence?.trim(),
      adresseAgence: formValue.adresseAgence?.trim(),
      boitePostaleAgence: formValue.boitePostaleAgence?.trim(),
      nomPrenomGerant: this.isEditionMode
        ? undefined
        : formValue.nomPrenomGerant?.trim(),
      motdepasse: this.isEditionMode ? undefined : formValue.motdepasse,
      active: formValue.active ?? true,
      idEtable: formValue.idEtable ?? undefined,
    };
  }

  private getDefaultFormValue(): AgenceRequestDto {
    return {
      id: 0,
      idAgence: undefined,
      idCreateur: this.user?.id ?? undefined,
      idUtilisateurCreateur: this.user?.id ?? undefined,
      nomAgence: '',
      sigleAgence: '',
      telAgence: '',
      emailAgence: '',
      mobileAgence: '',
      mobileAgenceSecondaire: '',
      compteContribuable: '',
      capital: 0,
      regimeFiscaleAgence: '',
      faxAgence: '',
      adresseAgence: '',
      boitePostaleAgence: '',
      nomPrenomGerant: '',
      motdepasse: '',
      active: true,
      idEtable: undefined,
    };
  }

  private updateFormMode(isEditMode: boolean): void {
    const gerantControl = this.agenceForm.get('nomPrenomGerant');
    const passwordControl = this.agenceForm.get('motdepasse');

    if (!gerantControl || !passwordControl) {
      return;
    }

    if (isEditMode) {
      gerantControl.clearValidators();
      passwordControl.clearValidators();
    } else {
      gerantControl.setValidators([Validators.required]);
      passwordControl.setValidators([
        Validators.required,
        Validators.minLength(4),
      ]);
    }

    gerantControl.updateValueAndValidity();
    passwordControl.updateValueAndValidity();
  }

  private getAgenceIdentifier(agence: AgenceImmobilierDTO): number | null {
    return agence.id ?? agence.idAgence ?? null;
  }

  private normalizeAgenceList(payload: unknown): AgenceImmobilierDTO[] {
    if (Array.isArray(payload)) {
      return payload;
    }

    if (payload && typeof payload === 'object') {
      const payloadAsRecord = payload as Record<string, unknown>;

      if (Array.isArray(payloadAsRecord['body'])) {
        return payloadAsRecord['body'] as AgenceImmobilierDTO[];
      }

      if (
        payloadAsRecord['id'] !== undefined ||
        payloadAsRecord['idAgence'] !== undefined ||
        payloadAsRecord['nomAgence'] !== undefined
      ) {
        return [payloadAsRecord as AgenceImmobilierDTO];
      }
    }

    return [];
  }

  private upsertAgence(agence: AgenceImmobilierDTO | null | undefined): void {
    if (!agence) {
      return;
    }

    const agenceId = this.getAgenceIdentifier(agence);
    if (agenceId === null) {
      return;
    }

    const existingIndex = this.agences.findIndex(
      (currentAgence) => this.getAgenceIdentifier(currentAgence) === agenceId
    );

    if (existingIndex >= 0) {
      this.agences = this.agences.map((currentAgence, index) =>
        index === existingIndex ? agence : currentAgence
      );
    } else {
      this.agences = [...this.agences, agence];
    }

    this.applyFilter();
  }

  private removeAgenceFromList(agenceId: number): void {
    this.agences = this.agences.filter(
      (agence) => this.getAgenceIdentifier(agence) !== agenceId
    );
    this.applyFilter();
  }

  private uploadLogoIfNeeded(
    savedAgence: AgenceImmobilierDTO,
    logoFile: File | null
  ): Observable<AgenceImmobilierDTO> {
    const agenceId = this.getAgenceIdentifier(savedAgence);
    if (!logoFile || agenceId === null) {
      return of(savedAgence);
    }

    return this.agenceService.uploadLogoAgence(
      agenceId,
      logoFile,
      savedAgence.idImage ?? null
    );
  }

  private resetLogoState(previewUrl = ''): void {
    this.selectedLogoFile = null;
    this.persistedLogoPreviewUrl = previewUrl;
    this.logoPreviewUrl = previewUrl;
  }

  private getErrorMessage(error: any, fallbackMessage: string): string {
    if (typeof error?.error === 'string' && error.error.trim().length > 0) {
      return error.error;
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.message) {
      return error.message;
    }

    return fallbackMessage;
  }

  private sendNotification(
    notificationType: NotificationType,
    message: string
  ): void {
    this.notificationService.notify(notificationType, message);
  }
}
