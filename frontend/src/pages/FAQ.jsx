import { useState } from 'react';
import { Card, Button } from '../components/ui';
import Accordion from '../components/ui/Accordion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const FAQ = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const faqItems = [
        {
            title: "How do I prepare for my braiding appointment?",
            content: "For the best results, we recommend arriving with hair that is freshly washed, detangled, and blown out. Avoid heavy oils or butters as they can interfere with the braiding process. Our stylists will apply premium Elsa Coiffure serums during your session to ensure maximum scalp comfort and longevity."
        },
        {
            title: "What is your cancellation policy?",
            content: "We value your time and ours. Cancellations must be made at least 48 hours in advance. Deposits are non-refundable for late cancellations or no-shows. You can reschedule your appointment once through our online portal up to 24 hours before your slot."
        },
        {
            title: "How long do Elsa Coiffure extensions last?",
            content: "Our signature extensions are hand-selected for quality. With proper care using our recommended maintenance routine, our premium extensions can last between 8 to 12 weeks for protective styles, and can often be reused for multiple installations."
        },
        {
            title: "Do you offer services for children?",
            content: "Yes, we offer specialized services for children aged 5 and up. We ensure a gentle experience and use child-friendly products specifically formulated for delicate natural hair."
        }
    ];

    const filteredItems = faqItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const careTips = [
        {
            icon: "bedtime",
            title: "Nighttime Routine",
            description: "Wrap your hair in a silk or satin bonnet to prevent friction and maintain moisture while you sleep."
        },
        {
            icon: "water_drop",
            title: "Daily Hydration",
            description: "Use a light water-based mist to hydrate your scalp and natural hair roots every 2 days."
        },
        {
            icon: "auto_awesome",
            title: "Braids Maintenance",
            description: "Avoid heavy tension and oil buildup to preserve the life of your protective styles."
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
                                placeholder="Search FAQ..."
                                className="bg-transparent border-none focus:ring-0 text-sm w-48 placeholder:text-accent-bronze"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Link to="/booking">
                            <Button variant="primary" size="sm" className="hidden sm:block">Book Now</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12 border-l-4 border-primary pl-6 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-maroon-dark dark:text-text-light mb-2">
                        FAQ & Hair Care Guide
                    </h1>
                    <p className="text-lg text-accent-bronze font-medium">Expert advice for your luxury afro hair journey.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* FAQ Accordions */}
                    <div className="flex-1 space-y-8 animate-fade-in stagger-1">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6">General Information</h3>
                            {filteredItems.length > 0 ? (
                                <Accordion items={filteredItems} />
                            ) : (
                                <p className="text-accent-bronze italic">No matches found for your search.</p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6">Styling & Maintenance</h3>
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
                                <h2 className="text-xl font-black text-maroon-dark dark:text-text-light mb-1">Quick Care Tips</h2>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Gold-standard maintenance</p>
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
                                    Download Full Guide
                                </Button>
                            </div>
                        </Card>
                    </aside>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-maroon-dark text-white/60 py-16 mt-20 px-6">
                <div className="max-w-7xl mx-auto border-t border-white/10 pt-12 text-[10px] font-black uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-6">
                    <p>© 2026 Elsa Coiffure. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default FAQ;
