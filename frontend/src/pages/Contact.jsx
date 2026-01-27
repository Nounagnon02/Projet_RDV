import { Card, Button, Input } from '../components/ui';
import { Link } from 'react-router-dom';

const Contact = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-maroon-dark dark:text-text-light transition-colors duration-300 font-display">
            {/* Navigation */}
            <header className="flex items-center justify-between border-b border-solid border-maroon-dark/10 px-10 py-4 bg-background-light dark:bg-background-dark sticky top-0 z-50">
                <Link to="/" className="flex items-center gap-4 text-maroon-dark dark:text-primary">
                    <span className="material-symbols-outlined text-3xl">spa</span>
                    <h2 className="text-xl font-bold leading-tight tracking-tight uppercase">Elsa Coiffure</h2>
                </Link>
                <div className="flex flex-1 justify-end gap-10 items-center">
                    <nav className="hidden md:flex items-center gap-8">
                        <Link className="text-sm font-medium hover:text-primary transition-colors" to="/">Home</Link>
                        <Link className="text-sm font-medium hover:text-primary transition-colors" to="/booking">Services</Link>
                        <Link className="text-sm font-medium hover:text-primary transition-colors" to="/about">About Us</Link>
                        <Link className="text-sm font-medium text-primary" to="/contact">Contact</Link>
                    </nav>
                    <Link to="/client">
                        <Button variant="primary" size="sm" className="min-w-[120px]">Account</Button>
                    </Link>
                </div>
            </header>

            <main className="flex flex-1 flex-col lg:flex-row min-h-[calc(100vh-73px-61px)]">
                {/* Left: Styled Map Container */}
                <div className="relative w-full lg:w-1/2 min-h-[400px] lg:min-h-0 bg-[#f1ede9] dark:bg-maroon-dark/40">
                    <div className="absolute inset-0 grayscale contrast-125 opacity-70 mix-blend-multiply dark:mix-blend-overlay">
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200')" }}
                        ></div>
                    </div>
                    {/* Decorative Marker */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <span className="material-symbols-outlined text-primary text-5xl drop-shadow-lg">location_on</span>
                        <div className="mt-2 px-6 py-3 bg-white/90 dark:bg-maroon-dark/90 backdrop-blur-sm rounded-xl shadow-2xl border border-primary/30">
                            <p className="font-bold text-sm tracking-widest uppercase">ELSA COIFFURE</p>
                            <p className="text-[10px] italic font-medium">15 Avenue de Luxe, Paris</p>
                        </div>
                    </div>
                </div>

                {/* Right: Form and Info */}
                <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-20 bg-background-light dark:bg-background-dark">
                    <div className="mb-12 animate-fade-in">
                        <h1 className="text-primary text-5xl font-medium italic mb-4">Contact & Location</h1>
                        <p className="text-accent-bronze text-lg italic font-medium">Luxury Afro Hair Salon — Special Event Inquiries</p>
                    </div>

                    <div className="flex flex-col gap-8 max-w-lg animate-fade-in stagger-1">
                        <form className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <label className="flex flex-col gap-2">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-accent-bronze">Full Name</span>
                                    <input
                                        className="h-12 bg-transparent border-0 border-b-2 border-maroon-dark/10 dark:border-white/10 focus:ring-0 focus:border-primary px-0 text-lg transition-all placeholder:text-accent-bronze/30 italic"
                                        placeholder="Aditi Taylor"
                                        type="text"
                                    />
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-accent-bronze">Email Address</span>
                                    <input
                                        className="h-12 bg-transparent border-0 border-b-2 border-maroon-dark/10 dark:border-white/10 focus:ring-0 focus:border-primary px-0 text-lg transition-all placeholder:text-accent-bronze/30 italic"
                                        placeholder="aditi@example.com"
                                        type="email"
                                    />
                                </label>
                            </div>

                            <label className="flex flex-col gap-2">
                                <span className="text-[10px] uppercase font-black tracking-widest text-accent-bronze">Type of Inquiry</span>
                                <select className="h-12 bg-transparent border-0 border-b-2 border-maroon-dark/10 dark:border-white/10 focus:ring-0 focus:border-primary px-0 text-lg transition-all appearance-none italic">
                                    <option>Wedding Styling</option>
                                    <option>Gala / Red Carpet</option>
                                    <option>Commercial Shoots</option>
                                    <option>Private Booking</option>
                                </select>
                            </label>

                            <label className="flex flex-col gap-2">
                                <span className="text-[10px] uppercase font-black tracking-widest text-accent-bronze">Message</span>
                                <textarea
                                    className="bg-transparent border-0 border-b-2 border-maroon-dark/10 dark:border-white/10 focus:ring-0 focus:border-primary px-0 text-lg transition-all placeholder:text-accent-bronze/30 italic resize-none"
                                    placeholder="How can we assist you for your special event?"
                                    rows="3"
                                ></textarea>
                            </label>

                            <Button variant="primary" size="lg" className="w-full h-14 uppercase tracking-widest text-xs font-black shadow-xl shadow-primary/20">
                                Send Message
                            </Button>
                        </form>
                    </div>

                    {/* Info Grid */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-maroon-dark/10 dark:border-white/10 pt-12 animate-fade-in stagger-2">
                        <div className="space-y-4">
                            <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-primary">The Salon</h4>
                            <address className="not-italic text-lg leading-relaxed font-display font-bold">
                                15 Avenue de Luxe<br />
                                75008 Paris, France
                            </address>
                            <p className="text-sm font-bold text-accent-bronze">+33 1 23 45 67 89</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-primary">Hours</h4>
                            <ul className="text-sm space-y-2 font-bold text-accent-bronze">
                                <li className="flex justify-between border-b border-maroon-dark/5 dark:border-white/5 pb-1"><span>Mon - Fri</span> <span className="text-maroon-dark dark:text-text-light">09:00 — 19:00</span></li>
                                <li className="flex justify-between border-b border-maroon-dark/5 dark:border-white/5 pb-1"><span>Saturday</span> <span className="text-maroon-dark dark:text-text-light">10:00 — 18:00</span></li>
                                <li className="flex justify-between"><span>Sunday</span> <span className="text-primary italic">Closed</span></li>
                            </ul>
                        </div>
                    </div>

                    {/* Social Icons */}
                    <div className="mt-12 flex gap-6 animate-fade-in stagger-3">
                        {['camera_enhance', 'movie', 'mail'].map((icon, i) => (
                            <a key={i} className="size-12 rounded-full border border-maroon-dark/10 dark:border-white/10 flex items-center justify-center text-accent-bronze hover:text-primary hover:border-primary transition-all duration-300" href="#">
                                <span className="material-symbols-outlined text-xl">{icon}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="py-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-accent-bronze/40 border-t border-maroon-dark/5 bg-background-light dark:bg-background-dark">
                © 2026 Elsa Coiffure. All Rights Reserved. Luxury Afro Hair Care.
            </footer>
        </div>
    );
};

export default Contact;
