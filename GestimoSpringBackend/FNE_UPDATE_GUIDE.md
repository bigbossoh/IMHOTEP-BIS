# Mise à Jour - Fonctionnalités FNE (Facture Normalisée Électronique)

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

## Points à mettre à jour / problèmes identifiés

### 1. Configuration production (`application-prod.yml`)

Les URLs et tokens sont actuellement sur l'environnement test au lieu de production :

```yaml
# ACTUEL (INCORRECT) - Environnement TEST
fne:
  base-url: http://54.247.95.108/ws
  bearer-token: WCRHegK8Jk5HyNabnYSq1nmozBSj3BCC

invoice:
  api:
    base-url: http://54.247.95.108/ws
    token: WCRHegK8Jk5HyNabnYSq1nmozBSj3BCC
```

**À corriger avec les valeurs production** :
```yaml
fne:
  base-url: https://www.services.fne.dgi.gouv.ci/ws
  bearer-token: qroYuiOXtt32EcsPa9Wg6JWjhEyLNOWr

invoice:
  api:
    base-url: https://www.services.fne.dgi.gouv.ci/ws
    token: qroYuiOXtt32EcsPa9Wg6JWjhEyLNOWr
```

---

### 2. Méthode non implémentée (`InvoiceCertificationServiceImpl.java`)

La méthode `getAllRefundInvoiceList()` lève une exception :

```java
@Override
public List<VerificationRefundResponse> getAllRefundInvoiceList() {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'getAllRefundInvoiceList'");
}
```

**Solution** : Remplacer par :
```java
@Override
public List<VerificationRefundResponse> getAllRefundInvoiceList() {
    return verificationRefundResponseRepo.findAllByOrderByCreatedAtDesc();
}
```

---

### 3. Environment frontend (`environment.prod.ts`)

L'URL du serveur pointe vers localhost au lieu de production :

```typescript
// ACTUEL
serverUrl: 'http://localhost:8287/actuator'
```

**À corriger** :
```typescript
serverUrl: 'https://gestimoweb.com/actuator'
// ou selon votre configuration Caddyfile
```

---

### 4. Duplication de logique FNE

Le projet a **deux implémentations similaires** :
- `FneService` (HttpURLConnection)
- `InvoiceCertificationServiceImpl` (WebClient + persistance)

**Recommandation** : 
- Décider quel module garder (préférence pour `newCertificationWay` avec WebClient car plus moderne)
- Consolider les deux modules
- Supprimer le code en doublon

---

### 5. Variables d'environnement manquantes (`.env.example`)

Ajouter les variables FNE manquantes :

```env
# FNE API Configuration
FNE_ENABLED=true
FNE_BASE_URL=https://www.services.fne.dgi.gouv.ci/ws
FNE_BEARER_TOKEN=your_prod_token_here

# Invoice API (newCertificationWay)
INVOICE_API_ENABLED=true
INVOICE_API_BASE_URL=https://www.services.fne.dgi.gouv.ci/ws
INVOICE_API_TOKEN=your_prod_token_here
INVOICE_API_SIGN_PATH=/external/invoices/sign
```

---

### 6. Documentation des endpoints API

#### Endpoints disponibles dans `InvoiceController` :

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

## Checklist de mise à jour

- [ ] **Production FNE** : Mettre à jour `application-prod.yml` avec les URLs/tokens production
- [ ] **Frontend prod** : Mettre à jour `environment.prod.ts` avec l'URL production
- [ ] **Bug fix** : Implémenter `getAllRefundInvoiceList()` dans `InvoiceCertificationServiceImpl`
- [ ] **Env example** : Ajouter variables FNE dans `.env.example`
- [ ] **Nettoyage** : Décider quelle implémentation FNE garder (fne vs newCertificationWay)
- [ ] **Tests** : Vérifier la certification avec l'environnement production DGI
- [ ] **Documentation** : Mettre à jour README avec les nouveaux endpoints FNE

---

## Erreurs connues (FNE_ERROR_ANALYSIS.md)

L'erreur `invoice_signing_error` (HTTP 500) peut provenir de :

1. **Format des taxes** : L'API attend peut-être `[{"name": "TVAC", "amount": 0}]` au lieu de `["TVAC"]`
2. **Champ foreignCurrency** : À définir explicitement si nécessaire
3. **Server DGI** : L'erreur vient du serveur, pas du code - workaround : désactiver temporairement (`enabled: false`)

---

## Commandes utiles

```bash
# Vérifier les logs FNE
docker logs <backend_container> | grep -i "FNE\|certification"

# Activer le profil dev
--spring.profiles.active=dev

# Désactiver temporairement la certification
# Dans application-prod.yml:
invoice:
  api:
    enabled: false
fne:
  enabled: false