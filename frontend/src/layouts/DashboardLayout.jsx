import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
    Settings,
    Bell
} from 'lucide-react';
import { useState } from 'react';

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Services', path: '/dashboard/services', icon: Scissors },
        { name: 'Disponibilités', path: '/dashboard/availabilities', icon: Clock },
        { name: 'Agenda', path: '/dashboard/agenda', icon: Calendar },
        { name: 'Clients', path: '/dashboard/clients', icon: Users },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 right-4 z-50 h-12 w-12 rounded-xl glass-card flex items-center justify-center text-slate-400 lg:hidden"
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex h-full flex-col bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/50">
                    {/* Logo */}
                    <div className="flex h-20 items-center px-6 border-b border-slate-800/50">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                                <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <span className="text-lg font-bold text-white tracking-tight">E-appointment</span>
                                <p className="text-[10px] text-slate-500 font-medium">Dashboard</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto scrollbar-hide">
                        <p className="px-3 mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-600">Menu Principal</p>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`
                    group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all
                    ${isActive
                                            ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-white border border-indigo-500/20'
                                            : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}
                  `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ${isActive ? 'bg-indigo-500/20' : 'bg-slate-900 group-hover:bg-slate-800'
                                            }`}>
                                            <item.icon className={`h-[18px] w-[18px] ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                        </div>
                                        {item.name}
                                    </div>
                                    {isActive && <ChevronRight className="h-4 w-4 text-indigo-400" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="border-t border-slate-800/50 p-4">
                        <div className="mb-4 flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-900/50">
                            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                                {user?.avatar ? (
                                    <img src={user.avatar} className="h-full w-full object-cover" alt={user.name} />
                                ) : (
                                    <span className="text-lg font-bold text-slate-400">{user?.name?.charAt(0)}</span>
                                )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
                                <p className="truncate text-xs text-slate-500">{user?.email}</p>
                            </div>
                            <button className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-700 transition-all">
                                <Bell className="h-4 w-4" />
                            </button>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all"
                        >
                            <div className="h-9 w-9 rounded-lg bg-slate-900 flex items-center justify-center group-hover:bg-rose-500/20 transition-all">
                                <LogOut className="h-4 w-4 text-slate-500 group-hover:text-rose-400" />
                            </div>
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

export default DashboardLayout;
