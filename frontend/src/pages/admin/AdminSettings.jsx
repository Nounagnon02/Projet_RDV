import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, Shield, Lock } from 'lucide-react';
import api from '../../api/axios';
import AdminLayout from '../../layouts/AdminLayout';
import { Button, Card } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

const AdminSettings = () => {
    const { t } = useTranslation();
    const { refreshUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get('/me');
                setProfile(response.data);
            } catch (error) {
                console.error('Error loading profile', error);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        if (profile) {
            setFormData((prev) => ({
                ...prev,
                name: profile.name || '',
                email: profile.email || '',
                phone: profile.phone || '',
            }));
        }
    }, [profile]);

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        // Validation du mot de passe
        if (formData.password && formData.password !== formData.password_confirmation) {
            setMessage(t('settings.password_mismatch', { defaultValue: 'Les mots de passe ne correspondent pas.' }));
            setSaving(false);
            return;
        }

        if (formData.password && formData.password.length < 8) {
            setMessage(t('settings.password_too_short', { defaultValue: 'Le mot de passe doit contenir au moins 8 caractères.' }));
            setSaving(false);
            return;
        }

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
            };

            if (formData.password) {
                payload.password = formData.password;
                payload.password_confirmation = formData.password_confirmation;
            }

            const response = await api.put('/me', payload);
            setProfile(response.data.user);
            setFormData((prev) => ({
                ...prev,
                password: '',
                password_confirmation: '',
            }));
            await refreshUser();
            setMessage(t('settings.save_success', { defaultValue: 'Profil mis à jour avec succès.' }));
        } catch (error) {
            const apiError = error?.response?.data?.message;
            const validationError = error?.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()[0]
                : null;
            setMessage(validationError || apiError || t('settings.save_error', { defaultValue: 'Erreur lors de la mise à jour du profil.' }));
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12">
                    <h1 className="text-4xl md:text-5xl font-display font-black italic text-maroon-dark mb-3">
                        {t('settings.admin_title', { defaultValue: 'Paramètres du compte' })}
                    </h1>
                    <p className="text-accent-bronze italic">
                        {t('settings.admin_subtitle', { defaultValue: 'Gérez vos informations de connexion et votre profil.' })}
                    </p>
                </div>

                {loading ? (
                    <Card className="p-10">{t('common.loading', { defaultValue: 'Chargement...' })}</Card>
                ) : (
                    <Card className="p-8 space-y-6">
                        <div className="flex items-center gap-3 text-primary">
                            <Shield className="size-5" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                                {t('settings.security', { defaultValue: 'Sécurité du compte' })}
                            </p>
                        </div>

                        {message && (
                            <div className={`rounded-xl px-4 py-3 text-sm ${message.toLowerCase().includes('erreur') || message.toLowerCase().includes('pas')
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Informations de base */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="rounded-2xl border border-maroon-dark/10 p-5">
                                    <label className="text-xs text-accent-bronze mb-2 block font-semibold">
                                        {t('common.name', { defaultValue: 'Nom' })} *
                                    </label>
                                    <div className="relative">
                                        <User className="size-4 text-primary absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            required
                                            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-maroon-dark/10 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-maroon-dark/10 p-5">
                                    <label className="text-xs text-accent-bronze mb-2 block font-semibold">
                                        {t('common.phone', { defaultValue: 'Téléphone' })}
                                    </label>
                                    <div className="relative">
                                        <Phone className="size-4 text-primary absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-maroon-dark/10 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Informations de connexion */}
                            <div className="border-t border-maroon-dark/10 pt-6">
                                <h3 className="text-lg font-bold text-maroon-dark mb-4 flex items-center gap-2">
                                    <Lock className="size-5" />
                                    {t('settings.login_info', { defaultValue: 'Informations de connexion' })}
                                </h3>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="rounded-2xl border border-maroon-dark/10 p-5">
                                        <label className="text-xs text-accent-bronze mb-2 block font-semibold">
                                            {t('common.email', { defaultValue: 'Email' })} *
                                        </label>
                                        <div className="relative">
                                            <Mail className="size-4 text-primary absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleChange('email', e.target.value)}
                                                required
                                                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-maroon-dark/10 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {t('settings.email_hint', { defaultValue: 'Utilisé pour vous connecter à votre compte' })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Changement de mot de passe */}
                            <div className="border-t border-maroon-dark/10 pt-6">
                                <h3 className="text-lg font-bold text-maroon-dark mb-4">
                                    {t('settings.change_password', { defaultValue: 'Changer le mot de passe' })}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    {t('settings.password_hint', { defaultValue: 'Laissez vide si vous ne souhaitez pas changer votre mot de passe.' })}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="rounded-2xl border border-maroon-dark/10 p-5">
                                        <label className="text-xs text-accent-bronze mb-2 block font-semibold">
                                            {t('settings.new_password', { defaultValue: 'Nouveau mot de passe' })}
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => handleChange('password', e.target.value)}
                                            placeholder="••••••••"
                                            minLength={8}
                                            className="w-full px-3 py-2.5 rounded-lg border border-maroon-dark/10 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                            {t('settings.password_length', { defaultValue: 'Minimum 8 caractères' })}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-maroon-dark/10 p-5">
                                        <label className="text-xs text-accent-bronze mb-2 block font-semibold">
                                            {t('settings.confirm_password', { defaultValue: 'Confirmer le mot de passe' })}
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password_confirmation}
                                            onChange={(e) => handleChange('password_confirmation', e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full px-3 py-2.5 rounded-lg border border-maroon-dark/10 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Informations du compte */}
                            <div className="border-t border-maroon-dark/10 pt-6">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-accent-bronze mb-2">{t('settings.role', { defaultValue: 'Rôle' })}</p>
                                    <p className="font-bold text-maroon-dark capitalize">{profile?.role || '-'}</p>
                                </div>
                            </div>

                            {/* Bouton de sauvegarde */}
                            <div className="flex justify-end pt-4">
                                <Button type="submit" variant="primary" className="h-12 px-8" disabled={saving}>
                                    {saving
                                        ? t('settings.saving', { defaultValue: 'Enregistrement...' })
                                        : t('settings.save_profile', { defaultValue: 'Enregistrer les modifications' })}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
