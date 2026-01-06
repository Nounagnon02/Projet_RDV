import { useState, useEffect } from 'react';
import api from '../api/axios';
import DashboardLayout from '../layouts/DashboardLayout';
import { Plus, Pencil, Trash2, Loader2, Coins, Clock, X, Sparkles, Package } from 'lucide-react';

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
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-fade-in-up">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-5 w-5 text-indigo-400" />
                            <span className="text-sm font-semibold text-indigo-400">Catalogue</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Mes Services</h1>
                        <p className="text-slate-400 mt-2">Gérez les prestations que vous proposez à vos clients.</p>
                    </div>

                    <button
                        onClick={() => { setIsAdding(!isAdding); setEditingId(null); }}
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        {isAdding ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                        {isAdding ? 'Annuler' : 'Ajouter un service'}
                    </button>
                </div>

                {/* Form */}
                {isAdding && (
                    <div className="mb-10 glass-card p-8 animate-fade-in-up">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                <Package className="h-5 w-5 text-indigo-400" />
                            </div>
                            {editingId ? 'Modifier le service' : 'Nouveau service'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300">Nom du service</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-premium"
                                    placeholder="ex: Coupe & Brushing"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300">Catégorie</label>
                                <input
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="input-premium"
                                    placeholder="ex: Coiffure"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300">Durée (minutes)</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                    <input
                                        required
                                        type="number"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="input-premium pl-12"
                                        placeholder="30"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300">Prix (€)</label>
                                <div className="relative">
                                    <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="input-premium pl-12"
                                        placeholder="25.00"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-semibold text-slate-300">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-premium min-h-[120px] pt-4 resize-none"
                                    placeholder="Décrivez votre service..."
                                />
                            </div>
                            <div className="md:col-span-2 flex gap-4">
                                <button type="button" onClick={closeForm} className="btn-secondary flex-1">
                                    Annuler
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    {editingId ? 'Mettre à jour' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Services Grid */}
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, index) => (
                            <div
                                key={service.id}
                                className={`glass-card p-6 group animate-fade-in-up stagger-${(index % 5) + 1}`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-500/20">
                                        {service.category || 'Général'}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="h-9 w-9 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                    {service.name}
                                </h3>
                                <p className="text-slate-500 text-sm mb-6 line-clamp-2 min-h-[40px]">
                                    {service.description || 'Aucune description fournie.'}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Clock className="h-4 w-4 text-indigo-400" />
                                        <span className="font-semibold text-sm">{service.duration} min</span>
                                    </div>
                                    <div className="text-2xl font-black gradient-text-primary">
                                        {service.price}€
                                    </div>
                                </div>
                            </div>
                        ))}

                        {services.length === 0 && !isAdding && (
                            <div className="col-span-full glass-card border-2 border-dashed border-slate-800 p-12 text-center">
                                <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-4">
                                    <Package className="h-8 w-8 text-slate-700" />
                                </div>
                                <p className="text-slate-500 font-medium">Aucun service créé pour le moment.</p>
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="mt-4 text-indigo-400 font-semibold hover:text-indigo-300"
                                >
                                    Créer votre premier service →
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ServiceManagement;
