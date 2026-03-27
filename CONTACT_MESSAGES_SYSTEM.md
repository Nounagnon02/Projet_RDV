# 📧 Système de Messages de Contact - Documentation Complète

## 🎯 Fonctionnalités Implémentées

### ✅ Pour les Visiteurs (Page Contact)
- Formulaire de contact fonctionnel
- Validation des champs
- Feedback visuel (succès/erreur)
- Envoi des messages en base de données

### ✅ Pour l'Admin (Dashboard)
- Vue d'ensemble des messages avec statistiques
- Filtrage par statut (nouveau, lu, répondu, archivé)
- Lecture des messages
- Réponse par email directement depuis le dashboard
- Gestion des statuts
- Archivage et suppression

---

## 📊 Architecture

### Base de Données

**Table : `contact_messages`**

| Colonne | Type | Description |
|---------|------|-------------|
| id | bigint | Identifiant unique |
| name | string | Nom du contact |
| email | string | Email du contact |
| phone | string (nullable) | Téléphone (optionnel) |
| subject | string (nullable) | Sujet du message |
| message | text | Contenu du message |
| status | enum | Statut : new, read, replied, archived |
| read_at | timestamp | Date de lecture |
| replied_at | timestamp | Date de réponse |
| admin_reply | text | Réponse de l'admin |
| created_at | timestamp | Date de création |
| updated_at | timestamp | Date de modification |

### Statuts des Messages

```
┌─────────┐
│   NEW   │ ← Message vient d'arriver
└────┬────┘
     │
     ▼
┌─────────┐
│  READ   │ ← Admin a ouvert le message
└────┬────┘
     │
     ▼
┌──────────┐
│ REPLIED  │ ← Admin a répondu par email
└────┬─────┘
     │
     ▼
┌───────────┐
│ ARCHIVED  │ ← Message archivé
└───────────┘
```

---

## 🔌 API Endpoints

### Public (Visiteurs)

#### POST /api/contact
Envoyer un message de contact

**Body :**
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "phone": "+229 XX XX XX XX",
  "subject": "wedding",
  "message": "Bonjour, je souhaite..."
}
```

**Réponse (201) :**
```json
{
  "message": "Votre message a été envoyé avec succès...",
  "data": {
    "id": 1,
    "name": "Jean Dupont",
    ...
  }
}
```

---

### Admin (Authentifié)

#### GET /api/admin/contact-messages
Liste tous les messages

**Query params :**
- `status` : Filtrer par statut (new, read, replied, archived)
- `per_page` : Nombre par page (défaut: 15)

**Réponse :**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Jean Dupont",
      "email": "jean@example.com",
      "status": "new",
      "message": "...",
      "created_at": "2026-03-24T10:00:00Z"
    }
  ],
  "current_page": 1,
  "total": 10
}
```

---

#### GET /api/admin/contact-messages/stats
Statistiques des messages

**Réponse :**
```json
{
  "total": 50,
  "new": 5,
  "read": 10,
  "replied": 30,
  "archived": 5
}
```

---

#### GET /api/admin/contact-messages/{id}
Voir un message (marque automatiquement comme "lu")

**Réponse :**
```json
{
  "id": 1,
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "phone": "+229 XX XX XX XX",
  "subject": "wedding",
  "message": "Bonjour...",
  "status": "read",
  "read_at": "2026-03-24T10:05:00Z",
  "created_at": "2026-03-24T10:00:00Z"
}
```

---

#### POST /api/admin/contact-messages/{id}/reply
Répondre à un message

**Body :**
```json
{
  "reply": "Bonjour Jean,\n\nMerci pour votre message..."
}
```

**Réponse :**
```json
{
  "message": "Réponse envoyée avec succès",
  "data": {
    "id": 1,
    "status": "replied",
    "replied_at": "2026-03-24T10:10:00Z",
    "admin_reply": "Bonjour Jean..."
  }
}
```

**Note :** Un email est automatiquement envoyé au client avec la réponse.

---

#### PATCH /api/admin/contact-messages/{id}/status
Changer le statut d'un message

**Body :**
```json
{
  "status": "archived"
}
```

---

#### DELETE /api/admin/contact-messages/{id}
Supprimer un message

**Réponse :**
```json
{
  "message": "Message supprimé"
}
```

---

## 🎨 Interface Utilisateur

### Page Contact (Public)

**Formulaire :**
- Nom (requis)
- Email (requis)
- Téléphone (optionnel)
- Sujet (sélection)
- Message (requis)

**Feedback :**
- ✅ Message de succès (vert)
- ❌ Message d'erreur (rouge)
- ⏳ État de chargement pendant l'envoi

---

### Dashboard Admin

#### Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│  📧 Messages de Contact                                 │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  [50]      [5]       [10]      [30]       [5]          │
│  Total   Nouveaux    Lus     Répondus   Archivés       │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 📧 Jean Dupont              [Nouveau]   24/03/2026 │ │
│  │    jean@example.com                                │ │
│  │    Sujet: wedding                                  │ │
│  │    Bonjour, je souhaite réserver...                │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 📭 Marie Martin             [Répondu]   23/03/2026 │ │
│  │    marie@example.com                               │ │
│  │    Sujet: gala                                     │ │
│  │    Je voudrais des informations...                 │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### Modal de Détail

```
┌─────────────────────────────────────────────────────────┐
│  Jean Dupont                                        [X] │
│  jean@example.com                                       │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  Date: 24 mars 2026, 10:00                             │
│  Statut: [Nouveau]                                      │
│  Téléphone: +229 XX XX XX XX                           │
│  Sujet: wedding                                         │
│                                                          │
│  MESSAGE                                                │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Bonjour,                                           │ │
│  │                                                    │ │
│  │ Je souhaite réserver vos services pour mon        │ │
│  │ mariage le 15 juin 2026...                        │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  RÉPONDRE PAR EMAIL                                     │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Bonjour Jean,                                      │ │
│  │                                                    │ │
│  │ Merci pour votre message...                       │ │
│  │                                                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  [📤 Envoyer la Réponse]                               │
│                                                          │
│  [📦 Archiver]  [🗑️ Supprimer]                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Flux de Travail

### Scénario 1 : Nouveau Message

1. **Visiteur** remplit le formulaire sur `/contact`
2. **Système** enregistre le message avec statut "new"
3. **Admin** voit le compteur "Nouveaux" augmenter
4. **Admin** clique sur le message
5. **Système** marque automatiquement comme "read"
6. **Admin** lit le message et écrit une réponse
7. **Admin** clique sur "Envoyer la Réponse"
8. **Système** :
   - Envoie l'email au client
   - Marque le message comme "replied"
   - Enregistre la réponse dans la base
9. **Client** reçoit l'email de réponse

---

### Scénario 2 : Archivage

1. **Admin** ouvre un message répondu
2. **Admin** clique sur "Archiver"
3. **Système** change le statut en "archived"
4. **Message** n'apparaît plus dans la liste principale
5. **Admin** peut le retrouver en filtrant par "Archivés"

---

## 📧 Configuration Email

### Laravel Mail

Le système utilise Laravel Mail pour envoyer les réponses.

**Configuration dans `.env` :**

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre-email@gmail.com
MAIL_PASSWORD=votre-mot-de-passe-app
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@elsacoiffure.com
MAIL_FROM_NAME="Elsa Coiffure"
```

### Gmail App Password

Pour utiliser Gmail :

1. Activer la validation en 2 étapes
2. Générer un mot de passe d'application
3. Utiliser ce mot de passe dans `MAIL_PASSWORD`

### Autres Providers

- **SendGrid** : `MAIL_MAILER=sendgrid`
- **Mailgun** : `MAIL_MAILER=mailgun`
- **Amazon SES** : `MAIL_MAILER=ses`

---

## 🧪 Tests

### Test 1 : Envoi de Message (Public)

```bash
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+229 12 34 56 78",
    "subject": "wedding",
    "message": "Ceci est un message de test"
  }'
```

**Résultat attendu :** Status 201, message enregistré

---

### Test 2 : Liste des Messages (Admin)

```bash
curl http://localhost:8000/api/admin/contact-messages \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Résultat attendu :** Liste des messages

---

### Test 3 : Statistiques

```bash
curl http://localhost:8000/api/admin/contact-messages/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Résultat attendu :**
```json
{
  "total": 1,
  "new": 1,
  "read": 0,
  "replied": 0,
  "archived": 0
}
```

---

### Test 4 : Réponse à un Message

```bash
curl -X POST http://localhost:8000/api/admin/contact-messages/1/reply \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reply": "Merci pour votre message. Nous vous recontacterons bientôt."
  }'
```

**Résultat attendu :** Email envoyé, statut changé en "replied"

---

## 🔐 Sécurité

### Validation

**Côté Backend :**
- Validation stricte des champs
- Limite de 5000 caractères pour le message
- Validation email format
- Protection CSRF

**Côté Frontend :**
- Champs requis (HTML5)
- Validation email
- Désactivation du bouton pendant l'envoi

### Authentification

- Routes admin protégées par `auth:sanctum`
- Seuls les providers peuvent accéder aux messages
- Tokens expirables

### Rate Limiting

Recommandé d'ajouter un rate limit sur `/api/contact` :

```php
// Dans routes/api.php
Route::post('/contact', [ContactMessageController::class, 'store'])
    ->middleware('throttle:5,1'); // 5 requêtes par minute
```

---

## 📊 Statistiques & Monitoring

### Métriques Importantes

- Nombre de messages par jour
- Temps moyen de réponse
- Taux de réponse
- Messages non lus

### Dashboard Metrics (À implémenter)

```php
// Temps moyen de réponse
$avgResponseTime = ContactMessage::whereNotNull('replied_at')
    ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, replied_at)) as avg_hours')
    ->first()->avg_hours;

// Messages par jour (7 derniers jours)
$messagesPerDay = ContactMessage::where('created_at', '>=', now()->subDays(7))
    ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
    ->groupBy('date')
    ->get();
```

---

## 🚀 Améliorations Futures

### Court Terme
- [ ] Notifications push pour nouveaux messages
- [ ] Templates de réponses prédéfinis
- [ ] Recherche dans les messages
- [ ] Export CSV des messages

### Moyen Terme
- [ ] Système de tags/catégories
- [ ] Assignation de messages à des membres de l'équipe
- [ ] Historique des conversations
- [ ] Pièces jointes

### Long Terme
- [ ] Chat en temps réel
- [ ] Intégration WhatsApp/SMS
- [ ] IA pour réponses automatiques
- [ ] Analytics avancés

---

## 🐛 Résolution de Problèmes

### Le formulaire ne s'envoie pas

**Vérifications :**
1. Console navigateur pour erreurs JS
2. Network tab : vérifier la requête POST
3. Backend logs : `tail -f storage/logs/laravel.log`
4. Vérifier que l'API est accessible

---

### L'email ne s'envoie pas

**Causes possibles :**

1. **Configuration mail incorrecte**
   - Vérifier `.env`
   - Tester avec `php artisan tinker` :
   ```php
   Mail::raw('Test', function($m) {
       $m->to('test@example.com')->subject('Test');
   });
   ```

2. **Mot de passe Gmail incorrect**
   - Utiliser un mot de passe d'application
   - Pas le mot de passe principal

3. **Firewall bloque le port 587**
   - Essayer le port 465 (SSL)
   - Contacter l'hébergeur

---

### Messages ne s'affichent pas dans le dashboard

**Vérifications :**
1. Token d'authentification valide
2. Rôle utilisateur = "provider"
3. Table `contact_messages` existe
4. Données présentes : `SELECT * FROM contact_messages;`

---

## ✅ Checklist de Déploiement

Avant de mettre en production :

- [ ] Configurer les emails (SMTP)
- [ ] Tester l'envoi d'emails
- [ ] Ajouter rate limiting sur `/api/contact`
- [ ] Configurer les notifications admin
- [ ] Tester le formulaire sur mobile
- [ ] Vérifier les permissions (seuls providers)
- [ ] Backup de la base de données
- [ ] Documenter pour l'équipe

---

## 📝 Résumé

✅ **Formulaire de contact** fonctionnel sur la page publique
✅ **Enregistrement** des messages en base de données
✅ **Dashboard admin** complet avec statistiques
✅ **Réponse par email** directement depuis le dashboard
✅ **Gestion des statuts** (nouveau, lu, répondu, archivé)
✅ **Interface intuitive** avec modal de détail
✅ **API REST** complète et sécurisée
✅ **Validation** côté client et serveur

**Le système de messages de contact est 100% opérationnel !** 📧
