# Référence backend Gestimo

Cette documentation décrit le backend tel qu'il est implémenté dans `GestimoSpringBackend` au 11 mars 2026. Quand une règle métier n'est pas explicitement documentée dans le code, la description ci-dessous est une inférence fondée sur les noms de classes, les signatures, les routes HTTP et les implémentations disponibles.

## 1. Architecture backend

### 1.1 Stack technique

- Spring Boot 3.5.6
- Java 17
- Spring Web
- Spring Data JPA / Hibernate
- Spring Security + JWT
- MySQL
- Spring Mail
- SpringDoc OpenAPI
- JasperReports / iText pour les PDF
- Lombok

### 1.2 Point d'entrée

`GestimoSpringBackendApplication` :

- démarre l'application Spring Boot ;
- active l'audit JPA ;
- active les tâches planifiées ;
- active l'asynchrone ;
- configure le `PasswordEncoder` BCrypt ;
- enregistre un `CorsFilter` très permissif ;
- initialise les données par défaut via `CommandLineRunner`.

### 1.3 Préfixe d'API

Le préfixe global est défini par `APP_ROOT = api/v1`.

### 1.4 Organisation du code

Le backend est partagé entre deux styles de conception :

- socle historique :
  `Controllers`, `Services`, `Services/Impl`, `Models`, `DTOs`, `repository`, `validator`, `mappers`
- modules plus récents :
  `user`, `company`, `department`, `establishment`, `common/security`, `common/controller`, `common/dto`

Cette cohabitation est importante pour votre chantier de nettoyage, car elle introduit :

- des doublons de conventions ;
- des objets "legacy" et "nouvelle génération" ;
- des responsabilités parfois mal réparties.

## 2. Sécurité et authentification

### 2.1 Flux de login

1. le frontend poste `username` / `password` vers `POST /api/v1/auth/login` ;
2. `AuthenticationController` utilise `AuthenticationManager` ;
3. `ApplicationUserDetailsService` charge l'utilisateur ;
4. `JWTTokenProvider` génère le JWT ;
5. le backend renvoie le token dans l'en-tête `Jwt-Token` ;
6. le frontend le stocke puis le renvoie dans `Authorization: Bearer ...`.

### 2.2 Classes sécurité importantes

- `SecurityConfiguration` :
  chaîne de filtres, mode stateless, branchement du filtre JWT.
- `JWTTokenProvider` :
  génération et lecture du token, extraction des authorities et de `idAgence`.
- `JwtAuthorizationFilter` :
  lecture du bearer token et alimentation du `SecurityContext`.
- `ApplicationUserDetailsService` :
  adaptation de l'utilisateur Gestimo vers Spring Security.
- `LoginAttemptService` :
  cache d'essais de connexion.
- `UserPrincipal` :
  représentation Spring Security de `Utilisateur`.
- `JwtAccessDeniedHandler` / `JwtAuthenticationEntryPoint` :
  gestion des erreurs 401/403.
- `AuthenticationSuccessListener` / `AuthenticationFailureListener` :
  écoute des événements de sécurité.

### 2.3 Faiblesses de sécurité observées

- `PUBLIC_URLS` rend publics des endpoints métier sensibles :
  `/bail/**`, `/magasin/**`, `/bienImmobilier/**`, `/reservation/**`, `/suiviedepense/**`, `/droitAccess/**`, `/cloturecaisse/**`, `/appartement/**`, `/image/**`, `/print/**`, `/envoimail/**`, etc.
- `PublicListingController` expose sans authentification la liste des agences et des utilisateurs.
- des secrets par défaut sont présents dans `application.properties`.

## 3. Initialisation automatique au démarrage

Le `CommandLineRunner` du point d'entrée crée ou vérifie :

- le pays `CI` ;
- des villes par défaut ;
- des communes et quartiers ;
- des sites géographiques ;
- des rôles (`SUPERVISEUR`, `GERANT`, `PROPRIETAIRE`, `LOCATAIRE`, `CLIENT HOTEL`) ;
- l'agence `AGENCE MAGISER` ;
- des chapitres / établissements par défaut ;
- un utilisateur superviseur par défaut ;
- une mise à jour des baux via `appelLoyerService.miseAjourDesUnlockDesBaux(1L)`.

Conséquence pratique :

- l'application peut se lancer sans jeu de données initial manuel ;
- mais le démarrage est couplé à des données de démonstration et à des identifiants figés.

## 4. Catalogue des contrôleurs

### 4.1 Utilisateurs, sécurité et agence

- `AuthenticationController` (`/auth`) :
  login JWT et validation de compte par token.
- `PasswordResetController` (`/utilisateur/password-reset`) :
  demande de réinitialisation et confirmation du nouveau mot de passe.
- `UtilisateurController` (`/utilisateur`) :
  création / mise à jour, consultation par id, email ou username, listes par rôle, désactivation, changement de mot de passe, affectation à un établissement, liste des utilisateurs par établissement.
- `UtilisateurCreationController` (`/utilisateurs`) :
  point d'entrée additionnel pour créer un utilisateur.
- `AgenceController` (`/agences`) :
  création, consultation, recherche par email, liste des agences, suppression.
- `PublicListingController` (`/public`) :
  liste publique des agences et des utilisateurs.

### 4.2 Référentiel géographique

- `PaysController` (`/pays`) :
  CRUD pays.
- `VilleController` (`/ville`) :
  CRUD villes, liste par pays.
- `CommuneController` (`/commune`) :
  CRUD communes, liste par ville.
- `QuartierController` (`/quartier`) :
  CRUD quartiers, liste par commune.
- `SiteController` (`/sites`) :
  CRUD sites géographiques.

### 4.3 Patrimoine immobilier

- `BienImmobilierController` (`/bienImmobilier`) :
  liste des biens par agence et chapitre, liste des biens occupés, rattachement d'un bien à un chapitre.
- `ImmeubleController` (`/immeuble`) :
  création d'un immeuble avec étages, consultation, liste par site.
- `EtageController` (`/etage`) :
  CRUD des étages, affichage des étages d'un immeuble.
- `AppartementController` (`/appartement`) :
  CRUD appartements, liste libre, liste meublée, liste par étage, liste par catégorie.
- `VillaController` (`/villa`) :
  création et consultation de villas, liste libre.
- `MagasinController` (`/magasin`) :
  création et consultation de magasins, liste libre, liste par site ou étage.
- `ImageDataController` (`/image`) :
  upload et récupération des images liées à un bien.

### 4.4 Baux, appels de loyer et reporting

- `BailAppartementController` (`/bailappartement`) :
  création et consultation des baux d'appartement.
- `BailMagasinController` (`/bailmagasin`) :
  création et consultation des baux de magasin.
- `BailVillaController` (`/bailvilla`) :
  création et consultation des baux de villa.
- `BailController` (`/bail`) :
  clôture d'un bail, statistiques de baux actifs/inactifs, recherche par bien ou locataire, modification, suppression.
- `MontantLoyerBailController` (`/montantloyerbail`) :
  historique des montants d'un bail.
- `AppelLoyersController` (`/appelloyer`) :
  génération des appels, recherche par bail ou période, gestion des impayés, statistiques par mois et année, réduction de loyer, suppression de paiements, messages envoyés.
- `PrintController` (`/print`) :
  génération de quittances et reçus PDF pour loyers et réservations.
- `EmailController` (`/envoimail`) :
  envoi de quittance individuelle ou groupée par mail.

### 4.5 Encaissements, dépenses et clôture

- `EncaissementPrincipalController` (`/encaissement`) :
  encaissement unitaire, en masse, avec retour de liste, calculs par jour / période / mois, liste des impayés, marquage de clôture.
- `SuivieDepenseController` (`/suiviedepense`) :
  saisie des dépenses, annulation d'écritures, total sur période, listing non clôturé.
- `ClotureCaisseController` (`/cloturecaisse`) :
  clôture de caisse, contrôles par caissier et chapitre, historique des clôtures.

### 4.6 Résidence / hôtellerie

- `CategorieChambreController` (`/categoriechambre`) :
  CRUD catégories de chambres.
- `PrixParCategoryController` (`/prixparcategorie`) :
  définition des prix par catégorie.
- `ReservationController` (`/reservation`) :
  création / mise à jour des réservations, consultation, disponibilités, encaissements de réservation.
- `PrestationController` (`/prestation`) :
  CRUD prestations de base.
- `PrestationAdditionnelReservationController` (`/serviceadditionnel`) :
  CRUD prestations additionnelles liées à une réservation.
- `EspeceEncaissementController` (`/especeencaissement`) :
  gestion d'une entité de type "espèce d'encaissement".

### 4.7 Droits, groupes et organisation interne

- `DroitAccesController` (`/droitAccess`) :
  gestion des droits d'accès.
- `GroupeDroitController` (`/groupeDroit`) :
  gestion des groupes de droits.
- `DepartmentController` (`/departments`) :
  CRUD des chapitres / départements.
- `EstablishmentController` (`/establishments`) :
  CRUD des établissements, liste des utilisateurs et départements d'un établissement.
- `EtablissementUtiliseurController` (`/etablissement`) :
  récupération de l'établissement par défaut d'un utilisateur.

## 5. Catalogue des services

### 5.1 Utilisateurs et sécurité

- `UtilisateurService` / `UtilisateurServiceImpl` :
  création des utilisateurs, affectation des rôles, activation, changement de mot de passe, reset password, désactivation, rattachement à un établissement, listings par rôle.
- `AuthRequestService` / `AuthRequestServiceImpl` :
  service d'authentification alternatif qui renvoie un `AuthResponseDto` avec token.
- `ApplicationUserDetailsService` :
  intégration Spring Security.
- `LoginAttemptService` :
  gestion des tentatives de connexion.

### 5.2 Agence, chapitres et établissements

- `AgenceImmobilierService` / `AgenceImmobiliereServiceImpl` :
  création, lecture, suppression, activation de compte agence.
- `DepartmentService` / `DepartmentServiceImpl` :
  CRUD des chapitres.
- `DefaultChapitreService` / `DefaultChapitreServiceImpl` :
  gestion du chapitre par défaut.
- `EstablishmentService` / `EstablishmentServiceImpl` :
  CRUD des établissements, listing des utilisateurs et départements.
- `EtablissementUtilsateurService` / `EtablissementUtilisateurServiceImpl` :
  récupération de l'établissement par défaut affecté à un utilisateur.

### 5.3 Référentiel géographique

- `PaysService` / `PaysServiceImpl`
- `VilleService` / `VilleServiceImpl`
- `CommuneService` / `CommuneServiceImpl`
- `QuartierService` / `QuartierServiceImpl`
- `SiteService` / `SiteServiceImpl`

Ces services gèrent le CRUD de référence géographique et les dépendances hiérarchiques entre pays, villes, communes, quartiers et sites.

### 5.4 Patrimoine immobilier

- `BienImmobilierService` / `BienImmobilierServiceImpl` :
  vues consolidées des biens, filtres par occupation, rattachement à un chapitre.
- `ImmeubleService` / `ImmeubleServiceImpl` :
  création et affichage d'immeubles.
- `EtageService` / `EtageServiceImpl` :
  gestion des étages.
- `AppartementService` / `AppartementServiceImpl` :
  gestion des appartements.
- `VillaService` / `VillaServiceImpl` :
  gestion des villas.
- `MagasinService` / `MagasinServiceImpl` :
  gestion des magasins.
- `ImageDataService` / `ImageDataServiceImpl` :
  images associées aux biens.
- `StorageService` / `StorageServiceImpl` :
  support de stockage / téléchargement.

### 5.5 Baux et loyers

- `BailService` / `BailServiceImpl` :
  clôture de bail, modification de bail, suppression, statistiques, recherche par locataire ou bien.
- `BailAppartementService` / `BailAppartmentServiceImpl` :
  baux d'appartement.
- `BailMagasinService` / `BailMagasinServiceImpl` :
  baux de magasin.
- `BailVillaService` / `BailVillaServiceImpl` :
  baux de villa.
- `MontantLoyerBailService` / `MontantLoyerBailServiceImpl` :
  historique et mise à jour des loyers.
- `AppelLoyerService` / `AppelLoyerServiceImpl` :
  génération des appels de loyer, calculs d'impayés, statistiques par période, réduction de loyer, messages SMS.
- `OperationService` / `OperationServiceImpl` :
  lecture des opérations métier consolidées.
- `MessageEnvoyerService` / `MessageEnvoyerServiceImp` :
  suivi des messages adressés aux locataires.

### 5.6 Encaissements, dépenses et clôture

- `EncaissementPrincipalService` / `EncaissementPrincipalServiceImpl` :
  encaissements de loyers, calculs agrégés, états d'impayés, marquage de clôture.
- `SuivieDepenseService` / `SuivieDepenseServiceImpl` :
  dépenses, annulations et listings de suivi.
- `ClotureCaisseService` / `ClotureCaisseServiceImpl` :
  opérations de clôture de caisse.
- `EspeceEncaissementService` / `EspeceEncaissementServiceImpl` :
  gestion des espèces d'encaissement.

### 5.7 Résidence / hôtellerie

- `CategoryChambreService` / `CategoryChambreServiceImpl` :
  catégories de chambres.
- `PrixParCategorieChambreService` / `PrixParCategoryChambreServiceImpl` :
  prix par catégorie.
- `ReservationService` / `ReservationServiceImpl` :
  réservations, périodes occupées, encaissements associés.
- `PrestaionService` / `PrestaionServiceImpl` :
  prestations de base.
- `PrestationAdditionnelReseravtionService` / `PrestationAdditionnelReseravtionServiceImp` :
  prestations additionnelles sur réservation.
- `SaveEncaissementReservationAvecRetourDeListService` / `SaveEncaissementReservationAvecRetourDeListImpl` :
  encaissement de réservation avec retour détaillé.

### 5.8 Reporting, notifications et planification

- `PrintService` / `PrintServiceImpl` :
  génération de PDF.
- `EmailService` / `EmailServiceImpl` :
  envoi d'emails métier.
- `MailService` :
  envoi SMTP effectif.
- `MailContentBuilder` :
  composition HTML des contenus mail.
- `CronMailService` / `CronMailServiceImpl` :
  gestion d'une planification métier liée aux envois.
- `CronJobService` :
  tâche planifiée hebdomadaire d'envoi de SMS de synthèse.
- `GestimoWebInitDataAgenceImmoService` / `GestimoWebInitDataAgenceImmoServiceImpl` :
  initialisation agence.
- `SmsSender` :
  point d'extension prévu pour l'envoi SMS.

### 5.9 Services incomplets ou suspects

- `BailStudioService` est vide.
- `StudioService` est vide.
- `deleteLocatire` et `deleteProprietaire` dans `UtilisateurServiceImpl` sont des no-op.
- plusieurs interfaces reposent uniquement sur `AbstractService` sans documentation métier explicite.

## 6. Catalogue des DTO

### 6.1 Utilisateurs et sécurité

- `AuthRequestDto` :
  login utilisateur (`username`, `password`).
- `AuthResponseDto` :
  réponse d'authentification contenant le token.
- `UtilisateurRequestDto` :
  DTO complet de saisie / lecture utilisateur ; identité, contact, pièce d'identité, statut, rôle, sécurité, établissement.
- `UtilisateurAfficheDto` :
  vue d'affichage utilisateur pour l'UI.
- `PublicUtilisateurDto` :
  vue publique minimale d'un utilisateur.
- `ChangePasswordRequestDto` :
  ancien mot de passe, nouveau mot de passe, confirmation.
- `PasswordResetRequestDto` :
  identifiant pour lancer la réinitialisation.
- `PasswordResetConfirmationRequestDto` :
  token de reset, nouveau mot de passe, confirmation.
- `UserEstablishmentAssignmentRequestDto` :
  affectation d'un utilisateur à un établissement.
- `RoleRequestDto` :
  représentation du rôle legacy.

### 6.2 Agence, droits, départements et établissements

- `AgenceRequestDto` :
  création / mise à jour agence.
- `ImageLogoDto` :
  support de logo agence.
- `AgenceImmobilierDTO` :
  vue d'affichage agence.
- `AgenceResponseDto` :
  réponse structurée agence.
- `PublicAgenceDto` :
  vue publique agence.
- `DepartmentRequestDto` :
  création / mise à jour d'un chapitre.
- `DepartmentResponseDto` :
  restitution d'un chapitre.
- `DefaultChapitreDto` :
  chapitre par défaut.
- `EstablishmentRequestDto` :
  création / mise à jour d'un établissement.
- `EstablishmentResponseDto` :
  restitution d'un établissement.
- `EtablissementUtilisateurDto` :
  lien utilisateur <-> établissement par défaut.
- `GroupeDroitDto` :
  groupe de droits.
- `DroitAccesDTO` :
  droit d'accès unitaire.
- `DroitAccesPayloadDTO` :
  charge utile de création / mise à jour des droits.

### 6.3 Référentiel géographique

- `PaysDto` :
  pays.
- `VilleDto` :
  ville.
- `CommuneRequestDto` :
  commune en écriture.
- `CommuneResponseDto` :
  commune en lecture.
- `QuartierRequestDto` :
  quartier en écriture.
- `QuartierResponseDto` :
  quartier en lecture.
- `SiteRequestDto` :
  site en écriture.
- `SiteResponseDto` :
  site en lecture.

### 6.4 Patrimoine immobilier

- `BienImmobilierDto` :
  bien immobilier générique.
- `BienImmobilierAffiheDto` :
  vue consolidée d'affichage d'un bien.
- `BienPeriodeDto` :
  bien sur une période.
- `ImmeubleDto` :
  immeuble.
- `ImmeubleAfficheDto` :
  vue d'immeuble pour l'affichage.
- `ImmeubleEtageDto` :
  agrégat immeuble + étages.
- `ImmeubleResponseDto` :
  réponse alternative immeuble.
- `EtageDto` :
  étage.
- `EtageAfficheDto` :
  étage enrichi pour affichage.
- `AppartementDto` :
  appartement.
- `VillaDto` :
  villa.
- `MagasinDto` :
  magasin.
- `MagasinResponseDto` :
  vue d'affichage magasin.
- `StudioDto` :
  studio.
- `ImageDataDto` :
  image associée à un bien.
- `ChargerLogoDto` :
  chargement de logo.

### 6.5 Baux et loyers

- `BailDto` :
  DTO de bail legacy.
- `BauxResponseDto` :
  vue synthétique de baux.
- `BailAfficheEtatDto` :
  état imprimable d'un bail.
- `BailAppartementDto` :
  bail d'appartement ; dates, caution, loyer, locataire, bien.
- `BailMagasinDto` :
  bail de magasin.
- `BailVillaDto` :
  bail de villa.
- `BailStudioDto` :
  bail de studio.
- `BailClotureDto` :
  clôture de bail.
- `BailModifDto` :
  modification de bail et de loyer.
- `OperationDto` :
  opération métier générique.
- `MontantLoyerBailDto` :
  historique des montants du bail.
- `AppelLoyerRequestDto` :
  génération d'appels pour un bail et un montant courant.
- `AppelLoyerDto` :
  appel de loyer simple.
- `AppelLoyerAfficheDto` :
  appel de loyer pour affichage.
- `AppelLoyerEncaissDto` :
  rapprochement appel / encaissement.
- `AppelLoyersFactureDto` :
  vue détaillée de facturation d'un appel.
- `AnneeAppelLoyersDto` :
  projection annuelle des appels.
- `AnnulerPaiementAppelLoyerDto` :
  annulation de paiement d'appel.
- `LocataireEncaisDTO` :
  vue croisée locataire / bien / bail / encaissement.
- `PourcentageAppelDto` :
  pourcentage ou taux sur appel.
- `PeriodeDto` :
  période d'appel.
- `StatistiquePeriodeDto` :
  agrégats statistiques par période.
- `MessageEnvoyerDto` :
  message envoyé à un locataire.
- `EmailRequestDto` :
  demande d'envoi d'email.

### 6.6 Encaissements, caisse et dépenses

- `EncaissementPayloadDto` :
  payload d'encaissement ; appel, date, mode de paiement, type d'opération, montant.
- `EncaissementPrincipalDTO` :
  vue d'encaissement principal.
- `ClotureCaisseDto` :
  clôture de caisse.
- `SuivieDepenseDto` :
  écriture de dépense.
- `SuivieDepenseEncaissementDto` :
  vue dépense / encaissement.
- `SuivieDepenseEncaisPeriodeDto` :
  agrégat de sortie sur période.
- `EspeceEncaissementDto` :
  espèce d'encaissement.

### 6.7 Résidence / hôtellerie

- `CategoryChambreSaveOrUpdateDto` :
  catégorie de chambre.
- `PrixParCategorieChambreDto` :
  prix d'une catégorie.
- `ReservationRequestDto` :
  données de saisie réservation.
- `ReservationSaveOrUpdateDto` :
  payload de sauvegarde / mise à jour réservation.
- `ReservationAfficheDto` :
  vue de restitution réservation.
- `EncaissementReservationRequestDto` :
  payload d'encaissement de réservation.
- `EncaissementReservationDto` :
  vue d'encaissement de réservation.
- `PrestationSaveOrUpdateDto` :
  prestation standard.
- `PrestationAdditionnelReservationSaveOrrUpdate` :
  prestation additionnelle appliquée à une réservation.

### 6.8 Communication et planification

- `CronMailDto` :
  date ou état de planification d'envoi.

## 7. Catalogue des entités

### 7.1 Socle de base

- `AbstractEntity` :
  socle commun avec `id`, `idAgence`, `idCreateur`, dates d'audit.
- `Operation` :
  abstraction des opérations métier datées liées à un utilisateur et un bien.
- `Bienimmobilier` :
  abstraction de tous les biens immobiliers, avec propriétaire, site, chapitre et occupation.

### 7.2 Utilisateurs, sécurité et organisation

- `Utilisateur` :
  utilisateur principal de l'application.
- `Role` :
  rôle métier persistant.
- `PasswordResetToken` :
  jeton de réinitialisation de mot de passe.
- `VerificationToken` :
  jeton d'activation de compte utilisé par la sécurité moderne.
- `TokenVerification` :
  équivalent legacy de vérification.
- `AgenceImmobiliere` :
  agence.
- `Chapitre` :
  département / chapitre organisationnel.
- `Etablissement` :
  établissement rattaché à un chapitre.
- `EtablissementUtilisateur` :
  relation utilisateur <-> établissement.
- `GroupeDroit` :
  groupe de droits.
- `DroitAcces` :
  droit d'accès.

### 7.3 Référentiel géographique

- `Pays`
- `Ville`
- `Commune`
- `Quartier`
- `Site`

Ces entités structurent l'adresse et la localisation métier des biens.

### 7.4 Patrimoine immobilier

- `Immeuble`
- `Etage`
- `Appartement`
- `Villa`
- `Magasin`
- `Studio`
- `ImageData`
- `ImageModel`
- `FileData`

### 7.5 Cycle locatif et comptable

- `BailLocation` :
  bail actif ou clôturé ; contient caution, statut et historiques liés.
- `MontantLoyerBail` :
  historique des montants d'un bail.
- `Charges` :
  charges rattachées à un bail.
- `AppelLoyer` :
  facture mensuelle de loyer avec solde, réduction et statut.
- `Encaissement` :
  encaissement legacy rattaché à un appel.
- `EncaissementPrincipal` :
  encaissement consolidé principal.
- `EspeceEncaissement` :
  type d'encaissement.
- `ChequeEncaissement`
- `MoneyElectronicEncaissement`
- `Quittance`
- `SuivieDepense`
- `MessageEnvoyer`

### 7.6 Résidence / hôtellerie

- `CategorieChambre`
- `PrixParCategorieChambre`
- `Prestation`
- `PrestationAdditionnelReservation`
- `Reservation`
- `EncaissementReservation`

### 7.7 Divers

- `CronMail`
- `NotificationEmail`
- `SmsRequest`

## 8. Repositories, validateurs, mappers et handlers

### 8.1 Repositories legacy

`AppartementRepository`, `AppelLoyerRepository`, `BailLocationRepository`, `BienImmobilierRepository`, `CategoryChambreRepository`, `ChargesRepository`, `ChequeEncaissementRepository`, `ClotureCaisseRepository`, `CommuneRepository`, `CronMailRepository`, `DroitAccesRepository`, `EncaissementPrincipalRepository`, `EncaissementRepository`, `EncaissementReservationRepository`, `EspeceEncaissementRepository`, `EtageRepository`, `GroupeDroitRepository`, `ImageDataRepository`, `ImageRepository`, `ImmeubleRepository`, `MagasinRepository`, `MessageEnvoyerRepository`, `MoneyElectronicEncaissRepository`, `MontantLoyerBailRepository`, `OperationRepository`, `PaysRepository`, `PrestationAdditionnelReservationRepository`, `PrestationRepository`, `PrixParCategorieChambreRepository`, `QuartierRepository`, `QuittanceRepository`, `ReservationRepository`, `RoleRepository`, `SiteRepository`, `SuivieDepenseRepository`, `VillaRepository`, `VilleRepository`.

### 8.2 Repositories modulaires

`AgenceImmobiliereRepository`, `ChapitreRepository`, `EtablissementRepository`, `EtablissementUtilisteurRepository`, `ChapitreUserRepository`, `UtilisateurRepository`, `PasswordResetTokenRepository`, `VerificationTokenRepository`.

### 8.3 Validateurs

Legacy :
`AppartementDtoValidator`, `AppelLoyerDtoValidator`, `AppelLoyerRequestValidator`, `BailAppartementDtoValidator`, `BailMagasinDtoValidator`, `BailValidator`, `BailVillaDtoValidator`, `CommuneValidator`, `EncaissementPayloadDtoValidator`, `EncaissementPrincipalDTOValidor`, `EspeceEncaissementDtoValidator`, `EtageDtoValidator`, `ImmeubleDtoValidator`, `ImmeubleEtageDtoValidator`, `MagasinDtoValidator`, `MontantLoyerBailDtoValidator`, `ObjectsValidator`, `PaysDtoValidator`, `QuartierDtoValidator`, `RoleDtoValidator`, `SiteDtoValidator`, `SuivieDepenseValidator`, `VillaDtoValidator`, `VilleDtoValidator`.

Modules récents :
`AuthRequestDtoValidator`, `UtilisateurDtoValiditor`, `AgenceDtoValidator`.

### 8.4 Mappers

Legacy :
`GestimoWebMapperImpl`, `BailMapperImpl`, `GroupeDroitMapperImpl`, `ImmeubleMapperImpl`.

Modules récents :
`CompanyMapper`, `DepartmentMapper`, `EstablishmentMapper`, `UserMapper`.

### 8.5 Gestion d'erreurs

- `GlobalExceptionHandler`
- `RestExceptionHandler`
- `ErrorDto`
- `ExceptionRepresentation`
- package `exceptions` avec `EntityNotFoundException`, `InvalidEntityException`, `InvalidOperationException`, `OperationNonPermittedException`, `GestimoWebExceptionGlobal`, `ErrorCodes`

## 9. Tâches planifiées et automatisations

- `CronJobService` :
  tâche planifiée chaque vendredi à 15h, envoie un SMS de synthèse d'encaissement pour l'agence `1`.
- `Scheduler` :
  tâche toutes les 5 secondes, aujourd'hui quasi vide.

## 10. Dette technique et fonctionnalités à revoir en priorité

### 10.1 Sécurité

1. Supprimer immédiatement la clé OpenAI codée en dur du composant Angular `page-chat-ia.component.ts`.
2. Sortir tous les secrets de `application.properties`.
3. Revoir `PUBLIC_URLS` pour ne laisser publics que :
   login, reset password, documentation OpenAPI, éventuellement quelques routes marketing explicitement voulues.
4. Supprimer ou restreindre `PublicListingController`.

### 10.2 Architecture

1. Choisir un seul style d'organisation.
2. Déplacer progressivement le legacy vers des modules métier cohérents :
   `auth`, `users`, `agencies`, `geography`, `assets`, `leases`, `billing`, `payments`, `residence`, `reporting`.
3. Remplacer les `findAll().stream().filter(...)` par des requêtes repository ciblées.

### 10.3 Fonctionnalités incomplètes

1. `BailStudioService` et `StudioService` sont vides.
2. Plusieurs mappers et services comportent des `return null`.
3. `deleteLocatire` et `deleteProprietaire` ne font rien.
4. Certains endpoints se recouvrent ou doublonnent :
   exemple `save` / `savesite`, `saveorupdate` / `saveorupdatereservation`.

### 10.4 Produit

1. Décider si le module résidence doit rester dans la même base de code que la gestion locative.
2. Décider si le module `chat-ia` fait vraiment partie du produit.
3. Revoir les données de démonstration injectées au démarrage.
4. Clarifier le concept de `Chapitre` / `Department` / `Etablissement`, qui semble aujourd'hui hybride.

### 10.5 DevOps

1. Corriger le `Dockerfile` backend pour Java 17.
2. Ajouter une stratégie de configuration par environnement.
3. Ajouter des tests d'intégration sur les flux critiques :
   login, création de bail, génération d'appels, encaissement, reset password.
