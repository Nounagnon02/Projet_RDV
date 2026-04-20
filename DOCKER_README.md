# 🐳 Déploiement Docker - Guide Rapide

## 📦 Fichiers créés

### Backend
- ✅ `backend/Dockerfile` - Image Docker Laravel + PHP-FPM + Nginx
- ✅ `backend/.dockerignore` - Fichiers à exclure
- ✅ `backend/docker/nginx.conf` - Configuration Nginx
- ✅ `backend/docker/supervisord.conf` - Gestion des processus
- ✅ `backend/docker/entrypoint.sh` - Script de démarrage
- ✅ `backend/render.yaml` - Configuration Render (Docker)

### Frontend
- ✅ `frontend/Dockerfile` - Image Docker React + Nginx
- ✅ `frontend/.dockerignore` - Fichiers à exclure
- ✅ `frontend/docker/nginx.conf` - Configuration Nginx
- ✅ `frontend/vercel.json` - Configuration Vercel (alternative)

### Développement local
- ✅ `docker-compose.yml` - Orchestration complète (Backend + Frontend + DB)

---

## 🚀 Déploiement en 5 étapes

### 1️⃣ Générez APP_KEY
```bash
cd backend
php artisan key:generate --show
```

### 2️⃣ Créez la base de données sur Render
- Allez sur https://render.com
- New + → PostgreSQL
- Notez les credentials

### 3️⃣ Déployez le Backend (Render)
- New + → Web Service
- Environment: **Docker**
- Root Directory: `backend`
- Dockerfile Path: `./Dockerfile`
- Ajoutez les variables d'environnement (voir guide)

### 4️⃣ Déployez le Frontend (Vercel)
- Allez sur https://vercel.com
- Import Project
- Root Directory: `frontend`
- Variable: `VITE_API_URL=https://votre-backend.onrender.com/api`

### 5️⃣ Testez
```bash
# Backend
curl https://votre-backend.onrender.com/up

# Frontend
# Ouvrez https://votre-app.vercel.app
```

---

## 🧪 Test Local avec Docker Compose

```bash
# 1. Modifiez docker-compose.yml avec votre APP_KEY
# 2. Lancez tout
docker-compose up -d

# 3. Accédez à l'app
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# Database: localhost:5432

# 4. Voir les logs
docker-compose logs -f

# 5. Arrêtez tout
docker-compose down
```

---

## 📖 Documentation complète

Consultez **DOCKER_DEPLOYMENT_GUIDE.md** pour:
- Instructions détaillées étape par étape
- Configuration des variables d'environnement
- Dépannage et résolution de problèmes
- Optimisations et bonnes pratiques
- Monitoring et sécurité

---

## 🔧 Commandes utiles

```bash
# Build backend
docker build -t backend ./backend

# Build frontend avec variable
docker build --build-arg VITE_API_URL=https://api.com/api -t frontend ./frontend

# Run backend
docker run -p 8000:80 backend

# Run frontend
docker run -p 5173:80 frontend

# Accéder au shell
docker exec -it <container_id> bash
```

---

## ✅ Checklist

- [ ] APP_KEY générée
- [ ] Base de données PostgreSQL créée (Render)
- [ ] Backend déployé avec Docker (Render)
- [ ] Variables d'environnement configurées
- [ ] Frontend déployé (Vercel)
- [ ] VITE_API_URL configurée
- [ ] Tests de connexion réussis

---

## 🆘 Problèmes courants

### Backend ne démarre pas
→ Vérifiez APP_KEY et credentials DB dans les variables d'environnement

### Erreur CORS
→ Vérifiez FRONTEND_URL dans le backend

### Build frontend échoue
→ Vérifiez que VITE_API_URL est bien définie

---

## 📞 Support

- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Docker: https://docs.docker.com
