import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui';
import { CheckCircle2, Loader2, AlertCircle, XCircle } from 'lucide-react';

const BookingSuccess = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying'); // verifying → success | error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const confirmPayment = async () => {
            const appointmentId = sessionStorage.getItem('pending_appointment_id');
            const storedTransactionId = sessionStorage.getItem('pending_transaction_id');
            const urlTransactionId = searchParams.get('transaction_id') || searchParams.get('id') || storedTransactionId;

            if (!appointmentId) {
                setStatus('error');
                setMessage(t('booking.no_booking_found', { defaultValue: 'Aucune réservation en attente.' }));
                return;
            }

            try {
                const response = await api.post('/booking/confirm-payment', {
                    appointment_id: appointmentId,
                    transaction_id: urlTransactionId,
                });

                if (response.status === 200) {
                    setStatus('success');
                    setMessage(t('booking.payment_confirmed', { defaultValue: 'Paiement confirmé ! Votre rendez-vous est réservé.' }));
                    // Nettoyer le sessionStorage
                    sessionStorage.removeItem('pending_appointment_id');
                    sessionStorage.removeItem('pending_transaction_id');
                } else {
                    setStatus('error');
                    setMessage(response.data?.message || t('booking.confirm_error', { defaultValue: 'Erreur lors de la confirmation.' }));
                }
            } catch (error) {
                console.error('Confirmation error:', error);
                setStatus('error');
                setMessage(error.response?.data?.message || t('booking.confirm_error', { defaultValue: 'Erreur lors de la confirmation du paiement.' }));
            }
        };

        confirmPayment();
    }, [searchParams, t]);

    return (
        <div className="min-h-screen bg-background-light" style={{ paddingTop: '73px' }}>
            <Navbar />

            <div className="max-w-lg mx-auto px-6 py-24 text-center">
                {status === 'verifying' && (
                    <div className="animate-fade-in">
                        <Loader2 className="size-16 animate-spin text-primary mx-auto mb-6" />
                        <h1 className="text-3xl font-display font-bold italic mb-4">
                            {t('booking.verifying', { defaultValue: 'Confirmation en cours...' })}
                        </h1>
                        <p className="text-accent-bronze italic">
                            {t('booking.verifying_desc', { defaultValue: 'Veuillez patienter pendant la confirmation de votre paiement.' })}
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="animate-fade-in">
                        <div className="size-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 className="size-12 text-green-600" />
                        </div>
                        <h1 className="text-4xl font-display font-bold italic mb-4 text-green-700">
                            {t('booking.success_title', { defaultValue: 'Rendez-vous confirmé !' })}
                        </h1>
                        <p className="text-accent-bronze text-lg mb-8 italic">
                            {t('booking.success_desc', { defaultValue: 'Votre rendez-vous est confirmé. Nous vous contacterons sur WhatsApp.' })}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link to="/">
                                <Button variant="primary" size="lg" className="h-14 px-10 font-bold uppercase tracking-widest text-[10px]">
                                    {t('booking.back_home', { defaultValue: 'Retour accueil' })}
                                </Button>
                            </Link>
                            <Link to="/services">
                                <Button variant="outline" size="lg" className="h-14 px-10 font-bold uppercase tracking-widest text-[10px] border-maroon-dark/10">
                                    {t('booking.new_booking', { defaultValue: 'Nouvelle réservation' })}
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="animate-fade-in">
                        <div className="size-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-8">
                            <XCircle className="size-12 text-red-500" />
                        </div>
                        <h1 className="text-3xl font-display font-bold italic mb-4 text-red-600">
                            {t('booking.error_title', { defaultValue: 'Erreur de confirmation' })}
                        </h1>
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 mb-8">
                            <AlertCircle className="size-5 text-red-600 mt-0.5 shrink-0" />
                            <p className="text-sm text-red-700">{message}</p>
                        </div>
                        <p className="text-accent-bronze mb-8 italic">
                            {t('booking.error_contact', { defaultValue: 'Contactez-nous via WhatsApp au +229 01 62 34 85 21 si le problème persiste.' })}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link to="/">
                                <Button variant="primary" size="lg" className="h-14 px-10 font-bold uppercase tracking-widest text-[10px]">
                                    {t('booking.back_home', { defaultValue: 'Retour accueil' })}
                                </Button>
                            </Link>
                            <Link to="/book">
                                <Button variant="outline" size="lg" className="h-14 px-10 font-bold uppercase tracking-widest text-[10px] border-maroon-dark/10">
                                    {t('booking.retry', { defaultValue: 'Réessayer' })}
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default BookingSuccess;
