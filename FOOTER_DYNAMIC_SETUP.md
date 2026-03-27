# Configuration du Footer Dynamique - Instructions

## 🎯 Fonctionnalités ajoutées

L'admin peut maintenant configurer depuis son dashboard :
- ✅ Nom du salon
- ✅ Description du footer
- ✅ Email de contact
- ✅ Téléphone
- ✅ Adresse
- ✅ Liens réseaux sociaux (Instagram, Facebook, YouTube)
- ✅ Année du copyright (automatique)

## 📋 Étapes d'installation

### 1. Exécuter la migration

```bash
cd backend
php artisan migrate
```

Cette commande va :
- Créer la table `site_settings`
- Insérer les valeurs par défaut

### 2. Vérifier que tout fonctionne

#### Backend
```bash
# Tester l'API publique
curl http://localhost:8000/api/site-settings

# Tester l'API admin (nécessite authentification)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/admin/site-settings
```

#### Frontend
1. Démarrer le serveur frontend
```bash
cd frontend
npm run dev
```

2. Se connecter en tant qu'admin/provider

3. Accéder à "Paramètres du Site" dans le menu du dashboard

4. Modifier les informations et enregistrer

5. Vérifier que le Footer sur les pages publiques affiche les nouvelles données

## 🔧 Utilisation

### Pour l'admin :
1. Aller sur `/dashboard/settings`
2. Modifier les champs souhaités
3. Cliquer sur "Enregistrer les Paramètres"
4. Les changements sont immédiatement visibles sur toutes les pages

### Pour les visiteurs :
- Le Footer affiche automatiquement les informations configurées par l'admin
- L'année du copyright est toujours à jour automatiquement
- Les liens sociaux sont cliquables et s'ouvrent dans un nouvel onglet

## 📁 Fichiers créés/modifiés

### Backend
- ✅ `database/migrations/2026_02_06_000000_create_site_settings_table.php`
- ✅ `app/Models/SiteSetting.php`
- ✅ `app/Http/Controllers/Api/SiteSettingController.php`
- ✅ `routes/api.php` (ajout des routes)

### Frontend
- ✅ `pages/admin/SiteSettings.jsx` (nouvelle page admin)
- ✅ `components/Footer.jsx` (modifié pour utiliser les données dynamiques)
- ✅ `App.jsx` (ajout de la route)
- ✅ `layouts/DashboardLayout.jsx` (ajout du menu)

## 🔐 Sécurité

- Les routes de modification sont protégées par authentification
- Seuls les providers/admins peuvent modifier les paramètres
- L'API publique permet uniquement la lecture des paramètres
- Les données sont mises en cache pour optimiser les performances

## 🚀 Améliorations futures possibles

- Ajouter un éditeur WYSIWYG pour la description
- Permettre l'upload d'un logo personnalisé
- Ajouter plus de réseaux sociaux (TikTok, LinkedIn, etc.)
- Configurer les heures d'ouverture
- Gérer plusieurs langues
