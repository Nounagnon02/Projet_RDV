import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Card, Button, Input } from '../../components/ui';
import {
    Search,
    Filter,
    MoreVertical,
    Mail,
    Phone,
    Calendar,
    Star,
    ChevronRight,
    UserPlus,
    Download
} from 'lucide-react';

const ClientManagement = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            // Mocking data for now as backend might need expansion
            // In a real app: const response = await api.get('/admin/clients');
            setLoading(true);
            const mockClients = [
                {
                    id: 1,
                    name: 'Aaliyah Johnson',
                    email: 'aaliyah.j@example.com',
                    phone: '+33 6 12 34 56 78',
                    lastVisit: '2024-10-12',
                    totalVisits: 14,
                    tier: 'Platinum',
                    points: 2450,
                    hairType: '4C',
                    porosity: 'Medium'
                },
                {
                    id: 2,
                    name: 'Zoe Kravitz',
                    email: 'zoe.k@example.com',
                    phone: '+33 7 98 76 54 32',
                    lastVisit: '2024-09-28',
                    totalVisits: 8,
                    tier: 'Gold',
                    points: 1200,
                    hairType: '3C',
                    porosity: 'High'
                },
                {
                    id: 3,
                    name: 'Imani Williams',
                    email: 'imani.w@example.com',
                    phone: '+33 6 55 44 33 22',
                    lastVisit: '2024-10-05',
                    totalVisits: 3,
                    tier: 'Regular',
                    points: 450,
                    hairType: '4B',
                    porosity: 'Low'
                }
            ];
            setClients(mockClients);
        } catch (error) {
            console.error('Error fetching clients', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-maroon-dark/5 dark:border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Directory</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-medium italic text-maroon-dark dark:text-text-light leading-none">
                            Fichier Clients
                        </h1>
                        <p className="text-accent-bronze mt-4 text-sm font-medium">
                            Gérez votre base de clients et leurs profils capillaires.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="secondary" size="sm" leftIcon={<Download className="size-4" />}>
                            Exporter CSV
                        </Button>
                        <Button variant="primary" size="sm" leftIcon={<UserPlus className="size-4" />}>
                            Nouveau Client
                        </Button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 items-center bg-white/50 dark:bg-white/5 p-4 rounded-2xl border border-maroon-dark/5 dark:border-white/5 shadow-sm">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-accent-bronze" />
                        <Input
                            className="pl-12 bg-white dark:bg-maroon-dark/20"
                            placeholder="Rechercher par nom ou email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="sm" className="w-full md:w-auto" leftIcon={<Filter className="size-4" />}>
                        Filtres Avancés
                    </Button>
                </div>

                {/* Clients Table / Cards */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="size-10 animate-spin text-primary" />
                        </div>
                    ) : filteredClients.length > 0 ? (
                        filteredClients.map((client) => (
                            <Card key={client.id} variant="elevated" className="p-0 overflow-hidden border border-maroon-dark/5 dark:border-white/5 group hover:shadow-lg transition-all">
                                <div className="flex flex-col md:flex-row md:items-center">
                                    {/* Client Avatar & Basic info */}
                                    <div className="p-6 md:w-1/4 border-b md:border-b-0 md:border-r border-maroon-dark/5 dark:border-white/5 bg-maroon-dark/5 dark:bg-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="size-14 rounded-full bg-primary/20 border-2 border-primary/20 flex items-center justify-center shrink-0">
                                                <span className="text-2xl font-display font-bold text-primary italic">{client.name.charAt(0)}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-maroon-dark dark:text-text-light truncate">{client.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${client.tier === 'Platinum' ? 'bg-primary text-white' :
                                                        client.tier === 'Gold' ? 'bg-accent-bronze text-white' :
                                                            'bg-accent-cream text-maroon-dark'
                                                        }`}>
                                                        {client.tier}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact & Loyalty */}
                                    <div className="p-6 flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs font-bold text-accent-bronze">
                                                <Mail className="size-3.5 text-primary" />
                                                {client.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-accent-bronze">
                                                <Phone className="size-3.5 text-primary" />
                                                {client.phone}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs font-bold text-accent-bronze">
                                                <Calendar className="size-3.5 text-primary" />
                                                Dernier RDV: {client.lastVisit}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-accent-bronze">
                                                <Star className="size-3.5 text-primary" />
                                                {client.points} points
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                                                Profil Capillaire
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="px-2 py-0.5 bg-maroon-dark/5 dark:bg-white/5 rounded text-[10px] font-bold border border-maroon-dark/5 dark:border-white/5">
                                                    Type {client.hairType}
                                                </span>
                                                <span className="px-2 py-0.5 bg-maroon-dark/5 dark:bg-white/5 rounded text-[10px] font-bold border border-maroon-dark/5 dark:border-white/5">
                                                    {client.porosity} Porosity
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="p-6 md:w-[60px] flex items-center justify-center border-t md:border-t-0 md:border-l border-maroon-dark/5 dark:border-white/5">
                                        <button className="size-10 rounded-full hover:bg-primary/10 flex items-center justify-center text-accent-bronze hover:text-primary transition-all group-hover:scale-110">
                                            <ChevronRight className="size-5" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white/30 dark:bg-white/5 rounded-3xl border-2 border-dashed border-maroon-dark/5 dark:border-white/5">
                            <Users className="size-12 mx-auto text-accent-cream mb-4" />
                            <p className="text-accent-bronze font-bold">Aucun client trouvé pour votre recherche.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ClientManagement;
