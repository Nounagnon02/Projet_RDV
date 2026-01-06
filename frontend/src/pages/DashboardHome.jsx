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
    ChevronRight
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
        { name: 'Rendez-vous totaux', value: stats.totalAppointments, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { name: 'En attente', value: stats.pendingAppointments, icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { name: 'Services actifs', value: stats.totalServices, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { name: 'Aujourd\'hui', value: stats.todayAppointments.length, icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    ];

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-10">
                <div>
                    <h1 className="text-3xl font-bold text-white">Bonjour !</h1>
                    <p className="text-slate-400 mt-1">Voici un aperçu de votre activité pour aujourd'hui, {format(new Date(), 'dd MMMM yyyy', { locale: fr })}.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat) => (
                        <div key={stat.name} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl shadow-black/20">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm font-medium">{stat.name}</p>
                            <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Today's Agenda */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Agenda du jour</h2>
                            <Link to="/dashboard/agenda" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group">
                                Voir tout l'agenda <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {stats.todayAppointments.length > 0 ? (
                                stats.todayAppointments.map((app) => (
                                    <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-slate-700">
                                        <div className="flex items-center gap-6">
                                            <div className="text-center min-w-[60px] border-r border-slate-800 pr-6">
                                                <p className="text-lg font-bold text-white leading-none">{app.start_time.substring(0, 5)}</p>
                                                <p className="text-xs text-slate-500 font-bold mt-1 uppercase">Début</p>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white leading-snug">{app.service.name}</h3>
                                                <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                                                    <Users className="h-3.5 w-3.5" /> {app.client?.name}
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
                                <div className="bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center">
                                    <p className="text-slate-500 font-medium">Aucun rendez-vous prévu pour aujourd'hui.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white">Actions rapides</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <Link to="/dashboard/services" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800/50 transition-all group">
                                <CheckCircle2 className="h-8 w-8 text-indigo-500 mb-4" />
                                <h3 className="font-bold text-white">Nouveau Service</h3>
                                <p className="text-slate-400 text-sm mt-1">Ajoutez une prestation à votre catalogue.</p>
                            </Link>
                            <Link to="/dashboard/availabilities" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800/50 transition-all group">
                                <Clock className="h-8 w-8 text-emerald-500 mb-4" />
                                <h3 className="font-bold text-white">Horaires de Travail</h3>
                                <p className="text-slate-400 text-sm mt-1">Modifiez vos heures d'ouverture.</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardHome;
