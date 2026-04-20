/**
 * LoyaltyProgram.jsx - Programme de récompenses Elsa
 * 
 * Page client pour voir et gérer son compte de fidélité
 * Points, tiers, récompenses disponibles
 */

import { useState, useEffect } from 'react';
import api from '../api/axios';
import ClientLayout from '../layouts/ClientLayout';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui';
import { Award, Gift, Lock, Unlock } from 'lucide-react';

const LoyaltyProgram = () => {
    const { t } = useTranslation();
    const [rewards, setRewards] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRewards();
    }, []);

    const fetchRewards = async () => {
        try {
            setLoading(true);
            const response = await api.get('/loyalty/account');
            setRewards(response.data);
        } catch (error) {
            console.error('Error fetching rewards', error);
            // Fallback data for demo
            setRewards({
                points: 2450,
                tier: t('loyalty.tier.platinum', { defaultValue: 'Platinum' }),
                nextTier: t('loyalty.tier.diamond', { defaultValue: 'Diamond' }),
                progress: 65,
                rewardsAvailable: 8,
                histogram: [
                    { amount: 500, claimed: true },
                    { amount: 1000, claimed: true },
                    { amount: 2000, claimed: false },
                    { amount: 3000, claimed: false },
                    { amount: 5000, claimed: false },
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    const tiers = [
        { level: t('loyalty.tier.silver', { defaultValue: 'Silver' }), minPoints: 0, benefits: [t('loyalty.benefit.silver1', { defaultValue: '5% de reduction sur tous les services' }), t('loyalty.benefit.silver2', { defaultValue: 'Cadeau anniversaire' })] },
        { level: t('loyalty.tier.gold', { defaultValue: 'Gold' }), minPoints: 1500, benefits: [t('loyalty.benefit.gold1', { defaultValue: '10% de reduction sur tous les services' }), t('loyalty.benefit.gold2', { defaultValue: 'Consultation gratuite' }), t('loyalty.benefit.gold3', { defaultValue: 'Reservation prioritaire' })] },
        { level: t('loyalty.tier.platinum', { defaultValue: 'Platinum' }), minPoints: 3000, benefits: [t('loyalty.benefit.platinum1', { defaultValue: '15% de reduction sur tous les services' }), t('loyalty.benefit.platinum2', { defaultValue: 'Produits premium offerts' }), t('loyalty.benefit.platinum3', { defaultValue: 'Acces VIP' })] },
        { level: t('loyalty.tier.diamond', { defaultValue: 'Diamond' }), minPoints: 6000, benefits: [t('loyalty.benefit.diamond1', { defaultValue: '20% de reduction sur tous les services' }), t('loyalty.benefit.diamond2', { defaultValue: 'Evenements exclusifs' }), t('loyalty.benefit.diamond3', { defaultValue: 'Styliste personnel' })] },
    ];

    if (loading) {
        return (
            <ClientLayout title="Fidelite" subtitle="Suivez vos points et vos avantages VIP.">
                <div className="min-h-[400px] flex items-center justify-center">
                    <div className="animate-spin text-primary">
                        <Award className="size-12" />
                    </div>
                </div>
            </ClientLayout>
        );
    }

    return (
        <ClientLayout title="Fidelite" subtitle="Suivez vos points et vos avantages VIP.">
            <div>
                {/* Hero Section */}
                <div className="relative overflow-hidden py-8 lg:py-10 px-4 lg:px-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl">
                    <div className="max-w-6xl mx-auto relative text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Award className="size-6 text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{t('loyalty.program', { defaultValue: 'Programme Fidelite' })}</span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-display font-black text-maroon-dark dark:text-text-light italic leading-tight mb-6">
                            {t('loyalty.title', { defaultValue: 'Votre statut elite' })}
                        </h1>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-16">
                    {rewards && (
                        <>
                            {/* Current Status Card */}
                            <div className="bg-white dark:bg-white/5 rounded-3xl p-8 md:p-12 mb-12 border border-primary/20 shadow-xl">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                                    {/* Points */}
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Total Points</p>
                                        <div className="text-6xl font-display font-black italic text-maroon-dark dark:text-text-light">
                                            {rewards.points?.toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Tier */}
                                    <div className="text-center border-l border-r border-maroon-dark/10">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">{t('loyalty.current_tier', { defaultValue: 'Niveau actuel' })}</p>
                                        <div className="text-4xl font-display font-black italic text-primary mb-4">
                                            {rewards.tier}
                                        </div>
                                        <p className="text-sm text-accent-bronze">{t('loyalty.next', { defaultValue: 'Suivant' })}: {rewards.nextTier}</p>
                                    </div>

                                    {/* Progress */}
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">{t('loyalty.progress', { defaultValue: 'Progression' })}</p>
                                        <div className="w-full bg-maroon-dark/10 rounded-full h-3 mb-3">
                                            <div 
                                                className="bg-gradient-to-r from-primary to-primary/80 h-full rounded-full transition-all"
                                                style={{ width: `${rewards.progress || 65}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-accent-bronze">{rewards.progress || 65}% {t('loyalty.to_next_tier', { defaultValue: 'vers le niveau suivant' })}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tier Information */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-display font-bold italic text-maroon-dark dark:text-text-light mb-8">
                                    {t('loyalty.membership_tiers', { defaultValue: 'Niveaux de fidelite' })}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {tiers.map((tier) => (
                                        <div 
                                            key={tier.level}
                                            className={`rounded-2xl p-6 border-2 transition-all ${
                                                rewards.tier === tier.level
                                                    ? 'bg-primary/10 border-primary'
                                                    : 'bg-white dark:bg-white/5 border-maroon-dark/10'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-4">
                                                {rewards.tier === tier.level ? (
                                                    <Unlock className="size-5 text-primary" />
                                                ) : (
                                                    <Lock className="size-5 text-maroon-dark/40" />
                                                )}
                                                <h3 className="font-bold text-lg">{tier.level}</h3>
                                            </div>
                                            <p className="text-sm text-accent-bronze mb-4">{tier.minPoints}+ {t('loyalty.points', { defaultValue: 'points' })}</p>
                                            <ul className="space-y-2">
                                                {tier.benefits.map((benefit, idx) => (
                                                    <li key={idx} className="text-sm flex items-start gap-2">
                                                        <span className="text-primary mt-1">✓</span>
                                                        <span>{benefit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Available Rewards */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-display font-bold italic text-maroon-dark dark:text-text-light mb-8">
                                    <Gift className="inline size-8 mr-3 text-primary" />
                                    {t('loyalty.available_rewards', { defaultValue: 'Recompenses disponibles' })} ({rewards.rewardsAvailable || 0})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { id: 1, points: 500, reward: t('loyalty.reward.1', { defaultValue: 'Soin capillaire offert' }), status: 'claimed' },
                                        { id: 2, points: 1000, reward: t('loyalty.reward.2', { defaultValue: 'Pack de produits premium' }), status: 'claimed' },
                                        { id: 3, points: 2000, reward: t('loyalty.reward.3', { defaultValue: 'Credit service 50$' }), status: 'pending' },
                                        { id: 4, points: 3000, reward: t('loyalty.reward.4', { defaultValue: 'Pass VIP' }), status: 'pending' },
                                        { id: 5, points: 5000, reward: t('loyalty.reward.5', { defaultValue: 'Package styling exclusif' }), status: 'pending' },
                                    ].map((reward) => (
                                        <div 
                                            key={reward.id}
                                            className={`p-6 rounded-2xl border-2 ${
                                                reward.status === 'claimed'
                                                    ? 'bg-emerald-500/5 border-emerald-500/20'
                                                    : rewards.points >= reward.points
                                                        ? 'bg-primary/5 border-primary/20 cursor-pointer hover:border-primary/40'
                                                        : 'bg-maroon-dark/5 border-maroon-dark/10 opacity-60'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="font-bold text-lg">{reward.reward}</h3>
                                                {reward.status === 'claimed' && (
                                                    <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">{t('loyalty.claimed', { defaultValue: 'Recupere' })}</span>
                                                )}
                                            </div>
                                            <p className="text-primary font-bold mb-4">{reward.points.toLocaleString()} {t('loyalty.points', { defaultValue: 'points' })}</p>
                                            {reward.status === 'pending' && rewards.points >= reward.points && (
                                                <Button variant="primary" size="sm" className="w-full">
                                                    {t('loyalty.claim_reward', { defaultValue: 'Recuperer la recompense' })}
                                                </Button>
                                            )}
                                            {reward.status === 'pending' && rewards.points < reward.points && (
                                                <p className="text-xs text-accent-bronze">
                                                    {(reward.points - rewards.points).toLocaleString()} {t('loyalty.more_points_needed', { defaultValue: 'points restants' })}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </ClientLayout>
    );
};

export default LoyaltyProgram;
