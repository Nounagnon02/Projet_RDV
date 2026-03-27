import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Plus, Pencil, Trash2, Loader2, Coins, Clock, X, Sparkles, Package, Scissors } from 'lucide-react';
import { Card, Button, Input } from '../../components/ui';

const ServiceManagement = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        duration: '',
        price: '',
        category: '',
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await api.get('/provider/services');
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/provider/services/${editingId}`, formData);
            } else {
                await api.post('/provider/services', formData);
            }
            fetchServices();
            setEditingId(null);
            setIsAdding(false);
            setFormData({ name: '', description: '', duration: '', price: '', category: '' });
        } catch (error) {
            alert('Erreur: ' + (error.response?.data?.message || 'Une erreur est survenue'));
        }
    };

    const handleEdit = (service) => {
        setEditingId(service.id);
        setFormData({
            name: service.name,
            description: service.description || '',
            duration: service.duration,
            price: service.price,
            category: service.category || '',
        });
        setIsAdding(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;
        try {
            await api.delete(`/provider/services/${id}`);
            fetchServices();
        } catch (error) {
            alert('Erreur lors de la suppression');
        }
    };

    const closeForm = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ name: '', description: '', duration: '', price: '', category: '' });
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-maroon-dark/5 dark:border-white/5 pb-8 animate-fade-in">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Management Console</span>
                        </div>
                        <h1 className="font-display font-medium italic text-maroon-dark dark:text-text-light leading-none" style={{ fontSize: 'var(--text-h2)' }}>
                            Nos Services Signature
                        </h1>
                        <p className="text-accent-bronze mt-4 text-lg font-medium italic">
                            Sublimez votre catalogue avec l'excellence Elsa Coiffure.
                        </p>
                    </div>

                    <Button
                        onClick={() => { setIsAdding(!isAdding); setEditingId(null); }}
                        variant={isAdding ? 'outline' : 'primary'}
                        size="lg"
                        className="h-14 px-8 font-black uppercase text-xs tracking-widest shadow-xl"
                        leftIcon={isAdding ? <X className="size-4" /> : <Plus className="size-4" />}
                    >
                        {isAdding ? 'Annuler' : 'Ajouter un Service'}
                    </Button>
                </div>

                {/* Form */}
                {isAdding && (
                    <Card variant="elevated" className="overflow-hidden p-8 md:p-12 border border-primary/10 animate-fade-in-up shadow-2xl shadow-primary/5 bg-white/80 backdrop-blur-xl">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Scissors className="size-7" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-display font-bold text-maroon-dark italic">
                                    {editingId ? 'Modifier la Prestation' : 'Nouvelle Signature'}
                                </h2>
                                <p className="text-accent-bronze text-sm font-medium italic">Définissez l'excellence de votre prochain service.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black tracking-widest text-maroon-dark uppercase opacity-60 ml-1">Nom du service</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="ex: Tresses Goddess Signature"
                                    leftIcon={<span className="material-symbols-outlined text-sm">auto_awesome</span>}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black tracking-widest text-maroon-dark uppercase opacity-60 ml-1">Catégorie</label>
                                <Input
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="ex: Coiffure Protectrice"
                                    leftIcon={<span className="material-symbols-outlined text-sm">category</span>}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black tracking-widest text-maroon-dark uppercase opacity-60 ml-1">Durée (minutes)</label>
                                <Input
                                    required
                                    type="number"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    placeholder="120"
                                    leftIcon={<Clock className="size-4" />}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black tracking-widest text-maroon-dark uppercase opacity-60 ml-1">Prix (FCFA)</label>
                                <Input
                                    required
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="50000"
                                    leftIcon={<Coins className="size-4" />}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-[10px] font-black tracking-widest text-maroon-dark uppercase opacity-60 ml-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white dark:bg-white/5 border border-maroon-dark/10 rounded-2xl p-6 text-maroon-dark dark:text-text-light placeholder:text-accent-bronze/30 min-h-[160px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium italic"
                                    placeholder="Décrivez l'expérience unique de cette prestation..."
                                />
                            </div>
                            <div className="md:col-span-2 flex gap-6 pt-4">
                                <Button type="button" onClick={closeForm} variant="outline" className="flex-1 h-14 font-black uppercase tracking-widest text-[10px]">
                                    Annuler
                                </Button>
                                <Button type="submit" variant="primary" className="flex-1 h-14 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20">
                                    {editingId ? 'Mettre à jour' : 'Enregistrer la Prestation'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* Services Grid */}
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="size-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <Card
                                key={service.id}
                                variant="elevated"
                                hover
                                className="p-8 group border-t-4 border-t-primary/20 animate-fade-in transition-all duration-500"
                            >
                                <div className="flex items-start justify-between mb-8">
                                    <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 italic">
                                        {service.category || 'Signature'}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="size-10 rounded-full bg-maroon-dark/5 flex items-center justify-center text-accent-bronze hover:text-primary hover:bg-primary/10 transition-all shadow-sm"
                                        >
                                            <Pencil className="size-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="size-10 rounded-full bg-rose-500/5 flex items-center justify-center text-accent-bronze hover:text-rose-500 hover:bg-rose-500/10 transition-all shadow-sm"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-10">
                                    <h3 className="text-2xl font-display font-bold text-maroon-dark dark:text-text-light group-hover:text-primary transition-colors leading-tight italic">
                                        {service.name}
                                    </h3>
                                    <p className="text-accent-bronze text-sm font-medium leading-relaxed line-clamp-2 italic min-h-[44px]">
                                        {service.description || 'Une expérience haut de gamme pensée pour sublimer votre allure unique.'}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-maroon-dark/5 dark:border-white/5">
                                    <div className="flex items-center gap-2 text-accent-bronze">
                                        <Clock className="size-4 text-primary" />
                                        <span className="font-black text-[10px] uppercase tracking-widest">{service.duration} MIN</span>
                                    </div>
                                    {Math.round(service.price).toLocaleString('fr-FR')} FCFA
                                </div>
                            </Card>
                        ))}

                        {services.length === 0 && !isAdding && (
                            <Card variant="light" className="col-span-full border-2 border-dashed border-maroon-dark/10 p-24 text-center rounded-[3rem]">
                                <div className="size-24 rounded-[2rem] bg-accent-cream/50 flex items-center justify-center mx-auto mb-10 text-accent-bronze">
                                    <Package className="size-12" />
                                </div>
                                <h3 className="text-3xl font-display italic font-bold text-maroon-dark mb-4">Une Page Blanche</h3>
                                <p className="text-accent-bronze font-medium italic mb-10 max-w-sm mx-auto">Commencez à bâtir votre excellence en créant vos premières prestations signature.</p>
                                <Button
                                    onClick={() => setIsAdding(true)}
                                    variant="primary"
                                    className="h-16 px-12 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl"
                                >
                                    CREER VOTRE PREMIER SERVICE
                                </Button>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ServiceManagement;
