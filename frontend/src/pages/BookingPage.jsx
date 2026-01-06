import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
    Calendar,
    Clock,
    MapPin,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Loader2,
    AlertCircle,
    User,
    Sparkles
} from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

const BookingPage = () => {
    const { slug } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [provider, setProvider] = useState(null);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [booked, setBooked] = useState(false);

    useEffect(() => {
        fetchProviderData();
    }, [slug]);

    useEffect(() => {
        if (selectedService && selectedDate) {
            fetchSlots();
        }
    }, [selectedService, selectedDate]);

    const fetchProviderData = async () => {
        try {
            const [pRes, sRes] = await Promise.all([
                api.get(`/booking/${slug}`),
                api.get(`/booking/${slug}/services`)
            ]);
            setProvider(pRes.data);
            setServices(sRes.data);
        } catch (error) {
            console.error('Error fetching provider data', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSlots = async () => {
        setSlotsLoading(true);
        try {
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const response = await api.get(`/booking/${slug}/slots?date=${dateStr}&service_id=${selectedService.id}`);
            setAvailableSlots(response.data);
            setSelectedSlot(null);
        } catch (error) {
            console.error('Error fetching slots', error);
        } finally {
            setSlotsLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setBookingLoading(true);
        try {
            await api.post(`/booking/${slug}/appointments`, {
                service_id: selectedService.id,
                date: format(selectedDate, 'yyyy-MM-dd'),
                start_time: selectedSlot,
            });
            setBooked(true);
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de la réservation');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Chargement...</p>
                </div>
            </div>
        );
    }

    if (booked) {
        return (
            <div className="flex h-screen flex-col items-center justify-center p-6 text-center">
                <div className="h-24 w-24 rounded-3xl bg-emerald-500/20 flex items-center justify-center mb-8 animate-pulse-glow">
                    <CheckCircle2 className="h-12 w-12 text-emerald-400" />
                </div>
                <h1 className="text-4xl font-black text-white mb-4">Réservation confirmée !</h1>
                <p className="text-slate-400 mb-10 text-lg max-w-md">
                    Votre rendez-vous a bien été enregistré. Vous recevrez une confirmation par email.
                </p>
                <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Voir mes rendez-vous
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-12">
            {/* Header */}
            <div className="relative h-72 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-slate-950"></div>
                <div className="orb orb-primary w-96 h-96 -top-48 -left-48"></div>
                <div className="orb orb-purple w-80 h-80 -top-20 -right-40"></div>

                <div className="container mx-auto h-full flex items-end p-6 md:p-12 relative">
                    <div className="flex flex-col md:flex-row items-center gap-6 animate-fade-in-up">
                        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                            <span className="text-4xl font-black text-white">{provider?.business_name?.charAt(0)}</span>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{provider?.business_name}</h1>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 mt-3 font-medium">
                                <MapPin className="h-4 w-4" />
                                <span>{provider?.city}, {provider?.address}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto p-6 md:p-12">
                {!selectedService ? (
                    /* Service Selection */
                    <div className="animate-fade-in-up">
                        <div className="mb-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-5 w-5 text-indigo-400" />
                                <span className="text-sm font-semibold text-indigo-400">Étape 1</span>
                            </div>
                            <h2 className="text-3xl font-black text-white">Choisissez un service</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service, index) => (
                                <button
                                    key={service.id}
                                    onClick={() => setSelectedService(service)}
                                    className={`glass-card p-6 text-left transition-all hover:border-indigo-500/30 group animate-fade-in-up stagger-${(index % 5) + 1}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase border border-indigo-500/20">
                                            {service.category || 'Service'}
                                        </div>
                                        <span className="text-2xl font-black gradient-text-primary">{service.price}€</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{service.name}</h3>
                                    <p className="text-slate-500 text-sm line-clamp-2 mb-6">{service.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                                            <Clock className="h-4 w-4" />
                                            <span>{service.duration} min</span>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Date & Time Selection */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in-up">
                        <div className="lg:col-span-8">
                            <div className="flex items-center gap-4 mb-10">
                                <button
                                    onClick={() => setSelectedService(null)}
                                    className="h-12 w-12 rounded-xl glass-card-light flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Sparkles className="h-4 w-4 text-indigo-400" />
                                        <span className="text-xs font-semibold text-indigo-400">Étape 2</span>
                                    </div>
                                    <h2 className="text-2xl font-black text-white">Choisissez une date & heure</h2>
                                </div>
                            </div>

                            {/* Date Picker */}
                            <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide">
                                {[...Array(14)].map((_, i) => {
                                    const day = addDays(new Date(), i);
                                    const isSelected = isSameDay(day, selectedDate);
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedDate(day)}
                                            className={`
                        flex flex-col items-center justify-center min-w-[80px] h-24 rounded-2xl border-2 transition-all shrink-0
                        ${isSelected
                                                    ? 'bg-gradient-to-b from-indigo-500 to-indigo-600 border-indigo-400 shadow-lg shadow-indigo-500/30'
                                                    : 'glass-card-light border-transparent hover:border-slate-700'}
                      `}
                                        >
                                            <span className={`text-xs font-bold uppercase tracking-widest ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                                                {format(day, 'EEE', { locale: fr })}
                                            </span>
                                            <span className={`text-2xl font-black mt-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                                {format(day, 'd')}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Slots Grid */}
                            <div className="mt-8">
                                {slotsLoading ? (
                                    <div className="flex h-32 items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                                    </div>
                                ) : availableSlots.length > 0 ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                        {availableSlots.map(slot => (
                                            <button
                                                key={slot}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`
                          h-12 rounded-xl border-2 font-bold transition-all
                          ${selectedSlot === slot
                                                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                                        : 'glass-card-light border-transparent text-slate-400 hover:border-indigo-500/30 hover:text-white'}
                        `}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="glass-card border-2 border-dashed border-slate-800 p-12 text-center">
                                        <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-4">
                                            <AlertCircle className="h-7 w-7 text-slate-700" />
                                        </div>
                                        <p className="text-slate-500 font-medium">Aucun créneau disponible pour cette date.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Summary Side */}
                        <div className="lg:col-span-4">
                            <div className="glass-card p-8 sticky top-8">
                                <h3 className="text-xl font-bold text-white mb-6">Récapitulatif</h3>

                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="h-6 w-6 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Service</p>
                                            <p className="font-bold text-white text-lg">{selectedService.name}</p>
                                            <p className="text-sm text-slate-400">{selectedService.duration} min • {selectedService.price}€</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                                            <Calendar className="h-6 w-6 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Date & Heure</p>
                                            <p className="font-bold text-white text-lg">{format(selectedDate, 'd MMMM yyyy', { locale: fr })}</p>
                                            <p className="text-sm text-slate-400">{selectedSlot ? `À ${selectedSlot}` : 'Heure non choisie'}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    disabled={!selectedSlot || bookingLoading}
                                    onClick={handleBooking}
                                    className="btn-primary w-full h-14 mt-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {bookingLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    ) : (
                                        user ? 'Confirmer la réservation' : 'Connectez-vous pour réserver'
                                    )}
                                </button>

                                {!user && (
                                    <p className="text-center text-slate-500 text-xs mt-4">
                                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Se connecter</Link> ou{' '}
                                        <Link to="/register" className="text-indigo-400 hover:text-indigo-300">créer un compte</Link>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingPage;
