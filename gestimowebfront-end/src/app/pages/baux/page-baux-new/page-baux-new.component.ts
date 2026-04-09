import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import {
  AppartementDto,
  BailAppartementDto,
  BailMagasinDto,
  BailVillaDto,
  MagasinResponseDto,
  UtilisateurAfficheDto,
  UtilisateurRequestDto,
  VillaDto,
} from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';

type BailType = 'Bail Appartement' | 'Bail Magasin' | 'Bail Villa';

@Component({
  standalone: false,
  selector: 'app-page-baux-new',
  templateUrl: './page-baux-new.component.html',
  styleUrls: ['./page-baux-new.component.css'],
})
export class PageBauxNewComponent implements OnInit {
  submitted = false;
  formGroup?: UntypedFormGroup;
  bailvillaForm?: UntypedFormGroup;
  bailMagainForm?: UntypedFormGroup;
  bailAppartementForm?: UntypedFormGroup;

  public user?: UtilisateurRequestDto | null;
  public pageErrorMessage = '';

  public locataires: UtilisateurAfficheDto[] = [];
  public appartements: AppartementDto[] = [];
  public magasins: MagasinResponseDto[] = [];
  public villas: VillaDto[] = [];

  public isLoadingReferences = false;
  public isSavingAppartement = false;
  public isSavingMagasin = false;
  public isSavingVilla = false;

  ngSelectTypeContrat: BailType = 'Bail Appartement';
  listTypeContrat: BailType[] = [
    'Bail Appartement',
    'Bail Magasin',
    'Bail Villa',
  ];

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly apiService: ApiService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    public dialogRef: MatDialogRef<PageBauxNewComponent>
  ) {}

  ngOnInit(): void {
    this.user = this.getCurrentUser();

    this.formGroup = this.fb.group({
      idTypeContrat: [this.ngSelectTypeContrat, Validators.required],
    });

    this.bailAppartementForm = this.buildBailForm(
      'BAIL-APPARTEMENT',
      'idAppartement'
    );
    this.bailvillaForm = this.buildBailForm('BAIL-VILLA', 'idVilla');
    this.bailMagainForm = this.buildBailForm('BAIL-MAGASIN', 'idMagasin');

    if (!this.user?.idAgence || !this.user?.id) {
      this.pageErrorMessage =
        "Impossible d'initialiser le formulaire : utilisateur courant introuvable.";
      return;
    }

    this.loadReferenceData();
  }

  onContractTypeChange(value: BailType): void {
    this.ngSelectTypeContrat = value;
    this.formGroup?.patchValue({ idTypeContrat: value }, { emitEvent: false });
    this.submitted = false;
  }

  calculMontantCautionApp(): void {
    this.updateCautionAmount(this.bailAppartementForm);
  }

  calculMontantCautionMag(): void {
    this.updateCautionAmount(this.bailMagainForm);
  }

  calculMontantCautionVil(): void {
    this.updateCautionAmount(this.bailvillaForm);
  }

  onSaveBailAppartement(): void {
    this.submitted = true;
    const form = this.bailAppartementForm;

    if (!form || form.invalid) {
      this.markFormAsTouched(form);
      return;
    }

    this.isSavingAppartement = true;
    this.apiService
      .saveBailAppartement(form.value as BailAppartementDto)
      .pipe(finalize(() => (this.isSavingAppartement = false)))
      .subscribe({
        next: () => {
          this.notify(
            NotificationType.SUCCESS,
            'Le bail appartement a bien ete cree.'
          );
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.notify(
            NotificationType.ERROR,
            this.extractErrorMessage(
              error,
              "Impossible de creer le bail appartement."
            )
          );
        },
      });
  }

  onSaveBailMagasin(): void {
    this.submitted = true;
    const form = this.bailMagainForm;

    if (!form || form.invalid) {
      this.markFormAsTouched(form);
      return;
    }

    this.isSavingMagasin = true;
    this.apiService
      .saveBailMagasin(form.value as BailMagasinDto)
      .pipe(finalize(() => (this.isSavingMagasin = false)))
      .subscribe({
        next: () => {
          this.notify(NotificationType.SUCCESS, 'Le bail magasin a bien ete cree.');
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.notify(
            NotificationType.ERROR,
            this.extractErrorMessage(error, "Impossible de creer le bail magasin.")
          );
        },
      });
  }

  onSaveBailVilla(): void {
    this.submitted = true;
    const form = this.bailvillaForm;

    if (!form || form.invalid) {
      this.markFormAsTouched(form);
      return;
    }

    this.isSavingVilla = true;
    this.apiService
      .saveBailVilla(form.value as BailVillaDto)
      .pipe(finalize(() => (this.isSavingVilla = false)))
      .subscribe({
        next: () => {
          this.notify(NotificationType.SUCCESS, 'Le bail villa a bien ete cree.');
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.notify(
            NotificationType.ERROR,
            this.extractErrorMessage(error, "Impossible de creer le bail villa.")
          );
        },
      });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  get currentContractDescription(): string {
    switch (this.ngSelectTypeContrat) {
      case 'Bail Appartement':
        return "Associez un locataire a un appartement libre avec un loyer et une caution clairs.";
      case 'Bail Magasin':
        return "Preparez un contrat commercial en reliant le locataire au magasin disponible.";
      case 'Bail Villa':
        return "Creez un bail de villa avec les dates de contrat et les garanties attendues.";
      default:
        return 'Choisissez un type de bail pour commencer la saisie.';
    }
  }

  get currentPreviewLoyer(): number {
    return this.getNumericControlValue(
      this.getCurrentBailForm(),
      'nouveauMontantLoyer'
    );
  }

  get currentPreviewCaution(): number {
    return this.getNumericControlValue(
      this.getCurrentBailForm(),
      'montantCautionBail'
    );
  }

  get currentPreviewMonths(): number {
    return this.getNumericControlValue(
      this.getCurrentBailForm(),
      'nbreMoisCautionBail'
    );
  }

  formatAmount(value: number | null | undefined): string {
    const amount = value ?? 0;
    return amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  isControlInvalid(form: UntypedFormGroup | undefined, controlName: string): boolean {
    const control = form?.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  private loadReferenceData(): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.isLoadingReferences = true;
    this.pageErrorMessage = '';

    forkJoin({
      locataires: this.apiService.getAllLocatairesByOrder(this.user.idAgence),
      appartementsLibres: this.apiService
        .findAllAppartementLibre(this.user.idAgence)
        .pipe(catchError(() => of([]))),
      appartements: this.apiService.findAllAppartement(this.user.idAgence),
      magasins: this.apiService.findAllMagasinLibre(this.user.idAgence),
      villas: this.apiService.findAllVillaLibre(this.user.idAgence),
    })
      .pipe(finalize(() => (this.isLoadingReferences = false)))
      .subscribe({
        next: ({
          locataires,
          appartementsLibres,
          appartements,
          magasins,
          villas,
        }) => {
          this.locataires = this.sortByDisplayName(locataires ?? []);
          this.appartements = this.resolveAvailableAppartements(
            appartementsLibres ?? [],
            appartements ?? []
          );
          this.magasins = this.sortByCode(
            (magasins ?? []).filter((magasin) => magasin.occupied !== true)
          );
          this.villas = this.sortByCode(
            (villas ?? []).filter((villa) => villa.occupied !== true)
          );
        },
        error: (error) => {
          this.pageErrorMessage = this.extractErrorMessage(
            error,
            "Impossible de charger les donnees de reference du bail."
          );
        },
      });
  }

  private resolveAvailableAppartements(
    appartementsLibres: AppartementDto[],
    appartements: AppartementDto[]
  ): AppartementDto[] {
    const appartementsLibresFiltres = this.sortByCode(
      appartementsLibres.filter(
        (appartement) =>
          appartement.occupied !== true && appartement.bienMeublerResidence !== true
      )
    );

    if (appartementsLibresFiltres.length > 0) {
      return appartementsLibresFiltres;
    }

    return this.sortByCode(
      appartements.filter(
        (appartement) =>
          appartement.occupied !== true && appartement.bienMeublerResidence !== true
      )
    );
  }

  private buildBailForm(
    contractCode: string,
    assetControlName: 'idAppartement' | 'idVilla' | 'idMagasin'
  ): UntypedFormGroup {
    const controls: Record<string, unknown> = {
      id: [0],
      idAgence: [this.user?.idAgence ?? null],
      idCreateur: [this.user?.id ?? null],
      designationBail: ['', Validators.required],
      abrvCodeBail: [contractCode],
      enCoursBail: [true],
      archiveBail: [false],
      montantCautionBail: [0, Validators.required],
      nbreMoisCautionBail: [0, Validators.required],
      nouveauMontantLoyer: [0, Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      idLocataire: [null, Validators.required],
    };

    controls[assetControlName] = [null, Validators.required];

    return this.fb.group(controls);
  }

  private updateCautionAmount(form?: UntypedFormGroup): void {
    if (!form) {
      return;
    }

    const loyer = this.getNumericControlValue(form, 'nouveauMontantLoyer');
    const months = this.getNumericControlValue(form, 'nbreMoisCautionBail');
    form.patchValue(
      {
        montantCautionBail: loyer * months,
      },
      { emitEvent: false }
    );
  }

  private getCurrentBailForm(): UntypedFormGroup | undefined {
    switch (this.ngSelectTypeContrat) {
      case 'Bail Appartement':
        return this.bailAppartementForm;
      case 'Bail Magasin':
        return this.bailMagainForm;
      case 'Bail Villa':
        return this.bailvillaForm;
      default:
        return undefined;
    }
  }

  private getNumericControlValue(
    form: UntypedFormGroup | undefined,
    controlName: string
  ): number {
    const rawValue = form?.get(controlName)?.value;
    const parsed = Number(rawValue ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private markFormAsTouched(form?: UntypedFormGroup): void {
    form?.markAllAsTouched();
  }

  private sortByDisplayName(users: UtilisateurAfficheDto[]): UtilisateurAfficheDto[] {
    return [...users].sort((left, right) =>
      `${left.nom ?? ''} ${left.prenom ?? ''}`.localeCompare(
        `${right.nom ?? ''} ${right.prenom ?? ''}`,
        'fr',
        { sensitivity: 'base' }
      )
    );
  }

  private sortByCode<T extends { codeAbrvBienImmobilier?: string }>(items: T[]): T[] {
    return [...items].sort((left, right) =>
      (left.codeAbrvBienImmobilier ?? '').localeCompare(
        right.codeAbrvBienImmobilier ?? '',
        'fr',
        { sensitivity: 'base' }
      )
    );
  }

  private extractErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      if (typeof error.error === 'string' && error.error.trim()) {
        return error.error;
      }

      if (typeof error.error?.message === 'string' && error.error.message.trim()) {
        return error.error.message;
      }

      if (
        typeof error.error?.errorMessage === 'string' &&
        error.error.errorMessage.trim()
      ) {
        return error.error.errorMessage;
      }

      if (typeof error.message === 'string' && error.message.trim()) {
        return error.message;
      }
    }

    return fallback;
  }

  private notify(type: NotificationType, message: string): void {
    this.notificationService.notify(type, message);
  }

  private getCurrentUser(): UtilisateurRequestDto | null {
    try {
      return this.userService.getUserFromLocalCache();
    } catch (error) {
      return null;
    }
  }
}
