import { useState, useEffect } from 'react';
import api from '../api/axios';
import DashboardLayout from '../layouts/DashboardLayout';
import { Save, Loader2, Clock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const DAYS = [
    { id: 1, name: 'Lundi', short: 'Lun' },
    { id: 2, name: 'Mardi', short: 'Mar' },
    { id: 3, name: 'Mercredi', short: 'Mer' },
    { id: 4, name: 'Jeudi', short: 'Jeu' },
    { id: 5, name: 'Vendredi', short: 'Ven' },
    { id: 6, name: 'Samedi', short: 'Sam' },
    { id: 0, name: 'Dimanche', short: 'Dim' },
];

const AvailabilityManagement = () => {
    const [availabilities, setAvailabilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchAvailabilities();
    }, []);

    const fetchAvailabilities = async () => {
        try {
            const response = await api.get('/provider/availabilities');
            const data = response.data;
            const fullSchedule = DAYS.map(day => {
                const existing = data.find(a => a.day_of_week === day.id);
                return existing || {
                    day_of_week: day.id,
                    start_time: '09:00',
                    end_time: '18:00',
                    is_active: false
                };
            });
            const sortedSchedule = [...fullSchedule].sort((a, b) => {
                const order = [1, 2, 3, 4, 5, 6, 0];
                return order.indexOf(a.day_of_week) - order.indexOf(b.day_of_week);
            });
            setAvailabilities(sortedSchedule);
        } catch (error) {
            console.error('Error fetching availabilities', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (dayId) => {
        setAvailabilities(availabilities.map(a =>
            a.day_of_week === dayId ? { ...a, is_active: !a.is_active } : a
        ));
    };

    const handleChange = (dayId, field, value) => {
        setAvailabilities(availabilities.map(a =>
            a.day_of_week === dayId ? { ...a, [field]: value } : a
        ));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await api.post('/provider/availabilities', {
                availabilities: availabilities.filter(a => a.is_active)
            });
            setMessage({ type: 'success', text: 'Horaires enregistrés avec succès !' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: "Une erreur est survenue lors de l'enregistrement." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-[60vh] items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">Chargement des horaires...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-fade-in-up">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-5 w-5 text-indigo-400" />
                            <span className="text-sm font-semibold text-indigo-400">Planning</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Horaires d'ouverture</h1>
                        <p className="text-slate-400 mt-2">Définissez vos créneaux de travail pour chaque jour.</p>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary inline-flex items-center gap-2 disabled:opacity-70"
                    >
                        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        Enregistrer
                    </button>
                </div>

                {/* Message */}
                {message.text && (
                    <div className={`mb-8 flex items-center gap-3 glass-card p-4 animate-fade-in-up ${message.type === 'success' ? 'border-emerald-500/20' : 'border-rose-500/20'
                        }`}>
                        {message.type === 'success' ? (
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            </div>
                        ) : (
                            <div className="h-10 w-10 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
                                <AlertCircle className="h-5 w-5 text-rose-400" />
                            </div>
                        )}
                        <span className={`font-medium ${message.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {message.text}
                        </span>
                    </div>
                )}

                {/* Schedule */}
                <div className="space-y-4">
                    {availabilities.map((day, index) => {
                        const dayInfo = DAYS.find(d => d.id === day.day_of_week);
                        return (
                            <div
                                key={day.day_of_week}
                                className={`glass-card-light p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all animate-fade-in-up stagger-${(index % 5) + 1} ${!day.is_active && 'opacity-50'
                                    }`}
                            >
                                <div className="flex items-center gap-5 min-w-[180px]">
                                    {/* Toggle */}
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={day.is_active}
                                            onChange={() => handleToggle(day.day_of_week)}
                                        />
                                        <div className="h-7 w-12 rounded-full bg-slate-800 after:absolute after:top-[2px] after:left-[2px] after:h-6 after:w-6 after:rounded-full after:bg-slate-500 after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-5 peer-checked:after:bg-white"></div>
                                    </label>

                                    <div>
                                        <span className={`text-lg font-bold ${day.is_active ? 'text-white' : 'text-slate-500'}`}>
                                            {dayInfo.name}
                                        </span>
                                        {!day.is_active && (
                                            <p className="text-xs text-slate-600 font-medium">Fermé</p>
                                        )}
                                    </div>
                                </div>

                                {day.is_active && (
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <input
                                                type="time"
                                                value={day.start_time.substring(0, 5)}
                                                onChange={(e) => handleChange(day.day_of_week, 'start_time', e.target.value)}
                                                className="input-premium h-11 pl-10 pr-4 w-[140px]"
                                            />
                                        </div>
                                        <span className="text-slate-600 font-bold text-sm">à</span>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <input
                                                type="time"
                                                value={day.end_time.substring(0, 5)}
                                                onChange={(e) => handleChange(day.day_of_week, 'end_time', e.target.value)}
                                                className="input-premium h-11 pl-10 pr-4 w-[140px]"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AvailabilityManagement;
