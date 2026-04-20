# 🚀 Déploiement Rapide

## Architecture
- **Frontend**: React + Vite → **Vercel** (natif, sans Docker)
- **Backend**: Laravel → **Render** (avec Docker)
- **Database**: PostgreSQL → **Render**

---

## ⚡ Déploiement en 4 étapes

### 1️⃣ Générez APP_KEY
```bash
cd backend
php artisan key:generate --show
# Copiez la clé générée
```

### 2️⃣ Backend sur Render (Docker)

1. Créez compte sur https://render.com
2. **New + → PostgreSQL**
   - Name: `projet-rdv-db`
   - Plan: Free
   - Notez les credentials

3. **New + → Web Service**
   - Repository: Votre repo Git
   - Root Directory: `backend`
   - Environment: **Docker**
   - Dockerfile Path: `./Dockerfile`
   - Plan: Free

4. **Variables d'environnement** (Advanced):
   ```bash
   APP_KEY=base64:VOTRE_CLE_ETAPE_1
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://votre-backend.onrender.com
   
   DB_CONNECTION=pgsql
   DB_HOST=dpg-xxx.render.com
   DB_PORT=5432
   DB_DATABASE=projet_rdv
   DB_USERNAME=projet_rdv_user
   DB_PASSWORD=VOTRE_PASSWORD_DB
   
   SESSION_DRIVER=database
   CACHE_STORE=database
   LOG_CHANNEL=errorlog
   
   FRONTEND_URL=https://votre-app.vercel.app
   ```

5. **Create Web Service** → Attendez 5-10 min

### 3️⃣ Frontend sur Vercel (Sans Docker)

1. Créez compte sur https://vercel.com
2. **Add New Project**
3. Importez votre repository
4. Configuration:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Environment Variables**:
   ```
   VITE_API_URL=https://votre-backend.onrender.com/api
   ```

6. **Deploy** → Attendez 2-3 min

### 4️⃣ Mise à jour finale

1. **Vercel**: Modifiez `VITE_API_URL` avec l'URL réelle du backend
2. **Render**: Modifiez `FRONTEND_URL` avec l'URL réelle de Vercel
3. Redéployez les deux

---

## ✅ Test

```bash
# Backend
curl https://votre-backend.onrender.com/up

# Frontend
# Ouvrez https://votre-app.vercel.app
```

---

## 🧪 Test Local

```bash
# Backend (Docker)
docker-compose up -d

# Frontend (natif)
cd frontend
npm install
npm run dev

# Accès:
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
```

---

## 📖 Documentation complète

Consultez **DEPLOYMENT_GUIDE_FINAL.md** pour:
- Instructions détaillées
- Dépannage
- Optimisations
- Sécurité

---

## 🆘 Problèmes courants

### Erreur CORS
→ Vérifiez `FRONTEND_URL` dans Render = URL exacte Vercel

### Backend ne démarre pas
→ Vérifiez `APP_KEY` et credentials DB

### Frontend ne se connecte pas
→ Vérifiez `VITE_API_URL` dans Vercel avec `/api` à la fin

---

## 📦 Fichiers créés

### Backend (Docker)
- ✅ `backend/Dockerfile`
- ✅ `backend/docker/nginx.conf`
- ✅ `backend/docker/supervisord.conf`
- ✅ `backend/docker/entrypoint.sh`
- ✅ `backend/render.yaml`

### Frontend (Vercel natif)
- ✅ `frontend/vercel.json`
- ✅ `frontend/.env.example`
- ✅ `frontend/.env.production`

### Dev local
- ✅ `docker-compose.yml` (backend + DB uniquement)

---

Bon déploiement ! 🎉
