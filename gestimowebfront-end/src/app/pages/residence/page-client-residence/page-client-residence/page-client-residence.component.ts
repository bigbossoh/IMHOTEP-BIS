import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { ApiService } from 'src/gs-api/src/services/api.service';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurAfficheDto, ReservationAfficheDto, UtilisateurRequestDto } from 'src/gs-api/src/models';

export interface ClientResidenceVm extends UtilisateurAfficheDto {
  reservations: ReservationAfficheDto[];
  nbReservations: number;
  montantTotal: number;
  montantPaye: number;
  solde: number;
  hasActiveReservation: boolean;
}

@Component({
  standalone: false,
  selector: 'app-page-client-residence',
  templateUrl: './page-client-residence.component.html',
  styleUrls: ['./page-client-residence.component.css'],
})
export class PageClientResidenceComponent implements OnInit, OnDestroy {
  public user?: UtilisateurRequestDto;
  public loading = false;
  public errorMessage = '';
  public searchTerm = '';
  public filterStatus: 'tous' | 'actifs' | 'inactifs' = 'tous';
  public currentPage = 1;
  public pageSize = 10;
  public readonly pageSizeOptions = [10, 25, 50];
  public selectedClient: ClientResidenceVm | null = null;

  allClients: ClientResidenceVm[] = [];
  private sub?: Subscription;

  constructor(private api: ApiService, private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.load();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public load(): void {
    const idAgence = this.user?.idAgence;
    if (!idAgence) return;
    this.loading = true;
    this.errorMessage = '';
    this.selectedClient = null;

    this.sub = forkJoin({
      clients: this.api.listOfAllUtilisateurClientHotelOrderbyNameByAgence(idAgence),
      reservations: this.api.allreservationparagence(idAgence),
    }).subscribe({
      next: ({ clients, reservations }) => {
        this.allClients = (clients ?? []).map((c) => this.buildVm(c, reservations ?? []));
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les clients.';
        this.loading = false;
      },
    });
  }

  private buildVm(c: UtilisateurAfficheDto, reservations: ReservationAfficheDto[]): ClientResidenceVm {
    const res = reservations.filter((r) => r.idUtilisateur === c.id);
    const montantTotal = res.reduce((s, r) => s + Number(r.montantReservation ?? 0), 0);
    const montantPaye = res.reduce((s, r) => s + Number(r.montantPaye ?? 0), 0);
    const solde = res.reduce((s, r) => s + Math.max(Number(r.soldReservation ?? 0), 0), 0);
    const hasActiveReservation = res.some((r) => {
      if (!r.dateFin) return false;
      return new Date(r.dateFin).getTime() >= Date.now();
    });
    return { ...c, reservations: res, nbReservations: res.length, montantTotal, montantPaye, solde, hasActiveReservation };
  }

  get filteredClients(): ClientResidenceVm[] {
    let list = this.allClients;
    if (this.filterStatus === 'actifs') list = list.filter((c) => c.hasActiveReservation);
    if (this.filterStatus === 'inactifs') list = list.filter((c) => !c.hasActiveReservation);
    if (!this.searchTerm) return list;
    const term = this.searchTerm.toLowerCase();
    return list.filter((c) =>
      [c.nom, c.prenom, c.email, c.mobile, c.username, c.nationalite]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredClients.length / this.pageSize));
  }

  get safePage(): number {
    return Math.min(this.currentPage, this.totalPages);
  }

  get paginatedClients(): ClientResidenceVm[] {
    const start = (this.safePage - 1) * this.pageSize;
    return this.filteredClients.slice(start, start + this.pageSize);
  }

  get paginationStart(): number {
    return this.filteredClients.length === 0 ? 0 : (this.safePage - 1) * this.pageSize + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.safePage * this.pageSize, this.filteredClients.length);
  }

  get visiblePages(): number[] {
    const start = Math.max(1, this.safePage - 2);
    const end = Math.min(this.totalPages, start + 4);
    const adjusted = Math.max(1, end - 4);
    return Array.from({ length: end - adjusted + 1 }, (_, i) => adjusted + i);
  }

  get totalClients(): number { return this.allClients.length; }
  get totalActifs(): number { return this.allClients.filter((c) => c.hasActiveReservation).length; }
  get totalInactifs(): number { return this.allClients.filter((c) => !c.hasActiveReservation).length; }

  public fullName(c: UtilisateurAfficheDto): string {
    return [c.prenom, c.nom].filter(Boolean).join(' ') || c.username || '—';
  }

  public statusLabel(c: ClientResidenceVm): string {
    return c.hasActiveReservation ? 'Actif' : 'Inactif';
  }

  public statusClass(c: ClientResidenceVm): string {
    return c.hasActiveReservation ? 'status-badge status-badge--active' : 'status-badge';
  }

  public formatCurrency(v: number): string {
    return `${v.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} FCFA`;
  }

  public selectClient(c: ClientResidenceVm): void {
    this.selectedClient = this.selectedClient?.id === c.id ? null : c;
  }

  public isSelected(c: ClientResidenceVm): boolean {
    return this.selectedClient?.id === c.id;
  }

  public applySearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.currentPage = 1;
  }

  public setFilter(f: 'tous' | 'actifs' | 'inactifs'): void {
    this.filterStatus = f;
    this.currentPage = 1;
  }

  public onPageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (Number.isFinite(value) && value > 0) {
      this.pageSize = value;
      this.currentPage = 1;
    }
  }

  public prevPage(): void { this.currentPage = Math.max(1, this.safePage - 1); }
  public nextPage(): void { this.currentPage = Math.min(this.totalPages, this.safePage + 1); }
  public goToPage(page: number): void {
    this.currentPage = Math.min(Math.max(Number(page), 1), this.totalPages);
  }

  public trackById(_: number, c: ClientResidenceVm): number { return c.id ?? _; }

  public stayNights(r: ReservationAfficheDto): number {
    if (!r.dateDebut || !r.dateFin) return 0;
    return Math.max(
      Math.ceil((new Date(r.dateFin).getTime() - new Date(r.dateDebut).getTime()) / 86400000),
      1
    );
  }

  public reservationStatusLabel(r: ReservationAfficheDto): string {
    const guest = (r.utilisateurOperation || '').trim().toUpperCase();
    if (!guest || guest === 'XXX XXXXX') return 'Pré-réservation';
    if (Number(r.montantReservation ?? 0) > 0 && Math.max(Number(r.soldReservation ?? 0), 0) <= 0) return 'Soldée';
    if (Number(r.montantPaye ?? 0) > 0) return 'Acompte';
    return 'À confirmer';
  }

  public reservationStatusClass(r: ReservationAfficheDto): string {
    const l = this.reservationStatusLabel(r);
    if (l === 'Soldée') return 'badge badge--success';
    if (l === 'Acompte') return 'badge badge--warning';
    if (l === 'Pré-réservation') return 'badge badge--info';
    return 'badge badge--neutral';
  }
}
