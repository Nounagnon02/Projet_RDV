# ⚠️ ERREUR CORS - Solution Rapide

## 🔴 Votre problème

Votre frontend utilise une URL d'exemple qui n'existe pas:
```
https://votre-backend.onrender.com/api
```

## ✅ Solution en 3 étapes

### Étape 1: Trouvez votre vraie URL backend

**Si vous avez déjà déployé le backend:**
1. Allez sur https://render.com/dashboard
2. Cliquez sur votre service backend
3. Copiez l'URL en haut (ex: `https://projet-rdv-backend-xyz.onrender.com`)

**Si vous n'avez PAS encore déployé le backend:**
→ Vous devez d'abord déployer le backend (voir DEPLOYMENT_GUIDE_FINAL.md)

### Étape 2: Configurez Vercel

1. Allez sur https://vercel.com/dashboard
2. Cliquez sur votre projet
3. **Settings** → **Environment Variables**
4. Modifiez `VITE_API_URL`:
   ```
   https://VOTRE-VRAIE-URL.onrender.com/api
   ```
   ⚠️ N'oubliez pas `/api` à la fin !

5. **Save**

### Étape 3: Redéployez

1. **Deployments** → Dernier déploiement → **⋯** → **Redeploy**
2. Attendez 2-3 minutes
3. Testez votre app

---

## 🧪 Test rapide

```bash
# Remplacez par votre vraie URL
curl https://VOTRE-BACKEND.onrender.com/up

# Doit retourner:
{"status":"ok"}
```

---

## 🆘 Toujours des erreurs ?

### Vérifiez aussi sur Render:

1. Render Dashboard → Votre backend → **Environment**
2. Vérifiez `FRONTEND_URL`:
   ```
   https://VOTRE-APP.vercel.app
   ```
3. Si modifié, redéployez le backend aussi

---

## 📖 Documentation complète

Consultez **FIX_CORS_ERROR.md** pour plus de détails et dépannage avancé.
