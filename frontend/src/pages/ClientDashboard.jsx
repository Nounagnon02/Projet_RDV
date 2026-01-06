import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
    Calendar,
    Clock,
    User,
    LogOut,
    Search,
    Loader2,
    Sparkles,
    MapPin,
    ArrowRight,
    CalendarDays,
    ChevronRight
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const ClientDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/client/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const upcomingAppointments = appointments
        .filter(app => new Date(app.date) >= new Date() && app.status !== 'cancelled')
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'cancelled': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/client" className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">E-appointment</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/client/appointments"
                            className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden sm:block"
                        >
                            Mes rendez-vous
                        </Link>
                        <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center">
                                <span className="text-sm font-bold text-slate-300">{user?.name?.charAt(0)}</span>
                            </div>
                            <span className="text-sm font-medium text-slate-300 hidden sm:block">{user?.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="h-9 w-9 rounded-lg bg-slate-900 flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                            title="Déconnexion"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <div className="relative overflow-hidden py-16 px-6">
                <div className="orb orb-primary w-96 h-96 -top-48 -left-48"></div>
                <div className="orb orb-purple w-80 h-80 -top-20 -right-40"></div>

                <div className="max-w-6xl mx-auto relative">
                    <div className="animate-fade-in-up">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="h-5 w-5 text-indigo-400" />
                            <span className="text-sm font-semibold text-indigo-400">Bienvenue, {user?.name}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                            Votre espace client
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl">
                            Gérez vos rendez-vous et découvrez de nouveaux prestataires.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Prochains rendez-vous */}
                    <div className="lg:col-span-2 space-y-6 animate-fade-in-up stagger-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Prochains rendez-vous</h2>
                                <p className="text-slate-500 text-sm mt-1">Vos réservations à venir</p>
                            </div>
                            <Link
                                to="/client/appointments"
                                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group"
                            >
                                Tout voir <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex h-48 items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                            </div>
                        ) : upcomingAppointments.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingAppointments.map((app, index) => (
                                    <div
                                        key={app.id}
                                        className={`glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up stagger-${index + 1}`}
                                    >
                                        <div className="flex gap-5">
                                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex flex-col items-center justify-center shrink-0">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">
                                                    {format(parseISO(app.date), 'MMM', { locale: fr })}
                                                </span>
                                                <span className="text-xl font-black text-white">{format(parseISO(app.date), 'dd')}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white mb-1">{app.service?.name}</h3>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <p className="text-slate-400 text-sm flex items-center gap-1.5">
                                                        <User className="h-4 w-4 text-indigo-400" /> {app.provider?.business_name}
                                                    </p>
                                                    <p className="text-slate-400 text-sm flex items-center gap-1.5">
                                                        <Clock className="h-4 w-4 text-indigo-400" /> {app.start_time?.substring(0, 5)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-2 rounded-full text-xs font-bold border capitalize ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card border-2 border-dashed border-slate-800 p-12 text-center">
                                <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-4">
                                    <CalendarDays className="h-8 w-8 text-slate-700" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Aucun rendez-vous à venir</h3>
                                <p className="text-slate-500 text-sm">Réservez dès maintenant chez un prestataire.</p>
                            </div>
                        )}
                    </div>

                    {/* Actions rapides */}
                    <div className="space-y-6 animate-fade-in-up stagger-2">
                        <h2 className="text-2xl font-bold text-white">Actions</h2>

                        <Link
                            to="/client/appointments"
                            className="glass-card p-6 block hover:border-indigo-500/30 transition-all group"
                        >
                            <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Calendar className="h-6 w-6 text-indigo-400" />
                            </div>
                            <h3 className="font-bold text-white mb-1">Mes rendez-vous</h3>
                            <p className="text-slate-500 text-sm">Consultez l'historique de vos réservations.</p>
                        </Link>

                        <Link
                            to="/providers"
                            className="glass-card p-6 block hover:border-emerald-500/30 transition-all group"
                        >
                            <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Search className="h-6 w-6 text-emerald-400" />
                            </div>
                            <h3 className="font-bold text-white mb-1">Trouver un prestataire</h3>
                            <p className="text-slate-500 text-sm">Recherchez et réservez chez un professionnel.</p>
                        </Link>

                        {/* Stats */}
                        <div className="glass-card-light p-6">
                            <p className="text-sm font-medium text-slate-500 mb-2">Total de vos rendez-vous</p>
                            <p className="text-4xl font-black text-white">{appointments.length}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
