import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { PrintServiceService } from 'src/app/services/Print/print-service.service';
import {
  InvoiceFneCertifyDetailDto,
  InvoiceRefundResult,
  InvoiceRefundService,
} from 'src/app/services/invoice-refund/invoice-refund.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';
import { FneFactureCertificationDto, UtilisateurRequestDto } from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';

@Component({
  standalone: false,
  selector: 'app-page-fne-factures',
  templateUrl: './page-fne-factures.component.html',
  styleUrls: ['./page-fne-factures.component.css'],
})
export class PageFneFacturesComponent implements OnInit {
  public user?: UtilisateurRequestDto;
  public factures: FneFactureCertificationDto[] = [];
  public isLoading = false;
  public errorMessage = '';
  public searchTerm = '';
  public statutFiltre: 'TOUS' | 'CERTIFIEE' | 'ECHEC' = 'TOUS';
  public modePaiementFiltre = 'TOUS';
  public periodeDebut = '';
  public periodeFin = '';
  public downloadingId: number | null = null;

  // Onglets
  public activeTab: 'VENTE' | 'AVOIR' = 'VENTE';

  // Onglet Avoir (liste des avoirs déjà émis)
  public avoirsListe: InvoiceRefundResult[] = [];
  public avoirsLoading = false;
  public avoirsErrorMessage = '';
  public avoirsSearchTerm = '';
  public avoirsStatutFiltre: 'TOUS' | 'AVEC_ALERTE' | 'SANS_ALERTE' = 'TOUS';
  public avoirsPeriodeDebut = '';
  public avoirsPeriodeFin = '';
  private numeroFactureParInvoiceId = new Map<string, string>();
  private invoiceIdToNumero = new Map<string, string>();
  private factureNumeroAvoirSet = new Set<string>();

  // Avoir (avoir/remboursement FNE)
  public avoirModalOpen = false;
  public avoirLoading = false;
  public avoirSubmitting = false;
  public avoirErrorMessage = '';
  public avoirFacture: FneFactureCertificationDto | null = null;
  public avoirInvoice: InvoiceFneCertifyDetailDto | null = null;
  public avoirHistorique: InvoiceRefundResult[] = [];

  constructor(
    private readonly apiService: ApiService,
    private readonly userService: UserService,
    private readonly printService: PrintServiceService,
    private readonly invoiceRefundService: InvoiceRefundService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.load();
  }

  public load(): void {
    if (!this.user?.idAgence) {
      this.errorMessage = "Impossible de charger les certifications : agence introuvable.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      factures: this.apiService.listeFacturesCertifieesFne(this.user.idAgence),
      refunds: this.invoiceRefundService.getAllRefunds(),
      invoices: this.invoiceRefundService.getAllCertifiedInvoices(),
    }).subscribe({
      next: ({ factures, refunds, invoices }) => {
        this.factures = [...(factures ?? [])].sort((a, b) =>
          this.timestamp(b.dateCertification) - this.timestamp(a.dateCertification)
        );

        // map invoice id -> numero (numeroFactureInterne or reference or id)
        this.invoiceIdToNumero = new Map(
          (invoices ?? [])
            .filter((inv) => !!inv.id)
            .map((inv) => [inv.id, inv.numeroFactureInterne || inv.reference || inv.id])
        );

        // build set of facture numeros that have at least one refund
        const invoiceIdsWithRefund = new Set((refunds ?? []).map((r) => r.invoiceId).filter(Boolean));
        this.factureNumeroAvoirSet = new Set(
          Array.from(invoiceIdsWithRefund)
            .map((id) => this.invoiceIdToNumero.get(id as string))
            .filter(Boolean) as string[]
        );

        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger la liste des factures certifiées FNE.';
        this.isLoading = false;
      },
    });
  }

  public get filteredFactures(): FneFactureCertificationDto[] {
    let rows = this.factures;

    if (this.statutFiltre === 'CERTIFIEE') {
      rows = rows.filter((f) => f.certifiee);
    } else if (this.statutFiltre === 'ECHEC') {
      rows = rows.filter((f) => !f.certifiee);
    }

    if (this.modePaiementFiltre !== 'TOUS') {
      rows = rows.filter(
        (f) => (f.modePaiement || '').trim().toLowerCase() === this.modePaiementFiltre
      );
    }

    if (this.periodeDebut || this.periodeFin) {
      rows = rows.filter((f) => this.dansLaPeriode(f.dateCertification, this.periodeDebut, this.periodeFin));
    }

    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return rows;
    }

    return rows.filter((f) =>
      [
        f.factureNumero,
        f.fneReference,
        f.fneNcc,
        f.clientNom,
        f.etablissement,
        f.modePaiement,
      ]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }

  public get modesPaiementDisponibles(): { value: string; label: string }[] {
    const present = new Set(
      this.factures
        .map((f) => (f.modePaiement || '').trim().toLowerCase())
        .filter((mode) => !!mode)
    );
    return Array.from(present).map((value) => ({
      value,
      label: PageFneFacturesComponent.PAYMENT_MODE_LABELS[value] || value,
    }));
  }

  public get hasFiltresFactures(): boolean {
    return (
      this.statutFiltre !== 'TOUS' ||
      this.modePaiementFiltre !== 'TOUS' ||
      !!this.periodeDebut ||
      !!this.periodeFin ||
      !!this.searchTerm
    );
  }

  public onModePaiementFiltreChange(event: Event): void {
    this.modePaiementFiltre = (event.target as HTMLSelectElement).value;
  }

  public resetFiltresFactures(): void {
    this.searchTerm = '';
    this.statutFiltre = 'TOUS';
    this.modePaiementFiltre = 'TOUS';
    this.periodeDebut = '';
    this.periodeFin = '';
  }

  private dansLaPeriode(dateStr: string | null | undefined, debut: string, fin: string): boolean {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    if (debut && d < new Date(debut)) return false;
    if (fin && d > new Date(`${fin}T23:59:59`)) return false;
    return true;
  }

  public get totalCertifiees(): number {
    return this.factures.filter((f) => f.certifiee).length;
  }

  public get totalEchecs(): number {
    return this.factures.filter((f) => !f.certifiee).length;
  }

  public get montantTotalCertifie(): number {
    return this.factures
      .filter((f) => f.certifiee)
      .reduce((total, f) => total + Number(f.montant ?? 0), 0);
  }

  public get totalAvecAlerte(): number {
    return this.factures.filter((f) => f.certifiee && f.fneWarning).length;
  }

  /* ── Gestion des stickers DGI ──
   * Chaque certification réussie consomme un sticker auprès de la FNE, qui
   * renvoie à chaque appel le solde de stickers restant sur le compte de
   * l'établissement (fneBalanceSticker). La liste `factures` étant triée
   * par date décroissante, la valeur la plus récente non nulle est le solde
   * actuel.
   */
  private static readonly PRIX_STICKER_FCFA = 200;
  private static readonly SEUIL_STICKER_CRITIQUE = 20;
  private static readonly SEUIL_STICKER_FAIBLE = 100;

  public get prixSticker(): number {
    return PageFneFacturesComponent.PRIX_STICKER_FCFA;
  }

  public get soldeStickers(): number | null {
    const derniere = this.factures.find(
      (f) => f.fneBalanceSticker !== null && f.fneBalanceSticker !== undefined
    );
    return derniere ? Number(derniere.fneBalanceSticker) : null;
  }

  public get soldeStickersConnu(): boolean {
    return this.soldeStickers !== null;
  }

  public get soldeStickersMontant(): number {
    return (this.soldeStickers ?? 0) * PageFneFacturesComponent.PRIX_STICKER_FCFA;
  }

  public get stickersConsommes(): number {
    return this.totalCertifiees;
  }

  public get stickersConsommesMontant(): number {
    return this.stickersConsommes * PageFneFacturesComponent.PRIX_STICKER_FCFA;
  }

  public get stickerAlertLevel(): 'ok' | 'faible' | 'critique' {
    const solde = this.soldeStickers;
    if (solde === null) return 'ok';
    if (solde <= PageFneFacturesComponent.SEUIL_STICKER_CRITIQUE) return 'critique';
    if (solde <= PageFneFacturesComponent.SEUIL_STICKER_FAIBLE) return 'faible';
    return 'ok';
  }

  public get stickerAlertLabel(): string {
    switch (this.stickerAlertLevel) {
      case 'critique':
        return 'Stock critique';
      case 'faible':
        return 'Stock faible';
      default:
        return 'Stock suffisant';
    }
  }

  public onStatutFiltreChange(event: Event): void {
    this.statutFiltre = (event.target as HTMLSelectElement).value as
      | 'TOUS'
      | 'CERTIFIEE'
      | 'ECHEC';
  }

  public formatCurrency(value: number | null | undefined): string {
    const amount = Number(value ?? 0);
    return `${amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} FCFA`;
  }

  public statusLabel(f: FneFactureCertificationDto): string {
    return f.certifiee ? 'Certifiée FNE' : 'Non certifiée';
  }

  private static readonly PAYMENT_MODE_LABELS: Record<string, string> = {
    cash: 'Espèces',
    card: 'Carte bancaire',
    check: 'Chèque',
    'mobile-money': 'Mobile Money',
    transfer: 'Virement',
    deferred: 'À terme',
  };

  public modePaiementLabel(f: FneFactureCertificationDto): string {
    const mode = (f.modePaiement || '').trim().toLowerCase();
    return PageFneFacturesComponent.PAYMENT_MODE_LABELS[mode] || f.modePaiement || '—';
  }

  public statusClass(f: FneFactureCertificationDto): string {
    return f.certifiee ? 'badge badge--success' : 'badge badge--danger';
  }

  public isDownloading(f: FneFactureCertificationDto): boolean {
    return this.downloadingId === f.idReservation;
  }

  public canDownload(f: FneFactureCertificationDto): boolean {
    return !!f.idReservation;
  }

  public telechargerFacture(f: FneFactureCertificationDto): void {
    const id = Number(f?.idReservation);
    if (!Number.isFinite(id) || id <= 0 || this.downloadingId !== null) {
      return;
    }

    this.downloadingId = id;
    this.printService
      .factureReservation(id)
      .pipe(finalize(() => (this.downloadingId = null)))
      .subscribe({
        next: (blob) => {
          saveAs(blob, `${f.factureNumero || 'facture'}.pdf`);
        },
        error: () => {
          this.notificationService.notify(
            NotificationType.ERROR,
            'Impossible de télécharger la facture.'
          );
        },
      });
  }

  public setActiveTab(tab: 'VENTE' | 'AVOIR'): void {
    this.activeTab = tab;
    if (tab === 'AVOIR' && !this.avoirsLoading) {
      this.loadAvoirs();
    }
  }

  private loadAvoirs(): void {
    this.avoirsLoading = true;
    this.avoirsErrorMessage = '';

    forkJoin({
      refunds: this.invoiceRefundService.getAllRefunds(),
      invoices: this.invoiceRefundService.getAllCertifiedInvoices(),
    }).subscribe({
      next: ({ refunds, invoices }) => {
        this.numeroFactureParInvoiceId = new Map(
          (invoices ?? [])
            .filter((inv) => !!inv.id)
            .map((inv) => [inv.id, inv.numeroFactureInterne || inv.reference || inv.id])
        );
        this.avoirsListe = [...(refunds ?? [])].sort(
          (a, b) => this.timestamp(b.createdAt) - this.timestamp(a.createdAt)
        );
        this.avoirsLoading = false;
      },
      error: () => {
        this.avoirsErrorMessage = 'Impossible de charger la liste des avoirs.';
        this.avoirsLoading = false;
      },
    });
  }

  public get filteredAvoirs(): InvoiceRefundResult[] {
    let rows = this.avoirsListe;

    if (this.avoirsStatutFiltre === 'AVEC_ALERTE') {
      rows = rows.filter((a) => !!a.warning);
    } else if (this.avoirsStatutFiltre === 'SANS_ALERTE') {
      rows = rows.filter((a) => !a.warning);
    }

    if (this.avoirsPeriodeDebut || this.avoirsPeriodeFin) {
      rows = rows.filter((a) =>
        this.dansLaPeriode(a.createdAt, this.avoirsPeriodeDebut, this.avoirsPeriodeFin)
      );
    }

    const term = this.avoirsSearchTerm.trim().toLowerCase();
    if (!term) {
      return rows;
    }
    return rows.filter((a) =>
      [a.reference, a.ncc, this.numeroFactureLiee(a)]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }

  public get hasFiltresAvoirs(): boolean {
    return (
      this.avoirsStatutFiltre !== 'TOUS' ||
      !!this.avoirsPeriodeDebut ||
      !!this.avoirsPeriodeFin ||
      !!this.avoirsSearchTerm
    );
  }

  public onAvoirsStatutFiltreChange(event: Event): void {
    this.avoirsStatutFiltre = (event.target as HTMLSelectElement).value as
      | 'TOUS'
      | 'AVEC_ALERTE'
      | 'SANS_ALERTE';
  }

  public resetFiltresAvoirs(): void {
    this.avoirsSearchTerm = '';
    this.avoirsStatutFiltre = 'TOUS';
    this.avoirsPeriodeDebut = '';
    this.avoirsPeriodeFin = '';
  }

  public numeroFactureLiee(a: InvoiceRefundResult): string {
    return (a.invoiceId && this.numeroFactureParInvoiceId.get(a.invoiceId)) || a.invoiceId || '—';
  }

  public trackByAvoir(_: number, a: InvoiceRefundResult): number {
    return a.id ?? _;
  }

  public peutFaireAvoir(f: FneFactureCertificationDto): boolean {
    return !!f.certifiee;
  }

  public hasExistingAvoirForFacture(f: FneFactureCertificationDto): boolean {
    if (!f.factureNumero) {
      return false;
    }
    return this.factureNumeroAvoirSet.has(f.factureNumero);
  }

  public telechargerAvoir(a: InvoiceRefundResult): void {
    // If the refund contains a token (FNE link), open it directly
    if (a && a.token) {
      try {
        window.open(a.token, '_blank');
        return;
      } catch (e) {
        // ignore and fallback
      }
    }

    // Fallback : tenter de retrouver la facture liée et utiliser son idReservation pour imprimer
    const invoiceId = a.invoiceId;
    const numero = invoiceId ? this.invoiceIdToNumero.get(invoiceId) : undefined;
    const facture = numero ? this.factures.find((f) => f.factureNumero === numero) : undefined;

    if (facture && facture.idReservation) {
      const id = Number(facture.idReservation);
      if (!Number.isFinite(id) || id <= 0) {
        this.notificationService.notify(NotificationType.ERROR, "Impossible de télécharger : réservation introuvable.");
        return;
      }

      this.downloadingId = id;
      this.printService
        .factureReservation(id)
        .pipe(finalize(() => (this.downloadingId = null)))
        .subscribe({
          next: (blob) => {
            saveAs(blob, `avoir-${a.reference || a.id || 'document'}.pdf`);
          },
          error: () => {
            this.notificationService.notify(NotificationType.ERROR, "Impossible de télécharger l'avoir.");
          },
        });
      return;
    }

    this.notificationService.notify(
      NotificationType.ERROR,
      "Téléchargement indisponible pour cet avoir (aucune URL fournie)."
    );
  }

  public ouvrirAvoir(f: FneFactureCertificationDto): void {
    const numeroFacture = f.factureNumero;
    if (!numeroFacture) {
      return;
    }

    this.avoirFacture = f;
    this.avoirInvoice = null;
    this.avoirHistorique = [];
    this.avoirErrorMessage = '';
    this.avoirModalOpen = true;
    this.avoirLoading = true;

    this.invoiceRefundService.getInvoiceByNumeroFacture(numeroFacture).subscribe({
      next: (invoices) => {
        const invoice = (invoices ?? [])[0] ?? null;
        if (!invoice) {
          this.avoirErrorMessage = `Aucune facture certifiée FNE trouvée pour ${numeroFacture}.`;
          this.avoirLoading = false;
          return;
        }

        this.avoirInvoice = invoice;

        this.invoiceRefundService.getRefundsByInvoice(invoice.id).subscribe({
          next: (historique) => {
            this.avoirHistorique = historique ?? [];
            this.avoirLoading = false;
          },
          error: () => {
            this.avoirLoading = false;
          },
        });
      },
      error: () => {
        this.avoirErrorMessage = 'Impossible de récupérer la facture certifiée FNE.';
        this.avoirLoading = false;
      },
    });
  }

  public fermerAvoir(): void {
    if (this.avoirSubmitting) {
      return;
    }
    this.avoirModalOpen = false;
    this.avoirFacture = null;
    this.avoirInvoice = null;
    this.avoirHistorique = [];
    this.avoirErrorMessage = '';
  }

  public get avoirSousTotal(): number {
    return (this.avoirInvoice?.items ?? []).reduce(
      (total, item) => total + (item.amount ?? 0) * (item.quantity ?? 0),
      0
    );
  }

  public get avoirReductionPourcentage(): number {
    return this.avoirInvoice?.discount ?? 0;
  }

  public get avoirReductionMontant(): number {
    return (this.avoirSousTotal * this.avoirReductionPourcentage) / 100;
  }

  public get avoirMontantTotal(): number {
    return Math.max(this.avoirSousTotal - this.avoirReductionMontant, 0);
  }

  public confirmerAvoir(): void {
    if (!this.avoirInvoice || !this.avoirInvoice.items?.length || this.avoirSubmitting) {
      return;
    }

    const items = this.avoirInvoice.items.map((item) => ({
      id: item.id,
      quantity: item.quantity ?? 0,
    }));

    this.avoirSubmitting = true;
    this.invoiceRefundService
      .refundInvoice({ invoiceId: this.avoirInvoice.id, items })
      .pipe(finalize(() => (this.avoirSubmitting = false)))
      .subscribe({
        next: () => {
          this.notificationService.notify(
            NotificationType.SUCCESS,
            `Avoir créé avec succès pour ${this.avoirFacture?.factureNumero || 'la facture'}.`
          );
          this.fermerAvoir();
        },
        error: (err) => {
          const message =
            err?.error?.message || err?.message || "Impossible de créer l'avoir auprès de la FNE.";
          this.notificationService.notify(NotificationType.ERROR, message);
        },
      });
  }

  public trackByRow(_: number, f: FneFactureCertificationDto): number {
    return f.id ?? _;
  }

  private timestamp(value: string | null | undefined): number {
    if (!value) {
      return 0;
    }
    const date = new Date(value);
    return isNaN(date.getTime()) ? 0 : date.getTime();
  }
}
