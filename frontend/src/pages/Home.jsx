import { Link } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import {
    ChevronRight,
    Calendar,
    Mail,
    Phone,
    MapPin,
    ArrowRight
} from 'lucide-react';

const Home = () => {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-maroon-dark dark:text-background-light selection:bg-primary/30 font-display overflow-x-hidden">
            <Navbar />

            {/* Hero Section: The Elsa Story */}
            <section className="px-6 py-24 md:py-40 flex justify-center">
                <div className="max-w-[1440px] w-full">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        {/* Image side */}
                        <div className="w-full lg:w-1/2 relative">
                            <div className="absolute -inset-4 bg-primary/10 rounded-3xl -rotate-3 animate-pulse-slow"></div>
                            <div
                                className="relative bg-center bg-no-repeat aspect-[4/5] bg-cover rounded-2xl shadow-2xl overflow-hidden group border border-maroon-dark/5"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAWmoVra7bkDKsHymicwEJXHTWvfO1QGzF6vxWjoPIg4w9u1rDz47SRSyGCElxwdkzEvurDyMC4HZ3li7dpv30vNRwK5IdervPPK-mXoxft9LFCxYedJbxjCk77CTeIcR1EBcl0kG7F45trrWCv3cwMr4SjBLY3S5l2IiiquZlYnYvHvuqCyh1HdJCjZtl3JyvWjEIqnpGppZiI210Z6GM-q21MUQnGA2Abzy8Abzy8AswnPVEimeYOlUiHJvbh_m_91OTuy-Nm6CqgvdhU")' }}
                            >
                                <div className="absolute inset-0 bg-maroon-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            </div>
                        </div>

                        {/* Content side */}
                        <div className="flex flex-col gap-10 lg:w-1/2 animate-fade-in">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-px w-8 bg-primary"></div>
                                    <span className="text-primary font-black tracking-[0.4em] uppercase text-[10px]">{t('home.heritage')}</span>
                                </div>
                                <h1 className="text-maroon-dark dark:text-text-light font-display italic leading-[1.05]" style={{ fontSize: 'var(--text-h1)' }}>
                                    {t('home.epic_title')}
                                </h1>
                                <p className="text-maroon-dark/80 dark:text-background-light/80 text-xl md:text-2xl font-normal leading-relaxed italic max-w-xl">
                                    {t('home.hero_subtitle')}
                                </p>
                                <p className="text-maroon-dark/60 dark:text-background-light/70 text-base md:text-lg leading-relaxed font-sans max-w-2xl">
                                    {t('home.hero_description')}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <Link to="/services" className="w-full sm:w-auto">
                                    <Button variant="primary" size="lg" className="h-16 px-10 w-full shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all">
                                        <Calendar className="mr-2 size-5" />
                                        {t('home.book_now', { defaultValue: 'Réserver maintenant' })}
                                    </Button>
                                </Link>
                                <Link to="/about" className="w-full sm:w-auto">
                                    <Button variant="outline" size="lg" className="h-16 px-10 w-full border-primary/20 text-primary hover:bg-primary/5">
                                        {t('home.philosophy')}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hair & Locks Section */}
            <section className="bg-maroon-dark/5 py-24">
                <div className="xl:px-40 lg:px-20 px-4 flex justify-center mb-16">
                    <div className="max-w-[1200px] flex-1 text-center">
                        <h2 className="text-maroon-dark dark:text-background-light text-4xl md:text-6xl font-display font-medium italic mb-6">{t('home.hair_title')}</h2>
                        <div className="w-16 h-1 bg-primary mx-auto mb-8"></div>
                        <p className="text-maroon-dark/70 dark:text-background-light/70 text-xl max-w-2xl mx-auto italic">
                            {t('home.hair_subtitle')}
                        </p>
                    </div>
                </div>

                <div className="xl:px-40 lg:px-20 px-4 flex justify-center">
                    <div className="max-w-[1200px] flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                            {[
                                { title: t('home.hair_section1'), img: '/assets/sections/section1.jpeg' },
                                { title: t('home.hair_section2'), img: '/assets/sections/section2.jpeg' },
                                { title: t('home.hair_section3'), img: '/assets/sections/section3.jpeg' },
                                { title: t('home.hair_section4'), img: '/assets/sections/section4.jpeg' },
                                { title: t('home.hair_section5'), img: '/assets/sections/section5.jpeg' }
                            ].map((card, i) => (
                                <div key={i} className="relative group h-[500px] overflow-hidden rounded-2xl shadow-2xl">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                                        style={{ backgroundImage: `url("${card.img}")` }}
                                    ></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/80 to-transparent opacity-60"></div>
                                    <div className="absolute inset-x-4 bottom-4 glass-card p-8 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-500 group-hover:bottom-6">
                                        <h3 className="text-white text-2xl font-display font-bold italic">{card.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Découvrir Button */}
                        <div className="text-center mt-12">
                            <Link to="/services">
                                <Button variant="primary" size="lg" className="h-16 px-12 font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all">
                                    {t('home.discover_services', { defaultValue: 'DÉCOUVRIR NOS SERVICES' })} <ArrowRight className="ml-2 size-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Boutique Callout */}
            <section className="py-32 xl:px-40 lg:px-20 px-4 flex justify-center">
                <div className="max-w-[1200px] flex-1">
                    <div className="bg-primary/5 rounded-3xl p-16 flex flex-col lg:flex-row items-center gap-16 border border-primary/20 relative overflow-hidden">
                        <div className="flex-1 space-y-8 relative z-10">
                            <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">{t('home.boutique_coming_soon')}</span>
                            <h2 className="text-4xl md:text-5xl font-display italic text-maroon-dark leading-tight">{t('home.curated_title')}</h2>
                            <p className="text-accent-bronze text-lg max-w-md italic">{t('home.curated_desc')}</p>
                        </div>
                        <div className="lg:w-1/3 opacity-60 grayscale">
                            <img
                                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600"
                                className="rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
                                alt="Product"
                            />
                        </div>
                    </div>
                </div>
            </section>


            <Footer />
        </div>
    );
};

export default Home;
