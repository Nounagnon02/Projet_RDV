import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo, ProtectedIcon } from '../ui';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const navLinks = [
        { name: 'Dashboard', path: '/client', icon: 'dashboard' },
        { name: 'Hair Diagnosis', path: '/client/consultation', icon: 'biotech' },
        { name: 'The Boutique', path: '/shop', icon: 'shopping_bag' },
        { name: 'Appointments', path: '/client/appointments', icon: 'calendar_month' },
        { name: 'Gallery', path: '/gallery', icon: 'auto_awesome' },
        { name: 'Rewards', path: '/rewards', icon: 'workspace_premium' },
        { name: 'Profile Settings', path: '/profile', icon: 'person' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-72 bg-neutral-50 dark:bg-neutral-900/20 text-maroon-dark flex flex-col h-screen sticky top-0 border-r border-maroon-dark/5">
            <div className="p-8 flex flex-col h-full">
                {/* Brand */}
                <div className="mb-12 flex items-center gap-3">
                    <BrandLogo
                        className="h-10 md:h-12 w-auto max-w-[110px] md:max-w-[130px] object-contain"
                        alt="Logo Elsa Coiffure"
                    />
                    <div className="flex flex-col justify-center space-y-1">
                        <h1 className="text-xl font-display font-bold leading-none tracking-[0.16em] uppercase text-primary">Elsa Coiffure</h1>
                        <p className="text-primary text-[10px] uppercase tracking-[0.28em] font-black">Luxury Afro Hair</p>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${isActive(link.path)
                                ? 'bg-primary/15 text-primary font-semibold'
                                : 'text-maroon-dark/70 hover:text-maroon-dark hover:bg-maroon-dark/5'
                                }`}
                        >
                            <ProtectedIcon translate="no" data-i18n="false">
                                <span className={`material-symbols-outlined text-lg ${isActive(link.path) ? 'fill-1' : ''}`}>
                                    {link.icon}
                                </span>
                            </ProtectedIcon>
                            <span className="font-medium text-sm">{link.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* Footer Nav */}
                <div className="pt-8 border-t border-maroon-dark/10 space-y-1">
                    <Link
                        to="/help"
                        className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-maroon-dark/5 transition-all text-maroon-dark/70 hover:text-maroon-dark"
                    >
                        <ProtectedIcon translate="no" data-i18n="false">
                            <span className="material-symbols-outlined text-lg">help</span>
                        </ProtectedIcon>
                        <span className="font-medium text-sm">Help Center</span>
                    </Link>
                    <button
                        onClick={logout}
                        className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-red-50 transition-all text-maroon-dark/70 hover:text-red-600 w-full text-left"
                    >
                        <ProtectedIcon translate="no" data-i18n="false">
                            <span className="material-symbols-outlined text-lg">logout</span>
                        </ProtectedIcon>
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
