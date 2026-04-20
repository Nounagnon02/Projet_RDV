import { Card, Button, ProtectedIcon } from '../components/ui';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();
    
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark overflow-x-hidden">
            <Navbar />

            <main>
                {/* Hero Section: The Elsa Story */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-40">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <div className="w-full lg:w-1/2">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-primary/10 rounded-2xl -rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
                                <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl border border-maroon-dark/5">
                                    <img
                                        src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800"
                                        alt="Elsa, Founder of Elsa Coiffure"
                                        className="size-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 space-y-10 animate-fade-in">
                            <div className="space-y-6">
                                <span className="text-primary font-black tracking-[0.4em] uppercase text-[10px]">{t('about.heritage')}</span>
                                <h1 className="font-display font-medium italic text-maroon-dark dark:text-text-light leading-[1.1]" style={{ fontSize: 'var(--text-h1)' }}>
                                    {t('about.epic_title')}
                                </h1>
                                <div className="h-1 w-24 bg-primary"></div>
                            </div>
                            <div className="space-y-6 text-accent-bronze font-medium leading-relaxed">
                                <p className="text-xl font-display italic">
                                    {t('about.founded_text')}
                                </p>
                                <p className="text-base">
                                    {t('about.masterpiece_text')}
                                </p>
                            </div>
                            <Button variant="outline" size="lg" className="px-10 h-14">
                                {t('about.philosophy_btn')}
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Wedding Services Header */}
                <section className="bg-maroon-dark/5 dark:bg-white/5 py-24 px-6 md:px-12 text-center">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <span className="text-primary font-black tracking-[0.3em] uppercase text-xs">{t('about.exquisite_artistry')}</span>
                        <h2 className="text-4xl md:text-6xl font-display font-medium italic text-maroon-dark dark:text-text-light">
                            {t('about.bridal_collections')}
                        </h2>
                        <div className="h-0.5 w-16 bg-primary mx-auto"></div>
                        <p className="text-lg text-accent-bronze font-medium max-w-2xl mx-auto font-display">
                            {t('about.bridal_desc')}
                        </p>
                    </div>
                </section>

                {/* Bridal Gallery */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 py-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: t('about.traditional_bridal'), desc: t('about.traditional_desc'), img: 'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&q=80&w=400' },
                            { title: t('about.modern_updos'), desc: t('about.modern_desc'), img: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=400' },
                            { title: t('about.veil_artistry'), desc: t('about.veil_desc'), img: 'https://images.unsplash.com/photo-1543807218-09ae4948a865?auto=format&fit=crop&q=80&w=400' },
                            { title: t('about.natural_crown'), desc: t('about.natural_desc'), img: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&q=80&w=400' }
                        ].map((card, i) => (
                            <div key={i} className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                                <img src={card.img} alt={card.title} className="size-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                <div className="absolute inset-x-4 bottom-4 glass-card p-6 rounded-xl border border-white/20 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-white text-xl font-display font-bold mb-1">{card.title}</h3>
                                    <p className="text-white/80 text-xs font-medium leading-relaxed">{card.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Inquiry CTA */}
                <section className="max-w-5xl mx-auto px-6 md:px-12 pb-32">
                    <Card variant="default" className="relative overflow-hidden p-12 md:p-20 text-center border border-primary/20 bg-primary/5">
                        <div className="absolute top-0 right-0 opacity-10 blur-3xl w-64 h-64 bg-primary rounded-full"></div>
                        <div className="relative z-10 space-y-8">
                            <h3 className="text-3xl md:text-5xl font-display font-medium italic text-maroon-dark dark:text-text-light">
                                {t('about.begin_journey')}
                            </h3>
                            <p className="text-lg text-accent-bronze font-medium max-w-xl mx-auto">
                                {t('about.unique_bride')}
                            </p>
                            <Button variant="primary" size="lg" className="h-16 px-12 text-lg shadow-xl shadow-primary/20" rightIcon={<ProtectedIcon translate="no" data-i18n="false"><span className="material-symbols-outlined">calendar_month</span></ProtectedIcon>}>
                                {t('about.bridal_inquiry')}
                            </Button>
                        </div>
                    </Card>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default About;
