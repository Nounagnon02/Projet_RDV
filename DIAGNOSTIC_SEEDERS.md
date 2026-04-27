# 🔍 Diagnostic - Vérifier l'exécution des seeders

## 📋 Étapes de vérification

### 1. Vérifiez les logs Render

1. Allez sur https://render.com/dashboard
2. Cliquez sur `projet-rdv-backend`
3. Cliquez sur **"Logs"**
4. Cherchez ces lignes:

**Si les seeders ont été exécutés:**
```
🔄 Resetting database...
Dropped all tables successfully.
Migration table created successfully.
Migrating: 0001_01_01_000000_create_users_table
Migrated:  0001_01_01_000000_create_users_table
...
Seeding: Database\Seeders\DatabaseSeeder
Seeded:  Database\Seeders\DatabaseSeeder
✅ Database reset and seeded successfully
```

**Si les seeders n'ont PAS été exécutés:**
```
Running migrations...
Migrated: ...
(pas de ligne "Seeding")
```

### 2. Vérifiez via Render Shell

1. Render Dashboard → `projet-rdv-backend` → **Shell**
2. Exécutez:

```bash
# Compter les utilisateurs
php artisan tinker --execute="echo 'Users: ' . \App\Models\User::count();"

# Vérifier le compte admin
php artisan tinker --execute="\$admin = \App\Models\User::where('email', 'admin@projet-rdv.com')->first(); echo \$admin ? 'Admin existe' : 'Admin n existe pas';"

# Lister tous les emails
php artisan tinker --execute="\App\Models\User::all(['email'])->each(function(\$u) { echo \$u->email . PHP_EOL; });"
```

### 3. Résultats attendus

**Si les seeders ont fonctionné:**
```
Users: 3
Admin existe
admin@projet-rdv.com
elsa@coiffure.com
kangbode@example.com
```

**Si les seeders n'ont PAS fonctionné:**
```
Users: 0
Admin n'existe pas
```

---

## 🔧 Solutions selon le diagnostic

### Cas 1: Les seeders ne se sont pas exécutés

**Cause**: Le script `entrypoint.sh` n'utilise pas `migrate:fresh --seed`

**Solution**: Vérifiez le contenu du script sur Render

```bash
# Via Render Shell
cat /var/www/docker/entrypoint.sh
```

Devrait contenir:
```bash
php artisan migrate:fresh --seed --force
```

Si ce n'est pas le cas, le dernier commit n'a pas été déployé.

### Cas 2: Erreur lors de l'exécution des seeders

**Cause**: Erreur dans le code du seeder

**Solution**: Cherchez l'erreur dans les logs Render

Erreurs communes:
- `SQLSTATE[23000]: Integrity constraint violation`
- `Class not found`
- `Column not found`

### Cas 3: Les seeders se sont exécutés mais le compte admin n'existe pas

**Cause**: Erreur spécifique lors de la création du compte admin

**Solution**: Créez le compte manuellement

```bash
# Via Render Shell
php artisan tinker
```

```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

DB::beginTransaction();

$admin = User::create([
    'name' => 'Administrateur',
    'email' => 'admin@projet-rdv.com',
    'password' => Hash::make('Admin@2026!'),
    'phone' => '+229 00 00 00 00',
    'role' => 'provider',
    'email_verified_at' => now(),
]);

DB::table('providers')->insert([
    'user_id' => $admin->id,
    'business_name' => 'Administration',
    'description' => 'Compte administrateur principal',
    'address' => 'Cotonou',
    'city' => 'Cotonou',
    'postal_code' => '00000',
    'slug' => 'administration',
    'created_at' => now(),
    'updated_at' => now(),
]);

DB::commit();

echo "✅ Compte admin créé: " . $admin->email;
exit;
```

---

## 🚀 Forcer l'exécution des seeders maintenant

Si les seeders ne se sont pas exécutés, forcez-les:

### Via Render Shell

```bash
# Option 1: Seeders uniquement (ajoute des données)
php artisan db:seed --force

# Option 2: Réinitialisation complète (supprime tout)
php artisan migrate:fresh --seed --force
```

---

## 📊 Vérification complète

Exécutez ce script de diagnostic complet:

```bash
# Via Render Shell
php artisan tinker
```

```php
echo "=== DIAGNOSTIC COMPLET ===" . PHP_EOL;
echo PHP_EOL;

echo "📊 Statistiques:" . PHP_EOL;
echo "- Utilisateurs: " . \App\Models\User::count() . PHP_EOL;
echo "- Services: " . \App\Models\Service::count() . PHP_EOL;
echo "- Produits: " . \App\Models\Product::count() . PHP_EOL;
echo "- Rendez-vous: " . \App\Models\Appointment::count() . PHP_EOL;
echo PHP_EOL;

echo "👥 Utilisateurs:" . PHP_EOL;
\App\Models\User::all(['name', 'email', 'role'])->each(function($u) {
    echo "- {$u->name} ({$u->email}) - {$u->role}" . PHP_EOL;
});
echo PHP_EOL;

echo "🔍 Compte admin:" . PHP_EOL;
$admin = \App\Models\User::where('email', 'admin@projet-rdv.com')->first();
if ($admin) {
    echo "✅ Existe" . PHP_EOL;
    echo "- ID: {$admin->id}" . PHP_EOL;
    echo "- Nom: {$admin->name}" . PHP_EOL;
    echo "- Email: {$admin->email}" . PHP_EOL;
    echo "- Rôle: {$admin->role}" . PHP_EOL;
    echo "- Provider: " . ($admin->provider ? "Oui (ID: {$admin->provider->id})" : "Non") . PHP_EOL;
} else {
    echo "❌ N'existe pas" . PHP_EOL;
}

exit;
```

---

## 🎯 Actions selon les résultats

### Si Users: 0
→ Les seeders ne se sont pas exécutés
→ Exécutez: `php artisan db:seed --force`

### Si Users: 3 mais admin n'existe pas
→ Erreur dans le seeder
→ Créez le compte manuellement (voir Cas 3)

### Si admin existe mais connexion échoue
→ Problème de mot de passe ou d'authentification
→ Vérifiez les logs de l'API lors de la tentative de connexion

---

## 📞 Partagez ces informations

Pour vous aider davantage, partagez:

1. **Résultat du diagnostic complet** (script ci-dessus)
2. **Logs Render** (les 50 dernières lignes)
3. **Erreur exacte** lors de la tentative de connexion

---

## ⚡ Solution rapide

Si vous voulez juste créer le compte admin maintenant:

```bash
# Via Render Shell
php artisan admin:create admin@projet-rdv.com "Admin@2026!" "Administrateur"
```

Puis testez la connexion.
