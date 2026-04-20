# 🚀 Déploiement Rapide

## Fichiers créés pour le déploiement

### Frontend (Vercel)
- ✅ `frontend/vercel.json` - Configuration Vercel
- ✅ `frontend/.env.example` - Variables d'environnement exemple
- ✅ `frontend/.env.production` - Variables de production
- ✅ `frontend/src/api/axios.js` - Mis à jour pour utiliser les variables d'env

### Backend (Render)
- ✅ `backend/render.yaml` - Configuration Render (optionnel)
- ✅ `backend/build.sh` - Script de build
- ✅ `backend/Procfile` - Commande de démarrage
- ✅ `backend/config/cors.php` - Configuration CORS
- ✅ `backend/.env.production` - Variables de production
- ✅ `backend/bootstrap/app.php` - Middleware CORS activé

### Scripts utiles
- ✅ `generate-app-key.sh` - Génère la clé APP_KEY

---

## 🎯 Déploiement en 3 étapes

### 1️⃣ Générez votre APP_KEY
```bash
./generate-app-key.sh
```

### 2️⃣ Déployez le Backend sur Render
1. Créez un compte sur https://render.com
2. Créez une base PostgreSQL
3. Créez un Web Service (PHP)
4. Configurez les variables d'environnement (voir DEPLOYMENT_GUIDE.md)
5. Déployez

### 3️⃣ Déployez le Frontend sur Vercel
1. Créez un compte sur https://vercel.com
2. Importez votre projet
3. Sélectionnez le dossier `frontend`
4. Ajoutez la variable `VITE_API_URL` avec l'URL de votre backend Render
5. Déployez

---

## 📖 Documentation complète

Consultez **DEPLOYMENT_GUIDE.md** pour le guide détaillé avec toutes les étapes.

---

## ⚡ Checklist rapide

- [ ] Générer APP_KEY
- [ ] Créer compte Render
- [ ] Créer base de données PostgreSQL sur Render
- [ ] Déployer backend sur Render
- [ ] Configurer toutes les variables d'environnement
- [ ] Créer compte Vercel
- [ ] Déployer frontend sur Vercel
- [ ] Configurer VITE_API_URL sur Vercel
- [ ] Tester l'application

---

## 🆘 Besoin d'aide ?

Consultez la section "Dépannage" dans DEPLOYMENT_GUIDE.md
