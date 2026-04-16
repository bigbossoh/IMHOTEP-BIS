# Supervision (Prometheus + Grafana)

Cette configuration ajoute la supervision de vos conteneurs en production avec :

- **Prometheus** (collecte des métriques)
- **Grafana** (dashboards)
- **Loki** (stockage des logs)
- **Promtail** (collecte des logs Docker → Loki)
- **node-exporter** (métriques serveur / OS)
- **cAdvisor** (métriques Docker / conteneurs)

Fichiers concernés :

- `docker-compose.prod.yml`
- `prometheus/prometheus.yml`
- `grafana/provisioning/datasources/prometheus.yml`
- `grafana/provisioning/datasources/loki.yml`
- `loki/loki.yml`
- `promtail/promtail.yml`

## Démarrage

```bash
docker compose -f docker-compose.prod.yml up -d --pull always
docker compose -f docker-compose.prod.yml ps
```

## Accès à Grafana

### Option A (recommandé) : via Caddy + HTTPS

1. Ajoutez un enregistrement DNS : `grafana.gestimoweb.com` → IP du VPS.
2. Grafana est alors disponible sur : `https://grafana.gestimoweb.com`

Identifiants :

- utilisateur : `GRAFANA_ADMIN_USER` (défaut : `admin`)
- mot de passe : `GRAFANA_ADMIN_PASSWORD` (défaut dans le compose : `GESTIMOWEB@2026`, **à changer**)

### Option B : garder Grafana interne

Ne publiez pas Grafana (pas de règle Caddy / pas de ports). Accédez-y via un tunnel SSH ou depuis le réseau privé.

## Cibles scrappées par Prometheus

Par défaut, Prometheus scrappe :

- `node-exporter:9100` (métriques hôte)
- `cadvisor:8080` (métriques conteneurs)
- `backend:8287/actuator/prometheus` (métriques applicatives Spring Boot, si activées)

Si `/actuator/prometheus` n’est pas disponible côté backend, commentez le job `backend` dans `prometheus/prometheus.yml`
ou vérifiez que votre image backend inclut `micrometer-registry-prometheus` (le `pom.xml` du dépôt l’inclut).

## Dashboards Grafana (suggestions)

Dans Grafana → **Dashboards** → **Import**, vous pouvez importer des dashboards publics (ex: *Node Exporter Full* / dashboards cAdvisor).

## Logs (Loki)

Une fois Loki + Promtail démarrés, allez dans Grafana → **Explore** → datasource **Loki**.

Exemples de requêtes utiles :

- Logs backend : `{container=~\".*backend.*\"}`
- Logs Caddy : `{container=~\".*caddy.*\"}`
- Erreurs seulement : `{container=~\".*backend.*\"} |= \"ERROR\"`
