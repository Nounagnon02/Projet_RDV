# 💳 Guide d'Intégration FedaPay

## ✅ Problèmes Résolus

### 1. ✅ Navbar ajoutée sur la page Messages
- La page `/dashboard/messages` utilise maintenant `DashboardLayout`
- Navigation admin complète disponible

### 2. ✅ Heures d'ouverture dynamiques
- Les heures affichées sur la page Contact proviennent de la table `availabilities`
- L'admin définit les heures dans `/dashboard/availabilities`
- API publique `/opening-hours` pour récupérer les heures

### 3. ✅ Système de paiement FedaPay implémenté
- Intégration complète de FedaPay
- Panier d'achat fonctionnel
- Page de checkout avec redirection vers FedaPay
- Webhooks pour confirmation de paiement

---

## 🚀 Configuration FedaPay

### Étape 1 : Créer un compte FedaPay

1. Aller sur https://fedapay.com
2. Créer un compte
3. Vérifier votre email

### Étape 2 : Obtenir les clés API

1. Se connecter au dashboard FedaPay
2. Aller dans **Paramètres** → **Clés API**
3. Copier :
   - **Public Key** (commence par `pk_`)
   - **Secret Key** (commence par `sk_`)

### Étape 3 : Configurer le backend

Ajouter dans `/backend/.env` :

```env
FEDAPAY_MODE=sandbox
FEDAPAY_PUBLIC_KEY=pk_sandbox_votre_cle_publique
FEDAPAY_SECRET_KEY=sk_sandbox_votre_cle_secrete
```

Pour la production, changer `sandbox` en `live` et utiliser les clés de production.

### Étape 4 : Exécuter les migrations

```bash
cd backend
php artisan migrate
```

### Étape 5 : Configurer le webhook

1. Dans le dashboard FedaPay, aller dans **Webhooks**
2. Ajouter l'URL : `https://votre-domaine.com/api/payments/webhook`
3. Sélectionner les événements :
   - `transaction.approved`
   - `transaction.canceled`
   - `transaction.failed`

---

## 📦 Fichiers Créés

### Backend

1. **PaymentController.php** - Gestion des paiements
   - `createPayment()` - Créer une transaction FedaPay
   - `webhook()` - Recevoir les notifications de paiement
   - `verifyPayment()` - Vérifier le statut d'un paiement

2. **Migration** - Ajout du champ `fedapay_transaction_id` dans `orders`

3. **Routes API** :
   - `POST /api/payments/create` - Créer un paiement
   - `POST /api/payments/webhook` - Webhook FedaPay (public)
   - `GET /api/payments/verify/{transactionId}` - Vérifier un paiement

### Frontend

1. **CartContext.jsx** - Gestion du panier
   - `addToCart()` - Ajouter un produit
   - `removeFromCart()` - Retirer un produit
   - `updateQuantity()` - Modifier la quantité
   - `clearCart()` - Vider le panier

2. **Checkout.jsx** - Page de paiement
   - Formulaire d'informations de livraison
   - Récapitulatif de commande
   - Redirection vers FedaPay

3. **PaymentSuccess.jsx** - Page de confirmation
   - Vérification du paiement
   - Affichage du numéro de commande

---

## 🔄 Flux de Paiement

```
1. Client ajoute des produits au panier
   ↓
2. Client va sur /checkout
   ↓
3. Client remplit les informations de livraison
   ↓
4. Création de la commande (status: pending)
   ↓
5. Création de la transaction FedaPay
   ↓
6. Redirection vers la page de paiement FedaPay
   ↓
7. Client paie avec Mobile Money ou Carte
   ↓
8. FedaPay envoie un webhook à notre API
   ↓
9. Mise à jour du statut de la commande (paid/failed)
   ↓
10. Redirection vers /payment/success
    ↓
11. Vérification finale du paiement
    ↓
12. Affichage de la confirmation
```

---

## 🧪 Tests en Mode Sandbox

### Numéros de test Mobile Money

**MTN Bénin :**
- Numéro : `97000001`
- Code : `123456`

**Moov Bénin :**
- Numéro : `96000001`
- Code : `123456`

### Cartes de test

- **Visa** : `4000000000000002`
- **Mastercard** : `5555555555554444`
- CVV : `123`
- Date : N'importe quelle date future

---

## 📝 Utilisation dans le Code

### Ajouter un produit au panier

```jsx
import { useCart } from '../context/CartContext';

const { addToCart } = useCart();

// Ajouter un produit
addToCart(product, quantity);
```

### Afficher le panier

```jsx
const { cart, total, itemCount } = useCart();

// Nombre d'articles
console.log(itemCount);

// Total
console.log(total);

// Articles
cart.map(item => (
  <div key={item.id}>
    {item.name} - {item.quantity} x {item.price} FCFA
  </div>
));
```

---

## 🔐 Sécurité

1. **Ne jamais exposer la Secret Key** dans le frontend
2. **Toujours vérifier les webhooks** côté serveur
3. **Valider les montants** avant de créer une transaction
4. **Logger tous les paiements** pour audit

---

## 🐛 Dépannage

### Erreur : "Invalid API Key"
- Vérifier que les clés sont correctes dans `.env`
- Vérifier que `FEDAPAY_MODE` correspond aux clés (sandbox/live)

### Webhook non reçu
- Vérifier l'URL du webhook dans le dashboard FedaPay
- Vérifier que l'URL est accessible publiquement
- Vérifier les logs Laravel : `tail -f storage/logs/laravel.log`

### Paiement bloqué sur "pending"
- Vérifier que le webhook est configuré
- Vérifier manuellement le statut sur le dashboard FedaPay
- Utiliser l'endpoint `/api/payments/verify/{transactionId}`

---

## 📚 Documentation FedaPay

- **Documentation officielle** : https://docs.fedapay.com
- **API Reference** : https://docs.fedapay.com/api
- **Support** : support@fedapay.com

---

## ✅ Checklist de Déploiement

- [ ] Créer un compte FedaPay
- [ ] Obtenir les clés API (sandbox)
- [ ] Configurer `.env` avec les clés
- [ ] Exécuter les migrations
- [ ] Tester un paiement en sandbox
- [ ] Configurer le webhook
- [ ] Tester la réception du webhook
- [ ] Passer en mode production (clés live)
- [ ] Tester un vrai paiement
- [ ] Monitorer les transactions

---

**Système de paiement FedaPay opérationnel ! 🎉**
