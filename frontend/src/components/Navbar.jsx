import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, ProtectedIcon, ProtectedLogo } from './ui';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './ui/LanguageSwitcher';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { t } = useTranslation();
    const { settings } = useSiteSettings();
    const { itemCount } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { name: t('navbar.home', { defaultValue: 'Home' }), path: '/' },
        { name: t('navbar.services'), path: '/providers' },
        { name: t('navbar.about'), path: '/about' },
        { name: t('navbar.gallery', { defaultValue: 'Galerie' }), path: '/gallery' },
        { name: t('navbar.shop'), path: '/shop' },
        { name: t('navbar.contact'), path: '/contact' },
    ];

    return (
        <header
            className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4 xl:px-40 lg:px-20 bg-white/95 backdrop-blur-xl border-b border-maroon-dark/10 shadow-lg"
        >
            <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group relative z-50">
                    <ProtectedIcon translate="no" data-i18n="false" className="h-10 w-10 text-primary group-hover:rotate-[30deg] transition-transform duration-500">
                        <span className="material-symbols-outlined text-4xl">flare</span>
                    </ProtectedIcon>
                    <ProtectedLogo className="flex flex-col">
                        <h2 className="text-xl font-display font-bold leading-none tracking-tight text-maroon-dark dark:text-text-light uppercase">
                            {settings.site_name || 'Elsa Coiffure'}
                        </h2>
                        <span className="text-[8px] font-black text-primary uppercase tracking-[0.4em] mt-1">{t('navbar.concierge')}</span>
                    </ProtectedLogo>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group py-2 
                                ${location.pathname === link.path ? 'text-primary' : 'text-maroon-dark/60 dark:text-text-light/60 hover:text-primary'}
                            `}
                        >
                            {link.name}
                            <span className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-primary transition-transform duration-500 origin-left 
                                ${location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                            `}></span>
                        </Link>
                    ))}

                    <div className="h-6 w-px bg-maroon-dark/10 dark:bg-white/10 mx-2"></div>

                    <Link to="/checkout" className="relative text-maroon-dark dark:text-text-light hover:text-primary transition-colors">
                        <ProtectedIcon translate="no" data-i18n="false">
                            <ShoppingBag size={20} />
                        </ProtectedIcon>
                        <span className="absolute -top-2 -right-2 bg-primary text-white text-[8px] h-4 min-w-4 px-1 rounded-full flex items-center justify-center font-bold" translate="no">{itemCount}</span>
                    </Link>

                    <LanguageSwitcher />

                    <Link to="/providers">
                        <Button variant="primary" size="md" className="px-8 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                            {t('navbar.booking')}
                        </Button>
                    </Link>
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center gap-4 lg:hidden relative z-50">
                    <Link to="/checkout" className="relative text-maroon-dark dark:text-text-light">
                        <ProtectedIcon translate="no" data-i18n="false">
                            <ShoppingBag size={20} />
                        </ProtectedIcon>
                        <span className="absolute -top-2 -right-2 bg-primary text-white text-[8px] h-4 min-w-4 px-1 rounded-full flex items-center justify-center font-bold" translate="no">{itemCount}</span>
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`size-10 rounded-full flex items-center justify-center transition-all ${isMobileMenuOpen ? 'bg-primary text-white' : 'bg-maroon-dark/5 text-maroon-dark dark:text-text-light'
                            }`}
                    >
                        <ProtectedIcon translate="no" data-i18n="false">
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </ProtectedIcon>
                    </button>
                    <LanguageSwitcher className="ml-2" />
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-background-light dark:bg-background-dark z-40 lg:hidden transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                }`}>
                <div className="h-full flex flex-col p-10 pt-32">
                    <nav className="flex flex-col gap-8">
                        {navLinks.map((link, i) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                style={{ transitionDelay: `${i * 100}ms` }}
                                className={`text-4xl font-display italic transition-all duration-700 ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                                    } ${location.pathname === link.path ? 'text-primary' : 'text-maroon-dark dark:text-text-light'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto space-y-8 animate-fade-in-up">
                        <div className="h-px w-full bg-maroon-dark/5 dark:bg-white/5"></div>
                        <div className="flex flex-col gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t('navbar.concierge')}</span>
                            <a href={`tel:${settings.contact_phone?.replace(/\s/g, '')}`} className="text-xl font-display italic text-maroon-dark dark:text-text-light">{settings.contact_phone || '+33 1 23 45 67 89'}</a>
                        </div>
                        <Link to="/providers" className="block w-full">
                            <Button variant="primary" size="lg" className="w-full h-16 font-black text-xs uppercase tracking-[0.3em]">
                                {t('navbar.book_now')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
