import { Component } from '@angular/core';
import { Router } from '@angular/router';

type FonctionnaliteCard = {
  titre: string;
  description: string;
  icon: string;
  route: string;
  badge: string;
};

@Component({
  standalone: false,
  selector: 'app-page-fonctionnalites-utilisateurs',
  templateUrl: './page-fonctionnalites-utilisateurs.component.html',
  styleUrls: ['./page-fonctionnalites-utilisateurs.component.css'],
})
export class PageFonctionnalitesUtilisateursComponent {
  public readonly cards: FonctionnaliteCard[] = [
    {
      titre: 'Gestion des utilisateurs',
      description:
        "Créer, modifier, désactiver, supprimer et importer les comptes utilisateurs de l'agence.",
      icon: 'fas fa-users',
      route: 'liste-utilisateurs',
      badge: 'Comptes',
    },
    {
      titre: 'Attribution des droits',
      description:
        "Consulter l'organisation des rôles et gérer l'affectation des droits applicatifs.",
      icon: 'fas fa-user-shield',
      route: 'liste-gestion-roles-droits',
      badge: 'Sécurité',
    },
    {
      titre: 'Fonctionnalités applicatives',
      description:
        "Centraliser les usages attendus autour des comptes, des profils et de l'administration utilisateur.",
      icon: 'fas fa-th-large',
      route: 'fonctionnalites-utilisateurs',
      badge: 'Référence',
    },
  ];

  public readonly points: string[] = [
    "Gestion centralisée des comptes de l'agence",
    'Attribution des profils et rôles métier',
    'Pilotage des accès selon les responsabilités',
    'Vision claire des fonctions clés disponibles pour les utilisateurs',
  ];

  constructor(private readonly router: Router) {}

  public navigate(route: string): void {
    if (!route) {
      return;
    }

    this.router.navigate([`/${route}`]);
  }
}
