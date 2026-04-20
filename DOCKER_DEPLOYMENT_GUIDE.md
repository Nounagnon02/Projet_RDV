# 🐳 Guide de Déploiement Docker - Projet RDV

## 📦 Architecture

- **Frontend**: React + Vite → Docker → Vercel/Render
- **Backend**: Laravel + PHP-FPM + Nginx → Docker → Render
- **Database**: PostgreSQL → Render

---

## 🚀 Déploiement Backend sur Render (Docker)

### Prérequis
- Compte Render (https://render.com)
- Code poussé sur GitHub/GitLab/Bitbucket

### Étape 1: Créer la base de données PostgreSQL

1. Connectez-vous à Render
2. Cliquez sur **"New +"** → **"PostgreSQL"**
3. Configuration:
   - **Name**: `projet-rdv-db`
   - **Database**: `projet_rdv`
   - **User**: `projet_rdv_user`
   - **Region**: Choisissez la plus proche (ex: Frankfurt)
   - **Plan**: Free
4. Cliquez sur **"Create Database"**
5. **Notez les informations de connexion** (Internal Database URL)

### Étape 2: Générer APP_KEY

Sur votre machine locale:
```bash
cd backend
php artisan key:generate --show
```

Copiez la clé générée (format: `base64:xxxxx...`)

### Étape 3: Déployer le Backend avec Docker

1. Cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre repository Git
3. Configuration:
   - **Name**: `projet-rdv-backend`
   - **Region**: Même région que la DB
   - **Root Directory**: `backend`
   - **Environment**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Plan**: Free

4. **Variables d'environnement** (Environment):

```bash
# Application
APP_NAME=ProjetRDV
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:VOTRE_CLE_GENEREE_ICI
APP_URL=https://votre-backend.onrender.com

# Database (depuis votre DB Render)
DB_CONNECTION=pgsql
DB_HOST=dpg-xxxxx-a.frankfurt-postgres.render.com
DB_PORT=5432
DB_DATABASE=projet_rdv
DB_USERNAME=projet_rdv_user
DB_PASSWORD=VOTRE_PASSWORD_DB

# Session & Cache
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

# Logs
LOG_CHANNEL=errorlog
LOG_LEVEL=error

# CORS - URL de votre frontend
FRONTEND_URL=https://votre-app.vercel.app

# Mail (optionnel - configurez selon votre service)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=votre_username
MAIL_PASSWORD=votre_password
MAIL_FROM_ADDRESS=noreply@votreapp.com
MAIL_FROM_NAME=ProjetRDV

# FedaPay (si utilisé)
FEDAPAY_MODE=sandbox
FEDAPAY_PUBLIC_KEY=votre_public_key
FEDAPAY_SECRET_KEY=votre_secret_key
```

5. Cliquez sur **"Create Web Service"**
6. Le déploiement prendra 5-10 minutes
7. Votre backend sera accessible sur: `https://votre-backend.onrender.com`

### Étape 4: Vérifier le déploiement

```bash
# Testez l'API
curl https://votre-backend.onrender.com/up

# Devrait retourner: {"status":"ok"}
```

---

## 🎨 Déploiement Frontend sur Vercel

### Option 1: Déploiement Vercel (Recommandé)

1. **Connectez-vous à Vercel** (https://vercel.com)
2. Cliquez sur **"Add New Project"**
3. Sélectionnez votre repository
4. Configuration:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Variables d'environnement**:
   ```
   VITE_API_URL=https://votre-backend.onrender.com/api
   ```

6. Cliquez sur **"Deploy"**
7. Votre frontend sera accessible sur: `https://votre-app.vercel.app`

### Option 2: Déploiement Render avec Docker

1. Cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre repository
3. Configuration:
   - **Name**: `projet-rdv-frontend`
   - **Region**: Même région que le backend
   - **Root Directory**: `frontend`
   - **Environment**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Plan**: Free

4. **Build Arguments**:
   ```
   VITE_API_URL=https://votre-backend.onrender.com/api
   ```

5. Cliquez sur **"Create Web Service"**

---

## 🧪 Test Local avec Docker Compose

### Prérequis
- Docker et Docker Compose installés

### Étapes

1. **Générez votre APP_KEY**:
   ```bash
   cd backend
   php artisan key:generate --show
   ```

2. **Modifiez docker-compose.yml**:
   Remplacez `YOUR_APP_KEY_HERE` par votre clé générée

3. **Lancez les services**:
   ```bash
   docker-compose up -d
   ```

4. **Accédez à l'application**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000
   - Database: localhost:5432

5. **Arrêtez les services**:
   ```bash
   docker-compose down
   ```

6. **Voir les logs**:
   ```bash
   docker-compose logs -f backend
   docker-compose logs -f frontend
   ```

---

## 📁 Structure des fichiers Docker

```
Projet_RDV/
├── backend/
│   ├── Dockerfile                 # Image Docker backend
│   ├── .dockerignore             # Fichiers à ignorer
│   ├── docker/
│   │   ├── nginx.conf            # Config Nginx
│   │   ├── supervisord.conf      # Config Supervisor
│   │   └── entrypoint.sh         # Script de démarrage
│   └── render.yaml               # Config Render
│
├── frontend/
│   ├── Dockerfile                # Image Docker frontend
│   ├── .dockerignore            # Fichiers à ignorer
│   ├── docker/
│   │   └── nginx.conf           # Config Nginx
│   └── vercel.json              # Config Vercel
│
└── docker-compose.yml           # Orchestration locale
```

---

## 🔧 Commandes Docker utiles

### Backend

```bash
# Build l'image
docker build -t projet-rdv-backend ./backend

# Run le container
docker run -p 8000:80 \
  -e APP_KEY=base64:xxx \
  -e DB_HOST=db \
  projet-rdv-backend

# Accéder au shell du container
docker exec -it <container_id> bash

# Exécuter des commandes artisan
docker exec -it <container_id> php artisan migrate
docker exec -it <container_id> php artisan cache:clear
```

### Frontend

```bash
# Build l'image avec variable d'env
docker build \
  --build-arg VITE_API_URL=https://api.example.com/api \
  -t projet-rdv-frontend ./frontend

# Run le container
docker run -p 5173:80 projet-rdv-frontend
```

---

## 🔍 Dépannage

### Backend ne démarre pas

1. **Vérifiez les logs Render**:
   - Dashboard → Votre service → Logs

2. **Erreurs communes**:
   - `APP_KEY not set`: Ajoutez la variable d'environnement
   - `Connection refused`: Vérifiez les credentials DB
   - `Permission denied`: Problème de permissions storage/

3. **Accédez au shell Render**:
   - Dashboard → Votre service → Shell
   ```bash
   php artisan config:clear
   php artisan cache:clear
   php artisan migrate:status
   ```

### Frontend ne charge pas

1. **Vérifiez VITE_API_URL**:
   - Doit pointer vers le backend Render
   - Format: `https://backend.onrender.com/api`

2. **Erreur CORS**:
   - Vérifiez `FRONTEND_URL` dans le backend
   - Vérifiez `config/cors.php`

3. **Build échoue**:
   - Vérifiez les logs de build
   - Vérifiez que toutes les dépendances sont dans package.json

### Base de données

1. **Connexion échoue**:
   - Utilisez l'Internal Database URL (pas l'External)
   - Vérifiez que le backend et la DB sont dans la même région

2. **Migrations ne s'exécutent pas**:
   ```bash
   # Via Render Shell
   php artisan migrate:fresh --force
   php artisan db:seed --force
   ```

---

## 🔐 Sécurité en Production

### Backend

1. **Variables sensibles**:
   - Ne commitez JAMAIS `.env`
   - Utilisez les variables d'environnement Render

2. **APP_DEBUG**:
   - Toujours `false` en production

3. **HTTPS**:
   - Automatique sur Render
   - Forcez HTTPS dans Laravel:
   ```php
   // Dans AppServiceProvider
   if ($this->app->environment('production')) {
       URL::forceScheme('https');
   }
   ```

### Frontend

1. **Variables d'environnement**:
   - Préfixez toujours avec `VITE_`
   - Ne stockez pas de secrets côté client

2. **Build de production**:
   - Minification automatique avec Vite
   - Tree-shaking activé

---

## 📊 Monitoring

### Render Dashboard

- **Metrics**: CPU, Memory, Bandwidth
- **Logs**: Temps réel et historique
- **Events**: Déploiements, redémarrages

### Logs Laravel

```bash
# Via Render Shell
tail -f storage/logs/laravel.log

# Ou configurez un service externe
# - Papertrail
# - Loggly
# - Sentry
```

---

## 🚀 Optimisations

### Backend

1. **Cache de configuration**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```
   ✅ Déjà fait dans le Dockerfile

2. **OPcache PHP**:
   Activé par défaut dans l'image PHP-FPM

3. **Queue Workers** (optionnel):
   Ajoutez dans `docker/supervisord.conf`:
   ```ini
   [program:queue-worker]
   command=php /var/www/artisan queue:work --tries=3
   autostart=true
   autorestart=true
   ```

### Frontend

1. **Compression Gzip**:
   ✅ Déjà configuré dans nginx.conf

2. **Cache des assets**:
   ✅ Headers Cache-Control configurés

3. **Code splitting**:
   ✅ Automatique avec Vite

---

## ✅ Checklist de déploiement

### Préparation
- [ ] Code poussé sur Git
- [ ] APP_KEY générée
- [ ] Variables d'environnement préparées

### Backend
- [ ] Base de données PostgreSQL créée sur Render
- [ ] Web Service Docker créé
- [ ] Variables d'environnement configurées
- [ ] Déploiement réussi
- [ ] Migrations exécutées
- [ ] API testée (`/up` endpoint)

### Frontend
- [ ] Service créé (Vercel ou Render)
- [ ] VITE_API_URL configurée
- [ ] Build réussi
- [ ] Application accessible
- [ ] Connexion API fonctionnelle

### Sécurité
- [ ] APP_DEBUG=false
- [ ] CORS configuré
- [ ] HTTPS activé
- [ ] Secrets sécurisés

---

## 📞 Ressources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Docker Docs**: https://docs.docker.com
- **Laravel Docs**: https://laravel.com/docs
- **Vite Docs**: https://vitejs.dev

---

## 🎯 Prochaines étapes

1. Configurez un domaine personnalisé
2. Activez les backups automatiques de la DB
3. Configurez un service d'email professionnel
4. Ajoutez un monitoring (Sentry, New Relic)
5. Configurez un CDN pour les assets statiques
6. Mettez en place un CI/CD (GitHub Actions)
