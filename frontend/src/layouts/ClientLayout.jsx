import { Link, useLocation } from 'react-router-dom';
import { Calendar, Settings, ShoppingBag, Image, CircleHelp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ClientHeader from '../components/ClientHeader';

const ClientLayout = ({ children, title = 'Votre Profil', subtitle = 'Membre Privilegie de l’Atelier.' }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const clientLinks = [
        { name: t('client.nav.appointments', { defaultValue: 'Mes reservations' }), path: '/client/appointments', icon: Calendar },
        { name: t('client.nav.shop', { defaultValue: 'Boutique Elsa' }), path: '/shop', icon: ShoppingBag },
        { name: t('client.nav.gallery', { defaultValue: 'Galerie photos' }), path: '/gallery', icon: Image },
        { name: t('client.nav.settings', { defaultValue: 'Parametres' }), path: '/profile', icon: Settings },
        { name: t('client.nav.help', { defaultValue: 'Aide' }), path: '/help', icon: CircleHelp },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
            <ClientHeader />

            <div className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-8 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                <aside className="lg:col-span-3 space-y-8">
                    <div className="rounded-3xl bg-white dark:bg-white/5 border border-maroon-dark/5 p-7 shadow-xl shadow-maroon-dark/5">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">{title}</p>
                        <h2 className="text-4xl font-display italic font-black text-maroon-dark dark:text-text-light leading-none">
                            {t('client.greeting', { defaultValue: 'Bonjour.' })}
                        </h2>
                        <p className="text-accent-bronze font-medium text-sm italic mt-3">{subtitle}</p>
                    </div>

                    <nav className="space-y-2">
                        {clientLinks.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                    : 'text-maroon-dark/80 hover:bg-maroon-dark/5 hover:text-maroon-dark border border-transparent'
                                    }`}
                            >
                                <item.icon className="size-4" />
                                <span className="text-[11px] font-black uppercase tracking-wider">{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                <main className="lg:col-span-9">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default ClientLayout;
