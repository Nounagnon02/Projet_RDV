
# 📋 Plan d'Action - 3 Points à Corriger

## ✅ RÉSUMÉ DES PROBLÈMES

### 1. ❌ Heures d'ouverture en dur sur la page Contact
**Problème** : Les heures (09:00-19:00, etc.) sont codées en dur, pas dynamiques
**Impact** : L'admin ne peut pas les modifier depuis le dashboard
**Solution** : Ajouter les heures d'ouverture dans les paramètres du site

### 2. ❌ Navbar manquante sur la page Messages de Contact (admin)
**Problème** : La page `/dashboard/messages` n'utilise pas le DashboardLayout
**Impact** : Pas de navigation, l'admin est bloqué sur la page
**Solution** : Wrapper la page avec DashboardLayout

### 3. ❌ Système de paiement non implémenté
**Problème** : Pas de flux de paiement pour la boutique
**Impact** : Impossible d'acheter des produits
**Solution** : Intégrer FedaPay pour les paiements

---

## 🔧 ACTIONS À RÉALISER

### Action 1 : Rendre les heures d'ouverture dynamiques

**Étapes :**
1. Ajouter les paramètres d'heures dans la migration `site_settings`
2. Ajouter les champs dans la page `/dashboard/settings`
3. Utiliser ces données sur la page Contact

**Paramètres à ajouter :**
```
- hours_monday_friday : "09:00 — 19:00"
- hours_saturday : "10:00 — 18:00"  
- hours_sunday : "Fermé"
```

---

### Action 2 : Ajouter DashboardLayout à ContactMessages

**Fichier à modifier :** `frontend/src/pages/admin/ContactMessages.jsx`

**Changement :**
```jsx
// AVANT
const ContactMessages = () => {
    return (
        <div className="p-8">
            {/* contenu */}
        </div>
    );
};

// APRÈS
import DashboardLayout from '../../layouts/DashboardLayout';

const ContactMessages = () => {
    return (
        <DashboardLayout>
            <div className="p-8">
                {/* contenu */}
            </div>
        </DashboardLayout>
    );
};
```

---

### Action 3 : Intégrer FedaPay pour les paiements

**Composants à créer :**
1. Backend : Controller de paiement
2. Backend : Routes API paiement
3. Frontend : Page panier (Cart)
4. Frontend : Page checkout
5. Frontend : Intégration FedaPay

**Flux de paiement :**
```
1. Client ajoute produits au panier
2. Client va au checkout
3. Client clique "Payer"
4. Redirection vers FedaPay
5. Client paie
6. Callback vers notre API
7. Création de la commande
8. Email de confirmation
```

---

## 📊 PRIORITÉS

### 🔴 URGENT (À faire maintenant)
1. **Action 2** : Ajouter DashboardLayout (5 minutes)
   - Bloque la navigation admin

### 🟡 IMPORTANT (À faire aujourd'hui)
2. **Action 1** : Heures dynamiques (30 minutes)
   - Améliore la flexibilité

### 🟢 PLANIFIÉ (À faire cette semaine)
3. **Action 3** : Système de paiement (4-6 heures)
   - Fonctionnalité complète

---

## 🚀 ORDRE D'EXÉCUTION RECOMMANDÉ

### Maintenant (5 min)
✅ Corriger la navbar sur ContactMessages

### Aujourd'hui (30 min)
✅ Rendre les heures d'ouverture dynamiques

### Cette semaine (6h)
✅ Implémenter le système de paiement FedaPay

---

## 📝 DÉTAILS TECHNIQUES

### FedaPay - Informations

**Documentation** : https://docs.fedapay.com/

**Clés API nécessaires :**
- Public Key (frontend)
- Secret Key (backend)

**Modes :**
- Sandbox (test)
- Live (production)

**Méthodes de paiement supportées :**
- Mobile Money (MTN, Moov, etc.)
- Cartes bancaires
- Virements

**Webhooks :**
- transaction.approved
- transaction.canceled
- transaction.failed

---

## ✅ CHECKLIST

### Action 1 : Heures dynamiques
- [ ] Migration : Ajouter 3 champs heures
- [ ] Exécuter migration
- [ ] Ajouter champs dans SiteSettings.jsx
- [ ] Utiliser dans Contact.jsx
- [ ] Tester

### Action 2 : Navbar Messages
- [ ] Importer DashboardLayout
- [ ] Wrapper le composant
- [ ] Tester navigation

### Action 3 : Paiement FedaPay
- [ ] Créer compte FedaPay
- [ ] Obtenir clés API
- [ ] Backend : Model Order
- [ ] Backend : Controller Payment
- [ ] Backend : Routes API
- [ ] Frontend : Context Cart
- [ ] Frontend : Page Cart
- [ ] Frontend : Page Checkout
- [ ] Frontend : Intégration FedaPay
- [ ] Webhooks
- [ ] Tests complets

---

## 🎯 RÉSULTAT ATTENDU

Après ces 3 actions :
1. ✅ Admin peut modifier les heures d'ouverture
2. ✅ Navigation fonctionne sur toutes les pages admin
3. ✅ Clients peuvent acheter des produits en ligne
4. ✅ Paiements sécurisés via FedaPay
5. ✅ Emails de confirmation automatiques

---

**Voulez-vous que je commence par quelle action ?**

1. 🔴 Corriger la navbar (5 min) - URGENT
2. 🟡 Heures dynamiques (30 min) - IMPORTANT  
3. 🟢 Paiement FedaPay (6h) - PLANIFIÉ
