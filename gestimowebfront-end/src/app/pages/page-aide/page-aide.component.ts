import { Component } from '@angular/core';

interface Section {
  id: string;
  titre: string;
  icon: string;
  description: string;
  fonctionnalites: Fonctionnalite[];
}

interface Fonctionnalite {
  titre: string;
  description: string;
  etapes?: string[];
}

@Component({
  standalone: false,
  selector: 'app-page-aide',
  templateUrl: './page-aide.component.html',
  styleUrls: ['./page-aide.component.css'],
})
export class PageAideComponent {
  searchTerm = '';
  activeSection: string | null = null;

  sections: Section[] = [
    {
      id: 'tableau-de-bord',
      titre: 'Tableau de bord',
      icon: 'fas fa-chart-pie',
      description: "Vue d'ensemble de toute l'activité de l'agence en temps réel.",
      fonctionnalites: [
        {
          titre: "Vue d'ensemble",
          description:
            "Affiche les indicateurs clés de performance (KPI) : nombre de biens, taux d'occupation, loyers encaissés du mois, baux actifs et alertes de retard de paiement.",
        },
        {
          titre: 'Statistiques graphiques',
          description:
            "Visualisez l'évolution des encaissements, la répartition des types de biens et la comparaison mensuelle des recettes sous forme de graphiques interactifs.",
        },
        {
          titre: 'Supervision système',
          description:
            "Consultez l'état de santé du serveur, la mémoire utilisée, les threads actifs et les métriques JVM depuis le menu Paramétrage > Supervision système.",
        },
      ],
    },
    {
      id: 'biens-immobiliers',
      titre: 'Gestion des biens immobiliers',
      icon: 'fas fa-city',
      description: 'Gérez l\'ensemble du patrimoine immobilier de l\'agence : sites, immeubles, appartements, magasins et villas.',
      fonctionnalites: [
        {
          titre: 'Gestion des sites',
          description:
            'Créez et gérez les emplacements géographiques (sites) où se trouvent vos biens. Chaque site regroupe un ou plusieurs immeubles.',
          etapes: [
            'Accédez à Biens immobiliers > Gestion des sites',
            'Cliquez sur "Nouveau site" pour créer un emplacement',
            'Renseignez le nom, la ville, la commune et le quartier',
            'Enregistrez et le site apparaît dans la liste',
          ],
        },
        {
          titre: 'Gestion des immeubles',
          description:
            "Associez des immeubles à des sites. Un immeuble peut contenir plusieurs étages, eux-mêmes contenant des appartements.",
          etapes: [
            'Accédez à Biens immobiliers > Gestion des immeubles',
            'Créez un immeuble en lui associant un site existant',
            'Ajoutez les étages depuis la fiche de l\'immeuble',
          ],
        },
        {
          titre: "Catégories d'appartement",
          description:
            "Définissez des catégories de biens (Studio, F2, F3, etc.) avec leurs caractéristiques tarifaires pour les résidences hôtelières.",
          etapes: [
            "Accédez à Biens immobiliers > Catégories d'appartement",
            'Créez les catégories (ex : Chambre Standard, Suite)',
            'Associez des grilles tarifaires à chaque catégorie',
          ],
        },
        {
          titre: 'Biens immobiliers',
          description:
            "Liste complète de tous les biens de l'agence. Filtrez par type (appartement, magasin, villa), statut (libre, loué) ou site géographique.",
          etapes: [
            'Accédez à Biens immobiliers > Biens immobiliers',
            'Utilisez les filtres pour affiner la recherche',
            'Cliquez sur un bien pour consulter sa fiche détaillée',
            'La fiche affiche l\'historique des baux et l\'état actuel',
          ],
        },
        {
          titre: 'Rapport des biens disponibles',
          description:
            'Générez instantanément la liste des biens non loués, prêts à être mis en location, avec leurs caractéristiques.',
        },
      ],
    },
    {
      id: 'loyers',
      titre: 'Gestion des loyers',
      icon: 'fas fa-phone-alt',
      description: "Gérez l'intégralité du cycle de vie des loyers : appels, relances et règlements.",
      fonctionnalites: [
        {
          titre: 'Appel de loyer',
          description:
            "Générez les appels de loyer mensuels pour l'ensemble des locataires ou pour un locataire spécifique. L'appel liste les montants dus avec les éventuelles pénalités de retard.",
          etapes: [
            'Accédez à Loyers > Appel de loyer',
            'Sélectionnez la période (mois / année)',
            'Cliquez sur "Générer les appels" pour créer les appels de la période',
            'Consultez ou imprimez les appels générés',
          ],
        },
        {
          titre: 'Gestion des relances',
          description:
            "Identifiez les locataires en retard de paiement et envoyez des relances. Le système affiche automatiquement les impayés classés par ancienneté.",
          etapes: [
            'Accédez à Loyers > Gestion des relances',
            'La liste des locataires en retard apparaît automatiquement',
            'Sélectionnez un locataire et cliquez sur "Relancer"',
            'Un email de relance est envoyé et l\'action est tracée dans l\'audit',
          ],
        },
        {
          titre: 'Règlement individuel',
          description:
            "Enregistrez le paiement d'un loyer pour un locataire précis. Choisissez le mode de règlement (espèces, virement, chèque) et le montant exact.",
          etapes: [
            'Accédez à Loyers > Règlement individuel',
            'Recherchez le locataire par nom ou numéro de bail',
            'Sélectionnez l\'appel de loyer à régler',
            'Saisissez le montant et le mode de paiement, puis validez',
          ],
        },
        {
          titre: 'Règlement groupé',
          description:
            "Enregistrez plusieurs paiements en une seule opération. Idéal pour traiter les virements groupés reçus en fin de mois.",
          etapes: [
            'Accédez à Loyers > Règlement groupé',
            'Sélectionnez la période et les locataires concernés',
            'Cochez les appels de loyer à solder',
            'Validez le règlement groupé',
          ],
        },
      ],
    },
    {
      id: 'baux',
      titre: 'Gestion des baux',
      icon: 'fas fa-file-contract',
      description: "Créez et gérez les contrats de bail pour chaque locataire.",
      fonctionnalites: [
        {
          titre: 'Contrats de bail',
          description:
            "Créez des contrats de bail associant un locataire à un bien immobilier avec une date de début, une durée, un loyer mensuel et un dépôt de garantie.",
          etapes: [
            'Accédez à Baux > Contrat de bail',
            'Cliquez sur "Nouveau bail"',
            'Sélectionnez le locataire, le bien, la date de début et le loyer',
            'Ajoutez le montant du dépôt de garantie si applicable',
            'Validez pour activer le bail ; les appels de loyer seront générés automatiquement',
          ],
        },
        {
          titre: 'Bail-Loyers',
          description:
            "Consultez la synthèse des loyers attachés à chaque bail : montants attendus, réglés et restant dus.",
        },
      ],
    },
    {
      id: 'residences',
      titre: 'Gestion des résidences',
      icon: 'fas fa-home',
      description: "Module dédié à la gestion hôtelière des résidences meublées : réservations, disponibilités et paiements.",
      fonctionnalites: [
        {
          titre: 'Tableau de bord résidences',
          description:
            "Vue synthétique du taux d'occupation des chambres, des réservations en cours et des revenus générés par la résidence.",
        },
        {
          titre: 'Clients résidence',
          description:
            "Gérez le fichier clients de la résidence : créez et modifiez les fiches clients avec coordonnées et historique des séjours.",
          etapes: [
            'Accédez à Résidences > Client résidence',
            'Cliquez sur "Nouveau client" pour créer une fiche',
            'Renseignez les informations personnelles et la pièce d\'identité',
            'Le client est prêt pour une réservation',
          ],
        },
        {
          titre: 'Réservations',
          description:
            "Créez et gérez les réservations de chambres. Vérifiez la disponibilité avant de confirmer un séjour.",
          etapes: [
            'Accédez à Résidences > Réservation',
            'Cliquez sur "Nouvelle réservation" ou "Ajout réservation"',
            'Sélectionnez le client, la chambre, les dates d\'arrivée et de départ',
            'Le système calcule automatiquement le montant selon la grille tarifaire',
            'Confirmez pour bloquer la chambre',
          ],
        },
        {
          titre: 'Disponibilité',
          description:
            "Visualisez en temps réel les chambres disponibles et occupées sur un calendrier. Planifiez les arrivées et départs.",
          etapes: [
            'Accédez à Résidences > Disponibilité',
            'Sélectionnez la période souhaitée',
            'Les chambres disponibles apparaissent en vert, occupées en rouge',
          ],
        },
        {
          titre: 'Paiement résidence',
          description:
            "Enregistrez les paiements liés aux séjours en résidence. Gérez les acomptes, soldes et remboursements.",
          etapes: [
            'Accédez à Résidences > Paiement',
            'Recherchez la réservation concernée',
            'Saisissez le montant encaissé et le mode de paiement',
            'Une quittance est générée automatiquement',
          ],
        },
      ],
    },
    {
      id: 'depenses',
      titre: 'Gestion des dépenses',
      icon: 'fas fa-wallet',
      description: "Enregistrez, catégorisez et suivez toutes les dépenses de l'agence.",
      fonctionnalites: [
        {
          titre: 'Création et consultation des dépenses',
          description:
            "Saisissez les dépenses de fonctionnement (entretien, réparations, charges) et consultez l'historique détaillé avec filtres par période et catégorie.",
          etapes: [
            'Accédez à Dépenses > Consultation des dépenses',
            'Cliquez sur "Nouvelle dépense"',
            'Sélectionnez la catégorie, saisissez le montant et la description',
            'Associez la dépense à un bien ou un site si nécessaire',
            'Validez pour enregistrer',
          ],
        },
        {
          titre: 'Paramétrage des dépenses',
          description:
            "Configurez les types de dépenses récurrentes et les règles de répartition entre les différents biens de l'agence.",
        },
        {
          titre: 'Catégories de dépenses',
          description:
            "Créez et gérez les catégories de dépenses (Entretien, Électricité, Eau, Salaires, etc.) pour une comptabilité analytique précise.",
          etapes: [
            'Accédez à Paramétrage > Catégories de dépenses',
            'Cliquez sur "Nouvelle catégorie"',
            'Donnez un libellé et un code à la catégorie',
            'Enregistrez pour la rendre disponible lors de la saisie des dépenses',
          ],
        },
        {
          titre: 'Clôture de caisse',
          description:
            "Effectuez la clôture journalière de la caisse : vérifiez les encaissements du jour, saisissez le solde physique et générez le rapport de clôture.",
          etapes: [
            'Accédez à Dépenses > Clôture de caisse',
            'Vérifiez le solde théorique calculé par le système',
            'Saisissez le solde physique de la caisse',
            'Validez la clôture — elle devient définitive et tracée dans l\'audit',
          ],
        },
      ],
    },
    {
      id: 'comptabilite',
      titre: 'Gestion comptable',
      icon: 'fas fa-calculator',
      description: "Suivez les flux financiers de l'agence avec les comptes clients, comptes agence et le grand compte.",
      fonctionnalites: [
        {
          titre: 'Compte client',
          description:
            "Consultez le solde et l'historique des transactions de chaque locataire : loyers dus, règlements effectués et solde restant.",
          etapes: [
            'Accédez à Comptabilité > Compte client',
            'Recherchez le locataire par nom',
            'Visualisez le relevé de compte avec toutes les opérations',
            'Exportez le relevé au format Excel si besoin',
          ],
        },
        {
          titre: 'Compte agence',
          description:
            "Vue globale des mouvements financiers de l'agence : encaissements de loyers, commissions et dépenses enregistrées.",
        },
        {
          titre: 'Grand compte',
          description:
            "Tableau de bord comptable consolidé regroupant l'ensemble des opérations de la période. Permet une vision à 360° de la trésorerie.",
        },
        {
          titre: 'Consultation règlement des loyers par période',
          description:
            "Filtrez et analysez les règlements de loyers sur une plage de dates précise. Exportez les données pour votre comptable ou votre logiciel de gestion.",
          etapes: [
            'Accédez à Comptabilité > Consultation règlement des loyers',
            'Sélectionnez la période de début et de fin',
            'Cliquez sur "Rechercher"',
            'Exportez les résultats en Excel',
          ],
        },
      ],
    },
    {
      id: 'utilisateurs',
      titre: 'Gestion des utilisateurs',
      icon: 'fas fa-users-cog',
      description: "Administrez les comptes utilisateurs, leurs rôles et leurs droits d'accès à l'application.",
      fonctionnalites: [
        {
          titre: 'Gestion des utilisateurs',
          description:
            "Créez, modifiez et désactivez les comptes des utilisateurs de l'application : locataires, propriétaires, gérants et superviseurs.",
          etapes: [
            'Accédez à Utilisateurs > Gestion des utilisateurs',
            'Cliquez sur "Nouvel utilisateur"',
            'Renseignez les informations personnelles et le rôle',
            'Un email de bienvenue avec les identifiants est envoyé automatiquement',
          ],
        },
        {
          titre: 'Attribution des droits',
          description:
            "Affectez des rôles et des permissions granulaires à chaque utilisateur. Contrôlez l'accès à chaque module de l'application.",
          etapes: [
            'Accédez à Utilisateurs > Attribution des droits',
            'Sélectionnez l\'utilisateur à configurer',
            'Cochez/décochez les fonctionnalités auxquelles il doit avoir accès',
            'Enregistrez — les changements prennent effet immédiatement',
          ],
        },
        {
          titre: 'Fonctionnalités',
          description:
            "Consultez la liste exhaustive de toutes les fonctionnalités déclarées dans le système et gérez leur activation par profil d'utilisateur.",
        },
      ],
    },
    {
      id: 'parametrage',
      titre: 'Paramétrage & Administration',
      icon: 'fas fa-cogs',
      description: "Configuration générale de l'application, outils d'administration et fonctionnalités avancées.",
      fonctionnalites: [
        {
          titre: "Gestion de l'agence",
          description:
            "Modifiez les informations de votre agence : nom, logo, coordonnées, régime fiscal et numéro de compte contribuable.",
          etapes: [
            'Accédez à Paramétrage > Gestion de l\'agence',
            'Modifiez les champs souhaités',
            'Enregistrez les modifications',
          ],
        },
        {
          titre: 'Tâches planifiées',
          description:
            "Visualisez et gérez les tâches automatiques exécutées par le serveur (ex : génération automatique des appels de loyers, envoi de relances).",
        },
        {
          titre: 'Chat avec l\'IA',
          description:
            "Posez des questions à l'assistant IA intégré pour obtenir de l'aide sur l'utilisation de l'application, des analyses de données ou des conseils de gestion.",
          etapes: [
            'Accédez à Paramétrage > Chat avec IA',
            'Tapez votre question dans le champ de saisie',
            'Appuyez sur Entrée ou cliquez sur "Envoyer"',
            "L'IA répond instantanément avec des conseils personnalisés",
          ],
        },
        {
          titre: 'Supervision système',
          description:
            "Tableau de bord technique affichant les métriques du serveur : CPU, mémoire, threads actifs, statut de la base de données et logs d'erreurs récents.",
        },
        {
          titre: "Journal d'audit",
          description:
            "Historique complet de toutes les actions effectuées dans l'application : créations, modifications, suppressions. Chaque action est horodatée et associée à l'utilisateur qui l'a réalisée.",
          etapes: [
            "Accédez à Paramétrage > Journal d'audit",
            'Filtrez par date, utilisateur, module ou type d\'action',
            'Exportez l\'historique en Excel pour un archivage externe',
            'Effacez l\'historique si nécessaire (action irréversible)',
          ],
        },
        {
          titre: 'Mon profil',
          description:
            "Modifiez vos informations personnelles, changez votre mot de passe et personnalisez vos préférences d'affichage.",
          etapes: [
            'Cliquez sur votre avatar en haut à droite',
            'Sélectionnez "Mon profil"',
            'Modifiez vos informations et enregistrez',
          ],
        },
        {
          titre: 'Réinitialisation du mot de passe',
          description:
            "En cas d'oubli de mot de passe, utilisez la page de connexion pour demander un lien de réinitialisation par email.",
          etapes: [
            'Depuis la page de connexion, cliquez sur "Mot de passe oublié"',
            'Saisissez votre adresse email',
            'Consultez votre boîte mail et cliquez sur le lien reçu',
            'Définissez votre nouveau mot de passe',
          ],
        },
      ],
    },
  ];

  get filteredSections(): Section[] {
    if (!this.searchTerm.trim()) {
      return this.sections;
    }
    const term = this.searchTerm.toLowerCase();
    return this.sections
      .map((section) => {
        const matchSection =
          section.titre.toLowerCase().includes(term) ||
          section.description.toLowerCase().includes(term);

        const matchedFonctionnalites = section.fonctionnalites.filter(
          (f) =>
            f.titre.toLowerCase().includes(term) ||
            f.description.toLowerCase().includes(term)
        );

        if (matchSection) {
          return section;
        }
        if (matchedFonctionnalites.length) {
          return { ...section, fonctionnalites: matchedFonctionnalites };
        }
        return null;
      })
      .filter((s): s is Section => s !== null);
  }

  toggleSection(id: string): void {
    this.activeSection = this.activeSection === id ? null : id;
  }

  isActive(id: string): boolean {
    return this.activeSection === id;
  }

  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.activeSection = id;
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
  }

  printManual(): void {
    window.print();
  }
}
