# 🚀 Guide de Déploiement - Projet RDV

## 📦 Architecture de déploiement

- **Frontend**: React + Vite → Vercel (natif, sans Docker)
- **Backend**: Laravel + PHP-FPM + Nginx → Render (Docker)
- **Database**: PostgreSQL → Render

---

## 🎨 Déploiement Frontend sur Vercel (Sans Docker)

### Prérequis
- Compte Vercel (https://vercel.com)
- Code poussé sur GitHub/GitLab/Bitbucket

### Étapes

1. **Connectez-vous à Vercel**
   - Allez sur https://vercel.com
   - Connectez-vous avec votre compte GitHub/GitLab

2. **Importez votre projet**
   - Cliquez sur **"Add New Project"**
   - Sélectionnez votre repository
   - Cliquez sur **"Import"**

3. **Configuration du projet**
   - **Framework Preset**: Vite (détecté automatiquement)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (par défaut)
   - **Output Directory**: `dist` (par défaut)
   - **Install Command**: `npm install` (par défaut)

4. **Variables d'environnement**
   
   Cliquez sur **"Environment Variables"** et ajoutez:
   
   ```
   Name: VITE_API_URL
   Value: https://votre-backend.onrender.com/api
   ```
   
   ⚠️ **Important**: Vous devrez d'abord déployer le backend pour obtenir l'URL

5. **Déployez**
   - Cliquez sur **"Deploy"**
   - Attendez 2-3 minutes
   - Votre frontend sera accessible sur: `https://votre-app.vercel.app`

6. **Mise à jour après déploiement du backend**
   - Une fois le backend déployé, retournez sur Vercel
   - Settings → Environment Variables
   - Modifiez `VITE_API_URL` avec l'URL réelle
   - Deployments → Redeploy (bouton avec 3 points)

---

## 🐳 Déploiement Backend sur Render (Docker)

### Prérequis
- Compte Render (https://render.com)
- Code poussé sur GitHub/GitLab/Bitbucket

### Étape 1: Créer la base de données PostgreSQL

1. **Connectez-vous à Render**
   - Allez sur https://render.com
   - Connectez-vous avec votre compte

2. **Créez la base de données**
   - Cliquez sur **"New +"** → **"PostgreSQL"**
   
3. **Configuration**:
   - **Name**: `projet-rdv-db`
   - **Database**: `projet_rdv`
   - **User**: `projet_rdv_user`
   - **Region**: Choisissez la plus proche (ex: Frankfurt, Oregon)
   - **PostgreSQL Version**: 15
   - **Plan**: Free

4. **Créez**
   - Cliquez sur **"Create Database"**
   - Attendez 1-2 minutes

5. **Notez les informations de connexion**
   - Allez dans l'onglet **"Info"**
   - Copiez l'**Internal Database URL** (format: `postgres://user:pass@host/db`)
   - Ou notez séparément: Host, Port, Database, Username, Password

### Étape 2: Générer APP_KEY

Sur votre machine locale:

```bash
cd backend
php artisan key:generate --show
```

Copiez la clé générée (format: `base64:xxxxxxxxxxxxx`)

### Étape 3: Déployer le Backend avec Docker

1. **Créez le Web Service**
   - Cliquez sur **"New +"** → **"Web Service"**
   - Cliquez sur **"Build and deploy from a Git repository"**
   - Connectez votre repository Git

2. **Configuration de base**:
   - **Name**: `projet-rdv-backend`
   - **Region**: **Même région que la base de données**
   - **Branch**: `main` (ou votre branche principale)
   - **Root Directory**: `backend`
   - **Environment**: **Docker**
   - **Dockerfile Path**: `./Dockerfile`

3. **Plan**:
   - **Instance Type**: Free

4. **Variables d'environnement**

   Cliquez sur **"Advanced"** puis ajoutez ces variables:

   ```bash
   # Application
   APP_NAME=ProjetRDV
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=base64:VOTRE_CLE_GENEREE_A_ETAPE_2
   APP_URL=https://votre-backend.onrender.com
   
   # Database (utilisez les valeurs de votre DB Render)
   DB_CONNECTION=pgsql
   DB_HOST=dpg-xxxxx-a.frankfurt-postgres.render.com
   DB_PORT=5432
   DB_DATABASE=projet_rdv
   DB_USERNAME=projet_rdv_user
   DB_PASSWORD=VOTRE_PASSWORD_DB_ICI
   
   # Session & Cache
   SESSION_DRIVER=database
   CACHE_STORE=database
   QUEUE_CONNECTION=database
   
   # Logs
   LOG_CHANNEL=errorlog
   LOG_LEVEL=error
   
   # CORS - URL de votre frontend Vercel
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
   
   # Sanctum (si utilisé)
   SANCTUM_STATEFUL_DOMAINS=votre-app.vercel.app
   ```

5. **Créez le service**
   - Cliquez sur **"Create Web Service"**
   - Le build Docker prendra 5-10 minutes
   - Surveillez les logs en temps réel

6. **Vérifiez le déploiement**
   
   Une fois déployé, testez:
   ```bash
   curl https://votre-backend.onrender.com/up
   ```
   
   Devrait retourner: `{"status":"ok"}`

### Étape 4: Mettre à jour le Frontend

1. Retournez sur **Vercel Dashboard**
2. Allez dans votre projet → **Settings** → **Environment Variables**
3. Modifiez `VITE_API_URL`:
   ```
   VITE_API_URL=https://votre-backend.onrender.com/api
   ```
4. Allez dans **Deployments**
5. Cliquez sur les 3 points du dernier déploiement → **Redeploy**

---

## 🧪 Test Local

### Backend avec Docker + Frontend natif

1. **Lancez le backend et la DB avec Docker**:
   ```bash
   # Générez APP_KEY
   cd backend
   php artisan key:generate --show
   
   # Modifiez docker-compose.yml avec votre clé
   
   # Lancez
   docker-compose up -d
   ```

2. **Lancez le frontend en mode dev**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Accédez à l'application**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000
   - Database: localhost:5432

4. **Arrêtez les services**:
   ```bash
   # Backend
   docker-compose down
   
   # Frontend (Ctrl+C dans le terminal)
   ```

---

## 📁 Structure des fichiers

```
Projet_RDV/
├── backend/
│   ├── Dockerfile                 # ✅ Image Docker backend
│   ├── .dockerignore             # ✅ Optimisation build
│   ├── docker/
│   │   ├── nginx.conf            # ✅ Config Nginx
│   │   ├── supervisord.conf      # ✅ Gestion processus
│   │   └── entrypoint.sh         # ✅ Script démarrage
│   ├── render.yaml               # ✅ Config Render
│   └── ...
│
├── frontend/
│   ├── vercel.json               # ✅ Config Vercel
│   ├── .env.example              # ✅ Variables d'env
│   ├── .env.production           # ✅ Variables production
│   └── ...
│
└── docker-compose.yml            # ✅ Dev local (backend only)
```

---

## 🔍 Vérification du déploiement

### Backend

```bash
# Test de santé
curl https://votre-backend.onrender.com/up

# Test API
curl https://votre-backend.onrender.com/api/health
```

### Frontend

1. Ouvrez `https://votre-app.vercel.app`
2. Ouvrez la console développeur (F12)
3. Vérifiez qu'il n'y a pas d'erreurs CORS
4. Testez une fonctionnalité (login, inscription, etc.)

---

## 🔧 Dépannage

### Erreur CORS sur le frontend

**Symptôme**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Vérifiez que `FRONTEND_URL` est correctement défini dans Render
2. Vérifiez que l'URL correspond exactement (avec/sans www, https)
3. Redéployez le backend après modification

### Backend ne démarre pas

**Symptôme**: Service en erreur sur Render

**Solutions**:
1. Vérifiez les logs: Dashboard → Logs
2. Vérifiez `APP_KEY` est défini
3. Vérifiez les credentials de la base de données
4. Accédez au Shell Render:
   ```bash
   php artisan config:clear
   php artisan migrate:status
   ```

### Frontend ne se connecte pas au backend

**Symptôme**: Erreurs réseau dans la console

**Solutions**:
1. Vérifiez `VITE_API_URL` dans Vercel
2. Format correct: `https://backend.onrender.com/api` (avec `/api`)
3. Testez l'URL backend directement dans le navigateur
4. Redéployez le frontend après modification

### Migrations ne s'exécutent pas

**Solution**:
```bash
# Via Render Shell
php artisan migrate:fresh --force
php artisan db:seed --force
```

### Build Docker échoue

**Solutions**:
1. Vérifiez les logs de build sur Render
2. Vérifiez que tous les fichiers Docker sont présents
3. Vérifiez les permissions de `entrypoint.sh`:
   ```bash
   chmod +x docker/entrypoint.sh
   git add docker/entrypoint.sh
   git commit -m "Fix permissions"
   ```

---

## 🔐 Sécurité en Production

### Checklist

- [ ] `APP_DEBUG=false` sur le backend
- [ ] `APP_KEY` unique et sécurisée
- [ ] Credentials DB sécurisés (pas dans le code)
- [ ] CORS configuré avec l'URL exacte du frontend
- [ ] HTTPS activé (automatique sur Vercel et Render)
- [ ] Variables sensibles dans les env variables (pas dans le code)
- [ ] `.env` dans `.gitignore`

### Bonnes pratiques

1. **Ne commitez jamais**:
   - `.env`
   - Credentials
   - Clés API
   - Secrets

2. **Utilisez les variables d'environnement** pour:
   - APP_KEY
   - Database credentials
   - API keys (FedaPay, Mail, etc.)
   - URLs

3. **Activez les logs d'erreur** uniquement en développement

---

## 📊 Monitoring

### Render

- **Dashboard**: Métriques CPU, RAM, Bandwidth
- **Logs**: Temps réel et historique
- **Alerts**: Configurez des alertes email

### Vercel

- **Analytics**: Trafic, performance
- **Logs**: Logs de build et runtime
- **Speed Insights**: Performance du frontend

---

## 🚀 Optimisations

### Backend

1. **Cache Laravel** (déjà fait dans Docker):
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

2. **OPcache PHP**: Activé dans l'image Docker

3. **Database indexing**: Ajoutez des index sur les colonnes fréquemment requêtées

### Frontend

1. **Code splitting**: Automatique avec Vite
2. **Lazy loading**: Chargez les composants à la demande
3. **Image optimization**: Utilisez des formats modernes (WebP)
4. **CDN**: Automatique sur Vercel

---

## ✅ Checklist finale

### Préparation
- [ ] Code poussé sur Git (GitHub/GitLab)
- [ ] APP_KEY générée localement
- [ ] Variables d'environnement préparées

### Backend (Render)
- [ ] Base de données PostgreSQL créée
- [ ] Credentials DB notés
- [ ] Web Service Docker créé
- [ ] Toutes les variables d'environnement configurées
- [ ] Build réussi (5-10 min)
- [ ] Migrations exécutées automatiquement
- [ ] Endpoint `/up` répond avec succès

### Frontend (Vercel)
- [ ] Projet importé depuis Git
- [ ] Root Directory = `frontend`
- [ ] `VITE_API_URL` configurée avec l'URL backend
- [ ] Build réussi (2-3 min)
- [ ] Application accessible
- [ ] Pas d'erreurs CORS dans la console

### Tests
- [ ] Login/Inscription fonctionne
- [ ] API répond correctement
- [ ] Pas d'erreurs dans les logs
- [ ] Performance acceptable

---

## 🌐 Domaines personnalisés (Optionnel)

### Vercel

1. Settings → Domains → Add Domain
2. Entrez votre domaine: `www.monapp.com`
3. Configurez les DNS selon les instructions
4. Attendez la propagation (quelques minutes à 48h)

### Render

1. Settings → Custom Domain
2. Ajoutez votre domaine: `api.monapp.com`
3. Configurez les enregistrements DNS:
   - Type: CNAME
   - Name: api
   - Value: votre-app.onrender.com
4. Attendez la validation

### Mise à jour après domaine personnalisé

1. **Backend**: Modifiez `FRONTEND_URL` avec le nouveau domaine
2. **Frontend**: Modifiez `VITE_API_URL` avec le nouveau domaine API
3. Redéployez les deux services

---

## 💡 Conseils Pro

1. **Utilisez des branches**:
   - `main` → Production
   - `develop` → Staging
   - Configurez des environnements séparés sur Render/Vercel

2. **Automatisez les déploiements**:
   - Vercel et Render déploient automatiquement à chaque push
   - Configurez des webhooks si nécessaire

3. **Surveillez les coûts**:
   - Plan Free Render: 750h/mois
   - Le service s'endort après 15 min d'inactivité
   - Premier démarrage peut prendre 30-60 secondes

4. **Backups**:
   - Render fait des backups automatiques de la DB (plan payant)
   - Exportez manuellement régulièrement en Free tier

5. **Logs**:
   - Consultez régulièrement les logs
   - Configurez des alertes pour les erreurs critiques

---

## 📞 Ressources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Docker Docs**: https://docs.docker.com
- **Laravel Docs**: https://laravel.com/docs
- **Vite Docs**: https://vitejs.dev

---

## 🎯 Prochaines étapes

1. ✅ Déploiement réussi
2. 🔧 Configurez un service d'email professionnel (SendGrid, Mailgun)
3. 📊 Ajoutez un monitoring (Sentry pour les erreurs)
4. 🔒 Configurez des backups automatiques
5. 🌐 Ajoutez un domaine personnalisé
6. 🚀 Optimisez les performances
7. 📈 Configurez Google Analytics
8. 🔐 Ajoutez un WAF (Web Application Firewall)

---

Bon déploiement ! 🚀
