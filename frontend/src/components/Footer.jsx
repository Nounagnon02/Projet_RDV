import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { BrandLogo, ProtectedIcon, ProtectedLogo } from './ui';
import { useSiteSettings } from '../context/SiteSettingsContext';

const Footer = () => {
    const { settings } = useSiteSettings();

    const currentYear = new Date().getFullYear();
    const siteName = settings.site_name || 'Elsa';
    const footerDescription = settings.footer_description || 'Élever les standards du soin capillaire Afro à travers une expérience de luxe et une excellence artistique depuis plus d\'une décennie.';
    const contactEmail = settings.contact_email || 'concierge@elsacoiffure.com';
    const contactPhone = settings.contact_phone || '+33 1 23 45 67 89';
    const contactAddress = settings.contact_address || '75 Av. des Champs-Élysées, Paris';
    const socialInstagram = settings.social_instagram || '#';
    const socialFacebook = settings.social_facebook || '#';
    const socialYoutube = settings.social_youtube || '#';

    return (
        <footer className="bg-maroon-dark text-background-light py-16 md:py-24 px-6 xl:px-40 lg:px-20 border-t border-white/5 selection:bg-primary/30">
            <div className="max-w-[1440px] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 lg:gap-24 text-center sm:text-left">
                    {/* Brand Section */}
                    <div className="lg:col-span-1 flex flex-col items-center sm:items-start">
                        <Link to="/" className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 mb-8 text-primary group">
                            <BrandLogo
                                className="h-14 md:h-16 w-auto max-w-[150px] md:max-w-[180px] object-contain group-hover:scale-105 transition-transform duration-500"
                                alt="Logo Elsa Coiffure"
                            />
                            <ProtectedLogo className="flex flex-col justify-center space-y-1">
                                <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-[0.16em] text-primary leading-none">{siteName}</h2>
                            </ProtectedLogo>
                        </Link>
                        <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-sm italic">
                            {footerDescription}
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-col items-center sm:items-start">
                        <h4 className="text-white font-black uppercase text-[10px] tracking-[0.4em] mb-8 lg:mb-10 opacity-40">Navigation</h4>
                        <ul className="space-y-4 md:space-y-6 text-[10px] font-bold tracking-[0.2em] uppercase text-slate-200">
                            <li><Link className="hover:text-primary transition-colors block py-1" to="/about">Notre Histoire</Link></li>
                            <li><Link className="hover:text-primary transition-colors block py-1" to="/providers">Services</Link></li>
                            <li><Link className="hover:text-primary transition-colors block py-1" to="/shop">Boutique</Link></li>
                            <li><Link className="hover:text-primary transition-colors block py-1" to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Concierge / Contact Section */}
                    <div className="sm:col-span-2 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-8">
                        <div className="flex flex-col items-center sm:items-start">
                            <h4 className="text-white font-black uppercase text-[10px] tracking-[0.4em] mb-8 lg:mb-10 opacity-40">Conciergerie</h4>
                            <ul className="space-y-4 md:space-y-6 text-[10px] font-bold tracking-[0.2em] uppercase text-slate-300">
                                <li className="flex items-center gap-4 justify-center sm:justify-start group">
                                    <ProtectedIcon translate="no" data-i18n="false" className="text-primary text-base group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-primary text-base">mail</span>
                                    </ProtectedIcon>
                                    <span className="break-all">{contactEmail}</span>
                                </li>
                                <li className="flex items-center gap-4 justify-center sm:justify-start group">
                                    <ProtectedIcon translate="no" data-i18n="false" className="text-primary text-base group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-primary text-base">call</span>
                                    </ProtectedIcon>
                                    <span>{contactPhone}</span>
                                </li>
                                <li className="flex items-center gap-4 justify-center sm:justify-start group">
                                    <ProtectedIcon translate="no" data-i18n="false" className="text-primary text-base group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-primary text-base">location_on</span>
                                    </ProtectedIcon>
                                    <span className="text-center sm:text-left">{contactAddress}</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col items-center sm:items-start">
                            <h4 className="text-white font-black uppercase text-[10px] tracking-[0.4em] mb-8 lg:mb-10 opacity-40">Suivez-nous</h4>
                            <div className="flex gap-6">
                                {[
                                    { name: 'instagram', icon: 'photo_camera', url: socialInstagram },
                                    { name: 'facebook', icon: 'public', url: socialFacebook },
                                    { name: 'youtube', icon: 'smart_display', url: socialYoutube }
                                ].map((social) => (
                                    <a 
                                        key={social.name} 
                                        href={social.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="size-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary transition-all"
                                    >
                                        <ProtectedIcon translate="no" data-i18n="false">
                                            <span className="material-symbols-outlined text-lg">{social.icon}</span>
                                        </ProtectedIcon>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-footer */}
                <div className="border-t border-white/5 mt-16 md:mt-24 pt-10 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 text-center md:text-left">
                    <p>© {currentYear} {siteName.toUpperCase()} PARIS. TOUS DROITS RÉSERVÉS.</p>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                        <a className="hover:text-white transition-colors" href="#">Politique de Confidentialité</a>
                        <a className="hover:text-white transition-colors" href="#">Conditions de Réservation</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
