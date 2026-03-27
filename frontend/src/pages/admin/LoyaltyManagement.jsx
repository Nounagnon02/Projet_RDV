import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Card, Button, Input } from '../../components/ui';
import api from '../../api/axios';
import {
    Star,
    Gift,
    Clock,
    User,
    ChevronRight,
    TrendingUp,
    Zap,
    Crown,
    Plus,
    Tag,
    X,
    ArrowRight
} from 'lucide-react';

const LoyaltyManagement = () => {
    const [offers, setOffers] = useState([]);
    const [stats, setStats] = useState({
        engagementRate: 0,
        vipClients: 0,
        totalPoints: '0k',
        pointsExpiring: '0k'
    });
    const [loading, setLoading] = useState(true);
    const [isAddingOffer, setIsAddingOffer] = useState(false);
    const [newOfferData, setNewOfferData] = useState({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        expires_at: ''
    });
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [viewingStats, setViewingStats] = useState(null);
    const [isAddingPoints, setIsAddingPoints] = useState(false);
    const [bonusPointsData, setBonusPointsData] = useState({
        client_id: '',
        points: '',
        description: ''
    });
    const [clients, setClients] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, offersRes, clientsRes] = await Promise.all([
                api.get('/provider/loyalty/stats'),
                api.get('/provider/loyalty/offers'),
                api.get('/provider/clients')
            ]);
            setStats(statsRes.data);
            setOffers(offersRes.data);
            setClients(clientsRes.data);
        } catch (error) {
            console.error('Error fetching loyalty data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateOffer = async (e) => {
        e.preventDefault();
        try {
            await api.post('/provider/loyalty/offers', newOfferData);
            setIsAddingOffer(false);
            setNewOfferData({ code: '', discount_type: 'percentage', discount_value: '', expires_at: '' });
            fetchData();
            alert('Offre créée avec succès !');
        } catch (error) {
            alert('Erreur: ' + (error.response?.data?.message || 'Erreur lors de la création'));
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-maroon-dark/5 dark:border-white/5 pb-8 animate-fade-in">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Client Rewards</span>
                        </div>
                        <h1 className="font-display font-medium italic text-maroon-dark dark:text-text-light leading-none" style={{ fontSize: 'var(--text-h2)' }}>
                            Fidélité & Offres
                        </h1>
                        <p className="text-accent-bronze mt-4 text-lg font-medium italic">
                            Récompensez l'engagement et cultivez l'excellence de votre communauté.
                        </p>
                    </div>

                    <Button
                        variant="primary"
                        size="lg"
                        className="h-14 px-8 font-black uppercase text-xs tracking-widest shadow-xl flex items-center gap-2"
                        leftIcon={<Plus className="size-4" />}
                        onClick={() => setIsAddingOffer(true)}
                    >
                        Créer une Offre
                    </Button>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card variant="light" className="p-8 border-l-4 border-l-primary relative overflow-hidden group">
                        <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                            <TrendingUp className="size-40" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-accent-bronze mb-2">Taux d'Engagement</p>
                        <h4 className="text-4xl font-display font-black text-maroon-dark dark:text-text-light">{stats.engagementRate}%</h4>
                        <div className="mt-4 flex items-center gap-2 text-emerald-500 font-bold text-xs italic">
                            <TrendingUp className="size-4" /> Basé sur les visites récurrentes
                        </div>
                    </Card>

                    <Card variant="light" className="p-8 border-l-4 border-l-accent-bronze relative overflow-hidden group">
                        <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                            <Crown className="size-40" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-accent-bronze mb-2">Clients VIP</p>
                        <h4 className="text-4xl font-display font-black text-maroon-dark dark:text-text-light">{stats.vipClients}</h4>
                        <div className="mt-4 flex items-center gap-2 text-primary font-bold text-xs italic">
                            <Star className="size-4" /> Statut Gold & Platinum
                        </div>
                    </Card>

                    <Card variant="light" className="p-8 border-l-4 border-l-primary relative overflow-hidden group">
                        <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                            <Zap className="size-40" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-accent-bronze mb-2">Points Distribués</p>
                        <h4 className="text-4xl font-display font-black text-maroon-dark dark:text-text-light">{stats.totalPoints}</h4>
                        <div className="mt-4 flex items-center gap-2 text-accent-bronze font-bold text-xs italic">
                            <Clock className="size-4" /> Total cumulé
                        </div>
                    </Card>
                </div>

                {/* Active Offers */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-maroon-dark/5 pb-4">
                        <h2 className="text-2xl font-display font-bold text-maroon-dark dark:text-text-light italic">Campagnes Actives</h2>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">En direct</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {offers.length === 0 ? (
                            <div className="col-span-2 py-12 text-center text-accent-bronze italic border-2 border-dashed border-maroon-dark/5 rounded-2xl">
                                Aucune offre active pour le moment.
                            </div>
                        ) : (
                            offers.map((offer) => (
                                <Card key={offer.id} hover variant="elevated" className="p-0 overflow-hidden group flex border border-maroon-dark/5">
                                    <div className="w-4 bg-maroon-dark shrink-0 transition-colors group-hover:bg-primary"></div>
                                    <div className="p-8 flex-1">
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-primary italic">{offer.type}</span>
                                                <h3 className="text-2xl font-display font-bold text-maroon-dark dark:text-text-light italic mt-1">{offer.title}</h3>
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                                {offer.status}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-6 mb-8">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-accent-bronze mb-1">Avantage</p>
                                                <p className="font-bold text-maroon-dark">{offer.discount}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-accent-bronze mb-1">Validité</p>
                                                <p className="font-bold text-maroon-dark">{offer.validUntil}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-accent-bronze mb-1">Cible</p>
                                                <p className="font-bold text-maroon-dark">Générique</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-3 pt-6 border-t border-maroon-dark/5">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-10 text-[9px] font-black uppercase tracking-widest"
                                                onClick={() => setSelectedOffer(offer)}
                                            >
                                                Détails
                                            </Button>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="h-10 text-[9px] font-black uppercase tracking-widest"
                                                rightIcon={<ArrowRight className="size-3" />}
                                                onClick={() => setViewingStats(offer)}
                                            >
                                                Statistiques
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Rewards Grid */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-display font-bold text-maroon-dark dark:text-text-light italic">Récompenses Instantanées</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: 'Points Bonus', icon: Star, desc: 'Créditer des points manually', action: () => setIsAddingPoints(true) },
                            { title: 'Coupon Privé', icon: Tag, desc: 'Générer un code unique', action: () => setIsAddingOffer(true) },
                            { title: 'Cadeau Service', icon: Gift, desc: 'Offrir un soin complémentaire', action: () => alert('Bientôt disponible') },
                            { title: 'Accès VIP', icon: Crown, desc: 'Surclasser un profil', action: () => alert('Bientôt disponible') }
                        ].map((item, idx) => (
                            <Card
                                key={idx}
                                hover
                                variant="light"
                                className="p-6 text-center group cursor-pointer border border-transparent hover:border-primary/20"
                                onClick={item.action}
                            >
                                <div className="size-14 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <item.icon className="size-6 text-primary" />
                                </div>
                                <h4 className="font-bold text-maroon-dark mb-1">{item.title}</h4>
                                <p className="text-[10px] italic text-accent-bronze font-medium leading-tight">{item.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal - Détails Offre */}
            {selectedOffer && (
                <div className="fixed inset-0 bg-maroon-dark/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <Card variant="light" className="w-full max-w-md p-0 overflow-hidden animate-in fade-in zoom-in duration-300 shadow-2xl border-none">
                        <div className="bg-gradient-to-r from-maroon-dark to-maroon p-6 flex justify-between items-center text-white relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Tag className="size-24" />
                            </div>
                            <h3 className="text-xl font-display italic font-bold z-10">Détails de l'Offre</h3>
                            <button onClick={() => setSelectedOffer(null)} className="hover:bg-white/20 p-2 rounded-xl transition-all z-10">
                                <X className="size-6" />
                            </button>
                        </div>
                        <div className="p-8 space-y-8 bg-accent-cream/30">
                            <div className="p-6 bg-white dark:bg-maroon-dark/40 rounded-2xl shadow-sm border border-maroon-dark/5">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-bronze/60 mb-2">Titre de la campagne</p>
                                <p className="text-2xl font-display font-bold text-maroon-dark dark:text-text-light italic">{selectedOffer.title}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-5 bg-white dark:bg-maroon-dark/40 rounded-2xl shadow-sm border border-maroon-dark/5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-bronze/60 mb-2">Avantage</p>
                                    <p className="text-xl font-bold text-primary">{selectedOffer.discount}</p>
                                </div>
                                <div className="p-5 bg-white dark:bg-maroon-dark/40 rounded-2xl shadow-sm border border-maroon-dark/5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-bronze/60 mb-2">Validité</p>
                                    <p className="text-xl font-bold text-maroon-dark dark:text-text-light">{selectedOffer.validUntil}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Statut actuel</p>
                                <span className="px-4 py-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                                    {selectedOffer.status}
                                </span>
                            </div>

                            <Button variant="primary" className="w-full h-14 font-black uppercase tracking-widest" onClick={() => setSelectedOffer(null)}>
                                Fermer le volet
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Modal - Statistiques Offre */}
            {viewingStats && (
                <div className="fixed inset-0 bg-maroon-dark/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <Card variant="light" className="w-full max-w-md p-0 overflow-hidden animate-in fade-in zoom-in duration-300 shadow-2xl border-none">
                        <div className="bg-gradient-to-r from-accent-bronze to-accent-bronze/80 p-6 flex justify-between items-center text-white relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <TrendingUp className="size-24" />
                            </div>
                            <h3 className="text-xl font-display italic font-bold z-10">Analyses de Campagne</h3>
                            <button onClick={() => setViewingStats(null)} className="hover:bg-white/20 p-2 rounded-xl transition-all z-10">
                                <X className="size-6" />
                            </button>
                        </div>
                        <div className="p-8 space-y-8 bg-accent-cream/30">
                            <div className="text-center">
                                <h4 className="text-lg font-bold text-maroon-dark dark:text-text-light italic">{viewingStats.title}</h4>
                                <div className="w-12 h-1 bg-accent-bronze/20 mx-auto mt-2 rounded-full"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 bg-white dark:bg-maroon-dark/40 rounded-3xl text-center border border-maroon-dark/5 shadow-premium">
                                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-accent-bronze/60 mb-2">Utilisations</p>
                                    <p className="text-4xl font-display font-black text-maroon-dark dark:text-text-light">0</p>
                                </div>
                                <div className="p-6 bg-white dark:bg-maroon-dark/40 rounded-3xl text-center border border-maroon-dark/5 shadow-premium">
                                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-accent-bronze/60 mb-2">Économies</p>
                                    <p className="text-4xl font-display font-black text-primary">0€</p>
                                </div>
                            </div>

                            <div className="p-6 bg-maroon-dark/5 rounded-2xl text-center border border-dashed border-maroon-dark/10">
                                <p className="text-xs italic text-accent-bronze font-medium leading-relaxed">
                                    Les données historiques détaillées seront disponibles dès les premières utilisations du coupon en caisse.
                                </p>
                            </div>

                            <Button variant="outline" className="w-full h-14 font-black uppercase tracking-widest border-2" onClick={() => setViewingStats(null)}>
                                Retour au tableau
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Modal - Points Bonus */}
            {isAddingPoints && (
                <div className="fixed inset-0 bg-maroon-dark/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <Card variant="light" className="w-full max-w-lg p-0 overflow-hidden animate-in fade-in zoom-in duration-300 shadow-2xl border-none">
                        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 flex justify-between items-center text-white relative">
                            <div className="absolute top-0 left-0 p-4 opacity-10">
                                <Star className="size-24" />
                            </div>
                            <h3 className="text-xl font-display italic font-bold z-10">Attribuer des Points</h3>
                            <button onClick={() => setIsAddingPoints(false)} className="hover:bg-white/20 p-2 rounded-xl transition-all z-10">
                                <X className="size-6" />
                            </button>
                        </div>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    await api.post('/provider/loyalty/bonus-points', bonusPointsData);
                                    setIsAddingPoints(false);
                                    setBonusPointsData({ client_id: '', points: '', description: '' });
                                    fetchData();
                                    alert('Points attribués avec succès !');
                                } catch (error) {
                                    alert('Erreur: ' + (error.response?.data?.message || 'Erreur lors de l\'attribution'));
                                }
                            }}
                            className="p-8 space-y-6 bg-accent-cream/30"
                        >
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark mb-2">Client bénéficiaire</label>
                                    <select
                                        className="w-full h-14 bg-white text-maroon-dark border-2 border-maroon-dark/10 rounded-2xl px-5 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                        value={bonusPointsData.client_id}
                                        onChange={(e) => setBonusPointsData({ ...bonusPointsData, client_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Sélectionner un membre...</option>
                                        {clients.map(client => (
                                            <option key={client.id} value={client.id}>{client.name} • {client.phone}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark mb-2">Nombre de points</label>
                                        <input
                                            type="number"
                                            placeholder="Ex: 50"
                                            value={bonusPointsData.points}
                                            onChange={(e) => setBonusPointsData({ ...bonusPointsData, points: e.target.value })}
                                            className="w-full h-14 bg-white text-maroon-dark placeholder:text-maroon-dark/40 border-2 border-maroon-dark/10 rounded-2xl px-5 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark mb-2">Motif du geste</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Commande retardée"
                                            value={bonusPointsData.description}
                                            onChange={(e) => setBonusPointsData({ ...bonusPointsData, description: e.target.value })}
                                            className="w-full h-14 bg-white text-maroon-dark placeholder:text-maroon-dark/40 border-2 border-maroon-dark/10 rounded-2xl px-5 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button type="button" variant="outline" className="flex-1 h-14 font-black uppercase tracking-widest border-2" onClick={() => setIsAddingPoints(false)}>
                                    Annuler
                                </Button>
                                <Button type="submit" variant="primary" className="flex-1 h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                                    Confirmer
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {/* Modal - Nouveau Voucher */}
            {isAddingOffer && (
                <div className="fixed inset-0 bg-maroon-dark/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <Card variant="light" className="w-full max-w-lg p-0 overflow-hidden animate-in fade-in zoom-in duration-300 shadow-2xl border-none">
                        <div className="bg-gradient-to-r from-primary to-maroon p-6 flex justify-between items-center text-white relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Plus className="size-24" />
                            </div>
                            <h3 className="text-xl font-display italic font-bold z-10">Nouvelle Offre Exclusive</h3>
                            <button onClick={() => setIsAddingOffer(false)} className="hover:bg-white/20 p-2 rounded-xl transition-all z-10">
                                <X className="size-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateOffer} className="p-8 space-y-6 bg-accent-cream/30">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark mb-2">Code de la Campagne</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: GOLDEN_SUMMER"
                                        value={newOfferData.code}
                                        onChange={(e) => setNewOfferData({ ...newOfferData, code: e.target.value })}
                                        className="w-full h-14 bg-white text-maroon-dark placeholder:text-maroon-dark/40 border-2 border-maroon-dark/10 rounded-2xl px-5 text-sm font-medium uppercase font-mono focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark mb-2">Type de remise</label>
                                        <select
                                            className="w-full h-14 bg-white text-maroon-dark border-2 border-maroon-dark/10 rounded-2xl px-5 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all cursor-pointer"
                                            value={newOfferData.discount_type}
                                            onChange={(e) => setNewOfferData({ ...newOfferData, discount_type: e.target.value })}
                                        >
                                            <option value="percentage">Pourcentage (%)</option>
                                            <option value="fixed">Montant Fixe (€)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark mb-2">Valeur de l'avantage</label>
                                        <input
                                            type="number"
                                            placeholder="Ex: 25"
                                            value={newOfferData.discount_value}
                                            onChange={(e) => setNewOfferData({ ...newOfferData, discount_value: e.target.value })}
                                            className="w-full h-14 bg-white text-maroon-dark placeholder:text-maroon-dark/40 border-2 border-maroon-dark/10 rounded-2xl px-5 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark mb-2">Fin de validité</label>
                                    <input
                                        type="date"
                                        className="w-full h-14 bg-white text-maroon-dark border-2 border-maroon-dark/10 rounded-2xl px-5 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                                        value={newOfferData.expires_at}
                                        onChange={(e) => setNewOfferData({ ...newOfferData, expires_at: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button type="button" variant="outline" className="flex-1 h-14 font-black uppercase tracking-widest border-2" onClick={() => setIsAddingOffer(false)}>
                                    Annuler
                                </Button>
                                <Button type="submit" variant="primary" className="flex-1 h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                                    Lancer l'offre
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </DashboardLayout>
    );
};

export default LoyaltyManagement;
