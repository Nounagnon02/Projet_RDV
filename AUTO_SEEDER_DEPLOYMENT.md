# 🚀 Déploiement Automatique avec Seeder

## ✅ Configuration automatique

Le script de déploiement exécute maintenant automatiquement les seeders lors du premier déploiement si la base de données est vide.

## 🔄 Fonctionnement

### Lors du déploiement, le script:

1. ⏳ Attend que la base de données soit prête (10 secondes)
2. 🔧 Exécute les migrations (`php artisan migrate --force`)
3. 🔍 Vérifie si la base contient des utilisateurs
4. 🌱 **Si la base est vide**: Exécute les seeders automatiquement
5. ⚡ Met en cache la configuration
6. 🚀 Démarre l'application

## 📋 Comptes créés automatiquement

Lors du premier déploiement, ces comptes sont créés:

### 1. Compte Admin Provider
```
Email: admin@projet-rdv.com
Mot de passe: Admin@2026!
Rôle: provider
```

### 2. Compte Provider (Elsa)
```
Email: elsa@coiffure.com
Mot de passe: password123
Rôle: provider
```

### 3. Compte Client
```
Email: kangbode@example.com
Mot de passe: password123
Rôle: client
```

### Plus:
- 3 services
- 6 produits
- 2 rendez-vous de démonstration

---

## 🚀 Déployer maintenant

### 1. Poussez le code

```bash
cd /home/kangbodenounagnonprince/Mes_Projet/Projet_RDV
git push origin main
```

### 2. Render va automatiquement:

- Détecter les changements
- Rebuilder l'image Docker
- Exécuter les migrations
- **Exécuter les seeders si la base est vide**
- Démarrer l'application

### 3. Surveillez les logs

1. Allez sur https://render.com/dashboard
2. Cliquez sur `projet-rdv-backend`
3. Cliquez sur **"Logs"**
4. Vous verrez:
   ```
   Waiting for database...
   Running migrations...
   Database is empty. Running seeders...
   ✅ Seeders executed successfully
   Caching configuration...
   🚀 Application ready!
   ```

### 4. Connectez-vous

Une fois le déploiement terminé (5-10 minutes):

1. Allez sur https://projet-rdv-kp-tech.vercel.app
2. Cliquez sur **"Connexion"**
3. Utilisez:
   - Email: `admin@projet-rdv.com`
   - Mot de passe: `Admin@2026!`

---

## 🔄 Redéploiements suivants

Lors des prochains déploiements:

- ✅ Les migrations s'exécutent
- ❌ Les seeders **ne s'exécutent PAS** (pour préserver vos données)
- ✅ La configuration est mise en cache

Le script vérifie si des utilisateurs existent. Si oui, il saute les seeders.

---

## 🛠️ Forcer l'exécution des seeders

Si vous voulez réexécuter les seeders manuellement:

### Via Render Shell

```bash
# Seeder uniquement (ajoute des données)
php artisan db:seed --force

# Ou réinitialiser complètement (SUPPRIME TOUT)
php artisan migrate:fresh --seed --force
```

⚠️ **Attention**: `migrate:fresh` supprime toutes les données existantes !

---

## 🔍 Vérifier que les seeders ont été exécutés

### Méthode 1: Via les logs Render

Cherchez dans les logs:
```
Database is empty. Running seeders...
✅ Seeders executed successfully
```

### Méthode 2: Via Render Shell

```bash
php artisan tinker
```

```php
// Vérifier le compte admin
User::where('email', 'admin@projet-rdv.com')->first();

// Compter les utilisateurs
User::count();

// Compter les services
\App\Models\Service::count();
```

### Méthode 3: Via l'application

Essayez de vous connecter avec `admin@projet-rdv.com` / `Admin@2026!`

---

## 🐛 Dépannage

### Les seeders ne s'exécutent pas

**Cause**: La base contient déjà des données

**Solution**: 
1. Vérifiez les logs Render
2. Si vous voyez "Database already contains data", c'est normal
3. Pour forcer, utilisez Render Shell: `php artisan db:seed --force`

### Erreur lors de l'exécution des seeders

**Cause**: Problème dans le code du seeder

**Solution**:
1. Vérifiez les logs Render pour l'erreur exacte
2. Corrigez le seeder localement
3. Testez: `docker-compose exec backend php artisan db:seed`
4. Commitez et poussez

### Le compte admin n'existe pas

**Cause**: Les seeders n'ont pas été exécutés

**Solution**:
```bash
# Via Render Shell
php artisan db:seed --force
```

Ou créez manuellement:
```bash
php artisan admin:create admin@projet-rdv.com "Admin@2026!" "Administrateur"
```

---

## 📊 Workflow complet

```
1. Développement local
   ↓
2. git push origin main
   ↓
3. Render détecte les changements
   ↓
4. Build Docker image
   ↓
5. Démarrage du container
   ↓
6. Exécution de entrypoint.sh
   ├─ Migrations
   ├─ Seeders (si base vide)
   └─ Cache config
   ↓
7. Application prête
   ↓
8. Connexion avec admin@projet-rdv.com
```

---

## ✅ Avantages de cette approche

1. **Automatique**: Pas besoin d'exécuter manuellement les seeders
2. **Sécurisé**: Ne réexécute pas les seeders si des données existent
3. **Pratique**: Compte admin créé dès le premier déploiement
4. **Flexible**: Possibilité de forcer manuellement si besoin

---

## 🎯 Checklist de déploiement

- [x] Script entrypoint.sh mis à jour
- [x] Seeder contient le compte admin
- [ ] Code poussé sur Git
- [ ] Render en cours de déploiement
- [ ] Logs vérifiés (seeders exécutés)
- [ ] Connexion testée avec admin@projet-rdv.com
- [ ] Mot de passe changé (recommandé)

---

## 🔐 Sécurité

### Changez le mot de passe par défaut

Après la première connexion:

1. Connectez-vous avec `admin@projet-rdv.com` / `Admin@2026!`
2. Allez dans votre profil
3. Changez le mot de passe

Ou via Render Shell:
```bash
php artisan tinker
```

```php
$admin = User::where('email', 'admin@projet-rdv.com')->first();
$admin->password = Hash::make('VotreNouveauMotDePasse');
$admin->save();
echo "✅ Mot de passe changé";
```

---

## 🎉 C'est prêt !

Poussez votre code et le compte admin sera créé automatiquement lors du premier déploiement !

```bash
git push origin main
```

Attendez 5-10 minutes et connectez-vous avec:
- Email: `admin@projet-rdv.com`
- Mot de passe: `Admin@2026!`
