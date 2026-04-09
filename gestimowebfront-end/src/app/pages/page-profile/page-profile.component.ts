import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import {
  AgenceResponseDto,
  EtablissementUtilisateurDto,
  UtilisateurRequestDto,
} from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';
import { UserService } from 'src/app/services/user/user.service';

interface ProfileField {
  icon: string;
  label: string;
  value: string;
}

interface ProfileOverviewCard {
  label: string;
  value: string;
  caption: string;
}

@Component({
  standalone: false,
  selector: 'app-page-profile',
  templateUrl: './page-profile.component.html',
  styleUrls: ['./page-profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageProfileComponent {
  private readonly userService = inject(UserService);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  readonly user = signal<UtilisateurRequestDto | null>(this.readUserFromCache());
  readonly agenceError = signal<string | null>(null);
  readonly etablissementError = signal<string | null>(null);

  readonly agence = toSignal(this.loadAgence(), {
    initialValue: null as AgenceResponseDto | null,
  });

  readonly etablissement = toSignal(this.loadEtablissement(), {
    initialValue: null as EtablissementUtilisateurDto | null,
  });

  readonly fullName = computed(() => {
    const currentUser = this.user();
    if (!currentUser) {
      return 'Profil utilisateur indisponible';
    }

    return [currentUser.nom, currentUser.prenom].filter(Boolean).join(' ').trim() || currentUser.username || 'Utilisateur';
  });

  readonly initials = computed(() => {
    const currentUser = this.user();
    const nom = currentUser?.nom?.trim().charAt(0) ?? '';
    const prenom = currentUser?.prenom?.trim().charAt(0) ?? '';
    return `${nom}${prenom}`.toUpperCase() || 'GU';
  });

  readonly roleLabel = computed(() => this.user()?.roleUsed || 'Aucun role defini');

  readonly accountStateLabel = computed(() =>
    this.user()?.active ? 'Compte actif' : 'Compte inactif'
  );

  readonly authorities = computed(() =>
    (this.user()?.authorities ?? []).filter(
      (authority): authority is string => typeof authority === 'string' && authority.trim().length > 0
    )
  );

  readonly overviewCards = computed<ProfileOverviewCard[]>(() => [
    {
      label: 'Role',
      value: this.roleLabel(),
      caption: 'Niveau de responsabilite applique',
    },
    {
      label: 'Droits',
      value: `${this.authorities().length}`,
      caption: 'Permissions applicatives detectees',
    },
    {
      label: 'Agence',
      value: this.agence()?.nomAgence || 'Non rattachee',
      caption: 'Structure principale de rattachement',
    },
    {
      label: 'Etablissement',
      value: this.etablissement()?.nomEtabless || 'Non defini',
      caption: 'Point d operation par defaut',
    },
  ]);

  readonly identityFields = computed<ProfileField[]>(() => {
    const currentUser = this.user();

    return [
      this.buildField('fas fa-id-badge', "Nom d'utilisateur", currentUser?.username),
      this.buildField('fas fa-envelope', 'Adresse email', currentUser?.email),
      this.buildField('fas fa-phone-alt', 'Telephone', currentUser?.mobile),
      this.buildField(
        'fas fa-user-shield',
        'Etat du compte',
        currentUser?.nonLocked ? 'Compte non verrouille' : 'Compte verrouille'
      ),
      this.buildField(
        'fas fa-clock',
        'Derniere connexion',
        currentUser?.lastLoginDateDisplay || currentUser?.lastLoginDate
      ),
      this.buildField('fas fa-calendar-alt', "Date d'inscription", currentUser?.joinDate),
    ];
  });

  readonly agencyFields = computed<ProfileField[]>(() => {
    const agency = this.agence();

    return [
      this.buildField('fas fa-building', "Nom de l'agence", agency?.nomAgence),
      this.buildField('fas fa-landmark', 'Sigle', agency?.sigleAgence),
      this.buildField('fas fa-envelope', 'Email', agency?.emailAgence),
      this.buildField('fas fa-phone-alt', 'Telephone', agency?.telAgence),
      this.buildField('fas fa-file-invoice', 'Compte contribuable', agency?.compteContribuable),
      this.buildField('fas fa-wallet', 'Capital', agency?.capital),
    ];
  });

  readonly establishmentFields = computed<ProfileField[]>(() => {
    const establishment = this.etablissement();

    return [
      this.buildField('fas fa-store', "Nom de l'etablissement", establishment?.nomEtabless),
      this.buildField(
        'fas fa-check-circle',
        'Etablissement par defaut',
        establishment?.defaultChapite ? 'Oui' : 'Non'
      ),
    ];
  });

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private loadAgence() {
    const currentUser = this.user();

    if (!currentUser?.idAgence) {
      return of(null);
    }

    return this.apiService.getAgenceByIDAgence(currentUser.idAgence).pipe(
      catchError(() => {
        this.agenceError.set("Impossible de charger les informations de l'agence.");
        return of(null);
      })
    );
  }

  private loadEtablissement() {
    const currentUser = this.user();

    if (!currentUser?.id) {
      return of(null);
    }

    return this.apiService.getDefaultEtable(currentUser.id).pipe(
      catchError(() => {
        this.etablissementError.set("Impossible de charger l'etablissement par defaut.");
        return of(null);
      })
    );
  }

  private readUserFromCache(): UtilisateurRequestDto | null {
    try {
      return this.userService.getUserFromLocalCache() ?? null;
    } catch {
      return null;
    }
  }

  private buildField(icon: string, label: string, value: string | number | null | undefined): ProfileField {
    if (typeof value === 'number') {
      return { icon, label, value: `${value}` };
    }

    const normalizedValue = value?.toString().trim();
    return { icon, label, value: normalizedValue || 'Non renseigne' };
  }
}
