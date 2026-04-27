# 🔧 Setup sans Shell - Via API

## ✅ Routes créées

J'ai créé des routes API pour gérer le setup sans accès au Shell Render.

---

## 🚀 Déployer d'abord

```bash
cd /home/kangbodenounagnonprince/Mes_Projet/Projet_RDV
git push origin main
```

Attendez 5-10 minutes que Render redéploie.

---

## 📋 Routes disponibles

### 1. Diagnostic (vérifier l'état de la DB)

**URL**: `https://projet-rdv-backend.onrender.com/api/setup/diagnostic`

**Méthode**: GET

**Pas de secret requis**

**Test dans le navigateur**:
```
https://projet-rdv-backend.onrender.com/api/setup/diagnostic
```

**Réponse**:
```json
{
  "status": "success",
  "database": {
    "users": 0,
    "services": 0,
    "products": 0,
    "appointments": 0
  },
  "admin_exists": false,
  "users_list": []
}
```

---

### 2. Exécuter les seeders

**URL**: `https://projet-rdv-backend.onrender.com/api/setup/seed`

**Méthode**: POST

**Body (JSON)**:
```json
{
  "secret": "setup-secret-2026"
}
```

**Via curl**:
```bash
curl -X POST https://projet-rdv-backend.onrender.com/api/setup/seed \
  -H "Content-Type: application/json" \
  -d '{"secret":"setup-secret-2026"}'
```

**Via navigateur** (Postman, Insomnia, ou extension REST client):
- Méthode: POST
- URL: `https://projet-rdv-backend.onrender.com/api/setup/seed`
- Headers: `Content-Type: application/json`
- Body: `{"secret":"setup-secret-2026"}`

---

### 3. Réinitialiser complètement la DB

**URL**: `https://projet-rdv-backend.onrender.com/api/setup/fresh`

**Méthode**: POST

**Body (JSON)**:
```json
{
  "secret": "setup-secret-2026"
}
```

⚠️ **ATTENTION**: Supprime toutes les données !

---

### 4. Créer uniquement le compte admin

**URL**: `https://projet-rdv-backend.onrender.com/api/setup/create-admin`

**Méthode**: POST

**Body (JSON)**:
```json
{
  "secret": "setup-secret-2026"
}
```

---

## 🎯 Procédure recommandée

### Étape 1: Vérifier l'état actuel

Ouvrez dans votre navigateur:
```
https://projet-rdv-backend.onrender.com/api/setup/diagnostic
```

Notez le nombre d'utilisateurs.

### Étape 2: Choisir l'action

**Si users = 0** (base vide):
→ Exécutez les seeders complets (option 2 ou 3)

**Si users > 0** mais admin n'existe pas:
→ Créez uniquement le compte admin (option 4)

### Étape 3: Exécuter l'action

**Option A - Via curl** (si vous avez curl installé):
```bash
# Seeders uniquement
curl -X POST https://projet-rdv-backend.onrender.com/api/setup/seed \
  -H "Content-Type: application/json" \
  -d '{"secret":"setup-secret-2026"}'

# Ou créer admin uniquement
curl -X POST https://projet-rdv-backend.onrender.com/api/setup/create-admin \
  -H "Content-Type: application/json" \
  -d '{"secret":"setup-secret-2026"}'
```

**Option B - Via un outil REST**:

1. **Postman** (https://www.postman.com/downloads/)
2. **Insomnia** (https://insomnia.rest/download)
3. **Extension navigateur** (REST Client pour Chrome/Firefox)

Configuration:
- Méthode: POST
- URL: `https://projet-rdv-backend.onrender.com/api/setup/seed`
- Headers: `Content-Type: application/json`
- Body (raw JSON): `{"secret":"setup-secret-2026"}`

**Option C - Via JavaScript dans la console du navigateur**:

1. Ouvrez https://projet-rdv-backend.onrender.com
2. F12 → Console
3. Collez et exécutez:

```javascript
fetch('https://projet-rdv-backend.onrender.com/api/setup/seed', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    secret: 'setup-secret-2026'
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

### Étape 4: Vérifier

Rechargez le diagnostic:
```
https://projet-rdv-backend.onrender.com/api/setup/diagnostic
```

Devrait afficher:
```json
{
  "status": "success",
  "database": {
    "users": 3,
    "services": 3,
    "products": 6,
    "appointments": 2
  },
  "admin_exists": true,
  "users_list": [
    {
      "id": 1,
      "name": "Administrateur",
      "email": "admin@projet-rdv.com",
      "role": "provider"
    },
    ...
  ]
}
```

### Étape 5: Connexion

Allez sur https://projet-rdv-kp-tech.vercel.app et connectez-vous:
- Email: `admin@projet-rdv.com`
- Mot de passe: `Admin@2026!`

---

## 🔒 Sécurité

Le secret `setup-secret-2026` est défini dans les variables d'environnement Render.

Pour changer le secret:
1. Render Dashboard → Environment
2. Ajoutez: `SETUP_SECRET=votre-nouveau-secret`
3. Utilisez ce nouveau secret dans vos requêtes

---

## 🐛 Dépannage

### Erreur 403 Unauthorized

Le secret est incorrect. Vérifiez que vous utilisez `setup-secret-2026`.

### Erreur 500

Vérifiez les logs Render pour voir l'erreur exacte.

### Le compte admin existe déjà

Utilisez la route `/setup/diagnostic` pour vérifier.

Si vous voulez recréer, utilisez `/setup/fresh` (supprime tout).

---

## 📊 Exemple complet

```bash
# 1. Diagnostic
curl https://projet-rdv-backend.onrender.com/api/setup/diagnostic

# 2. Si users = 0, exécuter les seeders
curl -X POST https://projet-rdv-backend.onrender.com/api/setup/seed \
  -H "Content-Type: application/json" \
  -d '{"secret":"setup-secret-2026"}'

# 3. Vérifier à nouveau
curl https://projet-rdv-backend.onrender.com/api/setup/diagnostic

# 4. Tester la connexion sur l'app
```

---

## ⚡ Solution la plus simple

**Dans votre navigateur**, ouvrez ces URLs dans l'ordre:

1. **Diagnostic**: 
   ```
   https://projet-rdv-backend.onrender.com/api/setup/diagnostic
   ```

2. **Si users = 0**, ouvrez la console (F12) et exécutez:
   ```javascript
   fetch('https://projet-rdv-backend.onrender.com/api/setup/seed', {
     method: 'POST',
     headers: {'Content-Type': 'application/json'},
     body: JSON.stringify({secret: 'setup-secret-2026'})
   }).then(r => r.json()).then(console.log)
   ```

3. **Rechargez le diagnostic** pour vérifier

4. **Connectez-vous** sur l'app

---

## ✅ Checklist

- [ ] Code poussé sur Git
- [ ] Render a redéployé (5-10 min)
- [ ] Diagnostic vérifié (users = ?)
- [ ] Seeders exécutés (via API)
- [ ] Diagnostic re-vérifié (users = 3, admin_exists = true)
- [ ] Connexion testée sur l'app
- [ ] Ça marche ! 🎉

---

Testez le diagnostic maintenant pour voir l'état de votre base de données !
