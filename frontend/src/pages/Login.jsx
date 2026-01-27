import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Input } from '../components/ui';

const Login = () => {
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
            setError(err.response?.data?.message || 'Identifiants incorrects');
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

            {/* Login Card */}
            <div className="w-full max-w-md relative z-10">
                {/* Logo & Brand */}
                <div className="flex flex-col items-center mb-10 animate-fade-in-up">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-primary-glow">
                            <span className="material-symbols-outlined text-white text-4xl">flare</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-bold text-maroon-dark dark:text-text-light tracking-tight">
                                Elsa Coiffure
                            </h1>
                            <p className="text-[10px] text-primary uppercase tracking-[0.4em] font-black">
                                L'Atelier de Luxe
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card */}
                <Card className="p-8 md:p-10 animate-fade-in-up stagger-1">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-display font-bold text-maroon-dark dark:text-text-light mb-2 italic">
                            Accès Membre
                        </h2>
                        <p className="text-accent-bronze text-sm font-medium italic">
                            Bienvenue dans votre espace privilégié
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
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="vous@excellence.com"
                            leftIcon={<span className="material-symbols-outlined">mail</span>}
                        />

                        <div>
                            <div className="flex items-center justify-between mb-2 pl-1">
                                <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-text-light opacity-60">
                                    Mot de passe
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-[10px] text-primary hover:text-primary-dark font-black tracking-widest uppercase transition-colors"
                                >
                                    Oublié ?
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
                                    SE CONNECTER
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-accent-cream/50">
                        <p className="text-center text-accent-bronze text-sm">
                            Pas encore membre ?{' '}
                            <Link
                                to="/register"
                                className="text-primary hover:text-primary-dark font-bold underline underline-offset-4 transition-all"
                            >
                                Créer un profil
                            </Link>
                        </p>
                    </div>
                </Card>

                {/* Footer */}
                <p className="text-center text-accent-bronze/40 text-[10px] font-black uppercase tracking-widest mt-8 animate-fade-in-up stagger-2">
                    © 2026 Elsa Coiffure. Excellence & Tradition.
                </p>
            </div>
        </div>
    );
};

export default Login;
