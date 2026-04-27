import { useState } from 'react';
import 'normalize.css';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { Mail, Lock, User, Phone, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { BrandLogo, Button, Card, Input } from '../components/ui';

const Register = () => {
    const { t } = useTranslation();
    const { settings } = useSiteSettings();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: 'client',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password_confirmation) {
            setError(t('auth.password_mismatch', { defaultValue: 'Les mots de passe ne correspondent pas' }));
            return;
        }

        setLoading(true);
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || t('common.error', { defaultValue: 'Une erreur est survenue' }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#fdfbf8] via-neutral-100 to-[#f7f3f0]">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-[30rem] h-[30rem] bg-maroon-dark/[0.03] rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-2xl relative z-10">
                {/* Logo & Brand */}
                <div className="flex flex-col items-center mb-8 md:mb-10 animate-fade-in">
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
                        <BrandLogo
                            className="h-14 sm:h-16 md:h-20 w-auto max-w-[170px] sm:max-w-[200px] md:max-w-[220px] object-contain"
                            alt="Logo Elsa Coiffure"
                        />
                        <div className="flex flex-col justify-center space-y-1">
                            <h1 className="text-xl md:text-2xl font-display font-bold text-primary tracking-[0.16em] uppercase leading-none">{settings.site_name || 'Elsa Coiffure'}</h1>
                            <p className="text-[8px] md:text-[10px] text-primary uppercase tracking-[0.28em] font-black">{t('auth.brand_subtitle', { defaultValue: "L'Atelier de Luxe" })}</p>
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <Card className="p-6 sm:p-8 md:p-12 animate-fade-in-up stagger-1 border-none shadow-2xl shadow-maroon-dark/5 bg-white/80 backdrop-blur-xl">
                    <div className="text-center mb-8 md:mb-10">
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-maroon-dark mb-2 italic">{t('auth.register_title', { defaultValue: "Rejoindre l'elite" })}</h2>
                        <p className="text-accent-bronze text-xs md:text-sm italic">{t('auth.register_subtitle', { defaultValue: 'Creez votre profil pour une experience sur-mesure' })}</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 rounded-xl bg-accent-rose/10 border border-accent-rose/20 text-accent-rose text-sm font-medium flex items-center gap-3">
                            <span className="material-symbols-outlined">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Form Fields - Redesigned Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                type="text"
                                label={t('auth.full_name', { defaultValue: 'Nom complet' })}
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder={t('auth.full_name_placeholder', { defaultValue: 'Jean Dupont' })}
                                leftIcon={<span className="material-symbols-outlined">person</span>}
                            />

                            <Input
                                type="tel"
                                label={t('common.phone', { defaultValue: 'Telephone' })}
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+33 6 12 34 56 78"
                                leftIcon={<span className="material-symbols-outlined">call</span>}
                            />

                            <div className="md:col-span-2">
                                <Input
                                    type="email"
                                label={t('auth.email_address', { defaultValue: 'Adresse Email' })}
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                placeholder={t('auth.email_placeholder', { defaultValue: 'vous@excellence.com' })}
                                    leftIcon={<span className="material-symbols-outlined">mail</span>}
                                />
                            </div>

                            <Input
                                type="password"
                                label={t('auth.password', { defaultValue: 'Mot de passe' })}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                                placeholder="••••••••"
                                leftIcon={<span className="material-symbols-outlined">lock</span>}
                            />

                            <Input
                                type="password"
                                label={t('auth.confirm_password', { defaultValue: 'Confirmer' })}
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                leftIcon={<span className="material-symbols-outlined">shield</span>}
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            className="w-full h-16 font-black uppercase tracking-[0.3em] text-xs shadow-xl"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                            ) : (
                                <div className="flex items-center justify-center gap-3">
                                    {t('auth.register_cta', { defaultValue: 'Creer mon compte' })}
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-accent-cream">
                        <p className="text-center text-accent-bronze text-sm">
                            {t('auth.already_member', { defaultValue: "Deja membre de l'Atelier ?" })}{' '}
                            <Link to="/login" className="text-primary hover:text-primary-dark font-bold underline underline-offset-4 transition-all">
                                {t('auth.login_cta', { defaultValue: 'Se connecter' })}
                            </Link>
                        </p>
                    </div>
                </Card>

                <p className="text-center text-accent-bronze/40 text-[10px] font-black uppercase tracking-widest mt-8 animate-fade-in-up stagger-2">
                    {t('auth.private_circle', { defaultValue: 'En creant un compte, vous integrez le cercle prive' })} {settings.site_name || 'Elsa Coiffure'}.
                </p>
            </div>
        </div>
    );
};

export default Register;
