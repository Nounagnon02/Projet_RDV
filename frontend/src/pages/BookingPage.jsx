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
    AlertCircle
} from 'lucide-react';
import { format, addDays, isSameDay, startOfDay } from 'date-fns';
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
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (booked) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center">
                <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Réservation confirmée !</h1>
                <p className="text-slate-400 mb-8">Votre rendez-vous a bien été enregistré. Vous recevrez une notification prochainement.</p>
                <Link to="/dashboard" className="px-8 py-3 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-700 transition">
                    Voir mes rendez-vous
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 pb-12">
            {/* Header */}
            <div className="relative h-64 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950"></div>
                <div className="absolute inset-0 bg-indigo-600/20"></div>
                <div className="container mx-auto h-full flex items-end p-6 md:p-12 relative">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="h-24 w-24 rounded-3xl bg-slate-800 border-4 border-slate-950 flex items-center justify-center overflow-hidden">
                            <span className="text-4xl font-bold text-indigo-500">{provider?.business_name?.charAt(0)}</span>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-black text-white tracking-tight">{provider?.business_name}</h1>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 mt-2 font-medium">
                                <MapPin className="h-4 w-4" />
                                <span>{provider?.city}, {provider?.address}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Services Selection */}
                <div className="lg:col-span-12">
                    {!selectedService ? (
                        <div className="animate-in fade-in duration-500">
                            <h2 className="text-2xl font-bold text-white mb-8">Nos Services</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {services.map(service => (
                                    <button
                                        key={service.id}
                                        onClick={() => setSelectedService(service)}
                                        className="flex flex-col p-6 rounded-3xl border border-slate-800 bg-slate-900 text-left transition-all hover:border-indigo-500/50 hover:bg-slate-900/50 group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="px-3 py-1 rounded-full bg-indigo-600/10 text-indigo-400 text-xs font-bold uppercase">
                                                {service.category || 'Service'}
                                            </div>
                                            <span className="text-2xl font-black text-white">{service.price}€</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{service.name}</h3>
                                        <p className="text-slate-400 text-sm line-clamp-2 mb-6">{service.description}</p>
                                        <div className="mt-auto flex items-center gap-2 text-slate-500 font-medium">
                                            <Clock className="h-4 w-4" />
                                            <span>{service.duration} min</span>
                                            <ChevronRight className="ml-auto h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-left duration-500 grid grid-cols-1 lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <button
                                        onClick={() => setSelectedService(null)}
                                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <h2 className="text-2xl font-bold text-white">Choisir une date & heure</h2>
                                </div>

                                {/* Date Picker */}
                                <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                                    {[...Array(14)].map((_, i) => {
                                        const day = addDays(new Date(), i);
                                        const isSelected = isSameDay(day, selectedDate);
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedDate(day)}
                                                className={`
                          flex flex-col items-center justify-center min-w-[80px] h-24 rounded-2xl border transition-all
                          ${isSelected ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-600/30' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}
                        `}
                                            >
                                                <span className={`text-xs font-bold uppercase tracking-widest ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
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
                            h-12 rounded-xl border font-bold transition-all
                            ${selectedSlot === slot ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-indigo-500/50 hover:text-slate-200'}
                          `}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-12 text-center bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-800">
                                            <AlertCircle className="h-10 w-10 text-slate-700 mx-auto mb-4" />
                                            <p className="text-slate-500 font-medium">Aucun créneau disponible pour cette date.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Summary Side */}
                            <div className="lg:col-span-4">
                                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl sticky top-8">
                                    <h3 className="text-xl font-bold text-white mb-6">Récapitulatif</h3>

                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-indigo-600/10 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="h-6 w-6 text-indigo-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Service</p>
                                                <p className="font-bold text-white text-lg">{selectedService.name}</p>
                                                <p className="text-sm text-slate-400">{selectedService.duration} min • {selectedService.price}€</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
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
                                        className="mt-10 h-14 w-full rounded-2xl bg-indigo-600 font-black text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                                    >
                                        {bookingLoading ? (
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                        ) : (
                                            user ? 'Confirmer la réservation' : 'Connectez-vous pour réserver'
                                        )}
                                    </button>
                                    <p className="text-[10px] text-slate-600 text-center mt-4">
                                        En confirmant, vous acceptez nos conditions générales d'utilisation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
