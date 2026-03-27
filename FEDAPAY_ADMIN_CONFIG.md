# 🔧 Configuration FedaPay via Interface Admin

## ✅ Modifications Effectuées

### 1. Section FedaPay dans les Paramètres Admin

**Emplacement** : `/dashboard/settings`

L'administrateur peut maintenant configurer FedaPay directement depuis l'interface :

- **Mode** : Sandbox (test) ou Live (production)
- **Clé Publique** : Public Key FedaPay
- **Clé Secrète** : Secret Key FedaPay

### 2. Page de Paiement Personnalisée

Au lieu de rediriger vers la page FedaPay, le paiement se fait maintenant sur votre propre site avec :

- Interface personnalisée aux couleurs de votre marque
- Widget FedaPay intégré
- Choix de méthode de paiement (Mobile Money ou Carte)
- Saisie du numéro de téléphone
- Paiement sans quitter le site

---

## 📋 Fichiers Modifiés

### Backend

1. **Migration** : `2026_03_24_000006_add_fedapay_settings.php`
   - Ajout de 3 paramètres dans `site_settings` :
     - `fedapay_mode`
     - `fedapay_public_key`
     - `fedapay_secret_key`

2. **PaymentController.php**
   - Méthode `getFedaPaySettings()` : Récupère les clés depuis la base de données
   - Méthode `getPublicKey()` : API publique pour obtenir la clé publique
   - Modification de `createPayment()` : Retourne le token au lieu de l'URL

3. **Routes API**
   - `GET /api/payments/public-key` : Récupérer la clé publique (public)

### Frontend

1. **SiteSettings.jsx**
   - Nouvelle section "Configuration FedaPay"
   - Formulaire pour saisir les clés API
   - Instructions pour obtenir les clés

2. **Checkout.jsx**
   - Refonte complète de la page
   - Intégration du widget FedaPay
   - Interface de paiement personnalisée
   - Composant `PaymentWidget` pour gérer le paiement

---

## 🚀 Guide d'Utilisation

### Étape 1 : Obtenir les Clés FedaPay

1. Créer un compte sur https://fedapay.com
2. Se connecter au dashboard
3. Aller dans **Paramètres** → **Clés API**
4. Copier :
   - **Public Key** (commence par `pk_sandbox_` ou `pk_live_`)
   - **Secret Key** (commence par `sk_sandbox_` ou `sk_live_`)

### Étape 2 : Configurer dans l'Interface Admin

1. Se connecter en tant qu'admin
2. Aller sur `/dashboard/settings`
3. Descendre jusqu'à la section **Configuration FedaPay**
4. Sélectionner le mode :
   - **Sandbox** pour les tests
   - **Live** pour la production
5. Coller la **Clé Publique**
6. Coller la **Clé Secrète**
7. Cliquer sur **Enregistrer les Paramètres**

### Étape 3 : Exécuter la Migration

```bash
cd backend
php artisan migrate
```

### Étape 4 : Tester le Paiement

1. Ajouter un produit au panier
2. Aller sur `/checkout`
3. Remplir les informations de livraison
4. Cliquer sur "Continuer vers le paiement"
5. Choisir la méthode de paiement
6. Entrer le numéro de téléphone
7. Cliquer sur "Payer maintenant"

---

## 🎨 Flux de Paiement Personnalisé

```
1. Client remplit les infos de livraison
   ↓
2. Création de la commande
   ↓
3. Création de la transaction FedaPay (backend)
   ↓
4. Affichage de l'interface de paiement personnalisée
   ↓
5. Client choisit Mobile Money ou Carte
   ↓
6. Client entre son numéro de téléphone
   ↓
7. Widget FedaPay s'ouvre (modal)
   ↓
8. Client valide le paiement
   ↓
9. Webhook reçu par le backend
   ↓
10. Redirection vers la page de succès
```

---

## 🔐 Sécurité

### Clés Stockées en Base de Données

- Les clés FedaPay sont maintenant stockées dans `site_settings`
- La Secret Key est de type `password` (masquée dans l'interface)
- Seuls les admins peuvent modifier ces paramètres

### Fallback sur .env

Si les clés ne sont pas configurées dans l'interface, le système utilise les valeurs du fichier `.env` :

```env
FEDAPAY_MODE=sandbox
FEDAPAY_PUBLIC_KEY=pk_sandbox_...
FEDAPAY_SECRET_KEY=sk_sandbox_...
```

---

## 🎯 Avantages de la Page Personnalisée

### Pour l'Utilisateur

- ✅ Reste sur votre site (pas de redirection)
- ✅ Interface cohérente avec votre marque
- ✅ Expérience fluide et professionnelle
- ✅ Confiance accrue

### Pour l'Admin

- ✅ Configuration facile via l'interface
- ✅ Pas besoin de modifier le code
- ✅ Changement de mode (test/prod) en un clic
- ✅ Gestion centralisée des paramètres

---

## 🧪 Tests en Mode Sandbox

### Numéros de Test Mobile Money

**MTN Bénin :**
- Numéro : `97000001`
- Code : `123456`

**Moov Bénin :**
- Numéro : `96000001`
- Code : `123456`

### Cartes de Test

- **Visa** : `4000000000000002`
- **Mastercard** : `5555555555554444`
- CVV : `123`
- Date : N'importe quelle date future

---

## 📱 Widget FedaPay

Le widget FedaPay est chargé dynamiquement depuis :
- **Sandbox** : `https://sandbox.fedapay.com/js/fedapay.min.js`
- **Live** : `https://live.fedapay.com/js/fedapay.min.js`

Le script est automatiquement chargé en fonction du mode configuré.

---

## 🐛 Dépannage

### Erreur : "Public Key non trouvée"

- Vérifier que les clés sont bien configurées dans `/dashboard/settings`
- Vérifier que la migration a été exécutée
- Vérifier les logs Laravel : `tail -f storage/logs/laravel.log`

### Widget ne s'affiche pas

- Vérifier la console du navigateur (F12)
- Vérifier que le script FedaPay est bien chargé
- Vérifier que le mode (sandbox/live) correspond aux clés

### Paiement bloqué

- Vérifier que le webhook est configuré dans le dashboard FedaPay
- Vérifier que l'URL du webhook est accessible
- Utiliser l'endpoint `/api/payments/verify/{transactionId}` pour vérifier manuellement

---

## ✅ Checklist de Configuration

- [ ] Créer un compte FedaPay
- [ ] Obtenir les clés API (sandbox)
- [ ] Exécuter la migration
- [ ] Configurer les clés dans `/dashboard/settings`
- [ ] Tester un paiement en sandbox
- [ ] Configurer le webhook dans FedaPay
- [ ] Tester la réception du webhook
- [ ] Passer en mode production (clés live)
- [ ] Tester un vrai paiement

---

**Configuration FedaPay via interface admin opérationnelle ! 🎉**

Plus besoin de modifier le code ou le fichier .env pour changer les clés FedaPay.
