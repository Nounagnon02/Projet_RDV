import { useState, useEffect } from 'react';
import api from '../api/axios';
import DashboardLayout from '../layouts/DashboardLayout';
import { Save, Loader2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const DAYS = [
    { id: 1, name: 'Lundi' },
    { id: 2, name: 'Mardi' },
    { id: 3, name: 'Mercredi' },
    { id: 4, name: 'Jeudi' },
    { id: 5, name: 'Vendredi' },
    { id: 6, name: 'Samedi' },
    { id: 0, name: 'Dimanche' },
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
            // Initialize with all days if empty or partial
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
            // Sort to match Lundi-Dimanche order
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
            setMessage({ type: 'error', text: 'Une erreur est survenue lors de l’enregistrement.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Horaires d'ouverture</h1>
                        <p className="text-slate-400 mt-1">Définissez vos créneaux de travail pour chaque jour de la semaine.</p>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-70"
                    >
                        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        Enregistrer les modifications
                    </button>
                </div>

                {message.text && (
                    <div className={`mb-6 flex items-center gap-3 rounded-xl p-4 animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        <span className="font-medium">{message.text}</span>
                    </div>
                )}

                <div className="space-y-4">
                    {availabilities.map((day) => {
                        const dayName = DAYS.find(d => d.id === day.day_of_week).name;
                        return (
                            <div
                                key={day.day_of_week}
                                className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border transition-all duration-300 ${day.is_active
                                        ? 'bg-slate-900 border-slate-700 shadow-xl shadow-indigo-500/5'
                                        : 'bg-slate-950 border-slate-900 opacity-60'
                                    }`}
                            >
                                <div className="flex items-center gap-6 min-w-[150px]">
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={day.is_active}
                                            onChange={() => handleToggle(day.day_of_week)}
                                        />
                                        <div className="peer h-6 w-11 rounded-full bg-slate-800 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-slate-400 after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:bg-white"></div>
                                    </label>
                                    <span className={`text-lg font-bold ${day.is_active ? 'text-white' : 'text-slate-500'}`}>
                                        {dayName}
                                    </span>
                                </div>

                                {day.is_active ? (
                                    <div className="flex items-center gap-4 animate-in fade-in duration-500">
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <input
                                                type="time"
                                                value={day.start_time.substring(0, 5)}
                                                onChange={(e) => handleChange(day.day_of_week, 'start_time', e.target.value)}
                                                className="h-11 rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 text-slate-200 outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <span className="text-slate-600 font-bold">à</span>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <input
                                                type="time"
                                                value={day.end_time.substring(0, 5)}
                                                onChange={(e) => handleChange(day.day_of_week, 'end_time', e.target.value)}
                                                className="h-11 rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 text-slate-200 outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-slate-600 font-medium italic">Fermé</span>
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
