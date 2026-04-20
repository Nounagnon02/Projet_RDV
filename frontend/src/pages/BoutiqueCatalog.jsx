import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useTranslation } from 'react-i18next';
import {
    Search as SearchIcon,
    ShoppingBag,
    Loader2,
    Plus,
    ArrowRight,
    Droplets,
    Sparkles,
    Scissors,
    BrushCleaning,
    Package2,
} from 'lucide-react';
import { Button, Card } from '../components/ui';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const BoutiqueCatalog = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const { addToCart, itemCount } = useCart();

    const STORAGE_URL = 'http://localhost:8000/storage';

    // Categories
    const categories = [
        { id: 'all', name: t('shop.all_products', { defaultValue: 'Tous les produits' }) },
        { id: 'Oils & Serums', name: t('shop.cat_oils_serums', { defaultValue: 'Huiles & Serums' }) },
        { id: 'Masks', name: t('shop.cat_masks', { defaultValue: 'Masques' }) },
        { id: 'Silk Accessories', name: t('shop.cat_silk_accessories', { defaultValue: 'Accessoires en soie' }) },
        { id: 'Cleansing', name: t('shop.cat_cleansing', { defaultValue: 'Nettoyants' }) },
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products');
            setProducts(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching products', error);
            // Fallback mock data
            setProducts([
                { id: 1, name: 'Organic Marula Growth Oil', price: 52.00, category: 'Oils & Serums', hair_goal: 'Growth', stock: 25 },
                { id: 2, name: 'Whipped Shea Butter Mask', price: 45.00, category: 'Masks', hair_goal: 'Hydration', stock: 18 },
                { id: 3, name: 'Gold-Trim Silk Bonnet', price: 75.00, category: 'Silk Accessories', hair_goal: 'Retention', stock: 12 },
                { id: 4, name: 'Protein Reconstructor Serum', price: 65.00, category: 'Oils & Serums', hair_goal: 'Repair', stock: 22 },
                { id: 5, name: 'Scalp Clarifying Shampoo', price: 32.00, category: 'Cleansing', hair_goal: 'Scalp Health', stock: 30 },
                { id: 6, name: 'Silk Pillowcase Premium', price: 58.00, category: 'Silk Accessories', hair_goal: 'Retention', stock: 15 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddToCart = (product) => {
        addToCart(product, 1);
    };

    const formatPrice = (value) => `${Math.round(Number(value || 0)).toLocaleString('fr-FR')} FCFA`;

    const getCategoryIcon = (category = '') => {
        const normalized = category.toLowerCase();
        if (normalized.includes('oil') || normalized.includes('serum')) return Droplets;
        if (normalized.includes('mask')) return Sparkles;
        if (normalized.includes('silk')) return Scissors;
        if (normalized.includes('clean')) return BrushCleaning;
        return Package2;
    };

    const getProductImage = (product) => {
        const rawImage = product?.images?.[0] || product?.image || null;
        if (!rawImage) return null;
        if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) return rawImage;
        return `${STORAGE_URL}/${rawImage.replace(/^\/+/, '')}`;
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-maroon-dark dark:text-text-light overflow-x-hidden">
            <Navbar />
            <div className="py-28 px-2 md:px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <ShoppingBag className="size-6 text-primary" />
                            <h1 className="text-4xl md:text-5xl font-display font-black italic text-maroon-dark">
                                {t('shop.title', { defaultValue: 'Boutique Elsa' })}
                            </h1>
                        </div>
                        <p className="text-lg text-accent-bronze font-medium max-w-2xl italic">
                            {t('shop.subtitle', { defaultValue: 'Des soins professionnels premium pour les besoins spécifiques des cheveux Afro et crepus.' })}
                        </p>
                    </div>

                    {/* Search & Filter Section */}
                    <div className="mb-12 space-y-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-bronze size-5" />
                            <input
                                type="text"
                                placeholder={t('shop.search_placeholder', { defaultValue: 'Rechercher un produit...' })}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-white dark:bg-white/5 border border-maroon-dark/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-maroon-dark dark:text-text-light placeholder:text-accent-bronze/50"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-3">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all ${
                                        selectedCategory === cat.id
                                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                            : 'bg-white dark:bg-white/5 border border-maroon-dark/10 text-maroon-dark dark:text-text-light hover:border-primary hover:text-primary'
                                    }`}
                                >
                                    {(() => {
                                        const Icon = getCategoryIcon(cat.id);
                                        return <Icon className="size-4 mr-2 inline" />;
                                    })()}
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="size-12 animate-spin text-primary opacity-40" />
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="group bg-white dark:bg-white/5 rounded-[2rem] overflow-hidden border border-maroon-dark/5 hover:border-primary/20 hover:shadow-2xl transition-all duration-300"
                                >
                                    {/* Product Image */}
                                    <div className="h-64 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 group-hover:bg-primary/5 transition-colors"></div>
                                        {getProductImage(product) ? (
                                            <img
                                                src={getProductImage(product)}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <ShoppingBag className="size-16 text-primary opacity-20 group-hover:opacity-30 transition-opacity" />
                                        )}
                                        
                                        {/* Price Badge */}
                                        <div className="absolute top-4 right-4 bg-primary text-white font-bold px-4 py-2 rounded-full shadow-lg">
                                            {formatPrice(product.price)}
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-8 space-y-6">
                                        {/* Category & Goal Tags */}
                                        <div className="flex flex-wrap gap-2">
                                            <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-primary/10 text-primary rounded-full">
                                                {product.category || t('shop.product', { defaultValue: 'Produit' })}
                                            </span>
                                            {product.hair_goal && (
                                                <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-maroon-dark/5 text-accent-bronze rounded-full">
                                                    {product.hair_goal}
                                                </span>
                                            )}
                                        </div>

                                        {/* Product Name */}
                                        <div>
                                            <h3 className="text-xl font-display font-bold text-maroon-dark dark:text-text-light mb-2">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-accent-bronze dark:text-accent-bronze/80">
                                                {product.description || t('shop.default_product_desc', { defaultValue: 'Produit premium pour la beaute des cheveux Afro' })}
                                            </p>
                                        </div>

                                        {/* Stock Status */}
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-maroon-dark/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all"
                                                    style={{ width: `${(product.stock / 30) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-black text-accent-bronze uppercase">
                                                {t('shop.in_stock', { defaultValue: 'En stock' })}: {product.stock}
                                            </span>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all group/btn"
                                        >
                                            <Plus className="size-4" />
                                            {t('shop.add_to_cart', { defaultValue: 'Ajouter au panier' })}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Card variant="light" className="p-20 text-center border-dashed border-2">
                            <ShoppingBag className="size-16 mx-auto text-accent-cream mb-6 opacity-40" />
                            <p className="text-accent-bronze text-lg font-display italic">
                                {t('shop.no_products_found', { defaultValue: 'Aucun produit ne correspond a votre recherche.' })}
                            </p>
                        </Card>
                    )}

                    {/* Summary Card */}
                    {filteredProducts.length > 0 && (
                        <Card className="p-8 bg-gradient-to-r from-primary/5 to-maroon-dark/5 border-primary/20">
                            <div className="flex items-center justify-between flex-wrap gap-6">
                                <div>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">
                                        {t('shop.collection_summary', { defaultValue: 'Resume de la collection' })}
                                    </p>
                                    <p className="text-3xl font-display font-black text-maroon-dark">
                                        {filteredProducts.length} {filteredProducts.length === 1
                                            ? t('shop.product', { defaultValue: 'Produit' })
                                            : t('shop.products', { defaultValue: 'Produits' })}
                                    </p>
                                </div>
                                <Link to="/checkout">
                                    <Button variant="primary" size="lg" className="h-16 px-12">
                                        {t('shop.view_cart', { defaultValue: 'Voir le panier' })} ({itemCount}) <ArrowRight className="ml-2 size-4" />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default BoutiqueCatalog;
