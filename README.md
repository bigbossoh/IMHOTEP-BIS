# Imhotep / Gestimo

Documentation de référence du dépôt, reconstituée à partir du code présent le 11 mars 2026.

## Vue d'ensemble

Gestimo est une application de gestion immobilière enrichie d'un second périmètre "résidence / hôtellerie". Le produit couvre :

- la gestion des agences immobilières ;
- la gestion des utilisateurs par rôle (`SUPERVISEUR`, `GERANT`, `PROPRIETAIRE`, `LOCATAIRE`, `CLIENT HOTEL`) ;
- le référentiel géographique (`Pays`, `Ville`, `Commune`, `Quartier`, `Site`) ;
- le patrimoine immobilier (`Immeuble`, `Etage`, `Appartement`, `Villa`, `Magasin`) ;
- les contrats de bail, appels de loyer, encaissements, dépenses et clôtures de caisse ;
- les impressions PDF (quittances, reçus) et l'envoi de mails ;
- la gestion d'une résidence avec catégories de chambres, prix, réservations, prestations additionnelles et encaissements.

Le dépôt est organisé en deux modules :

| Module | Rôle | Stack | Point d'entrée |
| --- | --- | --- | --- |
| `GestimoSpringBackend` | API métier, sécurité, persistance, reporting PDF, tâches planifiées | Spring Boot 3.5, Java 17, Spring Security, JPA, MySQL, SpringDoc, JasperReports | `src/main/java/com/bzdata/gestimospringbackend/GestimoSpringBackendApplication.java` |
| `gestimowebfront-end` | interface d'administration | Angular 21, Angular Material, NGRX, client Swagger généré | `src/app/app.module.ts` |

## Comment le projet fonctionne

### 1. Authentification

Le backend expose l'API sous le préfixe `gestimoweb/api/v1`.

- le login passe par `POST /gestimoweb/api/v1/auth/login` ;
- le backend renvoie l'utilisateur connecté dans le corps de réponse et le JWT dans l'en-tête `Jwt-Token` ;
- le frontend stocke le token dans `localStorage` puis l'envoie ensuite dans l'en-tête `Authorization: Bearer ...` via `AuthInterceptor`.

### 2. Référentiel et organisation

Au démarrage, le backend initialise automatiquement plusieurs données :

- un pays par défaut (`CI`) ;
- des villes, communes, quartiers et sites ;
- une agence par défaut `AGENCE MAGISER` ;
- des chapitres et établissements par défaut ;
- un utilisateur superviseur par défaut si absent.

Cette initialisation rend l'application exploitable rapidement, mais elle crée aussi un couplage fort avec des données de démonstration.

### 3. Patrimoine immobilier

Le patrimoine est modélisé autour de l'entité abstraite `Bienimmobilier`, spécialisée en :

- `Immeuble`
- `Appartement`
- `Villa`
- `Magasin`
- `Studio`

Chaque bien peut être rattaché à :

- un propriétaire (`Utilisateur`) ;
- un site géographique (`Site`) ;
- un chapitre / département (`Chapitre`) ;
- des images (`ImageData`).

### 4. Cycle locatif

Le cycle principal du produit côté immobilier est le suivant :

1. création du référentiel (site, bien, propriétaire, locataire) ;
2. création d'un bail (`BailLocation`) ;
3. génération des appels de loyer (`AppelLoyer`) sur la durée du bail ;
4. encaissement des paiements (`EncaissementPrincipal`) ;
5. impression de quittances et reçus ;
6. suivi des impayés, des statistiques et de la clôture de caisse ;
7. clôture ou suppression du bail.

### 5. Cycle résidence / hôtellerie

Le module résidence réutilise une partie du socle métier :

1. définition des catégories de chambres ;
2. définition du prix par catégorie ;
3. création d'une réservation (`Reservation`) ;
4. ajout de prestations additionnelles ;
5. encaissement de la réservation ;
6. impression des reçus.

## Fonctionnalités déjà présentes

### Fonctionnalités métier

- gestion des agences ;
- gestion des utilisateurs, des rôles, des droits et des affectations à des établissements ;
- gestion du patrimoine immobilier et de son rattachement à des chapitres ;
- gestion des baux par type de bien ;
- génération d'appels de loyer mensuels ;
- réduction de loyers par période ;
- encaissement unitaire et en masse ;
- suivi des impayés, encaissements journaliers, mensuels et annuels ;
- suivi des dépenses et clôture de caisse ;
- génération de quittances et reçus PDF ;
- envoi de quittances par mail ;
- gestion d'une résidence avec réservation, disponibilité et paiement ;
- pages de statistiques et tableaux de bord ;
- listage public des agences et utilisateurs via un contrôleur dédié.

### Fonctionnalités frontend visibles

Les routes Angular montrent les écrans déjà exposés :

- `/dashboard`, `/statistiques`, `/profil`
- `/sites`, `/agences`
- `/locataires`, `/proprietaires`, `/gerants`, `/Superviseurs`
- `/bien-immobilier`, `/bien-par-site`, `/liste-immeubles`, `/liste-etages`
- `/baux`, `/bail-loyers`, `/appelloyers`, `/relance`
- `/paiement`, `/reglement-individuel`, `/reglement-groupe`
- `/journal-caisse`, `/compte-client`, `/compte-agence`, `/grand-compte`, `/cloture-caisse`
- `/categorie-appartement`, `/new-categorie-appartement`, `/new-prix-categorie-chambre`
- `/reservation-residence`, `/paiement-residence`, `/paiement-residence-individuel`, `/disponibilite-residence`, `/client-residence`, `/dashboard-residence`
- `/chat-ia`

## Démarrage local

### Pré-requis

- Java 17
- Maven Wrapper
- Node.js compatible Angular 21
- MySQL 8

### Base de données

Le fichier `GestimoSpringBackend/docker-compose.yml` démarre un MySQL sur le port `3305`.

```bash
cd GestimoSpringBackend
docker compose up -d
```

### Backend

Configuration par défaut :

- port HTTP : `8287`
- base MySQL : `jdbc:mysql://localhost:3305/dbgestimoweb`
- Swagger UI : `http://localhost:8287/swagger-ui/index.html`

Variables importantes :

- `MYSQL_URL`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `JWT_SECRET`
- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `PASSWORD_RESET_URL`
- `DEFAULT_USER_EMAIL`

Lancement Windows :

```powershell
cd GestimoSpringBackend
.\mvnw.cmd spring-boot:run
```

### Frontend

Le client Swagger Angular pointe par défaut vers `http://localhost:8287/`.

```powershell
cd gestimowebfront-end
npm install
npm start
```

Application accessible sur `http://localhost:4200`.

## Documentation détaillée

- documentation backend complète : `docs/backend-reference.md`
- README backend mis à jour : `GestimoSpringBackend/README.md`

## Points d'attention immédiats

Cette partie est volontairement orientée "nettoyage" pour vous aider à supprimer les mauvaises fonctionnalités ou les zones risquées.

1. Des secrets sont codés en dur dans le dépôt.
   `application.properties` contient des valeurs sensibles par défaut et le frontend expose une clé OpenAI dans `page-chat-ia.component.ts`.
2. La sécurité HTTP est trop permissive.
   Plusieurs endpoints métier sont déclarés publics dans `PUBLIC_URLS` alors qu'ils manipulent des données métier sensibles.
3. Le backend mélange deux architectures.
   Une partie est organisée en packages historiques (`Controllers`, `Services`, `Models`, `DTOs`) et une autre en modules récents (`user`, `company`, `department`, `establishment`).
4. Le `Dockerfile` backend n'est pas aligné avec le projet.
   Le code cible Java 17, mais l'image Docker utilise `openjdk:8-jdk-alpine`.
5. Certaines fonctionnalités sont incomplètes ou techniques.
   Exemples : services vides, méthodes `deleteLocatire` / `deleteProprietaire` non implémentées, mappers squelettiques, `Scheduler` quasi vide.
6. Plusieurs services chargent toute la base puis filtrent en mémoire.
   Cela peut devenir un vrai problème de performance et de lisibilité.
7. Le module `chat-ia` contourne l'architecture backend.
   L'appel OpenAI est fait directement depuis Angular, ce qui n'est pas acceptable en production.

## Ce que je recommande pour la suite

Si votre objectif est de supprimer de mauvaises fonctionnalités puis enrichir le produit, l'ordre de travail le plus rentable est :

1. sécuriser les secrets, les endpoints publics et les appels externes ;
2. décider si le module résidence doit rester dans le même produit que le module immobilier ;
3. figer un découpage métier cible par domaine ;
4. simplifier les APIs redondantes ;
5. seulement ensuite enrichir les fonctionnalités prioritaires.
