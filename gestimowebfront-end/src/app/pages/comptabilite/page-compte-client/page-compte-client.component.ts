import {
  SaveSupprimerActions as SaveSupprimerLoyerActions,
} from './../../../ngrx/appelloyer/appelloyer.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UserService } from 'src/app/services/user/user.service';
import { LocataireEncaisDTO, UtilisateurRequestDto } from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';
import { saveAs } from 'file-saver';
import { PrintServiceService } from 'src/app/services/Print/print-service.service';
import * as XLSX from 'xlsx';

export type ActiveTab = 'appels' | 'encaissements' | 'sms';

@Component({
  standalone: false,
  selector: 'app-page-compte-client',
  templateUrl: './page-compte-client.component.html',
  styleUrls: ['./page-compte-client.component.css'],
})
export class PageCompteClientComponent implements OnInit, OnDestroy {
  public user?: UtilisateurRequestDto;
  locataire: LocataireEncaisDTO | null = null;
  locataires: LocataireEncaisDTO[] = [];
  locatairesLoading = false;
  locatairesError = '';
  dataError = '';
  private locatairesSubscription?: Subscription;
  private dataSubscriptions: Subscription[] = [];

  // Onglet actif
  activeTab: ActiveTab = 'appels';

  // Appels loyer
  allAppelLoyers: any[] = [];
  filteredAppelLoyers: any[] = [];
  searchAppel = '';
  printingAppelId: number | null = null;
  appelPage = 1;
  appelPageSize = 10;
  readonly appelPageSizeOptions = [5, 10, 20, 50];

  // Encaissements
  allEncaissements: any[] = [];
  filteredEncaissements: any[] = [];
  searchEncaissement = '';

  // SMS
  allSms: any[] = [];
  filteredSms: any[] = [];
  searchSms = '';

  constructor(
    private store: Store<any>,
    private userService: UserService,
    private apiService: ApiService,
    private printService: PrintServiceService
  ) {}

  ngOnInit(): void {
    this.user = this.getCurrentUser();
    this.loadLocatairesCompteClient();
  }

  ngOnDestroy(): void {
    this.locatairesSubscription?.unsubscribe();
    this.dataSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  public setTab(tab: ActiveTab): void {
    this.activeTab = tab;
  }

  // ─── Sélection locataire ───────────────────────────────────────────────────

  public onLocataireChange(event: Event): void {
    const index = Number((event.target as HTMLSelectElement).value);
    const selected = this.locataires[index];
    if (!selected) return;
    this.selectLocataire(selected);
  }

  private selectLocataire(selected: LocataireEncaisDTO): void {
    this.locataire = selected;
    this.dataError = '';
    this.allAppelLoyers = [];
    this.filteredAppelLoyers = [];
    this.allEncaissements = [];
    this.filteredEncaissements = [];
    this.allSms = [];
    this.filteredSms = [];
    this.loadAllForLocataire(selected);
  }

  public loadAllForLocataire(loc: LocataireEncaisDTO): void {
    this.dataSubscriptions.forEach((subscription) => subscription.unsubscribe());
    this.dataSubscriptions = [];
    this.getAllAppelLoyerByBail(loc);
    this.getAllEncaissementByBienImmobilier(loc);
    this.getAllSmsByLocataire(loc);
  }

  // ─── Chargement données ────────────────────────────────────────────────────

  public getAllEncaissementByBienImmobilier(p: any): void {
    const idBien = this.toPositiveNumber(p?.idBien);
    if (idBien === null) {
      this.allEncaissements = [];
      this.applyEncaissementFilter();
      return;
    }

    const subscription = this.apiService
      .findAllEncaissementByIdBienImmobilier(idBien)
      .subscribe({
        next: (encaissements) => {
          this.allEncaissements = encaissements ?? [];
          this.applyEncaissementFilter();
        },
        error: () => {
          this.allEncaissements = [];
          this.applyEncaissementFilter();
          this.dataError = "Impossible de charger les encaissements du compte locataire.";
        },
      });
    this.dataSubscriptions.push(subscription);
  }

  public getAllAppelLoyerByBail(bien: any): void {
    const idBail = this.toPositiveNumber(bien?.idBail);
    if (idBail === null) {
      this.allAppelLoyers = [];
      this.applyAppelFilter();
      return;
    }

    const subscription = this.apiService.listDesLoyersParBail(idBail).subscribe({
      next: (appels) => {
        this.allAppelLoyers = appels ?? [];
        this.applyAppelFilter();
      },
      error: () => {
        this.allAppelLoyers = [];
        this.applyAppelFilter();
        this.dataError = "Impossible de charger les appels de loyer du compte locataire.";
      },
    });
    this.dataSubscriptions.push(subscription);
  }

  public getAllSmsByLocataire(loc: any): void {
    const username = String(loc?.username ?? '').trim();
    if (!username) {
      this.allSms = [];
      this.applySmsFilter();
      return;
    }

    const subscription = this.apiService
      .listMessageEnvoyerAUnLocataire(username)
      .subscribe({
        next: (sms) => {
          this.allSms = sms ?? [];
          this.applySmsFilter();
        },
        error: () => {
          this.allSms = [];
          this.applySmsFilter();
          this.dataError = "Impossible de charger les messages du compte locataire.";
        },
      });
    this.dataSubscriptions.push(subscription);
  }

  // ─── KPIs ──────────────────────────────────────────────────────────────────

  get totalLoyersAppeles(): number {
    return this.allAppelLoyers.reduce((s, r) => s + this.getMontantAppel(r), 0);
  }

  get totalEncaisse(): number {
    return this.allAppelLoyers.reduce((total, appel) => {
      const montantAppel = this.getMontantAppel(appel);
      const solde = Math.max(Number(appel.soldeAppelLoyer ?? 0), 0);
      const montantPaye = Math.max(montantAppel - solde, 0);
      return total + Math.min(montantPaye, montantAppel);
    }, 0);
  }

  get soldeEnAttente(): number {
    return this.allAppelLoyers
      .filter((r) => {
        const st = (r.statusAppelLoyer ?? '').toLowerCase();
        return st !== 'soldé' && st !== 'solde';
      })
      .reduce((s, r) => s + Number(r.soldeAppelLoyer ?? 0), 0);
  }

  get countImpaye(): number {
    return this.allAppelLoyers.filter((r) => {
      const st = (r.statusAppelLoyer ?? '').toLowerCase();
      return st === 'impayé' || st === 'impaye';
    }).length;
  }

  get tauxRecouvrement(): number {
    if (!this.totalLoyersAppeles) return 0;
    return Math.min(
      Math.round((this.totalEncaisse / this.totalLoyersAppeles) * 100),
      100
    );
  }

  get appelTotalPages(): number {
    return Math.max(Math.ceil(this.filteredAppelLoyers.length / this.appelPageSize), 1);
  }

  get pagedAppelLoyers(): any[] {
    const start = (this.appelPage - 1) * this.appelPageSize;
    return this.filteredAppelLoyers.slice(start, start + this.appelPageSize);
  }

  get appelPageStart(): number {
    if (this.filteredAppelLoyers.length === 0) {
      return 0;
    }
    return (this.appelPage - 1) * this.appelPageSize + 1;
  }

  get appelPageEnd(): number {
    return Math.min(this.appelPage * this.appelPageSize, this.filteredAppelLoyers.length);
  }

  public onAppelPageSizeChange(event: Event): void {
    const pageSize = Number((event.target as HTMLSelectElement).value);
    this.appelPageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10;
    this.appelPage = 1;
  }

  public previousAppelPage(): void {
    this.appelPage = Math.max(this.appelPage - 1, 1);
  }

  public nextAppelPage(): void {
    this.appelPage = Math.min(this.appelPage + 1, this.appelTotalPages);
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  public supprimerUnLoyer(idAppel: any): void {
    if (!this.locataire?.idBail) return;
    if (!confirm('Vous allez annuler ce paiement de façon irréversible. Confirmer ?')) return;
    this.store.dispatch(new SaveSupprimerLoyerActions({ idPeriode: idAppel, idBail: this.locataire.idBail }));
    window.setTimeout(() => this.getAllAppelLoyerByBail(this.locataire), 500);
  }

  public printRecu(p: any): void {
    this.printService.printRecuEncaissement(p).subscribe((blob) => {
      saveAs(blob, 'appel_quittance_du_' + p + '.pdf');
    });
  }

  public printQuittanceLoyer(row: any): void {
    const appelId = this.toPositiveNumber(row?.id);
    if (appelId === null) {
      alert("Impossible d'imprimer cette quittance : appel de loyer introuvable.");
      return;
    }

    this.printingAppelId = appelId;
    this.printService
      .printQuittanceById(appelId)
      .pipe(finalize(() => (this.printingAppelId = null)))
      .subscribe({
        next: (blob) => this.printBlob(blob),
        error: () => {
          alert("Impossible d'imprimer la quittance de ce loyer.");
        },
      });
  }

  public isPrintingQuittance(row: any): boolean {
    return this.printingAppelId === this.toPositiveNumber(row?.id);
  }

  public printPage(): void {
    window.print();
  }

  // ─── Export Excel ──────────────────────────────────────────────────────────

  public exportAppelsToExcel(): void {
    const rows = this.filteredAppelLoyers.map((r) => ({
      'ID': r.id,
      'Période': r.periodeAppelLoyer,
      'Montant loyer (FCFA)': Number(r.montantBailLPeriode ?? 0),
      'Solde du mois (FCFA)': Number(r.soldeAppelLoyer ?? 0),
      'Statut': r.statusAppelLoyer ?? '',
    }));
    this.downloadXlsx(rows, 'Appels_loyer');
  }

  public exportEncaissementsToExcel(): void {
    const rows = this.filteredEncaissements.map((r) => ({
      'ID': r.id,
      'Date de paiement': r.creationDate,
      'Période': r.appelLoyersFactureDto?.periodeLettre ?? '',
      'Loyer (FCFA)': Number(r.appelLoyersFactureDto?.nouveauMontantLoyer ?? 0),
      'Montant payé (FCFA)': Number(r.montantEncaissement ?? 0),
      'Mode': this.getModePaiementLabel(r.modePaiement),
      'Solde (FCFA)': Number(r.soldeEncaissement ?? 0),
      'Statut': r.appelLoyersFactureDto?.statusAppelLoyer ?? '',
    }));
    this.downloadXlsx(rows, 'Encaissements');
  }

  public exportSmsToExcel(): void {
    const rows = this.filteredSms.map((r) => ({
      "Date d'envoi": r.dateEnvoi ?? '',
      'Destinataire': r.destinaireNomPrenom ?? r.nomDestinaire ?? '',
      'Type': r.typeMessage ?? '',
      'Message': r.textMessage ?? '',
      'Statut': r.envoer === true ? 'Envoyé' : 'Échec',
    }));
    this.downloadXlsx(rows, 'Messages_SMS');
  }

  private downloadXlsx(rows: any[], sheetName: string): void {
    const bail = this.locataire?.codeDescBail ?? 'export';
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), `${sheetName}_${bail}.xlsx`);
  }

  // ─── Recherche ─────────────────────────────────────────────────────────────

  public onSearchAppel(event: Event): void {
    this.searchAppel = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.appelPage = 1;
    this.applyAppelFilter();
  }

  public onSearchEncaissement(event: Event): void {
    this.searchEncaissement = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyEncaissementFilter();
  }

  public onSearchSms(event: Event): void {
    this.searchSms = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applySmsFilter();
  }

  // ─── Formatage ─────────────────────────────────────────────────────────────

  public formatCurrency(value: number | null | undefined): string {
    const amount = Number(value ?? 0);
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} FCFA`;
  }

  public getModePaiementLabel(mode: string | null | undefined): string {
    switch (mode) {
      case 'ESPESE_MAGISER': return 'Espèce';
      case 'MOBILE_MONEY_MAGISER': return 'Mobile money';
      case 'CHEQUE_ECOBANK_MAGISER': return 'Chèque';
      case 'VIREMENT_ECOBANK_MAGISER': return 'Virement bancaire';
      default: return mode || '-';
    }
  }

  public getStatusBadgeClass(status: string | null | undefined): string {
    const s = (status ?? '').toLowerCase();
    if (s === 'soldé' || s === 'solde') return 'status-badge status-badge--success';
    if (s.includes('partiel')) return 'status-badge status-badge--warning';
    return 'status-badge status-badge--danger';
  }

  public getBailStatusLabel(locataire: LocataireEncaisDTO | null | undefined): string {
    return locataire?.bailEnCours ? 'Bail en cours' : 'Bail clôturé';
  }

  public getBailStatusClass(locataire: LocataireEncaisDTO | null | undefined): string {
    return locataire?.bailEnCours
      ? 'status-badge status-badge--success'
      : 'status-badge status-badge--warning';
  }

  public getLocataireOptionLabel(locataire: LocataireEncaisDTO): string {
    const baseLabel = locataire?.codeDescBail || 'Locataire';
    return `${baseLabel} ${locataire?.bailEnCours ? '[Actif]' : '[Clôturé]'}`;
  }

  public getInitials(bail: string | null | undefined): string {
    if (!bail) return '?';
    return bail.split(' ').slice(0, 2).map((w) => w[0] ?? '').join('').toUpperCase();
  }

  // ─── Filtres internes ──────────────────────────────────────────────────────

  private applyAppelFilter(): void {
    if (!this.searchAppel) {
      this.filteredAppelLoyers = [...this.allAppelLoyers];
    } else {
      this.filteredAppelLoyers = this.allAppelLoyers.filter((r) =>
        [`${r.id}`, r.periodeAppelLoyer, r.statusAppelLoyer, `${r.montantBailLPeriode}`, `${r.soldeAppelLoyer}`]
          .join(' ').toLowerCase().includes(this.searchAppel)
      );
    }

    this.appelPage = Math.min(this.appelPage, this.appelTotalPages);
  }

  private getMontantAppel(appel: any): number {
    return Number(
      appel?.montantBailLPeriode ??
      appel?.montantLoyerBailLPeriode ??
      appel?.nouveauMontantLoyer ??
      0
    );
  }

  private applyEncaissementFilter(): void {
    if (!this.searchEncaissement) { this.filteredEncaissements = [...this.allEncaissements]; return; }
    this.filteredEncaissements = this.allEncaissements.filter((r) =>
      [
        `${r.id}`, r.creationDate,
        r.appelLoyersFactureDto?.periodeLettre,
        r.modePaiement, this.getModePaiementLabel(r.modePaiement),
        `${r.montantEncaissement}`, `${r.soldeEncaissement}`,
        r.appelLoyersFactureDto?.statusAppelLoyer,
      ].join(' ').toLowerCase().includes(this.searchEncaissement)
    );
  }

  private applySmsFilter(): void {
    if (!this.searchSms) { this.filteredSms = [...this.allSms]; return; }
    this.filteredSms = this.allSms.filter((r) =>
      [`${r.dateEnvoi}`, r.destinaireNomPrenom, r.typeMessage, r.textMessage]
        .join(' ').toLowerCase().includes(this.searchSms)
    );
  }

  private loadLocatairesCompteClient(): void {
    if (!this.user?.idAgence) {
      this.locataires = [];
      this.locatairesError = "Agence introuvable pour charger les comptes locataires.";
      return;
    }

    this.locatairesLoading = true;
    this.locatairesError = '';
    this.locatairesSubscription?.unsubscribe();
    this.locatairesSubscription = this.userService
      .getLocatairesCompteClient(this.user.idAgence)
      .subscribe({
        next: (locataires) => {
          const primaryLocataires = this.sortLocataires(locataires ?? []);
          if (primaryLocataires.length > 0) {
            this.applyLoadedLocataires(primaryLocataires);
            return;
          }

          this.loadLocatairesAvecBailFallback(this.user!.idAgence!);
        },
        error: () => {
          this.loadLocatairesAvecBailFallback(this.user!.idAgence!);
        },
      });
  }

  private loadLocatairesAvecBailFallback(idAgence: number): void {
    this.userService.getLocatairesAvecBail(idAgence).subscribe({
      next: (locataires) => {
        const fallbackLocataires = this.sortLocataires(locataires ?? []);
        this.applyLoadedLocataires(fallbackLocataires);
      },
      error: () => {
        this.locataires = [];
        this.locataire = null;
        this.locatairesLoading = false;
        this.locatairesError = "Impossible de charger les comptes locataires.";
      },
    });
  }

  private applyLoadedLocataires(locataires: LocataireEncaisDTO[]): void {
    this.locataires = locataires;
    this.locatairesLoading = false;
    this.locatairesError = '';

    if (!this.locataires.length) {
      this.locataire = null;
      return;
    }

    if (!this.locataire) {
      this.selectLocataire(this.locataires[0]);
      return;
    }

    const selectedLocataire = this.locataires.find(
      (locataire) => locataire.idBail === this.locataire?.idBail
    );
    this.selectLocataire(selectedLocataire ?? this.locataires[0]);
  }

  private sortLocataires(locataires: LocataireEncaisDTO[]): LocataireEncaisDTO[] {
    return [...locataires].sort((left, right) => {
      const statusOrder = Number(!!right.bailEnCours) - Number(!!left.bailEnCours);
      if (statusOrder !== 0) {
        return statusOrder;
      }

      return (left.codeDescBail ?? '').localeCompare(right.codeDescBail ?? '', 'fr', {
        sensitivity: 'base',
      });
    });
  }

  private getCurrentUser(): UtilisateurRequestDto | undefined {
    try {
      const user = this.userService.getUserFromLocalCache();
      return user ?? undefined;
    } catch (error) {
      this.locatairesError =
        "Impossible de charger le compte client : utilisateur connecte introuvable.";
      return undefined;
    }
  }

  private printBlob(blob: Blob): void {
    const blobUrl = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');

    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.src = blobUrl;

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      window.setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
        iframe.remove();
      }, 1000);
    };

    document.body.appendChild(iframe);
  }

  private toPositiveNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const normalized =
      typeof value === 'number' ? value : Number.parseInt(String(value), 10);

    return Number.isFinite(normalized) && normalized > 0 ? normalized : null;
  }
}
