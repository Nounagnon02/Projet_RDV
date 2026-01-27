import { Card, Button } from '../components/ui';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Header / TopNavBar */}
            <header className="sticky top-0 z-50 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-maroon-dark/10 py-4 px-6 md:px-12">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-3xl">spa</span>
                        <h2 className="text-xl font-display font-black uppercase tracking-tight text-maroon-dark dark:text-text-light">Elsa Coiffure</h2>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-sm font-bold text-maroon-dark dark:text-text-light hover:text-primary transition-colors">Home</Link>
                        <Link to="/booking" className="text-sm font-bold text-maroon-dark dark:text-text-light hover:text-primary transition-colors">Services</Link>
                        <Link to="/about" className="text-sm font-black text-primary border-b-2 border-primary">About Us</Link>
                        <Link to="/contact" className="text-sm font-bold text-maroon-dark dark:text-text-light hover:text-primary transition-colors">Contact</Link>
                    </nav>
                    <Link to="/booking">
                        <Button variant="primary" size="sm">Book Now</Button>
                    </Link>
                </div>
            </header>

            <main>
                {/* Hero Section: The Elsa Story */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 lg:py-32">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <div className="w-full lg:w-1/2">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-primary/10 rounded-2xl -rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
                                <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800"
                                        alt="Elsa, Founder of Elsa Coiffure"
                                        className="size-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 space-y-8 animate-fade-in">
                            <div className="space-y-4">
                                <span className="text-primary font-black tracking-[0.3em] uppercase text-xs">Our Heritage</span>
                                <h1 className="text-5xl md:text-7xl font-display font-medium italic text-maroon-dark dark:text-text-light leading-tight">
                                    The Elsa Story
                                </h1>
                                <div className="h-1 w-24 bg-primary"></div>
                            </div>
                            <div className="space-y-6 text-accent-bronze font-medium leading-relaxed">
                                <p className="text-xl font-display italic">
                                    Founded on the belief that natural texture is the ultimate luxury, Elsa Coiffure has redefined Afro hair artistry for over a decade. Our journey began with a single vision: to create a sanctuary where heritage meets high-fashion.
                                </p>
                                <p className="text-base">
                                    Every crown we style is a masterpiece. From intricate traditional techniques to modern avant-garde silhouettes, we blend technical excellence with a deep understanding of natural hair health. We don't just style hair; we celebrate a legacy of elegance and self-expression.
                                </p>
                            </div>
                            <Button variant="outline" size="lg" className="px-10 h-14">
                                Our Philosophy
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Wedding Services Header */}
                <section className="bg-maroon-dark/5 dark:bg-white/5 py-24 px-6 md:px-12 text-center">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <span className="text-primary font-black tracking-[0.3em] uppercase text-xs">Exquisite Artistry</span>
                        <h2 className="text-4xl md:text-6xl font-display font-medium italic text-maroon-dark dark:text-text-light">
                            Bridal Collections
                        </h2>
                        <div className="h-0.5 w-16 bg-primary mx-auto"></div>
                        <p className="text-lg text-accent-bronze font-medium max-w-2xl mx-auto font-display">
                            Celebrate your most beautiful day with artisanal bridal styling. We specialize in sophisticated natural updos and cultural silhouettes for the modern bride.
                        </p>
                    </div>
                </section>

                {/* Bridal Gallery */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 py-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: 'Traditional Bridal', desc: 'Cultural heritage woven into sophisticated styles.', img: 'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&q=80&w=400' },
                            { title: 'Modern Updos', desc: 'Sculptural silhouettes with a contemporary edge.', img: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=400' },
                            { title: 'Veil Artistry', desc: 'Artful integration of veils into natural textures.', img: 'https://images.unsplash.com/photo-1543807218-09ae4948a865?auto=format&fit=crop&q=80&w=400' },
                            { title: 'Natural Crown', desc: 'Celebrating your unique texture with gold-standard care.', img: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&q=80&w=400' }
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
                                Begin Your Bridal Journey
                            </h3>
                            <p className="text-lg text-accent-bronze font-medium max-w-xl mx-auto">
                                Every bride is unique. Inquire today for a personalized wedding consultation and discovery session.
                            </p>
                            <Button variant="primary" size="lg" className="h-16 px-12 text-lg shadow-xl shadow-primary/20" rightIcon={<span className="material-symbols-outlined">calendar_month</span>}>
                                Bridal Inquiry
                            </Button>
                        </div>
                    </Card>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-maroon-dark text-white/40 py-24 px-6 md:px-12 border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-primary">
                            <span className="material-symbols-outlined text-3xl">spa</span>
                            <h2 className="text-2xl font-display font-bold uppercase italic tracking-tighter text-white">Elsa</h2>
                        </div>
                        <p className="text-sm font-medium leading-relaxed">
                            Elevating the standard of Afro hair care through luxury experience and artistic excellence.
                        </p>
                    </div>
                    {/* Navigation, Contact, Newsletter sections adapted from mockup */}
                    <div className="space-y-6">
                        <h4 className="text-white text-xs font-black uppercase tracking-widest">Navigation</h4>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><Link to="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
                            <li><Link to="/booking" className="hover:text-primary transition-colors">Services</Link></li>
                            <li><Link to="/faq" className="hover:text-primary transition-colors">Care Guide</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-white text-xs font-black uppercase tracking-widest">Contact</h4>
                        <ul className="space-y-4 text-sm font-bold">
                            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-sm">mail</span> concierge@elsacoiffure.com</li>
                            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-sm">location_on</span> 1250 Luxury Lane, Design District</li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-white text-xs font-black uppercase tracking-widest">Newsletter</h4>
                        <div className="flex gap-2">
                            <input className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-primary" placeholder="Email address" type="email" />
                            <button className="bg-primary p-2 rounded-lg text-white hover:bg-primary/80 transition-colors">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default About;
