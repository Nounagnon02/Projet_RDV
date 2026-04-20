/**
 * Gallery.jsx - Portfolio des transformations capillaires
 * 
 * Page client pour voir le portfolio des services du salon
 * Affiche les avant/après et inspirations
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { Button } from '../components/ui';
import { Loader2, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Gallery = () => {
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState('all');
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGalleryItems = async () => {
            try {
                setLoading(true);
                const response = await api.get('/providers');
                const providers = response.data || [];

                const flattenedServices = providers.flatMap((provider) =>
                    (provider.services || []).map((service) => ({
                        id: `${provider.id}-${service.id}`,
                        category: service.category || 'signature',
                        title: service.name,
                        description: service.description || '',
                        image: service.image || null,
                        providerSlug: provider.slug,
                        providerName: provider.business_name,
                    }))
                );

                setGalleryItems(flattenedServices);
            } catch (error) {
                console.error('Error loading gallery data', error);
                setGalleryItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchGalleryItems();
    }, []);

    const categories = [
        { id: 'all', name: t('gallery.all_styles', { defaultValue: 'Tous les styles' }) },
        ...Array.from(new Set(galleryItems.map((item) => item.category))).map((category) => ({
            id: category,
            name: category,
        })),
    ];

    const filteredItems = activeCategory === 'all' 
        ? galleryItems 
        : galleryItems.filter(item => item.category === activeCategory);

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        return `http://localhost:8000/storage/${path.replace(/^\/+/, '')}`;
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-maroon-dark dark:text-text-light overflow-x-hidden">
            <Navbar />
            <div>
                {/* Hero Section */}
                <div className="relative overflow-hidden pt-28 pb-10 lg:py-10 px-4 lg:px-8">
                    <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    </div>

                    <div className="max-w-6xl mx-auto relative text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Sparkles className="size-5 text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">
                                {t('gallery.portfolio', { defaultValue: 'Notre portfolio' })}
                            </span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-display font-black text-maroon-dark dark:text-text-light italic leading-tight mb-6">
                            {t('gallery.title', { defaultValue: 'Galerie des transformations' })}
                        </h1>
                        <p className="text-lg text-accent-bronze font-medium italic max-w-3xl mx-auto">
                            {t('gallery.subtitle', { defaultValue: 'Decouvrez les styles realises et reservez facilement votre prestation preferee.' })}
                        </p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 pb-12">
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="size-10 animate-spin text-primary opacity-60" />
                        </div>
                    )}

                    {/* Filter Buttons */}
                    {!loading && <div className="flex flex-wrap gap-3 justify-center mb-16">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-6 py-3 rounded-full font-bold transition-all ${
                                    activeCategory === cat.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-maroon-dark/5 text-maroon-dark dark:bg-white/5 dark:text-text-light hover:bg-primary/20'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>}

                    {/* Gallery Grid */}
                    {!loading && <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredItems.map((item) => (
                            <div 
                                key={item.id}
                                className="bg-white dark:bg-white/5 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow border border-maroon-dark/5"
                            >
                                {/* Service image */}
                                <div className="relative h-80 bg-maroon-dark/10 overflow-hidden group">
                                    {getImageUrl(item.image) ? (
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Sparkles className="size-14 text-primary/30" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                        <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Sparkles className="size-12 text-white mx-auto mb-2" />
                                            <p className="text-white font-bold">{t('gallery.see_style', { defaultValue: 'Voir le style' })}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-2xl font-display font-bold text-maroon-dark dark:text-text-light italic mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-accent-bronze text-sm mb-6">
                                        {item.description || t('gallery.default_desc', { defaultValue: 'Style signature realisable sur reservation.' })}
                                    </p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">
                                        {item.providerName}
                                    </p>
                                    <Link to={`/b/${item.providerSlug}`}>
                                        <Button variant="primary" className="w-full rounded-full">
                                            {t('gallery.book_this_style', { defaultValue: 'Reserver ce style' })}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>}

                    {!loading && filteredItems.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-accent-bronze text-lg">{t('gallery.no_styles', { defaultValue: 'Aucun style trouve pour cette categorie.' })}</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Gallery;
