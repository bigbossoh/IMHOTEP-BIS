import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AgenceService } from 'src/app/services/Agence/agence.service';
import { UserService } from 'src/app/services/user/user.service';
import {
  AgenceImmobilierDTO,
  AgenceResponseDto,
  UtilisateurRequestDto,
} from 'src/gs-api/src/models';
import { Menu } from './menu';

@Component({
  standalone: false,
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  public user?: UtilisateurRequestDto;
  public agenceDto?: AgenceResponseDto;
  public expandedMenuId = '1';

  constructor(
    private router: Router,
    private agenceService: AgenceService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.getUserConnected(this.user?.idAgence);
    this.syncActiveMenuWithCurrentRoute();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.syncActiveMenuWithCurrentRoute());
  }

  public menuProperties: Array<Menu> = [
    {
      id: '1',
      titre: 'Tableau de bord',
      icon: 'fas fa-chart-line',
      url: 'dashboard',
      sousMenu: [
        {
          id: '11',
          titre: "Vue d'ensemble",
          icon: 'fas fa-chart-pie',
          url: 'dashboard',
        },
      ],
    },
    {
      id: '2',
      titre: 'Gestion des biens immobiliers',
      icon: 'fas fa-city',
      url: '',
      sousMenu: [
        {
          id: '21',
          titre: 'Gestion des sites',
          icon: 'fa fa-location-arrow',
          url: 'sites',
        },
        {
          id: '22',
          titre: 'Gestion des immeubles',
          icon: 'fas fa-hotel',
          url: 'liste-immeubles',
        },
        {
          id: '23',
          titre: "Catégories d'appartement",
          icon: 'fas fa-layer-group',
          url: 'categorie-appartement',
        },
        {
          id: '24',
          titre: 'Biens immobiliers',
          icon: 'fas fa-building',
          url: 'bien-immobilier',
        },
        {
          id: '25',
          titre: 'Rapport des biens disponibles',
          icon: 'fas fa-door-open',
          url: 'rapport-biens-disponibles',
        },
      ],
    },
    {
      id: '3',
      titre: 'Gestion des Loyers',
      icon: 'fas fa-phone-alt',
      url: '',
      sousMenu: [
        {
          id: '31',
          titre: 'Appel de loyer',
          icon: 'fas fa-virus-slash',
          url: 'appelloyers',
        },
        {
          id: '32',
          titre: 'Gestion des relances',
          icon: 'fas fa-bell',
          url: 'relance',
        },
        {
          id: '33',
          titre: 'Règlement individuel',
          icon: 'fas fa-tools',
          url: 'reglement-individuel',
        },
        {
          id: '34',
          titre: 'Règlement groupé',
          icon: 'fas fa-toolbox',
          url: 'reglement-groupe',
        },
      ],
    },
    {
      id: '6',
      titre: 'Gestion des baux',
      icon: 'fas fa-file-contract',
      url: '',
      sousMenu: [
        {
          id: '61',
          titre: 'contrat de bail',
          icon: 'fas fa-file-signature',
          url: 'baux',
        },
      ],
    },
    {
      id: '7',
      titre: 'gestion des residences',
      icon: 'fas fa-home',
      url: '',
      sousMenu: [
        {
          id: '70',
          titre: 'Tableau de bord',
          icon: 'fas fa-pie-chart',
          url: 'dashboard-residence',
        },
        {
          id: '71',
          titre: 'client residence',
          icon: 'fas fa-address-card',
          url: 'client-residence',
        },
        {
          id: '72',
          titre: 'Reservation',
          icon: 'fas fa-bed',
          url: 'reservation-residence',
        },
        // {
        //   id: '77',
        //   titre: 'Catégories de chambre',
        //   icon: 'fas fa-layer-group',
        //   url: 'categorie-appartement',
        // },
        {
          id: '78',
          titre: 'Prestations & services',
          icon: 'fas fa-concierge-bell',
          url: 'prestations-residence',
        },
        {
          id: '73',
          titre: 'disponibilité',
          icon: 'far fa-calendar-check',
          url: 'disponibilite-residence',
        },

        {
          id: '74',
          titre: 'paiement',
          icon: 'fas fa-credit-card',
          url: 'paiement-residence',
        },
        {
          id: '75',
          titre: 'Factures',
          icon: 'fas fa-file-invoice',
          url: 'factures-reservation',
        },
      ],
    },
    {
      id: '8',
      titre: 'Gestion des dépenses',
      icon: 'fas fa-wallet',
      url: '',
      sousMenu: [
        {
          id: '81',
          titre: 'Création des dépenses (ancien)',
          icon: 'fas fa-receipt',
          url: 'journal-caisse',
        },
        {
          id: '85',
          titre: 'Consultation des dépenses',
          icon: 'fas fa-file-invoice-dollar',
          url: 'page-consultation-depense',
        },
        {
          id: '82',
          titre: 'Paramétrage des dépenses',
          icon: 'fas fa-sliders-h',
          url: 'parametrage-depenses',
        },
        {
          id: '83',
          titre: 'Cloture de Caisse',
          icon: 'fas fa-cash-register',
          url: 'cloture-caisse',
        },
      ],
    },
    {
      id: '9',
      titre: 'Gestion comptable',
      icon: 'fas fa-phone-alt',
      url: '',
      sousMenu: [
        {
          id: '90',
          titre: 'Compte Client',
          icon: 'fas fa-users-cog',
          url: 'compte-client',
        },

        {
          id: '91',
          titre: 'Compte Agence',
          icon: 'fas fa-users-cog',
          url: 'compte-agence',
        },
        {
          id: '92',
          titre: 'Grand compte',
          icon: 'fas fa-users-cog',
          url: 'grand-compte',
        },
        {
          id: '93',
          titre: 'Consultation reglement des loyers',
          icon: 'fas fa-users-cog',
          url: 'reglement-periode-loyer',
        },
      ],
    },
    {
      id: '10',
      titre: 'Gestion des utilisateurs',
      icon: 'fas fa-users-cog',
      url: '',
      sousMenu: [
        {
          id: '101',
          titre: 'Gestion des utilisateurs',
          icon: 'fas fa-users',
          url: 'liste-utilisateurs',
        },
        {
          id: '102',
          titre: 'Attribution des droits',
          icon: 'fas fa-user-shield',
          url: 'liste-gestion-roles-droits',
        },
        {
          id: '103',
          titre: 'Fonctionnalités',
          icon: 'fas fa-th-large',
          url: 'fonctionnalites-utilisateurs',
        },
      ],
    },
    {
      id: '11',
      titre: 'Paramétratge',
      icon: 'fas fa-cogs',
      url: '',
      sousMenu: [
        {
          id: '116',
          titre: 'Catégories de dépenses',
          icon: 'fas fa-tags',
          url: 'categories-depenses',
        },
        {
          id: '111',
          titre: "Gestion de l'agence",
          icon: 'fas fa-building',
          url: 'agences',
        },
        {
          id: '112',
          titre: 'Gestion tâches planifiées',
          icon: 'fa fa-tasks',
          url: 'liste-taches-planifiees',
        },
        {
          id: '113',
          titre: 'Chat avec IA',
          icon: 'fas fa-robot',
          url: 'chat-ia',
        },
        {
          id: '114',
          titre: 'Supervision systeme',
          icon: 'fas fa-server',
          url: 'statistiques',
        },
        {
          id: '115',
          titre: "Journal d'audit",
          icon: 'fas fa-history',
          url: 'audit',
        },
        {
          id: '117',
          titre: "Aide / Manuel d'utilisation",
          icon: 'fas fa-question-circle',
          url: 'aide',
        },
      ],
    },
  ];

  public toggleGroup(menu: Menu): void {
    if (!menu.sousMenu?.length) {
      return;
    }

    this.expandedMenuId = this.expandedMenuId === menu.id ? '' : menu.id ?? '';
  }

  public navigate(menu: Menu): void {
    if (!menu.url) {
      return;
    }

    this.markActiveMenu(menu.url);
    this.router.navigate([`/${menu.url}`]);
  }

  public isExpanded(menu: Menu): boolean {
    return this.expandedMenuId === menu.id;
  }

  public isRouteActive(menu: Menu): boolean {
    if (!menu.url) {
      return false;
    }

    return this.router.url.includes(`/${menu.url}`);
  }

  public getUserConnected(id: number | undefined): void {
    if (!id) {
      this.loadFirstAvailableAgency();
      return;
    }

    this.agenceService.getAgenceById(id).subscribe({
      next: (result) => {
        this.agenceDto = result;
      },
      error: () => {
        this.loadFirstAvailableAgency();
      },
    });
  }

  private loadFirstAvailableAgency(): void {
    this.agenceService.getAllAgences().subscribe({
      next: (agences) => {
        const firstAgence = agences?.[0];
        if (!firstAgence) {
          return;
        }

        this.agenceDto = {
          id: firstAgence.id,
          idAgence: firstAgence.idAgence,
          nomAgence: firstAgence.nomAgence,
          telAgence: firstAgence.telAgence,
          compteContribuable: firstAgence.compteContribuable,
          capital: firstAgence.capital,
          emailAgence: firstAgence.emailAgence,
          regimeFiscaleAgence: firstAgence.regimeFiscaleAgence,
          faxAgence: firstAgence.faxAgence,
          sigleAgence: firstAgence.sigleAgence,
        };

        this.syncUserAgency(firstAgence);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  private syncUserAgency(agence: AgenceImmobilierDTO): void {
    if (!this.user) {
      return;
    }

    const agenceId = agence.idAgence ?? agence.id;
    if (!agenceId || this.user.idAgence === agenceId) {
      return;
    }

    this.user = {
      ...this.user,
      idAgence: agenceId,
    };
    this.userService.addUserToLocalCache(this.user);
  }

  private syncActiveMenuWithCurrentRoute(): void {
    const currentUrl = this.router.url;

    for (const menu of this.menuProperties) {
      for (const sousMenu of menu.sousMenu ?? []) {
        sousMenu.active = !!sousMenu.url && currentUrl.includes(`/${sousMenu.url}`);
        if (sousMenu.active) {
          this.expandedMenuId = menu.id ?? '';
        }
      }
    }
  }

  private markActiveMenu(url: string): void {
    for (const menu of this.menuProperties) {
      for (const sousMenu of menu.sousMenu ?? []) {
        sousMenu.active = sousMenu.url === url;
      }
    }
  }
}
