import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, Loader2 } from 'lucide-react';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [verifying, setVerifying] = useState(true);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const transactionId = searchParams.get('id');
        if (transactionId) {
            axios.get(`/payments/verify/${transactionId}`)
                .then(response => {
                    setOrder(response.data.order);
                    clearCart();
                })
                .catch(() => {})
                .finally(() => setVerifying(false));
        }
    }, [searchParams, clearCart]);

    if (verifying) {
        return (
            <div className="min-h-screen bg-background-light flex items-center justify-center" style={{ paddingTop: '73px' }}>
                <Loader2 className="size-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light" style={{ paddingTop: '73px' }}>
            <Navbar />
            <div className="container mx-auto px-4 py-20 text-center max-w-2xl">
                <CheckCircle className="size-20 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4">Paiement réussi !</h1>
                <p className="text-lg mb-8">Votre commande #{order?.id} a été confirmée.</p>
                <button
                    onClick={() => navigate('/boutique')}
                    className="bg-primary text-white px-8 py-3 rounded-lg font-bold"
                >
                    Continuer vos achats
                </button>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentSuccess;
