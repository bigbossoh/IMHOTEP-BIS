import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { GetListReservationAction } from 'src/app/ngrx/reservation/reservation.actions';
import {
  ReservationState,
  ReservationStateEnum,
} from 'src/app/ngrx/reservation/reservation.reducer';
import { PrintServiceService } from 'src/app/services/Print/print-service.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';
import {
  PrestationAdditionnelReservationSaveOrrUpdate,
  ReservationAfficheDto,
  UtilisateurRequestDto,
} from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';
import { saveAs } from 'file-saver';
import { PageReglementReservationIndividuelComponent } from '../../page-reglement-reservation-individuel/page-reglement-reservation-individuel.component';
import { PageAjoutReservationComponent } from '../../page-ajout-reservation/page-ajout-reservation.component';

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
  public readonly reservationFilters: Array<{
    value: ReservationFilter;
    label: string;
  }> = [
    { value: 'all', label: 'Toutes' },
    { value: 'pending-client', label: 'À finaliser' },
    { value: 'partial-payment', label: 'Acompte' },
    { value: 'settled', label: 'Soldées' },
  ];

  public readonly reservationPageSizeOptions = [10, 25, 50];

  public user?: UtilisateurRequestDto;

  public loading = false;
  public errorMessage = '';
  public searchTerm = '';
  public selectedFilter: ReservationFilter = 'all';

  public dateDebutFilter = '';
  public dateFinFilter = '';

  public selectedReservationId: number | null = null;

  public reservationCurrentPage = 1;
  public reservationPageSize = 10;

  public prestationLinks: PrestationAdditionnelReservationSaveOrrUpdate[] = [];
  public prestationLinksLoading = false;
  public prestationLinksError = '';

  public deletingReservationId: number | null = null;

  private reservationStateSubscription?: Subscription;
  private prestationLinksSubscription?: Subscription;
  private allReservations: ReservationAfficheDto[] = [];

  constructor(
    private store: Store<any>,
    public dialog: MatDialog,
    private userService: UserService,
    private printService: PrintServiceService,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.bindReservationState();
    this.afficherLesReservation();
    this.refreshPrestationLinks();
  }

  ngOnDestroy(): void {
    this.reservationStateSubscription?.unsubscribe();
    this.prestationLinksSubscription?.unsubscribe();
  }

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

  get hasPeriodFilter(): boolean {
    return !!(this.dateDebutFilter || this.dateFinFilter);
  }

  get filteredReservations(): ReservationAfficheDto[] {
    return this.allReservations.filter(
      (reservation) =>
        this.matchesSelectedFilter(reservation, this.selectedFilter) &&
        this.matchesSearch(reservation) &&
        this.matchesPeriod(reservation)
    );
  }

  get totalRecords(): number {
    return this.filteredReservations.length;
  }

  get reservationTotalPages(): number {
    return Math.max(
      1,
      Math.ceil(this.filteredReservations.length / this.reservationPageSize)
    );
  }

  get currentReservationPageNumber(): number {
    return Math.min(this.reservationCurrentPage, this.reservationTotalPages);
  }

  get paginatedReservations(): ReservationAfficheDto[] {
    const start = (this.currentReservationPageNumber - 1) * this.reservationPageSize;
    return this.filteredReservations.slice(start, start + this.reservationPageSize);
  }

  get reservationPaginationStart(): number {
    if (this.filteredReservations.length === 0) {
      return 0;
    }

    return (this.currentReservationPageNumber - 1) * this.reservationPageSize + 1;
  }

  get reservationPaginationEnd(): number {
    return Math.min(
      this.currentReservationPageNumber * this.reservationPageSize,
      this.filteredReservations.length
    );
  }

  get reservationVisiblePages(): number[] {
    return this.buildVisiblePages(this.currentReservationPageNumber, this.reservationTotalPages);
  }

  get selectedReservation(): ReservationAfficheDto | undefined {
    if (this.selectedReservationId === null) {
      return undefined;
    }

    return this.filteredReservations.find((reservation) => reservation.id === this.selectedReservationId);
  }

  get selectedReservationPrestations(): PrestationAdditionnelReservationSaveOrrUpdate[] {
    const reservationId = this.selectedReservationId;
    if (!reservationId) {
      return [];
    }

    return this.prestationLinks.filter(
      (link) => Number(link.idReservation) === reservationId
    );
  }

  get selectedReservationPrestationsTotal(): number {
    return this.selectedReservationPrestations.reduce(
      (sum, link) => sum + this.toNumber(link.amountPrestation),
      0
    );
  }

  public trackByReservation(index: number, reservation: ReservationAfficheDto): number {
    return reservation.id ?? index;
  }

  public selectReservation(reservation: ReservationAfficheDto): void {
    this.selectedReservationId = reservation?.id ?? null;
  }

  public afficherLesReservation(): void {
    if (!this.user?.idAgence) {
      this.allReservations = [];
      this.selectedReservationId = null;
      return;
    }

    this.loading = true;
    this.store.dispatch(new GetListReservationAction(this.user.idAgence));
  }

  public refreshReservations(): void {
    this.afficherLesReservation();
    this.refreshPrestationLinks();
  }

  public applyFilterAppel(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.reservationCurrentPage = 1;
  }

  public setReservationFilter(filter: ReservationFilter): void {
    this.selectedFilter = filter;
    this.reservationCurrentPage = 1;
  }

  public applyPeriodFilter(): void {
    this.reservationCurrentPage = 1;
  }

  public resetPeriodFilter(): void {
    this.dateDebutFilter = '';
    this.dateFinFilter = '';
    this.reservationCurrentPage = 1;
  }

  public isReservationFilterActive(filter: ReservationFilter): boolean {
    return this.selectedFilter === filter;
  }

  public getFilterCount(filter: ReservationFilter): number {
    return this.allReservations.filter((reservation) =>
      this.matchesSelectedFilter(reservation, filter)
    ).length;
  }

  public onReservationPageSizeChange(event: Event): void {
    const rawValue = (event.target as HTMLSelectElement).value;
    const value = Number(rawValue);
    if (!Number.isFinite(value) || value <= 0) {
      return;
    }

    this.reservationPageSize = value;
    this.reservationCurrentPage = 1;
  }

  public previousReservationPage(): void {
    this.reservationCurrentPage = Math.max(1, this.currentReservationPageNumber - 1);
  }

  public nextReservationPage(): void {
    this.reservationCurrentPage = Math.min(
      this.reservationTotalPages,
      this.currentReservationPageNumber + 1
    );
  }

  public goToReservationPage(page: number): void {
    const safePage = Number(page);
    if (!Number.isFinite(safePage)) {
      return;
    }

    this.reservationCurrentPage = Math.min(
      Math.max(safePage, 1),
      this.reservationTotalPages
    );
  }

  public encaissementReservation(row: ReservationAfficheDto): void {
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

  public creerUneReservation(): void {
    const dialogRef = this.dialog.open(PageAjoutReservationComponent, {
      data: { idReservation: 0 },
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      maxHeight: '100vh',
      panelClass: 'reservation-dialog-panel',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.refreshReservations();
    });
  }

  public modifierReservation(reservation: ReservationAfficheDto): void {
    const dialogRef = this.dialog.open(PageAjoutReservationComponent, {
      data: { idReservation: reservation },
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      maxHeight: '100vh',
      panelClass: 'reservation-dialog-panel',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.refreshReservations();
    });
  }

  public entrerEnChambre(reservation: ReservationAfficheDto): void {
    const dialogRef = this.dialog.open(PageAjoutReservationComponent, {
      data: { idReservation: reservation, forceCheckIn: true },
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      maxHeight: '100vh',
      panelClass: 'reservation-dialog-panel',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.refreshReservations();
    });
  }

  public canDeleteReservation(reservation: ReservationAfficheDto): boolean {
    return this.getPaidAmount(reservation) <= 0;
  }

  public isDeletingReservation(reservation: ReservationAfficheDto): boolean {
    return (
      this.deletingReservationId !== null &&
      Number(reservation?.id) === this.deletingReservationId
    );
  }

  public supprimerReservation(reservation: ReservationAfficheDto): void {
    const id = Number(reservation?.id);
    if (!Number.isFinite(id) || id <= 0) {
      return;
    }

    const confirmed = confirm(
      `Supprimer la réservation ${this.getReservationCode(reservation)} ?\n\n` +
        `Attention: cette action supprime aussi les prestations et encaissements associés.`
    );
    if (!confirmed) {
      return;
    }

    this.deletingReservationId = id;
    this.apiService
      .deleteReservation(id)
      .pipe(finalize(() => (this.deletingReservationId = null)))
      .subscribe({
        next: () => {
          this.notificationService.notify(
            NotificationType.SUCCESS,
            'Réservation supprimée.'
          );
          if (this.selectedReservationId === id) {
            this.selectedReservationId = null;
          }
          this.refreshReservations();
        },
        error: (error) => {
          this.notificationService.notify(
            NotificationType.ERROR,
            this.getApiErrorMessage(
              error,
              'Impossible de supprimer la réservation.'
            )
          );
        },
      });
  }

  public formatCurrency(value: unknown): string {
    const amount = Number(value ?? 0);
    const safe = Number.isFinite(amount) ? amount : 0;
    return `${safe.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} FCFA`;
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

  public imprimerFactureReservation(reservationId?: number): void {
    if (!reservationId) {
      return;
    }

    this.printService.factureReservation(reservationId).subscribe({
      next: (blob) => {
        saveAs(blob, `facture-reservation-${reservationId}.pdf`);
      },
      error: () => {
        this.notificationService.notify(
          NotificationType.ERROR,
          'Impossible de générer la facture.'
        );
      },
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
          this.allReservations = [];
          this.selectedReservationId = null;
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

          if (
            this.selectedReservationId !== null &&
            !this.allReservations.some((reservation) => reservation.id === this.selectedReservationId)
          ) {
            this.selectedReservationId = null;
          }

          this.reservationCurrentPage = Math.min(
            Math.max(this.reservationCurrentPage, 1),
            this.reservationTotalPages
          );
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
        return (
          !this.needsClientCompletion(reservation) &&
          !this.isSettled(reservation) &&
          this.getPaidAmount(reservation) > 0
        );
      case 'settled':
        return this.isSettled(reservation);
      default:
        return true;
    }
  }

  private matchesPeriod(reservation: ReservationAfficheDto): boolean {
    if (!this.dateDebutFilter && !this.dateFinFilter) {
      return true;
    }
    const resStart = this.toDate(reservation.dateDebut);
    const resEnd = this.toDate(reservation.dateFin);
    if (!resStart || !resEnd) {
      return false;
    }
    const filterStart = this.dateDebutFilter ? new Date(this.dateDebutFilter) : null;
    const filterEnd = this.dateFinFilter ? new Date(this.dateFinFilter) : null;
    // reservation overlaps with the chosen range
    if (filterStart && filterEnd) {
      return resStart <= filterEnd && resEnd >= filterStart;
    }
    if (filterStart) {
      return resEnd >= filterStart;
    }
    // filterEnd only
    return resStart <= filterEnd!;
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

  private refreshPrestationLinks(): void {
    const idAgence = this.user?.idAgence;
    if (!idAgence) {
      this.prestationLinks = [];
      this.prestationLinksError = '';
      return;
    }

    this.prestationLinksSubscription?.unsubscribe();
    this.prestationLinksLoading = true;
    this.prestationLinksError = '';

    this.prestationLinksSubscription = this.apiService
      .findAllServiceAdditionnelPrestationAdditionnel()
      .pipe(finalize(() => (this.prestationLinksLoading = false)))
      .subscribe({
        next: (data) => {
          const list = Array.isArray(data) ? data : [];
          this.prestationLinks = list
            .filter((link) => !link.idAgence || link.idAgence === idAgence)
            .sort((left, right) =>
              (left?.namePrestaion ?? '').localeCompare(
                right?.namePrestaion ?? '',
                'fr',
                { sensitivity: 'base' }
              )
            );
        },
        error: () => {
          this.prestationLinksError =
            'Impossible de charger les prestations associées.';
          this.prestationLinks = [];
        },
      });
  }

  private getApiErrorMessage(error: any, fallback: string): string {
    return (
      error?.error?.message ||
      error?.error?.messages ||
      error?.message ||
      fallback
    );
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

  private buildVisiblePages(currentPage: number, totalPages: number): number[] {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    const adjustedStart = Math.max(1, end - 4);

    return Array.from(
      { length: end - adjustedStart + 1 },
      (_, index) => adjustedStart + index
    );
  }
}
