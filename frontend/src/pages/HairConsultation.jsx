import { useState } from 'react';
import { Card, Button, Input } from '../components/ui';
import {
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Camera,
    Info,
    Sparkles
} from 'lucide-react';

const HairConsultation = () => {
    const [step, setStep] = useState(2); // Starting at Step 2 as per mockup example
    const totalSteps = 5;
    const progress = (step / totalSteps) * 100;

    return (
        <div className="min-h-screen bg-[#f9f7f2] dark:bg-[#1f1813] text-maroon-dark dark:text-background-light font-display flex flex-col">
            {/* Header - Simple Elite Nav */}
            <header className="bg-maroon-dark text-white z-50 shadow-lg">
                <div className="max-w-[1200px] mx-auto px-6 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-4xl text-primary">flare</span>
                        <h1 className="text-2xl font-bold tracking-widest uppercase font-sans">Elsa Coiffure</h1>
                    </div>
                    <div className="flex items-center gap-8">
                        <nav className="hidden md:flex items-center gap-8">
                            <a href="/" className="text-[10px] font-black uppercase tracking-[0.3em] hover:text-primary transition-all">Menu</a>
                            <a href="/about" className="text-[10px] font-black uppercase tracking-[0.3em] hover:text-primary transition-all">Our Story</a>
                        </nav>
                        <Button variant="primary" className="rounded-none px-8 py-3 h-auto font-black uppercase tracking-widest text-[10px]">
                            Exit Consultation
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow max-w-[900px] mx-auto w-full px-6 py-16 animate-fade-in">
                {/* Progress Bar - Exact Mockup Reproduction */}
                <div className="mb-16 space-y-6">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em]">
                        <span className="text-maroon-dark/60">Step {step} of {totalSteps}: Hair Analysis</span>
                        <span className="text-primary">{progress}% Complete</span>
                    </div>
                    <div className="w-full h-1.5 bg-maroon-dark/5 dark:bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Form Card - Exact Mockup Design */}
                <div className="bg-white dark:bg-white/5 p-10 md:p-16 shadow-2xl shadow-maroon-dark/5 border border-maroon-dark/5 rounded-sm relative overflow-hidden">
                    {/* Decorative Flare */}
                    <div className="absolute -top-10 -right-10 opacity-5">
                        <span className="material-symbols-outlined text-[150px] text-primary">spa</span>
                    </div>

                    <header className="mb-12 relative z-10">
                        <h2 className="text-4xl md:text-5xl font-display italic text-maroon-dark dark:text-text-light mb-4">
                            Tell us about your crown
                        </h2>
                        <p className="text-accent-bronze text-lg font-medium leading-relaxed max-w-xl font-sans">
                            Help our master stylists prepare for your visit by sharing your current hair journey.
                        </p>
                    </header>

                    <form className="space-y-16 relative z-10">
                        {/* Natural Hair Pattern Section */}
                        <section className="space-y-8">
                            <label className="block text-2xl font-bold italic border-l-4 border-primary pl-6">
                                What is your natural hair pattern?
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { id: 'type4c', label: '4C (Coily/Kinky)', active: true },
                                    { id: 'type4b', label: '4A/4B (Curly/Coily)', active: false }
                                ].map(option => (
                                    <div key={option.id} className="relative group">
                                        <input
                                            type="radio"
                                            name="hair_type"
                                            id={option.id}
                                            className="hidden peer"
                                            defaultChecked={option.active}
                                        />
                                        <label
                                            htmlFor={option.id}
                                            className="flex items-center justify-between p-8 border border-maroon-dark/10 group-hover:border-primary/50 cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:ring-1 peer-checked:ring-primary h-full"
                                        >
                                            <span className="font-bold text-lg">{option.label}</span>
                                            <CheckCircle2 className={`size-6 text-primary transition-opacity ${option.active ? 'opacity-100' : 'opacity-10 group-hover:opacity-30'}`} />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Recent Treatments Section */}
                        <section className="space-y-8">
                            <label className="block text-2xl font-bold italic border-l-4 border-primary pl-6">
                                Current hair state & recent treatments
                            </label>
                            <div className="space-y-4">
                                {[
                                    { title: 'Chemical Color', desc: 'Includes bleach or permanent dye in the last 6 months' },
                                    { title: 'Heat Damage', desc: 'Regular use of high-heat styling tools' }
                                ].map(item => (
                                    <label key={item.title} className="flex items-start gap-6 p-8 border border-maroon-dark/10 hover:border-primary/50 transition-all cursor-pointer group rounded-sm">
                                        <div className="mt-1.5 size-5 border-2 border-maroon-dark/20 group-hover:border-primary rounded-none flex items-center justify-center transition-colors">
                                            <div className="size-2.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                        <div>
                                            <span className="block font-bold text-lg mb-1">{item.title}</span>
                                            <span className="text-sm text-accent-bronze font-medium">{item.desc}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* File Upload Section */}
                        <section className="space-y-8">
                            <label className="block text-2xl font-bold italic border-l-4 border-primary pl-6">
                                Upload a photo of your current hair <span className="text-accent-bronze/50 font-normal">(Optional)</span>
                            </label>
                            <div className="border-2 border-dashed border-maroon-dark/10 p-16 text-center bg-[#f9f7f2]/50 hover:bg-primary/5 hover:border-primary/30 transition-all group flex flex-col items-center gap-6 rounded-xl">
                                <div className="size-20 rounded-full bg-white flex items-center justify-center shadow-xl shadow-maroon-dark/5 group-hover:scale-110 transition-transform">
                                    <Camera className="size-8 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold mb-2">Glissez votre photo ou cliquez ici</p>
                                    <p className="text-xs text-accent-bronze mb-6">Formats acceptés : JPG, PNG (Max 5MB)</p>
                                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-10 rounded-full">
                                        CHOISIR LE FICHIER
                                    </Button>
                                </div>
                            </div>
                        </section>

                        {/* Navigation Footer */}
                        <div className="pt-16 flex items-center justify-between border-t border-maroon-dark/5">
                            <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-accent-bronze hover:text-maroon-dark transition-all">
                                <ArrowLeft className="size-4" /> Back
                            </button>
                            <Button variant="primary" size="lg" className="h-16 px-16 rounded-none font-black uppercase tracking-[0.3em] shadow-2xl flex items-center gap-4 group">
                                Next Step <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </form>
                </div>
            </main>

            {/* Simple Mockup Footer */}
            <footer className="bg-maroon-dark text-white/50 py-20 mt-auto">
                <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-4 text-white mb-8">
                            <span className="material-symbols-outlined text-3xl text-primary">flare</span>
                            <h2 className="text-xl font-bold tracking-widest uppercase">Elsa Coiffure</h2>
                        </div>
                        <p className="max-w-sm leading-relaxed text-sm italic text-slate-300">
                            The digital consultation ensures your experience at Elsa Coiffure is tailored perfectly to your unique hair profile and beauty goals.
                        </p>
                    </div>
                    {[
                        { title: 'Concierge', lines: ['concierge@elsacoiffure.fr', '+33 1 23 45 67 89'] },
                        { title: 'Security', lines: ['Your hair profile data is encrypted and only visible to your assigned stylist.'] }
                    ].map(col => (
                        <div key={col.title}>
                            <h4 className="text-white font-bold mb-6 uppercase text-[10px] tracking-widest">{col.title}</h4>
                            {col.lines.map((line, i) => (
                                <p key={i} className="text-sm mb-2 text-slate-200">{line}</p>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="max-w-[1200px] mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between text-[9px] uppercase tracking-[0.3em]">
                    <p>© 2026 ELSA COIFFURE PARIS. TOUS DROITS RÉSERVÉS.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <a href="#" className="hover:text-primary transition-colors">Confidentialité</a>
                        <a href="#" className="hover:text-primary transition-colors">Termes</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HairConsultation;
