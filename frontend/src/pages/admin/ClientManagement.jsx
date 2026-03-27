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
    Download,
    Loader2,
    MessageCircle,
    X
} from 'lucide-react';

const ClientManagement = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddingClient, setIsAddingClient] = useState(false);
    const [newClientData, setNewClientData] = useState({
        name: '',
        email: '',
        phone: '',
        hairType: '',
        porosity: ''
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await api.get('/provider/clients');
            setClients(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching clients', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClient = async (e) => {
        e.preventDefault();
        try {
            await api.post('/provider/clients', newClientData);
            setIsAddingClient(false);
            setNewClientData({ name: '', email: '', phone: '', hairType: '', porosity: '' });
            fetchClients();
            alert('Client créé avec succès !');
        } catch (error) {
            alert('Erreur: ' + (error.response?.data?.message || 'Erreur lors de la création'));
        }
    };

    const downloadCSV = () => {
        const headers = ['Nom', 'Email', 'Téléphone', 'Type Cheveux', 'Porosité', 'Points', 'Niveau', 'Dernière Visite'];
        const csvContent = [
            headers.join(','),
            ...filteredClients.map(c => [
                `"${c.name}"`,
                `"${c.email}"`,
                `"${c.phone}"`,
                `"${c.hairType}"`,
                `"${c.porosity}"`,
                c.points,
                `"${c.tier}"`,
                `"${c.lastVisit}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `clients_elsa_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-maroon-dark/5 dark:border-white/5 pb-8 animate-fade-in">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Directory</span>
                        </div>
                        <h1 className="font-display font-medium italic text-maroon-dark dark:text-text-light leading-none" style={{ fontSize: 'var(--text-h2)' }}>
                            Fichier Clients
                        </h1>
                        <p className="text-accent-bronze mt-4 text-lg font-medium italic">
                            Éditez et gérez les profils capillaires de votre communauté d'exception.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            onClick={downloadCSV}
                            variant="outline"
                            size="lg"
                            className="h-14 px-8 font-black uppercase text-[10px] tracking-widest"
                            leftIcon={<Download className="size-4" />}
                        >
                            Exporter CSV
                        </Button>
                        <Button
                            onClick={() => setIsAddingClient(true)}
                            variant="primary"
                            size="lg"
                            className="h-14 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl"
                            leftIcon={<UserPlus className="size-4" />}
                        >
                            Nouveau Client
                        </Button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-6 items-center p-2 rounded-3xl bg-white/50 backdrop-blur-xl border border-maroon-dark/5 shadow-2xl shadow-maroon-dark/5">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-accent-bronze" />
                        <Input
                            className="pl-14 bg-white /20 h-16 text-sm border-transparent focus:border-primary transition-all rounded-2xl"
                            placeholder="Rechercher par nom ou email d'exception..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-16 px-10 rounded-2xl border-maroon-dark/5 bg-white group hover:border-primary transition-all" leftIcon={<Filter className="size-4 group-hover:text-primary" />}>
                        <span className="text-[10px] font-black uppercase tracking-widest">Filtres Avancés</span>
                    </Button>
                </div>

                {/* Clients Table / Cards */}
                <div className="grid grid-cols-1 gap-6">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="size-10 animate-spin text-primary" />
                        </div>
                    ) : filteredClients.length > 0 ? (
                        filteredClients.map((client) => (
                            <Card key={client.id} hover variant="elevated" className="p-0 overflow-hidden border border-maroon-dark/5 group transition-all duration-700 shadow-xl shadow-maroon-dark/5">
                                <div className="flex flex-col md:flex-row md:items-stretch">
                                    {/* Client Avatar & Basic info */}
                                    <div className="p-8 md:w-1/4 border-b md:border-b-0 md:border-r border-maroon-dark/5 bg-maroon-dark/5 dark:bg-white/5 flex flex-col items-center text-center justify-center">
                                        <div className="size-20 rounded-full bg-white flex items-center justify-center shadow-luxury mb-4 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                                            <span className="text-3xl font-display font-black text-primary italic leading-none">{client.name.charAt(0)}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-maroon-dark dark:text-text-light mb-2">{client.name}</h3>
                                        <div className="px-4 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.2em] italic border border-primary/20">
                                            {client.tier} Member
                                        </div>
                                    </div>

                                    {/* Contact & Loyalty */}
                                    <div className="p-10 flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-accent-bronze">Coordonnées</p>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3 text-sm font-medium italic text-maroon-dark">
                                                    <Mail className="size-4 text-primary" />
                                                    {client.email}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm font-medium italic text-maroon-dark">
                                                    <Phone className="size-4 text-primary" />
                                                    {client.phone}
                                                    {client.phone && (
                                                        <a
                                                            href={`https://wa.me/${client.phone.replace(/\D/g, '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="ml-2 size-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                                            title="Chat on WhatsApp"
                                                        >
                                                            <MessageCircle className="size-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-accent-bronze">Activité & Fidélité</p>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3 text-sm font-bold italic text-maroon-dark">
                                                    <Calendar className="size-4 text-primary" />
                                                    Dernier RDV: {client.lastVisit}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm font-bold italic text-maroon-dark">
                                                    <Star className="size-4 text-primary" />
                                                    {client.points} Points Royal
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Diagnostique</p>
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                <span className="px-3 py-1.5 bg-maroon-dark/5 dark:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-tighter border border-maroon-dark/5">
                                                    Type {client.hairType}
                                                </span>
                                                <span className="px-3 py-1.5 bg-maroon-dark/5 dark:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-tighter border border-maroon-dark/5 italic">
                                                    Porosité {client.porosity}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="p-8 md:w-[100px] flex items-center justify-center border-t md:border-t-0 md:border-l border-maroon-dark/5 bg-maroon-dark/[0.02] group-hover:bg-primary transition-all duration-500">
                                        <button className="size-14 rounded-full bg-white flex items-center justify-center text-maroon-dark group-hover:scale-110 transition-transform shadow-lg group-hover:text-primary">
                                            <ChevronRight className="size-6" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="py-20 text-center text-maroon-dark/50 dark:text-white/50">
                            No clients found.
                        </div>
                    )}
                </div>

                {/* New Client Modal */}
                {isAddingClient && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-maroon-dark/60 backdrop-blur-md animate-fade-in">
                        <Card className="w-full max-w-lg p-10 relative shadow-2xl bg-white dark:bg-background-dark border border-primary/20 animate-fade-in-up">
                            <button
                                onClick={() => setIsAddingClient(false)}
                                className="absolute top-6 right-6 text-accent-bronze hover:text-primary transition-colors"
                            >
                                <X className="size-6" />
                            </button>

                            <div className="mb-8">
                                <h2 className="text-3xl font-display font-medium italic text-maroon-dark dark:text-text-light">Nouveau Client</h2>
                                <p className="text-accent-bronze text-sm font-medium mt-1 uppercase tracking-widest">Enregistrez un nouvel ambassadeur.</p>
                            </div>

                            <form onSubmit={handleCreateClient} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-accent-bronze">Nom Complet</label>
                                    <Input
                                        required
                                        placeholder="ex: Jean Dupont"
                                        value={newClientData.name}
                                        onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-accent-bronze">Email</label>
                                    <Input
                                        required
                                        type="email"
                                        placeholder="jean@exemple.com"
                                        value={newClientData.email}
                                        onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-accent-bronze">Téléphone</label>
                                    <Input
                                        required
                                        placeholder="+225 00000000"
                                        value={newClientData.phone}
                                        onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-accent-bronze">Type Cheveux</label>
                                        <Input
                                            placeholder="ex: 4C"
                                            value={newClientData.hairType}
                                            onChange={(e) => setNewClientData({ ...newClientData, hairType: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-accent-bronze">Porosité</label>
                                        <Input
                                            placeholder="ex: High"
                                            value={newClientData.porosity}
                                            onChange={(e) => setNewClientData({ ...newClientData, porosity: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1 h-14 uppercase font-black text-[10px] tracking-widest"
                                        onClick={() => setIsAddingClient(false)}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="flex-1 h-14 uppercase font-black text-[10px] tracking-widest shadow-xl shadow-primary/20"
                                    >
                                        Créer le profil
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ClientManagement;
