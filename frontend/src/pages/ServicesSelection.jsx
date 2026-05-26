import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, ArrowRight, Check } from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button, Card } from '../components/ui';

const ServicesSelection = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('/services');
                setServices(response.data);
            } catch (error) {
                console.error('Error loading services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const handleServiceSelect = (service) => {
        setSelectedService(service);
    };

    const handleContinue = () => {
        if (selectedService && selectedService.provider) {
            navigate(`/b/${selectedService.provider.slug}?service=${selectedService.id}`);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <Navbar />

            <div className="px-6 py-24 md:py-32">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16 animate-fade-in">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="h-px w-12 bg-primary"></div>
                            <span className="text-primary font-black tracking-[0.4em] uppercase text-[10px]">
                                {t('services.step_1', { defaultValue: '\u00c9tape 1' })}
                            </span>
                            <div className="h-px w-12 bg-primary"></div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-display font-black italic text-maroon-dark dark:text-text-light mb-6">
                            {t('services.choose_service', { defaultValue: 'Choisissez votre service' })}
                        </h1>
                        <p className="text-xl text-accent-bronze italic max-w-2xl mx-auto">
                            {t('services.subtitle', { defaultValue: 'S\u00e9lectionnez le service qui vous convient pour continuer votre r\u00e9servation' })}
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                            <p className="mt-4 text-accent-bronze">{t('common.loading', { defaultValue: 'Chargement...' })}</p>
                        </div>
                    ) : (
                        <>
                            {/* Services Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                {services.map((service) => (
                                    <Card
                                        key={service.id}
                                        className={`p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden ${
                                            selectedService?.id === service.id
                                                ? 'ring-4 ring-primary shadow-2xl shadow-primary/20'
                                                : 'hover:ring-2 hover:ring-primary/30'
                                        }`}
                                        onClick={() => handleServiceSelect(service)}
                                    >
                                        {/* Selection Indicator */}
                                        {selectedService?.id === service.id && (
                                            <div className="absolute top-4 right-4 bg-primary text-white rounded-full p-2 shadow-lg animate-scale-in">
                                                <Check className="size-5" />
                                            </div>
                                        )}

                                        {/* Service Content */}
                                        <div className="space-y-4">
                                            <div className="flex items-start justify-between">
                                                <h3 className="text-2xl font-display font-bold italic text-maroon-dark dark:text-text-light pr-12">
                                                    {service.name}
                                                </h3>
                                            </div>

                                            <p className="text-accent-bronze text-sm leading-relaxed">
                                                {service.description}
                                            </p>

                                            <div className="flex items-center gap-2 text-sm text-maroon-dark/60 dark:text-text-light/60">
                                                <Clock className="size-4" />
                                                <span>{service.duration} min</span>
                                            </div>

                                            <div className="pt-4 border-t border-maroon-dark/10">
                                                <div className="flex items-baseline justify-between">
                                                    <span className="text-3xl font-display font-black italic text-primary">
                                                        {service.price.toLocaleString()} FCFA
                                                    </span>
                                                </div>
                                            </div>

                                            {service.provider && (
                                                <div className="pt-4 border-t border-maroon-dark/10">
                                                    <p className="text-xs text-accent-bronze uppercase tracking-wider">
                                                        {t('services.by', { defaultValue: 'Par' })} {service.provider.business_name}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Continue Button */}
                            {selectedService && (
                                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-maroon-dark border-t border-maroon-dark/10 p-6 shadow-2xl animate-slide-up z-50">
                                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="text-center sm:text-left">
                                            <p className="text-sm text-accent-bronze mb-1">
                                                {t('services.selected', { defaultValue: 'Service s\u00e9lectionn\u00e9' })}
                                            </p>
                                            <p className="text-xl font-display font-bold italic text-maroon-dark dark:text-text-light">
                                                {selectedService.name}
                                            </p>
                                            <p className="text-2xl font-black text-primary mt-1">
                                                {selectedService.price.toLocaleString()} FCFA
                                            </p>
                                        </div>
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            onClick={handleContinue}
                                            className="h-16 px-12 shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all w-full sm:w-auto"
                                        >
                                            {t('services.continue', { defaultValue: 'Continuer' })}
                                            <ArrowRight className="ml-2 size-5" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ServicesSelection;
