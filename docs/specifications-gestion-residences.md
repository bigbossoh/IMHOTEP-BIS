# Spécifications Fonctionnelles — Module Gestion des Résidences Meublées
**Projet :** IMHOTEP-BIS — Plateforme de Gestion Immobilière  
**Version :** 1.0  
**Date :** 19 avril 2026  
**Statut :** En production (branche `feat-residence`)

---

## 1. Périmètre fonctionnel

Le module **Gestion des Résidences Meublées** couvre l'ensemble du cycle de vie d'une résidence hôtelière ou d'appartements meublés à la nuitée : de la création des équipements jusqu'à la clôture financière des séjours. Il s'intègre à la plateforme IMHOTEP-BIS et partage le référentiel commun des agences, utilisateurs et biens immobiliers.

---

## 2. Acteurs

| Acteur | Rôle |
|---|---|
| **Gestionnaire** | Crée et administre les résidences, les chambres et les tarifs |
| **Réceptionniste** | Saisit les réservations, accueille les clients, encaisse les paiements |
| **Superviseur** | Consulte les tableaux de bord, les rapports et les états financiers |
| **Client** | Entité bénéficiaire d'une réservation (locataire de courte durée) |

---

## 3. Sous-modules

### 3.1 Tableau de bord (Dashboard Résidence)

**Objectif :** Offrir une vue synthétique et en temps réel de l'état de la résidence.

#### Indicateurs clés (KPI)
| Indicateur | Calcul |
|---|---|
| Taux d'occupation | Séjours en cours / Total chambres × 100 |
| Séjours en cours | Nombre de réservations ouvertes à ce jour |
| Montant encaissé | Somme des paiements reçus sur le mois en cours |
| Soldes restants | Somme des soldes non réglés sur les séjours ouverts |

#### Alertes opérationnelles du jour
- **Départs du jour** : liste des clients dont la date de fin de séjour est aujourd'hui
- **Arrivées du jour** : liste des nouvelles entrées prévues
- **Départs dans 3 jours** : anticipation des libérations à venir

#### Tableau des séjours en cours
Chaque ligne affiche : client, chambre, catégorie, date d'arrivée, date de départ, barre de progression du séjour (avec code couleur vert/orange/rouge selon l'imminence du départ), montant total, solde restant. Les lignes à départ imminent sont surlignées.

#### Panneau de disponibilité (anneau SVG)
Représentation graphique circulaire de la répartition chambres occupées / libres / total, avec légende chiffrée.

#### Répartition par catégorie
Barres de progression par catégorie de chambre indiquant le nombre de séjours actifs par type.

#### Résumé financier du mois
Nombre de réservations, montant encaissé, soldes ouverts.

#### Filtre par période
L'ensemble des indicateurs peut être recalculé sur une plage de dates personnalisée (Du … Au …). En mode période active :
- Les séjours affichés sont ceux dont la date chevauche la plage sélectionnée
- Les libellés KPI s'adaptent ("Encaissé sur période", "Finances — période")
- Un badge orange signale la période active avec le nombre de séjours trouvés

---

### 3.2 Réservations

**Objectif :** Gérer le cycle complet d'une réservation, de la pré-réservation à la clôture.

#### États d'une réservation
| État | Condition |
|---|---|
| **Pré-réservation** | Client non renseigné (champ `utilisateurOperation` vide ou `XXX XXXXX`) |
| **À confirmer** | Client identifié, aucun paiement enregistré |
| **Acompte versé** | Paiement partiel enregistré, solde > 0 |
| **Soldée** | Montant total intégralement encaissé, solde = 0 |

#### Fonctionnalités
- **Création** d'une réservation via formulaire modal plein écran (sélection chambre, dates, voyageurs, tarif)
- **Modification** des informations d'une réservation existante
- **Finalisation** (entrée en chambre) d'une pré-réservation
- **Encaissement** partiel ou total via module de règlement individuel
- **Impression du reçu de paiement** (PDF)
- **Impression de la facture** (PDF)
- **Suppression** (uniquement si aucun paiement enregistré)
- **Sélection / détail** : clic sur une ligne affiche le panneau latéral avec toutes les informations du séjour, les actions disponibles et les prestations additionnelles associées

#### Filtres et recherche
- **Recherche texte** : client, chambre, code réservation, dates, statut
- **Filtre statut** (segmented control) : Toutes / À finaliser / Acompte / Soldées — avec compteur par statut
- **Filtre par période** : Du … Au … avec détection de chevauchement (une réservation est retournée si elle est active à n'importe quel moment de la plage)
- Badge visuel indiquant la période active et le nombre de résultats

#### Pagination
- Sélection du nombre de lignes par page (10 / 25 / 50)
- Navigation par pages numérotées avec Précédent / Suivant

#### Indicateurs de synthèse (bandeau haut)
- Total des réservations suivies
- Montant total encaissé
- Solde global à encaisser
- Durée de séjour moyenne (en nuits)

---

### 3.3 Disponibilités des Chambres

**Objectif :** Connaître en temps réel l'état de disponibilité de chaque chambre et vérifier la faisabilité d'une réservation sur une période donnée.

#### Statistiques globales
- Nombre de chambres actives
- Nombre de chambres occupées
- Nombre de chambres libres (par différence)

#### Vérificateur de disponibilité sur période
L'utilisateur saisit une date de début et une date de fin. Le système recalcule instantanément, pour chaque chambre, si elle est disponible ou occupée sur cette plage (détection de chevauchement : `dateDebut_reservation < dateFin_filtre AND dateFin_reservation > dateDebut_filtre`). Un résumé indique le nombre de chambres disponibles sur la période.

#### Tableau des chambres
Colonnes : Chambre, Catégorie, Prix / nuit, Occupant actuel, Libre le, Statut (disponible / occupée).  
Filtres : recherche texte, filtre par catégorie, filtre statut (Toutes / Disponibles / Occupées).  
Clic sur une ligne ouvre le panneau de détail.

#### Panneau de détail chambre
- Informations de la chambre (désignation, catégorie, prix)
- Réservation en cours : client, dates, durée, montant, solde
- Historique des réservations passées

---

### 3.4 Clients de la Résidence

**Objectif :** Gérer le fichier client propre à la résidence et consulter l'historique de chaque client.

#### Liste des clients
Tableau avec : nom, e-mail, téléphone, nombre de réservations, montant total, montant payé, solde, statut (client actif si réservation ouverte).

#### Filtres
- Recherche texte (nom, e-mail, téléphone)
- Filtre statut : Tous / Clients actifs / Clients inactifs

#### Statistiques globales (bandeau haut)
- Total des clients
- Clients avec séjour actif
- Solde global à encaisser

#### Panneau de détail client
- Identité (nom, prénom, e-mail, téléphone)
- KPIs individuels : nombre de réservations, montant total, montant payé, solde
- Historique complet des réservations (tableau avec dates, chambre, montant, statut)

---

### 3.5 Factures et Reçus

**Objectif :** Accéder à la liste de toutes les factures émises et les télécharger ou les certifier.

#### Liste des factures
Colonnes : Code réservation, Client, Chambre, Période de séjour, Montant, Payé, Solde, Statut, Actions.

#### Actions disponibles par ligne
- **Télécharger** : génération et téléchargement du PDF de la facture
- **Certifier** : action de certification officielle de la facture (avec indicateur de traitement en cours)

#### Filtres
- Recherche texte (client, code, chambre)
- Filtre par statut de paiement

#### Pagination
Navigation par pages avec résumé du nombre de factures affichées.

---

### 3.6 Prestations Additionnelles

**Objectif :** Associer des services supplémentaires (petit-déjeuner, transfert, blanchisserie, etc.) à une réservation.

#### Paramétrage des prestations
Définition du référentiel de services : nom de la prestation, montant unitaire.

#### Association à une réservation
Dans le panneau de détail d'une réservation, affichage de toutes les prestations liées avec leur montant. Calcul automatique du total des prestations associées.

---

### 3.7 Règlements / Encaissements

**Objectif :** Enregistrer les paiements reçus sur les réservations.

#### Règlement individuel
Modal dédié à l'encaissement d'une réservation spécifique : saisie du montant perçu, du mode de paiement, et mise à jour automatique du solde.

#### Règlement groupé
Possibilité d'encaisser plusieurs réservations en une seule opération.

#### Traçabilité
Chaque encaissement est horodaté et associé à l'agence et à l'opérateur connecté.

---

### 3.8 Paramétrage de la Résidence

**Objectif :** Configurer les éléments structurels de la résidence.

#### Création / gestion de résidence
Définition du bien immobilier de type résidence meublée (nom, adresse, description).

#### Catégories de chambres
Création et gestion des types de chambres (Standard, Supérieure, Suite, etc.) avec tarif de référence par nuitée.

#### Chambres / Appartements meublés
Rattachement de chaque unité à une résidence et à une catégorie.

---

## 4. Règles de gestion transversales

| Règle | Détail |
|---|---|
| **RG-01** | Une chambre ne peut avoir qu'une seule réservation ouverte simultanément |
| **RG-02** | Une réservation sans client identifié est en état "Pré-réservation" et doit être finalisée avant l'entrée en chambre |
| **RG-03** | La suppression d'une réservation est impossible si un paiement a été enregistré |
| **RG-04** | Le taux d'occupation est calculé en temps réel sur la base des réservations ouvertes |
| **RG-05** | Tous les montants sont exprimés en FCFA |
| **RG-06** | Les données sont filtrées par agence : chaque agence ne voit que ses propres résidences et réservations |
| **RG-07** | Le filtre de période utilise la détection de chevauchement : une réservation est incluse dès qu'elle est active sur au moins un jour de la plage |

---

## 5. Architecture technique

| Couche | Technologie |
|---|---|
| Frontend | Angular 17 (standalone: false), Bootstrap 5, NgRx Store |
| Backend | Spring Boot (Java), API REST |
| Communication | HttpClient Angular, ApiService généré (OpenAPI) |
| État applicatif | NgRx (actions, reducers, effects) pour les réservations |
| Impression | Génération PDF côté serveur, téléchargement via `file-saver` |
| Authentification | JWT via intercepteur HTTP, contexte agence via `UserService` |

---

## 6. Interfaces principales (routes)

| Route | Composant | Description |
|---|---|---|
| `/residence/dashboard` | `PageDashboardResidenceComponent` | Tableau de bord |
| `/residence/reservations` | `PageReservationResidenceComponent` | Liste des réservations |
| `/residence/disponibilites` | `PageDisponibiliteResidenceComponent` | Disponibilité des chambres |
| `/residence/clients` | `PageClientResidenceComponent` | Fichier client |
| `/residence/factures` | `PageFacturesReservationComponent` | Factures et reçus |
| `/residence/prestations` | `PagePrestationsComponent` | Prestations additionnelles |
| `/residence/reglements` | `PageReglementComponent` | Encaissements groupés |
| `/residence/parametres` | `PageParametreResidenceComponent` | Paramétrage |

---

*Document généré à partir de l'analyse fonctionnelle du module résidence — IMHOTEP-BIS v1.0*
