# Guide de Certification FNE (Facture Normalisée Électronique)

## Vue d'ensemble des nouvelles fonctionnalités

Le projet dispose de **deux modules de certification FNE** :

### 1. Module `fne` (historique) - Utilise HttpURLConnection
- **FneService.java** : Client REST avec HttpURLConnection
- **FneController.java** : Endpoint `/api/v1/fne`
- **DTOs** : `FneSignInvoiceRequest`, `FneSignInvoiceResponse`, `FneRefundRequest`, `FneFactureCertificationDto`

### 2. Module `newCertificationWay` (récent) - Utilise WebClient
- **InvoiceCertificationService.java** : Interface principale
- **InvoiceCertificationServiceImpl.java** : Implémentation avec WebClient et persistance DB
- **InvoiceController.java** : Endpoints `/api/v1/new-invoices`
- **Entités** : `InvoiceFneCertify`, `Item`, `InvoiceCertifierCustomTax`, `VerificationRefundResponse`, etc.

---

## Procédure de certification des factures (Résidence)

### Étapes pour certifier une facture :

1. **La facture doit être soldée** : Le solde de la réservation doit être à 0
2. **Accéder à la liste des factures** : Route `/factures-residence`
3. **Cliquer sur "Certifier"** : Pour les factures au statut "Soldée"
4. **Système envoie à la DGI** : L'API FNE est appelée avec les données de la facture

### Données envoyées à la DGI :

```json
{
  "invoiceType": "sale",
  "paymentMethod": "ESPECES",
  "template": "B2C",
  "clientCompanyName": "Nom du client",
  "clientSellerName": "Nom de l'agence",
  "items": [
    {
      "description": "Séjour - Chambre 101",
      "quantity": 1,
      "amount": 15000,
      "taxes": ["TVAC"]
    }
  ]
}
```

---

## Endpoints API disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/new-invoices/certify` | Certifier une facture (retourne JsonNode) |
| POST | `/api/v1/new-invoices/certify-final` | Certifier et sauvegarder en DB |
| POST | `/api/v1/new-invoices/certify-final-facture/{numFacture}/{utilisateur}` | Certifier avec numéro facture interne |
| POST | `/api/v1/new-invoices/certify-propre` | Certifier avec retour InvoiceMainResponse |
| POST | `/api/v1/new-invoices/refund-invoice` | Créer un avoir/remboursement |
| GET | `/api/v1/new-invoices/all-certified-invoices` | Liste toutes les factures certifiées |
| GET | `/api/v1/new-invoices/by-numero?numeroFacture=FAC-001` | Recherche par numéro |
| GET | `/api/v1/new-invoices/environment-label` | Retourne l'environnement (TEST/PROD) |
| GET | `/api/v1/new-invoices/list-facture-avoir` | Liste des avoirs |
| GET | `/api/v1/new-invoices/invoice/{invoiceId}` | Avoirs par ID facture |

---

## Configuration environnement

### Fichier `application-dev.yml` (Test)
```yaml
fne:
  enabled: true
  base-url: http://54.247.95.108/ws
  bearer-token: WCRHegK8Jk5HyNabnYSq1nmozBSj3BCC

invoice:
  api:
    enabled: true
    base-url: http://54.247.95.108/ws
    token: WCRHegK8Jk5HyNabnYSq1nmozBSj3BCC
    sign-path: /external/invoices/sign
```

### Fichier `application-prod.yml` (Production)
```yaml
fne:
  enabled: true
  base-url: https://www.services.fne.dgi.gouv.ci/ws
  bearer-token: qroYuiOXtt32EcsPa9Wg6JWjhEyLNOWr

invoice:
  api:
    enabled: true
    base-url: https://www.services.fne.dgi.gouv.ci/ws
    token: qroYuiOXtt32EcsPa9Wg6JWjhEyLNOWr
    sign-path: /external/invoices/sign
```

---

## Erreurs connues et solutions

### Erreur `invoice_signing_error` (HTTP 500)

Causes possibles :
1. **Format des taxes** : L'API peut attendre `[{"name": "TVAC", "amount": 0}]` au lieu de `["TVAC"]`
2. **Champ `clientSellerName`** : Doit être renseigné (nom de l'agence)
3. **Serveur DGI** : L'erreur vient du serveur, pas du code

**Solution temporaire** : Désactiver la certification
```yaml
invoice:
  api:
    enabled: false
fne:
  enabled: false
```

---

## Commandes utiles

```bash
# Vérifier les logs FNE
docker logs <backend_container> | grep -i "FNE\|certification"

# Activer le profil dev
--spring.profiles.active=dev