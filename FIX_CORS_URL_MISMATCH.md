# 🔧 Correction CORS - URL Frontend incorrecte

## 🎉 Bonne nouvelle !

Votre backend fonctionne ! Le problème est juste une mauvaise configuration CORS.

## 🔴 Le problème

**URL frontend réelle**: `https://projet-rdv-kp-tech.vercel.app`
**URL configurée sur le backend**: `https://projet-rdv.vercel.app`

Le backend rejette les requêtes car l'URL ne correspond pas exactement.

## ✅ Solution : Mettre à jour FRONTEND_URL sur Render

### Étape 1: Allez sur Render

1. Connectez-vous sur https://render.com/dashboard
2. Cliquez sur votre service backend: `projet-rdv-backend`

### Étape 2: Modifiez la variable d'environnement

1. Cliquez sur **"Environment"** dans le menu de gauche
2. Trouvez la variable `FRONTEND_URL`
3. Cliquez sur **"Edit"** (icône crayon)
4. Remplacez par:
   ```
   https://projet-rdv-kp-tech.vercel.app
   ```
   ⚠️ **IMPORTANT**: Pas de slash `/` à la fin !

5. Cliquez sur **"Save Changes"**

### Étape 3: Redéployez le backend

Render va automatiquement redéployer le service après la modification de la variable.

1. Attendez que le statut passe à **"Live"** (2-3 minutes)
2. Vérifiez dans les logs que le déploiement est terminé

### Étape 4: Testez votre application

1. Videz le cache du navigateur (Ctrl+Shift+Delete)
2. Ouvrez votre app: https://projet-rdv-kp-tech.vercel.app
3. Les erreurs CORS devraient disparaître
4. Les données devraient se charger correctement

---

## 🔍 Vérification

### Test CORS manuel

```bash
curl -H "Origin: https://projet-rdv-kp-tech.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://projet-rdv-backend.onrender.com/api/site-settings -v
```

Devrait retourner:
```
Access-Control-Allow-Origin: https://projet-rdv-kp-tech.vercel.app
```

---

## 📋 Configuration finale correcte

### Sur Render (Backend)

```bash
FRONTEND_URL=https://projet-rdv-kp-tech.vercel.app
APP_URL=https://projet-rdv-backend.onrender.com
```

### Sur Vercel (Frontend)

```bash
VITE_API_URL=https://projet-rdv-backend.onrender.com/api
```

---

## 🐛 Si vous avez plusieurs domaines Vercel

Si vous avez plusieurs URLs Vercel (ex: preview deployments), vous pouvez autoriser plusieurs origines:

### Option 1: Autoriser tous les sous-domaines Vercel

Modifiez `backend/config/cors.php`:

```php
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
'allowed_origins_patterns' => ['/^https:\/\/.*\.vercel\.app$/'],
```

Puis commitez et poussez:
```bash
cd backend
git add config/cors.php
git commit -m "Allow all Vercel subdomains for CORS"
git push
```

### Option 2: Autoriser plusieurs URLs spécifiques

Sur Render, modifiez `FRONTEND_URL`:
```
https://projet-rdv-kp-tech.vercel.app,https://projet-rdv.vercel.app
```

Et modifiez `backend/config/cors.php`:
```php
'allowed_origins' => array_filter(explode(',', env('FRONTEND_URL', 'http://localhost:5173'))),
```

---

## ✅ Checklist

- [ ] Variable `FRONTEND_URL` mise à jour sur Render
- [ ] URL exacte: `https://projet-rdv-kp-tech.vercel.app` (sans slash)
- [ ] Backend redéployé (statut: Live)
- [ ] Cache navigateur vidé
- [ ] Application testée
- [ ] Pas d'erreurs CORS
- [ ] Données chargées correctement

---

## 🎯 Résultat attendu

### Avant (❌)
```
CORS header 'Access-Control-Allow-Origin' does not match
Expected: https://projet-rdv.vercel.app/
Actual: https://projet-rdv-kp-tech.vercel.app
```

### Après (✅)
```
Access-Control-Allow-Origin: https://projet-rdv-kp-tech.vercel.app
Status: 200 OK
Data loaded successfully
```

---

## 💡 Pourquoi ce problème ?

Vercel génère automatiquement des URLs pour chaque projet. Votre URL réelle est `projet-rdv-kp-tech.vercel.app` (probablement parce que `projet-rdv` était déjà pris).

Le backend CORS vérifie que l'origine de la requête correspond EXACTEMENT à `FRONTEND_URL`. Un seul caractère de différence et la requête est bloquée.

---

## 🆘 Si le problème persiste

1. Vérifiez que `FRONTEND_URL` sur Render = `https://projet-rdv-kp-tech.vercel.app`
2. Vérifiez qu'il n'y a pas de slash à la fin
3. Vérifiez que le backend a bien redéployé
4. Videz complètement le cache du navigateur
5. Testez en navigation privée

---

## 🎉 Vous êtes presque là !

C'est la dernière étape. Une fois `FRONTEND_URL` corrigée sur Render, votre application devrait fonctionner parfaitement !
