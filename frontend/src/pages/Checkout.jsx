import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Loader2, CreditCard, Smartphone, ArrowLeft, ShieldCheck, ShoppingBag } from 'lucide-react';

const Checkout = () => {
    const { cart, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [transactionToken, setTransactionToken] = useState(null);
    const [fedapayConfig, setFedapayConfig] = useState(null);
    const [checkoutError, setCheckoutError] = useState('');
    const [shippingInfo, setShippingInfo] = useState({
        full_name: user?.name || '',
        delivery_location: '',
        phone: user?.phone || '',
        email: user?.email || '',
    });

    useEffect(() => {
        axios.get('/payments/public-key')
            .then(response => setFedapayConfig(response.data))
            .catch(() => {
                setCheckoutError('Configuration de paiement indisponible. Veuillez reessayer.');
            });
    }, []);

    const handleChange = (e) => {
        setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        setCheckoutError('');
        setLoading(true);

        try {
            const orderResponse = await axios.post('/orders', {
                items: cart.map(item => ({ product_id: item.id, quantity: item.quantity, price: item.price })),
                full_name: shippingInfo.full_name,
                delivery_location: shippingInfo.delivery_location,
                phone: shippingInfo.phone,
                email: shippingInfo.email || null,
                payment_method: 'fedapay'
            });

            const order = orderResponse.data;
            setOrderId(order.id);

            const callbackUrl = `${window.location.origin}/payment/success?order_id=${order.id}`;

            const paymentResponse = await axios.post('/payments/create', {
                order_id: order.id,
                callback_url: callbackUrl
            });

            if (!paymentResponse.data?.token) {
                throw new Error('Token de transaction manquant');
            }

            setTransactionToken(paymentResponse.data.token);
            setShowPayment(true);
        } catch (error) {
            setCheckoutError(error.response?.data?.message || 'Erreur lors de la creation de la commande.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = () => {
        clearCart();
        navigate(`/payment/success?order_id=${orderId}`);
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-background-light" style={{ paddingTop: '73px' }}>
                <Navbar />
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
                    <button onClick={() => navigate('/boutique')} className="bg-primary text-white px-6 py-3 rounded-lg">
                        Continuer vos achats
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    if (showPayment && transactionToken && fedapayConfig) {
        return (
            <div className="min-h-screen bg-background-light" style={{ paddingTop: '73px' }}>
                <Navbar />
                <div className="container mx-auto px-4 py-12 max-w-2xl">
                    <button
                        onClick={() => setShowPayment(false)}
                        className="flex items-center gap-2 text-accent-bronze hover:text-primary mb-6"
                    >
                        <ArrowLeft className="size-4" />
                        Retour
                    </button>

                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <h1 className="text-2xl font-bold mb-6 text-center">Paiement sécurisé</h1>
                        
                        <div className="mb-6 p-4 bg-primary/5 rounded-lg">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold">Commande</span>
                                <span>#{orderId}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-primary">
                                <span>Total</span>
                                <span>{total.toLocaleString()} FCFA</span>
                            </div>
                        </div>

                        <PaymentWidget
                            token={transactionToken}
                            publicKey={fedapayConfig.public_key}
                            mode={fedapayConfig.mode}
                            onSuccess={handlePaymentSuccess}
                        />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light" style={{ paddingTop: '73px' }}>
            <Navbar />
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="mb-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">Paiement securise</p>
                    <h1 className="text-4xl md:text-5xl font-display italic font-black text-maroon-dark mb-3">Finaliser la commande</h1>
                    <p className="text-accent-bronze italic">Renseignez vos informations de livraison pour continuer.</p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 bg-white rounded-2xl p-6 md:p-8 border border-maroon-dark/10 shadow-xl shadow-maroon-dark/5">
                        <h2 className="text-xl font-bold mb-4">Informations de livraison</h2>
                        {checkoutError && (
                            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                                {checkoutError}
                            </div>
                        )}
                        <form onSubmit={handleCreateOrder} className="space-y-4">
                            <input
                                name="full_name"
                                value={shippingInfo.full_name}
                                onChange={handleChange}
                                placeholder="Nom complet"
                                required
                                className="w-full px-4 py-3 rounded-lg border"
                            />
                            <input
                                name="delivery_location"
                                value={shippingInfo.delivery_location}
                                onChange={handleChange}
                                placeholder="Lieu de livraison"
                                required
                                className="w-full px-4 py-3 rounded-lg border"
                            />
                            <input
                                name="phone"
                                value={shippingInfo.phone}
                                onChange={handleChange}
                                placeholder="Téléphone"
                                required
                                className="w-full px-4 py-3 rounded-lg border"
                            />
                            <input
                                name="email"
                                type="email"
                                value={shippingInfo.email}
                                onChange={handleChange}
                                placeholder="Email (optionnel)"
                                className="w-full px-4 py-3 rounded-lg border"
                            />
                            <button
                                type="submit"
                                disabled={loading || !fedapayConfig}
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <CreditCard />}
                                {loading ? 'Traitement...' : 'Continuer vers le paiement'}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
                        <div className="bg-white rounded-2xl p-6 space-y-4 border border-maroon-dark/10 shadow-xl shadow-maroon-dark/5">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between">
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>{(item.price * item.quantity).toLocaleString()} FCFA</span>
                                </div>
                            ))}
                            <div className="border-t pt-4 font-bold text-lg flex justify-between">
                                <span>Total</span>
                                <span>{total.toLocaleString()} FCFA</span>
                            </div>
                            <div className="pt-2 text-xs text-accent-bronze flex items-center gap-2">
                                <ShieldCheck className="size-4 text-primary" />
                                Paiement traite via FedaPay
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

const PaymentWidget = ({ token, publicKey, mode, onSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState('mobile_money');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [processing, setProcessing] = useState(false);
    const [sdkReady, setSdkReady] = useState(false);

    const handlePayment = async () => {
        if (!phoneNumber) {
            alert('Veuillez entrer votre numéro de téléphone');
            return;
        }

        setProcessing(true);

        try {
            const FedaPay = window.FedaPay;
            if (!FedaPay) {
                throw new Error('SDK FedaPay non charge');
            }
            FedaPay.init({
                public_key: publicKey,
                transaction: {
                    id: token
                },
                customer: {
                    phone_number: phoneNumber
                },
                onComplete: (transaction) => {
                    if (transaction.status === 'approved') {
                        onSuccess();
                    } else {
                        alert('Paiement échoué');
                        setProcessing(false);
                    }
                }
            });

            FedaPay.open();
        } catch (error) {
            alert(error.message || 'Erreur lors du paiement');
            console.error(error);
            setProcessing(false);
        }
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://${mode}.fedapay.com/js/fedapay.min.js`;
        script.async = true;
        script.onload = () => setSdkReady(true);
        script.onerror = () => setSdkReady(false);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [mode]);

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-bold mb-3">Méthode de paiement</label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setPaymentMethod('mobile_money')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                            paymentMethod === 'mobile_money'
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 hover:border-primary/50'
                        }`}
                    >
                        <Smartphone className="size-8 mx-auto mb-2 text-primary" />
                        <div className="text-sm font-bold">Mobile Money</div>
                        <div className="text-xs text-accent-bronze">MTN, Moov</div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                            paymentMethod === 'card'
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 hover:border-primary/50'
                        }`}
                    >
                        <CreditCard className="size-8 mx-auto mb-2 text-primary" />
                        <div className="text-sm font-bold">Carte bancaire</div>
                        <div className="text-xs text-accent-bronze">Visa, Mastercard</div>
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold mb-2">Numéro de téléphone</label>
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="97 00 00 00"
                    className="w-full px-4 py-3 rounded-lg border"
                />
            </div>

            <button
                onClick={handlePayment}
                disabled={processing || !sdkReady}
                className="w-full bg-primary text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2"
            >
                {processing ? (
                    <>
                        <Loader2 className="animate-spin" />
                        Traitement en cours...
                    </>
                ) : (
                    <>
                        <CreditCard />
                        {sdkReady ? 'Payer maintenant' : 'Chargement du paiement...'}
                    </>
                )}
            </button>
        </div>
    );
};

export default Checkout;
