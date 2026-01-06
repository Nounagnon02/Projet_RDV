import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, Sparkles, Calendar } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="orb orb-primary w-96 h-96 -top-48 -left-48"></div>
            <div className="orb orb-purple w-80 h-80 -bottom-40 -right-40"></div>
            <div className="orb orb-cyan w-64 h-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"></div>

            {/* Login Card */}
            <div className="w-full max-w-md relative">
                {/* Logo */}
                <div className="flex items-center justify-center mb-10 animate-fade-in-up">
                    <div className="flex items-center gap-3">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse-glow">
                            <Calendar className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tight">RDV Pro</h1>
                            <p className="text-xs text-slate-500 font-medium">Gestion de rendez-vous</p>
                        </div>
                    </div>
                </div>

                {/* Card */}
                <div className="glass-card p-8 md:p-10 animate-fade-in-up stagger-1">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Bon retour parmi nous</h2>
                        <p className="text-slate-400 text-sm">Connectez-vous pour accéder à votre espace</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-rose-500/20 flex items-center justify-center shrink-0">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 block">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="vous@exemple.com"
                                    className="input-premium pl-12"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-slate-300">Mot de passe</label>
                                <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="input-premium pl-12"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full h-14 text-base flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Se connecter
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-800/50">
                        <p className="text-center text-slate-400 text-sm">
                            Pas encore de compte ?{' '}
                            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                                Créer un compte
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-600 text-xs mt-8 animate-fade-in-up stagger-2">
                    © 2026 RDV Pro. Tous droits réservés.
                </p>
            </div>
        </div>
    );
};

export default Login;
