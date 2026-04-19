import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { ApiService } from 'src/gs-api/src/services/api.service';
import { UserService } from 'src/app/services/user/user.service';
import { AppartementDto, ReservationAfficheDto, UtilisateurRequestDto } from 'src/gs-api/src/models';

export interface SejourVm extends ReservationAfficheDto {
  joursRestants: number;
  joursEcoules: number;
  totalJours: number;
  progressPercent: number;
  guestLabel: string;
  chambreLabel: string;
}

@Component({
  standalone: false,
  selector: 'app-page-dashboard-residence',
  templateUrl: './page-dashboard-residence.component.html',
  styleUrls: ['./page-dashboard-residence.component.css'],
})
export class PageDashboardResidenceComponent implements OnInit, OnDestroy {
  public user?: UtilisateurRequestDto;
  public loading = false;
  public errorMessage = '';
  public today = new Date();

  public sejoursEnCours: SejourVm[] = [];
  public toutesReservations: ReservationAfficheDto[] = [];
  public totalChambres = 0;

  public periodeDebut = '';
  public periodeFin = '';

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

    this.sub = forkJoin({
      ouvertes: this.api.listeDesReservationOuvertParAgence(idAgence),
      toutes: this.api.allreservationparagence(idAgence),
      chambres: this.api.findAllAppartementMeuble(idAgence),
    }).subscribe({
      next: ({ ouvertes, toutes, chambres }) => {
        this.toutesReservations = toutes ?? [];
        this.totalChambres = (chambres ?? []).length;
        this.sejoursEnCours = (ouvertes ?? [])
          .sort((a, b) => this.ts(a.dateFin) - this.ts(b.dateFin))
          .map((r) => this.buildSejourVm(r));
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les données du tableau de bord.';
        this.loading = false;
      },
    });
  }

  private buildSejourVm(r: ReservationAfficheDto): SejourVm {
    const now = this.today.getTime();
    const start = r.dateDebut ? new Date(r.dateDebut).getTime() : now;
    const end = r.dateFin ? new Date(r.dateFin).getTime() : now;
    const totalJours = Math.max(Math.ceil((end - start) / 86400000), 1);
    const joursEcoules = Math.max(Math.ceil((now - start) / 86400000), 0);
    const joursRestants = Math.max(Math.ceil((end - now) / 86400000), 0);
    const progressPercent = Math.min(Math.round((joursEcoules / totalJours) * 100), 100);
    const guest = (r.utilisateurOperation || '').trim().toUpperCase();
    const guestLabel = !guest || guest === 'XXX XXXXX' ? 'Client à renseigner' : r.utilisateurOperation ?? '—';
    const chambreLabel = r.bienImmobilierOperation || r.designationBail || '—';
    return { ...r, joursRestants, joursEcoules, totalJours, progressPercent, guestLabel, chambreLabel };
  }

  /* ── Filtre période ── */
  get hasPeriodeFilter(): boolean {
    return !!(this.periodeDebut || this.periodeFin);
  }

  get periodeLabel(): string {
    const parts: string[] = [];
    if (this.periodeDebut) parts.push(`du ${new Date(this.periodeDebut).toLocaleDateString('fr-FR')}`);
    if (this.periodeFin) parts.push(`au ${new Date(this.periodeFin).toLocaleDateString('fr-FR')}`);
    return parts.join(' ');
  }

  get sejoursAffiches(): SejourVm[] {
    if (!this.hasPeriodeFilter) return this.sejoursEnCours;
    const start = this.periodeDebut ? new Date(this.periodeDebut) : null;
    const end = this.periodeFin ? new Date(this.periodeFin) : null;
    return this.toutesReservations
      .filter((r) => {
        const rStart = r.dateDebut ? new Date(r.dateDebut) : null;
        const rEnd = r.dateFin ? new Date(r.dateFin) : null;
        if (!rStart || !rEnd) return false;
        if (start && end) return rStart <= end && rEnd >= start;
        if (start) return rEnd >= start;
        return rStart <= end!;
      })
      .sort((a, b) => this.ts(a.dateFin) - this.ts(b.dateFin))
      .map((r) => this.buildSejourVm(r));
  }

  public applyPeriode(): void { /* reactive via getters */ }

  public resetPeriode(): void {
    this.periodeDebut = '';
    this.periodeFin = '';
  }

  /* ── KPIs calculés ── */
  get tauxOccupation(): number {
    if (!this.totalChambres) return 0;
    return Math.round((this.sejoursAffiches.length / this.totalChambres) * 100);
  }

  get chambresLibres(): number {
    return Math.max(this.totalChambres - this.sejoursAffiches.length, 0);
  }

  get revenuMois(): number {
    if (this.hasPeriodeFilter) {
      return this.sejoursAffiches.reduce((s, r) => s + Number(r.montantPaye ?? 0), 0);
    }
    const now = this.today;
    return this.toutesReservations
      .filter((r) => {
        if (!r.dateDebut) return false;
        const d = new Date(r.dateDebut);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, r) => s + Number(r.montantPaye ?? 0), 0);
  }

  get soldeTotal(): number {
    return this.sejoursAffiches.reduce((s, r) => s + Math.max(Number(r.soldReservation ?? 0), 0), 0);
  }

  get totalSejoursEnCours(): number {
    return this.sejoursAffiches.length;
  }

  get totalReservationsMois(): number {
    if (this.hasPeriodeFilter) return this.sejoursAffiches.length;
    const now = this.today;
    return this.toutesReservations.filter((r) => {
      if (!r.dateDebut) return false;
      const d = new Date(r.dateDebut);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }

  /* ── Alertes ── */
  get departsAujourdhui(): SejourVm[] {
    const todayStr = this.today.toISOString().slice(0, 10);
    return this.sejoursAffiches.filter((r) => r.dateFin?.toString().slice(0, 10) === todayStr);
  }

  get arrivees(): ReservationAfficheDto[] {
    const todayStr = this.today.toISOString().slice(0, 10);
    return this.toutesReservations.filter((r) => r.dateDebut?.toString().slice(0, 10) === todayStr);
  }

  get departsBientot(): SejourVm[] {
    const in3days = new Date(this.today.getTime() + 3 * 86400000).toISOString().slice(0, 10);
    const todayStr = this.today.toISOString().slice(0, 10);
    return this.sejoursAffiches.filter((r) => {
      const fin = r.dateFin?.toString().slice(0, 10) ?? '';
      return fin > todayStr && fin <= in3days;
    });
  }

  /* ── Répartition par catégorie ── */
  get repartitionCategories(): { nom: string; count: number; percent: number }[] {
    const map = new Map<string, number>();
    for (const r of this.sejoursAffiches) {
      const cat = r.nameCategori || 'Sans catégorie';
      map.set(cat, (map.get(cat) ?? 0) + 1);
    }
    const total = this.sejoursAffiches.length || 1;
    return [...map.entries()]
      .map(([nom, count]) => ({ nom, count, percent: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count);
  }

  /* ── Helpers ── */
  public formatCurrency(v: number): string {
    return `${v.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} FCFA`;
  }

  public progressClass(p: number): string {
    if (p >= 80) return 'progress-bar--danger';
    if (p >= 50) return 'progress-bar--warning';
    return 'progress-bar--ok';
  }

  public urgenceClass(r: SejourVm): string {
    if (r.joursRestants <= 1) return 'row-urgence--high';
    if (r.joursRestants <= 3) return 'row-urgence--medium';
    return '';
  }

  public guestName(r: ReservationAfficheDto): string {
    const n = (r.utilisateurOperation || '').trim().toUpperCase();
    return !n || n === 'XXX XXXXX' ? 'Client à renseigner' : r.utilisateurOperation ?? '—';
  }

  private ts(v: string | number | null | undefined): number {
    if (!v) return 0;
    const d = new Date(v as string);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  }
}
