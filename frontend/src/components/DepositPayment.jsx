import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Button, Card } from './ui';
import api from '../api/axios';

const DepositPayment = ({ service, onPaymentSuccess, onSkip }) => {
    const { t } = useTranslation();
    const [depositSettings, setDepositSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/site-settings');
                const settings = response.data;
                
                const depositEnabled = settings.find(s => s.key === 'deposit_enabled')?.value === 'true';
                const depositPercentage = parseInt(settings.find(s => s.key === 'deposit_percentage')?.value || '30');
                
                setDepositSettings({
                    enabled: depositEnabled,
                    percentage: depositPercentage
                });
            } catch (error) {
                console.error('Error loading deposit settings:', error);
                setDepositSettings({ enabled: false, percentage: 30 });
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    if (loading) {
        return (
            <Card className="p-8">
                <div className="flex items-center justify-center">
                    <Loader className="size-6 animate-spin text-primary" />
                </div>
            </Card>
        );
    }

    if (!depositSettings?.enabled) {
        // Si l'acompte n'est pas activé, on skip
        if (onSkip) onSkip();
        return null;
    }

    const totalAmount = service.price;
    const depositAmount = Math.round(totalAmount * depositSettings.percentage / 100);
    const remainingAmount = totalAmount - depositAmount;

    const handlePayment = async () => {
        setPaying(true);
        setError('');

        try {
            // Créer la transaction FedaPay
            const response = await api.post('/payments/create', {
                amount: depositAmount,
                description: `Acompte pour ${service.name}`,
                callback_url: window.location.origin + '/payment/callback'
            });

            const { checkout_url, transaction_id } = response.data;

            // Sauvegarder le transaction_id pour le récupérer après le paiement
            sessionStorage.setItem('pending_transaction_id', transaction_id);
            sessionStorage.setItem('pending_service_id', service.id);

            // Rediriger vers FedaPay
            window.location.href = checkout_url;
        } catch (error) {
            console.error('Payment error:', error);
            setError(error.response?.data?.message || t('payment.error', { defaultValue: 'Erreur lors du paiement' }));
            setPaying(false);
        }
    };

    return (
        <Card className="p-8 space-y-6 border-2 border-primary/20">
            {/* Header */}
            <div className="flex items-center gap-3 text-primary">
                <CreditCard className="size-6" />
                <h3 className="text-2xl font-display font-bold italic">
                    {t('payment.deposit_required', { defaultValue: 'Acompte requis' })}
                </h3>
            </div>

            {/* Info Box */}
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                <div className="flex items-start gap-3">
                    <AlertCircle className="size-5 text-primary mt-1 flex-shrink-0" />
                    <div className="space-y-2">
                        <p className="text-sm text-maroon-dark dark:text-text-light font-semibold">
                            {t('payment.deposit_info', { 
                                defaultValue: 'Un acompte est requis pour confirmer votre réservation' 
                            })}
                        </p>
                        <p className="text-xs text-accent-bronze">
                            {t('payment.deposit_explanation', { 
                                defaultValue: 'Le reste sera à régler au salon le jour de votre rendez-vous' 
                            })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Montants */}
            <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-maroon-dark/10">
                    <span className="text-accent-bronze">
                        {t('payment.service', { defaultValue: 'Service' })}
                    </span>
                    <span className="font-semibold text-maroon-dark dark:text-text-light">
                        {service.name}
                    </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-maroon-dark/10">
                    <span className="text-accent-bronze">
                        {t('payment.total_amount', { defaultValue: 'Montant total' })}
                    </span>
                    <span className="text-xl font-bold text-maroon-dark dark:text-text-light">
                        {totalAmount.toLocaleString()} FCFA
                    </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b-2 border-primary/30">
                    <div>
                        <span className="text-primary font-bold">
                            {t('payment.deposit_to_pay', { defaultValue: 'Acompte à payer' })}
                        </span>
                        <span className="text-xs text-accent-bronze ml-2">
                            ({depositSettings.percentage}%)
                        </span>
                    </div>
                    <span className="text-3xl font-display font-black italic text-primary">
                        {depositAmount.toLocaleString()} FCFA
                    </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                    <span className="text-accent-bronze">
                        {t('payment.remaining_at_salon', { defaultValue: 'Reste à payer au salon' })}
                    </span>
                    <span className="text-xl font-semibold text-maroon-dark dark:text-text-light">
                        {remainingAmount.toLocaleString()} FCFA
                    </span>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="size-5 text-rose-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-rose-700">{error}</p>
                </div>
            )}

            {/* Payment Button */}
            <Button
                variant="primary"
                size="lg"
                onClick={handlePayment}
                disabled={paying}
                className="w-full h-16 text-lg shadow-2xl shadow-primary/30"
            >
                {paying ? (
                    <>
                        <Loader className="size-5 animate-spin mr-2" />
                        {t('payment.processing', { defaultValue: 'Traitement...' })}
                    </>
                ) : (
                    <>
                        <CreditCard className="size-5 mr-2" />
                        {t('payment.pay_deposit', { defaultValue: 'Payer l\'acompte' })} - {depositAmount.toLocaleString()} FCFA
                    </>
                )}
            </Button>

            {/* Secure Payment Info */}
            <div className="flex items-center justify-center gap-2 text-xs text-accent-bronze">
                <CheckCircle className="size-4" />
                <span>{t('payment.secure', { defaultValue: 'Paiement sécurisé par FedaPay' })}</span>
            </div>
        </Card>
    );
};

export default DepositPayment;
