import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { ApiService } from 'src/gs-api/src/services/api.service';
import { UserService } from 'src/app/services/user/user.service';
import {
  AppartementDto,
  FneFactureCertificationDto,
  ReservationAfficheDto,
  UtilisateurRequestDto,
} from 'src/gs-api/src/models';

export type CertificationStatus = 'certifiee' | 'echec' | 'absente';

export interface SejourVm extends ReservationAfficheDto {
  joursRestants: number;
  joursEcoules: number;
  totalJours: number;
  progressPercent: number;
  guestLabel: string;
  chambreLabel: string;
  certificationStatus: CertificationStatus;
  certificationLabel: string;
  certificationFacture: FneFactureCertificationDto | null;
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
  public certificationsFne: FneFactureCertificationDto[] = [];
  private certificationParReservation = new Map<number, FneFactureCertificationDto>();

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
      certifications: this.api.listeFacturesCertifieesFne(idAgence),
    }).subscribe({
      next: ({ ouvertes, toutes, chambres, certifications }) => {
        this.toutesReservations = toutes ?? [];
        this.totalChambres = (chambres ?? []).length;
        this.certificationsFne = [...(certifications ?? [])].sort(
          (a, b) => this.ts(b.dateCertification) - this.ts(a.dateCertification)
        );
        this.certificationParReservation = this.buildCertificationIndex(this.certificationsFne);
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

  private buildCertificationIndex(
    certifications: FneFactureCertificationDto[]
  ): Map<number, FneFactureCertificationDto> {
    // La liste est triée du plus récent au plus ancien : on ne garde que la
    // certification la plus récente par réservation (le dernier essai fait foi).
    const index = new Map<number, FneFactureCertificationDto>();
    for (const c of certifications) {
      if (c.idReservation && !index.has(c.idReservation)) {
        index.set(c.idReservation, c);
      }
    }
    return index;
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
    const certificationFacture = (r.id && this.certificationParReservation.get(r.id)) || null;
    const certificationStatus = this.resolveCertificationStatus(certificationFacture);
    const certificationLabel = this.certificationStatusLabel(certificationStatus);
    return {
      ...r,
      joursRestants,
      joursEcoules,
      totalJours,
      progressPercent,
      guestLabel,
      chambreLabel,
      certificationStatus,
      certificationLabel,
      certificationFacture,
    };
  }

  private resolveCertificationStatus(facture: FneFactureCertificationDto | null): CertificationStatus {
    if (!facture) return 'absente';
    return facture.certifiee ? 'certifiee' : 'echec';
  }

  private certificationStatusLabel(status: CertificationStatus): string {
    switch (status) {
      case 'certifiee':
        return 'Certifiée';
      case 'echec':
        return 'Échec';
      default:
        return 'Non certifiée';
    }
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

  /* ── Certification FNE ── */
  private matchesPeriodeOuMois(dateStr?: string): boolean {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;

    if (this.hasPeriodeFilter) {
      const start = this.periodeDebut ? new Date(this.periodeDebut) : null;
      const end = this.periodeFin ? new Date(this.periodeFin) : null;
      if (start && d < start) return false;
      if (end && d > end) return false;
      return true;
    }

    const now = this.today;
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }

  get certificationsPeriode(): FneFactureCertificationDto[] {
    return this.certificationsFne.filter((c) => this.matchesPeriodeOuMois(c.dateCertification));
  }

  get certificationsCertifieesCount(): number {
    return this.certificationsPeriode.filter((c) => c.certifiee).length;
  }

  get certificationsEchecCount(): number {
    return this.certificationsPeriode.filter((c) => !c.certifiee).length;
  }

  get tauxCertification(): number {
    const total = this.certificationsPeriode.length;
    if (!total) return 0;
    return Math.round((this.certificationsCertifieesCount / total) * 100);
  }

  get montantCertifie(): number {
    return this.certificationsPeriode
      .filter((c) => c.certifiee)
      .reduce((s, c) => s + Number(c.montant ?? 0), 0);
  }

  get dernieresCertificationsEchouees(): FneFactureCertificationDto[] {
    return this.certificationsFne.filter((c) => !c.certifiee).slice(0, 5);
  }

  /** 1 sticker DGI = 200 FCFA ; consommé automatiquement à chaque certification FNE réussie. */
  private static readonly PRIX_STICKER_FCFA = 200;

  get soldeStickers(): number | null {
    // certificationsFne est trié du plus récent au plus ancien : la première
    // valeur non nulle est le solde de stickers actuel côté DGI.
    const derniere = this.certificationsFne.find(
      (c) => c.fneBalanceSticker !== null && c.fneBalanceSticker !== undefined
    );
    return derniere ? Number(derniere.fneBalanceSticker) : null;
  }

  get soldeStickersMontant(): number {
    return (this.soldeStickers ?? 0) * PageDashboardResidenceComponent.PRIX_STICKER_FCFA;
  }

  public certificationBadgeClass(status: CertificationStatus): string {
    switch (status) {
      case 'certifiee':
        return 'cert-badge--ok';
      case 'echec':
        return 'cert-badge--echec';
      default:
        return 'cert-badge--absente';
    }
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
