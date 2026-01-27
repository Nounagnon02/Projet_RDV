import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const navLinks = [
        { name: 'Dashboard', path: '/client', icon: 'dashboard' },
        { name: 'Hair Diagnosis', path: '/client/consultation', icon: 'biotech' },
        { name: 'The Boutique', path: '/client/shop', icon: 'shopping_bag' },
        { name: 'Appointments', path: '/client/appointments', icon: 'calendar_month' },
        { name: 'Gallery', path: '/gallery', icon: 'auto_awesome' },
        { name: 'Rewards', path: '/rewards', icon: 'workspace_premium' },
        { name: 'Profile Settings', path: '/profile', icon: 'person' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-72 bg-maroon-dark text-white flex flex-col h-screen sticky top-0">
            <div className="p-8 flex flex-col h-full">
                {/* Brand */}
                <div className="mb-12 flex items-center gap-3">
                    <div className="size-12 rounded-full bg-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-3xl">content_cut</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-display font-bold leading-none tracking-tight">Elsa Coiffure</h1>
                        <p className="text-primary text-[10px] uppercase tracking-widest mt-1 font-bold">Luxury Afro Hair</p>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${isActive(link.path)
                                ? 'bg-white/10 text-primary'
                                : 'hover:bg-white/5 text-white/80 hover:text-white'
                                }`}
                        >
                            <span className={`material-symbols-outlined ${isActive(link.path) ? 'fill-1' : ''}`}>
                                {link.icon}
                            </span>
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* Footer Nav */}
                <div className="pt-8 border-t border-white/10 space-y-2">
                    <Link
                        to="/help"
                        className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-white/80 hover:text-white"
                    >
                        <span className="material-symbols-outlined">help</span>
                        <span className="font-medium">Help Center</span>
                    </Link>
                    <button
                        onClick={logout}
                        className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-white/60 hover:text-red-400 w-full text-left"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
