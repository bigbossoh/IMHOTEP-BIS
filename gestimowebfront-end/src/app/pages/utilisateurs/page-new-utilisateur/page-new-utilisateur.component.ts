import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';
import { SaveUserActions } from '../../../ngrx/utulisateur/utilisateur.actions';
import {
  UtilisteurState,
  UtilisteurStateEnum,
} from '../../../ngrx/utulisateur/utlisateur.reducer';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PasswordValidation } from './password-validator';
import { GetDefaultEtabNameActions } from 'src/app/ngrx/etablissement/etablisement.action';
import { EtablissementState } from 'src/app/ngrx/etablissement/etablissement.reducer';

@Component({
  standalone: false,
  selector: 'app-page-new-utilisateur',
  templateUrl: './page-new-utilisateur.component.html',
  styleUrls: ['./page-new-utilisateur.component.css'],
})
export class PageNewUtilisateurComponent implements OnInit {
  utilisateurState$: Observable<UtilisteurState> | null = null;
  readonly UtilisteurStateEnum = UtilisteurStateEnum;
  public user?: UtilisateurRequestDto;
  private subscriptions: Subscription[] = [];
  nomProfil = '';
  nomPrenom = '';
  nomRole = '';
  newUserForm!: UntypedFormGroup;

  submitted = false;
  actionBtn: String = 'Enregistrer';
  hide = true;
  idCompare= 0;

  etablissementState$: Observable<EtablissementState> | null = null;
  idEtabl: any = 0;

  constructor(
    private store: Store<any>,
    private userService: UserService,
    private notificationService: NotificationService,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public editDataUser: any,
    private dialogRef: MatDialogRef<PageNewUtilisateurComponent>
  ) {}

  // checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
  //   let password = group.get('password')!.value;
  //   let repassword = group.get('repassword')!.value
  //   return password === repassword ? null : { notSame: true }
  // }

  ngOnInit(): void {

    this.user = this.userService.getUserFromLocalCache();
    this.store.dispatch(new GetDefaultEtabNameActions(this.user.id));
    this.etablissementState$ = this.store.pipe(
      map((state) => state.etablissementState)
    );
    this.store
      .pipe(map((state) => state.etablissementState))
      .subscribe((data) => {
        if (data.dataState == 'Loaded') {
          this.idEtabl = data.etabname.chapite;
        }
      });
    this.newUserForm = this.fb.group(
      {
        id: [0],
        idAgence: [this.user?.idAgence],
        idCreateur: [this.user?.id],
        nom: ['', [Validators.required]],
        prenom: [''],
        email: ['', [ Validators.email]],
        mobile: [''],
        dateDeNaissance: [''],
        lieuNaissance: [''],
        typePieceIdentite: [''],
        numeroPieceIdentite: [''],
        dateDebutPiece: [''],
        dateFinPiece: [''],
        nationalité: [''],
        genre: [''],
        username: ['', [Validators.required, Validators.minLength(10)]],
        password: ['', [Validators.required, Validators.minLength(2)]],
        repassword: [''],
        profileImageUrl: [''],
        lastLoginDate: [''],
        lastLoginDateDisplay: [''],
        joinDate: [''],
        roleUsed: ['', Validators.required],
        agenceDto: [''],
        userCreate: [''],
        nonLocked: [true],
        activated: [true],
        active: [true],
        idEtablissement:[this.idEtabl]
      }
      // , {
      //   validator: PasswordValidation.MatchPassword
      // }
    );
    if (this.editDataUser) {
      this.idCompare = this.editDataUser.id;
      this.actionBtn = 'Modifier';

      this.newUserForm.controls['id'].setValue(this.editDataUser.id);
      this.newUserForm.controls['idAgence'].setValue(
        this.editDataUser.idAgence
      );
      this.newUserForm.controls['idCreateur'].setValue(
        this.editDataUser.idCreateur
      );
      this.newUserForm.controls['nom'].setValue(this.editDataUser.nom);
      this.newUserForm.controls['prenom'].setValue(this.editDataUser.prenom);
      this.newUserForm.controls['email'].setValue(this.editDataUser.email);
      this.newUserForm.controls['mobile'].setValue(this.editDataUser.mobile);

      this.newUserForm.controls['dateDeNaissance'].setValue(
        this.editDataUser.dateDeNaissance
      );
      this.newUserForm.controls['lieuNaissance'].setValue(
        this.editDataUser.lieuNaissance
      );
      this.newUserForm.controls['typePieceIdentite'].setValue(
        this.editDataUser.typePieceIdentite
      );
      this.newUserForm.controls['numeroPieceIdentite'].setValue(
        this.editDataUser.numeroPieceIdentite
      );
      this.newUserForm.controls['dateDebutPiece'].setValue(
        this.editDataUser.dateDebutPiece
      );
      this.newUserForm.controls['dateFinPiece'].setValue(
        this.editDataUser.dateFinPiece
      );
      this.newUserForm.controls['nationalité'].setValue(
        this.editDataUser.nationalité
      );
      this.newUserForm.controls['genre'].setValue(this.editDataUser.genre);

      this.newUserForm.controls['username'].setValue(
        this.editDataUser.username
      );
      this.newUserForm.controls['password'].setValue(
        this.editDataUser.password
      );
      this.newUserForm.controls['repassword'].setValue(
        this.editDataUser.repassword
      );
      this.newUserForm.controls['profileImageUrl'].setValue(
        this.editDataUser.profileImageUrl
      );
      this.newUserForm.controls['lastLoginDate'].setValue(
        this.editDataUser.lastLoginDate
      );
      this.newUserForm.controls['lastLoginDateDisplay'].setValue(
        this.editDataUser.lastLoginDateDisplay
      );

      this.newUserForm.controls['joinDate'].setValue(
        this.editDataUser.joinDate
      );
      if(this.editDataUser.roleUsed=="ROLE_GERANT"){
        this.newUserForm.controls['roleUsed'].setValue(
          "GERANT"
        );
      }
      if(this.editDataUser.roleUsed=="ROLE_PROPRIETAIRE"){
        this.newUserForm.controls['roleUsed'].setValue(
          "PROPRIETAIRE"
        );
      }
      if(this.editDataUser.roleUsed=="ROLE_LOCATAIRE"){
        this.newUserForm.controls['roleUsed'].setValue(
          "LOCATAIRE"
        );
      }
      this.newUserForm.controls['agenceDto'].setValue(
        this.editDataUser.agenceDto
      );
      this.newUserForm.controls['userCreate'].setValue(
        this.editDataUser.userCreate
      );
      this.newUserForm.controls['nonLocked'].setValue(
        this.editDataUser.nonLocked
      );
      this.newUserForm.controls['activated'].setValue(
        this.editDataUser.activated
      );

      this.newUserForm.controls['active'].setValue(this.editDataUser.active);
      this.newUserForm.controls['idEtablissement'].setValue(this.idEtabl);
    }
  }
  // private clickButton(buttonId: string): void {
  //   document.getElementById(buttonId)!.click();
  // }
  onAddNewUser(): void {}
  saveNewUser(): void {
    this.newUserForm.patchValue({
      userCreate: this.user?.id,
      mobile: this.newUserForm.controls['username'].value,
      agenceDto: this.user?.idAgence,
      idAgence: this.user?.idAgence
    });
    if (this.newUserForm.invalid) {
      return;
    }
    console.log(this.newUserForm.value);
    if (this.idCompare != 0) {

    this.store.dispatch(new SaveUserActions(this.newUserForm.value));
    this.newUserForm.reset();
    this.onClose();
  }else{

      this.store.dispatch(new SaveUserActions(this.newUserForm.value));
      this.newUserForm.reset();
    this.onClose();
    }
  }
  onClose() {
    this.dialogRef.close();
  }
  private sendErrorNotification(
    notificationType: NotificationType,
    message: string
  ): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(
        notificationType,
        'An error occurred. Please try again.'
      );
    }
  }
}
