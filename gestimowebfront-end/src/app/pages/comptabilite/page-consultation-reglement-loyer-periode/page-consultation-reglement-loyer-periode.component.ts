import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  SommeDueEntreDeuxDatesActions,
  SommeEncaissementEntreDeuxDatesActions,
  TotalEncaissementEntreDeuxDatesActions,
} from 'src/app/ngrx/reglement/reglement.actions';
import { EncaissementStateEnum } from 'src/app/ngrx/reglement/reglement.reducer';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';
import { map } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export type StatusFilter = '' | 'soldé' | 'impayé' | 'partiellement payé';

@Component({
  standalone: false,
  selector: 'app-page-consultation-reglement-loyer-periode',
  templateUrl: './page-consultation-reglement-loyer-periode.component.html',
  styleUrls: ['./page-consultation-reglement-loyer-periode.component.css'],
})
export class PageConsultationReglementLoyerPeriodeComponent implements OnInit {

  public user?: UtilisateurRequestDto;

  // Dates (format ISO pour les inputs HTML)
  debutStr: string = '';
  finStr: string = '';

  // Données
  allRows: any[] = [];
  filteredRows: any[] = [];

  // KPIs
  montantEncaisse: number = 0;
  montantDue: number = 0;
  isLoading = false;

  // Filtres
  searchTerm = '';
  statusFilter: StatusFilter = '';

  readonly EncaissementStateEnum = EncaissementStateEnum;

  constructor(
    private store: Store<any>,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    this.debutStr = this.toIsoDate(firstDay);
    this.finStr = this.toIsoDate(today);
    this.loadAll();
  }

  // ─── Chargement ───────────────────────────────────────────────────────────

  public loadAll(): void {
    const debut = new Date(this.debutStr);
    const fin = new Date(this.finStr);
    this.getListPaiementloyerEntreDeuxDate(debut, fin);
    this.getSommeEncaissementEntreDeuxDate(debut, fin);
    this.loyerDueEntreDeuxDate(debut, fin);
  }

  public getSommeEncaissementEntreDeuxDate(debut: Date, fin: Date): void {
    this.user = this.userService.getUserFromLocalCache();
    this.store.dispatch(new SommeEncaissementEntreDeuxDatesActions({
      idAgence: this.user?.idAgence,
      datefin: this.toApiDate(fin),
      datedebut: this.toApiDate(debut),
    }));
    this.store.pipe(map((state) => state.encaissementState)).subscribe((data) => {
      if (data.dataState === EncaissementStateEnum.LOADED) {
        this.montantEncaisse = data.montantEncaisse ?? 0;
      }
    });
  }

  public loyerDueEntreDeuxDate(debut: Date, fin: Date): void {
    this.user = this.userService.getUserFromLocalCache();
    this.store.dispatch(new SommeDueEntreDeuxDatesActions({
      idAgence: this.user?.idAgence,
      datefin: this.toApiDate(fin),
      datedebut: this.toApiDate(debut),
    }));
    this.store.pipe(map((state) => state.encaissementState)).subscribe((data) => {
      if (data.dataState === EncaissementStateEnum.LOADED) {
        this.montantDue = data.montantDue ?? 0;
      }
    });
  }

  public getListPaiementloyerEntreDeuxDate(debut: Date, fin: Date): void {
    this.user = this.userService.getUserFromLocalCache();
    this.isLoading = true;
    this.store.dispatch(new TotalEncaissementEntreDeuxDatesActions({
      idAgence: this.user?.idAgence,
      datefin: this.toApiDate(fin),
      datedebut: this.toApiDate(debut),
    }));
    this.store.pipe(map((state) => state.encaissementState)).subscribe((data) => {
      if (data.dataState === EncaissementStateEnum.LOADED) {
        this.isLoading = false;
        this.allRows = Array.isArray(data.encaissementsLoyer) ? data.encaissementsLoyer : [];
        this.applyFilters();
      }
      if (data.dataState === EncaissementStateEnum.ERROR) {
        this.isLoading = false;
      }
    });
  }

  // ─── KPIs calculés ────────────────────────────────────────────────────────

  get tauxRecouvrement(): number {
    if (!this.montantDue) return 0;
    return Math.round((this.montantEncaisse / this.montantDue) * 100);
  }

  get countSolde(): number {
    return this.allRows.filter((r) => (r.statusAppelLoyer ?? '').toLowerCase() === 'soldé').length;
  }

  get countImpaye(): number {
    return this.allRows.filter((r) => (r.statusAppelLoyer ?? '').toLowerCase() === 'impayé').length;
  }

  get countPartiel(): number {
    return this.allRows.filter((r) =>
      (r.statusAppelLoyer ?? '').toLowerCase().includes('partiellement')
    ).length;
  }

  get totalLoyerFiltre(): number {
    return this.filteredRows.reduce((s, r) => s + Number(r.montantLoyerBailLPeriode ?? 0), 0);
  }

  get totalPayeFiltre(): number {
    return this.filteredRows.reduce((s, r) => s + Number(r.montantPaye ?? 0), 0);
  }

  get totalSoldeFiltre(): number {
    return this.filteredRows.reduce((s, r) => s + Number(r.soldeAppelLoyer ?? 0), 0);
  }

  // ─── Filtres ──────────────────────────────────────────────────────────────

  public setStatusFilter(val: StatusFilter): void {
    this.statusFilter = val;
    this.applyFilters();
  }

  public onSearchChange(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyFilters();
  }

  private applyFilters(): void {
    let rows = [...this.allRows];

    if (this.statusFilter) {
      rows = rows.filter((r) =>
        (r.statusAppelLoyer ?? '').toLowerCase() === this.statusFilter
      );
    }

    if (this.searchTerm) {
      rows = rows.filter((r) =>
        [
          r.nomAgence, r.commune, r.abrvBienimmobilier,
          r.periodeLettre, r.nomLocataire, r.prenomLocataire,
          r.descAppelLoyer, r.statusAppelLoyer,
          `${r.montantPaye}`, `${r.montantLoyerBailLPeriode}`, `${r.soldeAppelLoyer}`,
        ].join(' ').toLowerCase().includes(this.searchTerm)
      );
    }

    this.filteredRows = rows;
  }

  // ─── Export / Impression ──────────────────────────────────────────────────

  public exportToExcel(): void {
    const rows = this.filteredRows.map((r) => ({
      'Commune': r.commune ?? '',
      'Bien': r.abrvBienimmobilier ?? '',
      'Période': r.periodeLettre ?? '',
      'Locataire': `${r.nomLocataire ?? ''} ${r.prenomLocataire ?? ''}`.trim(),
      'Montant loyer (FCFA)': Number(r.montantLoyerBailLPeriode ?? 0),
      'Montant payé (FCFA)': Number(r.montantPaye ?? 0),
      "Date d'encaissement": r.dateEncaissement ?? '',
      'Type paiement': r.descAppelLoyer ?? '',
      'Solde (FCFA)': Number(r.soldeAppelLoyer ?? 0),
      'Statut': r.statusAppelLoyer ?? '',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Règlements');
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    const label = `${this.debutStr}_au_${this.finStr}`;
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), `Reglements_loyer_${label}.xlsx`);
  }

  public printPage(): void {
    window.print();
  }

  // ─── Formatage ────────────────────────────────────────────────────────────

  public formatCurrency(value: number | null | undefined): string {
    const amount = Number(value ?? 0);
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} FCFA`;
  }

  public getStatusBadgeClass(status: string | null | undefined): string {
    const s = (status ?? '').toLowerCase();
    if (s === 'soldé') return 'rl-badge rl-badge--success';
    if (s.includes('partiellement')) return 'rl-badge rl-badge--warning';
    return 'rl-badge rl-badge--danger';
  }

  public get periodLabel(): string {
    if (!this.debutStr || !this.finStr) return '';
    const d = new Date(this.debutStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    const f = new Date(this.finStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    return `${d} → ${f}`;
  }

  // ─── Utilitaires ──────────────────────────────────────────────────────────

  private toIsoDate(d: Date): string {
    return formatDate(d, 'yyyy-MM-dd', 'fr');
  }

  private toApiDate(d: Date): string {
    return formatDate(d, 'dd-MM-yyyy', 'fr');
  }
}
