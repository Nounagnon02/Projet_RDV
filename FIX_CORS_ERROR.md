# 🔧 Résolution du problème CORS - Configuration URL Backend

## ❌ Problème actuel

Votre frontend utilise l'URL d'exemple : `https://votre-backend.onrender.com/api`

Erreurs:
- Status code: 404 (l'URL n'existe pas)
- CORS header missing (car le serveur n'existe pas)

## ✅ Solution : Configurer la vraie URL backend

### Option 1: Vous avez déjà déployé le backend sur Render

#### Étape 1: Trouvez votre URL backend Render

1. Allez sur https://render.com/dashboard
2. Cliquez sur votre service backend
3. En haut, vous verrez l'URL : `https://VOTRE-NOM-SERVICE.onrender.com`
4. Copiez cette URL complète

#### Étape 2: Configurez Vercel

1. Allez sur https://vercel.com/dashboard
2. Cliquez sur votre projet frontend
3. Allez dans **Settings** → **Environment Variables**
4. Trouvez `VITE_API_URL` et cliquez sur **Edit**
5. Remplacez par votre vraie URL + `/api`:
   ```
   https://VOTRE-NOM-SERVICE.onrender.com/api
   ```
   Exemple: `https://projet-rdv-backend-abc123.onrender.com/api`

6. Cliquez sur **Save**

#### Étape 3: Redéployez le frontend

1. Allez dans **Deployments**
2. Cliquez sur les 3 points du dernier déploiement
3. Cliquez sur **Redeploy**
4. Attendez 2-3 minutes

#### Étape 4: Vérifiez

1. Ouvrez votre app Vercel
2. Ouvrez la console (F12)
3. Les erreurs CORS devraient disparaître

---

### Option 2: Vous n'avez PAS encore déployé le backend

Vous devez d'abord déployer le backend sur Render avant de pouvoir configurer le frontend.

#### Étape 1: Déployez le backend sur Render

Suivez le guide complet dans **DEPLOYMENT_GUIDE_FINAL.md**, section "Déploiement Backend sur Render"

Résumé rapide:

1. **Créez la base de données PostgreSQL**
   - New + → PostgreSQL
   - Name: `projet-rdv-db`
   - Plan: Free
   - Notez les credentials

2. **Générez APP_KEY**
   ```bash
   cd backend
   php artisan key:generate --show
   ```

3. **Créez le Web Service**
   - New + → Web Service
   - Repository: Votre repo Git
   - Root Directory: `backend`
   - Environment: **Docker**
   - Dockerfile Path: `./Dockerfile`

4. **Configurez les variables d'environnement**
   ```bash
   APP_KEY=base64:VOTRE_CLE_GENEREE
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://VOTRE-SERVICE.onrender.com
   
   DB_CONNECTION=pgsql
   DB_HOST=dpg-xxx.render.com
   DB_PORT=5432
   DB_DATABASE=projet_rdv
   DB_USERNAME=projet_rdv_user
   DB_PASSWORD=VOTRE_PASSWORD_DB
   
   SESSION_DRIVER=database
   CACHE_STORE=database
   LOG_CHANNEL=errorlog
   
   FRONTEND_URL=https://VOTRE-APP.vercel.app
   ```

5. **Create Web Service** et attendez le déploiement (5-10 min)

6. **Testez le backend**
   ```bash
   curl https://VOTRE-SERVICE.onrender.com/up
   ```
   Devrait retourner: `{"status":"ok"}`

#### Étape 2: Configurez le frontend avec la vraie URL

Suivez les étapes de l'Option 1 ci-dessus.

---

## 🔍 Vérification de la configuration

### 1. Vérifiez l'URL backend dans Vercel

1. Vercel Dashboard → Votre projet → Settings → Environment Variables
2. `VITE_API_URL` doit être: `https://VOTRE-SERVICE.onrender.com/api`
3. **Important**: Doit se terminer par `/api`

### 2. Vérifiez que le backend répond

```bash
# Remplacez par votre vraie URL
curl https://VOTRE-SERVICE.onrender.com/up

# Devrait retourner:
{"status":"ok"}
```

### 3. Vérifiez CORS sur le backend

1. Render Dashboard → Votre service → Environment
2. Vérifiez que `FRONTEND_URL` = votre URL Vercel exacte
3. Format: `https://votre-app.vercel.app` (sans slash à la fin)

### 4. Testez une requête API

```bash
# Remplacez par vos vraies URLs
curl -H "Origin: https://votre-app.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://VOTRE-SERVICE.onrender.com/api/site-settings
```

Devrait retourner des headers CORS:
```
Access-Control-Allow-Origin: https://votre-app.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

---

## 🐛 Dépannage supplémentaire

### Erreur persiste après redéploiement

1. **Videz le cache du navigateur**
   - Chrome: Ctrl+Shift+Delete → Cocher "Cached images and files"
   - Ou mode navigation privée

2. **Vérifiez que le redéploiement a bien pris en compte la variable**
   - Vercel → Deployments → Dernier déploiement → View Function Logs
   - Cherchez `VITE_API_URL` dans les logs de build

3. **Vérifiez dans le code source du frontend déployé**
   - Ouvrez votre app Vercel
   - F12 → Network → Rechargez la page
   - Cliquez sur une requête API
   - Vérifiez l'URL dans l'onglet Headers

### Backend retourne 404 sur les routes API

1. **Vérifiez que les routes existent**
   ```bash
   # Via Render Shell
   php artisan route:list
   ```

2. **Vérifiez les migrations**
   ```bash
   # Via Render Shell
   php artisan migrate:status
   ```

3. **Vérifiez les logs backend**
   - Render Dashboard → Logs
   - Cherchez les erreurs

### CORS persiste même avec la bonne URL

1. **Vérifiez le fichier config/cors.php**
   ```php
   'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
   ```

2. **Vérifiez que le middleware CORS est actif**
   - Fichier: `backend/bootstrap/app.php`
   - Doit contenir:
   ```php
   ->withMiddleware(function (Middleware $middleware): void {
       $middleware->api(prepend: [
           \Illuminate\Http\Middleware\HandleCors::class,
       ]);
   })
   ```

3. **Redéployez le backend après modification**

---

## 📋 Checklist de résolution

- [ ] Backend déployé sur Render
- [ ] Backend répond sur `/up` endpoint
- [ ] URL backend notée (format: `https://xxx.onrender.com`)
- [ ] `VITE_API_URL` configurée sur Vercel avec `/api` à la fin
- [ ] `FRONTEND_URL` configurée sur Render (URL Vercel exacte)
- [ ] Frontend redéployé après modification
- [ ] Cache navigateur vidé
- [ ] Pas d'erreurs CORS dans la console
- [ ] Requêtes API fonctionnent

---

## 🎯 URLs à vérifier

### Frontend (Vercel)
```
URL de l'app: https://VOTRE-APP.vercel.app
Variable VITE_API_URL: https://VOTRE-BACKEND.onrender.com/api
```

### Backend (Render)
```
URL du service: https://VOTRE-BACKEND.onrender.com
Variable FRONTEND_URL: https://VOTRE-APP.vercel.app
Variable APP_URL: https://VOTRE-BACKEND.onrender.com
```

---

## 💡 Astuce : Test local pour vérifier

Si vous voulez tester localement avant de redéployer:

```bash
# Frontend
cd frontend
echo "VITE_API_URL=https://VOTRE-BACKEND.onrender.com/api" > .env.local
npm run dev

# Ouvrez http://localhost:5173
# Vérifiez si les requêtes passent
```

---

## 📞 Besoin d'aide ?

Si le problème persiste:

1. Partagez vos URLs réelles (backend et frontend)
2. Partagez les logs d'erreur complets
3. Vérifiez que le backend est bien déployé et accessible
4. Vérifiez que toutes les variables d'environnement sont correctes

---

**Note importante**: L'URL `https://votre-backend.onrender.com` est juste un exemple. Vous DEVEZ la remplacer par votre vraie URL Render qui ressemble à `https://projet-rdv-backend-abc123.onrender.com`
