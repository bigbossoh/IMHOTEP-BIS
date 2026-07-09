# Rapport d'Analyse : Erreur Certification FNE "invoice_signing_error" (HTTP 500)

## Erreur Observée
```
Certification FNE échouée pour FACT2026MO00006 : {"message":"Error signing invoice","error":"invoice_signing_error","statusCode":500,"errors":{},"extraParams":{}}
```

## Analyse du Problème

Cette erreur HTTP 500 provient **directement du serveur API FNE (DGI)**, pas de votre application. C'est une erreur interne du serveur de la DGI.

## Causes Possibles (côté client)

### 1. **Champ clientSellerName manquant**
Le champ `clientSellerName` (nom du vendeur) n'était pas envoyé dans la requête. Cette information peut être obligatoire selon le template B2C utilisé. ✅ **CORRIGÉ**

### 2. **Format des taxes**
Dans `InvoiceItem.java`, le champ `taxes` est défini comme `List<String>` (ex: `["TVA"]`), mais l'API FNE peut attendre un format objet.

**Payload envoyé:**
```json
{
  "taxes": ["TVA"],
  "reference": "RESA-123",
  "description": "Sejour - Chambre 101",
  ...
}
```

### 3. **Champ foreignCurrency**
Le champ `foreignCurrency` n'est pas défini explicitement (null par défaut), ce qui peut causer des erreurs côté API.

## Corrections Apportées

### ✅ 1. InvoiceApiProperties.java
Ajout de la propriété `enabled` pour pouvoir désactiver la certification FNE en cas de problème serveur DGI.

### ✅ 2. InvoiceCertificationServiceImpl.java  
Ajout de la vérification `enabled` avant l'appel à l'API (similaire à FneService.java).

### ✅ 3. InvoiceSignRequest.java
Ajout du champ `clientTerminal` pour complétude.

### ✅ 4. PrintServiceImpl.java
Ajout du champ `clientSellerName` dans la requête de certification (nom de l'agence).

### ✅ 5. application-dev.yml & application-prod.yml
Ajout des propriétés `enabled` et `sign-path` dans la configuration `invoice.api`.

### ✅ 6. FneProperties.java & application.yml
Modification de `default-taxe` de "TVA" à **"TVAC"** (TVA Collectée) - code fiscal correct selon la DGI.

## Solutions Recommandées

### Solution 1 : Désactiver temporairement la certification FNE (WORKAROUND)
Dans `application-prod.yml` ou via variable d'environnement:
```yaml
invoice:
  api:
    enabled: false
fne:
  enabled: false
```

### Solution 2 : Vérifier le format des taxes avec la DGI
L'API FNE peut attendre:
- Un format `String` simple : `["TVA"]` (actuel)
- Un format objet : `[{"name": "TVA", "amount": 0}]` (possible)

### Solution 3 : Vérifier les logs de l'API
Actuellement, les logs montrent:
```
========== FNE CERTIFICATION REQUEST ==========
URL : http://54.247.95.108/ws/external/invoices/sign
{...payload...}
==============================================
```

Mais l'erreur retournée par l'API est: `{"message":"Error signing invoice","error":"invoice_signing_error","statusCode":500}`

## Pièges à éviter

1. **Ne pas modifier le token FNE en prod** - Le token production est différent du token test
2. **Vérifier la connectivité réseau** - L'API FNE peut être inaccessible depuis certains environnements
3. **La certification doit rester optionnelle** - L'échec ne doit pas bloquer la génération du PDF

## Fichiers de configuration mise à jour

### application-dev.yml
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

### application-prod.yml
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