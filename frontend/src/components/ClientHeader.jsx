import { Link } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import { BrandLogo, ProtectedIcon, ProtectedLogo } from './ui';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ClientHeader = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="h-20 md:h-24 px-4 md:px-8 border-b border-maroon-dark/5 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-40">
            <Link to="/" className="flex items-center gap-3 md:gap-4 group">
                <BrandLogo
                    className="h-10 sm:h-12 md:h-14 w-auto max-w-[110px] sm:max-w-[130px] md:max-w-[150px] object-contain group-hover:scale-105 transition-transform duration-500"
                    alt="Logo Elsa Coiffure"
                />

            </Link>

            <div className="flex items-center gap-3 md:gap-6">
                <button className="size-10 rounded-full bg-maroon-dark/5 flex items-center justify-center text-accent-bronze hover:text-primary hover:bg-primary/10 transition-all">
                    <ProtectedIcon translate="no" data-i18n="false">
                        <Bell className="size-5" />
                    </ProtectedIcon>
                </button>
                <div className="h-8 w-px bg-maroon-dark/10 hidden md:block"></div>

                <div className="flex items-center gap-2 md:gap-3 pl-0 md:pl-2">
                    <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white font-bold italic shadow-lg shadow-primary/20 hover:scale-105 transition-transform cursor-pointer">
                        {user?.name?.charAt(0)}
                    </div>
                    <div className="hidden lg:flex flex-col">
                        <span className="font-bold text-[10px] tracking-widest uppercase text-maroon-dark">{user?.name}</span>
                        <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Membre Privilégié</span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="size-10 rounded-full bg-rose-500/5 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                    title="Déconnexion"
                >
                    <ProtectedIcon translate="no" data-i18n="false">
                        <LogOut className="size-4" />
                    </ProtectedIcon>
                </button>
            </div>
        </header>
    );
};

export default ClientHeader;
