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
    TrendingUp
} from 'lucide-react';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // Mocking products since we need a curated list for the demo
            setLoading(true);
            const mockProducts = [
                {
                    id: 1,
                    name: 'Organic Marula Growth Oil',
                    price: 45.00,
                    category: 'Oils & Serums',
                    stock: 24,
                    status: 'In Stock',
                    hairGoal: 'Growth',
                    sales: 128,
                    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200'
                },
                {
                    id: 2,
                    name: 'Scalp Hydration Mask',
                    price: 35.00,
                    category: 'Masks',
                    stock: 8,
                    status: 'Low Stock',
                    hairGoal: 'Hydration',
                    sales: 85,
                    image: 'https://images.unsplash.com/photo-1599426417164-83141753bb45?auto=format&fit=crop&q=80&w=200'
                },
                {
                    id: 3,
                    name: 'Premium Bamboo Wide-Tooth Comb',
                    price: 18.00,
                    category: 'Tools & Accessories',
                    stock: 0,
                    status: 'Out of Stock',
                    hairGoal: 'Scalp Health',
                    sales: 210,
                    image: 'https://images.unsplash.com/photo-1590540179852-2110a54f813c?auto=format&fit=crop&q=80&w=200'
                }
            ];
            setProducts(mockProducts);
        } catch (error) {
            console.error('Error fetching products', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-maroon-dark/5 dark:border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Inventory</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-medium italic text-maroon-dark dark:text-text-light leading-none">
                            Gestion Boutique
                        </h1>
                        <p className="text-accent-bronze mt-4 text-sm font-medium">
                            Contrôlez votre catalogue de produits et suivez vos stocks.
                        </p>
                    </div>

                    <Button variant="primary" size="lg" className="h-14 font-black uppercase text-xs tracking-widest" leftIcon={<Plus className="size-4" />}>
                        Ajouter un Produit
                    </Button>
                </div>

                {/* Dashboard Stats (Product specific) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card variant="light" className="p-6 border-l-4 border-l-primary flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-accent-bronze mb-1">Total Revenue</p>
                            <h4 className="text-2xl font-display font-bold text-maroon-dark dark:text-text-light">$12,450.00</h4>
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
                <div className="grid grid-cols-1 gap-4">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="size-10 animate-spin text-primary" />
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <Card key={product.id} variant="elevated" className="overflow-hidden p-0 border border-maroon-dark/5 dark:border-white/5 group">
                                <div className="flex flex-col md:flex-row md:items-center">
                                    <div className="size-24 md:size-32 bg-white shrink-0 border-r border-maroon-dark/5 dark:border-white/5 p-2">
                                        <img src={product.image} alt={product.name} className="size-full object-contain rounded-lg shadow-sm" />
                                    </div>

                                    <div className="p-6 flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                                        <div className="md:col-span-1 min-w-0">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">{product.category}</p>
                                            <h3 className="text-base font-bold text-maroon-dark dark:text-text-light truncate group-hover:text-primary transition-colors">{product.name}</h3>
                                            <p className="text-[10px] text-accent-bronze font-bold mt-1 uppercase tracking-tighter">Goal: {product.hairGoal}</p>
                                        </div>

                                        <div className="text-center md:text-left">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-accent-bronze mb-1">Stock Level</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-maroon-dark/5 dark:bg-white/5 h-1.5 rounded-full overflow-hidden w-24">
                                                    <div
                                                        className={`h-full rounded-full ${product.stock === 0 ? 'bg-accent-rose' :
                                                            product.stock < 10 ? 'bg-accent-bronze' :
                                                                'bg-accent-emerald'
                                                            }`}
                                                        style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className={`text-xs font-black ${product.stock === 0 ? 'text-accent-rose' :
                                                    product.stock < 10 ? 'text-accent-bronze' :
                                                        'text-maroon-dark dark:text-text-light'
                                                    }`}>
                                                    {product.stock}
                                                </span>
                                            </div>
                                            <p className={`text-[10px] font-bold mt-1 ${product.status === 'In Stock' ? 'text-accent-emerald' :
                                                product.status === 'Low Stock' ? 'text-accent-bronze' :
                                                    'text-accent-rose'
                                                }`}>
                                                {product.status}
                                            </p>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-accent-bronze mb-1">Performance</p>
                                            <p className="text-base font-bold text-maroon-dark dark:text-text-light">{product.sales} Sales</p>
                                            <p className="text-[10px] text-accent-emerald font-bold mt-0.5">↑ 12% boost</p>
                                        </div>

                                        <div className="text-center md:text-right">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-accent-bronze mb-1">Retail Price</p>
                                            <p className="text-2xl font-display font-bold text-primary">${product.price.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="p-6 md:w-48 flex items-center justify-center gap-2 border-t md:border-t-0 md:border-l border-maroon-dark/5 dark:border-white/5 bg-maroon-dark/5 dark:bg-white/5">
                                        <button className="size-10 rounded-full hover:bg-white/50 dark:hover:bg-white/10 flex items-center justify-center text-accent-bronze hover:text-primary transition-all">
                                            <Edit className="size-5" />
                                        </button>
                                        <button className="size-10 rounded-full hover:bg-accent-rose/10 flex items-center justify-center text-accent-bronze hover:text-accent-rose transition-all">
                                            <Trash2 className="size-5" />
                                        </button>
                                        <button className="size-10 rounded-full hover:bg-primary/10 flex items-center justify-center text-accent-bronze hover:text-primary transition-all">
                                            <Eye className="size-5" />
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
