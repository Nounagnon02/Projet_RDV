import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { Shield, Sparkles, Heart, UserCheck, ArrowRight } from 'lucide-react';

const About = () => {
    const { t } = useTranslation();

    const values = [
        { icon: Shield, title: t('about.value_1_title'), desc: t('about.value_1_desc') },
        { icon: Sparkles, title: t('about.value_2_title'), desc: t('about.value_2_desc') },
        { icon: Heart, title: t('about.value_3_title'), desc: t('about.value_3_desc') },
        { icon: UserCheck, title: t('about.value_4_title'), desc: t('about.value_4_desc') },
    ];

    const galleryImages = [
        { src: '/assets/sections/section1.jpeg', title: t('home.hair_section1') },
        { src: '/assets/sections/section2.jpeg', title: t('home.hair_section2') },
        { src: '/assets/sections/section3.jpeg', title: t('home.hair_section3') },
        { src: '/assets/sections/section4.jpeg', title: t('home.hair_section4') },
        { src: '/assets/sections/section5.jpeg', title: t('home.hair_section5') },
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark overflow-x-hidden">
            <Navbar />

            <main>
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-40">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <div className="w-full lg:w-1/2">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-primary/10 rounded-2xl -rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
                                <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl border border-maroon-dark/5"
                                    style={{
                                        backgroundImage: 'url("/assets/sections/section5.jpeg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/40 to-transparent"></div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 space-y-10 animate-fade-in">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-px w-8 bg-primary"></div>
                                    <span className="text-primary font-black tracking-[0.4em] uppercase text-[10px]">{t('about.heritage')}</span>
                                </div>
                                <h1 className="font-display font-bold italic text-maroon-dark dark:text-text-light leading-[1.1]" style={{ fontSize: 'var(--text-h1)' }}>
                                    {t('about.epic_title')}
                                </h1>
                                <div className="h-1 w-24 bg-primary"></div>
                            </div>
                            <div className="space-y-6 text-accent-bronze leading-relaxed">
                                <p className="text-lg md:text-xl font-display italic">
                                    {t('about.hero_desc1')}
                                </p>
                                <p className="text-base">
                                    {t('about.hero_desc2')}
                                </p>
                            </div>
                            <Link to="/services">
                                <Button variant="primary" size="lg" className="h-14 px-10 shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all">
                                    {t('home.book_now', { defaultValue: 'Réserver maintenant' })} <ArrowRight className="ml-2 size-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Philosophy & Values Section */}
                <section className="bg-maroon-dark/5 dark:bg-white/5 py-24 px-6 md:px-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="text-primary font-black tracking-[0.3em] uppercase text-xs">{t('about.philosophy_title')}</span>
                            <h2 className="text-4xl md:text-5xl font-display font-bold italic text-maroon-dark dark:text-text-light mt-4 mb-6">
                                {t('about.philosophy_subtitle')}
                            </h2>
                            <div className="h-0.5 w-16 bg-primary mx-auto"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, i) => {
                                const Icon = value.icon;
                                return (
                                    <div
                                        key={i}
                                        className="bg-white dark:bg-maroon-dark/50 rounded-2xl p-8 border border-maroon-dark/5 hover:border-primary/20 hover:shadow-xl transition-all duration-500 group"
                                    >
                                        <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                            <Icon className="size-7 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-display font-bold italic text-maroon-dark dark:text-text-light mb-3">
                                            {value.title}
                                        </h3>
                                        <p className="text-accent-bronze text-sm leading-relaxed">
                                            {value.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Our Atelier Section */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 py-24">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="h-px w-8 bg-primary"></div>
                                <span className="text-primary font-black tracking-[0.4em] uppercase text-[10px]">{t('about.team_title')}</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold italic text-maroon-dark dark:text-text-light leading-tight">
                                {t('about.team_title')}
                            </h2>
                            <p className="text-accent-bronze text-lg leading-relaxed">
                                {t('about.team_desc')}
                            </p>
                            <p className="text-maroon-dark/60 dark:text-text-light/60 text-base leading-relaxed">
                                {t('about.hero_desc1')}
                            </p>
                            <Link to="/providers">
                                <Button variant="outline" size="lg" className="h-14 px-10 border-primary/20 text-primary hover:bg-primary/5">
                                    {t('navbar.concierge')} <ArrowRight className="ml-2 size-4" />
                                </Button>
                            </Link>
                        </div>
                        <div className="lg:w-1/2">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-primary/10 rounded-2xl rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
                                <div
                                    className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl border border-maroon-dark/5 bg-cover bg-center"
                                    style={{
                                        backgroundImage: 'url("/assets/sections/section1.jpeg")',
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/50 to-transparent"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Gallery Section */}
                <section className="bg-maroon-dark/5 dark:bg-white/5 py-24 px-6 md:px-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="text-primary font-black tracking-[0.3em] uppercase text-xs">{t('about.gallery_title')}</span>
                            <h2 className="text-4xl md:text-5xl font-display font-bold italic text-maroon-dark dark:text-text-light mt-4 mb-6">
                                {t('about.gallery_title')}
                            </h2>
                            <p className="text-accent-bronze text-lg max-w-2xl mx-auto">
                                {t('about.gallery_desc')}
                            </p>
                            <div className="h-0.5 w-16 bg-primary mx-auto mt-6"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                            {galleryImages.map((img, i) => (
                                <div key={i} className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                                    <div
                                        className="size-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                                        style={{ backgroundImage: `url("${img.src}")` }}
                                    ></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/80 to-transparent opacity-60"></div>
                                    <div className="absolute inset-x-4 bottom-4">
                                        <h3 className="text-white text-lg font-display font-bold italic">{img.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-5xl mx-auto px-6 md:px-12 py-24">
                    <div className="relative overflow-hidden rounded-3xl p-12 md:p-20 text-center border border-primary/20 bg-primary/5">
                        <div className="absolute top-0 right-0 opacity-10 blur-3xl w-64 h-64 bg-primary rounded-full"></div>
                        <div className="absolute bottom-0 left-0 opacity-10 blur-3xl w-64 h-64 bg-primary rounded-full"></div>
                        <div className="relative z-10 space-y-8">
                            <h3 className="text-3xl md:text-5xl font-display font-bold italic text-maroon-dark dark:text-text-light">
                                {t('about.cta_title')}
                            </h3>
                            <p className="text-lg text-accent-bronze max-w-xl mx-auto">
                                {t('about.cta_desc')}
                            </p>
                            <Link to="/services">
                                <Button variant="primary" size="lg" className="h-16 px-12 shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all">
                                    {t('about.book_now')} <ArrowRight className="ml-2 size-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default About;
