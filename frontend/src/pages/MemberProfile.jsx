import { useState, useEffect } from 'react';
import api from '../api/axios';
import ClientHeader from '../components/ClientHeader';
import { Card, Button } from '../components/ui';
import {
    Calendar,
    ChevronRight,
    Scissors,
    Sparkles,
    ArrowRight,
    History,
    Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MemberProfile = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loyalty, setLoyalty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [appRes, loyRes] = await Promise.all([
                api.get('/client/appointments'),
                api.get('/client/loyalty')
            ]);
            setAppointments(appRes.data);
            setLoyalty(loyRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data', error);
            // Fallback for demo
            setLoyalty({
                points: 2450,
                tier: 'Platinum',
                next_tier: 'Diamond',
                progress: 65,
                discoveries_left: 4
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
            <ClientHeader />

            <div className="flex-1 max-w-7xl mx-auto w-full px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Left Sidebar: Navigation & Identity */}
                <aside className="lg:col-span-3 space-y-12 animate-fade-in-up">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Votre Profil</p>
                        <h2 className="text-5xl font-display italic font-black text-maroon-dark dark:text-text-light leading-none">Bonjour, {user?.name?.split(' ')[0]}</h2>
                        <p className="text-accent-bronze font-medium text-sm italic">Membre Privilégié de l'Atelier.</p>
                    </div>

                    <nav className="space-y-3">
                        {[
                            { name: 'Vue d\'ensemble', icon: Sparkles, active: true, path: '/client' },
                            { name: 'Mes Réservations', icon: Calendar, path: '/client/appointments' },
                            { name: 'Boutique Elsa', icon: History, path: '/client/shop' },
                            { name: 'Diagnostic Capillaire', icon: Scissors, path: '/client/consultation' },
                            { name: 'Paramètres', icon: Settings }
                        ].map(item => (
                            <Link
                                key={item.name}
                                to={item.path || '#'}
                                className={`flex items-center justify-between p-5 rounded-2xl transition-all duration-500 group ${item.active ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'hover:bg-primary/5 text-accent-bronze hover:text-primary'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon className="size-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                                </div>
                                <ChevronRight className={`size-3 transition-transform group-hover:translate-x-1 ${item.active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main Dashboard Area */}
                <main className="lg:col-span-9 space-y-16 animate-fade-in-up stagger-1">
                    {/* Hero section: Loyalty & Elite Status */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="relative overflow-hidden bg-maroon-dark rounded-[40px] p-12 text-white shadow-2xl">
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <span className="material-symbols-outlined text-[140px]">workspace_premium</span>
                            </div>
                            <div className="relative z-10 space-y-10">
                                <div>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">Statut Membre</p>
                                    <h3 className="text-6xl font-display italic font-black leading-none">{loyalty?.tier || 'Platinum'}</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs font-bold uppercase tracking-widest text-primary">{loyalty?.points || 2450} Points</p>
                                        <p className="text-[10px] uppercase opacity-50 font-black tracking-widest">Vers {loyalty?.next_tier || 'Diamond'}</p>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                                        <div className="h-full bg-primary" style={{ width: `${loyalty?.progress || 65}%` }}></div>
                                    </div>
                                </div>
                                <p className="text-sm text-white/50 italic">Plus que <span className="text-primary font-bold">{loyalty?.discoveries_left || 4} rdv</span> avant votre privilège exclusif.</p>
                            </div>
                        </div>

                        <div className="bg-primary/5 border-2 border-dashed border-primary/20 rounded-[40px] p-12 flex flex-col items-center justify-center text-center space-y-8 group hover:bg-primary/10 transition-all duration-700 cursor-pointer">
                            <div className="size-16 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                <Calendar className="size-8" />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-3xl font-display font-black italic text-maroon-dark">Un instant pour vous ?</h4>
                                <p className="text-accent-bronze font-medium text-sm italic max-w-xs mx-auto">Réservez votre prochaine transformation signature.</p>
                            </div>
                            <Link to="/providers">
                                <Button variant="primary" className="h-14 px-12 font-black uppercase tracking-[0.3em] text-[10px] shadow-xl">
                                    PRENDRE RENDEZ-VOUS
                                </Button>
                            </Link>
                        </div>
                    </section>

                    {/* Prochain RDV highlight */}
                    <section className="space-y-10">
                        <div className="flex items-center gap-6">
                            <h3 className="text-2xl font-black tracking-tight leading-none uppercase">Prochain RDV Signature</h3>
                            <div className="flex-1 h-px bg-maroon-dark/5"></div>
                        </div>

                        {appointments.length > 0 ? (
                            <div className="bg-white dark:bg-white/5 border border-maroon-dark/5 rounded-[40px] p-12 flex flex-col md:flex-row items-center gap-12 shadow-xl shadow-maroon-dark/5 relative overflow-hidden group hover:shadow-2xl transition-all duration-700">
                                <div className="absolute left-0 top-0 h-full w-2 bg-primary"></div>

                                <div className="md:w-1/4 text-center space-y-3">
                                    <p className="text-6xl font-display font-black text-maroon-dark dark:text-text-light italic">
                                        24
                                    </p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Octobre 2026</p>
                                </div>

                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[9px] font-black uppercase tracking-widest px-4 py-1.5 bg-primary/10 text-primary rounded-full">Soin d'Exception</span>
                                        <span className="text-[9px] font-black uppercase tracking-widest px-4 py-1.5 bg-maroon-dark/5 text-accent-bronze rounded-full italic">14:00 (2h)</span>
                                    </div>
                                    <h4 className="text-4xl font-display italic font-bold text-maroon-dark dark:text-text-light">Soin Rituel Hydratation</h4>
                                    <div className="flex items-center gap-8 text-accent-bronze text-sm font-medium italic">
                                        <span className="flex items-center gap-2"><Sparkles className="size-4 text-primary" /> L'Atelier Paris</span>
                                        <span className="text-maroon-dark dark:text-text-light underline decoration-primary underline-offset-8 cursor-pointer hover:text-primary transition-colors">Modifier</span>
                                    </div>
                                </div>

                                <div className="md:w-1/4 flex justify-end">
                                    <Button variant="outline" className="size-16 rounded-full border-maroon-dark/5 hover:border-primary group-hover:bg-primary group-hover:text-white transition-all duration-700 flex items-center justify-center p-0">
                                        <ArrowRight className="size-6" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Card variant="light" className="p-24 text-center border-dashed border-2 bg-white/50 border-maroon-dark/10 rounded-[40px]">
                                <Calendar className="size-16 mx-auto text-accent-cream mb-8 opacity-40" />
                                <p className="text-accent-bronze font-display italic text-2xl">Aucune transformation prévue.</p>
                            </Card>
                        )}
                    </section>
                </main>
            </div>

            {/* Premium Footer */}
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

export default MemberProfile;
