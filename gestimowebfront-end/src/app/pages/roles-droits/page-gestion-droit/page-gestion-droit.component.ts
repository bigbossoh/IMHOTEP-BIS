import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { UserService } from 'src/app/services/user/user.service';
import { ApiService } from 'src/gs-api/src/services';
import {
  DroitAccesDTO,
  GroupeDroitDto,
  UtilisateurAfficheDto,
  UtilisateurRequestDto,
} from 'src/gs-api/src/models';

type ActiveTab = 'roles' | 'droits' | 'groupes';

interface RoleSummary {
  value: string;
  label: string;
  description: string;
  count: number;
  authorities: string[];
}

@Component({
  standalone: false,
  selector: 'app-page-gestion-droit',
  templateUrl: './page-gestion-droit.component.html',
  styleUrls: ['./page-gestion-droit.component.css'],
})
export class PageGestionDroitComponent implements OnInit, OnDestroy {
  public user?: UtilisateurRequestDto;
  public users: UtilisateurAfficheDto[] = [];
  public droits: DroitAccesDTO[] = [];
  public groupes: GroupeDroitDto[] = [];
  public filteredUsers: UtilisateurAfficheDto[] = [];
  public filteredDroits: DroitAccesDTO[] = [];
  public filteredGroupes: GroupeDroitDto[] = [];
  public roleSummaries: RoleSummary[] = [];
  public activeTab: ActiveTab = 'roles';
  public searchTerm = '';
  public isLoading = false;
  public isSavingDroit = false;
  public isSavingGroupe = false;
  public errorMessage = '';
  public successMessage = '';
  public editingDroit?: DroitAccesDTO;
  public editingGroupe?: GroupeDroitDto;
  public droitForm: FormGroup;
  public groupeForm: FormGroup;

  private subscription?: Subscription;

  private readonly roleCatalog: Omit<RoleSummary, 'count'>[] = [
    {
      value: 'ROLE_SUPER_SUPERVISEUR',
      label: 'Super superviseur',
      description: 'Acces complet a la supervision, aux utilisateurs et aux parametrages.',
      authorities: ['user:read', 'user:create', 'user:update', 'user:delete', 'pays:read', 'pays:create', 'pays:update', 'pays:delete'],
    },
    {
      value: 'ROLE_SUPERVISEUR',
      label: 'Superviseur',
      description: 'Controle les operations de gestion et les comptes de l agence.',
      authorities: ['user:read', 'user:create', 'user:update', 'pays:read'],
    },
    {
      value: 'ROLE_GERANT',
      label: 'Gerant',
      description: 'Gere les biens, les baux, les loyers et les encaissements.',
      authorities: ['user:read', 'user:update', 'user:create', 'pays:read'],
    },
    {
      value: 'ROLE_PROPRIETAIRE',
      label: 'Proprietaire',
      description: 'Consulte les biens, les appels et les informations de son patrimoine.',
      authorities: ['user:read', 'pays:read'],
    },
    {
      value: 'ROLE_LOCATAIRE',
      label: 'Locataire',
      description: 'Consulte son compte, ses appels de loyer et ses documents.',
      authorities: ['user:read', 'site:read', 'pays:read'],
    },
    {
      value: 'ROLE_CLIENT_HOTEL',
      label: 'Client hotel',
      description: 'Acces limite aux donnees de reservation et de sejour.',
      authorities: ['user:read', 'site:read', 'pays:read'],
    },
  ];

  constructor(
    private readonly apiService: ApiService,
    private readonly userService: UserService,
    private readonly formBuilder: FormBuilder
  ) {
    this.droitForm = this.formBuilder.group({
      libelleDroit: ['', [Validators.required, Validators.minLength(2)]],
    });
    this.groupeForm = this.formBuilder.group({
      groupeDroit: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  public ngOnInit(): void {
    this.user = this.getCurrentUser();
    this.loadData();
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public get currentAgenceId(): number {
    return Number(this.user?.idAgence ?? this.user?.agenceDto ?? 0);
  }

  public get totalDroits(): number {
    return this.droits.length;
  }

  public get totalGroupes(): number {
    return this.groupes.length;
  }

  public get totalUsers(): number {
    return this.users.length;
  }

  public get activeUsers(): number {
    return this.users.filter((item) => item.active !== false && item.activated !== false).length;
  }

  public loadData(): void {
    const idAgence = this.currentAgenceId;
    if (!idAgence) {
      this.errorMessage = "Impossible de charger les roles et droits: agence utilisateur introuvable.";
      this.resetData();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.subscription?.unsubscribe();

    this.subscription = forkJoin({
      users: this.apiService.getAllUtilisateursByOrder(idAgence),
      droits: this.apiService.findAllDroitAccess(),
      groupes: this.apiService.findAllGroupeDroit(),
    }).subscribe({
      next: ({ users, droits, groupes }) => {
        this.users = this.sortUsers(users ?? []);
        this.droits = this.sortDroits(droits ?? []);
        this.groupes = this.sortGroupes(groupes ?? []);
        this.roleSummaries = this.buildRoleSummaries();
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.resetData();
        this.isLoading = false;
        this.errorMessage = 'Impossible de charger la gestion des roles et droits.';
      },
    });
  }

  public setTab(tab: ActiveTab): void {
    this.activeTab = tab;
    this.searchTerm = '';
    this.applyFilter();
  }

  public onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyFilter();
  }

  public saveDroit(): void {
    if (this.droitForm.invalid) {
      this.droitForm.markAllAsTouched();
      return;
    }

    this.isSavingDroit = true;
    this.errorMessage = '';
    this.successMessage = '';
    const body = {
      id: this.editingDroit?.id,
      idAgence: this.currentAgenceId,
      idCreateur: this.user?.id,
      libelleDroit: String(this.droitForm.value.libelleDroit ?? '').trim(),
    };

    this.apiService.saveDroitAccess(body).subscribe({
      next: () => {
        this.isSavingDroit = false;
        this.successMessage = this.editingDroit ? 'Droit modifie avec succes.' : 'Droit cree avec succes.';
        this.cancelDroitEdit();
        this.loadData();
      },
      error: () => {
        this.isSavingDroit = false;
        this.errorMessage = "Impossible d'enregistrer le droit.";
      },
    });
  }

  public saveGroupe(): void {
    if (this.groupeForm.invalid) {
      this.groupeForm.markAllAsTouched();
      return;
    }

    this.isSavingGroupe = true;
    this.errorMessage = '';
    this.successMessage = '';
    const body = {
      id: this.editingGroupe?.id,
      idAgence: this.currentAgenceId,
      idCreateur: this.user?.id,
      groupeDroit: String(this.groupeForm.value.groupeDroit ?? '').trim(),
    };

    this.apiService.saveGroupeDroit(body).subscribe({
      next: () => {
        this.isSavingGroupe = false;
        this.successMessage = this.editingGroupe ? 'Groupe modifie avec succes.' : 'Groupe cree avec succes.';
        this.cancelGroupeEdit();
        this.loadData();
      },
      error: () => {
        this.isSavingGroupe = false;
        this.errorMessage = "Impossible d'enregistrer le groupe de droits.";
      },
    });
  }

  public editDroit(droit: DroitAccesDTO): void {
    this.editingDroit = droit;
    this.droitForm.patchValue({ libelleDroit: droit.libelleDroit });
  }

  public editGroupe(groupe: GroupeDroitDto): void {
    this.editingGroupe = groupe;
    this.groupeForm.patchValue({ groupeDroit: groupe.groupeDroit });
  }

  public cancelDroitEdit(): void {
    this.editingDroit = undefined;
    this.droitForm.reset({ libelleDroit: '' });
  }

  public cancelGroupeEdit(): void {
    this.editingGroupe = undefined;
    this.groupeForm.reset({ groupeDroit: '' });
  }

  public deleteDroit(droit: DroitAccesDTO): void {
    if (!droit.id || !window.confirm(`Supprimer le droit "${droit.libelleDroit}" ?`)) {
      return;
    }

    this.apiService.deleteDroitAccess(droit.id).subscribe({
      next: () => {
        this.successMessage = 'Droit supprime avec succes.';
        this.loadData();
      },
      error: () => {
        this.errorMessage = 'Impossible de supprimer le droit.';
      },
    });
  }

  public deleteGroupe(groupe: GroupeDroitDto): void {
    if (!groupe.id || !window.confirm(`Supprimer le groupe "${groupe.groupeDroit}" ?`)) {
      return;
    }

    this.apiService.deleteGroupeDroit(groupe.id).subscribe({
      next: () => {
        this.successMessage = 'Groupe supprime avec succes.';
        this.loadData();
      },
      error: () => {
        this.errorMessage = 'Impossible de supprimer le groupe de droits.';
      },
    });
  }

  public exportToExcel(): void {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(this.roleSummaries.map((role) => ({
        Role: role.label,
        Code: role.value,
        Utilisateurs: role.count,
        Droits: role.authorities.join(', '),
      }))),
      'Roles'
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(this.droits.map((droit) => ({
        ID: droit.id ?? '',
        Code: droit.codeDroit ?? '',
        Libelle: droit.libelleDroit ?? '',
      }))),
      'Droits'
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(this.groupes.map((groupe) => ({
        ID: groupe.id ?? '',
        Groupe: groupe.groupeDroit ?? '',
      }))),
      'Groupes'
    );

    const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Roles_droits.xlsx');
  }

  public getRoleLabel(roleUsed: string | undefined): string {
    const normalized = this.normalizeRole(roleUsed);
    return this.roleCatalog.find((role) => role.value === normalized)?.label ?? roleUsed ?? '-';
  }

  public getUserFullName(user: UtilisateurAfficheDto): string {
    return [user.nom, user.prenom].filter(Boolean).join(' ') || user.email || user.username || '-';
  }

  public trackByRole(index: number, role: RoleSummary): string {
    return role.value || String(index);
  }

  public trackByUser(index: number, user: UtilisateurAfficheDto): number {
    return user.id ?? index;
  }

  public trackByDroit(index: number, droit: DroitAccesDTO): number {
    return droit.id ?? index;
  }

  public trackByGroupe(index: number, groupe: GroupeDroitDto): number {
    return groupe.id ?? index;
  }

  private applyFilter(): void {
    const term = this.searchTerm;
    this.filteredUsers = this.users.filter((user) =>
      !term ||
      [
        this.getUserFullName(user),
        user.email,
        user.mobile,
        user.username,
        this.getRoleLabel(user.roleUsed),
      ]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
    this.filteredDroits = this.droits.filter((droit) =>
      !term ||
      [droit.id, droit.codeDroit, droit.libelleDroit]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
    this.filteredGroupes = this.groupes.filter((groupe) =>
      !term ||
      [groupe.id, groupe.groupeDroit]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }

  private buildRoleSummaries(): RoleSummary[] {
    return this.roleCatalog.map((role) => ({
      ...role,
      count: this.users.filter((user) => this.normalizeRole(user.roleUsed) === role.value).length,
    }));
  }

  private normalizeRole(roleUsed: string | undefined): string {
    const value = String(roleUsed ?? '').trim().toUpperCase().replace(/\s+/g, '_');
    return value.startsWith('ROLE_') ? value : `ROLE_${value}`;
  }

  private sortUsers(rows: UtilisateurAfficheDto[]): UtilisateurAfficheDto[] {
    return [...rows].sort((left, right) =>
      this.getUserFullName(left).localeCompare(this.getUserFullName(right))
    );
  }

  private sortDroits(rows: DroitAccesDTO[]): DroitAccesDTO[] {
    return [...rows].sort((left, right) =>
      String(left.libelleDroit ?? '').localeCompare(String(right.libelleDroit ?? ''))
    );
  }

  private sortGroupes(rows: GroupeDroitDto[]): GroupeDroitDto[] {
    return [...rows].sort((left, right) =>
      String(left.groupeDroit ?? '').localeCompare(String(right.groupeDroit ?? ''))
    );
  }

  private resetData(): void {
    this.users = [];
    this.droits = [];
    this.groupes = [];
    this.filteredUsers = [];
    this.filteredDroits = [];
    this.filteredGroupes = [];
    this.roleSummaries = this.buildRoleSummaries();
  }

  private getCurrentUser(): UtilisateurRequestDto | undefined {
    try {
      const user = this.userService.getUserFromLocalCache();
      return user ?? undefined;
    } catch (error) {
      return undefined;
    }
  }
}
