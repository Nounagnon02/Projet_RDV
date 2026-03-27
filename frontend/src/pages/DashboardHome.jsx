import { useState, useEffect } from 'react';
import api from '../api/axios';
import DashboardLayout from '../layouts/DashboardLayout';
import {
    Users,
    Calendar as CalendarIcon,
    TrendingUp,
    Clock,
    AlertCircle,
    Loader2,
    ChevronRight,
    Sparkles,
    ArrowUpRight,
    ShoppingBag,
    Star,
    Scissors
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, Button } from '../components/ui';

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
            icon: CalendarIcon,
            color: 'text-primary'
        },
        {
            name: 'En attente',
            value: stats.pendingAppointments,
            icon: AlertCircle,
            color: 'text-accent-rose'
        },
        {
            name: 'Services actifs',
            value: stats.totalServices,
            icon: TrendingUp,
            color: 'text-accent-emerald'
        },
        {
            name: 'Aujourd\'hui',
            value: stats.todayAppointments.length,
            icon: Clock,
            color: 'text-primary'
        },
    ];

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-[60vh] items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-accent-bronze font-medium">Chargement du salon...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-maroon-dark/5 dark:border-white/5 pb-8">
                    <div className="animate-fade-in group">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Management Console</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-display font-medium italic text-maroon-dark dark:text-text-light leading-none">
                            Vue d'ensemble
                        </h1>
                        <p className="text-accent-bronze mt-4 text-lg font-medium">
                            {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
                        </p>
                    </div>

                    <Link to="/dashboard/agenda">
                        <Button variant="primary" size="lg" className="h-14 px-8 shadow-xl shadow-primary/20">
                            Agenda Complet <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <Card
                            key={stat.name}
                            variant="elevated"
                            hover
                            className={`p-6 border-t-2 border-t-primary/20 animate-fade-in stagger-${index + 1}`}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className={`size-12 rounded-xl bg-primary/5 flex items-center justify-center`}>
                                    <stat.icon className={`size-6 ${stat.color}`} />
                                </div>
                                <div className="text-[10px] font-black text-accent-bronze uppercase tracking-widest bg-maroon-dark/5 dark:bg-white/5 px-2 py-1 rounded">
                                    Live
                                </div>
                            </div>
                            <p className="text-accent-bronze text-xs font-black uppercase tracking-widest mb-1">{stat.name}</p>
                            <p className="text-4xl font-display font-bold text-maroon-dark dark:text-text-light">{stat.value}</p>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Today's Agenda */}
                    <div className="lg:col-span-2 space-y-8 animate-fade-in stagger-2">
                        <div className="flex items-center justify-between border-b border-maroon-dark/5 dark:border-white/5 pb-4">
                            <div>
                                <h2 className="text-2xl font-display font-bold text-maroon-dark dark:text-text-light italic">Rendez-vous du jour</h2>
                                <p className="text-accent-bronze text-xs font-bold uppercase tracking-widest mt-1">Timeline</p>
                            </div>
                            <Link to="/dashboard/agenda" className="text-xs font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1 group">
                                Tout voir <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {stats.todayAppointments.length > 0 ? (
                                stats.todayAppointments.slice(0, 4).map((app, index) => (
                                    <div
                                        key={app.id}
                                        className={`glass-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:translate-x-1 transition-transform animate-fade-in stagger-${index + 1}`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="text-center min-w-[70px] border-r border-maroon-dark/10 dark:border-white/10 pr-6">
                                                <p className="text-xl font-bold text-maroon-dark dark:text-text-light leading-none italic">{app.start_time.substring(0, 5)}</p>
                                                <p className="text-[9px] text-accent-bronze font-black mt-2 uppercase tracking-tighter">Heure</p>
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-bold text-maroon-dark dark:text-text-light leading-tight">{app.service?.name}</h3>
                                                <p className="text-accent-bronze text-sm font-medium flex items-center gap-2">
                                                    <Users className="size-3.5 text-primary" /> {app.client?.name || 'Client inconnu'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20 bg-primary/5 text-primary`}>
                                            {app.status}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <Card variant="light" className="p-16 text-center border-dashed border-2 border-accent-cream/50">
                                    <div className="size-20 rounded-full bg-accent-cream/30 flex items-center justify-center mx-auto mb-6 text-accent-bronze">
                                        <CalendarIcon className="size-10" />
                                    </div>
                                    <p className="text-accent-bronze font-bold text-lg mb-2">Aucun rendez-vous prévu</p>
                                    <p className="text-accent-bronze/60 text-sm italic font-medium">Profitez de ce moment de calme pour préparer le salon. ✨</p>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-8 animate-fade-in stagger-3">
                        <h2 className="text-2xl font-display font-medium text-maroon-dark dark:text-text-light italic">Actions rapides</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <Link to="/dashboard/services" className="group">
                                <Card variant="elevated" hover className="p-6 border-l-4 border-l-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                                        <Scissors className="size-6 text-primary group-hover:text-white" />
                                    </div>
                                    <h3 className="font-bold text-maroon-dark dark:text-text-light group-hover:text-white">Nouveau Service</h3>
                                    <p className="text-accent-bronze text-xs font-bold mt-1 group-hover:text-white/60">Ajoutez une prestation premium.</p>
                                </Card>
                            </Link>
                            <Link to="/dashboard/products" className="group">
                                <Card variant="elevated" hover className="p-6 border-l-4 border-l-accent-emerald group-hover:bg-accent-emerald group-hover:text-white transition-all">
                                    <div className="size-12 rounded-xl bg-accent-emerald/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                                        <ShoppingBag className="size-6 text-accent-emerald group-hover:text-white" />
                                    </div>
                                    <h3 className="font-bold text-maroon-dark dark:text-text-light group-hover:text-white">Boutique</h3>
                                    <p className="text-accent-bronze text-xs font-bold mt-1 group-hover:text-white/60">Gérez le catalogue produits.</p>
                                </Card>
                            </Link>
                            <Link to="/dashboard/loyalty" className="group">
                                <Card variant="elevated" hover className="p-6 border-l-4 border-l-accent-bronze group-hover:bg-accent-bronze group-hover:text-white transition-all">
                                    <div className="size-12 rounded-xl bg-accent-bronze/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                                        <Star className="size-6 text-accent-bronze group-hover:text-white" />
                                    </div>
                                    <h3 className="font-bold text-maroon-dark dark:text-text-light group-hover:text-white">Fidélité</h3>
                                    <p className="text-accent-bronze text-xs font-bold mt-1 group-hover:text-white/60">Récompensez vos clients.</p>
                                </Card>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardHome;
