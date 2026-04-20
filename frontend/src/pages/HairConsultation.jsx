import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Camera,
} from 'lucide-react';

const HairConsultation = () => {
    const { t } = useTranslation();
    const [step, setStep] = useState(2); // Starting at Step 2 as per mockup example
    const totalSteps = 5;
    const progress = (step / totalSteps) * 100;

    return (
        <div className="min-h-screen bg-[#f9f7f2] dark:bg-[#1f1813] text-maroon-dark dark:text-background-light font-display flex flex-col overflow-x-hidden">
            <Navbar />

            {/* Main Content */}
            <main className="flex-grow max-w-[900px] mx-auto w-full px-6 py-16 animate-fade-in">
                {/* Progress Bar */}
                <div className="mb-20 space-y-6 px-4 md:px-0">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em]">
                        <span className="text-maroon-dark/60">{t('consultation.step_of', { defaultValue: 'Etape {{step}} sur {{total}}', step, total: totalSteps })}</span>
                        <span className="text-primary">{progress}% {t('consultation.completed', { defaultValue: 'Complete' })}</span>
                    </div>
                    <div className="w-full h-1 bg-maroon-dark/5 dark:bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-1000"
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
                        <h2 className="font-display italic text-maroon-dark dark:text-text-light mb-6 leading-tight" style={{ fontSize: 'var(--text-h2)' }}>
                            {t('consultation.title', { defaultValue: 'Parlez-nous de votre couronne' })}
                        </h2>
                        <p className="text-accent-bronze text-base md:text-lg font-medium leading-relaxed max-w-xl font-sans italic">
                            {t('consultation.subtitle', { defaultValue: 'Aidez nos stylistes a preparer votre visite en partageant votre historique capillaire.' })}
                        </p>
                    </header>

                    <form className="space-y-16 relative z-10">
                        {/* Natural Hair Pattern Section */}
                        <section className="space-y-8">
                            <label className="block text-2xl font-bold italic border-l-4 border-primary pl-6">
                                {t('consultation.hair_pattern', { defaultValue: 'Quel est votre type de cheveux naturel ?' })}
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { id: 'type4c', label: t('consultation.pattern_4c', { defaultValue: '4C (Crepu/Coily)' }), active: true },
                                    { id: 'type4b', label: t('consultation.pattern_4ab', { defaultValue: '4A/4B (Boule/Coily)' }), active: false }
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
                                {t('consultation.current_state', { defaultValue: 'Etat actuel et traitements recents' })}
                            </label>
                            <div className="space-y-4">
                                {[
                                    { title: t('consultation.chemical_color', { defaultValue: 'Coloration chimique' }), desc: t('consultation.chemical_color_desc', { defaultValue: 'Inclut decoloration ou teinture permanente sur les 6 derniers mois' }) },
                                    { title: t('consultation.heat_damage', { defaultValue: 'Dommages thermiques' }), desc: t('consultation.heat_damage_desc', { defaultValue: "Utilisation reguliere d'appareils chauffants" }) }
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
                                {t('consultation.photo', { defaultValue: 'Photo de vos cheveux' })} <span className="text-accent-bronze/50 font-normal">({t('consultation.optional', { defaultValue: 'Optionnel' })})</span>
                            </label>
                            <div className="border-2 border-dashed border-maroon-dark/10 p-10 md:p-16 text-center bg-[#f9f7f2]/50 hover:bg-primary/5 hover:border-primary/30 transition-all group flex flex-col items-center gap-6 rounded-3xl">
                                <div className="size-16 md:size-20 rounded-full bg-white flex items-center justify-center shadow-xl shadow-maroon-dark/5 group-hover:scale-110 transition-transform">
                                    <Camera className="size-8 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-bold">{t('consultation.upload_drag', { defaultValue: 'Glissez votre photo ou cliquez ici' })}</p>
                                    <p className="text-[10px] text-accent-bronze">{t('consultation.upload_formats', { defaultValue: 'Formats : JPG, PNG (Max 5MB)' })}</p>
                                </div>
                                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {t('consultation.choose_file', { defaultValue: 'Choisir le fichier' })}
                                </Button>
                            </div>
                        </section>

                        {/* Navigation Footer */}
                        <div className="pt-16 flex items-center justify-between border-t border-maroon-dark/5">
                            <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-accent-bronze hover:text-maroon-dark transition-all">
                                <ArrowLeft className="size-4" /> {t('consultation.back', { defaultValue: 'Retour' })}
                            </button>
                            <Button variant="primary" size="lg" className="h-16 px-16 rounded-none font-black uppercase tracking-[0.3em] shadow-2xl flex items-center gap-4 group">
                                {t('consultation.next_step', { defaultValue: 'Etape suivante' })} <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HairConsultation;
