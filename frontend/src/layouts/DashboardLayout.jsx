import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    Scissors,
    Clock,
    Calendar,
    Users,
    LogOut,
    Menu,
    X,
    ChevronRight,
    ShoppingBag,
    Star,
    Bell,
    Settings,
    Mail,
    Globe
} from 'lucide-react';
import { useState } from 'react';

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const { settings } = useSiteSettings();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const menuItems = [
        { name: t('admin.dashboard'), path: '/dashboard', icon: LayoutDashboard },
        { name: t('admin.services'), path: '/dashboard/services', icon: Scissors },
        { name: t('admin.availabilities'), path: '/dashboard/availabilities', icon: Clock },
        { name: t('admin.agenda'), path: '/dashboard/agenda', icon: Calendar },
        { name: t('admin.clients'), path: '/dashboard/clients', icon: Users },
        { name: t('admin.products'), path: '/dashboard/products', icon: ShoppingBag },
        { name: t('admin.loyalty'), path: '/dashboard/loyalty', icon: Star },
        { name: t('admin.messages'), path: '/dashboard/messages', icon: Mail },
        { name: t('admin.settings'), path: '/dashboard/settings', icon: Settings },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display selection:bg-primary/30">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 right-4 z-50 h-12 w-12 rounded-xl glass-card flex items-center justify-center text-maroon-dark dark:text-text-light lg:hidden"
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex h-full flex-col bg-maroon-dark text-white shadow-2xl">
                    {/* Logo Area */}
                    <div className="flex h-24 items-center px-8 border-b border-white/10">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="size-11 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-white text-2xl">content_cut</span>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-primary italic">{settings.site_name || 'Elsa Coiffure'}</p>
                                <p className="text-primary text-[10px] uppercase tracking-widest mt-1 font-bold">{t('admin.admin_panel')}</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 px-4 py-8 overflow-y-auto scrollbar-hide">
                        <p className="px-5 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{t('admin.salon_operations')}</p>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`
                                        group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-bold transition-all
                                        ${isActive
                                            ? 'bg-white/10 text-primary border border-white/5'
                                            : 'text-white/60 hover:bg-white/5 hover:text-white'}
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        <item.icon className={`h-[20px] w-[20px] ${isActive ? 'text-primary' : 'text-white/40 group-hover:text-white'}`} />
                                        {item.name}
                                    </div>
                                    {isActive && <ChevronRight className="h-4 w-4 text-primary" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="border-t border-white/10 p-6 bg-black/10">
                        {/* Language Selector */}
                        <div className="mb-4 flex items-center gap-2">
                            <Globe className="size-4 text-white/40" />
                            <div className="flex gap-2 flex-1">
                                <button
                                    onClick={() => changeLanguage('fr')}
                                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                                        i18n.language === 'fr'
                                            ? 'bg-primary text-white'
                                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                                    }`}
                                >
                                    FR
                                </button>
                                <button
                                    onClick={() => changeLanguage('en')}
                                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                                        i18n.language === 'en'
                                            ? 'bg-primary text-white'
                                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                                    }`}
                                >
                                    EN
                                </button>
                            </div>
                        </div>

                        <div className="mb-6 flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5">
                            <div className="size-12 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                                {user?.avatar ? (
                                    <img src={user.avatar} className="size-full object-cover" alt={user.name} />
                                ) : (
                                    <span className="text-xl font-bold text-primary italic">{user?.name?.charAt(0)}</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="truncate text-sm font-bold text-white leading-tight">{user?.name}</p>
                                <p className="truncate text-[10px] text-white/40 uppercase tracking-widest mt-0.5">{user?.role}</p>
                            </div>
                            <button className="size-9 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-primary transition-colors">
                                <Bell className="size-4" />
                            </button>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold text-white/40 hover:bg-rose-500/10 hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20"
                        >
                            <LogOut className="size-5" />
                            {t('admin.logout')}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto bg-background-light dark:bg-background-dark">
                <div className="p-6 lg:p-12 animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
