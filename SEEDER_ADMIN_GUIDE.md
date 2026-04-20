# 🌱 Créer le Compte Admin via Seeder

## ✅ Compte admin ajouté au seeder

Le compte admin provider est maintenant créé automatiquement avec le seeder.

### 📋 Identifiants du compte admin

```
Email: admin@projet-rdv.com
Mot de passe: Admin@2026!
Rôle: provider
```

---

## 🚀 Exécuter le seeder

### Option 1: Sur Render (Production)

1. **Poussez le code**
   ```bash
   cd /home/kangbodenounagnonprince/Mes_Projet/Projet_RDV
   git push origin main
   ```

2. **Attendez le redéploiement** (2-3 minutes)

3. **Ouvrez Render Shell**
   - https://render.com/dashboard
   - Cliquez sur `projet-rdv-backend`
   - Cliquez sur **"Shell"**

4. **Exécutez le seeder**
   ```bash
   php artisan db:seed
   ```

   Ou si vous voulez réinitialiser toute la base:
   ```bash
   php artisan migrate:fresh --seed
   ```
   ⚠️ **Attention**: Ceci supprime toutes les données existantes !

---

### Option 2: En local avec Docker

```bash
# Seeder uniquement
docker-compose exec backend php artisan db:seed

# Ou réinitialiser complètement
docker-compose exec backend php artisan migrate:fresh --seed
```

---

## 🔍 Vérifier que le compte existe

### Via Render Shell ou Docker

```bash
php artisan tinker
```

```php
User::where('email', 'admin@projet-rdv.com')->first();
```

Devrait afficher:
```
App\Models\User {
  id: 1,
  name: "Administrateur",
  email: "admin@projet-rdv.com",
  role: "provider",
  ...
}
```

---

## 🔐 Connexion

1. Allez sur: https://projet-rdv-kp-tech.vercel.app
2. Cliquez sur **"Connexion"**
3. Entrez:
   - Email: `admin@projet-rdv.com`
   - Mot de passe: `Admin@2026!`
4. Vous êtes connecté en tant que provider administrateur ✅

---

## 🔄 Si le compte existe déjà

Si vous avez déjà exécuté le seeder et que le compte existe:

### Méthode 1: Réinitialiser la base (supprime tout)

```bash
php artisan migrate:fresh --seed
```

### Méthode 2: Supprimer uniquement le compte admin

```bash
php artisan tinker
```

```php
$user = User::where('email', 'admin@projet-rdv.com')->first();
if ($user) {
    $user->provider()->delete();
    $user->delete();
    echo "✅ Compte supprimé";
}
```

Puis relancez le seeder:
```bash
php artisan db:seed
```

---

## 📊 Comptes créés par le seeder

Le seeder crée maintenant:

1. **Administrateur** (provider)
   - Email: `admin@projet-rdv.com`
   - Mot de passe: `Admin@2026!`

2. **Elsa Coiffure** (provider)
   - Email: `elsa@coiffure.com`
   - Mot de passe: `password123`

3. **Kangbode Nouagnon Prince** (client)
   - Email: `kangbode@example.com`
   - Mot de passe: `password123`

4. **Services** (3 services)
5. **Produits** (6 produits)
6. **Rendez-vous** (2 rendez-vous)

---

## 🛠️ Modifier le mot de passe admin

Si vous voulez changer le mot de passe par défaut, modifiez le seeder:

```php
// Dans database/seeders/DatabaseSeeder.php
$admin = User::create([
    'name' => 'Administrateur',
    'email' => 'admin@projet-rdv.com',
    'password' => Hash::make('VotreNouveauMotDePasse'),  // ← Changez ici
    'phone' => '+229 00 00 00 00',
    'role' => 'provider',
    'email_verified_at' => now(),
]);
```

Puis commitez et poussez:
```bash
git add database/seeders/DatabaseSeeder.php
git commit -m "Update admin password"
git push
```

---

## ⚠️ Important pour la production

### Première fois (base vide)

```bash
# Sur Render Shell
php artisan db:seed
```

### Si la base contient déjà des données

**NE PAS** utiliser `migrate:fresh --seed` en production car cela supprime toutes les données !

À la place, créez le compte manuellement:
```bash
php artisan admin:create admin@projet-rdv.com "Admin@2026!" "Administrateur"
```

---

## ✅ Checklist

- [x] Seeder mis à jour avec le compte admin
- [ ] Code poussé sur Git
- [ ] Render a redéployé
- [ ] Seeder exécuté (`php artisan db:seed`)
- [ ] Compte admin vérifié
- [ ] Connexion testée sur l'application
- [ ] Mot de passe changé (recommandé)

---

## 🎉 C'est fait !

Votre compte admin provider est maintenant créé automatiquement avec le seeder. Connectez-vous avec:

```
Email: admin@projet-rdv.com
Mot de passe: Admin@2026!
```

**Conseil**: Changez le mot de passe après la première connexion pour plus de sécurité.
