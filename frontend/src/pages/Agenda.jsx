import { useState, useEffect } from 'react';
import api from '../api/axios';
import DashboardLayout from '../layouts/DashboardLayout';
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    User,
    Phone,
    Mail,
    MessageSquare,
    Loader2,
    Calendar as CalendarIcon
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const Agenda = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(new Date());

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/provider/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments', error);
        } finally {
            setLoading(false);
        }
    };

    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }),
    });

    const appointmentsForSelectedDay = appointments.filter(app =>
        isSameDay(parseISO(app.date), selectedDay)
    ).sort((a, b) => a.start_time.localeCompare(b.start_time));

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Calendar Side */}
                <div className="lg:col-span-8">
                    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-2xl font-bold text-white capitalize">
                                {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                            </h1>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-slate-800 bg-slate-800">
                            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                                <div key={day} className="bg-slate-900 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                                    {day}
                                </div>
                            ))}
                            {days.map((day, idx) => {
                                const dayAppointments = appointments.filter(app => isSameDay(parseISO(app.date), day));
                                const isSelected = isSameDay(day, selectedDay);
                                const isToday = isSameDay(day, new Date());

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedDay(day)}
                                        className={`
                      relative h-24 md:h-32 bg-slate-900 p-2 transition-all hover:bg-slate-800/50 
                      ${!isSameMonth(day, currentMonth) ? 'opacity-25' : ''}
                      ${isSelected ? 'bg-indigo-600/10 ring-1 ring-inset ring-indigo-500/50' : ''}
                    `}
                                    >
                                        <time
                                            dateTime={format(day, 'yyyy-MM-dd')}
                                            className={`
                        flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold
                        ${isToday ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50' : isSelected ? 'text-indigo-400' : 'text-slate-400'}
                      `}
                                        >
                                            {format(day, 'd')}
                                        </time>

                                        <div className="mt-2 space-y-1 overflow-hidden">
                                            {dayAppointments.slice(0, 2).map(app => (
                                                <div key={app.id} className="truncate rounded px-1.5 py-0.5 text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                                    {app.start_time.substring(0, 5)} {app.service.name}
                                                </div>
                                            ))}
                                            {dayAppointments.length > 2 && (
                                                <div className="text-[10px] text-slate-500 pl-1">
                                                    + {dayAppointments.length - 2} autres
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Details Side */}
                <div className="lg:col-span-4 h-full">
                    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl sticky top-8 h-[calc(100vh-8rem)] flex flex-col">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-white capitalize">
                                {format(selectedDay, 'eeee d MMMM', { locale: fr })}
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">
                                {appointmentsForSelectedDay.length} rendez-vous prévu(s)
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                            {loading ? (
                                <div className="flex h-32 items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                                </div>
                            ) : appointmentsForSelectedDay.length > 0 ? (
                                appointmentsForSelectedDay.map(app => (
                                    <div key={app.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 group hover:border-slate-700 transition-all">
                                        <div className={`flex items-center justify-between mb-4`}>
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border capitalize ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <Clock className="h-4 w-4" />
                                                <span className="text-sm font-bold">{app.start_time.substring(0, 5)} - {app.end_time.substring(0, 5)}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">{app.service.name}</h3>

                                        <div className="space-y-2.5">
                                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                                <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <span className="font-semibold text-slate-300">{app.client?.name || 'Client Inconnu'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                                <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center">
                                                    <Phone className="h-4 w-4" />
                                                </div>
                                                <span>{app.client?.phone || 'Non renseigné'}</span>
                                            </div>
                                            {app.client_notes && (
                                                <div className="mt-4 pt-4 border-t border-slate-800/50">
                                                    <div className="flex items-start gap-3">
                                                        <MessageSquare className="h-4 w-4 text-slate-500 mt-0.5" />
                                                        <p className="text-xs text-slate-500 italic leading-relaxed">{app.client_notes}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-800 rounded-3xl">
                                    <div className="h-16 w-16 bg-slate-950 rounded-2xl flex items-center justify-center mb-4">
                                        <CalendarIcon className="h-8 w-8 text-slate-700" />
                                    </div>
                                    <p className="text-slate-500 font-medium tracking-tight">Aucun rendez-vous pour ce jour.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Agenda;
