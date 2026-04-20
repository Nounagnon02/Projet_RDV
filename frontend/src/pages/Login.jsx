import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { Button, Card, Input, ProtectedIcon } from '../components/ui';

const Login = () => {
    const { t } = useTranslation();
    const { settings } = useSiteSettings();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || t('auth.login_error', { defaultValue: 'Identifiants incorrects' }));
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

            {/* Login Card */}
            <div className="w-full max-w-md relative z-10">
                {/* Logo & Brand */}
                <div className="flex flex-col items-center mb-8 md:mb-10 animate-fade-in">
                    <div className="flex items-center gap-3 md:gap-4 mb-2">
                        <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-primary-glow">
                            <ProtectedIcon translate="no" data-i18n="false">
                                <span className="material-symbols-outlined text-white text-3xl md:text-4xl">flare</span>
                            </ProtectedIcon>
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-maroon-dark tracking-tight">
                                {settings.site_name || 'Elsa Coiffure'}
                            </h1>
                            <p className="text-[8px] md:text-[10px] text-primary uppercase tracking-[0.4em] font-black">
                                {t('auth.brand_subtitle', { defaultValue: "L'Atelier de Luxe" })}
                            </p>
                        </div>
                    </div>
                </div>

                <Card className="p-6 sm:p-8 md:p-10 animate-fade-in-up stagger-1 border-none shadow-2xl shadow-maroon-dark/5 bg-white/80 backdrop-blur-xl">
                    <div className="text-center mb-8 md:mb-10">
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-maroon-dark mb-2 italic">
                            {t('auth.login_title', { defaultValue: 'Acces membre' })}
                        </h2>
                        <p className="text-accent-bronze text-xs md:text-sm font-medium italic">
                            {t('auth.login_subtitle', { defaultValue: 'Bienvenue dans votre espace privilegie' })}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-accent-rose/10 border border-accent-rose/20 text-accent-rose text-sm font-medium flex items-center gap-3">
                            <span className="material-symbols-outlined">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            type="email"
                            label={t('common.email', { defaultValue: 'Email' })}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder={t('auth.email_placeholder', { defaultValue: 'vous@excellence.com' })}
                            leftIcon={<span className="material-symbols-outlined">mail</span>}
                        />

                        <div>
                            <div className="flex items-center justify-between mb-2 pl-1">
                                <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-text-light opacity-60">
                                    {t('auth.password', { defaultValue: 'Mot de passe' })}
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-[10px] text-primary hover:text-primary-dark font-black tracking-widest uppercase transition-colors"
                                >
                                    {t('auth.forgot', { defaultValue: 'Oublie ?' })}
                                </Link>
                            </div>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                leftIcon={<span className="material-symbols-outlined">lock</span>}
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            className="w-full h-16 font-black uppercase tracking-[0.3em] text-xs shadow-xl"
                        >
                            {!loading && (
                                <div className="flex items-center justify-center gap-3">
                                    {t('auth.login_cta', { defaultValue: 'Se connecter' })}
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-accent-cream/50">
                        <p className="text-center text-accent-bronze text-sm">
                            {t('auth.no_account', { defaultValue: 'Pas encore membre ?' })}{' '}
                            <Link
                                to="/register"
                                className="text-primary hover:text-primary-dark font-bold underline underline-offset-4 transition-all"
                            >
                                {t('auth.create_profile', { defaultValue: 'Creer un profil' })}
                            </Link>
                        </p>
                    </div>
                </Card>

                {/* Footer */}
                <p className="text-center text-accent-bronze/40 text-[10px] font-black uppercase tracking-widest mt-8 animate-fade-in-up stagger-2">
                    © {new Date().getFullYear()} {settings.site_name || 'Elsa Coiffure'}. {t('auth.footer_tagline', { defaultValue: 'Excellence & Tradition.' })}
                </p>
            </div>
        </div>
    );
};

export default Login;


