import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import { formatDate } from '@angular/common';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { saveAs } from 'file-saver';
import { finalize } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import {
  AgenceImmobilierDTO,
  UtilisateurAfficheDto,
  UtilisateurRequestDto,
} from 'src/gs-api/src/models';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { AgenceService } from 'src/app/services/Agence/agence.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService, ImportResult } from 'src/app/services/user/user.service';

type ManagedRole = 'LOCATAIRE' | 'PROPRIETAIRE' | 'GERANT' | 'SUPERVISEUR' | 'SUPER_SUPERVISEUR';
type RoleFilter = 'ALL' | ManagedRole;

interface RoleOption {
  value: ManagedRole;
  label: string;
}

interface CiviliteOption {
  value: string;
  label: string;
}

@Component({
  standalone: false,
  templateUrl: './page-liste-utilisateurs.component.html',
  styleUrls: ['./page-liste-utilisateurs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageListeUtilisateursComponent implements OnInit {
  public readonly roleOptions: RoleOption[] = [
    { value: 'LOCATAIRE', label: 'Locataire' },
    { value: 'PROPRIETAIRE', label: 'Propriétaire' },
    { value: 'GERANT', label: 'Gérant' },
    { value: 'SUPERVISEUR', label: 'Superviseur' },
    { value: 'SUPER_SUPERVISEUR', label: 'Super-superviseur' },
  ];
  public readonly civiliteOptions: CiviliteOption[] = [
    { value: 'Monsieur', label: 'Monsieur' },
    { value: 'Madame', label: 'Madame' },
    { value: 'Mademoiselle', label: 'Mademoiselle' },
  ];

  public readonly currentUser = signal<UtilisateurRequestDto | null>(null);
  public readonly users = signal<UtilisateurAfficheDto[]>([]);
  public readonly agencies = signal<AgenceImmobilierDTO[]>([]);
  public readonly searchTerm = signal('');
  public readonly roleFilter = signal<RoleFilter>('ALL');
  public readonly isLoading = signal(false);
  public readonly isSubmitting = signal(false);
  public readonly isFormVisible = signal(false);
  public readonly editingUserId = signal<number | null>(null);
  public readonly deactivatingUserId = signal<number | null>(null);
  public readonly deletingUserId = signal<number | null>(null);
  public readonly loadErrorMessage = signal('');
  public readonly metadataErrorMessage = signal('');
  public readonly isImporting = signal(false);
  public readonly importResult = signal<ImportResult | null>(null);
  public readonly currentPage = signal(1);
  public readonly pageSize = signal(10);
  public readonly pageSizeOptions = [10, 25, 50, 100];

  public readonly managedUsers = computed(() =>
    this.users().filter((user) => this.isManagedRole(user.roleUsed))
  );

  public readonly filteredUsers = computed(() => {
    const normalizedSearch = this.searchTerm().trim().toLowerCase();
    const selectedRole = this.roleFilter();

    return this.managedUsers().filter((user) => {
      const role = this.extractRoleValue(user.roleUsed);
      const matchesRole = selectedRole === 'ALL' || role === selectedRole;
      if (!matchesRole) return false;
      if (!normalizedSearch) return true;

      return [user.nom, user.prenom, this.getRoleLabel(user.roleUsed), user.email]
        .filter((value): value is string => !!value)
        .some((value) => value.toLowerCase().includes(normalizedSearch));
    });
  });

  public readonly roleCounts = computed(() => {
    const counts: Record<ManagedRole, number> = {
      LOCATAIRE: 0,
      PROPRIETAIRE: 0,
      GERANT: 0,
      SUPERVISEUR: 0,
      SUPER_SUPERVISEUR: 0,
    };
    for (const user of this.managedUsers()) {
      const role = this.extractRoleValue(user.roleUsed);
      if (role) counts[role] += 1;
    }
    return counts;
  });

  public readonly totalPages = computed(() => {
    const totalUsers = this.filteredUsers().length;
    return Math.max(1, Math.ceil(totalUsers / this.pageSize()));
  });

  public readonly currentPageNumber = computed(() =>
    Math.min(this.currentPage(), this.totalPages())
  );

  public readonly paginatedUsers = computed(() => {
    const page = this.currentPageNumber();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return this.filteredUsers().slice(start, start + size);
  });

  public readonly paginationStart = computed(() => {
    if (this.filteredUsers().length === 0) return 0;
    return (this.currentPageNumber() - 1) * this.pageSize() + 1;
  });

  public readonly paginationEnd = computed(() =>
    Math.min(this.currentPageNumber() * this.pageSize(), this.filteredUsers().length)
  );

  public readonly visiblePages = computed(() => {
    const totalPages = this.totalPages();
    const currentPage = this.currentPageNumber();
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    const adjustedStart = Math.max(1, end - 4);
    return Array.from(
      { length: end - adjustedStart + 1 },
      (_, index) => adjustedStart + index
    );
  });

  public userForm!: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private userService: UserService,
    private agenceService: AgenceService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.currentUser.set(this.getCurrentUserSafely());
    this.initForm();
    this.loadAgences();
    this.loadUsers();
  }

  get isEditionMode(): boolean {
    return this.editingUserId() !== null;
  }

  get formTitle(): string {
    return this.isEditionMode ? 'Modifier un utilisateur' : 'Créer un utilisateur';
  }

  get nomControl() { return this.userForm.get('nom'); }
  get emailControl() { return this.userForm.get('email'); }
  get roleControl() { return this.userForm.get('roleUsed'); }
  get agenceControl() { return this.userForm.get('idAgence'); }
  get passwordControl() { return this.userForm.get('password'); }

  public openCreateForm(): void {
    this.editingUserId.set(null);
    this.isFormVisible.set(true);
    this.userForm.reset(this.getDefaultFormValue());
    this.updateFormMode(false);
  }

  public openEditForm(user: UtilisateurAfficheDto): void {
    if (!user.id) {
      this.sendNotification(NotificationType.ERROR, "Impossible d'identifier cet utilisateur.");
      return;
    }
    this.editingUserId.set(user.id);
    this.isFormVisible.set(true);
    this.userForm.reset({
      ...this.getDefaultFormValue(),
      id: user.id,
      idAgence: user.idAgence ?? this.currentUser()?.idAgence ?? null,
      agenceDto: user.idAgence ?? this.currentUser()?.idAgence ?? null,
      nom: user.nom ?? '',
      prenom: user.prenom ?? '',
      email: user.email ?? '',
      roleUsed: this.extractRoleValue(user.roleUsed) ?? 'LOCATAIRE',
      genre: this.normalizeCivilite(user.genre),
      nationalite: user.nationalite ?? '',
      lieuNaissance: user.lieuNaissance ?? '',
      dateDeNaissance: this.toDateInputValue(user.dateDeNaissance),
      typePieceIdentite: user.typePieceIdentite ?? '',
      numeroPieceIdentite: user.numeroPieceIdentite ?? '',
      dateDebutPiece: this.toDateInputValue(user.dateDebutPiece),
      dateFinPiece: this.toDateInputValue(user.dateFinPiece),
      active: user.active ?? true,
      nonLocked: user.nonLocked ?? true,
      password: '',
    });
    this.updateFormMode(true);
  }

  public closeForm(): void {
    this.editingUserId.set(null);
    this.isFormVisible.set(false);
    this.userForm.reset(this.getDefaultFormValue());
    this.updateFormMode(false);
  }

  public refreshUsers(): void {
    this.loadUsers();
  }

  public exportUsersToExcel(): void {
    const users = this.filteredUsers();
    if (!users.length) {
      this.sendNotification(NotificationType.ERROR, 'Aucun utilisateur à exporter.');
      return;
    }

    const rows = users.map((user) => ({
      'Nom': user.nom ?? '',
      'Prénoms': user.prenom ?? '',
      'Rôle': this.getRoleLabel(user.roleUsed),
      'Agence': this.getAgenceNameByIdAgence(user.idAgence),
      'Email': user.email ?? '',
      'Téléphone': user.mobile ?? '',
      'Civilité': this.normalizeCivilite(user.genre),
      'Nationalité': user.nationalite ?? '',
      'État': user.active ? 'Actif' : 'Inactif',
      'Bail en cours': user.hasActiveBail ? 'Oui' : 'Non',
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Utilisateurs');
    const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const today = formatDate(new Date(), 'yyyy-MM-dd', 'fr');

    saveAs(
      new Blob([buffer], { type: 'application/octet-stream' }),
      `Utilisateurs_${today}.xlsx`
    );
  }

  public onImportFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const currentUser = this.currentUser();
    const idAgence = currentUser?.idAgence;
    const idCreateur = currentUser?.id;

    if (!idAgence || !idCreateur) {
      this.sendNotification(NotificationType.ERROR, "Impossible d'identifier l'agence ou le créateur.");
      input.value = '';
      return;
    }

    this.isImporting.set(true);
    this.importResult.set(null);

    this.userService
      .importUsersFromExcel(file, idAgence, idCreateur)
      .pipe(finalize(() => { this.isImporting.set(false); input.value = ''; }))
      .subscribe({
        next: (result) => {
          this.importResult.set(result);
          if (result.success > 0) {
            this.sendNotification(
              NotificationType.SUCCESS,
              `Import terminé : ${result.success} utilisateur(s) importé(s) sur ${result.total}.`
            );
            this.loadUsers();
          } else {
            this.sendNotification(NotificationType.ERROR, `Aucun utilisateur importé. ${result.errors} erreur(s).`);
          }
        },
        error: (error) => {
          this.sendNotification(
            NotificationType.ERROR,
            this.getErrorMessage(error, "L'import du fichier Excel a échoué.")
          );
        },
      });
  }

  public dismissImportResult(): void {
    this.importResult.set(null);
  }

  public onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
    this.currentPage.set(1);
  }

  public onRoleFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as RoleFilter;
    this.roleFilter.set(value || 'ALL');
    this.currentPage.set(1);
  }

  public onPageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (Number.isFinite(value) && value > 0) {
      this.pageSize.set(value);
      this.currentPage.set(1);
    }
  }

  public goToPage(page: number): void {
    const safePage = Math.min(Math.max(1, page), this.totalPages());
    this.currentPage.set(safePage);
  }

  public previousPage(): void {
    this.goToPage(this.currentPageNumber() - 1);
  }

  public nextPage(): void {
    this.goToPage(this.currentPageNumber() + 1);
  }

  public onAgenceSelectionChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const agenceId = this.normalizePositiveId(value);
    this.userForm.patchValue({ idAgence: agenceId, agenceDto: agenceId }, { emitEvent: false });
  }

  public saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();
    this.isSubmitting.set(true);

    this.userService
      .saveUser(payload)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (savedUser) => {
          this.upsertUser(savedUser);
          this.sendNotification(
            NotificationType.SUCCESS,
            this.isEditionMode
              ? "L'utilisateur a été modifié avec succès."
              : "L'utilisateur a été créé avec succès."
          );
          this.closeForm();
          this.loadUsers();
        },
        error: (error) => {
          this.sendNotification(
            NotificationType.ERROR,
            this.getErrorMessage(error, "La sauvegarde de l'utilisateur a échoué.")
          );
        },
      });
  }

  public deactivateUser(user: UtilisateurAfficheDto): void {
    if (!user.id) {
      this.sendNotification(NotificationType.ERROR, "Impossible d'identifier cet utilisateur.");
      return;
    }
    if (user.active === false) return;

    const confirmation = window.confirm(`Désactiver ${this.getDisplayName(user)} ?`);
    if (!confirmation) return;

    this.deactivatingUserId.set(user.id);
    this.userService
      .deactivateUser(user.id)
      .pipe(finalize(() => this.deactivatingUserId.set(null)))
      .subscribe({
        next: (updatedUser) => {
          this.upsertUser(updatedUser);
          this.sendNotification(NotificationType.SUCCESS, "L'utilisateur a été désactivé.");
          if (this.editingUserId() === updatedUser.id) this.openEditForm(updatedUser);
          this.loadUsers();
        },
        error: (error) => {
          this.sendNotification(
            NotificationType.ERROR,
            this.getErrorMessage(error, "La désactivation de l'utilisateur a échoué.")
          );
        },
      });
  }

  public deleteUser(user: UtilisateurAfficheDto): void {
    if (!user.id) {
      this.sendNotification(NotificationType.ERROR, "Impossible d'identifier cet utilisateur.");
      return;
    }
    if (!this.canDeleteUser(user)) {
      this.sendNotification(
        NotificationType.ERROR,
        this.getDeleteBlockedReason(user)
      );
      return;
    }

    const confirmation = window.confirm(
      `Supprimer ${this.getDisplayName(user)} ? Cette action est irréversible.`
    );
    if (!confirmation) return;

    this.deletingUserId.set(user.id);
    this.userService
      .deleteUser(user.id)
      .pipe(finalize(() => this.deletingUserId.set(null)))
      .subscribe({
        next: () => {
          this.removeUser(user.id!);
          if (this.editingUserId() === user.id) {
            this.closeForm();
          }
          this.sendNotification(NotificationType.SUCCESS, "L'utilisateur a été supprimé.");
          this.loadUsers();
        },
        error: (error) => {
          this.sendNotification(
            NotificationType.ERROR,
            this.getErrorMessage(error, "La suppression de l'utilisateur a échoué.")
          );
        },
      });
  }

  public getAgenceNameByIdAgence(idAgence: number | undefined): string {
    if (!idAgence) return '-';
    const agence = this.agencies().find(
      (a) => (a.idAgence ?? a.id) === idAgence
    );
    return agence ? this.getAgenceLabel(agence) : '-';
  }

  public getRoleLabel(roleUsed: string | undefined): string {
    const role = this.extractRoleValue(roleUsed);
    switch (role) {
      case 'LOCATAIRE': return 'Locataire';
      case 'PROPRIETAIRE': return 'Propriétaire';
      case 'GERANT': return 'Gérant';
      case 'SUPERVISEUR': return 'Superviseur';
      case 'SUPER_SUPERVISEUR': return 'Super-superviseur';
      default: return roleUsed ?? 'Inconnu';
    }
  }

  public getRoleBadgeClass(roleUsed: string | undefined): string {
    const role = this.extractRoleValue(roleUsed);
    switch (role) {
      case 'LOCATAIRE': return 'badge badge-role badge-role--tenant';
      case 'PROPRIETAIRE': return 'badge badge-role badge-role--owner';
      case 'GERANT': return 'badge badge-role badge-role--manager';
      case 'SUPERVISEUR': return 'badge badge-role badge-role--supervisor';
      case 'SUPER_SUPERVISEUR': return 'badge badge-role badge-role--super-supervisor';
      default: return 'badge badge-role';
    }
  }

  public getAgenceLabel(agence: AgenceImmobilierDTO): string {
    const label = agence.nomAgence?.trim() || agence.sigleAgence?.trim();
    return label && label.length > 0
      ? label
      : `Agence ${agence.idAgence ?? agence.id ?? ''}`.trim();
  }

  public getDisplayName(user: UtilisateurAfficheDto): string {
    return [user.nom, user.prenom]
      .filter((v): v is string => !!v && v.trim().length > 0)
      .join(' ')
      .trim() || user.email || 'Utilisateur';
  }

  public canDeleteUser(user: UtilisateurAfficheDto): boolean {
    return user.canBeDeleted !== false;
  }

  public getDeleteBlockedReason(user: UtilisateurAfficheDto): string {
    if (user.hasActiveBail) {
      return "Impossible de supprimer cet utilisateur car il a un bail en cours.";
    }
    return "Impossible de supprimer cet utilisateur pour le moment.";
  }

  public getDeleteButtonTitle(user: UtilisateurAfficheDto): string {
    return this.canDeleteUser(user)
      ? 'Supprimer définitivement cet utilisateur'
      : this.getDeleteBlockedReason(user);
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      id: [0],
      idAgence: [this.currentUser()?.idAgence ?? null, Validators.required],
      idCreateur: [this.currentUser()?.id ?? null],
      agenceDto: [this.currentUser()?.idAgence ?? null],
      nom: ['', Validators.required],
      prenom: [''],
      email: ['', [Validators.required, Validators.email]],
      roleUsed: ['LOCATAIRE', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
      genre: [''],
      nationalite: [''],
      lieuNaissance: [''],
      dateDeNaissance: [''],
      typePieceIdentite: [''],
      numeroPieceIdentite: [''],
      dateDebutPiece: [''],
      dateFinPiece: [''],
      active: [true],
      nonLocked: [true],
    });
  }

  private getDefaultFormValue(): Record<string, unknown> {
    return {
      id: 0,
      idAgence: this.currentUser()?.idAgence ?? null,
      idCreateur: this.currentUser()?.id ?? null,
      agenceDto: this.currentUser()?.idAgence ?? null,
      nom: '',
      prenom: '',
      email: '',
      roleUsed: 'LOCATAIRE',
      password: '',
      genre: '',
      nationalite: '',
      lieuNaissance: '',
      dateDeNaissance: '',
      typePieceIdentite: '',
      numeroPieceIdentite: '',
      dateDebutPiece: '',
      dateFinPiece: '',
      active: true,
      nonLocked: true,
    };
  }

  private updateFormMode(isEditMode: boolean): void {
    const passwordControl = this.userForm.get('password');
    if (!passwordControl) return;

    if (isEditMode) {
      passwordControl.clearValidators();
    } else {
      passwordControl.setValidators([Validators.required, Validators.minLength(4)]);
    }
    passwordControl.updateValueAndValidity();
  }

  private buildPayload(): UtilisateurRequestDto {
    const formValue = this.userForm.getRawValue();
    const currentUser = this.currentUser();
    const email = `${formValue.email ?? ''}`.trim();
    const password = `${formValue.password ?? ''}`.trim();

    return {
      id: this.isEditionMode ? this.editingUserId() ?? formValue.id : 0,
      idAgence: formValue.idAgence ?? currentUser?.idAgence ?? undefined,
      agenceDto: formValue.idAgence ?? currentUser?.idAgence ?? undefined,
      idCreateur: currentUser?.id ?? formValue.idCreateur ?? undefined,
      userCreate: currentUser?.id ?? undefined,
      idEtablissement: 1,
      nom: formValue.nom?.trim(),
      prenom: formValue.prenom?.trim(),
      email: email,
      mobile: email,
      username: email,
      password: password || undefined,
      roleUsed: formValue.roleUsed,
      genre: this.normalizeCivilite(formValue.genre) || undefined,
      nationalite: formValue.nationalite?.trim(),
      lieuNaissance: formValue.lieuNaissance?.trim(),
      dateDeNaissance: formValue.dateDeNaissance || undefined,
      typePieceIdentite: formValue.typePieceIdentite?.trim(),
      numeroPieceIdentite: formValue.numeroPieceIdentite?.trim(),
      dateDebutPiece: formValue.dateDebutPiece || undefined,
      dateFinPiece: formValue.dateFinPiece || undefined,
      active: formValue.active ?? true,
      activated: formValue.active ?? true,
      nonLocked: formValue.nonLocked ?? true,
    };
  }

  private loadAgences(): void {
    this.agenceService.getAllAgences().subscribe({
      next: (agences) => {
        this.agencies.set(
          [...(agences ?? [])].sort((l, r) =>
            this.getAgenceLabel(l).localeCompare(this.getAgenceLabel(r), 'fr')
          )
        );
      },
      error: () => {
        this.agencies.set([]);
        this.metadataErrorMessage.set('Impossible de charger la liste des agences.');
      },
    });
  }

  private loadUsers(): void {
    const agenceId = this.currentUser()?.idAgence;
    if (!agenceId) {
      this.users.set([]);
      this.loadErrorMessage.set("Aucune agence n'est associée à la session.");
      return;
    }

    this.isLoading.set(true);
    this.loadErrorMessage.set('');
    this.userService
      .getUsersByAgence(agenceId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (payload) => {
          this.users.set(this.normalizeUserList(payload));
          this.currentPage.set(1);
        },
        error: (error) => {
          this.users.set([]);
          this.loadErrorMessage.set(
            this.getErrorMessage(error, 'Impossible de charger les utilisateurs.')
          );
        },
      });
  }

  private normalizeUserList(payload: unknown): UtilisateurAfficheDto[] {
    if (Array.isArray(payload)) return payload;

    if (payload && typeof payload === 'object') {
      const rec = payload as Record<string, unknown>;
      if (Array.isArray(rec['body'])) return rec['body'] as UtilisateurAfficheDto[];
      if (rec['id'] !== undefined || rec['utilisateurIdApp'] !== undefined) {
        return [rec as UtilisateurAfficheDto];
      }
    }
    return [];
  }

  private upsertUser(user: UtilisateurAfficheDto | null | undefined): void {
    if (!user?.id) return;

    const existingIndex = this.users().findIndex((u) => u.id === user.id);
    if (existingIndex >= 0) {
      this.users.set(this.users().map((u, i) => (i === existingIndex ? user : u)));
      return;
    }
    this.users.set([...this.users(), user]);
  }

  private removeUser(userId: number): void {
    this.users.set(this.users().filter((user) => user.id !== userId));
  }

  private extractRoleValue(roleUsed: string | undefined): ManagedRole | null {
    const normalized = `${roleUsed ?? ''}`.trim().toUpperCase();
    if (!normalized) return null;

    const role = normalized.startsWith('ROLE_') ? normalized.substring(5) : normalized;
    if (
      role === 'LOCATAIRE' ||
      role === 'PROPRIETAIRE' ||
      role === 'GERANT' ||
      role === 'SUPERVISEUR' ||
      role === 'SUPER_SUPERVISEUR'
    ) {
      return role;
    }
    return null;
  }

  private isManagedRole(roleUsed: string | undefined): boolean {
    return this.extractRoleValue(roleUsed) !== null;
  }

  private toDateInputValue(value: string | undefined): string {
    return value ? `${value}`.substring(0, 10) : '';
  }

  private normalizeCivilite(value: unknown): string {
    const normalizedValue = `${value ?? ''}`.trim();
    if (!normalizedValue) return '';

    const lowerValue = normalizedValue.toLowerCase();
    if (['m', 'masculin', 'homme', 'monsieur'].includes(lowerValue)) {
      return 'Monsieur';
    }
    if (['f', 'feminin', 'féminin', 'femme', 'madame', 'mme'].includes(lowerValue)) {
      return 'Madame';
    }
    if (['mademoiselle', 'mlle'].includes(lowerValue)) {
      return 'Mademoiselle';
    }

    return normalizedValue;
  }

  private normalizePositiveId(value: unknown): number | null {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  private getCurrentUserSafely(): UtilisateurRequestDto | null {
    try {
      return this.userService.getUserFromLocalCache();
    } catch {
      return null;
    }
  }

  private getErrorMessage(error: any, fallbackMessage: string): string {
    if (typeof error?.error === 'string' && error.error.trim().length > 0) return error.error;
    if (Array.isArray(error?.error?.errors)) return error.error.errors.filter(Boolean).join(', ');
    if (typeof error?.error?.message === 'string') return error.error.message;
    if (typeof error?.error?.errorMessage === 'string') return error.error.errorMessage;
    if (typeof error?.error?.messages === 'string') return error.error.messages;
    if (typeof error?.message === 'string') return error.message;
    return fallbackMessage;
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    this.notificationService.notify(notificationType, message);
  }
}
