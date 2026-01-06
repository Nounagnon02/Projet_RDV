import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, ArrowRight, Loader2, Calendar, Building2, CheckCircle2 } from 'lucide-react';

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

    const roles = [
        { id: 'client', label: 'Client', desc: 'Réserver des rendez-vous', icon: User },
        { id: 'provider', label: 'Prestataire', desc: 'Gérer mon activité', icon: Building2 },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="orb orb-primary w-96 h-96 -top-48 -right-48"></div>
            <div className="orb orb-purple w-80 h-80 -bottom-40 -left-40"></div>

            <div className="w-full max-w-2xl relative">
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
                        <h2 className="text-2xl font-bold text-white mb-2">Créer votre compte</h2>
                        <p className="text-slate-400 text-sm">Rejoignez-nous et commencez à gérer vos rendez-vous</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Selection */}
                        <div className="grid grid-cols-2 gap-4 mb-2">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: role.id })}
                                    className={`p-5 rounded-2xl border-2 transition-all text-left relative overflow-hidden group ${formData.role === role.id
                                            ? 'border-indigo-500 bg-indigo-500/10'
                                            : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                                        }`}
                                >
                                    {formData.role === role.id && (
                                        <div className="absolute top-3 right-3">
                                            <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                                        </div>
                                    )}
                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-all ${formData.role === role.id ? 'bg-indigo-500/20' : 'bg-slate-800 group-hover:bg-slate-700'
                                        }`}>
                                        <role.icon className={`h-6 w-6 ${formData.role === role.id ? 'text-indigo-400' : 'text-slate-400'}`} />
                                    </div>
                                    <h3 className={`font-bold text-lg ${formData.role === role.id ? 'text-white' : 'text-slate-300'}`}>
                                        {role.label}
                                    </h3>
                                    <p className="text-slate-500 text-sm mt-1">{role.desc}</p>
                                </button>
                            ))}
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 block">Nom complet</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Jean Dupont"
                                        className="input-premium pl-12"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 block">Téléphone</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+33 6 12 34 56 78"
                                        className="input-premium pl-12"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-semibold text-slate-300 block">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="vous@exemple.com"
                                        className="input-premium pl-12"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 block">Mot de passe</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={8}
                                        placeholder="••••••••"
                                        className="input-premium pl-12"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 block">Confirmer</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        required
                                        placeholder="••••••••"
                                        className="input-premium pl-12"
                                    />
                                </div>
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
                                    Créer mon compte
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-800/50">
                        <p className="text-center text-slate-400 text-sm">
                            Déjà un compte ?{' '}
                            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-slate-600 text-xs mt-8 animate-fade-in-up stagger-2">
                    En créant un compte, vous acceptez nos{' '}
                    <a href="#" className="text-slate-500 hover:text-slate-400">Conditions d'utilisation</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
