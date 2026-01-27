import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ClientHeader from '../components/ClientHeader';
import {
    Calendar,
    Clock,
    User,
    Search,
    Loader2,
    Sparkles,
    CalendarDays,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button, Card } from '../components/ui';

const ClientDashboard = () => {
    const { user } = useAuth();
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

    const upcomingAppointments = appointments
        .filter(app => new Date(app.date) >= new Date() && app.status !== 'cancelled')
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
            <ClientHeader />

            <main className="flex-1">
                {/* Luxury Welcome Section */}
                <div className="relative overflow-hidden py-16 lg:py-24 px-8">
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-maroon-dark/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                    </div>

                    <div className="max-w-7xl mx-auto relative animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles className="size-5 text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Bienvenue dans l'Excellence</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-display font-black text-maroon-dark dark:text-text-light italic leading-none mb-6">
                            Bonjour, {user?.name?.split(' ')[0]}
                        </h1>
                        <p className="text-xl text-accent-bronze font-medium max-w-2xl italic">
                            Votre espace privé Elsa Coiffure. Gérez vos transformations et accédez à nos services exclusifs.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-8 pb-32">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                        {/* Upcoming Appointments: Premium Card Layout */}
                        <div className="lg:col-span-8 space-y-10 animate-fade-in-up stagger-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-2xl font-black tracking-tight leading-none uppercase">Vos Prochaines Séances</h2>
                                    <div className="h-px w-24 bg-maroon-dark/10"></div>
                                </div>
                                <Link
                                    to="/client/appointments"
                                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2 group"
                                >
                                    HISTORIQUE COMPLET <ChevronRight className="size-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            {loading ? (
                                <div className="h-64 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-3xl border border-maroon-dark/5">
                                    <Loader2 className="size-10 animate-spin text-primary opacity-40" />
                                </div>
                            ) : upcomingAppointments.length > 0 ? (
                                <div className="space-y-6">
                                    {upcomingAppointments.map((app, index) => (
                                        <div
                                            key={app.id}
                                            className="bg-white dark:bg-white/5 border border-maroon-dark/5 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-10 shadow-xl shadow-maroon-dark/5 relative overflow-hidden group animate-fade-in-up shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-700"
                                        >
                                            <div className="absolute left-0 top-0 h-full w-2 bg-primary"></div>

                                            <div className="md:w-1/4 text-center space-y-2">
                                                <p className="text-5xl font-display font-black text-maroon-dark dark:text-text-light italic">
                                                    {format(parseISO(app.date), 'dd')}
                                                </p>
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                                                    {format(parseISO(app.date), 'MMMM yyyy', { locale: fr })}
                                                </p>
                                            </div>

                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-primary/10 text-primary rounded-full">Soin Signature</span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-maroon-dark/5 text-accent-bronze rounded-full capitalize">{app.status}</span>
                                                </div>
                                                <h3 className="text-2xl font-display italic font-bold text-maroon-dark dark:text-text-light">{app.service?.name}</h3>
                                                <div className="flex flex-wrap items-center gap-6 text-accent-bronze text-sm font-medium">
                                                    <span className="flex items-center gap-2"><User className="size-4 text-primary" /> {app.provider?.business_name}</span>
                                                    <span className="flex items-center gap-2"><Clock className="size-4 text-primary" /> {app.start_time?.substring(0, 5)}</span>
                                                </div>
                                            </div>

                                            <div className="md:w-1/4 flex justify-end">
                                                <Button variant="outline" className="size-14 rounded-full border-maroon-dark/5 hover:border-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                                    <ArrowRight className="size-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Card variant="light" className="p-20 text-center border-dashed border-2 bg-white/50 border-maroon-dark/10 rounded-[40px]">
                                    <CalendarDays className="size-20 mx-auto text-accent-cream mb-8" />
                                    <h3 className="text-2xl font-display italic font-medium mb-4">Aucune séance prévue</h3>
                                    <p className="text-accent-bronze mb-10 max-w-sm mx-auto">Votre prochaine transformation vous attend. Explorez nos services d'exception.</p>
                                    <Link to="/providers">
                                        <Button variant="primary" className="h-16 px-12 rounded-full font-black uppercase tracking-widest text-[10px]">PRENDRE RENDEZ-VOUS</Button>
                                    </Link>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar: Exclusive Actions & Stats */}
                        <div className="lg:col-span-4 space-y-12 animate-fade-in-up stagger-2">
                            <div className="space-y-6">
                                <h2 className="text-2xl font-black tracking-tight leading-none uppercase">Privilèges</h2>

                                <Link
                                    to="/client/shop"
                                    className="bg-maroon-dark text-white rounded-[32px] p-10 block relative overflow-hidden group shadow-2xl"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                        <Sparkles className="size-24" />
                                    </div>
                                    <div className="relative z-10 space-y-6">
                                        <div className="size-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
                                            <Search className="size-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-display italic font-medium mb-2">Boutique Elsa</h3>
                                            <p className="text-white/40 text-sm leading-relaxed">Découvrez nos produits exclusifs pour l'entretien de votre couronne.</p>
                                        </div>
                                        <ArrowRight className="size-6 text-primary group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </Link>

                                <Link
                                    to="/client/consultation"
                                    className="bg-primary/5 border border-primary/20 rounded-[32px] p-10 block group hover:bg-primary/10 transition-all duration-500"
                                >
                                    <div className="size-14 rounded-2xl bg-white flex items-center justify-center text-primary shadow-lg mb-6 group-hover:scale-110 transition-transform">
                                        <Sparkles className="size-6" />
                                    </div>
                                    <h3 className="text-2xl font-display italic font-medium mb-2">Diagnostic Capillaire</h3>
                                    <p className="text-accent-bronze text-sm font-medium">L'analyse d'excellence pour sublimer votre profil unique.</p>
                                </Link>
                            </div>

                            {/* Loyalty / Stats Card */}
                            <div className="bg-accent-cream/30 rounded-[32px] p-10 border border-accent-cream">
                                <p className="text-[10px] font-black text-accent-bronze uppercase tracking-[0.4em] mb-4">Votre Engagement</p>
                                <div className="space-y-2">
                                    <p className="text-6xl font-display italic font-black text-maroon-dark leading-none">{appointments.length}</p>
                                    <p className="text-sm font-bold text-primary uppercase tracking-widest">SÉANCES TOTALES</p>
                                </div>
                                <div className="mt-8 pt-8 border-t border-accent-bronze/10">
                                    <p className="text-xs text-accent-bronze italic leading-relaxed">Chaque visite renforce votre statut privilégié au sein de l'Atelier.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Premium Multi-Column Footer Integration */}
            <footer className="bg-maroon-dark text-white py-24 xl:px-40 lg:px-20 px-8 border-t border-white/5">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
                    <div className="col-span-1 md:col-span-2 space-y-8">
                        <div className="flex items-center gap-4 text-primary">
                            <span className="material-symbols-outlined text-4xl">flare</span>
                            <h2 className="text-3xl font-display font-medium italic tracking-tight">Elsa Coiffure</h2>
                        </div>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-sm italic">
                            Élever les standards du soin capillaire afro à travers une expérience de luxe et une excellence artistique inégalée.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-black uppercase text-[10px] tracking-[0.4em] mb-10 opacity-40">Navigation</h4>
                        <ul className="space-y-6 text-[10px] font-black tracking-[0.2em] uppercase text-slate-200">
                            <li><Link className="hover:text-primary transition-colors" to="/about">Notre Histoire</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/client/shop">E-Boutique</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/client/consultation">Diagnostic</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/contact">Conciergerie</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-black uppercase text-[10px] tracking-[0.4em] mb-10 opacity-40">Conciergerie</h4>
                        <ul className="space-y-6 text-[10px] font-black tracking-[0.2em] uppercase text-slate-300">
                            <li className="flex items-center gap-4"><span className="material-symbols-outlined text-primary text-base">mail</span> concierge@elsacoiffure.fr</li>
                            <li className="flex items-center gap-4"><span className="material-symbols-outlined text-primary text-base">call</span> +33 1 23 45 67 89</li>
                            <li className="flex items-center gap-4"><span className="material-symbols-outlined text-primary text-base">location_on</span> 75 Av. des Champs-Élysées, Paris</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-[1200px] mx-auto border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 font-sans">
                    <p>© 2026 ELSA COIFFURE PARIS. TOUS DROITS RÉSERVÉS.</p>
                    <div className="flex gap-10">
                        <a className="hover:text-white transition-colors" href="#">Vie Privée</a>
                        <a className="hover:text-white transition-colors" href="#">Conditions de Réservation</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ClientDashboard;
