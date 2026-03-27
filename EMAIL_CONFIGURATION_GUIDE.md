# 📧 Configuration Email - Guide Complet

## ✅ OUI, les emails sont VRAIMENT envoyés !

Lorsque l'admin répond à un message depuis le dashboard, un **email professionnel** est automatiquement envoyé au client avec :
- ✅ Template HTML élégant aux couleurs du salon
- ✅ Message de réponse de l'admin
- ✅ Message original du client (pour contexte)
- ✅ Coordonnées du salon dans le footer
- ✅ Design responsive (mobile-friendly)

---

## 🎨 Aperçu de l'Email Envoyé

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│  ✨ Elsa Coiffure                                       │
│  L'Excellence Capillaire à Votre Service                │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Bonjour Jean Dupont,                                   │
│                                                          │
│  Merci d'avoir pris le temps de nous contacter.        │
│  Voici notre réponse à votre message :                 │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Bonjour Jean,                                     │  │
│  │                                                   │  │
│  │ Nous serions ravis de vous accompagner pour      │  │
│  │ votre mariage. Nos forfaits mariée commencent    │  │
│  │ à partir de 50 000 FCFA...                       │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  Cordialement,                                          │
│  L'équipe Elsa Coiffure                                 │
│                                                          │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  📧 VOTRE MESSAGE ORIGINAL                              │
│  Date : 24/03/2026 à 10:00                             │
│  Sujet : wedding                                        │
│  Bonjour, je souhaite réserver...                      │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📍 75 Rue. derrière stade de l'amitié, Cotonou       │
│  📞 +229 01 23 45 67 89                                │
│  📧 concierge@elsacoiffure.com                         │
│                                                          │
│  © 2026 Elsa Coiffure. Tous droits réservés.          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## ⚙️ Configuration Requise

### Étape 1 : Configurer les Paramètres Email

1. Aller sur `/dashboard/settings`
2. Scroller jusqu'à **"Configuration Email (SMTP)"**
3. Remplir les champs :

| Champ | Valeur pour Gmail | Description |
|-------|-------------------|-------------|
| **Serveur SMTP** | `smtp.gmail.com` | Serveur d'envoi |
| **Port** | `587` | Port TLS (ou 465 pour SSL) |
| **Nom d'utilisateur** | `votre-email@gmail.com` | Votre adresse Gmail |
| **Mot de passe** | `xxxx xxxx xxxx xxxx` | Mot de passe d'application |
| **Chiffrement** | `TLS` | Type de sécurité |
| **Email expéditeur** | `noreply@elsacoiffure.com` | Email affiché |
| **Nom expéditeur** | `Elsa Coiffure` | Nom affiché |

4. Cliquer sur **"Enregistrer les Paramètres"**

---

## 🔐 Configuration Gmail (Recommandé)

### Pourquoi Gmail ?
- ✅ Gratuit
- ✅ Fiable
- ✅ Facile à configurer
- ✅ Limite : 500 emails/jour (largement suffisant)

### Étapes Détaillées

#### 1. Activer la Validation en 2 Étapes

1. Aller sur [myaccount.google.com](https://myaccount.google.com)
2. Cliquer sur **"Sécurité"** dans le menu gauche
3. Trouver **"Validation en 2 étapes"**
4. Cliquer sur **"Activer"**
5. Suivre les instructions (SMS ou application)

#### 2. Générer un Mot de Passe d'Application

1. Toujours dans **"Sécurité"**
2. Chercher **"Mots de passe des applications"**
3. Cliquer dessus
4. Sélectionner :
   - **Application** : Autre (nom personnalisé)
   - **Nom** : "Elsa Coiffure Website"
5. Cliquer sur **"Générer"**
6. **Copier le mot de passe** (16 caractères, ex: `abcd efgh ijkl mnop`)
7. Coller ce mot de passe dans le champ **"Mot de passe"** du dashboard

⚠️ **IMPORTANT** : N'utilisez JAMAIS votre mot de passe Gmail principal !

---

## 📧 Autres Providers Email

### Option 2 : Outlook/Hotmail

```
Serveur SMTP: smtp-mail.outlook.com
Port: 587
Chiffrement: TLS
Username: votre-email@outlook.com
Password: votre-mot-de-passe
```

### Option 3 : Yahoo Mail

```
Serveur SMTP: smtp.mail.yahoo.com
Port: 587
Chiffrement: TLS
Username: votre-email@yahoo.com
Password: mot-de-passe-application
```

### Option 4 : Services Professionnels

#### SendGrid (Recommandé pour production)
- Gratuit jusqu'à 100 emails/jour
- Configuration : [sendgrid.com](https://sendgrid.com)

#### Mailgun
- Gratuit jusqu'à 5000 emails/mois
- Configuration : [mailgun.com](https://mailgun.com)

#### Amazon SES
- Très économique (0.10$ / 1000 emails)
- Configuration : [aws.amazon.com/ses](https://aws.amazon.com/ses)

---

## 🧪 Tester l'Envoi d'Email

### Test 1 : Depuis le Dashboard

1. Aller sur `/dashboard/messages`
2. Créer un message de test (ou utiliser un existant)
3. Cliquer sur le message
4. Écrire une réponse de test
5. Cliquer sur **"Envoyer la Réponse"**
6. Vérifier la boîte email du destinataire

### Test 2 : Depuis Laravel Tinker

```bash
cd backend
php artisan tinker
```

```php
use App\Models\ContactMessage;
use App\Mail\ContactReply;
use Illuminate\Support\Facades\Mail;

// Créer un message de test
$message = ContactMessage::create([
    'name' => 'Test User',
    'email' => 'votre-email-test@gmail.com',
    'message' => 'Ceci est un test',
    'status' => 'new'
]);

// Envoyer l'email
Mail::to('votre-email-test@gmail.com')
    ->send(new ContactReply($message, 'Ceci est une réponse de test'));

echo "Email envoyé !";
```

### Test 3 : Email Simple

```bash
php artisan tinker
```

```php
Mail::raw('Test email', function($m) {
    $m->to('votre-email@gmail.com')
      ->subject('Test depuis Laravel');
});
```

---

## 🔍 Vérification

### Comment savoir si l'email est envoyé ?

#### 1. Vérifier les Logs Laravel

```bash
tail -f backend/storage/logs/laravel.log
```

**Si succès :**
```
[2026-03-24 10:00:00] local.INFO: Message sent to jean@example.com
```

**Si erreur :**
```
[2026-03-24 10:00:00] local.ERROR: Failed to authenticate on SMTP server
```

#### 2. Vérifier la Réponse API

Dans le dashboard, après avoir cliqué sur "Envoyer la Réponse" :

**Succès :**
```json
{
  "message": "Réponse envoyée avec succès par email",
  "data": { ... }
}
```

**Erreur :**
```json
{
  "message": "Erreur lors de l'envoi de l'email",
  "error": "...",
  "hint": "Vérifiez la configuration email dans les paramètres du site"
}
```

#### 3. Vérifier la Boîte Email

- Vérifier la boîte de réception
- Vérifier les **spams** (surtout la première fois)
- Vérifier l'onglet **Promotions** (Gmail)

---

## 🐛 Problèmes Courants

### Erreur : "Failed to authenticate"

**Cause** : Mot de passe incorrect

**Solutions** :
1. Vérifier que vous utilisez un **mot de passe d'application** (pas le mot de passe principal)
2. Régénérer un nouveau mot de passe d'application
3. Vérifier qu'il n'y a pas d'espaces dans le mot de passe

---

### Erreur : "Connection timeout"

**Cause** : Port bloqué ou serveur incorrect

**Solutions** :
1. Vérifier le port (587 pour TLS, 465 pour SSL)
2. Essayer l'autre port
3. Vérifier que le firewall n'est pas bloqué
4. Contacter l'hébergeur

---

### Erreur : "Could not connect to SMTP host"

**Cause** : Serveur SMTP incorrect ou inaccessible

**Solutions** :
1. Vérifier l'orthographe du serveur (`smtp.gmail.com`)
2. Vérifier la connexion internet
3. Tester avec `telnet smtp.gmail.com 587`

---

### Email envoyé mais pas reçu

**Causes possibles** :

1. **Dans les spams**
   - Vérifier le dossier spam
   - Marquer comme "Non spam"

2. **Email expéditeur non vérifié**
   - Utiliser une adresse email du même domaine
   - Ou configurer SPF/DKIM (avancé)

3. **Limite atteinte**
   - Gmail : 500 emails/jour max
   - Attendre 24h ou utiliser un autre service

---

## 🔒 Sécurité

### Bonnes Pratiques

✅ **À FAIRE :**
- Utiliser un mot de passe d'application
- Activer la validation en 2 étapes
- Ne jamais partager le mot de passe
- Utiliser HTTPS en production
- Changer le mot de passe régulièrement

❌ **À NE PAS FAIRE :**
- Utiliser le mot de passe principal Gmail
- Stocker le mot de passe en clair (il est chiffré en DB)
- Partager les identifiants
- Utiliser HTTP en production

### Protection des Données

Les mots de passe email sont :
- ✅ Stockés en base de données
- ✅ Chiffrés par Laravel
- ✅ Jamais affichés en clair dans l'interface
- ✅ Accessibles uniquement aux admins

---

## 📊 Monitoring

### Statistiques Recommandées

```php
// Nombre d'emails envoyés aujourd'hui
$emailsToday = ContactMessage::where('status', 'replied')
    ->whereDate('replied_at', today())
    ->count();

// Taux de réponse
$totalMessages = ContactMessage::count();
$repliedMessages = ContactMessage::where('status', 'replied')->count();
$responseRate = ($repliedMessages / $totalMessages) * 100;

// Temps moyen de réponse
$avgResponseTime = ContactMessage::whereNotNull('replied_at')
    ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, replied_at)) as avg')
    ->first()->avg;
```

---

## 🚀 Améliorations Futures

### Court Terme
- [ ] Bouton "Tester la configuration email"
- [ ] Notification admin lors de nouveau message
- [ ] Templates de réponses prédéfinis

### Moyen Terme
- [ ] File d'attente pour emails (Queue)
- [ ] Retry automatique en cas d'échec
- [ ] Statistiques d'envoi

### Long Terme
- [ ] Support de plusieurs comptes email
- [ ] Rotation automatique des comptes
- [ ] Dashboard analytics email

---

## ✅ Checklist de Configuration

Avant de commencer à utiliser le système :

- [ ] Activer la validation en 2 étapes sur Gmail
- [ ] Générer un mot de passe d'application
- [ ] Configurer les paramètres SMTP dans `/dashboard/settings`
- [ ] Enregistrer les paramètres
- [ ] Envoyer un email de test
- [ ] Vérifier la réception
- [ ] Vérifier les logs Laravel
- [ ] Documenter les identifiants (en sécurité)

---

## 📝 Résumé

✅ **Les emails sont VRAIMENT envoyés** quand l'admin répond
✅ **Template HTML professionnel** avec design du salon
✅ **Configuration facile** depuis le dashboard
✅ **Support Gmail, Outlook, Yahoo** et services pro
✅ **Sécurisé** avec mots de passe d'application
✅ **Logs détaillés** pour debugging
✅ **Gestion d'erreurs** avec messages clairs

**Le système d'email est 100% fonctionnel !** 📧✨

Pour toute question, vérifier les logs Laravel : `tail -f backend/storage/logs/laravel.log`
