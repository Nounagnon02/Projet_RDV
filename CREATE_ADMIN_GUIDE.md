# 👤 Créer un Compte Provider Administrateur

## 🎯 Méthodes disponibles

### Méthode 1: Via Render Shell (Production)

1. **Allez sur Render Dashboard**
   - https://render.com/dashboard
   - Cliquez sur votre service `projet-rdv-backend`

2. **Ouvrez le Shell**
   - Cliquez sur **"Shell"** dans le menu de gauche
   - Attendez que le terminal se charge

3. **Exécutez la commande**
   ```bash
   php artisan admin:create
   ```

4. **Suivez les instructions**
   - Email: `admin@projet-rdv.com` (ou votre email)
   - Mot de passe: Choisissez un mot de passe sécurisé (min 8 caractères)
   - Nom: `Administrateur` (ou votre nom)
   - Téléphone: Votre numéro

5. **Résultat**
   ```
   ✅ Compte provider créé avec succès!
   
   Email: admin@projet-rdv.com
   Rôle: provider
   ```

---

### Méthode 2: Via commande directe (Production)

Si vous voulez créer le compte sans interaction:

```bash
php artisan admin:create admin@projet-rdv.com "VotreMotDePasse123!" "Administrateur"
```

---

### Méthode 3: En local avec Docker

```bash
# Depuis votre machine
docker-compose exec backend php artisan admin:create
```

Ou avec paramètres:
```bash
docker-compose exec backend php artisan admin:create admin@test.com "Password123!" "Admin"
```

---

### Méthode 4: Via Tinker (Production ou Local)

1. **Ouvrez Tinker**
   ```bash
   # Sur Render Shell
   php artisan tinker
   
   # Ou en local
   docker-compose exec backend php artisan tinker
   ```

2. **Créez le compte**
   ```php
   use App\Models\User;
   use Illuminate\Support\Facades\Hash;
   use Illuminate\Support\Facades\DB;
   
   DB::beginTransaction();
   
   $user = User::create([
       'name' => 'Administrateur',
       'email' => 'admin@projet-rdv.com',
       'password' => Hash::make('VotreMotDePasse123!'),
       'phone' => '+33 1 00 00 00 00',
       'role' => 'provider',
       'email_verified_at' => now(),
   ]);
   
   DB::table('providers')->insert([
       'user_id' => $user->id,
       'business_name' => 'Administrateur',
       'description' => 'Compte administrateur',
       'address' => 'À définir',
       'city' => 'À définir',
       'postal_code' => '00000',
       'slug' => 'administrateur-' . $user->id,
       'created_at' => now(),
       'updated_at' => now(),
   ]);
   
   DB::commit();
   
   echo "✅ Compte créé: " . $user->email;
   ```

3. **Quittez Tinker**
   ```php
   exit
   ```

---

## 🔐 Connexion au compte

Une fois le compte créé:

1. Allez sur votre application: https://projet-rdv-kp-tech.vercel.app
2. Cliquez sur **"Connexion"**
3. Entrez vos identifiants:
   - Email: `admin@projet-rdv.com`
   - Mot de passe: Celui que vous avez défini
4. Vous serez connecté en tant que **provider**

---

## 🛠️ Gestion des comptes

### Lister tous les providers

```bash
php artisan tinker
```

```php
User::where('role', 'provider')->get(['id', 'name', 'email']);
```

### Modifier un mot de passe

```bash
php artisan tinker
```

```php
$user = User::where('email', 'admin@projet-rdv.com')->first();
$user->password = Hash::make('NouveauMotDePasse123!');
$user->save();
echo "✅ Mot de passe modifié";
```

### Supprimer un compte

```bash
php artisan tinker
```

```php
$user = User::where('email', 'admin@projet-rdv.com')->first();
$user->provider()->delete(); // Supprime le profil provider
$user->delete(); // Supprime l'utilisateur
echo "✅ Compte supprimé";
```

---

## 📋 Vérification

### Vérifier que le compte existe

```bash
php artisan tinker
```

```php
User::where('email', 'admin@projet-rdv.com')->first();
```

Devrait afficher les informations du compte.

---

## 🚀 Déploiement de la commande

Pour que la commande soit disponible sur Render:

```bash
cd /home/kangbodenounagnonprince/Mes_Projet/Projet_RDV
git add backend/app/Console/Commands/CreateAdminProvider.php
git commit -m "Add admin:create command"
git push origin main
```

Attendez que Render redéploie (2-3 minutes), puis utilisez la commande via le Shell.

---

## 💡 Conseils de sécurité

1. **Mot de passe fort**
   - Minimum 8 caractères
   - Mélange de majuscules, minuscules, chiffres et symboles
   - Exemple: `Admin@2026!Secure`

2. **Email professionnel**
   - Utilisez un email que vous contrôlez
   - Évitez les emails génériques

3. **Changez le mot de passe par défaut**
   - Si vous utilisez un mot de passe temporaire, changez-le après la première connexion

4. **Sauvegardez les identifiants**
   - Notez-les dans un gestionnaire de mots de passe sécurisé

---

## 🆘 Problèmes courants

### Erreur: "Un utilisateur avec cet email existe déjà"

Le compte existe déjà. Utilisez un autre email ou supprimez l'ancien compte.

### Erreur: "SQLSTATE[23000]: Integrity constraint violation"

La table `providers` nécessite un profil. La commande le crée automatiquement.

### Erreur: "Class 'App\Console\Commands\CreateAdminProvider' not found"

Poussez le code sur Git et attendez le redéploiement sur Render.

---

## 📖 Exemple complet

```bash
# Sur Render Shell
php artisan admin:create

# Réponses:
Email du provider: admin@projet-rdv.com
Mot de passe (min 8 caractères): ********
Nom du provider: Administrateur
Téléphone: +33 1 23 45 67 89

# Résultat:
✅ Compte provider créé avec succès!

┌────────────────┬──────────────────────────┐
│ Champ          │ Valeur                   │
├────────────────┼──────────────────────────┤
│ Email          │ admin@projet-rdv.com     │
│ Mot de passe   │ ********                 │
│ Nom            │ Administrateur           │
│ Rôle           │ provider                 │
└────────────────┴──────────────────────────┘

🔐 Vous pouvez maintenant vous connecter avec ces identifiants
```

---

## ✅ Checklist

- [ ] Commande `admin:create` créée
- [ ] Code poussé sur Git
- [ ] Render a redéployé
- [ ] Compte provider créé via Shell
- [ ] Connexion testée sur l'application
- [ ] Identifiants sauvegardés en sécurité

---

Vous êtes prêt ! Créez votre compte provider administrateur maintenant. 🚀
