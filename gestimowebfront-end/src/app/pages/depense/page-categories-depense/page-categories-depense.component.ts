import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DepenseService } from 'src/app/services/depense/depense.service';
import { UserService } from 'src/app/services/user/user.service';
import { ExpenseWorkflowConfig } from 'src/app/services/depense/depense.models';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';

interface CategoryEntry {
  name: string;
}

interface ImportResult {
  type: 'success' | 'error' | 'warn';
  message: string;
}

@Component({
  standalone: false,
  selector: 'app-page-categories-depense',
  templateUrl: './page-categories-depense.component.html',
  styleUrls: ['./page-categories-depense.component.css'],
})
export class PageCategoriesDepenseComponent implements OnInit {
  user?: UtilisateurRequestDto;

  categories: CategoryEntry[] = [];
  config?: ExpenseWorkflowConfig;

  addForm!: FormGroup;

  loading = false;
  saving = false;
  isFormVisible = false;
  isEditing = false;
  searchTerm = '';
  isImporting = false;
  importResult?: ImportResult;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  readonly pageSizeOptions = [10, 25, 50, 100];

  private editingOriginalName = '';

  get filteredCategories(): CategoryEntry[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.categories;
    return this.categories.filter((c) => c.name.toLowerCase().includes(term));
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredCategories.length / this.pageSize));
  }

  get paginatedCategories(): CategoryEntry[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCategories.slice(start, start + this.pageSize);
  }

  get paginationStart(): number {
    if (this.filteredCategories.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredCategories.length);
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    const range: number[] = [];

    const start = Math.max(2, current - delta);
    const end = Math.min(total - 1, current + delta);

    range.push(1);
    if (start > 2) range.push(-1);
    for (let i = start; i <= end; i++) range.push(i);
    if (end < total - 1) range.push(-1);
    if (total > 1) range.push(total);

    return range;
  }

  constructor(
    private fb: FormBuilder,
    private depenseService: DepenseService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.addForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    });
    this.loadCategories();
  }

  loadCategories(): void {
    if (!this.user?.idAgence) return;
    this.loading = true;
    this.depenseService.getWorkflowConfig(this.user.idAgence).subscribe({
      next: (cfg) => {
        this.loading = false;
        this.config = cfg;
        this.categories = (cfg?.categories ?? []).map((name) => ({ name }));
        this.goToPage(1);
      },
      error: () => {
        this.loading = false;
        this.showToast('Impossible de charger les catégories.', 'error');
      },
    });
  }

  openAddForm(): void {
    this.isEditing = false;
    this.editingOriginalName = '';
    this.addForm.reset({ name: '' });
    this.isFormVisible = true;
  }

  openEditForm(entry: CategoryEntry): void {
    this.isEditing = true;
    this.editingOriginalName = entry.name;
    this.addForm.setValue({ name: entry.name });
    this.isFormVisible = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeForm(): void {
    this.isFormVisible = false;
    this.addForm.reset({ name: '' });
  }

  saveCategory(): void {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }
    const name: string = (this.addForm.value.name as string).trim();
    const isDuplicate = this.categories.some(
      (c) =>
        c.name.toLowerCase() === name.toLowerCase() &&
        c.name !== this.editingOriginalName
    );
    if (isDuplicate) {
      this.showToast('Cette catégorie existe déjà.', 'warn');
      return;
    }

    if (this.isEditing) {
      this.categories = this.categories.map((c) =>
        c.name === this.editingOriginalName ? { name } : c
      );
    } else {
      this.categories = [...this.categories, { name }];
    }

    this.closeForm();
    this.persistCategories(() => {
      const msg = this.isEditing
        ? `Catégorie renommée en "${name}".`
        : `Catégorie "${name}" ajoutée.`;
      this.showToast(msg, 'success');
      this.goToPage(this.isEditing ? this.currentPage : this.totalPages);
    });
  }

  deleteCategory(entry: CategoryEntry): void {
    this.categories = this.categories.filter((c) => c.name !== entry.name);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    this.persistCategories(() => {
      this.showToast(`Catégorie "${entry.name}" supprimée.`, 'success');
    });
  }

  // ── Pagination ──────────────────────────────────────────────────────────────

  goToPage(page: number): void {
    const p = Math.max(1, Math.min(page, this.totalPages));
    this.currentPage = p;
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  // ── Excel Export ────────────────────────────────────────────────────────────

  exportToExcel(): void {
    const rows = this.categories.map((c, i) => ({
      '#': i + 1,
      Catégorie: c.name,
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Catégories');
    const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const today = formatDate(new Date(), 'yyyy-MM-dd', 'fr');
    saveAs(
      new Blob([buffer], { type: 'application/octet-stream' }),
      `Categories_depenses_${today}.xlsx`
    );
  }

  // ── Excel Import ────────────────────────────────────────────────────────────

  triggerImport(): void {
    const input = document.getElementById('importFileInput') as HTMLInputElement;
    input?.click();
  }

  onImportFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.isImporting = true;
    this.importResult = undefined;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet);

        const imported: string[] = rows
          .map((r) => {
            const val = r['Catégorie'] ?? r['Categorie'] ?? r[Object.keys(r)[1]] ?? r[Object.keys(r)[0]];
            return typeof val === 'string' ? val.trim() : String(val ?? '').trim();
          })
          .filter((v) => v.length >= 2 && v.length <= 80);

        if (imported.length === 0) {
          this.isImporting = false;
          this.importResult = {
            type: 'warn',
            message: 'Aucune catégorie valide trouvée dans le fichier (colonne "Catégorie" attendue, 2-80 caractères).',
          };
          input.value = '';
          return;
        }

        const existingNames = new Set(this.categories.map((c) => c.name.toLowerCase()));
        const newEntries: CategoryEntry[] = imported
          .filter((name) => !existingNames.has(name.toLowerCase()))
          .map((name) => ({ name }));

        const skipped = imported.length - newEntries.length;
        this.categories = [...this.categories, ...newEntries];

        this.persistCategories(() => {
          this.isImporting = false;
          this.importResult = {
            type: 'success',
            message: `${newEntries.length} catégorie(s) importée(s).${skipped > 0 ? ` ${skipped} doublon(s) ignoré(s).` : ''}`,
          };
          this.goToPage(this.totalPages);
        });
      } catch {
        this.isImporting = false;
        this.importResult = {
          type: 'error',
          message: 'Erreur lors de la lecture du fichier. Vérifiez le format (.xlsx ou .xls).',
        };
      }
      input.value = '';
    };

    reader.onerror = () => {
      this.isImporting = false;
      this.importResult = {
        type: 'error',
        message: 'Impossible de lire le fichier.',
      };
      input.value = '';
    };

    reader.readAsArrayBuffer(file);
  }

  dismissImportResult(): void {
    this.importResult = undefined;
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  private persistCategories(onSuccess?: () => void): void {
    if (!this.user?.idAgence) return;
    this.saving = true;
    const payload: ExpenseWorkflowConfig = {
      ...(this.config ?? {}),
      id: this.config?.id,
      idAgence: this.user.idAgence,
      idCreateur: this.user.id,
      active: this.config?.active ?? false,
      validationThreshold: this.config?.validationThreshold ?? 100000,
      levelCount: this.config?.levelCount ?? 2,
      categories: this.categories.map((c) => c.name),
      paymentModes: this.config?.paymentModes ?? [],
      levels: this.config?.levels ?? [],
    };
    this.depenseService.saveWorkflowConfig(payload).subscribe({
      next: (saved) => {
        this.saving = false;
        this.config = saved;
        onSuccess?.();
      },
      error: () => {
        this.saving = false;
        this.showToast('Erreur lors de la sauvegarde.', 'error');
      },
    });
  }

  private showToast(message: string, type: 'success' | 'error' | 'warn'): void {
    const panelClass =
      type === 'success'
        ? 'snack-success'
        : type === 'error'
        ? 'snack-error'
        : 'snack-warn';
    this.snackBar.open(message, 'Fermer', { duration: 3500, panelClass: [panelClass] });
  }
}
