import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  FormBuilder,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  QuittanceLoyerState,
  QuittanceloyerStateEnum,
} from 'src/app/ngrx/print-data/quittance-appel-loyer/quittance-appel-loyer.reducer';
import {
  GetLocataireEncaissementActions,
  SaveEncaissementActions,
  GetEncaissementBienActions,
} from 'src/app/ngrx/reglement/reglement.actions';
import {
  EncaissementState,
  EncaissementStateEnum,
} from 'src/app/ngrx/reglement/reglement.reducer';
import {
  GetListEncaissementReservationBienAction,
  GetListReservationOuvertAction,
  SaveEncaissementReservationAction,
} from 'src/app/ngrx/reservation/reservation.actions';
import {
  ReservationState,
  ReservationStateEnum,
} from 'src/app/ngrx/reservation/reservation.reducer';
import { GetAllLocatairesBailActions } from 'src/app/ngrx/utulisateur/utilisateur.actions';
import {
  UtilisteurState,
  UtilisteurStateEnum,
} from 'src/app/ngrx/utulisateur/utlisateur.reducer';
import { PrintServiceService } from 'src/app/services/Print/print-service.service';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';

@Component({
  standalone: false,
  selector: 'app-page-reglement-residence',
  templateUrl: './page-reglement-residence.component.html',
  styleUrls: ['./page-reglement-residence.component.css'],
})
export class PageReglementResidenceComponent implements OnInit {
  displayedColumns = [
    'idEncaiss',
    'Datedepaiement',
    'Loyer',
    'MontantPaye',
    'ModedeReglement',
    'soldedumois',
    'Actions',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  pageSize = [5, 10, 15, 20];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public user?: UtilisateurRequestDto;
  encaissementform?: UntypedFormGroup;
  leLocataire: any;
  submitted = false;
  periode: string = '';

  moisPaiement = '2022-12';

  reservationState$: Observable<ReservationState> | null = null;
  readonly ReservationStateEnum = ReservationStateEnum;
  montant_Loyer: number = 0;
  idDeAppel: any;
  printQuittance$: Observable<QuittanceLoyerState> | null = null;
  readonly QuittanceloyerStateEnum = QuittanceloyerStateEnum;
  totalRecords: number | undefined;
  encaissementReservationState$: Observable<ReservationState> | null = null;
  modePaiement: string = 'ESPESE';
  montantEnacaisse: any;

  public get remainingAmount(): number {
    const amount = Number(this.leLocataire?.soldReservation ?? 0);
    return Number.isFinite(amount) ? amount : 0;
  }

  public get paymentAmount(): number {
    const amount = Number(this.montantEnacaisse ?? 0);
    return Number.isFinite(amount) ? amount : 0;
  }

  public get newBalance(): number | null {
    if (!this.leLocataire) {
      return null;
    }

    return this.remainingAmount - this.paymentAmount;
  }

  public get canEncaisser(): boolean {
    if (!this.leLocataire) {
      return false;
    }

    const amount = this.paymentAmount;
    return amount > 0 && amount <= this.remainingAmount;
  }
  constructor(
    private fb: FormBuilder,
    private store: Store<any>,
    private userService: UserService,
    private printService: PrintServiceService
  ) {}
  compareObjects(o1: any, o2: any): boolean {
    return o1 !== o2;
  }
  compareAppels(o1: any, o2: any): boolean {
    return o1 == o2;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  ngAfterViewInit(): void {}
  afficherLesReservationOuverte() {
    this.user = this.userService.getUserFromLocalCache();
    this.store.dispatch(
      new GetListReservationOuvertAction(this.user!.idAgence)
    );
    this.reservationState$ = this.store.pipe(
      map((state) => state.reservationState)
    );
    this.store
      .pipe(map((state) => state.reservationState))
      .subscribe((data) => {
        this.totalRecords = 0;
        this.dataSource.data = [];
        this.dataSource.paginator = null;
        if (data.dataState == 'Loaded') {
          this.totalRecords = data.reservations.length;
          this.dataSource.data = data.reservations;
          this.dataSource.paginator = this.paginator;
        }
      });
  }
  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.afficherLesReservationOuverte();
  }

  public onReservationSelected(reservation: any | null): void {
    this.leLocataire = reservation;
    this.montantEnacaisse = null;

    if (!reservation?.id) {
      this.totalRecords = 0;
      this.dataSource.data = [];
      this.dataSource.paginator = null;
      return;
    }

    this.getAllEncaissementByBienImmobilier(reservation);
  }

  public cancelEncaissement(): void {
    this.montantEnacaisse = null;
  }

  onSaveEncaissement() {
    if (!this.canEncaisser) {
      return;
    }

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
    this.encaissementReservationState$ = this.store.pipe(
      map((state) => state.reservationState)
    );
    this.store
      .pipe(map((state) => state.reservationState))
      .subscribe((donnee) => {
        this.dataSource.data = [];
        this.dataSource.paginator = null;
        console.log('*** ** les datas de encaissement . *** *** *** ** ');
        console.log(donnee);
        if (donnee.dataState == 'Loaded') {
          this.dataSource.data = donnee.encaissements;
          this.dataSource.paginator = this.paginator;
          this.cancelEncaissement();
        }
      });
    this.ngAfterViewInit();
  }

  getAllEncaissementByBienImmobilier(p: any) {
    if (!p?.id) {
      this.totalRecords = 0;
      this.dataSource.data = [];
      this.dataSource.paginator = null;
      return;
    }

    this.store.dispatch(new GetListEncaissementReservationBienAction(p.id));
    this.encaissementReservationState$ = this.store.pipe(
      map((state) => state.reservationState)
    );
    this.store
      .pipe(map((state) => state.reservationState))
      .subscribe((data) => {
        this.totalRecords = 0;
        this.dataSource.data = [];
        this.dataSource.paginator = null;

        if (data.dataState == 'Loaded') {
          this.totalRecords = data.encaissementbiens.length;
          this.dataSource.data = data.encaissementbiens;
          this.dataSource.paginator = this.paginator;
        }
      });
  }

  printRecuPaiement(p: any) {
    this.user = this.userService.getUserFromLocalCache();
//recureservation(  idEncaissement:any,  idAgence:any,proprio:any)
    this.printService
      .recureservation(p,  this.user.idAgence,'SABLIN SEVERIN')
      .subscribe((blob) => {
        // console.log('La taille du fichier' + blob.size);
        saveAs(blob, 'recu_de_paiement_' + p + '.pdf');
      });
  }
}
