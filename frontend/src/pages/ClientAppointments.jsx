import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Calendar, Clock, User, Trash2, Loader2, AlertCircle } from 'lucide-react';
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
            alert('Erreur lors de l’annulation');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-12">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white">Mes Rendez-vous</h1>
                <p className="text-slate-400 mt-2">Retrouvez ici toutes vos réservations passées et à venir.</p>
            </div>

            <div className="space-y-6">
                {appointments.length > 0 ? (
                    appointments.map((app) => (
                        <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-slate-700 shadow-xl shadow-black/20">
                            <div className="flex gap-6">
                                <div className="h-16 w-16 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center shrink-0">
                                    <span className="text-xs font-bold text-slate-500 uppercase">{format(parseISO(app.date), 'MMM', { locale: fr })}</span>
                                    <span className="text-xl font-black text-white">{format(parseISO(app.date), 'dd')}</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{app.service.name}</h3>
                                    <div className="flex items-center gap-4 mt-2">
                                        <p className="text-slate-400 text-sm flex items-center gap-1.5 font-medium">
                                            <User className="h-4 w-4 text-indigo-400" /> {app.provider?.business_name}
                                        </p>
                                        <p className="text-slate-400 text-sm flex items-center gap-1.5 font-medium">
                                            <Clock className="h-4 w-4 text-indigo-400" /> {app.start_time.substring(0, 5)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-6 border-t border-slate-800 pt-6 md:border-none md:pt-0">
                                <div className={`px-4 py-1.5 rounded-full text-xs font-bold border capitalize ${getStatusColor(app.status)}`}>
                                    {app.status}
                                </div>

                                {app.status === 'pending' && (
                                    <button
                                        onClick={() => handleCancel(app.id)}
                                        className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                                        title="Annuler le rendez-vous"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )).reverse()
                ) : (
                    <div className="py-20 text-center bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-800">
                        <AlertCircle className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium text-lg">Vous n'avez pas encore de rendez-vous.</p>
                        <Link to="/" className="inline-block mt-6 text-indigo-400 font-bold hover:text-indigo-300">
                            Découvrir les prestataires →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientAppointments;
