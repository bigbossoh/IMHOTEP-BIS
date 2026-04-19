import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { GetListReservationAction } from 'src/app/ngrx/reservation/reservation.actions';
import {
  ReservationState,
  ReservationStateEnum,
} from 'src/app/ngrx/reservation/reservation.reducer';
import { PrintServiceService } from 'src/app/services/Print/print-service.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';
import { ReservationAfficheDto, UtilisateurRequestDto } from 'src/gs-api/src/models';

@Component({
  standalone: false,
  selector: 'app-page-factures-reservation',
  templateUrl: './page-factures-reservation.component.html',
  styleUrls: ['./page-factures-reservation.component.css'],
})
export class PageFacturesReservationComponent implements OnInit, OnDestroy {
  public user?: UtilisateurRequestDto;
  public loading = false;
  public errorMessage = '';
  public searchTerm = '';
  public currentPage = 1;
  public pageSize = 10;
  public readonly pageSizeOptions = [10, 25, 50];
  public generatingId: number | null = null;
  public certifyingId: number | null = null;

  allReservations: ReservationAfficheDto[] = [];
  private sub?: Subscription;

  constructor(
    private store: Store<any>,
    private userService: UserService,
    private printService: PrintServiceService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.bindState();
    this.load();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get filteredReservations(): ReservationAfficheDto[] {
    if (!this.searchTerm) {
      return this.allReservations;
    }
    const term = this.searchTerm.toLowerCase();
    return this.allReservations.filter((r) =>
      [
        this.factureNumero(r),
        this.guestName(r),
        this.roomName(r),
        r.dateDebut ?? '',
        r.dateFin ?? '',
      ]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredReservations.length / this.pageSize));
  }

  get safePage(): number {
    return Math.min(this.currentPage, this.totalPages);
  }

  get paginatedReservations(): ReservationAfficheDto[] {
    const start = (this.safePage - 1) * this.pageSize;
    return this.filteredReservations.slice(start, start + this.pageSize);
  }

  get paginationStart(): number {
    return this.filteredReservations.length === 0 ? 0 : (this.safePage - 1) * this.pageSize + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.safePage * this.pageSize, this.filteredReservations.length);
  }

  get visiblePages(): number[] {
    const start = Math.max(1, this.safePage - 2);
    const end = Math.min(this.totalPages, start + 4);
    const adjusted = Math.max(1, end - 4);
    return Array.from({ length: end - adjusted + 1 }, (_, i) => adjusted + i);
  }

  public factureNumero(r: ReservationAfficheDto): string {
    return r.id ? `FACT-${r.id}` : '—';
  }

  public guestName(r: ReservationAfficheDto): string {
    const name = (r.utilisateurOperation || '').trim().toUpperCase();
    return !name || name === 'XXX XXXXX' ? 'Client à renseigner' : r.utilisateurOperation ?? '—';
  }

  public roomName(r: ReservationAfficheDto): string {
    return r.bienImmobilierOperation || r.designationBail || '—';
  }

  public stayNights(r: ReservationAfficheDto): number {
    if (!r.dateDebut || !r.dateFin) return 0;
    const diff = Math.ceil(
      (new Date(r.dateFin).getTime() - new Date(r.dateDebut).getTime()) / 86400000
    );
    return Math.max(diff, 1);
  }

  public totalAmount(r: ReservationAfficheDto): number {
    return Number(r.montantReservation ?? 0);
  }

  public paidAmount(r: ReservationAfficheDto): number {
    return Number(r.montantPaye ?? 0);
  }

  public balance(r: ReservationAfficheDto): number {
    return Math.max(Number(r.soldReservation ?? 0), 0);
  }

  public statusLabel(r: ReservationAfficheDto): string {
    const guest = (r.utilisateurOperation || '').trim().toUpperCase();
    if (!guest || guest === 'XXX XXXXX') return 'Pré-réservation';
    if (this.totalAmount(r) > 0 && this.balance(r) <= 0) return 'Soldée';
    if (this.paidAmount(r) > 0) return 'Acompte versé';
    return 'À confirmer';
  }

  public statusClass(r: ReservationAfficheDto): string {
    const label = this.statusLabel(r);
    if (label === 'Soldée') return 'badge badge--success';
    if (label === 'Acompte versé') return 'badge badge--warning';
    if (label === 'Pré-réservation') return 'badge badge--info';
    return 'badge badge--neutral';
  }

  public formatCurrency(value: number): string {
    return `${value.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} FCFA`;
  }

  public isGenerating(r: ReservationAfficheDto): boolean {
    return this.generatingId === r.id;
  }

  public genererFacture(r: ReservationAfficheDto): void {
    const id = Number(r?.id);
    if (!Number.isFinite(id) || id <= 0 || this.generatingId !== null) return;

    this.generatingId = id;
    this.printService
      .factureReservation(id)
      .pipe(finalize(() => (this.generatingId = null)))
      .subscribe({
        next: (blob) => {
          saveAs(blob, `facture-reservation-${id}.pdf`);
          this.notificationService.notify(NotificationType.SUCCESS, `Facture ${this.factureNumero(r)} générée.`);
        },
        error: () => {
          this.notificationService.notify(NotificationType.ERROR, 'Impossible de générer la facture.');
        },
      });
  }

  public isCertifying(r: ReservationAfficheDto): boolean {
    return this.certifyingId === r.id;
  }

  public certifierReservation(r: ReservationAfficheDto): void {
    const id = Number(r?.id);
    if (!Number.isFinite(id) || id <= 0 || this.certifyingId !== null) return;

    this.certifyingId = id;
    // TODO: appeler l'endpoint de certification
    setTimeout(() => {
      this.certifyingId = null;
      this.notificationService.notify(NotificationType.SUCCESS, `Réservation ${this.factureNumero(r)} certifiée.`);
    }, 800);
  }

  public applySearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.currentPage = 1;
  }

  public onPageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (Number.isFinite(value) && value > 0) {
      this.pageSize = value;
      this.currentPage = 1;
    }
  }

  public prevPage(): void {
    this.currentPage = Math.max(1, this.safePage - 1);
  }

  public nextPage(): void {
    this.currentPage = Math.min(this.totalPages, this.safePage + 1);
  }

  public goToPage(page: number): void {
    this.currentPage = Math.min(Math.max(Number(page), 1), this.totalPages);
  }

  public trackBy(_: number, r: ReservationAfficheDto): number {
    return r.id ?? _;
  }

  public load(): void {
    if (!this.user?.idAgence) return;
    this.loading = true;
    this.store.dispatch(new GetListReservationAction(this.user.idAgence));
  }

  private bindState(): void {
    this.sub = this.store
      .pipe(map((state) => state.reservationState))
      .subscribe((s: ReservationState) => {
        this.loading = s.dataState === ReservationStateEnum.LOADING;

        if (s.dataState === ReservationStateEnum.ERROR) {
          this.errorMessage = s.errorMessage || 'Impossible de charger les réservations.';
          this.allReservations = [];
          return;
        }

        if (s.dataState === ReservationStateEnum.LOADED && Array.isArray(s.reservations)) {
          this.errorMessage = '';
          this.allReservations = [...s.reservations].sort(
            (a, b) => this.ts(b.creationDate) - this.ts(a.creationDate)
          );
        }
      });
  }

  private ts(v: number | string | null | undefined): number {
    if (v == null) return 0;
    const d = new Date(v);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  }
}
