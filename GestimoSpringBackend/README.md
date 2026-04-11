# GestimoSpringBackend

Le backend Spring Boot du projet Gestimo est désormais documenté au niveau dépôt.

## Où lire la documentation utile

- vue globale du projet : `../README.md`
- référence backend détaillée : `../docs/backend-reference.md`

## Résumé rapide

Ce module expose l'API `api/v1` et gère :

- authentification JWT ;
- utilisateurs, agences, rôles, droits, établissements ;
- référentiel géographique ;
- patrimoine immobilier ;
- baux, appels de loyer, encaissements, dépenses, clôtures ;
- réservations de résidence ;
- génération de PDF et envoi de mails.

## Lancement local

```powershell
docker compose up -d
.\mvnw.cmd spring-boot:run
```

Ports par défaut :

- API : `http://localhost:8287`
- Swagger UI : `http://localhost:8287/swagger-ui/index.html`

## Note importante

Le backend contient encore plusieurs points de dette technique à auditer :

- secrets présents par défaut dans la configuration ;
- endpoints métier trop largement exposés ;
- mélange entre architecture legacy et modules récents ;
- initialisation automatique de données de démonstration au démarrage.


