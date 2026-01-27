import { Link } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import {
    ChevronRight,
    Calendar,
    Mail,
    Phone,
    MapPin,
    ArrowRight
} from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-maroon-dark dark:text-background-light selection:bg-primary/30 font-display">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-maroon-dark/10 px-6 py-4 xl:px-40 lg:px-20">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-4 text-maroon-dark dark:text-background-light group">
                        <div className="size-6 text-primary group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl">spa</span>
                        </div>
                        <h2 className="text-xl font-bold leading-tight tracking-tight uppercase">Elsa Coiffure</h2>
                    </Link>

                    <div className="flex flex-1 justify-end gap-10 items-center">
                        <nav className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-primary-maroon-dark text-sm font-bold border-b-2 border-primary">Home</Link>
                            <Link to="/providers" className="text-maroon-dark dark:text-background-light text-sm font-medium hover:text-primary transition-colors">Services</Link>
                            <Link to="/about" className="text-maroon-dark dark:text-background-light text-sm font-medium hover:text-primary transition-colors">About Us</Link>
                            <Link to="/client/shop" className="text-maroon-dark dark:text-background-light text-sm font-medium hover:text-primary transition-colors">Boutique</Link>
                            <Link to="/contact" className="text-maroon-dark dark:text-background-light text-sm font-medium hover:text-primary transition-colors">Contact</Link>
                        </nav>
                        <Link to="/providers">
                            <Button variant="primary" size="md" className="min-w-[120px] font-bold tracking-wide">
                                Book Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section: The Elsa Story */}
            <section className="xl:px-40 lg:px-20 px-4 py-12 md:py-24 flex justify-center overflow-hidden">
                <div className="max-w-[1200px] flex-1">
                    <div className="flex flex-col gap-12 lg:flex-row items-center">
                        {/* Image side with rotated background */}
                        <div className="w-full lg:w-1/2">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-primary/10 rounded-xl -rotate-2 group-hover:rotate-0 transition-transform duration-700"></div>
                                <div
                                    className="relative bg-center bg-no-repeat aspect-[4/5] bg-cover rounded-lg shadow-2xl"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAWmoVra7bkDKsHymicwEJXHTWvfO1QGzF6vxWjoPIg4w9u1rDz47SRSyGCElxwdkzEvurDyMC4HZ3li7dpv30vNRwK5IdervPPK-mXoxft9LFCxYedJbxjCk77CTeIcR1EBcl0kG7F45trrWCv3cwMr4SjBLY3S5l2IiiquZlYnYvHvuqCyh1HdJCjZtl3JyvWjEIqnpGppZiI210Z6GM-q21MUQnGA2Abzy8AswnPVEimeYOlUiHJvbh_m_91OTuy-Nm6CqgvdhU")' }}
                                ></div>
                            </div>
                        </div>

                        {/* Content side */}
                        <div className="flex flex-col gap-8 lg:w-1/2 px-4 lg:px-10 animate-fade-in-right">
                            <div className="flex flex-col gap-6">
                                <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">Our Heritage</span>
                                <h1 className="text-maroon-dark dark:text-background-light text-5xl md:text-7xl font-display font-medium leading-[1.1] italic">
                                    The Elsa Story
                                </h1>
                                <div className="h-1 w-20 bg-primary"></div>
                                <p className="text-maroon-dark/80 dark:text-background-light/80 text-lg md:text-2xl font-normal leading-relaxed italic">
                                    Founded on the belief that natural texture is the ultimate luxury, Elsa Coiffure has redefined Afro hair artistry for over a decade.
                                </p>
                                <p className="text-maroon-dark/70 dark:text-background-light/70 text-base md:text-lg leading-relaxed font-sans">
                                    Every crown we style is a masterpiece. From intricate traditional techniques to modern avant-garde silhouettes, we blend technical excellence with a deep understanding of natural hair health. We don't just style hair; we celebrate a legacy of elegance.
                                </p>
                            </div>
                            <div className="flex gap-6">
                                <Link to="/providers">
                                    <Button variant="primary" size="lg" className="h-16 px-10 shadow-xl hover:translate-y-[-2px] transition-transform">
                                        <span>EXPLORE SERVICES</span>
                                    </Button>
                                </Link>
                                <Link to="/about">
                                    <Button variant="outline" size="lg" className="h-16 px-10 border-primary text-primary hover:bg-primary/5">
                                        <span>OUR PHILOSOPHY</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bridal & Wedding Section (Visual Bridge) */}
            <section className="bg-maroon-dark/5 py-24">
                <div className="xl:px-40 lg:px-20 px-4 flex justify-center mb-16">
                    <div className="max-w-[1200px] flex-1 text-center">
                        <h2 className="text-maroon-dark dark:text-background-light text-4xl md:text-6xl font-display font-medium italic mb-6">Bridal Excellence</h2>
                        <div className="w-16 h-1 bg-primary mx-auto mb-8"></div>
                        <p className="text-maroon-dark/70 dark:text-background-light/70 text-xl max-w-2xl mx-auto italic">
                            Exquisite bridal styling for the modern woman. Discover our curated wedding packages designed to make your natural crown shine.
                        </p>
                    </div>
                </div>

                <div className="xl:px-40 lg:px-20 px-4 flex justify-center">
                    <div className="max-w-[1200px] flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { title: 'Traditional Bridal', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXgOLZehYFyfQa0UzpnPANqtP2oSrhXuYaJoLooAOqmmODTZNgK9qgvVgdiVzqTDUpCxcIsmU7A1LujIzq3aUuQcE9IsDT7s1vD2U8gAMLJd4mrXKs01LFa94yK3-13NzPKRbAC82bCnfieM1WgafHdoVJhbzBoUdle7w7ImaetJ8vb493eKBf4TR1bkwQm9aP4Ix_Buc35SxagMI5Lb9KNpXpP2496GyCAb4TApuca4WjiOH9UwYV6qbxr_avf8XIueg1a8J81X0' },
                                { title: 'Modern Artistry', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg3lHKgDBggLtTDs0E4r7Sar90AlXXrLPQ5L83xhpeJMLU60029tOS78dhFXPiiV1hIcEQmxFpiy8NbIMs8183WhWaFyexRslo-7WLg6PP5KooJntqJ54WiPn7jMgEMNV8FEcLPn3MVvsoQrEs9KfqXD_pChIg4B4IC2vtWfGqlhLXVIPkE4fdpitRKbDNGoo7FXyVrycNvEZt2MaBbKADczbfHHU2_mF0gk99x60x7mbjkebGaRrKlMC5S2x9mZufcIJtyg3Dk-w' },
                                { title: 'Natural Crown', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJIBdVIk7hoN910OYLj2V1HkmrHDqo1rzt-FhGph1_o5fsw4xnGFxXAfx5DQiqokoQ5kHoK7zFdp_d2sREAtdkOpT06Y8s4peEQfe0_8Yy7PBBAdt4zIYLvwfNxn_q2tCgI08MbR3evZ29npYUgw8cFEug1QelFGWjvBN25_awCbLhMa0tQcy8GXiFWx7tmVdF45QFrWfbWu-Luhscr_eUgZRPWAmCdvYE2uaxjuzMxg_YH-u7MFaro0H8uA5O87LQFTDqeMfAAks' }
                            ].map((card, i) => (
                                <div key={i} className="relative group h-[500px] overflow-hidden rounded-2xl shadow-2xl">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                                        style={{ backgroundImage: `url("${card.img}")` }}
                                    ></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/80 to-transparent opacity-60"></div>
                                    <div className="absolute inset-x-4 bottom-4 glass-card p-8 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-500 group-hover:bottom-6">
                                        <h3 className="text-white text-2xl font-display font-bold italic mb-2">{card.title}</h3>
                                        <p className="text-white/80 text-sm font-sans">Crafting sculptural silhouettes that bring a contemporary edge to bridal elegance.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Boutique Callout */}
            <section className="py-32 xl:px-40 lg:px-20 px-4 flex justify-center">
                <div className="max-w-[1200px] flex-1">
                    <div className="bg-primary/5 rounded-3xl p-16 flex flex-col lg:flex-row items-center gap-16 border border-primary/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <span className="material-symbols-outlined text-9xl">shopping_bag</span>
                        </div>
                        <div className="flex-1 space-y-8 relative z-10">
                            <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">Elite Care</span>
                            <h2 className="text-4xl md:text-5xl font-display italic text-maroon-dark leading-tight">Expertly curated by the <span className="text-primary">Elsa Coiffure</span> team daily.</h2>
                            <p className="text-accent-bronze text-lg max-w-md italic">Every product in our boutique is tested and used in our salon. We stand by the efficacy of every ingredient.</p>
                            <Link to="/client/shop">
                                <Button variant="primary" size="lg" className="h-16 px-12 shadow-2xl shadow-primary/20">
                                    SHOP ALL COLLECTIONS <ArrowRight className="ml-2 size-4" />
                                </Button>
                            </Link>
                        </div>
                        <div className="lg:w-1/3">
                            <img
                                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600"
                                className="rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
                                alt="Product"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-maroon-dark text-background-light py-24 xl:px-40 lg:px-20 px-4 border-t border-white/5">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-4 mb-8 text-primary">
                            <span className="material-symbols-outlined text-4xl">spa</span>
                            <h2 className="text-3xl font-bold tracking-tight uppercase font-display italic text-white leading-none">Elsa</h2>
                        </div>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-sm italic">
                            Elevating the standard of Afro hair care through luxury experience and artistic excellence for over a decade.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-black uppercase text-[10px] tracking-[0.4em] mb-10 opacity-40">Navigation</h4>
                        <ul className="space-y-6 text-[10px] font-black tracking-[0.2em] uppercase text-slate-200">
                            <li><Link className="hover:text-primary transition-colors" to="/about">Our Story</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/providers">Services</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/client/shop">Boutique</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/contact">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-black uppercase text-[10px] tracking-[0.4em] mb-10 opacity-40">Concierge</h4>
                        <ul className="space-y-6 text-[10px] font-black tracking-[0.2em] uppercase text-slate-300">
                            <li className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-primary text-base">mail</span>
                                concierge@elsacoiffure.com
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-primary text-base">call</span>
                                +33 1 23 45 67 89
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-primary text-base">location_on</span>
                                75 Av. des Champs-Élysées, Paris
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-[1200px] mx-auto border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 font-sans">
                    <p>© 2026 ELSA COIFFURE PARIS. ALL RIGHTS RESERVED.</p>
                    <div className="flex gap-10">
                        <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
                        <a className="hover:text-white transition-colors" href="#">Booking Policy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
