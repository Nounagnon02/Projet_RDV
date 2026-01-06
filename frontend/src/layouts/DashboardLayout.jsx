import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Settings,
    Clock,
    Calendar,
    Users,
    LogOut,
    Menu,
    X,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Services', path: '/dashboard/services', icon: Settings },
        { name: 'Disponibilités', path: '/dashboard/availabilities', icon: Clock },
        { name: 'Agenda', path: '/dashboard/agenda', icon: Calendar },
        { name: 'Clients', path: '/dashboard/clients', icon: Users },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-slate-950">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 right-4 z-50 rounded-lg bg-slate-900 p-2 text-slate-400 lg:hidden"
            >
                {isOpen ? <X /> : <Menu />}
            </button>

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-800 bg-slate-950 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex h-full flex-col">
                    <div className="flex h-20 items-center border-bottom border-slate-800 px-8">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20">
                                <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">RDV Pro</span>
                        </Link>
                    </div>

                    <nav className="flex-1 space-y-1 px-4 py-8">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`
                    group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition-all
                    ${isActive
                                            ? 'bg-indigo-600/10 text-indigo-400 shadow-inner shadow-indigo-500/10'
                                            : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}
                  `}
                                >
                                    <div className="flex items-center gap-4">
                                        <item.icon className={`h-5 w-5 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                        {item.name}
                                    </div>
                                    {isActive && <ChevronRight className="h-4 w-4" />}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto border-t border-slate-800 p-4">
                        <div className="mb-6 flex items-center gap-4 px-4">
                            <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                                {user?.avatar ? <img src={user.avatar} className="h-full w-full object-cover" /> : <Users className="text-slate-500" />}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
                                <p className="truncate text-xs text-slate-500">{user?.email}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="group flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10"
                        >
                            <LogOut className="h-5 w-5 text-red-500/70 group-hover:text-red-400" />
                            Se déconnecter
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-4 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Sidebar;
