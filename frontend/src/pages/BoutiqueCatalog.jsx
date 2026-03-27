import { useState, useEffect } from 'react';
import api from '../api/axios';
import ClientHeader from '../components/ClientHeader';
import { Card, Button, Input } from '../components/ui';
import {
    Search as SearchIcon,
    ShoppingBag as BagIcon,
    ChevronLeft as LeftIcon,
    ChevronRight as RightIcon,
    Filter as FilterIcon,
    User as UserIcon,
    Sparkles,
    ArrowRight,
    Plus,
    ShoppingCart as CartIcon,
    CheckCircle,
    Menu as MenuIcon
} from 'lucide-react';

const BoutiqueCatalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const STORAGE_URL = 'http://localhost:8000/storage/';

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products', error);
            // Fallback mock data for precise alignment if API fails
            const mock = [
                { id: 1, name: 'Organic Marula Growth Oil', price: 52.00, category: 'Oils & Serums', hairGoal: 'Growth', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600' },
                { id: 2, name: 'Whipped Shea Butter Mask', price: 45.00, category: 'Masks', hairGoal: 'Hydration', image: 'https://images.unsplash.com/photo-1599426417164-83141753bb45?auto=format&fit=crop&q=80&w=600' },
                { id: 3, name: 'Gold-Trim Silk Bonnet', price: 75.00, category: 'Silk Accessories', hairGoal: 'Retention', image: 'https://images.unsplash.com/photo-1590540179852-2110a54f813c?auto=format&fit=crop&q=80&w=600' }
            ];
            setProducts(mock);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-maroon-dark dark:text-text-light flex flex-col overflow-x-hidden">
            <ClientHeader />

            <div className="flex flex-1">
                {/* Sidebar: Deep Maroon Filter Bar - Exact Mockup Style */}
                <aside className="w-72 bg-maroon-dark text-white p-8 flex flex-col gap-10 hidden xl:flex">
                    <div className="space-y-2">
                        <h1 className="text-[#ca8349] text-[10px] font-black uppercase tracking-[0.3em]">Shop Filters</h1>
                        <p className="text-[#b49b87] text-sm font-light">Tailored for Afro-textured beauty</p>
                    </div>

                    <div className="space-y-8">
                        {/* Categories */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary text-base">category</span> Categories
                            </h3>
                            <div className="space-y-2">
                                <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 text-sm">
                                    <span className="material-symbols-outlined text-lg">grid_view</span> All Products
                                </button>
                                <button className="flex items-center gap-3 w-full px-4 py-3 text-[#b49b87] hover:bg-white/5 rounded-xl transition-all text-sm group">
                                    <span className="material-symbols-outlined text-lg group-hover:text-white">opacity</span> Oils & Serums
                                </button>
                                <button className="flex items-center gap-3 w-full px-4 py-3 text-[#b49b87] hover:bg-white/5 rounded-xl transition-all text-sm group">
                                    <span className="material-symbols-outlined text-lg group-hover:text-white">spa</span> Moisturizers
                                </button>
                                <button className="flex items-center gap-3 w-full px-4 py-3 text-[#b49b87] hover:bg-white/5 rounded-xl transition-all text-sm group">
                                    <span className="material-symbols-outlined text-lg group-hover:text-white">checkroom</span> Silk Accessories
                                </button>
                            </div>
                        </div>

                        {/* Hair Goal */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary text-base">filter_alt</span> Hair Goal
                            </h3>
                            <div className="space-y-4">
                                {['Retention', 'Maximum Hydration', 'Scalp Health'].map(goal => (
                                    <label key={goal} className="flex items-center gap-4 cursor-pointer group">
                                        <div className="size-5 rounded border border-white/20 group-hover:border-primary flex items-center justify-center transition-colors">
                                            <div className="size-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                        <span className="text-sm text-[#b49b87] group-hover:text-white transition-colors">{goal}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Profile Summary at Bottom */}
                    <div className="mt-auto pt-8 border-t border-white/10">
                        <div className="bg-primary/10 rounded-2xl p-5 border border-primary/20">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined text-primary text-xl">account_circle</span>
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Hair Profile</p>
                            </div>
                            <p className="text-[11px] text-[#b49b87] leading-relaxed">
                                Currently showing for <span className="text-white font-bold italic">Type 4C • High Porosity</span>
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area - Exact Mockup Style */}
                <main className="flex-1 overflow-y-auto pt-24 lg:pt-32">
                    <div className="max-w-[1240px] mx-auto px-6 md:px-10 py-12 space-y-12">
                        {/* Page Heading */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                            <div className="space-y-6">
                                <h1 className="font-black tracking-tight leading-none italic font-display" style={{ fontSize: 'var(--text-h2)' }}>The Curated Boutique</h1>
                                <p className="text-[#8c705a] text-lg font-light max-w-xl">Des soins professionnels premium sélectionnés pour les besoins spécifiques des cheveux Afro et crépus.</p>
                            </div>
                            <Button variant="secondary" className="bg-[#f1ede9] dark:bg-[#332a22] border-none text-xs font-black uppercase tracking-widest h-14 px-10 rounded-full">
                                TRIER : NOUVEAUTÉS
                            </Button>
                        </div>

                        {/* Personalization Panel */}
                        <div className="bg-[#fbfaf9] dark:bg-[#271e18] border border-[#e3dbd3] dark:border-[#332a22] rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
                            <div className="flex items-center gap-6">
                                <div className="size-16 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-3xl">auto_awesome</span>
                                </div>
                                <div>
                                    <p className="text-xl font-bold tracking-tight mb-1">Personalized Selection</p>
                                    <p className="text-[#8c705a] text-sm">Based on your 4C Curl Pattern & Low Porosity profile from your last visit.</p>
                                </div>
                            </div>
                            <button className="text-primary font-bold text-sm flex items-center gap-2 hover:underline group">
                                Update Hair Profile <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Recommended Carousel Section */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold tracking-tight">Recommended for You</h2>
                                <div className="flex gap-2">
                                    <button className="size-10 rounded-full border border-[#f1ede9] flex items-center justify-center text-[#8c705a] hover:bg-primary hover:text-white transition-all"><LeftIcon className="size-4" /></button>
                                    <button className="size-10 rounded-full border border-[#f1ede9] flex items-center justify-center text-[#8c705a] hover:bg-primary hover:text-white transition-all"><RightIcon className="size-4" /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {Array.isArray(products) && products.map((p, idx) => (
                                    <div key={p.id} className="group space-y-5 animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                                        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-xl shadow-maroon-dark/5 bg-white">
                                            <img
                                                src={p.images && p.images.length > 0 ? (p.images[0].startsWith('http') ? p.images[0] : STORAGE_URL + p.images[0]) : (p.image || 'https://via.placeholder.com/600?text=Produit')}
                                                className="size-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                alt={p.name}
                                            />
                                            <div className="absolute inset-0 bg-maroon-dark/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                            <div className="absolute top-4 left-4 bg-white/90 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-lg border border-primary/10">
                                                {idx === 0 ? 'Essential' : p.hairGoal}
                                            </div>
                                            <div className="absolute inset-x-4 bottom-4 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                <Button variant="primary" className="w-full h-14 font-black uppercase tracking-widest text-xs shadow-2xl">
                                                    <CartIcon className="size-4 mr-2" /> Add to Cart
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors mb-1">{p.name}</h3>
                                            <p className="text-xl font-display font-medium italic text-primary">{Math.round(p.price).toLocaleString('fr-FR')} FCFA</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Collections Divider */}
                        <div className="flex items-center gap-6 py-6">
                            <h2 className="text-3xl font-black tracking-tight leading-none">Full Collection</h2>
                            <div className="flex-1 h-px bg-[#f1ede9] dark:bg-[#332a22]"></div>
                        </div>

                        {/* Standard Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                            {[1, 2, 3, 4].map(n => (
                                <div key={n} className="group space-y-5">
                                    <div className="relative aspect-square rounded-2xl bg-[#f5f3f0] dark:bg-[#2a241f] overflow-hidden flex items-center justify-center p-8 group-hover:shadow-2xl transition-all duration-700">
                                        <img src={`https://images.unsplash.com/photo-${1600000000000 + n}?auto=format&fit=crop&q=80&w=400`} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-700" alt="Product" />
                                        <div className="absolute inset-0 bg-maroon-dark/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <button className="absolute bottom-4 right-4 size-12 bg-primary text-white rounded-full flex items-center justify-center translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-xl">
                                            <Plus className="size-6" />
                                        </button>
                                    </div>
                                    <div className="px-1 text-center sm:text-left">
                                        <p className="text-[10px] font-black uppercase text-accent-bronze tracking-[0.2em] mb-1">PRO COLLECTION</p>
                                        <h3 className="font-bold text-lg leading-tight mb-2">Luxury Mist {n}</h3>
                                        <p className="text-lg font-display italic text-primary">32 000 FCFA</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Callout */}
                        <div className="py-24 border-t border-[#f1ede9] dark:border-[#332a22] flex flex-col items-center text-center gap-8">
                            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <CheckCircle className="size-8" />
                            </div>
                            <h2 className="text-4xl font-display italic text-maroon-dark leading-tight max-w-xl">Expertly curated by the <span className="text-primary">Elsa Coiffure</span> team Daily.</h2>
                            <p className="text-accent-bronze max-w-md italic">Every product in our shop is tested and used in our salon. We stand by the efficacy and premium quality of every ingredient.</p>
                            <Button variant="primary" size="lg" className="h-16 px-12 rounded-full shadow-2xl">Shop All Collections</Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default BoutiqueCatalog;
