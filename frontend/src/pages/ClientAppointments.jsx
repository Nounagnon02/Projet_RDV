import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, Clock, User, Trash2, Loader2, AlertCircle, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

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
        if (!confirm('Voulez-vous vraiment annuler ce rendez-vous ?')) return;
        try {
            await api.delete(`/client/appointments/${id}`);
            fetchAppointments();
        } catch (error) {
            alert("Erreur lors de l'annulation");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'cancelled': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Chargement de vos rendez-vous...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="relative overflow-hidden py-16 px-6 md:px-12">
                <div className="orb orb-primary w-96 h-96 -top-48 -left-48"></div>
                <div className="orb orb-purple w-80 h-80 -top-20 -right-40"></div>

                <div className="max-w-4xl mx-auto relative animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-5 w-5 text-indigo-400" />
                        <span className="text-sm font-semibold text-indigo-400">Espace Client</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Mes Rendez-vous</h1>
                    <p className="text-slate-400 mt-3 text-lg">Retrouvez ici toutes vos réservations passées et à venir.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 md:px-12 pb-12">
                <div className="space-y-6">
                    {appointments.length > 0 ? (
                        [...appointments].reverse().map((app, index) => (
                            <div
                                key={app.id}
                                className={`glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in-up stagger-${(index % 5) + 1}`}
                            >
                                <div className="flex gap-6">
                                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex flex-col items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-slate-500 uppercase">{format(parseISO(app.date), 'MMM', { locale: fr })}</span>
                                        <span className="text-2xl font-black text-white">{format(parseISO(app.date), 'dd')}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">{app.service?.name}</h3>
                                        <div className="flex flex-wrap items-center gap-4">
                                            <p className="text-slate-400 text-sm flex items-center gap-1.5 font-medium">
                                                <User className="h-4 w-4 text-indigo-400" /> {app.provider?.business_name}
                                            </p>
                                            <p className="text-slate-400 text-sm flex items-center gap-1.5 font-medium">
                                                <Clock className="h-4 w-4 text-indigo-400" /> {app.start_time.substring(0, 5)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-4 border-t border-slate-800 pt-6 md:border-none md:pt-0">
                                    <div className={`px-4 py-2 rounded-full text-xs font-bold border capitalize ${getStatusColor(app.status)}`}>
                                        {app.status}
                                    </div>

                                    {app.status === 'pending' && (
                                        <button
                                            onClick={() => handleCancel(app.id)}
                                            className="h-11 w-11 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                                            title="Annuler le rendez-vous"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="glass-card border-2 border-dashed border-slate-800 p-16 text-center animate-fade-in-up">
                            <div className="h-20 w-20 rounded-3xl bg-slate-900 flex items-center justify-center mx-auto mb-6">
                                <Calendar className="h-10 w-10 text-slate-700" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Aucun rendez-vous</h3>
                            <p className="text-slate-500 font-medium mb-8">Vous n'avez pas encore de rendez-vous planifié.</p>
                            <Link to="/" className="btn-primary inline-flex items-center gap-2">
                                Découvrir les prestataires
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientAppointments;
