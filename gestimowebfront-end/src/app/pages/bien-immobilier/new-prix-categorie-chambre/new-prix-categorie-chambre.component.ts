import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';
import { DialogData } from '../../baux/page-baux/page-baux.component';
import { NewCategorieChambreComponent } from '../../categorie-appartement/new-categorie-chambre/new-categorie-chambre.component';
import { CategorieChambreState } from 'src/app/ngrx/categoriechambre/categoriechambre.reducer';
import { Observable } from 'rxjs';
import { SavePrixChambreParCategorieActions } from 'src/app/ngrx/prix-par-categorie-chambre/prix-par-categorie-chambre.action';
import { map } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-new-prix-categorie-chambre',
  templateUrl: './new-prix-categorie-chambre.component.html',
  styleUrls: ['./new-prix-categorie-chambre.component.css'],
})
export class NewPrixCategorieChambreComponent implements OnInit {
  public user?: UtilisateurRequestDto;
  bauxState$: Observable<CategorieChambreState> | null = null;
  formGroup?: UntypedFormGroup;
  descpition: any;
  nombreDeJour: any;
  intervalPrix: any;
  prix: any;
  nbrDiffJour: any;
  constructor(
    private fb: UntypedFormBuilder,
    private store: Store<any>,
    private userService: UserService,
    public dialogRef: MatDialogRef<NewPrixCategorieChambreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  varData: any;
  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.varData = this.data;
    console.log('***THE DATA CALL IS ****');
    console.log(this.varData.cate.id);
  }
  onSaveForm() {

    this.formGroup = this.fb.group({
      id: [0],
      idAgence: [this.user?.idAgence],
      idCreateur: [this.user?.id],
      nombreDeJour: [this.nombreDeJour],
      prix: [this.prix],
      intervalPrix: [this.intervalPrix],
      description: [this.descpition],
      nbrDiffJour: [this.nbrDiffJour],
      idCategorieChambre: [this.varData.cate.id],
    });
    this.store.dispatch(
      new SavePrixChambreParCategorieActions(this.formGroup?.value)
    );
    this.bauxState$ = this.store.pipe(
      map((state) => state.categorieChambreState)
    );
    this.dialogRef.close();
  }
}
