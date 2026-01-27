import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ClientHeader from '../components/ClientHeader';
import { Calendar, Clock, User, Trash2, Loader2, Sparkles, MapPin, ArrowRight, ChevronLeft } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '../components/ui';

const ClientAppointments = () => {
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

    const handleCancel = async (id) => {
        if (!confirm('Voulez-vous vraiment annuler ce rendez-vous d\'exception ?')) return;
        try {
            await api.delete(`/client/appointments/${id}`);
            fetchAppointments();
        } catch (error) {
            alert("Erreur lors de l'annulation");
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
            <ClientHeader />

            <main className="flex-1">
                {/* Header Section */}
                <div className="relative overflow-hidden py-16 lg:py-20 px-8">
                    <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    </div>

                    <div className="max-w-4xl mx-auto relative animate-fade-in-up text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Sparkles className="size-5 text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Votre Historique d'Excellence</span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-display font-black text-maroon-dark dark:text-text-light italic leading-none mb-6">
                            Mes Rendez-vous
                        </h1>
                        <p className="text-lg text-accent-bronze font-medium italic max-w-2xl mx-auto leading-relaxed">
                            Retrouvez le parcours de vos transformations et gérez vos prochaines séances de soin chez Elsa Coiffure.
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-8 pb-32">
                    <div className="flex items-center gap-2 text-primary mb-10 group cursor-pointer" onClick={() => window.history.back()}>
                        <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Retour au Dashboard</span>
                    </div>

                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <Loader2 className="size-10 animate-spin text-primary opacity-40" />
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {appointments.length > 0 ? (
                                [...appointments].reverse().map((app, index) => (
                                    <div
                                        key={app.id}
                                        className="bg-white dark:bg-white/5 border border-maroon-dark/5 rounded-[32px] overflow-hidden shadow-xl shadow-maroon-dark/5 flex flex-col md:flex-row animate-fade-in-up stagger-1 group"
                                    >
                                        <div className="md:w-32 bg-maroon-dark flex flex-col items-center justify-center py-8 text-white relative">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-1">
                                                {format(parseISO(app.date), 'MMM', { locale: fr })}
                                            </span>
                                            <span className="text-4xl font-display font-black italic">{format(parseISO(app.date), 'dd')}</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-30 mt-1">{format(parseISO(app.date), 'yyyy')}</span>
                                        </div>

                                        <div className="flex-1 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${app.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-600' :
                                                            app.status === 'pending' ? 'bg-amber-500/10 text-amber-600' :
                                                                'bg-rose-500/10 text-rose-600'
                                                        }`}>
                                                        {app.status === 'confirmed' ? 'Confirmé' : app.status === 'pending' ? 'En Attente' : 'Annulé'}
                                                    </span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-maroon-dark/5 text-accent-bronze rounded-full italic">Soin {app.service?.category || 'Signature'}</span>
                                                </div>
                                                <h3 className="text-2xl font-display italic font-bold text-maroon-dark dark:text-text-light">{app.service?.name}</h3>
                                                <div className="flex flex-wrap items-center gap-6 text-accent-bronze text-sm font-medium italic">
                                                    <span className="flex items-center gap-2"><User className="size-4 text-primary" /> {app.provider?.business_name}</span>
                                                    <span className="flex items-center gap-2"><Clock className="size-4 text-primary" /> {app.start_time?.substring(0, 5)}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 border-t md:border-t-0 border-maroon-dark/5 pt-6 md:pt-0">
                                                <p className="text-2xl font-display font-black italic text-primary">{Math.round(app.service?.price || 0)}€</p>
                                                {app.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleCancel(app.id)}
                                                        className="size-12 rounded-full bg-rose-500/5 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                                                        title="Annuler le rendez-vous"
                                                    >
                                                        <Trash2 className="size-5" />
                                                    </button>
                                                )}
                                                <Button variant="outline" className="size-12 rounded-full border-maroon-dark/5 hover:border-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 p-0 flex items-center justify-center">
                                                    <ArrowRight className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white/50 border-2 border-dashed border-maroon-dark/10 rounded-[40px] p-24 text-center">
                                    <div className="size-20 bg-accent-cream rounded-full flex items-center justify-center mx-auto mb-8 text-accent-bronze">
                                        <Calendar className="size-10" />
                                    </div>
                                    <h3 className="text-2xl font-display italic font-medium mb-4">Votre voyage commence ici</h3>
                                    <p className="text-accent-bronze mb-10 max-w-sm mx-auto leading-relaxed italic">Vous n'avez pas encore de rendez-vous enregistré. Laissez-nous sublimer votre allure.</p>
                                    <Link to="/providers">
                                        <Button variant="primary" className="h-16 px-12 rounded-full font-black uppercase tracking-widest text-[10px]">DÉCOUVRIR LES SERVICES</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

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

export default ClientAppointments;
