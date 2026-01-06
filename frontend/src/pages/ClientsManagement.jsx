import { useState, useEffect } from 'react';
import api from '../api/axios';
import DashboardLayout from '../layouts/DashboardLayout';
import { Users, Loader2, Mail, Phone, Calendar, Sparkles, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const ClientsManagement = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await api.get('/provider/appointments');
            const appointments = response.data;

            // Extraire les clients uniques des rendez-vous
            const clientsMap = new Map();
            appointments.forEach(app => {
                if (app.client && !clientsMap.has(app.client.id)) {
                    clientsMap.set(app.client.id, {
                        ...app.client,
                        appointmentsCount: appointments.filter(a => a.client?.id === app.client.id).length,
                        lastAppointment: appointments
                            .filter(a => a.client?.id === app.client.id)
                            .sort((a, b) => new Date(b.date) - new Date(a.date))[0]
                    });
                }
            });

            setClients(Array.from(clientsMap.values()));
        } catch (error) {
            console.error('Error fetching clients', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-[60vh] items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">Chargement des clients...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-fade-in-up">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-5 w-5 text-indigo-400" />
                            <span className="text-sm font-semibold text-indigo-400">Gestion</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Mes Clients</h1>
                        <p className="text-slate-400 mt-2">Retrouvez tous les clients qui ont pris rendez-vous chez vous.</p>
                    </div>

                    <div className="glass-card-light px-5 py-3">
                        <p className="text-sm text-slate-400">Total clients</p>
                        <p className="text-2xl font-black text-white">{clients.length}</p>
                    </div>
                </div>

                {/* Clients Grid */}
                {clients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clients.map((client, index) => (
                            <div
                                key={client.id}
                                className={`glass-card p-6 animate-fade-in-up stagger-${(index % 5) + 1}`}
                            >
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                                        <span className="text-xl font-black text-white">{client.name?.charAt(0)}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-white truncate">{client.name}</h3>
                                        {client.email && (
                                            <p className="text-slate-500 text-sm flex items-center gap-2 truncate">
                                                <Mail className="h-3.5 w-3.5 shrink-0" /> {client.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {client.phone && (
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                                        <Phone className="h-4 w-4 text-indigo-400" />
                                        <span>{client.phone}</span>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-slate-800/50 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">Rendez-vous</span>
                                        <span className="text-sm font-bold text-white">{client.appointmentsCount}</span>
                                    </div>
                                    {client.lastAppointment && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-500">Dernier RDV</span>
                                            <span className="text-sm font-medium text-slate-300">
                                                {format(parseISO(client.lastAppointment.date), 'd MMM yyyy', { locale: fr })}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card border-2 border-dashed border-slate-800 p-16 text-center">
                        <div className="h-20 w-20 rounded-3xl bg-slate-900 flex items-center justify-center mx-auto mb-6">
                            <Users className="h-10 w-10 text-slate-700" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Aucun client</h3>
                        <p className="text-slate-500 font-medium">
                            Vos clients apparaîtront ici après leur première réservation.
                        </p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ClientsManagement;
