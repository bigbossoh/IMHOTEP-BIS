import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetListReservationAction } from 'src/app/ngrx/reservation/reservation.actions';
import {
  ReservationState,
  ReservationStateEnum,
} from 'src/app/ngrx/reservation/reservation.reducer';
import { PageReglementReservationIndividuelComponent } from '../../page-reglement-reservation-individuel/page-reglement-reservation-individuel.component';
import { PageAjoutReservationComponent } from '../../page-ajout-reservation/page-ajout-reservation.component';
import { PrintServiceService } from 'src/app/services/Print/print-service.service';
import { UserService } from 'src/app/services/user/user.service';
import { ReservationAfficheDto, UtilisateurRequestDto } from 'src/gs-api/src/models';
import { saveAs } from 'file-saver';

type ReservationFilter =
  | 'all'
  | 'pending-client'
  | 'partial-payment'
  | 'settled';

@Component({
  standalone: false,
  selector: 'app-page-reservation-residence',
  templateUrl: './page-reservation-residence.component.html',
  styleUrls: ['./page-reservation-residence.component.css'],
})
export class PageReservationResidenceComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'reservation',
    'guest',
    'room',
    'stay',
    'payment',
    'status',
    'action',
  ];

  readonly pageSizeAppel = [6, 12, 24, 48];
  readonly reservationFilters: Array<{
    value: ReservationFilter;
    label: string;
    hint: string;
  }> = [
    {
      value: 'all',
      label: 'Toutes',
      hint: 'Vue générale du planning',
    },
    {
      value: 'pending-client',
      label: 'À finaliser',
      hint: 'Client ou chambre à confirmer',
    },
    {
      value: 'partial-payment',
      label: 'Acompte versé',
      hint: 'Séjours avec solde restant',
    },
    {
      value: 'settled',
      label: 'Soldées',
      hint: 'Réservations totalement encaissées',
    },
  ];

  @ViewChild('paginator') paginator!: MatPaginator;

  dataSource = new MatTableDataSource<ReservationAfficheDto>([]);
  totalRecords = 0;
  loading = false;
  errorMessage = '';
  searchTerm = '';
  selectedFilter: ReservationFilter = 'all';
  public user?: UtilisateurRequestDto;

  reservationState$: Observable<ReservationState> | null = null;

  private reservationStateSubscription?: Subscription;
  private allReservations: ReservationAfficheDto[] = [];

  constructor(
    private store: Store<any>,
    public dialog: MatDialog,
    private userService: UserService,
    private printService: PrintServiceService
  ) {}

  get totalReservations(): number {
    return this.allReservations.length;
  }

  get totalRevenue(): number {
    return this.allReservations.reduce(
      (sum, reservation) => sum + this.getPaidAmount(reservation),
      0
    );
  }

  get outstandingAmount(): number {
    return this.allReservations.reduce(
      (sum, reservation) => sum + this.getBalanceAmount(reservation),
      0
    );
  }

  get reservationsToFinalize(): number {
    return this.getFilterCount('pending-client');
  }

  get averageStay(): number {
    if (!this.allReservations.length) {
      return 0;
    }

    const nights = this.allReservations.reduce(
      (sum, reservation) => sum + this.getStayLength(reservation),
      0
    );
    return Math.round((nights / this.allReservations.length) * 10) / 10;
  }

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.reservationState$ = this.store.pipe(
      map((state) => state.reservationState)
    );
    this.bindReservationState();
    this.afficherLesReservation();
  }

  ngOnDestroy(): void {
    this.reservationStateSubscription?.unsubscribe();
  }

  encaissementReservation(row: ReservationAfficheDto): void {
    const dialogRef = this.dialog.open(
      PageReglementReservationIndividuelComponent,
      {
        data: { reservation: row },
      }
    );

    dialogRef.afterClosed().subscribe(() => {
      this.refreshReservations();
    });
  }

  creerUneReservation(): void {
    const dialogRef = this.dialog.open(PageAjoutReservationComponent, {
      data: { idReservation: 0 },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.refreshReservations();
    });
  }

  entrerEnChambre(reservation: ReservationAfficheDto): void {
    const dialogRef = this.dialog.open(PageAjoutReservationComponent, {
      data: { idReservation: reservation },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.refreshReservations();
    });
  }

  afficherLesReservation(): void {
    if (!this.user?.idAgence) {
      this.allReservations = [];
      this.refreshTable();
      return;
    }

    this.loading = true;
    this.store.dispatch(new GetListReservationAction(this.user.idAgence));
  }

  refreshReservations(): void {
    this.afficherLesReservation();
  }

  applyFilterAppel(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.refreshTable(true);
  }

  setReservationFilter(filter: ReservationFilter): void {
    this.selectedFilter = filter;
    this.refreshTable(true);
  }

  isReservationFilterActive(filter: ReservationFilter): boolean {
    return this.selectedFilter === filter;
  }

  getFilterCount(filter: ReservationFilter): number {
    return this.allReservations.filter((reservation) =>
      this.matchesSelectedFilter(reservation, filter)
    ).length;
  }

  getReservationCode(reservation: ReservationAfficheDto): string {
    return reservation.id ? `RES-${reservation.id}` : 'RES-NOUVELLE';
  }

  getGuestName(reservation: ReservationAfficheDto): string {
    if (this.needsClientCompletion(reservation)) {
      return 'Client à renseigner';
    }

    return (
      reservation.utilisateurOperation ||
      reservation.username ||
      reservation.email ||
      'Client non identifié'
    );
  }

  getGuestPartyLabel(reservation: ReservationAfficheDto): string {
    const adults = this.toNumber(reservation.nmbreAdulte);
    const children = this.toNumber(reservation.nmbrEnfant);
    return `${adults} adulte${adults > 1 ? 's' : ''} • ${children} enfant${
      children > 1 ? 's' : ''
    }`;
  }

  getRoomName(reservation: ReservationAfficheDto): string {
    return (
      reservation.bienImmobilierOperation ||
      reservation.designationBail ||
      reservation.nameCategori ||
      'Chambre à attribuer'
    );
  }

  getRoomMeta(reservation: ReservationAfficheDto): string {
    const category = reservation.descriptionCategori || reservation.nameCategori;
    const nightlyPrice = this.toNumber(reservation.priceCategori);

    if (category && nightlyPrice > 0) {
      return `${category} • ${nightlyPrice.toLocaleString('fr-FR')} FCFA / nuit`;
    }

    if (category) {
      return category;
    }

    if (nightlyPrice > 0) {
      return `${nightlyPrice.toLocaleString('fr-FR')} FCFA / nuit`;
    }

    return 'Tarif à confirmer';
  }

  getStayLength(reservation: ReservationAfficheDto): number {
    const startDate = this.toDate(reservation.dateDebut);
    const endDate = this.toDate(reservation.dateFin);

    if (!startDate || !endDate) {
      return 0;
    }

    const diff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return Math.max(diff, 1);
  }

  getTotalAmount(reservation: ReservationAfficheDto): number {
    return this.toNumber(reservation.montantReservation);
  }

  getPaidAmount(reservation: ReservationAfficheDto): number {
    return this.toNumber(reservation.montantPaye);
  }

  getBalanceAmount(reservation: ReservationAfficheDto): number {
    return Math.max(this.toNumber(reservation.soldReservation), 0);
  }

  getPaymentProgress(reservation: ReservationAfficheDto): number {
    const total = this.getTotalAmount(reservation);
    if (total <= 0) {
      return 0;
    }

    return Math.min(Math.round((this.getPaidAmount(reservation) / total) * 100), 100);
  }

  getReservationStatusLabel(reservation: ReservationAfficheDto): string {
    if (this.needsClientCompletion(reservation)) {
      return 'Pré-réservation';
    }

    if (this.isSettled(reservation)) {
      return 'Soldée';
    }

    if (this.getPaidAmount(reservation) > 0) {
      return 'Acompte versé';
    }

    return 'À confirmer';
  }

  getReservationStatusClass(reservation: ReservationAfficheDto): string {
    if (this.needsClientCompletion(reservation)) {
      return 'status-badge status-badge--draft';
    }

    if (this.isSettled(reservation)) {
      return 'status-badge status-badge--success';
    }

    if (this.getPaidAmount(reservation) > 0) {
      return 'status-badge status-badge--warning';
    }

    return 'status-badge status-badge--neutral';
  }

  getReservationStatusNote(reservation: ReservationAfficheDto): string {
    if (this.needsClientCompletion(reservation)) {
      return 'La réservation doit être finalisée avant l’entrée en chambre.';
    }

    if (this.isSettled(reservation)) {
      return 'Le séjour est complètement encaissé.';
    }

    if (this.getPaidAmount(reservation) > 0) {
      return `${this.getBalanceAmount(reservation).toLocaleString('fr-FR')} FCFA restent à encaisser.`;
    }

    return 'Aucun paiement encore enregistré.';
  }

  shouldShowCheckIn(reservation: ReservationAfficheDto): boolean {
    return this.needsClientCompletion(reservation);
  }

  printRecuPaiementReservation(reservationId?: number): void {
    if (!reservationId) {
      return;
    }

    this.user = this.userService.getUserFromLocalCache();
    if (!this.user?.idAgence) {
      return;
    }

    this.printService
      .recureservationparid(reservationId, this.user.idAgence, 'SABLIN SEVERIN')
      .subscribe((blob) => {
        saveAs(blob, `recu_de_paiement_${reservationId}.pdf`);
      });
  }

  private bindReservationState(): void {
    this.reservationStateSubscription?.unsubscribe();
    this.reservationStateSubscription = this.store
      .pipe(map((state) => state.reservationState))
      .subscribe((reservationState: ReservationState) => {
        this.loading =
          reservationState.dataState === ReservationStateEnum.LOADING;

        if (reservationState.dataState === ReservationStateEnum.ERROR) {
          this.errorMessage =
            reservationState.errorMessage ||
            'Impossible de charger les réservations.';
          this.loading = false;
          return;
        }

        if (
          reservationState.dataState === ReservationStateEnum.LOADED &&
          Array.isArray(reservationState.reservations)
        ) {
          this.errorMessage = '';
          this.allReservations = [...reservationState.reservations].sort(
            (left, right) =>
              this.getTimestamp(right.creationDate) -
              this.getTimestamp(left.creationDate)
          );
          this.refreshTable();
        }
      });
  }

  private refreshTable(resetPaginator = false): void {
    const rows = this.allReservations.filter(
      (reservation) =>
        this.matchesSelectedFilter(reservation, this.selectedFilter) &&
        this.matchesSearch(reservation)
    );

    this.totalRecords = rows.length;
    this.dataSource.data = rows;

    setTimeout(() => {
      if (!this.paginator) {
        return;
      }

      this.dataSource.paginator = this.paginator;
      if (resetPaginator) {
        this.paginator.firstPage();
      }
    });
  }

  private matchesSelectedFilter(
    reservation: ReservationAfficheDto,
    filter: ReservationFilter
  ): boolean {
    switch (filter) {
      case 'pending-client':
        return this.needsClientCompletion(reservation);
      case 'partial-payment':
        return !this.needsClientCompletion(reservation) && !this.isSettled(reservation);
      case 'settled':
        return this.isSettled(reservation);
      default:
        return true;
    }
  }

  private matchesSearch(reservation: ReservationAfficheDto): boolean {
    if (!this.searchTerm) {
      return true;
    }

    const searchIndex = [
      this.getReservationCode(reservation),
      this.getGuestName(reservation),
      this.getRoomName(reservation),
      this.getRoomMeta(reservation),
      reservation.dateDebut ?? '',
      reservation.dateFin ?? '',
      this.getReservationStatusLabel(reservation),
    ]
      .join(' ')
      .toLowerCase();

    return searchIndex.includes(this.searchTerm);
  }

  private isSettled(reservation: ReservationAfficheDto): boolean {
    return (
      this.getTotalAmount(reservation) > 0 &&
      this.getBalanceAmount(reservation) <= 0
    );
  }

  private needsClientCompletion(reservation: ReservationAfficheDto): boolean {
    const guest = (reservation.utilisateurOperation || '').trim().toUpperCase();
    return !guest || guest === 'XXX XXXXX';
  }

  private toNumber(value: number | null | undefined): number {
    return Number(value ?? 0);
  }

  private getTimestamp(value: number | string | null | undefined): number {
    if (value == null) {
      return 0;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
  }

  private toDate(value: string | null | undefined): Date | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
}
