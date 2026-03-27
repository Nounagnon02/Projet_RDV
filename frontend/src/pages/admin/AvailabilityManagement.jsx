import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Save, Loader2, Clock, CheckCircle2, AlertCircle, Sparkles, ChevronDown } from 'lucide-react';
import { Card, Button, Input } from '../../components/ui';
import { useTranslation } from 'react-i18next';

const DAYS = [
    { id: 1, name_fr: 'Lundi', name_en: 'Monday', short: 'Lun' },
    { id: 2, name_fr: 'Mardi', name_en: 'Tuesday', short: 'Mar' },
    { id: 3, name_fr: 'Mercredi', name_en: 'Wednesday', short: 'Mer' },
    { id: 4, name_fr: 'Jeudi', name_en: 'Thursday', short: 'Jeu' },
    { id: 5, name_fr: 'Vendredi', name_en: 'Friday', short: 'Ven' },
    { id: 6, name_fr: 'Samedi', name_en: 'Saturday', short: 'Sam' },
    { id: 0, name_fr: 'Dimanche', name_en: 'Sunday', short: 'Dim' },
];

const AvailabilityManagement = () => {
    const { t, i18n } = useTranslation();
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
            setMessage({ type: 'success', text: t('admin.success_message') });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: t('admin.error_message') });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-[60vh] items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="size-12 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-accent-bronze font-medium italic">{t('admin.loading')}</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-maroon-dark/5 dark:border-white/5 pb-8 animate-fade-in">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">{t('admin.salon_operations').toUpperCase()}</span>
                        </div>
                        <h1 className="font-display font-medium italic text-maroon-dark dark:text-text-light leading-none" style={{ fontSize: 'var(--text-h2)' }}>
                            {t('admin.availabilities_title')}
                        </h1>
                        <p className="text-accent-bronze mt-4 text-lg font-medium italic">
                            {t('admin.availabilities_subtitle')}
                        </p>
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        variant="primary"
                        size="lg"
                        className="h-14 px-8 font-black uppercase text-xs tracking-widest shadow-xl flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                        {t('admin.save_changes').toUpperCase()}
                    </Button>
                </div>

                {/* Message */}
                {message.text && (
                    <div className={`flex items-center gap-4 p-6 rounded-[2rem] border animate-fade-in ${message.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600' : 'bg-rose-500/5 border-rose-500/10 text-rose-600'
                        }`}>
                        {message.type === 'success' ? <CheckCircle2 className="size-5" /> : <AlertCircle className="size-5" />}
                        <span className="text-sm font-bold uppercase tracking-widest">
                            {message.type === 'success' ? t('admin.success_message') : t('admin.error_message')}
                        </span>
                    </div>
                )}

                {/* Schedule */}
                <div className="grid grid-cols-1 gap-4">
                    {availabilities.map((day, index) => {
                        const dayInfo = DAYS.find(d => d.id === day.day_of_week);
                        const dayName = i18n.language === 'fr' ? dayInfo.name_fr : dayInfo.name_en;
                        return (
                            <Card
                                key={day.day_of_week}
                                variant="elevated"
                                className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-500 border border-maroon-dark/5 ${!day.is_active ? 'opacity-40 grayscale-[0.5]' : 'bg-white/80 active-day'
                                    }`}
                            >
                                <div className="flex items-center gap-8 min-w-[240px]">
                                    {/* Luxury Switch */}
                                    <label className="relative inline-flex cursor-pointer items-center group">
                                        <input
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={day.is_active}
                                            onChange={() => handleToggle(day.day_of_week)}
                                        />
                                        <div className="h-8 w-14 rounded-full bg-maroon-dark/5 border border-maroon-dark/10 after:absolute after:top-[4px] after:left-[4px] after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow-md after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:border-primary peer-checked:after:translate-x-6"></div>
                                    </label>

                                    <div>
                                        <span className={`text-xl font-display font-bold italic tracking-tight ${day.is_active ? 'text-maroon-dark' : 'text-accent-bronze'}`}>
                                            {dayName}
                                        </span>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-1">
                                            {day.is_active ? t('admin.day_active') : t('admin.day_rest')}
                                        </p>
                                    </div>
                                </div>

                                {day.is_active && (
                                    <div className="flex items-center gap-6 animate-fade-in">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-black text-accent-bronze uppercase tracking-widest ml-1">
                                                {t('admin.opening')}
                                            </span>
                                            <TimeSelector
                                                value={day.start_time.substring(0, 5)}
                                                onChange={(value) => handleChange(day.day_of_week, 'start_time', value)}
                                                language={i18n.language}
                                            />
                                        </div>
                                        <div className="h-8 w-px bg-maroon-dark/10 self-end mb-2 hidden md:block"></div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-black text-accent-bronze uppercase tracking-widest ml-1">
                                                {t('admin.closing')}
                                            </span>
                                            <TimeSelector
                                                value={day.end_time.substring(0, 5)}
                                                onChange={(value) => handleChange(day.day_of_week, 'end_time', value)}
                                                language={i18n.language}
                                            />
                                        </div>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </div>
        </DashboardLayout>
    );
};

const TimeSelector = ({ value, onChange, language }) => {
    const [hour, minute] = value.split(':');
    const [showHourDropdown, setShowHourDropdown] = useState(false);
    const [showMinuteDropdown, setShowMinuteDropdown] = useState(false);

    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    const handleHourChange = (newHour) => {
        onChange(`${newHour}:${minute}`);
        setShowHourDropdown(false);
    };

    const handleMinuteChange = (newMinute) => {
        onChange(`${hour}:${newMinute}`);
        setShowMinuteDropdown(false);
    };

    return (
        <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            
            {/* Hour Selector */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setShowHourDropdown(!showHourDropdown)}
                    className="h-12 w-16 px-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary font-bold text-maroon-dark bg-white flex items-center justify-between hover:border-primary transition-colors"
                >
                    <span>{hour}</span>
                    <ChevronDown className="size-3 text-accent-bronze" />
                </button>
                {showHourDropdown && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowHourDropdown(false)} />
                        <div className="absolute z-20 mt-1 w-16 max-h-60 overflow-y-auto bg-white border border-[#e3dbd3] rounded-lg shadow-xl">
                            {hours.map((h) => (
                                <button
                                    key={h}
                                    type="button"
                                    onClick={() => handleHourChange(h)}
                                    className={`w-full px-3 py-2 text-left font-bold hover:bg-primary/10 transition-colors ${
                                        h === hour ? 'bg-primary/20 text-primary' : 'text-maroon-dark'
                                    }`}
                                >
                                    {h}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <span className="text-maroon-dark font-bold">:</span>

            {/* Minute Selector */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setShowMinuteDropdown(!showMinuteDropdown)}
                    className="h-12 w-16 px-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary font-bold text-maroon-dark bg-white flex items-center justify-between hover:border-primary transition-colors"
                >
                    <span>{minute}</span>
                    <ChevronDown className="size-3 text-accent-bronze" />
                </button>
                {showMinuteDropdown && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowMinuteDropdown(false)} />
                        <div className="absolute z-20 mt-1 w-16 max-h-60 overflow-y-auto bg-white border border-[#e3dbd3] rounded-lg shadow-xl">
                            {minutes.map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => handleMinuteChange(m)}
                                    className={`w-full px-3 py-2 text-left font-bold hover:bg-primary/10 transition-colors ${
                                        m === minute ? 'bg-primary/20 text-primary' : 'text-maroon-dark'
                                    }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <span className="text-[10px] font-black text-accent-bronze uppercase tracking-widest">
                {language === 'fr' ? 'h' : ''}
            </span>
        </div>
    );
};

export default AvailabilityManagement;
