import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { Card, Button, Input } from '../components/ui';
import {
    Search,
    Loader2,
    MapPin,
    Scissors,
    ArrowRight,
    Building2,
    Clock
} from 'lucide-react';

const ProvidersPage = () => {
    const { t } = useTranslation();
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
    };

    const serviceItems = providers.flatMap((provider) =>
        (provider.services || []).map((service) => ({
            id: `${provider.id}-${service.id}`,
            providerSlug: provider.slug,
            providerName: provider.business_name,
            providerCity: provider.city,
            serviceName: service.name,
            serviceDescription: service.description,
            duration: service.duration,
            price: service.price,
        }))
    );

    const visibleServices = serviceItems.filter((item) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        return (
            item.serviceName?.toLowerCase().includes(term) ||
            item.providerName?.toLowerCase().includes(term)
        );
    });

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display overflow-x-hidden">
            <Navbar />

            {/* Elite Hero */}
            <div className="relative py-24 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-maroon-dark/5 -skew-x-12 translate-x-1/2"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] block mb-6">{t('providers.badge', { defaultValue: "L'expertise a votre service" })}</span>
                    <h1 className="font-display italic text-maroon-dark dark:text-text-light leading-[1.1] mb-8" style={{ fontSize: 'var(--text-h1)' }}>
                        {t('providers.services_title_prefix', { defaultValue: 'Découvrez nos' })} <span className="text-primary italic">{t('providers.services_title_highlight', { defaultValue: 'services' })}</span>.
                    </h1>
                    <p className="text-accent-bronze text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                        {t('providers.services_subtitle', { defaultValue: 'Choisissez directement la prestation qui vous convient, puis réservez en un clic.' })}
                    </p>

                    {/* Sophisticated Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-xl mx-auto">
                        <div className="flex gap-3">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-accent-bronze group-focus-within:text-primary transition-colors" />
                                <Input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={t('providers.search_service_placeholder', { defaultValue: 'Rechercher un service ou un prestataire...' })}
                                    className="h-16 pl-14 bg-white dark:bg-white/5 border-maroon-dark/10 focus:border-primary shadow-2xl shadow-maroon-dark/5"
                                />
                            </div>
                            <Button type="submit" variant="primary" className="h-16 px-10 font-black uppercase tracking-widest text-xs hidden sm:flex">
                                {t('providers.search_cta', { defaultValue: 'Trouver' })}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Artsy List Section */}
            <div className="max-w-7xl mx-auto px-6 pb-32">
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="size-12 animate-spin text-primary" />
                    </div>
                ) : visibleServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {visibleServices.map((item, index) => (
                            <Link
                                key={item.id}
                                to={`/b/${item.providerSlug}`}
                                className="group block"
                            >
                                <Card variant="elevated" hover className="p-0 overflow-hidden border-none bg-white dark:bg-white/5 shadow-xl shadow-maroon-dark/5 group-hover:shadow-primary/10 transition-all duration-700">
                                    <div className="relative h-64 overflow-hidden">
                                        <div className="absolute inset-0 bg-maroon-dark/10 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                                        <img
                                            src={`https://images.unsplash.com/photo-${1600000000000 + index}?auto=format&fit=crop&q=80&w=800`}
                                            className="size-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                                            alt={item.serviceName}
                                        />
                                        <div className="absolute bottom-6 left-6 z-20">
                                            <div className="bg-primary text-white px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">
                                                {t('providers.premium_badge', { defaultValue: 'Membre premium' })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-2xl font-display font-medium italic text-maroon-dark dark:text-text-light group-hover:text-primary transition-colors">
                                                {item.serviceName}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-2 text-accent-bronze text-sm mb-6 font-medium">
                                            <MapPin className="size-4 text-primary" />
                                            {item.providerCity || t('providers.default_city', { defaultValue: 'Paris, France' })}
                                        </div>

                                        <p className="text-accent-bronze/70 text-sm line-clamp-2 mb-8 italic">
                                            {item.serviceDescription || t('providers.default_description', { defaultValue: "Specialiste de la haute coiffure africaine et des soins capillaires d'exception." })}
                                        </p>

                                        <div className="flex items-center justify-between pt-6 border-t border-maroon-dark/5 dark:border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-maroon-dark/5 dark:bg-white/5 flex items-center justify-center text-primary">
                                                    <Clock className="size-4" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-maroon-dark dark:text-text-light">
                                                    {item.duration ? `${item.duration} min` : t('providers.service', { defaultValue: 'Service' })}
                                                </span>
                                            </div>
                                            <div className="text-primary font-black text-sm">
                                                {item.price ? `${Math.round(item.price).toLocaleString('fr-FR')} FCFA` : ''}
                                            </div>
                                        </div>
                                        <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-accent-bronze">
                                            {item.providerName}
                                        </div>
                                        <div className="flex items-center justify-end pt-3">
                                            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all">
                                                {t('providers.book', { defaultValue: 'Reserver' })} <ArrowRight className="size-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <Card variant="light" className="p-24 text-center border-dashed border-2 bg-accent-cream/20">
                        <Building2 className="size-16 mx-auto text-accent-cream mb-6 opacity-20" />
                        <h3 className="text-2xl font-display italic text-maroon-dark mb-4">{t('providers.empty_title', { defaultValue: "L'atelier est momentanement ferme" })}</h3>
                        <p className="text-accent-bronze max-w-sm mx-auto">
                            {t('providers.empty_desc', { defaultValue: "Aucun prestataire n'est disponible pour le moment. Veuillez revenir tres prochainement." })}
                        </p>
                    </Card>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ProvidersPage;
