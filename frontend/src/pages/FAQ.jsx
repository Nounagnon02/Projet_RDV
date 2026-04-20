import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button } from '../components/ui';
import Accordion from '../components/ui/Accordion';
import { Link } from 'react-router-dom';

const FAQ = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');

    const faqItems = [
        {
            title: t('faq.q1_title', { defaultValue: 'How do I prepare for my braiding appointment?' }),
            content: t('faq.q1_content', { defaultValue: 'For the best results, arrive with freshly washed and detangled hair.' })
        },
        {
            title: t('faq.q2_title', { defaultValue: 'What is your cancellation policy?' }),
            content: t('faq.q2_content', { defaultValue: 'Cancellations must be made in advance according to salon policy.' })
        },
        {
            title: t('faq.q3_title', { defaultValue: 'How long do Elsa Coiffure extensions last?' }),
            content: t('faq.q3_content', { defaultValue: 'With proper care, premium extensions can last several weeks.' })
        },
        {
            title: t('faq.q4_title', { defaultValue: 'Do you offer services for children?' }),
            content: t('faq.q4_content', { defaultValue: 'Yes, we offer selected services for children with adapted care products.' })
        }
    ];

    const filteredItems = faqItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const careTips = [
        {
            icon: "bedtime",
            title: t('faq.tip1_title', { defaultValue: 'Nighttime routine' }),
            description: t('faq.tip1_desc', { defaultValue: 'Wrap your hair in silk or satin to reduce friction overnight.' })
        },
        {
            icon: "water_drop",
            title: t('faq.tip2_title', { defaultValue: 'Daily hydration' }),
            description: t('faq.tip2_desc', { defaultValue: 'Use a light mist to keep scalp and roots hydrated.' })
        },
        {
            icon: "auto_awesome",
            title: t('faq.tip3_title', { defaultValue: 'Braids maintenance' }),
            description: t('faq.tip3_desc', { defaultValue: 'Avoid excessive tension and oil buildup on protective styles.' })
        }
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-maroon-dark/10 py-4 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-3xl">spa</span>
                        <h2 className="text-xl font-display font-black uppercase tracking-tight text-maroon-dark dark:text-text-light">Elsa Coiffure</h2>
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center bg-maroon-dark/5 dark:bg-white/5 rounded-lg px-3 py-1.5 border border-maroon-dark/10 dark:border-white/10">
                            <span className="material-symbols-outlined text-accent-bronze text-xl">search</span>
                            <input
                                type="text"
                                placeholder={t('faq.search', { defaultValue: 'Search FAQ...' })}
                                className="bg-transparent border-none focus:ring-0 text-sm w-48 placeholder:text-accent-bronze"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Link to="/providers">
                            <Button variant="primary" size="sm" className="hidden sm:block">{t('faq.book_now', { defaultValue: 'Book now' })}</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12 border-l-4 border-primary pl-6 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-maroon-dark dark:text-text-light mb-2">
                        {t('faq.title', { defaultValue: 'FAQ & Hair Care Guide' })}
                    </h1>
                    <p className="text-lg text-accent-bronze font-medium">{t('faq.subtitle', { defaultValue: 'Expert advice for your luxury afro hair journey.' })}</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* FAQ Accordions */}
                    <div className="flex-1 space-y-8 animate-fade-in stagger-1">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6">{t('faq.general_info', { defaultValue: 'General information' })}</h3>
                            {filteredItems.length > 0 ? (
                                <Accordion items={filteredItems} />
                            ) : (
                                <p className="text-accent-bronze italic">{t('faq.no_matches', { defaultValue: 'No matches found for your search.' })}</p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6">{t('faq.styling_maintenance', { defaultValue: 'Styling & Maintenance' })}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {careTips.slice(0, 2).map((tip, index) => (
                                    <Card key={index} variant="elevated" className="p-6 border border-maroon-dark/5 dark:border-white/5 hover:border-primary/30 transition-all flex flex-col gap-4">
                                        <span className="material-symbols-outlined text-primary text-3xl">{tip.icon}</span>
                                        <div>
                                            <h4 className="font-bold text-maroon-dark dark:text-text-light mb-2">{tip.title}</h4>
                                            <p className="text-sm text-accent-bronze font-medium leading-relaxed">{tip.description}</p>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Tips */}
                    <aside className="lg:w-80 animate-fade-in stagger-2">
                        <Card variant="default" className="sticky top-28 p-8 border-t-4 border-t-primary shadow-xl">
                            <div className="mb-8">
                                <h2 className="text-xl font-black text-maroon-dark dark:text-text-light mb-1">{t('faq.quick_tips', { defaultValue: 'Quick care tips' })}</h2>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest">{t('faq.gold_standard', { defaultValue: 'Gold-standard maintenance' })}</p>
                            </div>

                            <div className="space-y-6">
                                {careTips.map((tip, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                                            <span className="material-symbols-outlined text-primary">{tip.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-maroon-dark dark:text-text-light">{tip.title}</p>
                                            <p className="text-xs text-accent-bronze mt-1 font-medium">{tip.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 pt-8 border-t border-maroon-dark/10 dark:border-white/10">
                                <Button variant="primary" className="w-full uppercase tracking-widest text-xs h-12">
                                    {t('faq.download_guide', { defaultValue: 'Download full guide' })}
                                </Button>
                            </div>
                        </Card>
                    </aside>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-maroon-dark text-white/60 py-16 mt-20 px-6">
                <div className="max-w-7xl mx-auto border-t border-white/10 pt-12 text-[10px] font-black uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-6">
                    <p>© 2026 Elsa Coiffure. {t('faq.rights', { defaultValue: 'All rights reserved.' })}</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-primary transition-colors">{t('faq.privacy', { defaultValue: 'Privacy Policy' })}</a>
                        <a href="#" className="hover:text-primary transition-colors">{t('faq.terms', { defaultValue: 'Terms of Service' })}</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default FAQ;
