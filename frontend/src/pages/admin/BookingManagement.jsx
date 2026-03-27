import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Card, Button, Input } from '../../components/ui';
import {
    Calendar as CalendarIcon,
    Search,
    Filter,
    Clock,
    User,
    CheckCircle2,
    XCircle,
    MoreHorizontal,
    Scissors,
    AlertCircle,
    ChevronRight,
    Plus,
    Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const BookingManagement = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('upcoming'); // upcoming, today, completed, cancelled

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await api.get('/provider/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments', error);
            // Fallback for demo if API fails
            const mockApps = [
                {
                    id: 1,
                    date: format(new Date(), 'yyyy-MM-dd'),
                    start_time: '14:00',
                    status: 'pending',
                    client: { name: 'Aaliyah Johnson' },
                    service: { name: 'Silk Press & Steam Hydration', price: '85.00' },
                    addons: ['Extra Scalp Massage']
                },
                {
                    id: 2,
                    date: format(new Date(), 'yyyy-MM-dd'),
                    start_time: '16:30',
                    status: 'confirmed',
                    client: { name: 'Imani Williams' },
                    service: { name: 'Bohemian Knotless Braids', price: '180.00' },
                    addons: ['Hair Extensions Included']
                }
            ];
            setAppointments(mockApps);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            // In a real app: await api.patch(`/provider/appointments/${id}`, { status: newStatus });
            setAppointments(appointments.map(app => app.id === id ? { ...app, status: newStatus } : app));
        } catch (error) {
            console.error('Error updating status', error);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-maroon-dark/5 dark:border-white/5 pb-8 animate-fade-in">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Operations</span>
                        </div>
                        <h1 className="font-display font-medium italic text-maroon-dark dark:text-text-light leading-none" style={{ fontSize: 'var(--text-h2)' }}>
                            Gestion des Réservations
                        </h1>
                        <p className="text-accent-bronze mt-4 text-lg font-medium italic">
                            Pilotez votre planning d'exception et validez l'excellence de chaque rendez-vous.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="outline" size="lg" className="h-14 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl" leftIcon={<CalendarIcon className="size-4" />}>
                            Vue Calendrier
                        </Button>
                        <Button variant="primary" size="lg" className="h-14 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl" leftIcon={<Plus className="size-4" />}>
                            Réservation Manuelle
                        </Button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-3 p-2 bg-maroon-dark/5 dark:bg-white/5 rounded-2xl w-fit backdrop-blur-xl">
                    {['upcoming', 'today', 'completed', 'cancelled'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${filter === tab
                                ? 'bg-white text-primary shadow-luxury border border-primary/10'
                                : 'text-accent-bronze hover:text-maroon-dark hover:bg-white/50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Main List */}
                <div className="grid grid-cols-1 gap-6">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="size-10 animate-spin text-primary" />
                        </div>
                    ) : appointments.length > 0 ? (
                        appointments.map((app) => (
                            <Card key={app.id} hover variant="elevated" className="overflow-hidden p-0 border border-maroon-dark/5 group transition-all duration-700 shadow-xl shadow-maroon-dark/5">
                                <div className="flex flex-col md:flex-row md:items-stretch">
                                    {/* Date/Time Block */}
                                    <div className="p-10 md:w-56 border-b md:border-b-0 md:border-r border-maroon-dark/5 bg-maroon-dark/5 dark:bg-white/5 flex flex-col items-center justify-center text-center">
                                        <p className="text-4xl font-display font-black text-maroon-dark dark:text-text-light italic leading-none">{app.start_time}</p>
                                        <div className="mt-4 flex flex-col items-center gap-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                                                {format(new Date(app.date), 'EEEE d MMM', { locale: fr })}
                                            </p>
                                            <p className="text-[9px] font-medium text-accent-bronze italic">Saison 2026</p>
                                        </div>
                                    </div>

                                    {/* Main Content */}
                                    <div className="p-10 flex-1 flex flex-col md:flex-row md:items-center gap-10">
                                        <div className="flex-1 space-y-6">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-3">
                                                    <Scissors className="size-5 text-primary" />
                                                    <h3 className="text-2xl font-display font-bold text-maroon-dark dark:text-text-light italic group-hover:text-primary transition-colors">{app.service?.name}</h3>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-maroon-dark">
                                                        <User className="size-4 text-primary" />
                                                        {app.client?.name}
                                                    </div>
                                                    <span className="text-maroon-dark/10 h-4 w-px hidden sm:block"></span>
                                                    <p className="text-2xl font-display font-black text-primary">{Math.round(app.service?.price || 0).toLocaleString('fr-FR')} FCFA</p>
                                                </div>
                                            </div>

                                            {app.addons && app.addons.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {app.addons.map((a, i) => (
                                                        <span key={i} className="px-3 py-1 bg-primary/5 text-primary text-[9px] font-black border border-primary/20 rounded-full uppercase tracking-tighter italic">
                                                            + {a}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {app.status === 'pending' && (
                                                <div className="flex gap-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-12 px-8 font-black uppercase tracking-widest text-[9px] border-rose-500/20 text-rose-500 hover:bg-rose-500/5"
                                                        onClick={() => handleStatusUpdate(app.id, 'cancelled')}
                                                    >
                                                        Refuser
                                                    </Button>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="h-12 px-10 font-black uppercase tracking-widest text-[9px] shadow-lg shadow-primary/20"
                                                        onClick={() => handleStatusUpdate(app.id, 'confirmed')}
                                                    >
                                                        Confirmer
                                                    </Button>
                                                </div>
                                            )}
                                            {app.status === 'confirmed' && (
                                                <div className="flex items-center gap-3 px-8 py-3 bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20 shadow-sm">
                                                    <CheckCircle2 className="size-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">CONFIRMÉ EXCELLENCE</span>
                                                </div>
                                            )}
                                            {app.status === 'cancelled' && (
                                                <div className="flex items-center gap-3 px-8 py-3 bg-rose-500/10 text-rose-500 rounded-full border border-rose-500/20 shadow-sm opacity-60">
                                                    <XCircle className="size-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">SESSION ANNULÉE</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* More Menu */}
                                    <div className="p-8 md:w-[100px] flex items-center justify-center border-t md:border-t-0 md:border-l border-maroon-dark/5 bg-maroon-dark/[0.02] group-hover:bg-primary transition-all duration-500">
                                        <button className="size-14 rounded-full bg-white flex items-center justify-center text-maroon-dark group-hover:scale-110 transition-transform shadow-lg group-hover:text-primary">
                                            <MoreHorizontal className="size-6" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card variant="light" className="p-20 text-center border-dashed border-2">
                            <AlertCircle className="size-12 mx-auto text-accent-cream mb-4" />
                            <p className="text-accent-bronze font-bold">Aucun rendez-vous trouvé pour cette période.</p>
                        </Card>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BookingManagement;
