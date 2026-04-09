import { AppelLoyerState } from 'src/app/ngrx/appelloyer/appelloyer.reducer';
import { UserService } from './../../../services/user/user.service';
import { UtilisateurRequestDto } from './../../../../gs-api/src/models/utilisateur-request-dto';
import { SaveReductionActions } from './../../../ngrx/appelloyer/appelloyer.actions';
import { DialogData } from './../../baux/page-baux/page-baux.component';
import { Store } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-reduction-appel-loyer',
  templateUrl: './reduction-appel-loyer.component.html',
  styleUrls: ['./reduction-appel-loyer.component.css'],
})
export class ReductionAppelLoyerComponent implements OnInit {
  public user?: UtilisateurRequestDto;
  formGroup?: UntypedFormGroup;
  appelState$: Observable<AppelLoyerState> | null = null;
  periode: any;
  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<ReductionAppelLoyerComponent>,
    private store: Store<any>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.formGroup = this.fb.group({
      idAgence: [this.user.idAgence],
      periodeAppelLoyer: [this.data.id],
      tauxApplique: [0],
      messageReduction: [],
    });
    this.periode = this.data.id;
  }
  saveReduction() {
    console.warn('Le formulaire est pour reduction');
    console.log(this.formGroup?.value);

    this.store.dispatch(new SaveReductionActions(this.formGroup?.value));
    this.appelState$ = this.store.pipe(map((state) => state.bauxState));
    this.onClose();
  }
  onClose() {
    this.dialogRef.close();
  }
}
