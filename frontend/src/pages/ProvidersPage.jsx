import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
    Search,
    Loader2,
    MapPin,
    Scissors,
    Star,
    ChevronRight,
    Sparkles,
    Building2
} from 'lucide-react';

const ProvidersPage = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProviders();
    }, []);

    const fetchProviders = async (search = '') => {
        setLoading(true);
        try {
            const response = await api.get(`/providers${search ? `?search=${search}` : ''}`);
            setProviders(response.data);
        } catch (error) {
            console.error('Error fetching providers', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProviders(searchTerm);
    };

    return (
        <div className="min-h-screen pb-16">
            {/* Hero */}
            <div className="relative overflow-hidden py-20 px-6">
                <div className="orb orb-primary w-96 h-96 -top-48 -left-48"></div>
                <div className="orb orb-purple w-80 h-80 -top-20 -right-40"></div>
                <div className="orb orb-cyan w-64 h-64 bottom-0 left-1/2 -translate-x-1/2 opacity-20"></div>

                <div className="max-w-4xl mx-auto text-center relative">
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                            <Sparkles className="h-4 w-4 text-indigo-400" />
                            <span className="text-sm font-semibold text-indigo-400">Découvrez</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
                            Trouvez votre <span className="gradient-text">prestataire</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
                            Parcourez notre liste de professionnels et réservez votre rendez-vous en quelques clics.
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
                            <div className="glass-card p-2 flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Rechercher un prestataire..."
                                        className="w-full h-12 pl-12 pr-4 bg-transparent border-none text-white placeholder:text-slate-500 focus:outline-none"
                                    />
                                </div>
                                <button type="submit" className="btn-primary h-12 px-6">
                                    Rechercher
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Providers Grid */}
            <div className="max-w-6xl mx-auto px-6">
                {loading ? (
                    <div className="flex h-48 items-center justify-center">
                        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
                    </div>
                ) : providers.length > 0 ? (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-slate-400 font-medium">
                                <span className="text-white font-bold">{providers.length}</span> prestataire{providers.length > 1 ? 's' : ''} trouvé{providers.length > 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {providers.map((provider, index) => (
                                <Link
                                    key={provider.id}
                                    to={`/b/${provider.slug}`}
                                    className={`glass-card p-6 block hover:border-indigo-500/30 transition-all group animate-fade-in-up stagger-${(index % 5) + 1}`}
                                >
                                    <div className="flex items-start gap-4 mb-5">
                                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                                            <span className="text-2xl font-black text-white">{provider.business_name?.charAt(0)}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-bold text-white mb-1 truncate group-hover:text-indigo-400 transition-colors">
                                                {provider.business_name}
                                            </h3>
                                            {provider.city && (
                                                <p className="text-slate-500 text-sm flex items-center gap-1.5">
                                                    <MapPin className="h-4 w-4 shrink-0" /> {provider.city}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {provider.description && (
                                        <p className="text-slate-400 text-sm line-clamp-2 mb-5">
                                            {provider.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Scissors className="h-4 w-4 text-indigo-400" />
                                            <span className="text-sm font-medium">{provider.services?.length || 0} service{(provider.services?.length || 0) > 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-indigo-400 group-hover:gap-2 transition-all">
                                            <span className="text-sm font-semibold">Réserver</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="glass-card border-2 border-dashed border-slate-800 p-16 text-center">
                        <div className="h-20 w-20 rounded-3xl bg-slate-900 flex items-center justify-center mx-auto mb-6">
                            <Building2 className="h-10 w-10 text-slate-700" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Aucun prestataire trouvé</h3>
                        <p className="text-slate-500 font-medium">
                            {searchTerm ? 'Essayez avec d\'autres termes de recherche.' : 'Aucun prestataire n\'est encore inscrit.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProvidersPage;
