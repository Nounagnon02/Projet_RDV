import { useState, useEffect } from 'react';
import api from '../api/axios';
import DashboardLayout from '../layouts/DashboardLayout';
import {
    Users,
    Calendar,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ChevronRight,
    Sparkles,
    ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalAppointments: 0,
        pendingAppointments: 0,
        totalServices: 0,
        todayAppointments: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [appointmentsRes, servicesRes] = await Promise.all([
                api.get('/provider/appointments'),
                api.get('/provider/services')
            ]);

            const appointments = appointmentsRes.data;
            const today = format(new Date(), 'yyyy-MM-dd');

            setStats({
                totalAppointments: appointments.length,
                pendingAppointments: appointments.filter(a => a.status === 'pending').length,
                totalServices: servicesRes.data.length,
                todayAppointments: appointments.filter(a => a.date === today).sort((a, b) => a.start_time.localeCompare(b.start_time)),
            });
        } catch (error) {
            console.error('Error fetching dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            name: 'Rendez-vous totaux',
            value: stats.totalAppointments,
            icon: Calendar,
            gradient: 'from-blue-500 to-cyan-500',
            bg: 'bg-blue-500/10',
            iconBg: 'bg-blue-500/20'
        },
        {
            name: 'En attente',
            value: stats.pendingAppointments,
            icon: AlertCircle,
            gradient: 'from-amber-500 to-orange-500',
            bg: 'bg-amber-500/10',
            iconBg: 'bg-amber-500/20'
        },
        {
            name: 'Services actifs',
            value: stats.totalServices,
            icon: TrendingUp,
            gradient: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-500/10',
            iconBg: 'bg-emerald-500/20'
        },
        {
            name: 'Aujourd\'hui',
            value: stats.todayAppointments.length,
            icon: Clock,
            gradient: 'from-indigo-500 to-purple-500',
            bg: 'bg-indigo-500/10',
            iconBg: 'bg-indigo-500/20'
        },
    ];

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-[60vh] items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">Chargement du tableau de bord...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="animate-fade-in-up">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-5 w-5 text-indigo-400" />
                            <span className="text-sm font-semibold text-indigo-400">Bienvenue</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            Tableau de Bord
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg">
                            {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
                        </p>
                    </div>

                    <Link
                        to="/dashboard/agenda"
                        className="btn-primary inline-flex items-center gap-2 animate-fade-in-up stagger-1"
                    >
                        <Calendar className="h-5 w-5" />
                        Voir l'agenda complet
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <div
                            key={stat.name}
                            className={`glass-card p-6 animate-fade-in-up stagger-${index + 1}`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`h-12 w-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                                    <stat.icon className={`h-6 w-6 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} style={{ WebkitTextStroke: '2px currentColor' }} />
                                </div>
                                <div className={`px-3 py-1 rounded-full ${stat.bg} text-xs font-bold text-slate-300`}>
                                    +0%
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm font-medium mb-1">{stat.name}</p>
                            <p className="text-4xl font-black text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Today's Agenda */}
                    <div className="lg:col-span-2 space-y-6 animate-fade-in-up stagger-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">Rendez-vous du jour</h2>
                                <p className="text-slate-500 text-sm mt-1">{stats.todayAppointments.length} rendez-vous prévus</p>
                            </div>
                            <Link to="/dashboard/agenda" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group">
                                Tout voir <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {stats.todayAppointments.length > 0 ? (
                                stats.todayAppointments.slice(0, 4).map((app, index) => (
                                    <div
                                        key={app.id}
                                        className={`glass-card-light p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up stagger-${index + 1}`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="text-center min-w-[60px] border-r border-slate-800 pr-5">
                                                <p className="text-xl font-black text-white leading-none">{app.start_time.substring(0, 5)}</p>
                                                <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wide">Début</p>
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-white leading-snug">{app.service?.name}</h3>
                                                <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                                                    <Users className="h-3.5 w-3.5" /> {app.client?.name || 'Client inconnu'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold border capitalize text-center md:text-left ${app.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                app.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                            }`}>
                                            {app.status}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="glass-card border-2 border-dashed border-slate-800 p-12 text-center">
                                    <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-4">
                                        <Calendar className="h-8 w-8 text-slate-700" />
                                    </div>
                                    <p className="text-slate-500 font-medium">Aucun rendez-vous prévu pour aujourd'hui.</p>
                                    <p className="text-slate-600 text-sm mt-2">Profitez de votre journée ! 🎉</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6 animate-fade-in-up stagger-3">
                        <h2 className="text-xl font-bold text-white">Actions rapides</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <Link to="/dashboard/services" className="glass-card p-6 hover:border-indigo-500/30 transition-all group">
                                <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <CheckCircle2 className="h-6 w-6 text-indigo-400" />
                                </div>
                                <h3 className="font-bold text-white">Nouveau Service</h3>
                                <p className="text-slate-500 text-sm mt-1">Ajoutez une prestation à votre catalogue.</p>
                            </Link>
                            <Link to="/dashboard/availabilities" className="glass-card p-6 hover:border-emerald-500/30 transition-all group">
                                <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Clock className="h-6 w-6 text-emerald-400" />
                                </div>
                                <h3 className="font-bold text-white">Horaires de Travail</h3>
                                <p className="text-slate-500 text-sm mt-1">Modifiez vos heures d'ouverture.</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardHome;
