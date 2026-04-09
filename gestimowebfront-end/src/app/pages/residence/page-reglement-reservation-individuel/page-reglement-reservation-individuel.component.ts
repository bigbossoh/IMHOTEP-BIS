import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  QuittanceLoyerState,
  QuittanceloyerStateEnum,
} from 'src/app/ngrx/print-data/quittance-appel-loyer/quittance-appel-loyer.reducer';
import {
  GetListReservationOuvertAction,
  SaveEncaissementReservationAction,
} from 'src/app/ngrx/reservation/reservation.actions';
import {
  ReservationState,
  ReservationStateEnum,
} from 'src/app/ngrx/reservation/reservation.reducer';
import { PrintServiceService } from 'src/app/services/Print/print-service.service';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';
import { DialogData } from '../../baux/page-baux/page-baux.component';

@Component({
  standalone: false,
  selector: 'app-page-reglement-reservation-individuel',
  templateUrl: './page-reglement-reservation-individuel.component.html',
  styleUrls: ['./page-reglement-reservation-individuel.component.css'],
})
export class PageReglementReservationIndividuelComponent implements OnInit {
  public user?: UtilisateurRequestDto;
  encaissementform?: UntypedFormGroup;
  leLocataire: any;
  submitted = false;
  periode: string = '';

  reservationState$: Observable<ReservationState> | null = null;
  readonly ReservationStateEnum = ReservationStateEnum;
  montant_Loyer: number = 0;


  modePaiement: string = 'ESPESE';
  montantEnacaisse: any;
  constructor(
    public dialogRef: MatDialogRef<PageReglementReservationIndividuelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private store: Store<any>,
    private userService: UserService
  ) {}

  ngAfterViewInit(): void {}
reservation:any;
  ngOnInit(): void {
    this.reservation=this.data
    this.leLocataire=this.reservation.reservation

    this.user = this.userService.getUserFromLocalCache();
  }
  onSaveEncaissement() {
    this.store.dispatch(
      new SaveEncaissementReservationAction({
        idReservation: this.leLocataire.id,
        idAgence: this.user?.idAgence,
        idCreateur: this.user?.id,
        modePaiement: this.modePaiement,
        dateEncaissement: '2023-12-22',
        montantEncaissement: this.montantEnacaisse,
        encienSoldReservation: this.leLocataire.soldReservation,
        nvoSoldeReservation:
          this.leLocataire.soldReservation - this.montantEnacaisse,
        idAppartement: this.leLocataire.idAppartementdDto,
      })
    );
  }
}
