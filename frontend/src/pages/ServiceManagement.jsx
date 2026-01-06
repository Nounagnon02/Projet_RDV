import { useState, useEffect } from 'react';
import api from '../api/axios';
import DashboardLayout from '../layouts/DashboardLayout';
import { Plus, Pencil, Trash2, Check, X, Loader2, Coins, Clock } from 'lucide-react';

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

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Mes Services</h1>
                        <p className="text-slate-400 mt-1">Gérez les prestations que vous proposez à vos clients.</p>
                    </div>

                    <button
                        onClick={() => { setIsAdding(!isAdding); setEditingId(null); }}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 active:scale-95"
                    >
                        {isAdding ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                        {isAdding ? 'Annuler' : 'Ajouter un service'}
                    </button>
                </div>

                {isAdding && (
                    <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 animate-in slide-in-from-top duration-300">
                        <h2 className="text-xl font-bold text-white mb-6">
                            {editingId ? 'Modifier le service' : 'Ajouter un nouveau service'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Nom du service</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 text-slate-200 outline-none focus:border-indigo-500"
                                    placeholder="ex: Coupe & Brushing"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Catégorie</label>
                                <input
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 text-slate-200 outline-none focus:border-indigo-500"
                                    placeholder="ex: Coiffure"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Durée (minutes)</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                    <input
                                        required
                                        type="number"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="h-12 w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 text-slate-200 outline-none focus:border-indigo-500"
                                        placeholder="30"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Prix (€)</label>
                                <div className="relative">
                                    <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="h-12 w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 text-slate-200 outline-none focus:border-indigo-500"
                                        placeholder="25.00"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-slate-300">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-200 outline-none focus:border-indigo-500 min-h-[100px]"
                                    placeholder="Décrivez votre service..."
                                />
                            </div>
                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    className="w-full rounded-xl bg-indigo-600 h-12 font-bold text-white transition hover:bg-indigo-700"
                                >
                                    {editingId ? 'Mettre à jour' : 'Enregistrer le service'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/5 shadow-inner shadow-white/5"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="px-3 py-1 rounded-full bg-indigo-600/10 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                                        {service.category || 'Général'}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:text-red-300 transition"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                                <p className="text-slate-400 text-sm mb-6 line-clamp-2">{service.description || 'Aucune description fournie.'}</p>

                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-800/50">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Clock className="h-4 w-4 text-indigo-400" />
                                        <span className="font-medium">{service.duration} min</span>
                                    </div>
                                    <div className="text-2xl font-black text-indigo-400">
                                        {service.price}€
                                    </div>
                                </div>
                            </div>
                        ))}

                        {services.length === 0 && !isAdding && (
                            <div className="col-span-full rounded-2xl border border-dashed border-slate-800 p-12 text-center">
                                <p className="text-slate-500">Aucun service créé pour le moment.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ServiceManagement;
