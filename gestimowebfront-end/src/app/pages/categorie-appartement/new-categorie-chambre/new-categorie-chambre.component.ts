import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../../baux/page-baux/page-baux.component';
import { UserService } from 'src/app/services/user/user.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ApiService } from 'src/gs-api/src/services';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import {
  CategoryChambreSaveOrUpdateDto,
  PrixParCategorieChambreDto,
  UtilisateurRequestDto,
} from 'src/gs-api/src/models';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

interface TarifRow {
  id: number;
  nombreDeJour: string;
  nbrDiffJour: number | null;
  prix: number | null;
  intervalPrix: number | null;
  description: string;
}

@Component({
  standalone: false,
  selector: 'app-new-categorie-chambre',
  templateUrl: './new-categorie-chambre.component.html',
  styleUrls: ['./new-categorie-chambre.component.css'],
})
export class NewCategorieChambreComponent implements OnInit {
  formGroup?: UntypedFormGroup;
  nom: any;
  descpition: any;
  prixParHeureJour: any;
  prixParHeureNuit: any;

  tarifRows: TarifRow[] = [];
  saving = false;
  errorMessage = '';

  private idCategorieAModifier = 0;

  get isEditMode(): boolean {
    return this.idCategorieAModifier > 0;
  }

  constructor(
    private fb: UntypedFormBuilder,
    private userService: UserService,
    private apiService: ApiService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<NewCategorieChambreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  public user?: UtilisateurRequestDto;
  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();

    const categorie = (this.data as any)?.categorie;
    if (categorie) {
      this.idCategorieAModifier = Number(categorie.id) || 0;
      this.nom = categorie.name;
      this.descpition = categorie.description;
      this.prixParHeureJour = categorie.prixParHeureJour;
      this.prixParHeureNuit = categorie.prixParHeureNuit;

      const existingTarifs: PrixParCategorieChambreDto[] = Array.isArray(categorie.prixGategorieDto)
        ? categorie.prixGategorieDto
        : [];
      this.tarifRows = existingTarifs.map((tarif) => ({
        id: Number(tarif.id) || 0,
        nombreDeJour: tarif.nombreDeJour ?? '',
        nbrDiffJour: tarif.nbrDiffJour ?? null,
        prix: tarif.prix ?? null,
        intervalPrix: tarif.intervalPrix ?? null,
        description: tarif.description ?? '',
      }));
    }

    if (!this.tarifRows.length) {
      this.addTarifRow();
    }
  }

  addTarifRow(): void {
    this.tarifRows.push({
      id: 0,
      nombreDeJour: '',
      nbrDiffJour: null,
      prix: null,
      intervalPrix: null,
      description: '',
    });
  }

  removeTarifRow(index: number): void {
    this.tarifRows.splice(index, 1);
  }

  trackByTarifRow(index: number): number {
    return index;
  }

  onSaveForm() {
    if (!this.nom?.trim() || this.saving) {
      return;
    }

    this.errorMessage = '';
    this.saving = true;

    const categoriePayload: CategoryChambreSaveOrUpdateDto = {
      id: this.idCategorieAModifier,
      idAgence: this.user?.idAgence,
      idCreateur: this.user?.id,
      name: this.nom,
      description: this.descpition,
      prixParHeureJour: Number(this.prixParHeureJour) || 0,
      prixParHeureNuit: Number(this.prixParHeureNuit) || 0,
    };

    this.apiService
      .saveOrUpdateCategoryChambre(categoriePayload)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (savedCategorie) => this.saveTarifRows(savedCategorie),
        error: () => {
          this.errorMessage = "Impossible d'enregistrer la catégorie.";
          this.notificationService.notify(NotificationType.ERROR, this.errorMessage);
        },
      });
  }

  private saveTarifRows(savedCategorie: CategoryChambreSaveOrUpdateDto): void {
    const idCategorieChambre = savedCategorie?.id;
    const rowsToSave = this.tarifRows.filter(
      (row) => !!row.nombreDeJour?.trim() && Number(row.nbrDiffJour) > 0 && Number(row.prix) > 0
    );

    if (!idCategorieChambre || !rowsToSave.length) {
      this.finishSave();
      return;
    }

    const requests = rowsToSave.map((row) => {
      const payload: PrixParCategorieChambreDto = {
        id: row.id,
        idAgence: this.user?.idAgence,
        idCreateur: this.user?.id,
        nombreDeJour: row.nombreDeJour,
        nbrDiffJour: Number(row.nbrDiffJour),
        prix: Number(row.prix),
        intervalPrix: Number(row.intervalPrix) || 0,
        description: row.description,
        idCategorieChambre,
      };
      return this.apiService.saveOrUpDatePrixParCategorie(payload);
    });

    forkJoin(requests).subscribe({
      next: () => this.finishSave(),
      error: () => {
        this.errorMessage = "La catégorie a été enregistrée, mais l'enregistrement des tarifs a échoué.";
        this.notificationService.notify(NotificationType.ERROR, this.errorMessage);
        this.finishSave();
      },
    });
  }

  private finishSave(): void {
    this.notificationService.notify(NotificationType.SUCCESS, 'Enregistrement éffectué avec succès.');
    this.dialogRef.close(true);
  }
}
