import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../baux/page-baux/page-baux.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListChambreCategorieActions } from 'src/app/ngrx/categoriechambre/categoriechambre.actions';
import {
  CategorieChambreState,
  CategorieChambreStateEnum,
} from 'src/app/ngrx/categoriechambre/categoriechambre.reducer';
import { Store } from '@ngrx/store';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { SaveAppartementCatActions } from 'src/app/ngrx/appartement/appartement.actions';
import {
  AppartementState,
  AppartementStateEnum,
} from 'src/app/ngrx/appartement/appartement.reducer';

@Component({
  standalone: false,
  selector: 'app-save-categorie-appart',
  templateUrl: './save-categorie-appart.component.html',
  styleUrls: ['./save-categorie-appart.component.css'],
})
export class SaveCategorieAppartComponent implements OnInit {
  listeDesCategorieChambre$: Observable<CategorieChambreState> | null = null;
  // test
  readonly CategorieChambreStateEnum = CategorieChambreStateEnum;
  formGroup?: UntypedFormGroup;
  public user?: UtilisateurRequestDto;
  readonly AppartementStateEnum = AppartementStateEnum;
  appartementState$: Observable<AppartementState> | null = null;
  cateModel: any;
  constructor(
    private fb: UntypedFormBuilder,
    private userService: UserService,
    private store: Store<any>,
    public dialogRef: MatDialogRef<SaveCategorieAppartComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  varData: any;
  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();

    this.store.dispatch(new ListChambreCategorieActions(this.user.idAgence));
    this.listeDesCategorieChambre$ = this.store.pipe(
      map((state) => state.categorieChambreState)
    );
    this.store
      .pipe(map((state) => state.categorieChambreState))
      .subscribe((data) => {
        if (data.dataState == 'Loaded') {
          console.log("loaded data")
          console.log(data)
        }
      });
    this.varData = this.data;

    this.formGroup = this.fb.group({
      id: [this.varData.bien.id],
      idCategorieChambre: [this.cateModel],
    });
  }
  onSaveForm() {
    this.formGroup = this.fb.group({
      id: [this.varData.bien.id],
      idCategorieChambre: [this.cateModel],
    });
    this.store.dispatch(new SaveAppartementCatActions(this.formGroup?.value));
    this.appartementState$ = this.store.pipe(
      map((state) => state.appartementState)
    );
    this.dialogRef.close();
  }
}
