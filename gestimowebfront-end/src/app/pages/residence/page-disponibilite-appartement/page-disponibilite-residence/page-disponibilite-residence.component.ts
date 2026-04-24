import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { ApiService } from 'src/gs-api/src/services/api.service';
import { UserService } from 'src/app/services/user/user.service';
import {
  AppartementDto,
  CategoryChambreSaveOrUpdateDto,
  ReservationAfficheDto,
  UtilisateurRequestDto,
} from 'src/gs-api/src/models';

export interface ChambreVm extends AppartementDto {
  reservations: ReservationAfficheDto[];
  reservationEnCours: ReservationAfficheDto | null;
  isDisponible: boolean;
  prochainLibre: Date | null;
  prixBase: number;
}

export interface GanttWeekSegment {
  start: Date;
  days: number;
}

@Component({
  standalone: false,
  selector: 'app-page-disponibilite-residence',
  templateUrl: './page-disponibilite-residence.component.html',
  styleUrls: ['./page-disponibilite-residence.component.css'],
})
export class PageDisponibiliteResidenceComponent implements OnInit, OnDestroy {
  public user?: UtilisateurRequestDto;
  public loading = false;
  public errorMessage = '';
  public searchTerm = '';
  public filterStatus: 'toutes' | 'libres' | 'occupees' = 'toutes';
  public filterCategorie = '';
  public currentPage = 1;
  public pageSize = 10;
  public readonly pageSizeOptions = [10, 25, 50];
  public selectedChambre: ChambreVm | null = null;

  public dateDebut = '';
  public dateFin = '';

  /* ── Gantt ── */
  public ganttOffset = 0;
  public ganttStartDate: Date = new Date();
  public ganttEndDate: Date = new Date();
  public ganttDaysArr: Date[] = [];
  public ganttWeekSegments: GanttWeekSegment[] = [];
  public ganttTotalDaysCount = 30;
  public readonly ganttDayWidthPx = 40;

  allChambres: ChambreVm[] = [];
  categories: CategoryChambreSaveOrUpdateDto[] = [];
  private sub?: Subscription;

  constructor(private api: ApiService, private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.refreshGantt();
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
    this.selectedChambre = null;

    this.sub = forkJoin({
      appartements: this.api.findAllAppartementMeuble(idAgence),
      reservations: this.api.allreservationparagence(idAgence),
      categories: this.api.findAllCategorieChambre(idAgence),
    }).subscribe({
      next: ({ appartements, reservations, categories }) => {
        this.categories = categories ?? [];
        this.allChambres = (appartements ?? []).map((a) =>
          this.buildVm(a, reservations ?? [])
        );
        this.refreshGantt();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les disponibilités.';
        this.loading = false;
      },
    });
  }

  private buildVm(a: AppartementDto, reservations: ReservationAfficheDto[]): ChambreVm {
    const res = reservations.filter((r) => r.idAppartementdDto === a.id);
    const now = new Date();

    const reservationEnCours =
      res.find((r) => {
        if (!r.dateDebut || !r.dateFin) return false;
        return new Date(r.dateDebut) <= now && new Date(r.dateFin) >= now;
      }) ?? null;

    const futuresRes = res
      .filter((r) => r.dateFin && new Date(r.dateFin) > now)
      .sort((a, b) => new Date(a.dateFin!).getTime() - new Date(b.dateFin!).getTime());

    const prochainLibre = reservationEnCours?.dateFin
      ? new Date(reservationEnCours.dateFin)
      : null;

    const prixBase = Number(a.priceCategorie ?? 0);

    const isDisponible = this.checkDisponibilite(a, res);

    return { ...a, reservations: res, reservationEnCours, isDisponible, prochainLibre, prixBase };
  }

  private checkDisponibilite(a: AppartementDto, res: ReservationAfficheDto[]): boolean {
    if (this.dateDebut && this.dateFin) {
      const start = new Date(this.dateDebut);
      const end = new Date(this.dateFin);
      return !res.some((r) => {
        if (!r.dateDebut || !r.dateFin) return false;
        return new Date(r.dateDebut) < end && new Date(r.dateFin) > start;
      });
    }
    return !a.occupied;
  }

  public applyDateFilter(): void {
    if (!this.dateDebut || !this.dateFin) return;
    this.allChambres = this.allChambres.map((c) => ({
      ...c,
      isDisponible: this.checkDisponibilite(c, c.reservations),
    }));
    this.currentPage = 1;
    this.selectedChambre = null;
    this.refreshGantt();
  }

  public resetDateFilter(): void {
    this.dateDebut = '';
    this.dateFin = '';
    this.allChambres = this.allChambres.map((c) => ({
      ...c,
      isDisponible: !c.occupied,
    }));
    this.currentPage = 1;
    this.selectedChambre = null;
    this.refreshGantt();
  }

  /* ── Gantt navigation ── */
  public ganttPrev(): void { this.ganttOffset -= 7; this.refreshGantt(); }
  public ganttNext(): void { this.ganttOffset += 7; this.refreshGantt(); }
  public ganttReset(): void { this.ganttOffset = 0; this.refreshGantt(); }

  public isWeekStart(d: Date): boolean { return d.getDay() === 1; }

  public isWeekend(d: Date): boolean { return d.getDay() === 0 || d.getDay() === 6; }

  public isToday(d: Date): boolean {
    const t = new Date();
    return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
  }

  public getTodayLeft(): number {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const diff = (today.getTime() - this.ganttStartDate.getTime()) / 86400000;
    return (diff / this.ganttTotalDaysCount) * 100;
  }

  public getBarLeft(r: ReservationAfficheDto): number {
    if (!r.dateDebut) return 0;
    const start = new Date(r.dateDebut); start.setHours(0, 0, 0, 0);
    const clamped = start < this.ganttStartDate ? this.ganttStartDate : start;
    const diff = (clamped.getTime() - this.ganttStartDate.getTime()) / 86400000;
    return Math.max(0, (diff / this.ganttTotalDaysCount) * 100);
  }

  public getBarWidth(r: ReservationAfficheDto): number {
    if (!r.dateDebut || !r.dateFin) return 0;
    const start = new Date(r.dateDebut); start.setHours(0, 0, 0, 0);
    const end = new Date(r.dateFin); end.setHours(0, 0, 0, 0);
    const ganttEndPlusOne = new Date(this.ganttEndDate);
    ganttEndPlusOne.setDate(ganttEndPlusOne.getDate() + 1);
    const clampStart = start < this.ganttStartDate ? this.ganttStartDate : start;
    const clampEnd = end > ganttEndPlusOne ? ganttEndPlusOne : end;
    const days = (clampEnd.getTime() - clampStart.getTime()) / 86400000;
    return Math.max(0, (days / this.ganttTotalDaysCount) * 100);
  }

  public getBarColor(r: ReservationAfficheDto): string {
    const guest = (r.utilisateurOperation || '').trim().toUpperCase();
    if (!guest || guest === 'XXX XXXXX') return 'gantt-bar--draft';
    const balance = Number(r.soldReservation ?? 0);
    const paid = Number(r.montantPaye ?? 0);
    if (balance <= 0 && paid > 0) return 'gantt-bar--settled';
    if (paid > 0) return 'gantt-bar--partial';
    return 'gantt-bar--pending';
  }

  public getBarTooltip(r: ReservationAfficheDto): string {
    const name = this.guestName(r);
    const s = r.dateDebut ? new Date(r.dateDebut).toLocaleDateString('fr-FR') : '?';
    const e = r.dateFin ? new Date(r.dateFin).toLocaleDateString('fr-FR') : '?';
    return `${name} · ${s} → ${e} (${this.stayNights(r)} nuit(s))`;
  }

  public isInPeriod(d: Date): boolean {
    if (!this.dateDebut || !this.dateFin) return false;
    const start = new Date(this.dateDebut); start.setHours(0, 0, 0, 0);
    const end = new Date(this.dateFin); end.setHours(0, 0, 0, 0);
    return d >= start && d <= end;
  }

  public getPeriodLeft(): number {
    if (!this.dateDebut) return 0;
    const start = new Date(this.dateDebut); start.setHours(0, 0, 0, 0);
    const clamped = start < this.ganttStartDate ? this.ganttStartDate : start;
    const diff = (clamped.getTime() - this.ganttStartDate.getTime()) / 86400000;
    return Math.max(0, (diff / this.ganttTotalDaysCount) * 100);
  }

  public getPeriodWidth(): number {
    if (!this.dateDebut || !this.dateFin) return 0;
    const start = new Date(this.dateDebut); start.setHours(0, 0, 0, 0);
    const end = new Date(this.dateFin); end.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() + 1);
    const clampStart = start < this.ganttStartDate ? this.ganttStartDate : start;
    const ganttEndPlusOne = new Date(this.ganttEndDate);
    ganttEndPlusOne.setDate(ganttEndPlusOne.getDate() + 1);
    const clampEnd = end > ganttEndPlusOne ? ganttEndPlusOne : end;
    const days = (clampEnd.getTime() - clampStart.getTime()) / 86400000;
    return Math.max(0, (days / this.ganttTotalDaysCount) * 100);
  }

  public getBarsForChambre(c: ChambreVm): ReservationAfficheDto[] {
    return c.reservations.filter((r) => {
      if (!r.dateDebut || !r.dateFin) return false;
      const s = new Date(r.dateDebut); const e = new Date(r.dateFin);
      return s <= this.ganttEndDate && e >= this.ganttStartDate;
    });
  }

  public refreshGantt(): void {
    if (this.dateDebut) {
      this.ganttStartDate = new Date(this.dateDebut);
      this.ganttStartDate.setHours(0, 0, 0, 0);
    } else {
      this.ganttStartDate = new Date();
      this.ganttStartDate.setHours(0, 0, 0, 0);
      this.ganttStartDate.setDate(this.ganttStartDate.getDate() + this.ganttOffset);
    }
    if (this.dateFin) {
      this.ganttEndDate = new Date(this.dateFin);
      this.ganttEndDate.setHours(0, 0, 0, 0);
    } else {
      this.ganttEndDate = new Date(this.ganttStartDate);
      this.ganttEndDate.setDate(this.ganttEndDate.getDate() + 29);
    }
    const days: Date[] = [];
    const d = new Date(this.ganttStartDate);
    while (d <= this.ganttEndDate) { days.push(new Date(d)); d.setDate(d.getDate() + 1); }
    this.ganttDaysArr = days;
    this.ganttTotalDaysCount = Math.max(days.length, 1);
    this.ganttWeekSegments = this.buildWeekSegments(days);
  }

  private buildWeekSegments(days: Date[]): GanttWeekSegment[] {
    if (!days.length) return [];
    const segments: GanttWeekSegment[] = [];
    let idx = 0;
    while (idx < days.length) {
      const start = days[idx];
      const dayOfWeek = start.getDay(); // 0=Sun..6=Sat
      const daysUntilSunday = (7 - dayOfWeek) % 7;
      const endIdx = Math.min(idx + daysUntilSunday, days.length - 1);
      segments.push({ start, days: endIdx - idx + 1 });
      idx = endIdx + 1;
    }
    return segments;
  }

  get filteredChambres(): ChambreVm[] {
    let list = this.allChambres;
    if (this.filterStatus === 'libres') list = list.filter((c) => c.isDisponible);
    if (this.filterStatus === 'occupees') list = list.filter((c) => !c.isDisponible);
    if (this.filterCategorie) list = list.filter((c) => c.nameCategorie === this.filterCategorie);
    if (!this.searchTerm) return list;
    const term = this.searchTerm.toLowerCase();
    return list.filter((c) =>
      [c.nomCompletBienImmobilier, c.nomBaptiserBienImmobilier, c.codeAbrvBienImmobilier, c.nameCategorie]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredChambres.length / this.pageSize));
  }

  get safePage(): number {
    return Math.min(this.currentPage, this.totalPages);
  }

  get paginatedChambres(): ChambreVm[] {
    const start = (this.safePage - 1) * this.pageSize;
    return this.filteredChambres.slice(start, start + this.pageSize);
  }

  get paginationStart(): number {
    return this.filteredChambres.length === 0 ? 0 : (this.safePage - 1) * this.pageSize + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.safePage * this.pageSize, this.filteredChambres.length);
  }

  get visiblePages(): number[] {
    const start = Math.max(1, this.safePage - 2);
    const end = Math.min(this.totalPages, start + 4);
    const adjusted = Math.max(1, end - 4);
    return Array.from({ length: end - adjusted + 1 }, (_, i) => adjusted + i);
  }

  get totalChambres(): number { return this.allChambres.length; }
  get totalLibres(): number { return this.allChambres.filter((c) => c.isDisponible).length; }
  get totalOccupees(): number { return this.allChambres.filter((c) => !c.isDisponible).length; }

  get categorieNames(): string[] {
    return [...new Set(this.allChambres.map((c) => c.nameCategorie).filter(Boolean) as string[])];
  }

  public chambreName(c: AppartementDto): string {
    return c.nomBaptiserBienImmobilier || c.nomCompletBienImmobilier || `Chambre ${c.numApp ?? c.id}`;
  }

  public statusLabel(c: ChambreVm): string {
    return c.isDisponible ? 'Disponible' : 'Occupée';
  }

  public statusClass(c: ChambreVm): string {
    return c.isDisponible ? 'status-badge status-badge--active' : 'status-badge status-badge--occupied';
  }

  public formatCurrency(v: number): string {
    return `${v.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} FCFA`;
  }

  public guestName(r: ReservationAfficheDto): string {
    const n = (r.utilisateurOperation || '').trim().toUpperCase();
    return !n || n === 'XXX XXXXX' ? 'Client à renseigner' : r.utilisateurOperation ?? '—';
  }

  public stayNights(r: ReservationAfficheDto): number {
    if (!r.dateDebut || !r.dateFin) return 0;
    return Math.max(
      Math.ceil((new Date(r.dateFin).getTime() - new Date(r.dateDebut).getTime()) / 86400000),
      1
    );
  }

  public selectChambre(c: ChambreVm): void {
    this.selectedChambre = this.selectedChambre?.id === c.id ? null : c;
  }

  public isSelected(c: ChambreVm): boolean {
    return this.selectedChambre?.id === c.id;
  }

  public applySearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.currentPage = 1;
  }

  public setFilter(f: 'toutes' | 'libres' | 'occupees'): void {
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

  public trackById(_: number, c: ChambreVm): number { return c.id ?? _; }
}
