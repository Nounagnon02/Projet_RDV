# 📍 Localisation Géographique - Documentation

## 🎯 Fonctionnalité Ajoutée

L'admin peut maintenant configurer les **coordonnées géographiques** du salon de deux façons :

1. ✅ **Saisie manuelle** : Entrer latitude et longitude manuellement
2. ✅ **Géolocalisation automatique** : Utiliser l'API de géolocalisation du navigateur

---

## 🗺️ Utilisation

### Méthode 1 : Saisie Manuelle

1. Aller sur `/dashboard/settings`
2. Scroller jusqu'à la section **"Localisation Géographique"**
3. Entrer la **Latitude** (ex: 6.3703)
4. Entrer la **Longitude** (ex: 2.3912)
5. Cliquer sur **"Enregistrer les Paramètres"**

#### Comment trouver les coordonnées ?

**Option A : Google Maps**
1. Ouvrir [Google Maps](https://maps.google.com)
2. Chercher l'adresse du salon
3. Clic droit sur le marqueur → "Plus d'infos sur cet endroit"
4. Les coordonnées s'affichent en bas (ex: 6.3703, 2.3912)

**Option B : OpenStreetMap**
1. Ouvrir [OpenStreetMap](https://www.openstreetmap.org)
2. Chercher l'adresse
3. Clic droit → "Afficher l'adresse"
4. Les coordonnées sont affichées

---

### Méthode 2 : Géolocalisation Automatique

**Prérequis** : L'admin doit être **physiquement au salon**

1. Aller sur `/dashboard/settings`
2. Scroller jusqu'à la section **"Localisation Géographique"**
3. Cliquer sur le bouton **"Utiliser ma position"** 📍
4. Autoriser l'accès à la localisation dans le navigateur
5. Les coordonnées sont automatiquement remplies
6. Cliquer sur **"Enregistrer les Paramètres"**

#### Autorisations Navigateur

Le navigateur demandera l'autorisation d'accéder à votre position :

**Chrome/Edge :**
```
"localhost:5173 souhaite connaître votre position"
[Bloquer] [Autoriser]
```

**Firefox :**
```
"Partager votre position avec localhost:5173 ?"
[Ne pas autoriser] [Autoriser]
```

**Safari :**
```
"localhost:5173 souhaite utiliser votre position actuelle"
[Ne pas autoriser] [Autoriser]
```

⚠️ **Important** : Si vous refusez, vous devrez réautoriser dans les paramètres du navigateur.

---

## 🎨 Interface Admin

### Section Localisation Géographique

```
┌─────────────────────────────────────────────────────────┐
│  Localisation Géographique    [📍 Utiliser ma position] │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  Ces coordonnées seront utilisées pour afficher la      │
│  carte du salon sur la page de contact.                 │
│                                                          │
│  Latitude                    Longitude                  │
│  [6.3703        ]           [2.3912         ]          │
│                                                          │
│  Aperçu de la position :                                │
│  📍 Voir sur Google Maps                                │
└─────────────────────────────────────────────────────────┘
```

### Bouton "Utiliser ma position"

**États du bouton :**

1. **Normal** : 📍 Utiliser ma position
2. **Chargement** : ⏳ Récupération...
3. **Succès** : Message "📍 Position actuelle récupérée avec succès !"
4. **Erreur** : Message "Erreur: Impossible de récupérer votre position..."

---

## 🗺️ Affichage sur la Page Contact

### Avant Configuration
- Image statique de fond (placeholder)

### Après Configuration
- **Carte interactive OpenStreetMap** avec marqueur sur le salon
- Zoom automatique sur la position
- Possibilité de naviguer sur la carte

### Exemple d'URL de la carte
```
https://www.openstreetmap.org/export/embed.html?
  bbox=2.3812,6.3603,2.4012,6.3803
  &layer=mapnik
  &marker=6.3703,2.3912
```

---

## 🔧 Détails Techniques

### Base de Données

**Nouveaux paramètres ajoutés :**

| Clé | Valeur par défaut | Type | Description |
|-----|-------------------|------|-------------|
| `location_latitude` | 6.3703 | number | Latitude (Cotonou, Bénin) |
| `location_longitude` | 2.3912 | number | Longitude (Cotonou, Bénin) |

### API de Géolocalisation

**Fonction utilisée :**
```javascript
navigator.geolocation.getCurrentPosition(
    successCallback,
    errorCallback,
    {
        enableHighAccuracy: true,  // Précision maximale
        timeout: 10000,             // 10 secondes max
        maximumAge: 0               // Pas de cache
    }
);
```

**Précision :**
- `enableHighAccuracy: true` → Utilise GPS si disponible
- Précision typique : 5-10 mètres
- Précision maximale : 6 décimales (ex: 6.370300)

### Carte OpenStreetMap

**Avantages :**
- ✅ Gratuit, pas d'API key nécessaire
- ✅ Open source
- ✅ Pas de limite d'utilisation
- ✅ Respect de la vie privée

**Alternative Google Maps :**
Si vous préférez Google Maps, vous pouvez modifier le code :
```javascript
// Dans Contact.jsx, remplacer l'iframe par :
<iframe
    src={`https://www.google.com/maps/embed/v1/place?key=VOTRE_CLE_API&q=${lat},${lng}`}
    ...
/>
```

---

## 🔒 Sécurité & Confidentialité

### Autorisations
- La géolocalisation nécessite **l'autorisation explicite** de l'utilisateur
- L'autorisation est **par site** et **par session**
- Peut être révoquée à tout moment dans les paramètres du navigateur

### HTTPS Requis
- La géolocalisation fonctionne sur `localhost` (développement)
- En production, **HTTPS est obligatoire**
- Sans HTTPS, le navigateur bloquera la géolocalisation

### Données Stockées
- Seules les coordonnées sont stockées (latitude, longitude)
- Aucune donnée personnelle de l'admin n'est enregistrée
- Les coordonnées sont publiques (affichées sur la page Contact)

---

## 🐛 Résolution de Problèmes

### Erreur : "La géolocalisation n'est pas supportée"

**Cause** : Navigateur trop ancien

**Solution** :
- Mettre à jour le navigateur
- Utiliser Chrome, Firefox, Safari ou Edge récent
- Saisir les coordonnées manuellement

---

### Erreur : "Impossible de récupérer votre position"

**Causes possibles :**

1. **Permission refusée**
   - Solution : Autoriser dans les paramètres du navigateur
   - Chrome : `chrome://settings/content/location`
   - Firefox : `about:preferences#privacy`

2. **Pas de connexion GPS/WiFi**
   - Solution : Activer le WiFi ou les services de localisation
   - Vérifier que le GPS est activé (mobile)

3. **Timeout (10 secondes)**
   - Solution : Réessayer
   - Vérifier la connexion internet

4. **HTTPS non activé (production)**
   - Solution : Configurer un certificat SSL

---

### La carte ne s'affiche pas

**Vérifications :**

1. Les coordonnées sont-elles enregistrées ?
   - Vérifier dans `/dashboard/settings`
   - Vérifier dans la base de données

2. Les coordonnées sont-elles valides ?
   - Latitude : entre -90 et 90
   - Longitude : entre -180 et 180

3. Bloqueur de publicités ?
   - Certains bloqueurs bloquent les iframes
   - Désactiver temporairement pour tester

---

## 📊 Exemples de Coordonnées

### Villes du Bénin

| Ville | Latitude | Longitude |
|-------|----------|-----------|
| Cotonou | 6.3703 | 2.3912 |
| Porto-Novo | 6.4969 | 2.6289 |
| Parakou | 9.3372 | 2.6303 |
| Abomey-Calavi | 6.4489 | 2.3553 |

### Villes de France

| Ville | Latitude | Longitude |
|-------|----------|-----------|
| Paris | 48.8566 | 2.3522 |
| Lyon | 45.7640 | 4.8357 |
| Marseille | 43.2965 | 5.3698 |

---

## 🧪 Tests

### Test 1 : Saisie Manuelle
```bash
1. Aller sur /dashboard/settings
2. Entrer Latitude: 6.3703
3. Entrer Longitude: 2.3912
4. Enregistrer
5. Aller sur /contact
6. ✅ La carte doit s'afficher avec le marqueur
```

### Test 2 : Géolocalisation
```bash
1. Aller sur /dashboard/settings
2. Cliquer sur "Utiliser ma position"
3. Autoriser la géolocalisation
4. ✅ Les champs doivent se remplir automatiquement
5. Enregistrer
6. Aller sur /contact
7. ✅ La carte doit s'afficher à votre position
```

### Test 3 : Lien Google Maps
```bash
1. Aller sur /dashboard/settings
2. Vérifier que les coordonnées sont remplies
3. ✅ Le lien "Voir sur Google Maps" doit être visible
4. Cliquer sur le lien
5. ✅ Google Maps doit s'ouvrir avec le bon emplacement
```

---

## 📝 Checklist de Déploiement

Avant de déployer en production :

- [ ] Vérifier que HTTPS est activé
- [ ] Tester la géolocalisation sur le serveur de production
- [ ] Configurer les coordonnées du salon réel
- [ ] Tester l'affichage de la carte sur différents navigateurs
- [ ] Vérifier que la carte est responsive (mobile/tablet/desktop)
- [ ] Documenter les coordonnées pour l'équipe

---

## 🎉 Résumé

✅ **Ajouté** : Champs latitude et longitude dans les paramètres
✅ **Ajouté** : Bouton de géolocalisation automatique
✅ **Ajouté** : Carte interactive sur la page Contact
✅ **Ajouté** : Lien vers Google Maps pour prévisualisation
✅ **Sécurisé** : Autorisations navigateur requises
✅ **Gratuit** : Utilisation d'OpenStreetMap (pas d'API key)

**L'admin peut maintenant configurer facilement la position géographique du salon !** 🗺️
