import { useState, useEffect } from 'react';
import api from '../api/axios';
import ClientLayout from '../layouts/ClientLayout';
import { useTranslation } from 'react-i18next';
import { Card, Button, ProtectedIcon } from '../components/ui';
import {
    Calendar,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MemberProfile = () => {
    const { t } = useTranslation();
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
                api.get('/loyalty/account')
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
        <ClientLayout
            title={t('profile.title', { defaultValue: 'Votre profil' })}
            subtitle={t('profile.subtitle', { defaultValue: 'Bonjour {{name}}, bienvenue dans votre espace client.', name: user?.name?.split(' ')[0] || '' })}
        >
            <div className="space-y-16 animate-fade-in-up stagger-1">
                {/* Hero section: Quick Action */}
                <section>
                        <div className="bg-gradient-to-br from-primary to-maroon-dark rounded-[40px] p-12 md:p-16 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <ProtectedIcon translate="no" data-i18n="false" className="text-[200px]">
                                    <span className="material-symbols-outlined text-[200px]">calendar_month</span>
                                </ProtectedIcon>
                            </div>
                            <div className="relative z-10 max-w-2xl space-y-8">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em]">{t('profile.next_appointment', { defaultValue: 'Votre prochain rendez-vous' })}</p>
                                    <h3 className="text-5xl md:text-6xl font-display italic font-black leading-none">{t('profile.hero_title', { defaultValue: 'Un instant pour vous ?' })}</h3>
                                </div>
                                <p className="text-white/80 text-lg font-medium italic max-w-md">
                                    {t('profile.hero_desc', { defaultValue: 'Reservez votre prochaine transformation signature et profitez de l excellence Elsa Coiffure.' })}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link to="/providers">
                                        <Button variant="secondary" className="h-14 px-12 bg-white text-maroon-dark hover:bg-white/90 font-black uppercase tracking-[0.3em] text-[10px] shadow-xl">
                                            {t('profile.book_now', { defaultValue: 'Prendre rendez-vous' })}
                                        </Button>
                                    </Link>
                                    <Link to="/client/appointments">
                                        <Button variant="outline" className="h-14 px-12 border-white/30 text-white hover:bg-white/10 font-black uppercase tracking-[0.3em] text-[10px]">
                                            {t('profile.my_bookings', { defaultValue: 'Mes reservations' })}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                </section>

                {/* Prochain RDV highlight */}
                <section className="space-y-10">
                        <div className="flex items-center gap-6">
                            <h3 className="text-2xl font-black tracking-tight leading-none uppercase">{t('profile.next_signature', { defaultValue: 'Prochain RDV signature' })}</h3>
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
                                        <span className="text-[9px] font-black uppercase tracking-widest px-4 py-1.5 bg-primary/10 text-primary rounded-full">{t('profile.exceptional_care', { defaultValue: 'Soin d exception' })}</span>
                                        <span className="text-[9px] font-black uppercase tracking-widest px-4 py-1.5 bg-maroon-dark/5 text-accent-bronze rounded-full italic">14:00 (2h)</span>
                                    </div>
                                    <h4 className="text-4xl font-display italic font-bold text-maroon-dark dark:text-text-light">Soin Rituel Hydratation</h4>
                                    <div className="flex items-center gap-8 text-accent-bronze text-sm font-medium italic">
                                        <span className="flex items-center gap-2"><Sparkles className="size-4 text-primary" /> L'Atelier Paris</span>
                                        <span className="text-maroon-dark dark:text-text-light underline decoration-primary underline-offset-8 cursor-pointer hover:text-primary transition-colors">{t('common.edit', { defaultValue: 'Modifier' })}</span>
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
                                <p className="text-accent-bronze font-display italic text-2xl">{t('profile.no_transformations', { defaultValue: 'Aucune transformation prevue.' })}</p>
                            </Card>
                        )}
                </section>
            </div>
        </ClientLayout>
    );
};

export default MemberProfile;
