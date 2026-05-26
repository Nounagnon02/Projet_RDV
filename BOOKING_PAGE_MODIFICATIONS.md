# Modifications à apporter à BookingPage.jsx

## 1. Ajouter les imports
```javascript
import DepositPayment from '../components/DepositPayment';
import { useSearchParams } from 'react-router-dom';
```

## 2. Ajouter les états
```javascript
const [searchParams] = useSearchParams();
const [showPayment, setShowPayment] = useState(false);
const [paymentCompleted, setPaymentCompleted] = useState(false);
const [transactionId, setTransactionId] = useState(null);
```

## 3. Pré-sélectionner le service depuis l'URL
```javascript
useEffect(() => {
    const serviceId = searchParams.get('service');
    if (serviceId && services.length > 0) {
        const service = services.find(s => s.id === parseInt(serviceId));
        if (service) {
            setSelectedService(service);
        }
    }
}, [searchParams, services]);
```

## 4. Modifier handleBooking pour vérifier le paiement
```javascript
const handleBooking = async () => {
    // Vérifier si l'acompte est requis
    const depositSettings = await checkDepositRequired();
    
    if (depositSettings.enabled && !paymentCompleted) {
        // Afficher le composant de paiement
        setShowPayment(true);
        return;
    }
    
    // Continuer avec la réservation normale
    // ... code existant
    
    // Ajouter le transaction_id si paiement effectué
    if (transactionId) {
        bookingData.payment_transaction_id = transactionId;
    }
};
```

## 5. Ajouter le composant DepositPayment avant le bouton de confirmation
```javascript
{showPayment && !paymentCompleted && (
    <DepositPayment
        service={selectedService}
        onPaymentSuccess={(txId) => {
            setPaymentCompleted(true);
            setTransactionId(txId);
            setShowPayment(false);
        }}
        onSkip={() => {
            setShowPayment(false);
        }}
    />
)}

{(!showPayment || paymentCompleted) && (
    <Button
        disabled={!selectedSlot || bookingLoading}
        onClick={handleBooking}
        // ... reste du code
    >
        {paymentCompleted 
            ? t('booking.confirm_with_deposit', { defaultValue: 'Confirmer la réservation' })
            : t('booking.continue_to_payment', { defaultValue: 'Continuer vers le paiement' })
        }
    </Button>
)}
```

## 6. Gérer le retour de paiement
Créer une page PaymentCallback.jsx pour gérer le retour de FedaPay
