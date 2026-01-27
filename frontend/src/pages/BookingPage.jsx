import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Button, Card } from '../components/ui';
import {
    ArrowLeft,
    ArrowRight,
    MapPin,
    Clock,
    Sparkles,
    CheckCircle2,
    Loader2,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    ShoppingCart
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
    const [guestName, setGuestName] = useState('');
    const [guestWhatsapp, setGuestWhatsapp] = useState('');

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
        if (!user && (!guestName || !guestWhatsapp)) {
            alert('Veuillez renseigner votre nom et numéro WhatsApp pour continuer.');
            return;
        }

        setBookingLoading(true);
        try {
            const bookingData = {
                service_id: selectedService.id,
                date: format(selectedDate, 'yyyy-MM-dd'),
                start_time: selectedSlot,
            };

            if (!user) {
                bookingData.guest_name = guestName;
                bookingData.guest_whatsapp = guestWhatsapp;
            }

            await api.post(`/booking/${slug}/appointments`, bookingData);
            setBooked(true);
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de la réservation');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#fbfaf9]">
                <div className="text-center">
                    <Loader2 className="size-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="font-display italic text-maroon-dark">L'excellence patiente...</p>
                </div>
            </div>
        );
    }

    if (booked) {
        return (
            <div className="flex h-screen flex-col items-center justify-center p-6 text-center bg-background-light">
                <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 animate-fade-in shadow-2xl shadow-primary/10">
                    <CheckCircle2 className="size-12 text-primary" />
                </div>
                <h1 className="text-5xl font-display font-medium italic text-maroon-dark mb-4">Votre transformation est réservée</h1>
                <p className="text-maroon-dark/60 mb-10 text-lg max-w-md italic">
                    Un email de confirmation premium vous a été envoyé. Elsa et son équipe ont hâte de vous sublimer.
                </p>
                <div className="flex gap-4">
                    <Link to="/client/appointments">
                        <Button variant="primary" size="lg" className="h-16 px-10 rounded-xl font-bold uppercase tracking-widest text-[10px]">MES RENDEZ-VOUS</Button>
                    </Link>
                    <Link to="/">
                        <Button variant="outline" size="lg" className="h-16 px-10 rounded-xl border-maroon-dark/10 font-bold uppercase tracking-widest text-[10px]">RETOUR ACCUEIL</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#fbfaf9] text-maroon-dark font-display">
            {/* Left Side: Exact Mockup Experience Block */}
            <div className="hidden lg:block lg:w-1/2 relative min-h-screen">
                <div className="absolute inset-0 bg-cover bg-center overflow-hidden">
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvTunoiR7eLLiAim1GPXRv6kgUzHF2T_nlaqkRRCJDxwMgqQoXqt01KS4VOALgf35vgMDT7c2JOF_3p3O6IWOpahArNkySge8exD1TD8pDZcEmDVXb832o0vA_CiuliQTn-8hlJ_-xnhqtg0s-RV8bcWQqPVGTsU8i34C4dzvBCT6MifXXVBTo4SA83HGfqQbeFH5nYfR9FtOJ9MIIfG7Vh80_iFnLGuEauGurBxqGcf39X41LqFHnm8wV7n1kAXZLpZwmoIsXzbM"
                        className="size-full object-cover"
                        alt="The Experience"
                    />
                    <div className="absolute inset-0 bg-maroon-dark/20"></div>
                </div>
                <div className="absolute bottom-16 left-16 right-16 text-white z-10 animate-fade-in-up">
                    <p className="text-primary uppercase tracking-[0.4em] font-black text-xs mb-4">The Experience</p>
                    <h2 className="text-6xl font-display font-medium leading-tight mb-8">Artistry Tailored to Your Crown</h2>
                    <div className="flex items-center gap-6">
                        <div className="h-px w-16 bg-primary"></div>
                        <p className="text-xl italic opacity-90">Luxury Goddess Braids Selection</p>
                    </div>
                </div>

                {/* Brand Logo Over Image */}
                <Link to="/" className="absolute top-10 left-16 z-20 flex items-center gap-3 text-white">
                    <span className="material-symbols-outlined text-primary text-3xl">flare</span>
                    <h1 className="text-2xl font-bold tracking-tight">Elsa Coiffure</h1>
                </Link>
            </div>

            {/* Right Side: Step-by-Step Selection */}
            <div className="flex-1 overflow-y-auto px-8 py-12 lg:p-16">
                <div className="max-w-xl mx-auto space-y-12">
                    {!selectedService ? (
                        /* Step 1: Services Panel */
                        <div className="animate-fade-in-up">
                            <div className="flex items-center gap-2 text-primary mb-2">
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                <Link to="/" className="text-xs font-black uppercase tracking-widest hover:underline">RETOUR ACCUEIL</Link>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold italic mb-6">Nos Prestations Signature</h2>
                            <p className="text-accent-bronze/80 text-lg mb-12">Une expérience personnalisée, gravée dans l'excellence.</p>

                            <div className="space-y-4">
                                {services.map((service, idx) => (
                                    <button
                                        key={service.id}
                                        onClick={() => setSelectedService(service)}
                                        className="w-full text-left group"
                                    >
                                        <div className="bg-white border border-maroon-dark/5 p-8 rounded-xl shadow-sm hover:shadow-xl hover:border-primary/30 transition-all flex items-center justify-between group-hover:bg-primary group-hover:text-white group-hover:scale-[1.02] duration-500">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60 group-hover:text-white/60 mb-1">{service.category || 'Expérience'}</p>
                                                <h3 className="text-2xl font-display italic font-medium">{service.name}</h3>
                                                <p className="text-xs font-bold mt-2 opacity-40 group-hover:text-white/40 uppercase tracking-widest">{service.duration} MIN</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-display font-medium italic text-primary group-hover:text-white">{service.price}€</p>
                                                <ArrowRight className="size-5 mt-2 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Step 2: Exact Calendar Reproduction */
                        <div className="animate-fade-in">
                            <button
                                onClick={() => setSelectedService(null)}
                                className="flex items-center gap-2 text-primary mb-6 group"
                            >
                                <span className="material-symbols-outlined text-sm group-hover:translate-x-[-4px] transition-transform">arrow_back</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to services</span>
                            </button>

                            <h2 className="text-4xl md:text-5xl font-display font-bold italic mb-4">Select Date & Time</h2>
                            <p className="text-maroon-dark/60 text-lg mb-12 italic leading-relaxed">Your transformation begins with choosing the perfect moment.</p>

                            {/* Calendar Block - Exact Mockup Style */}
                            <div className="bg-white rounded-2xl shadow-xl shadow-maroon-dark/5 border border-maroon-dark/5 p-8 mb-12">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold font-display italic capitalize">
                                        {format(selectedDate, 'MMMM yyyy', { locale: fr })}
                                    </h3>
                                    <div className="flex gap-4 text-maroon-dark/40">
                                        <button className="p-2 hover:bg-[#f7f3f0] hover:text-primary rounded-full transition-all group">
                                            <ChevronLeft className="size-5" />
                                        </button>
                                        <button className="p-2 hover:bg-[#f7f3f0] hover:text-primary rounded-full transition-all group">
                                            <ChevronRight className="size-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 text-center gap-y-2">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                        <div key={day} className="text-[9px] font-black uppercase tracking-[0.2em] text-maroon-dark/40 py-2">{day}</div>
                                    ))}
                                    {/* Simplified 14-day preview grid for demo alignment */}
                                    {[...Array(14)].map((_, i) => {
                                        const day = addDays(new Date(), i);
                                        const isSelected = isSameDay(day, selectedDate);
                                        return (
                                            <div
                                                key={i}
                                                onClick={() => setSelectedDate(day)}
                                                className={`py-4 font-bold text-sm cursor-pointer rounded-lg transition-all ${isSelected ? 'bg-primary text-white shadow-lg' : 'hover:bg-[#f7f3f0] text-maroon-dark opacity-90'}`}
                                            >
                                                {format(day, 'd')}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Time Slots - Mockup Grid Style */}
                            <div className="mb-12">
                                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-maroon-dark/40 mb-8">AVAILABLE TIME SLOTS</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {availableSlots.length > 0 ? availableSlots.map(slot => (
                                        <button
                                            key={slot}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`py-4 rounded-xl border font-bold text-sm transition-all ${selectedSlot === slot ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' : 'bg-white border-maroon-dark/5 hover:border-primary/50'}`}
                                        >
                                            {slot}
                                        </button>
                                    )) : (
                                        <div className="col-span-full py-12 text-center bg-maroon-dark/5 rounded-2xl border border-dashed border-maroon-dark/10">
                                            <p className="text-accent-bronze italic text-sm">Recherche des créneaux disponibles...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Summary Glass Card - Exact Mockup Selection Layout */}
                            <div className="bg-maroon-dark text-white rounded-3xl p-8 mb-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                    <span className="material-symbols-outlined text-6xl">verified</span>
                                </div>
                                <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/10">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-2">Service</p>
                                        <h4 className="text-xl font-display italic leading-none">{selectedService.name}</h4>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-2">Price</p>
                                        <h4 className="text-xl font-display font-bold italic">{selectedService.price}€</h4>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-8 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-base text-primary">calendar_month</span>
                                        {format(selectedDate, 'd MMMM yyyy', { locale: fr })}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-base text-primary">schedule</span>
                                        {selectedSlot || '--:--'} ({selectedService.duration}m)
                                    </div>
                                </div>
                            </div>

                            {/* CTA Action */}
                            <div className="space-y-8">
                                {/* Guest Identification - Only for non-logged in users */}
                                {!user && (
                                    <div className="bg-white border border-primary/20 rounded-3xl p-8 animate-fade-in-up shadow-xl shadow-primary/5">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="material-symbols-outlined text-primary">account_circle</span>
                                            <h4 className="text-sm font-black uppercase tracking-widest text-maroon-dark">Finalisation Immédiate</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-50 text-sm">person</span>
                                                <input
                                                    type="text"
                                                    placeholder="Votre Nom Complet"
                                                    value={guestName}
                                                    onChange={(e) => setGuestName(e.target.value)}
                                                    className="w-full h-14 pl-12 pr-6 bg-accent-cream/30 border-none rounded-xl text-sm font-bold placeholder:text-maroon-dark/30 focus:ring-2 focus:ring-primary/20 transition-all"
                                                />
                                            </div>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-50 text-sm">call</span>
                                                <input
                                                    type="tel"
                                                    placeholder="Numéro WhatsApp (ex: +33...)"
                                                    value={guestWhatsapp}
                                                    onChange={(e) => setGuestWhatsapp(e.target.value)}
                                                    className="w-full h-14 pl-12 pr-6 bg-accent-cream/30 border-none rounded-xl text-sm font-bold placeholder:text-maroon-dark/30 focus:ring-2 focus:ring-primary/20 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <p className="mt-6 text-[10px] text-accent-bronze italic text-center font-medium leading-relaxed">
                                            Pas besoin de compte. Nous vous contacterons sur WhatsApp pour confirmer les détails.
                                        </p>
                                    </div>
                                )}

                                <Button
                                    disabled={!selectedSlot || bookingLoading || (!user && (!guestName || !guestWhatsapp))}
                                    onClick={handleBooking}
                                    variant="primary"
                                    className="w-full h-20 text-balance font-black uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 group"
                                >
                                    {bookingLoading ? <Loader2 className="animate-spin" /> : (
                                        <>
                                            CONFIRMER LA SÉANCE
                                            <span className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform">arrow_forward</span>
                                        </>
                                    )}
                                </Button>
                                <p className="text-center text-[10px] text-maroon-dark/40 font-black uppercase tracking-widest italic font-medium">
                                    {user ? 'Votre réservation sera prioritaire.' : 'Une expérience sans friction, centrée sur vous.'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
