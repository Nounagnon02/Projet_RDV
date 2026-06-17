import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button, Card } from '../components/ui';
import {
    ArrowRight,
    ArrowLeft,
    Clock,
    CheckCircle2,
    Loader2,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    AlertCircle,
    MapPin
} from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';

const BookingGlobal = () => {
    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const dateLocale = i18n.language === 'en' ? enUS : fr;

    const [service, setService] = useState(null);
    const [services, setServices] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [guestName, setGuestName] = useState('');
    const [guestWhatsapp, setGuestWhatsapp] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState('service'); // service → datetime → payment → success
    const [appointmentId, setAppointmentId] = useState(null);

    // Charger tous les services au montage
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('/services');
                setServices(response.data);

                const serviceId = searchParams.get('service');
                if (serviceId) {
                    const found = response.data.find(s => s.id === parseInt(serviceId));
                    if (found) {
                        setService(found);
                        setStep('datetime');
                    }
                }
            } catch (error) {
                console.error('Error loading services:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [searchParams]);

    // Charger les créneaux quand la date ou le service change
    useEffect(() => {
        if (service && selectedDate) {
            fetchGlobalSlots();
        }
    }, [service, selectedDate]);

    const fetchGlobalSlots = async () => {
        setSlotsLoading(true);
        setSelectedSlot(null);
        try {
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const response = await api.get(`/global-slots?service_id=${service.id}&date=${dateStr}`);
            setAvailableSlots(response.data);
            if (response.data.length === 0) {
                setError(t('booking.no_slots', { defaultValue: 'Aucun créneau disponible pour cette date.' }));
            } else {
                setError('');
            }
        } catch (error) {
            console.error('Error fetching slots:', error);
            setError(t('booking.error_slots', { defaultValue: 'Erreur lors du chargement des créneaux.' }));
        } finally {
            setSlotsLoading(false);
        }
    };

    const handleServiceSelect = (svc) => {
        setService(svc);
        setStep('datetime');
        setSelectedSlot(null);
        setError('');
    };

    const handleConfirmBooking = async () => {
        if (!guestName.trim() || !guestWhatsapp.trim()) {
            setError(t('booking.alert_guest_required', { defaultValue: 'Veuillez renseigner votre nom et numéro WhatsApp.' }));
            return;
        }

        setBookingLoading(true);
        setError('');

        try {
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const callbackUrl = window.location.origin + '/booking/success';

            const response = await api.post('/global-book', {
                service_id: service.id,
                date: dateStr,
                start_time: selectedSlot,
                guest_name: guestName,
                guest_whatsapp: guestWhatsapp,
                callback_url: callbackUrl,
            });

            const data = response.data;

            if (data.checkout_url) {
                // Stocker l'appointment ID pour récupération après paiement
                sessionStorage.setItem('pending_appointment_id', data.appointment_id);
                sessionStorage.setItem('pending_transaction_id', data.transaction_id);

                // Rediriger vers FedaPay
                window.location.href = data.checkout_url;
            } else {
                setError(data.message || t('booking.payment_error', { defaultValue: 'Erreur de paiement.' }));
                setBookingLoading(false);
            }
        } catch (error) {
            setError(error.response?.data?.message || t('booking.alert_error', { defaultValue: 'Erreur lors de la réservation.' }));
            setBookingLoading(false);
        }
    };

    // =========== RENDU ===========

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background-light">
                <div className="text-center animate-fade-in">
                    <Loader2 className="size-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="font-display italic text-maroon-dark text-lg">{t('booking.loading', { defaultValue: "L'excellence patiente..." })}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light text-maroon-dark font-display" style={{ paddingTop: '73px' }}>
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">
                        {t('booking.experience', { defaultValue: 'Experience' })}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-display font-bold italic text-maroon-dark dark:text-text-light mb-4">
                        {t('booking.hero_title', { defaultValue: 'Réservez votre soin' })}
                    </h1>
                    <p className="text-accent-bronze text-lg italic">
                        {t('booking.services_subtitle', { defaultValue: "Une experience personnalisée, gravée dans l'excellence." })}
                    </p>
                </div>

                {/* Step 1: Service Selection */}
                {step === 'service' && (
                    <div className="animate-fade-in space-y-6 max-w-2xl mx-auto">
                        <h2 className="text-2xl font-display font-bold italic mb-6">
                            {t('booking.choose_service', { defaultValue: 'Choisissez votre service' })}
                        </h2>
                        <div className="space-y-4">
                            {services.map((svc) => (
                                <button
                                    key={svc.id}
                                    onClick={() => handleServiceSelect(svc)}
                                    className="w-full text-left group"
                                >
                                    <div className="bg-white border border-maroon-dark/5 p-6 rounded-xl shadow-sm hover:shadow-xl hover:border-primary/30 transition-all flex items-center justify-between group-hover:bg-primary group-hover:text-white duration-500">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 group-hover:text-white/60 mb-1">
                                                {svc.category || t('booking.experience', { defaultValue: 'Soin' })}
                                            </p>
                                            <h3 className="text-xl font-display italic font-medium">{svc.name}</h3>
                                            <p className="text-xs font-bold mt-2 opacity-40 uppercase tracking-widest">{svc.duration} MIN</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-display font-medium italic text-primary group-hover:text-white">
                                                {Math.round(svc.price).toLocaleString('fr-FR')} FCFA
                                            </p>
                                            <ArrowRight className="size-5 mt-2 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Date & Time Selection */}
                {step === 'datetime' && (
                    <div className="animate-fade-in max-w-2xl mx-auto">
                        <button
                            onClick={() => { setStep('service'); setSelectedSlot(null); setError(''); }}
                            className="flex items-center gap-2 text-primary mb-6 group"
                        >
                            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('booking.back', { defaultValue: 'Retour' })}</span>
                        </button>

                        {/* Service Summary */}
                        <Card className="p-6 mb-8 bg-primary/5 border border-primary/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-black text-primary mb-1">
                                        {t('booking.service', { defaultValue: 'Service' })}
                                    </p>
                                    <h3 className="text-2xl font-display font-bold italic">{service.name}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-widest font-black text-primary mb-1">
                                        {t('booking.price', { defaultValue: 'Prix' })}
                                    </p>
                                    <p className="text-2xl font-display font-black italic text-primary">
                                        {Math.round(service.price).toLocaleString('fr-FR')} FCFA
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Calendar */}
                        <h2 className="text-2xl md:text-3xl font-display font-bold italic mb-2">
                            {t('booking.select_datetime', { defaultValue: 'Choisissez votre date' })}
                        </h2>
                        <p className="text-accent-bronze mb-8 italic">
                            {t('booking.select_datetime_desc', { defaultValue: 'Votre transformation commence par le bon moment.' })}
                        </p>

                        <div className="bg-white rounded-2xl shadow-xl border border-maroon-dark/5 p-8 mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold font-display italic capitalize">
                                    {format(selectedDate, 'MMMM yyyy', { locale: dateLocale })}
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                                        className="p-2 hover:bg-maroon-dark/5 rounded-full transition-colors"
                                    >
                                        <ChevronLeft className="size-5" />
                                    </button>
                                    <button
                                        onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                                        className="p-2 hover:bg-maroon-dark/5 rounded-full transition-colors"
                                    >
                                        <ChevronRight className="size-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 text-center gap-y-2">
                                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                                    <div key={day} className="text-[9px] font-black uppercase tracking-[0.2em] text-maroon-dark/40 py-2">{day}</div>
                                ))}
                                {[...Array(21)].map((_, i) => {
                                    const day = addDays(new Date(), i);
                                    const isSelected = isSameDay(day, selectedDate);
                                    const isToday = isSameDay(day, new Date());
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => setSelectedDate(day)}
                                            className={`py-3 font-bold text-sm cursor-pointer rounded-lg transition-all relative ${
                                                isSelected
                                                    ? 'bg-primary text-white shadow-lg'
                                                    : isToday
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'hover:bg-maroon-dark/5 text-maroon-dark/80'
                                            }`}
                                        >
                                            {format(day, 'd')}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Slots */}
                        <div className="mb-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-maroon-dark/40 mb-6">
                                {t('booking.available_slots', { defaultValue: 'Créneaux disponibles' })}
                            </h3>

                            {slotsLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="size-8 animate-spin text-primary" />
                                </div>
                            ) : availableSlots.length > 0 ? (
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                    {availableSlots.map(slot => (
                                        <button
                                            key={slot}
                                            onClick={() => { setSelectedSlot(slot); setError(''); }}
                                            className={`py-4 rounded-xl border font-bold text-sm transition-all ${
                                                selectedSlot === slot
                                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                                    : 'bg-white border-maroon-dark/5 hover:border-primary/50 hover:shadow-md'
                                            }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center bg-maroon-dark/5 rounded-2xl border border-dashed border-maroon-dark/10">
                                    <Clock className="size-8 mx-auto text-maroon-dark/20 mb-3" />
                                    <p className="text-accent-bronze italic text-sm">
                                        {t('booking.searching_slots', { defaultValue: 'Aucun créneau disponible pour cette date.' })}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Error Messages */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 mb-6">
                                <AlertCircle className="size-5 text-red-600 mt-0.5 shrink-0" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Guest Info */}
                        <div className="bg-white border border-primary/20 rounded-2xl p-6 shadow-lg mb-6">
                            <h4 className="text-sm font-black uppercase tracking-widest text-maroon-dark mb-4">
                                {t('booking.quick_finalize', { defaultValue: 'Vos informations' })}
                            </h4>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder={t('booking.full_name', { defaultValue: 'Votre nom complet' })}
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    className="w-full h-12 px-4 bg-accent-cream/30 border border-maroon-dark/10 rounded-xl text-sm font-bold placeholder:text-maroon-dark/30 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                                <input
                                    type="tel"
                                    placeholder={t('booking.whatsapp_number', { defaultValue: 'Numéro WhatsApp (ex: +229...)' })}
                                    value={guestWhatsapp}
                                    onChange={(e) => setGuestWhatsapp(e.target.value)}
                                    className="w-full h-12 px-4 bg-accent-cream/30 border border-maroon-dark/10 rounded-xl text-sm font-bold placeholder:text-maroon-dark/30 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                                <p className="text-[10px] text-accent-bronze italic">
                                    {t('booking.no_account_needed', { defaultValue: "Pas besoin de compte. Nous vous contacterons sur WhatsApp pour confirmation." })}
                                </p>
                            </div>
                        </div>

                        {/* CTA */}
                        <Button
                            disabled={!selectedSlot || bookingLoading || !guestName.trim() || !guestWhatsapp.trim()}
                            onClick={handleConfirmBooking}
                            variant="primary"
                            className="w-full h-16 text-sm font-black uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3"
                        >
                            {bookingLoading ? (
                                <Loader2 className="size-5 animate-spin" />
                            ) : (
                                <>
                                    <CreditCard className="size-5" />
                                    {t('booking.book_and_pay', { defaultValue: 'Réserver et payer 50% d\'acompte' })}
                                    <ArrowRight className="size-5" />
                                </>
                            )}
                        </Button>
                    </div>
                )}

                {/* Step 3: Success */}
                {step === 'success' && (
                    <div className="text-center animate-fade-in max-w-lg mx-auto py-16">
                        <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/10">
                            <CheckCircle2 className="size-12 text-primary" />
                        </div>
                        <h1 className="text-4xl font-display font-bold italic mb-4">
                            {t('booking.success_title', { defaultValue: 'Paiement réussi !' })}
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
            </main>

            <Footer />
        </div>
    );
};

export default BookingGlobal;
