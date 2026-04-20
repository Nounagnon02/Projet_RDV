# ⚡ ACTION IMMÉDIATE - Corriger l'URL Backend

## 🔴 Problème actuel

Votre frontend utilise : `https://votre-backend.onrender.com/api`
Cette URL n'existe pas → Erreur 404 et CORS

## ✅ ÉTAPE PAR ÉTAPE - À faire MAINTENANT

### 1️⃣ Quelle est votre VRAIE URL backend ?

**Option A : Vous avez déjà déployé le backend sur Render**

1. Allez sur https://render.com/dashboard
2. Trouvez votre service backend
3. Copiez l'URL (ex: `https://projet-rdv-backend-xyz.onrender.com`)
4. Testez qu'elle fonctionne:
   ```bash
   curl https://VOTRE-URL.onrender.com/up
   ```
   Doit retourner: `{"status":"ok"}`

**Option B : Vous n'avez PAS encore déployé le backend**

→ Vous devez d'abord déployer le backend. Suivez ces étapes:

1. **Créer la base de données PostgreSQL sur Render**
   - https://render.com → New + → PostgreSQL
   - Name: `projet-rdv-db`
   - Plan: Free
   - Create Database
   - Notez les credentials (Host, Port, Database, Username, Password)

2. **Générer APP_KEY**
   ```bash
   cd backend
   php artisan key:generate --show
   # Copiez la clé générée
   ```

3. **Créer le Web Service sur Render**
   - New + → Web Service
   - Connectez votre repository Git
   - Name: `projet-rdv-backend`
   - Root Directory: `backend`
   - Environment: **Docker**
   - Dockerfile Path: `./Dockerfile`
   - Plan: Free

4. **Ajouter les variables d'environnement** (cliquez sur Advanced):
   ```
   APP_KEY=base64:VOTRE_CLE_GENEREE
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://projet-rdv-backend-xyz.onrender.com
   
   DB_CONNECTION=pgsql
   DB_HOST=dpg-xxx.render.com
   DB_PORT=5432
   DB_DATABASE=projet_rdv
   DB_USERNAME=projet_rdv_user
   DB_PASSWORD=VOTRE_PASSWORD_DB
   
   SESSION_DRIVER=database
   CACHE_STORE=database
   LOG_CHANNEL=errorlog
   
   FRONTEND_URL=https://projet-rdv.vercel.app
   ```

5. **Create Web Service** → Attendez 5-10 minutes

6. **Testez**:
   ```bash
   curl https://VOTRE-URL.onrender.com/up
   ```

### 2️⃣ Configurer Vercel avec la VRAIE URL

1. Allez sur https://vercel.com/dashboard
2. Cliquez sur votre projet `projet-rdv`
3. **Settings** → **Environment Variables**

4. **Supprimez** l'ancienne variable `VITE_API_URL`

5. **Créez une nouvelle** variable:
   ```
   Name: VITE_API_URL
   Value: https://VOTRE-VRAIE-URL.onrender.com/api
   ```
   ⚠️ Remplacez `VOTRE-VRAIE-URL` par votre URL Render réelle
   ⚠️ N'oubliez pas `/api` à la fin

6. Cochez: **Production**, **Preview**, **Development**

7. Cliquez sur **Save**

### 3️⃣ Forcer un nouveau build Vercel

**Méthode 1 : Via Vercel Dashboard**

1. Allez dans **Deployments**
2. Trouvez le dernier déploiement
3. Cliquez sur les **3 points (⋯)**
4. Cliquez sur **Redeploy**
5. ⚠️ **IMPORTANT** : Cliquez sur **"Redeploy"** (pas "Use existing Build Cache")
6. Attendez 2-3 minutes

**Méthode 2 : Via Git (Plus sûr)**

```bash
cd frontend

# Commit vide pour forcer le rebuild
git commit --allow-empty -m "Force rebuild with correct backend URL"
git push

# Vercel va automatiquement redéployer
```

### 4️⃣ Vérifier que ça fonctionne

1. **Attendez que le déploiement soit terminé** (Status: Ready)

2. **Videz le cache du navigateur**:
   - Chrome: Ctrl+Shift+Delete → Cocher "Images et fichiers en cache"
   - Ou ouvrez en **navigation privée**

3. **Ouvrez votre app**: https://projet-rdv.vercel.app

4. **Ouvrez la console** (F12)

5. **Tapez**:
   ```javascript
   console.log(import.meta.env.VITE_API_URL)
   ```

6. **Vérifiez** que ça affiche votre vraie URL, PAS `https://votre-backend.onrender.com`

7. **Vérifiez les requêtes**:
   - F12 → Onglet **Network**
   - Rechargez la page
   - Cliquez sur une requête API
   - Vérifiez que l'URL est correcte

---

## 🎯 Résultat attendu

### Avant (❌)
```
Request URL: https://votre-backend.onrender.com/api/site-settings
Status: 404 (Not Found)
Error: CORS header missing
```

### Après (✅)
```
Request URL: https://projet-rdv-backend-xyz.onrender.com/api/site-settings
Status: 200 (OK)
Response: { ... données ... }
```

---

## 🐛 Si ça ne marche toujours pas

### Problème 1: Vous voyez toujours l'ancienne URL

**Cause**: Le build cache n'a pas été vidé

**Solution**:
1. Vercel → Settings → Environment Variables
2. Modifiez `VITE_API_URL` (ajoutez un espace puis supprimez-le)
3. Save
4. Deployments → Redeploy → **Décochez "Use existing Build Cache"**

### Problème 2: Le backend retourne 404

**Cause**: Le backend n'est pas déployé ou les routes n'existent pas

**Solution**:
```bash
# Testez le backend
curl https://VOTRE-URL.onrender.com/up

# Si 404, le backend n'est pas déployé correctement
# Vérifiez les logs sur Render Dashboard
```

### Problème 3: Erreur CORS même avec la bonne URL

**Cause**: `FRONTEND_URL` mal configuré sur le backend

**Solution**:
1. Render Dashboard → Votre backend → Environment
2. Vérifiez `FRONTEND_URL=https://projet-rdv.vercel.app`
3. Doit être EXACTEMENT l'URL Vercel (sans slash à la fin)
4. Si modifié, redéployez le backend

---

## 📋 Checklist finale

- [ ] Backend déployé sur Render
- [ ] Backend répond sur `/up` (testez avec curl)
- [ ] URL backend notée (ex: `https://xxx.onrender.com`)
- [ ] `VITE_API_URL` configurée sur Vercel avec `/api` à la fin
- [ ] Ancienne variable supprimée et recréée
- [ ] Frontend redéployé SANS cache
- [ ] Déploiement terminé (Status: Ready)
- [ ] Cache navigateur vidé
- [ ] Test dans la console: `import.meta.env.VITE_API_URL` affiche la bonne URL
- [ ] Test dans Network: Request URL correcte
- [ ] Pas d'erreurs CORS
- [ ] Les données se chargent

---

## 💡 Astuce : Test local rapide

Pour vérifier que votre backend fonctionne avant de configurer Vercel:

```bash
cd frontend

# Créez un fichier .env.local (ignoré par git)
echo "VITE_API_URL=https://VOTRE-URL.onrender.com/api" > .env.local

# Lancez en local
npm run dev

# Ouvrez http://localhost:5173
# Si ça marche en local, ça marchera sur Vercel
```

---

## 🆘 Besoin d'aide ?

**Partagez ces informations**:

1. Votre URL backend Render (ex: `https://xxx.onrender.com`)
2. Votre URL frontend Vercel (ex: `https://xxx.vercel.app`)
3. Résultat de: `curl https://VOTRE-BACKEND.onrender.com/up`
4. Screenshot de Vercel → Settings → Environment Variables
5. Screenshot de la console (F12) avec l'erreur

---

## ⚡ Résumé ultra-rapide

```bash
# 1. Trouvez votre URL backend Render
# 2. Vercel → Settings → Environment Variables
#    Supprimez et recréez VITE_API_URL avec la vraie URL + /api
# 3. Deployments → Redeploy (sans cache)
# 4. Attendez 2-3 min
# 5. Videz cache navigateur
# 6. Testez
```

**La clé**: Vous DEVEZ utiliser votre vraie URL Render, pas `https://votre-backend.onrender.com` qui est juste un exemple !
