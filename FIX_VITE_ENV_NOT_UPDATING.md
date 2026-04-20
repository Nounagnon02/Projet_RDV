# 🔧 La variable VITE_API_URL n'est pas prise en compte

## 🔴 Symptôme

Vous avez modifié `VITE_API_URL` sur Vercel mais vous voyez toujours l'ancienne URL dans les erreurs:
```
https://votre-backend.onrender.com/api/...
```

## ⚠️ Cause

Les variables d'environnement Vite sont **compilées au moment du build**, pas au runtime. Si vous modifiez la variable après le build, vous devez **forcer un nouveau build complet**.

## ✅ Solution : Forcer un nouveau build

### Option 1: Redéploiement avec "Clear Cache"

1. Allez sur **Vercel Dashboard**
2. Cliquez sur votre projet
3. Allez dans **Deployments**
4. Cliquez sur les **3 points (⋯)** du dernier déploiement
5. Sélectionnez **"Redeploy"**
6. ⚠️ **IMPORTANT**: Cochez **"Use existing Build Cache"** → **DÉCOCHEZ cette option**
7. Cliquez sur **"Redeploy"**
8. Attendez 2-3 minutes

### Option 2: Nouveau commit (Plus sûr)

```bash
cd frontend

# Créez un commit vide pour forcer le rebuild
git commit --allow-empty -m "Force rebuild with new VITE_API_URL"
git push

# Vercel va automatiquement redéployer avec la nouvelle variable
```

### Option 3: Via les Settings Vercel

1. **Settings** → **Environment Variables**
2. Supprimez complètement `VITE_API_URL`
3. Recréez-la avec la bonne valeur:
   ```
   Name: VITE_API_URL
   Value: https://VOTRE-VRAIE-URL.onrender.com/api
   ```
4. Sélectionnez **Production**, **Preview**, et **Development**
5. **Save**
6. Allez dans **Deployments** → **Redeploy** (sans cache)

---

## 🔍 Vérification que la variable est bien prise en compte

### Méthode 1: Vérifier dans les logs de build

1. **Vercel Dashboard** → **Deployments**
2. Cliquez sur le dernier déploiement
3. Cliquez sur **"Building"** pour voir les logs
4. Cherchez dans les logs:
   ```
   VITE_API_URL=https://VOTRE-URL.onrender.com/api
   ```

### Méthode 2: Vérifier dans le code compilé

1. Ouvrez votre app Vercel dans le navigateur
2. Ouvrez la console (F12)
3. Tapez:
   ```javascript
   console.log(import.meta.env.VITE_API_URL)
   ```
4. Devrait afficher votre vraie URL, pas l'exemple

### Méthode 3: Vérifier dans les requêtes réseau

1. F12 → Onglet **Network**
2. Rechargez la page
3. Cliquez sur une requête API
4. Vérifiez l'URL dans **Headers** → **Request URL**
5. Doit être votre vraie URL backend

---

## 🐛 Si le problème persiste

### 1. Vérifiez que vous avez bien redéployé

- Le timestamp du déploiement doit être APRÈS la modification de la variable
- Vérifiez dans **Deployments** que le statut est **"Ready"**

### 2. Videz le cache du navigateur

```
Chrome/Edge: Ctrl + Shift + Delete
Firefox: Ctrl + Shift + Delete
Safari: Cmd + Option + E

Cochez "Cached images and files"
```

Ou testez en **mode navigation privée**.

### 3. Vérifiez le fichier .env local

Si vous avez un fichier `.env` ou `.env.local` dans votre dossier frontend local:

```bash
cd frontend
cat .env
cat .env.local
```

Si ces fichiers existent et contiennent l'ancienne URL, supprimez-les:
```bash
rm .env .env.local
```

Puis commitez et poussez:
```bash
git add .
git commit -m "Remove local env files"
git push
```

### 4. Vérifiez que le fichier n'est pas commité

```bash
cd frontend
git status

# Si vous voyez .env ou .env.local:
git rm --cached .env .env.local
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
git add .gitignore
git commit -m "Remove env files from git"
git push
```

---

## 📋 Checklist complète

- [ ] Variable `VITE_API_URL` modifiée sur Vercel avec la vraie URL
- [ ] URL se termine par `/api`
- [ ] Redéploiement effectué SANS cache
- [ ] Nouveau déploiement est "Ready"
- [ ] Cache navigateur vidé
- [ ] Vérification dans la console: `import.meta.env.VITE_API_URL`
- [ ] Vérification dans Network: Request URL correcte
- [ ] Pas de fichier .env local qui override
- [ ] Pas de .env commité dans Git

---

## 🎯 Exemple de configuration correcte

### Sur Vercel (Environment Variables)

```
Name: VITE_API_URL
Value: https://projet-rdv-backend-abc123.onrender.com/api
Environments: ✓ Production ✓ Preview ✓ Development
```

### Dans le code (frontend/src/api/axios.js)

```javascript
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    // ...
});
```

### Résultat attendu dans la console

```javascript
console.log(import.meta.env.VITE_API_URL)
// Doit afficher: "https://projet-rdv-backend-abc123.onrender.com/api"
```

---

## 💡 Pourquoi ça ne marche pas immédiatement ?

Vite (le bundler) remplace `import.meta.env.VITE_API_URL` par la valeur réelle **pendant le build**. C'est comme un "chercher-remplacer" dans le code.

Si vous changez la variable APRÈS le build, le code déjà compilé contient toujours l'ancienne valeur.

C'est pourquoi vous devez **forcer un nouveau build complet** après avoir changé la variable.

---

## 🆘 Dernière solution : Déploiement manuel

Si rien ne fonctionne, déployez manuellement depuis votre machine:

```bash
cd frontend

# Installez Vercel CLI
npm install -g vercel

# Connectez-vous
vercel login

# Définissez la variable localement
export VITE_API_URL=https://VOTRE-URL.onrender.com/api

# Déployez
vercel --prod

# Suivez les instructions
```

---

## 📞 Informations à vérifier

Pour vous aider davantage, vérifiez:

1. **Quelle est votre vraie URL backend Render ?**
   - Format: `https://xxxxx.onrender.com`

2. **Quelle est votre URL frontend Vercel ?**
   - Format: `https://xxxxx.vercel.app`

3. **Avez-vous bien déployé le backend sur Render ?**
   - Testez: `curl https://VOTRE-BACKEND.onrender.com/up`

4. **Le backend répond-il ?**
   - Si 404, le problème n'est pas CORS mais que le backend n'existe pas

---

## ⚡ Action immédiate

**Faites ceci maintenant:**

1. Vercel → Settings → Environment Variables
2. Supprimez `VITE_API_URL`
3. Recréez-la avec votre vraie URL
4. Deployments → Redeploy (SANS cache)
5. Attendez que le statut soit "Ready"
6. Ouvrez votre app en navigation privée
7. F12 → Console → Tapez: `console.log(import.meta.env.VITE_API_URL)`
8. Vérifiez que c'est la bonne URL

Si vous voyez toujours l'ancienne URL, le problème vient du build cache ou d'un fichier .env local commité.
