import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    User,
    Phone,
    Mail,
    MessageSquare,
    MessageCircle,
    Loader2,
    Calendar as CalendarIcon,
    ArrowRight
} from 'lucide-react';
import { Card, Button } from '../../components/ui';
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
            case 'confirmed': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            case 'cancelled': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
            default: return 'bg-maroon-dark/5 text-accent-bronze border-maroon-dark/10';
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Calendar Side */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-maroon-dark/5 dark:border-white/5 pb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Scheduler</span>
                            </div>
                            <h1 className="font-display font-medium italic text-maroon-dark dark:text-text-light leading-none capitalize" style={{ fontSize: 'var(--text-h2)' }}>
                                {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                            </h1>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                                className="size-12 rounded-full border border-maroon-dark/10 flex items-center justify-center text-maroon-dark hover:border-primary hover:text-primary transition-all shadow-sm"
                            >
                                <ChevronLeft className="size-5" />
                            </button>
                            <button
                                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                                className="size-12 rounded-full border border-maroon-dark/10 flex items-center justify-center text-maroon-dark hover:border-primary hover:text-primary transition-all shadow-sm"
                            >
                                <ChevronRight className="size-5" />
                            </button>
                        </div>
                    </div>

                    <Card variant="light" className="p-0 overflow-hidden border border-maroon-dark/5 shadow-2xl shadow-maroon-dark/5 bg-white/50 backdrop-blur-xl">
                        <div className="grid grid-cols-7 gap-px bg-maroon-dark/5">
                            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                                <div key={day} className="bg-[#fbfafb] py-4 text-center text-[10px] font-black uppercase tracking-[0.3em] text-accent-bronze border-b border-maroon-dark/5">
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
                                            relative h-28 md:h-36 bg-white p-3 transition-all hover:bg-primary/5 group/day
                                            ${!isSameMonth(day, currentMonth) ? 'bg-maroon-dark/[0.02] opacity-30 cursor-default' : ''}
                                            ${isSelected ? 'bg-primary/[0.03] ring-inset ring-primary' : ''}
                                        `}
                                    >
                                        <time
                                            dateTime={format(day, 'yyyy-MM-dd')}
                                            className={`
                                                flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black
                                                ${isToday ? 'bg-primary text-white shadow-lg shadow-primary/30' : isSelected ? 'text-primary' : 'text-maroon-dark'}
                                            `}
                                        >
                                            {format(day, 'd')}
                                        </time>

                                        <div className="mt-3 space-y-1.5 overflow-hidden">
                                            {dayAppointments.slice(0, 2).map(app => (
                                                <div key={app.id} className="truncate rounded-md px-2 py-1 text-[9px] font-bold bg-maroon-dark/5 text-maroon-dark border border-maroon-dark/5 group-hover/day:border-primary/20 transition-colors">
                                                    <span className="text-primary mr-1 italic">{app.start_time.substring(0, 5)}</span>
                                                    {app.service.name}
                                                </div>
                                            ))}
                                            {dayAppointments.length > 2 && (
                                                <div className="text-[9px] text-accent-bronze font-black uppercase tracking-tighter pl-1">
                                                    + {dayAppointments.length - 2} autres
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Details Side */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="flex flex-col gap-2 border-b border-maroon-dark/5 dark:border-white/5 pb-8">
                        <h2 className="text-3xl font-display font-medium text-maroon-dark dark:text-text-light capitalize italic">
                            {format(selectedDay, 'eeee d MMMM', { locale: fr })}
                        </h2>
                        <p className="text-accent-bronze text-[10px] font-black uppercase tracking-[0.4em]">
                            {appointmentsForSelectedDay.length} RENDEZ-VOUS PRÉVU(S)
                        </p>
                    </div>

                    <div className="flex-1 space-y-6">
                        {loading ? (
                            <div className="flex py-20 items-center justify-center">
                                <Loader2 className="size-8 animate-spin text-primary" />
                            </div>
                        ) : appointmentsForSelectedDay.length > 0 ? (
                            appointmentsForSelectedDay.map(app => (
                                <Card key={app.id} hover variant="elevated" className="p-8 group shadow-xl shadow-maroon-dark/5 border border-maroon-dark/5">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border italic ${getStatusColor(app.status)}`}>
                                            {app.status === 'confirmed' ? 'Confirmé' : app.status === 'pending' ? 'En Attente' : 'Annulé'}
                                        </div>
                                        <div className="flex items-center gap-2 text-accent-bronze">
                                            <Clock className="size-4 text-primary" />
                                            <span className="text-[10px] font-black tracking-widest uppercase">{app.start_time.substring(0, 5)}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-display font-bold text-maroon-dark dark:text-text-light mb-6 leading-tight italic">{app.service.name}</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary italic font-display font-black">
                                                {app.client?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-maroon-dark uppercase tracking-widest">{app.client?.name || 'Client Inconnu'}</p>
                                                <div className="flex gap-3 text-[10px] text-accent-bronze font-medium mt-0.5 items-center">
                                                    <span className="flex items-center gap-1"><Phone className="size-3" /> {app.client?.phone || 'Private'}</span>
                                                    {app.client?.phone && (
                                                        <a
                                                            href={`https://wa.me/${app.client.phone.replace(/\D/g, '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="size-6 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm ml-1"
                                                            title="WhatsApp"
                                                        >
                                                            <MessageCircle className="size-3" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {app.client_notes && (
                                            <div className="mt-6 p-4 rounded-2xl bg-maroon-dark/[0.02] border border-maroon-dark/5 relative">
                                                <MessageSquare className="size-4 text-primary absolute -top-2 -left-2 bg-white rounded-full p-0.5" />
                                                <p className="text-xs text-accent-bronze italic leading-relaxed pl-2">{app.client_notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-maroon-dark/5 flex justify-end">
                                        <button className="text-[9px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 group/btn">
                                            DÉTAILS COMPLETS <ArrowRight className="size-3 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card variant="light" className="p-16 text-center border-dashed border-2 border-maroon-dark/5 rounded-[3rem]">
                                <div className="size-20 bg-accent-cream/50 rounded-full flex items-center justify-center mx-auto mb-8 text-accent-bronze">
                                    <CalendarIcon className="size-8" />
                                </div>
                                <h3 className="text-xl font-display italic font-bold text-maroon-dark mb-2">Plage Libre</h3>
                                <p className="text-accent-bronze text-sm italic">Aucun rendez-vous pour ce cycle de la lune.</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Agenda;
