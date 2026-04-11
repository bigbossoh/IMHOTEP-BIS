# Déploiement production sur VPS (Docker Compose)

Ce guide déploie le projet sur un VPS (ex: `51.75.142.41`) avec :

- MySQL (`db`)
- Backend Spring Boot (`backend`)
- Front Angular buildé et servi par Nginx (`frontend`, avec proxy vers le backend)

## 1) Pré-requis sur le VPS

### Docker + Compose

Sur Ubuntu, installez Docker + le plugin Compose :

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
docker --version
docker compose version
```

### Firewall (si activé)

Ouvrez au minimum :

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw status
```

### Conflit port 80 (Nginx sur le VPS)

Si vous voyez la page "Welcome to nginx!" en allant sur `http://51.75.142.41/`, c'est souvent le Nginx du VPS (installé sur la machine) qui répond, pas le conteneur `frontend`.

Deux options :

- Arrêter/désactiver Nginx (si vous ne l'utilisez pas) :
  ```bash
  sudo systemctl stop nginx
  sudo systemctl disable nginx
  ```
- Ou changer le port publié par Docker (ex: `HTTP_PORT=8080` dans `.env`) et accéder à `http://51.75.142.41:8080/`.

## 2) Récupérer le projet sur le serveur

Deux options :

- via Git (recommandé) :
  ```bash
  git clone <URL_DU_DEPOT> imhotep-bis
  cd imhotep-bis
  ```
- via copie (SCP/WinSCP) : copiez au minimum `docker-compose.prod.yml` + `.env` (+ votre dump SQL) sur le VPS.

## 3) Configurer les variables d'environnement

Copiez le template :

```bash
cp .env.example .env
```

Puis éditez `.env` (mots de passe, `JWT_SECRET`, email, etc.).

## 4) Démarrer la stack

Si vous avez cloné le dépôt : utilisez `docker-compose.prod.yml` (il ne build rien sur le VPS, il ne fait que pull les images Docker Hub).

```bash
cd imhotep-bis
```

```bash
docker compose -f docker-compose.prod.yml up -d --pull always db
docker compose -f docker-compose.prod.yml ps
```

Note : `docker login` n'est nécessaire sur le VPS que si vos images Docker Hub sont privées.

Note : en profil `prod`, le backend est en `ddl-auto: validate` (il faut donc une base initialisée, via dump ou base existante).

Accès :

- Front : `http://51.75.142.41/`
- Swagger (via proxy Nginx) : `http://51.75.142.41/swagger-ui/index.html`
- Actuator (via proxy Nginx) : `http://51.75.142.41/actuator`

## 5) Importer un dump SQL (si besoin)

1. Copiez le dump sur le VPS (ex: `Dump20260325.sql`).
2. Importez dans MySQL :

```bash
docker compose -f docker-compose.prod.yml exec -T db sh -lc 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' < Dump20260325.sql
```

Puis démarrez le backend + frontend (sans builder sur le VPS) :

```bash
docker compose -f docker-compose.prod.yml up -d --pull always
```

## 6) Logs & maintenance

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose restart backend
```

Mise à jour applicative (si vous utilisez Git) :

```bash
# si vous versionnez vos images : modifiez APP_VERSION dans .env puis :
docker compose -f docker-compose.prod.yml up -d --pull always
```
