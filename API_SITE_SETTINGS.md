# 📡 API Documentation - Site Settings

## Endpoints

### 1. GET /api/site-settings (Public)

Récupère tous les paramètres du site pour affichage public.

**Authentification:** Non requise

**Réponse:**
```json
{
  "site_name": "Elsa Coiffure",
  "contact_email": "concierge@elsacoiffure.com",
  "contact_phone": "+33 1 23 45 67 89",
  "contact_address": "75 Av. des Champs-Élysées, Paris",
  "social_instagram": "https://instagram.com/elsacoiffure",
  "social_facebook": "https://facebook.com/elsacoiffure",
  "social_youtube": "https://youtube.com/@elsacoiffure",
  "footer_description": "Élever les standards du soin capillaire Afro à travers une expérience de luxe et une excellence artistique depuis plus d'une décennie."
}
```

**Exemple cURL:**
```bash
curl http://localhost:8000/api/site-settings
```

---

### 2. GET /api/admin/site-settings (Admin)

Récupère tous les paramètres avec métadonnées (id, type, timestamps).

**Authentification:** Requise (Bearer Token)

**Réponse:**
```json
[
  {
    "id": 1,
    "key": "site_name",
    "value": "Elsa Coiffure",
    "type": "text",
    "created_at": "2026-02-06T10:00:00.000000Z",
    "updated_at": "2026-02-06T10:00:00.000000Z"
  },
  {
    "id": 2,
    "key": "contact_email",
    "value": "concierge@elsacoiffure.com",
    "type": "email",
    "created_at": "2026-02-06T10:00:00.000000Z",
    "updated_at": "2026-02-06T10:00:00.000000Z"
  }
  // ... autres paramètres
]
```

**Exemple cURL:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8000/api/admin/site-settings
```

---

### 3. PUT /api/admin/site-settings (Admin)

Met à jour plusieurs paramètres en une seule requête.

**Authentification:** Requise (Bearer Token)

**Body:**
```json
{
  "settings": [
    {
      "key": "site_name",
      "value": "Nouveau Nom",
      "type": "text"
    },
    {
      "key": "contact_email",
      "value": "nouveau@email.com",
      "type": "email"
    }
  ]
}
```

**Réponse:**
```json
{
  "message": "Paramètres mis à jour avec succès",
  "settings": {
    "site_name": "Nouveau Nom",
    "contact_email": "nouveau@email.com",
    // ... tous les paramètres
  }
}
```

**Exemple cURL:**
```bash
curl -X PUT \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "settings": [
         {"key": "site_name", "value": "Nouveau Nom", "type": "text"}
       ]
     }' \
     http://localhost:8000/api/admin/site-settings
```

---

### 4. PUT /api/admin/site-settings/{key} (Admin)

Met à jour un seul paramètre.

**Authentification:** Requise (Bearer Token)

**Paramètres URL:**
- `{key}`: La clé du paramètre (ex: `site_name`)

**Body:**
```json
{
  "value": "Nouvelle valeur",
  "type": "text"
}
```

**Réponse:**
```json
{
  "message": "Paramètre mis à jour",
  "setting": {
    "id": 1,
    "key": "site_name",
    "value": "Nouvelle valeur",
    "type": "text",
    "created_at": "2026-02-06T10:00:00.000000Z",
    "updated_at": "2026-02-06T15:30:00.000000Z"
  }
}
```

**Exemple cURL:**
```bash
curl -X PUT \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"value": "Nouvelle valeur", "type": "text"}' \
     http://localhost:8000/api/admin/site-settings/site_name
```

---

## Types de paramètres

| Type | Description | Exemple |
|------|-------------|---------|
| `text` | Texte simple | "Elsa Coiffure" |
| `email` | Adresse email | "contact@example.com" |
| `url` | URL complète | "https://instagram.com/..." |
| `textarea` | Texte long | "Description longue..." |

---

## Codes d'erreur

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 422 Validation Error
```json
{
  "errors": {
    "settings": ["The settings field is required."],
    "settings.0.key": ["The settings.0.key field is required."]
  }
}
```

### 500 Server Error
```json
{
  "message": "Server Error",
  "error": "..."
}
```

---

## Cache

Les paramètres sont mis en cache pendant **1 heure** pour optimiser les performances.

Le cache est automatiquement invalidé lors de :
- Mise à jour d'un paramètre
- Création d'un nouveau paramètre

**Clés de cache:**
- `site_setting_{key}` : Pour un paramètre spécifique
- `site_settings_all` : Pour tous les paramètres

---

## Utilisation dans le Frontend

### Récupération des paramètres (Public)

```javascript
import axios from '../api/axios';

const fetchSettings = async () => {
  try {
    const response = await axios.get('/site-settings');
    console.log(response.data);
    // { site_name: "Elsa Coiffure", ... }
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### Mise à jour des paramètres (Admin)

```javascript
import axios from '../api/axios';

const updateSettings = async (settings) => {
  try {
    const response = await axios.put('/admin/site-settings', {
      settings: [
        { key: 'site_name', value: 'Nouveau Nom', type: 'text' },
        { key: 'contact_email', value: 'new@email.com', type: 'email' }
      ]
    });
    console.log(response.data.message);
    // "Paramètres mis à jour avec succès"
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

---

## Sécurité

### Middleware appliqué

- Routes publiques : Aucun middleware
- Routes admin : `auth:sanctum` (authentification requise)

### Permissions

Seuls les utilisateurs avec le rôle `provider` peuvent modifier les paramètres.

### Validation

- Les clés doivent être des chaînes de caractères
- Les valeurs peuvent être nulles
- Les types doivent être valides (text, email, url, textarea)

---

## Base de données

### Structure de la table `site_settings`

```sql
CREATE TABLE site_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT NULL,
    type VARCHAR(255) DEFAULT 'text',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### Index

- `key` : Index unique pour recherche rapide

---

## Exemples d'utilisation

### Scénario 1: Changement d'adresse

```bash
curl -X PUT \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"value": "123 Nouvelle Rue, Paris", "type": "text"}' \
     http://localhost:8000/api/admin/site-settings/contact_address
```

### Scénario 2: Mise à jour des réseaux sociaux

```bash
curl -X PUT \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "settings": [
         {"key": "social_instagram", "value": "https://instagram.com/new", "type": "url"},
         {"key": "social_facebook", "value": "https://facebook.com/new", "type": "url"}
       ]
     }' \
     http://localhost:8000/api/admin/site-settings
```

### Scénario 3: Récupération pour affichage

```javascript
// Dans le composant Footer
useEffect(() => {
  axios.get('/site-settings')
    .then(res => setSettings(res.data))
    .catch(err => console.error(err));
}, []);
```
