# Guide de Déploiement - Projet RDV

## 🚀 Déploiement Frontend sur Vercel

### Prérequis
- Compte Vercel (https://vercel.com)
- Code poussé sur GitHub/GitLab/Bitbucket

### Étapes de déploiement

1. **Connectez-vous à Vercel**
   - Allez sur https://vercel.com
   - Connectez-vous avec votre compte GitHub/GitLab

2. **Importez votre projet**
   - Cliquez sur "Add New Project"
   - Sélectionnez votre repository
   - Choisissez le dossier `frontend`

3. **Configuration du projet**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Variables d'environnement**
   Ajoutez cette variable dans les settings Vercel:
   ```
   VITE_API_URL=https://votre-backend.onrender.com/api
   ```
   ⚠️ Remplacez par l'URL réelle de votre backend Render après déploiement

5. **Déployez**
   - Cliquez sur "Deploy"
   - Attendez la fin du build (2-3 minutes)
   - Votre frontend sera accessible sur: `https://votre-app.vercel.app`

---

## 🔧 Déploiement Backend sur Render

### Prérequis
- Compte Render (https://render.com)
- Code poussé sur GitHub/GitLab

### Étapes de déploiement

1. **Connectez-vous à Render**
   - Allez sur https://render.com
   - Connectez-vous avec votre compte GitHub/GitLab

2. **Créez une base de données PostgreSQL**
   - Cliquez sur "New +" → "PostgreSQL"
   - Name: `projet-rdv-db`
   - Database: `projet_rdv`
   - User: `projet_rdv_user`
   - Region: Choisissez la plus proche
   - Plan: Free
   - Cliquez sur "Create Database"
   - **Notez les informations de connexion** (Internal Database URL)

3. **Créez le Web Service**
   - Cliquez sur "New +" → "Web Service"
   - Connectez votre repository
   - Name: `projet-rdv-backend`
   - Region: Même région que la DB
   - Root Directory: `backend`
   - Runtime: PHP
   - Build Command: `./build.sh`
   - Start Command: `php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT`

4. **Variables d'environnement**
   Ajoutez ces variables dans l'onglet "Environment":

   ```bash
   APP_NAME=ProjetRDV
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://votre-backend.onrender.com
   
   # Générez une clé avec: php artisan key:generate --show
   APP_KEY=base64:VOTRE_CLE_GENEREE_ICI
   
   # Database (copiez depuis votre DB Render)
   DB_CONNECTION=pgsql
   DB_HOST=dpg-xxxxx.oregon-postgres.render.com
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
   
   # CORS - URL de votre frontend Vercel
   FRONTEND_URL=https://votre-app.vercel.app
   
   # Mail (configurez selon votre service)
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.mailtrap.io
   MAIL_PORT=2525
   MAIL_USERNAME=votre_username
   MAIL_PASSWORD=votre_password
   MAIL_FROM_ADDRESS=noreply@votreapp.com
   MAIL_FROM_NAME="${APP_NAME}"
   
   # FedaPay (si utilisé)
   FEDAPAY_MODE=sandbox
   FEDAPAY_PUBLIC_KEY=votre_public_key
   FEDAPAY_SECRET_KEY=votre_secret_key
   ```

5. **Déployez**
   - Cliquez sur "Create Web Service"
   - Le build prendra 5-10 minutes
   - Votre backend sera accessible sur: `https://votre-backend.onrender.com`

---

## 🔄 Mise à jour de la configuration Frontend

Une fois le backend déployé, retournez sur Vercel:

1. Allez dans Settings → Environment Variables
2. Modifiez `VITE_API_URL` avec l'URL réelle de Render:
   ```
   VITE_API_URL=https://votre-backend.onrender.com/api
   ```
3. Redéployez le frontend (Deployments → Redeploy)

---

## ✅ Vérification du déploiement

### Backend
```bash
# Testez l'API
curl https://votre-backend.onrender.com/api/health

# Vérifiez les logs sur Render Dashboard
```

### Frontend
- Ouvrez `https://votre-app.vercel.app`
- Vérifiez que l'application charge correctement
- Testez une requête API (login, inscription, etc.)

---

## 🔒 Configuration de sécurité supplémentaire

### Backend Laravel

1. **Ajoutez le domaine Vercel aux origines CORS autorisées**
   Le fichier `config/cors.php` est déjà configuré pour utiliser `FRONTEND_URL`

2. **Configurez Sanctum** (si utilisé)
   Dans `config/sanctum.php`, ajoutez:
   ```php
   'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,127.0.0.1,votre-app.vercel.app')),
   ```

3. **Variables d'environnement Render supplémentaires**:
   ```bash
   SANCTUM_STATEFUL_DOMAINS=votre-app.vercel.app
   SESSION_DOMAIN=.onrender.com
   ```

---

## 🐛 Dépannage

### Erreur CORS
- Vérifiez que `FRONTEND_URL` est correctement défini dans Render
- Vérifiez que le middleware CORS est actif dans `bootstrap/app.php`

### Erreur 500 Backend
- Consultez les logs dans Render Dashboard
- Vérifiez que `APP_KEY` est défini
- Vérifiez la connexion à la base de données

### Build Frontend échoue
- Vérifiez que toutes les dépendances sont dans `package.json`
- Vérifiez les logs de build sur Vercel

### Base de données
- Les migrations s'exécutent automatiquement au démarrage
- Pour réinitialiser: `php artisan migrate:fresh --force` (via Render Shell)

---

## 📝 Commandes utiles

### Générer APP_KEY
```bash
cd backend
php artisan key:generate --show
```

### Accéder au Shell Render
- Dashboard Render → Votre service → Shell
- Exécutez des commandes artisan directement

### Logs en temps réel
- Render Dashboard → Logs
- Vercel Dashboard → Deployments → View Function Logs

---

## 🎯 Checklist finale

- [ ] Backend déployé sur Render
- [ ] Base de données PostgreSQL créée et connectée
- [ ] Toutes les variables d'environnement configurées
- [ ] Migrations exécutées avec succès
- [ ] Frontend déployé sur Vercel
- [ ] VITE_API_URL pointe vers le backend Render
- [ ] CORS configuré correctement
- [ ] Tests de connexion API réussis
- [ ] Domaine personnalisé configuré (optionnel)

---

## 🌐 Domaines personnalisés (Optionnel)

### Vercel
- Settings → Domains → Add Domain
- Suivez les instructions DNS

### Render
- Settings → Custom Domain → Add Custom Domain
- Configurez les enregistrements DNS

---

## 💡 Conseils de production

1. **Activez les logs d'erreur** uniquement en développement
2. **Utilisez des secrets** pour les clés sensibles
3. **Configurez un service d'email** professionnel (SendGrid, Mailgun)
4. **Activez HTTPS** (automatique sur Vercel et Render)
5. **Surveillez les performances** via les dashboards
6. **Configurez des alertes** pour les erreurs critiques
7. **Sauvegardez régulièrement** votre base de données

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Laravel Docs: https://laravel.com/docs
