import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';
import {
  AppartementDto,
  CategoryChambreSaveOrUpdateDto,
  EtageDto,
  UtilisateurRequestDto,
} from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';

@Component({
  standalone: false,
  selector: 'app-page-creation-residence',
  templateUrl: './page-creation-residence.component.html',
  styleUrls: ['./page-creation-residence.component.css'],
})
export class PageCreationResidenceComponent implements OnInit, OnDestroy {
  public user?: UtilisateurRequestDto;

  public loadingReferences = false;
  public saving = false;
  public errorMessage = '';

  public etages: EtageDto[] = [];
  public categories: CategoryChambreSaveOrUpdateDto[] = [];

  public residenceForm = this.formBuilder.group({
    nomBaptiserBienImmobilier: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    idEtageAppartement: [null as number | null, [Validators.required]],
    idCategorieChambre: [null as number | null],
    nbrPieceApp: [1, [Validators.required, Validators.min(1)]],
    nbreChambreApp: [1, [Validators.required, Validators.min(1)]],
    nbreSalonApp: [0, [Validators.required, Validators.min(0)]],
    nbreSalleEauApp: [1, [Validators.required, Validators.min(1)]],
    superficieBien: [0, [Validators.required, Validators.min(0)]],
  });

  private readonly subscriptions = new Subscription();

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    const idAgence = this.user?.idAgence;

    if (!idAgence) {
      this.errorMessage = "Impossible de creer une residence : agence non definie.";
      return;
    }

    this.loadingReferences = true;
    this.subscriptions.add(
      forkJoin({
        etages: this.apiService.findAllEtage(idAgence),
        categories: this.apiService.findAllCategorieChambre(idAgence),
      })
        .pipe(finalize(() => (this.loadingReferences = false)))
        .subscribe({
          next: ({ etages, categories }) => {
            this.etages = [...(etages ?? [])].sort(
              (left, right) =>
                (left.idImmeuble ?? 0) - (right.idImmeuble ?? 0) ||
                (left.numEtage ?? 0) - (right.numEtage ?? 0)
            );
            this.categories = [...(categories ?? [])].sort((left, right) =>
              (left?.name ?? '').localeCompare(right?.name ?? '', 'fr', {
                sensitivity: 'base',
              })
            );

            if (this.categories.length === 1 && this.categories[0]?.id) {
              this.residenceForm.patchValue({
                idCategorieChambre: this.categories[0].id,
              });
            }
          },
          error: (error) => {
            this.errorMessage =
              error?.error?.messages ||
              error?.error?.message ||
              error?.message ||
              'Erreur lors du chargement des references.';
          },
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public isInvalid(controlName: string): boolean {
    const control = this.residenceForm.get(controlName);
    return !!control && control.touched && control.invalid;
  }

  public cancel(): void {
    this.router.navigate(['/residences']);
  }

  public submit(): void {
    if (this.saving) {
      return;
    }

    this.errorMessage = '';

    const idAgence = this.user?.idAgence;
    const idCreateur = this.user?.id;
    if (!idAgence || !idCreateur) {
      this.errorMessage = "Impossible d'enregistrer : utilisateur non charge.";
      return;
    }

    if (this.residenceForm.invalid) {
      this.residenceForm.markAllAsTouched();
      this.errorMessage = 'Veuillez corriger les champs obligatoires.';
      return;
    }

    const formValue = this.residenceForm.getRawValue();
    const etageId = Number(formValue.idEtageAppartement);
    if (!Number.isFinite(etageId) || etageId <= 0) {
      this.errorMessage = 'Veuillez selectionner un etage.';
      return;
    }

    const categorieId =
      formValue.idCategorieChambre !== null && formValue.idCategorieChambre !== undefined
        ? Number(formValue.idCategorieChambre)
        : null;
    const categorie =
      categorieId && Number.isFinite(categorieId)
        ? this.categories.find((cat) => cat.id === categorieId)
        : undefined;

    const payload: AppartementDto = {
      idAgence,
      idCreateur,
      idEtageAppartement: etageId,
      nomBaptiserBienImmobilier: (formValue.nomBaptiserBienImmobilier ?? '').trim(),
      description: (formValue.description ?? '').trim(),
      nbrPieceApp: Number(formValue.nbrPieceApp ?? 0),
      nbreChambreApp: Number(formValue.nbreChambreApp ?? 0),
      nbreSalonApp: Number(formValue.nbreSalonApp ?? 0),
      nbreSalleEauApp: Number(formValue.nbreSalleEauApp ?? 0),
      superficieBien: Number(formValue.superficieBien ?? 0),
      bienMeublerResidence: true,
      occupied: false,
      idCategorieChambre: categorie,
    };

    this.saving = true;
    this.subscriptions.add(
      this.apiService
        .saveAppartement(payload)
        .pipe(finalize(() => (this.saving = false)))
        .subscribe({
          next: () => {
            this.notificationService.notify(
              NotificationType.SUCCESS,
              'La residence a bien ete creee.'
            );
            this.router.navigate(['/residences']);
          },
          error: (error) => {
            this.errorMessage =
              error?.error?.messages ||
              error?.error?.message ||
              error?.message ||
              "Impossible d'enregistrer la residence.";
          },
        })
    );
  }

  public formatEtageLabel(etage: EtageDto): string {
    const parts = [etage.nomCompletEtage, etage.codeAbrvEtage].filter(Boolean);
    const label = parts.join(' - ').trim();
    return label || `Etage ${etage.id ?? ''}`.trim();
  }
}

