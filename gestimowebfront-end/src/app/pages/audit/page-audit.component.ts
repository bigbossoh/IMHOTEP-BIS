import { Component, OnInit } from '@angular/core';
import { AuditEntry, AuditService } from 'src/app/services/audit/audit.service';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';

export type MethodFilter = '' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type StatusFilter = '' | 'success' | 'error';

@Component({
  standalone: false,
  selector: 'app-page-audit',
  templateUrl: './page-audit.component.html',
  styleUrls: ['./page-audit.component.css'],
})
export class PageAuditComponent implements OnInit {

  allEntries: AuditEntry[] = [];
  filteredEntries: AuditEntry[] = [];
  loading = false;

  // Filtres
  searchTerm = '';
  methodFilter: MethodFilter = '';
  statusFilter: StatusFilter = '';
  moduleFilter = '';
  debutStr = '';
  finStr = '';

  availableModules: string[] = [];

  constructor(private auditService: AuditService) {}

  ngOnInit(): void {
    this.loadEntries();
  }

  // ─── Chargement ───────────────────────────────────────────────────────────

  public loadEntries(): void {
    this.loading = true;
    this.auditService.getAll().subscribe({
      next: (entries) => {
        this.allEntries = entries;
        this.availableModules = [...new Set(entries.map((e) => e.module))].sort();
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  // ─── KPIs ─────────────────────────────────────────────────────────────────

  get totalActions(): number { return this.allEntries.length; }

  get totalSuccess(): number { return this.allEntries.filter((e) => e.success).length; }

  get totalErrors(): number { return this.allEntries.filter((e) => !e.success).length; }

  get activeUsers(): number {
    return new Set(this.allEntries.map((e) => e.userName)).size;
  }

  get successRate(): number {
    if (!this.totalActions) return 0;
    return Math.round((this.totalSuccess / this.totalActions) * 100);
  }

  // ─── Filtres ──────────────────────────────────────────────────────────────

  public onSearchChange(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyFilters();
  }

  public setMethodFilter(val: MethodFilter): void {
    this.methodFilter = val;
    this.applyFilters();
  }

  public setStatusFilter(val: StatusFilter): void {
    this.statusFilter = val;
    this.applyFilters();
  }

  public setModuleFilter(event: Event): void {
    this.moduleFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  public applyDateFilter(): void {
    this.applyFilters();
  }

  public resetFilters(): void {
    this.searchTerm = '';
    this.methodFilter = '';
    this.statusFilter = '';
    this.moduleFilter = '';
    this.debutStr = '';
    this.finStr = '';
    this.applyFilters();
  }

  private applyFilters(): void {
    let rows = [...this.allEntries];

    if (this.debutStr) {
      const debut = new Date(this.debutStr + 'T00:00:00');
      rows = rows.filter((e) => new Date(e.timestamp) >= debut);
    }

    if (this.finStr) {
      const fin = new Date(this.finStr + 'T23:59:59');
      rows = rows.filter((e) => new Date(e.timestamp) <= fin);
    }

    if (this.methodFilter) {
      rows = rows.filter((e) => e.method === this.methodFilter);
    }

    if (this.statusFilter === 'success') rows = rows.filter((e) => e.success);
    if (this.statusFilter === 'error')   rows = rows.filter((e) => !e.success);

    if (this.moduleFilter) {
      rows = rows.filter((e) => e.module === this.moduleFilter);
    }

    if (this.searchTerm) {
      rows = rows.filter((e) =>
        [e.userName, e.action, e.module, e.url, `${e.status}`]
          .join(' ').toLowerCase().includes(this.searchTerm)
      );
    }

    this.filteredEntries = rows;
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  public clearAudit(): void {
    if (!confirm('Effacer tout l\'historique d\'audit ? Cette action est irréversible.')) return;
    this.auditService.clearAll().subscribe({
      next: () => this.loadEntries(),
    });
  }

  public exportToExcel(): void {
    const rows = this.filteredEntries.map((e) => ({
      'Date/Heure': this.formatTs(e.timestamp),
      'Utilisateur': e.userName,
      'Module': e.module,
      'Action': e.action,
      'Méthode': e.method,
      'Statut HTTP': e.status,
      'Résultat': e.success ? 'Succès' : 'Échec',
      'Durée (ms)': e.durationMs,
      'URL': e.url,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Audit');
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    const today = formatDate(new Date(), 'yyyy-MM-dd', 'fr');
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), `Audit_activites_${today}.xlsx`);
  }

  public printPage(): void {
    window.print();
  }

  // ─── Formatage ────────────────────────────────────────────────────────────

  public formatTs(iso: string): string {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      });
    } catch { return iso; }
  }

  public getMethodClass(method: string): string {
    switch (method) {
      case 'POST':   return 'au-method au-method--post';
      case 'PUT':    return 'au-method au-method--put';
      case 'DELETE': return 'au-method au-method--delete';
      case 'PATCH':  return 'au-method au-method--patch';
      default:       return 'au-method';
    }
  }

  public getStatusClass(entry: AuditEntry): string {
    return entry.success ? 'au-badge au-badge--success' : 'au-badge au-badge--danger';
  }

  public getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map((w) => w[0] ?? '').join('').toUpperCase();
  }

  public getRelativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60)   return `il y a ${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60)   return `il y a ${m}min`;
    const h = Math.floor(m / 60);
    if (h < 24)   return `il y a ${h}h`;
    const d = Math.floor(h / 24);
    return `il y a ${d}j`;
  }
}
