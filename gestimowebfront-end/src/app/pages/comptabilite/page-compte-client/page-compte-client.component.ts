import {
  GetAllAppelLoyerByBailActions,
  GetAllSmsByLocataireActions,
  SaveSupprimerActions as SaveSupprimerLoyerActions,
} from './../../../ngrx/appelloyer/appelloyer.actions';
import {
  AppelLoyerState,
  AppelLoyerStateEnum,
} from 'src/app/ngrx/appelloyer/appelloyer.reducer';
import {
  GetEncaissementBienActions,
} from './../../../ngrx/reglement/reglement.actions';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user/user.service';
import { LocataireEncaisDTO, UtilisateurRequestDto } from 'src/gs-api/src/models';
import {
  EncaissementState,
  EncaissementStateEnum,
} from 'src/app/ngrx/reglement/reglement.reducer';
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
export class PageCompteClientComponent implements OnInit {
  public user?: UtilisateurRequestDto;
  locataire: LocataireEncaisDTO | null = null;
  locataires: LocataireEncaisDTO[] = [];
  locatairesLoading = false;
  locatairesError = '';
  private locatairesSubscription?: Subscription;

  // Onglet actif
  activeTab: ActiveTab = 'appels';

  // Appels loyer
  allAppelLoyers: any[] = [];
  filteredAppelLoyers: any[] = [];
  searchAppel = '';

  // Encaissements
  allEncaissements: any[] = [];
  filteredEncaissements: any[] = [];
  searchEncaissement = '';

  // SMS
  allSms: any[] = [];
  filteredSms: any[] = [];
  searchSms = '';

  appelLoyerState$: Observable<AppelLoyerState> | null = null;
  readonly AppelLoyerStateEnum = AppelLoyerStateEnum;

  listeEncaissementBien$: Observable<EncaissementState> | null = null;
  readonly EncaissementStateEnum = EncaissementStateEnum;

  constructor(
    private store: Store<any>,
    private userService: UserService,
    private printService: PrintServiceService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.loadLocatairesCompteClient();
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
    this.allAppelLoyers = [];
    this.filteredAppelLoyers = [];
    this.allEncaissements = [];
    this.filteredEncaissements = [];
    this.allSms = [];
    this.filteredSms = [];
    this.loadAllForLocataire(selected);
  }

  public loadAllForLocataire(loc: LocataireEncaisDTO): void {
    this.getAllAppelLoyerByBail(loc);
    this.getAllEncaissementByBienImmobilier(loc);
    this.getAllSmsByLocataire(loc);
  }

  // ─── Chargement données ────────────────────────────────────────────────────

  public getAllEncaissementByBienImmobilier(p: any): void {
    this.store.dispatch(new GetEncaissementBienActions(p.idBien));
    this.store.pipe(map((state) => state.encaissementState)).subscribe((donnee) => {
      this.allEncaissements = donnee.encaissements ?? [];
      this.applyEncaissementFilter();
    });
  }

  public getAllAppelLoyerByBail(bien: any): void {
    this.store.dispatch(new GetAllAppelLoyerByBailActions(bien.idBail));
    this.appelLoyerState$ = this.store.pipe(map((state) => state.appelLoyerState));
    this.store.pipe(map((state) => state.appelLoyerState)).subscribe((data) => {
      this.allAppelLoyers = data.appelloyers ?? [];
      this.applyAppelFilter();
    });
  }

  public getAllSmsByLocataire(loc: any): void {
    this.store.dispatch(new GetAllSmsByLocataireActions(loc.username));
    this.store.pipe(map((state) => state.appelLoyerState)).subscribe((data) => {
      this.allSms = data.smss ?? [];
      this.applySmsFilter();
    });
  }

  // ─── KPIs ──────────────────────────────────────────────────────────────────

  get totalLoyersAppeles(): number {
    return this.allAppelLoyers.reduce((s, r) => s + Number(r.montantBailLPeriode ?? 0), 0);
  }

  get totalEncaisse(): number {
    return this.allEncaissements.reduce((s, r) => s + Number(r.montantEncaissement ?? 0), 0);
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
    return Math.round((this.totalEncaisse / this.totalLoyersAppeles) * 100);
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  public supprimerUnLoyer(idAppel: any): void {
    if (!this.locataire?.idBail) return;
    if (!confirm('Vous allez annuler ce paiement de façon irréversible. Confirmer ?')) return;
    this.store.dispatch(new SaveSupprimerLoyerActions({ idPeriode: idAppel, idBail: this.locataire.idBail }));
    this.store.pipe(map((state) => state.appelLoyerState)).subscribe((data) => {
      this.allAppelLoyers = data.appelloyers ?? [];
      this.applyAppelFilter();
    });
  }

  public printRecu(p: any): void {
    this.printService.printRecuEncaissement(p).subscribe((blob) => {
      saveAs(blob, 'appel_quittance_du_' + p + '.pdf');
    });
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
    if (!this.searchAppel) { this.filteredAppelLoyers = [...this.allAppelLoyers]; return; }
    this.filteredAppelLoyers = this.allAppelLoyers.filter((r) =>
      [`${r.id}`, r.periodeAppelLoyer, r.statusAppelLoyer, `${r.montantBailLPeriode}`, `${r.soldeAppelLoyer}`]
        .join(' ').toLowerCase().includes(this.searchAppel)
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
          this.locataires = this.sortLocataires(locataires ?? []);
          this.locatairesLoading = false;

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
          if (selectedLocataire) {
            this.selectLocataire(selectedLocataire);
          }
        },
        error: () => {
          this.locataires = [];
          this.locataire = null;
          this.locatairesLoading = false;
          this.locatairesError =
            "Impossible de charger les comptes locataires.";
        },
      });
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
}
