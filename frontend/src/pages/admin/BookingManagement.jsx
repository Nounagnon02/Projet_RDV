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
    Plus
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
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-maroon-dark/5 dark:border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Operations</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-medium italic text-maroon-dark dark:text-text-light leading-none">
                            Agenda des RDV
                        </h1>
                        <p className="text-accent-bronze mt-4 text-sm font-medium">
                            Suivez vos réservations et gérez le flux de travail quotidien.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="secondary" size="sm" leftIcon={<CalendarIcon className="size-4" />}>
                            Vue Calendrier
                        </Button>
                        <Button variant="primary" size="sm" leftIcon={<Plus className="size-4" />}>
                            Réserver Manuellement
                        </Button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 p-1 bg-maroon-dark/5 dark:bg-white/5 rounded-xl w-fit">
                    {['upcoming', 'today', 'completed', 'cancelled'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filter === tab
                                ? 'bg-white dark:bg-maroon-dark text-primary shadow-sm'
                                : 'text-accent-bronze hover:text-maroon-dark dark:hover:text-text-light'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Main List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="size-10 animate-spin text-primary" />
                        </div>
                    ) : appointments.length > 0 ? (
                        appointments.map((app, index) => (
                            <Card key={app.id} variant="elevated" className="overflow-hidden p-0 border border-maroon-dark/5 dark:border-white/5 group hover:shadow-lg transition-all">
                                <div className="flex flex-col md:flex-row md:items-center">
                                    {/* Date/Time Block */}
                                    <div className="p-6 md:w-48 border-b md:border-b-0 md:border-r border-maroon-dark/5 dark:border-white/5 bg-maroon-dark/5 dark:bg-white/5 text-center">
                                        <p className="text-2xl font-display font-bold text-maroon-dark dark:text-text-light italic">{app.start_time}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">
                                            {format(new Date(app.date), 'EEEE d MMM', { locale: fr })}
                                        </p>
                                    </div>

                                    {/* Main Content */}
                                    <div className="p-6 flex-1 flex flex-col md:flex-row md:items-center gap-6">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Scissors className="size-4 text-primary" />
                                                <h3 className="text-lg font-bold text-maroon-dark dark:text-text-light">{app.service?.name}</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-4">
                                                <p className="text-sm font-medium text-accent-bronze flex items-center gap-1.5">
                                                    <User className="size-3.5" /> {app.client?.name}
                                                </p>
                                                <span className="text-accent-bronze/40">•</span>
                                                <p className="text-sm font-bold text-primary">${app.service?.price}</p>
                                            </div>
                                            {app.addons && app.addons.length > 0 && (
                                                <div className="flex gap-2 pt-1">
                                                    {app.addons.map((a, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-accent-cream/50 text-maroon-dark text-[9px] font-black border border-accent-cream rounded uppercase tracking-tighter">
                                                            {a}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {app.status === 'pending' && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-accent-rose hover:bg-accent-rose/10 h-10 px-4"
                                                        onClick={() => handleStatusUpdate(app.id, 'cancelled')}
                                                    >
                                                        Refuser
                                                    </Button>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="h-10 px-6"
                                                        onClick={() => handleStatusUpdate(app.id, 'confirmed')}
                                                    >
                                                        Confirmer
                                                    </Button>
                                                </>
                                            )}
                                            {app.status === 'confirmed' && (
                                                <div className="flex items-center gap-2 px-6 py-2 bg-accent-emerald/10 text-accent-emerald rounded-full border border-accent-emerald/20">
                                                    <CheckCircle2 className="size-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Confirmé</span>
                                                </div>
                                            )}
                                            {app.status === 'cancelled' && (
                                                <div className="flex items-center gap-2 px-6 py-2 bg-accent-rose/10 text-accent-rose rounded-full border border-accent-rose/20">
                                                    <XCircle className="size-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Annulé</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* More Menu */}
                                    <div className="p-6 md:w-[60px] flex items-center justify-center border-t md:border-t-0 md:border-l border-maroon-dark/5 dark:border-white/5">
                                        <button className="size-10 rounded-full hover:bg-maroon-dark/5 dark:hover:bg-white/5 flex items-center justify-center text-accent-bronze">
                                            <MoreHorizontal className="size-5" />
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
