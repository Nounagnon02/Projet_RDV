import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Card, Button, Input } from '../../components/ui';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Package,
    Tag,
    DollarSign,
    Layers,
    AlertTriangle,
    CheckCircle2,
    Eye,
    TrendingUp,
    Loader2,
    X,
    Sparkles,
    Image as ImageIcon,
    Upload
} from 'lucide-react';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        hairGoal: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const STORAGE_URL = 'http://localhost:8000/storage/';

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products');
            const productData = response.data.data ? response.data.data : response.data;
            setProducts(productData);
        } catch (error) {
            console.error('Error fetching products', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('name', formData.name);
            formDataToSubmit.append('description', formData.description);
            formDataToSubmit.append('price', formData.price);
            formDataToSubmit.append('stock', formData.stock);
            formDataToSubmit.append('category', formData.category);
            formDataToSubmit.append('hair_goal', formData.hairGoal);

            if (imageFile) {
                formDataToSubmit.append('image', imageFile);
            }

            if (editingId) {
                // Use POST for updates when dealing with files (Laravel standard approach)
                await api.post(`/provider/products/${editingId}?_method=PUT`, formDataToSubmit, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/provider/products', formDataToSubmit, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            fetchProducts();
            setIsAdding(false);
            setEditingId(null);
            setFormData({ name: '', description: '', price: '', stock: '', category: '', hairGoal: '' });
            setImageFile(null);
            setImagePreview(null);
        } catch (error) {
            alert('Erreur: ' + (error.response?.data?.message || 'Une erreur est survenue'));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = (product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            category: product.category || '',
            hairGoal: product.hair_goal || '',
        });
        if (product.images && product.images.length > 0) {
            setImagePreview(STORAGE_URL + product.images[0]);
        } else {
            setImagePreview(null);
        }
        setIsAdding(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
        try {
            await api.delete(`/provider/products/${id}`);
            fetchProducts();
        } catch (error) {
            alert('Erreur lors de la suppression');
        }
    };

    const closeForm = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ name: '', description: '', price: '', stock: '', category: '', hairGoal: '' });
        setImageFile(null);
        setImagePreview(null);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-maroon-dark/5 dark:border-white/5 pb-8 animate-fade-in">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Inventory</span>
                        </div>
                        <h1 className="font-display font-medium italic text-maroon-dark dark:text-text-light leading-none" style={{ fontSize: 'var(--text-h2)' }}>
                            Gestion Boutique
                        </h1>
                        <p className="text-accent-bronze mt-4 text-lg font-medium italic">
                            Éditez et gérez votre catalogue de produits d'exception.
                        </p>
                    </div>

                    <Button
                        onClick={() => { alert('Add Clicked'); setIsAdding(!isAdding); setEditingId(null); }}
                        variant={isAdding ? 'outline' : 'primary'}
                        size="lg"
                        className="h-14 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl"
                        leftIcon={isAdding ? <X className="size-4" /> : <Plus className="size-4" />}
                    >
                        {isAdding ? 'Annuler' : 'Ajouter un Produit'}
                    </Button>
                </div>

                {/* Form */}
                {isAdding && (
                    <Card variant="elevated" className="overflow-hidden p-8 md:p-12 border border-primary/10 animate-fade-in-up shadow-2xl shadow-primary/5 bg-white/80 backdrop-blur-xl">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Package className="size-7" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-display font-bold text-maroon-dark italic">
                                    {editingId ? 'Modifier le Produit' : 'Nouveau Produit d\'Exception'}
                                </h2>
                                <p className="text-accent-bronze text-sm font-medium italic">Gérez l'élégance de votre inventaire premium.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black tracking-widest text-maroon-dark uppercase opacity-60 ml-1">Nom du produit</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="ex: Organic Marula Growth Oil"
                                    leftIcon={<span className="material-symbols-outlined text-sm">auto_awesome</span>}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black tracking-widest text-maroon-dark uppercase opacity-60 ml-1">Catégorie</label>
                                <Input
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="ex: Oils & Serums"
                                    leftIcon={<span className="material-symbols-outlined text-sm">category</span>}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black tracking-widest text-maroon-dark uppercase opacity-60 ml-1">Stock disponible</label>
                                <Input
                                    required
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    placeholder="24"
                                    leftIcon={<Layers className="size-4" />}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black tracking-widest text-maroon-dark uppercase opacity-60 ml-1">Prix (FCFA)</label>
                                <Input
                                    required
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="45000"
                                    leftIcon={<DollarSign className="size-4" />}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black tracking-widest text-maroon-dark uppercase opacity-60 ml-1">Objectif Capillaire</label>
                                <Input
                                    value={formData.hairGoal}
                                    onChange={(e) => setFormData({ ...formData, hairGoal: e.target.value })}
                                    placeholder="ex: Growth, Hydration"
                                    leftIcon={<Sparkles className="size-4 text-primary" />}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <label className="text-[10px] font-black tracking-widest text-maroon-dark uppercase opacity-60 ml-1">Image du Produit</label>
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="size-48 rounded-3xl bg-maroon-dark/5 flex items-center justify-center overflow-hidden border-2 border-dashed border-maroon-dark/10 group-hover:border-primary/30 transition-all shadow-inner">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="size-full object-contain p-2" />
                                        ) : (
                                            <ImageIcon className="size-12 text-maroon-dark/20" />
                                        )}
                                    </div>
                                    <div className="flex-1 w-full space-y-4">
                                        <p className="text-xs text-accent-bronze italic font-medium">Recommandé: JPG ou PNG (Max 20Mo). Fond blanc ou transparent de préférence.</p>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            />
                                            <Button type="button" variant="outline" className="w-full h-14 font-black uppercase tracking-widest text-[10px] border-maroon-dark/10" leftIcon={<Upload className="size-4" />}>
                                                SÉLECTIONNER UNE IMAGE
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-[10px] font-black tracking-widest text-maroon-dark uppercase opacity-60 ml-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white dark:bg-white/5 border border-maroon-dark/10 rounded-2xl p-6 text-maroon-dark dark:text-text-light placeholder:text-accent-bronze/30 min-h-[160px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium italic"
                                    placeholder="Décrivez les bienfaits de ce produit unique..."
                                />
                            </div>
                            <div className="md:col-span-2 flex gap-6 pt-4">
                                <Button type="button" onClick={closeForm} variant="outline" className="flex-1 h-14 font-black uppercase tracking-widest text-[10px]">
                                    Annuler
                                </Button>
                                <Button type="submit" variant="primary" className="flex-1 h-14 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20">
                                    {editingId ? 'Mettre à jour' : 'Enregistrer le Produit'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* Dashboard Stats (Product specific) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card variant="light" className="p-6 border-l-4 border-l-primary flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-accent-bronze mb-1">Total Revenue</p>
                            <h4 className="text-2xl font-display font-bold text-maroon-dark dark:text-text-light">29 450 000 FCFA</h4>
                        </div>
                        <div className="size-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                            <TrendingUp className="size-6" />
                        </div>
                    </Card>
                    <Card variant="light" className="p-6 border-l-4 border-l-accent-emerald flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-accent-bronze mb-1">Items Sold</p>
                            <h4 className="text-2xl font-display font-bold text-maroon-dark dark:text-text-light">423</h4>
                        </div>
                        <div className="size-12 rounded-xl bg-accent-emerald/5 flex items-center justify-center text-accent-emerald">
                            <CheckCircle2 className="size-6" />
                        </div>
                    </Card>
                    <Card variant="light" className="p-6 border-l-4 border-l-accent-rose flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-accent-bronze mb-1">Out of Stock</p>
                            <h4 className="text-2xl font-display font-bold text-maroon-dark dark:text-text-light">2 Products</h4>
                        </div>
                        <div className="size-12 rounded-xl bg-accent-rose/5 flex items-center justify-center text-accent-rose">
                            <div className="size-12 rounded-xl bg-accent-rose/5 flex items-center justify-center text-accent-rose">
                                <AlertTriangle className="size-6" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Search & Bulk Actions */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-accent-bronze" />
                    <Input
                        className="pl-12 bg-white dark:bg-white/5 h-14 text-sm"
                        placeholder="Chercher un produit ou une catégorie..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="size-10 animate-spin text-primary" />
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <Card key={product.id} hover variant="elevated" className="overflow-hidden p-0 border border-maroon-dark/5 group transition-all duration-700 shadow-xl shadow-maroon-dark/5">
                                <div className="flex flex-col md:flex-row md:items-stretch">
                                    <div className="size-32 md:size-48 bg-white shrink-0 border-r border-maroon-dark/5 p-6 flex items-center justify-center">
                                        <img
                                            src={product.images && product.images.length > 0 ? (product.images[0].startsWith('http') ? product.images[0] : STORAGE_URL + product.images[0]) : (product.image || 'https://via.placeholder.com/200?text=Produit')}
                                            alt={product.name}
                                            className="size-full object-contain group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    <div className="p-8 flex-1 grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                                        <div className="md:col-span-1 min-w-0">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-2 italic">{product.category}</p>
                                            <h3 className="text-xl font-display font-bold text-maroon-dark dark:text-text-light truncate italic group-hover:text-primary transition-colors">{product.name}</h3>
                                            <div className="mt-2 flex items-center gap-2">
                                                <Tag className="size-3 text-accent-bronze" />
                                                <p className="text-[10px] text-accent-bronze font-black uppercase tracking-tighter">Cible: {product.hairGoal}</p>
                                            </div>
                                        </div>

                                        <div className="text-center md:text-left space-y-3">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-accent-bronze">Stock Niveau</p>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-maroon-dark/5 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${product.stock === 0 ? 'bg-rose-500' :
                                                            product.stock < 10 ? 'bg-amber-500' :
                                                                'bg-emerald-500'
                                                            }`}
                                                        style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className={`text-xs font-black ${product.stock === 0 ? 'text-rose-500' :
                                                    product.stock < 10 ? 'text-amber-500' :
                                                        'text-maroon-dark'
                                                    }`}>
                                                    {product.stock}
                                                </span>
                                            </div>
                                            <p className={`text-[10px] font-black uppercase tracking-widest italic ${product.status === 'In Stock' ? 'text-emerald-500' :
                                                product.status === 'Low Stock' ? 'text-amber-500' :
                                                    'text-rose-500'
                                                }`}>
                                                {product.status}
                                            </p>
                                        </div>

                                        <div className="text-center space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-accent-bronze mb-2">Performance</p>
                                            <p className="text-xl font-display font-bold text-maroon-dark italic">{product.sales} Ventes</p>
                                            <div className="flex items-center justify-center gap-1 text-emerald-500">
                                                <TrendingUp className="size-3" />
                                                <p className="text-[10px] font-black">↑ 12%</p>
                                            </div>
                                        </div>

                                        <div className="text-center md:text-right">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-accent-bronze mb-2">Prix de Vente</p>
                                            <p className="text-4xl font-display font-black text-primary italic">{Math.round(product.price).toLocaleString('fr-FR')} FCFA</p>
                                        </div>
                                    </div>

                                    <div className="p-8 md:w-[120px] flex md:flex-col items-center justify-center gap-4 border-t md:border-t-0 md:border-l border-maroon-dark/5 bg-maroon-dark/[0.02]">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="size-12 rounded-full bg-white flex items-center justify-center text-maroon-dark hover:text-primary transition-all shadow-md group-hover:scale-110"
                                        >
                                            <Edit className="size-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="size-12 rounded-full bg-white flex items-center justify-center text-maroon-dark hover:text-rose-500 transition-all shadow-md group-hover:scale-110"
                                        >
                                            <Trash2 className="size-5" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card variant="light" className="p-20 text-center border-dashed border-2">
                            <Package className="size-12 mx-auto text-accent-cream mb-4" />
                            <p className="text-accent-bronze font-bold">No products match your search criteria.</p>
                        </Card>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProductManagement;
