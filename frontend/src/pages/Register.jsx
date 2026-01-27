import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { Button, Card, Input } from '../components/ui';

const Register = () => {
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
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        setLoading(true);
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-background-light via-neutral-100 to-accent-cream dark:from-background-dark dark:via-maroon-800 dark:to-maroon-900">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-maroon-dark/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-2xl relative z-10">
                {/* Logo & Brand */}
                <div className="flex flex-col items-center mb-10 animate-fade-in-up">
                    <div className="flex items-center gap-3">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-primary-glow">
                            <span className="material-symbols-outlined text-white text-3xl">flare</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-display font-bold text-maroon-dark dark:text-text-light tracking-tight">Elsa Coiffure</h1>
                            <p className="text-[10px] text-primary uppercase tracking-[0.4em] font-black">L'Atelier de Luxe</p>
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <Card className="p-8 md:p-12 animate-fade-in-up stagger-1">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-display font-bold text-maroon-dark dark:text-text-light mb-2 italic">Rejoindre l'Elite</h2>
                        <p className="text-accent-bronze text-sm italic">Créez votre profil pour une expérience sur-mesure</p>
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
                                label="Nom complet"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Jean Dupont"
                                leftIcon={<span className="material-symbols-outlined">person</span>}
                            />

                            <Input
                                type="tel"
                                label="Téléphone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+33 6 12 34 56 78"
                                leftIcon={<span className="material-symbols-outlined">call</span>}
                            />

                            <div className="md:col-span-2">
                                <Input
                                    type="email"
                                    label="Adresse Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="vous@excellence.com"
                                    leftIcon={<span className="material-symbols-outlined">mail</span>}
                                />
                            </div>

                            <Input
                                type="password"
                                label="Mot de passe"
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
                                label="Confirmer"
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
                                    CRÉER MON COMPTE
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-accent-cream">
                        <p className="text-center text-accent-bronze text-sm">
                            Déjà membre de l'Atelier ?{' '}
                            <Link to="/login" className="text-primary hover:text-primary-dark font-bold underline underline-offset-4 transition-all">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </Card>

                <p className="text-center text-accent-bronze/40 text-[10px] font-black uppercase tracking-widest mt-8 animate-fade-in-up stagger-2">
                    En créant un compte, vous intégrez le cercle privé Elsa Coiffure.
                </p>
            </div>
        </div>
    );
};

export default Register;
