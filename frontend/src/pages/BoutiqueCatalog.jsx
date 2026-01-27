import { useState, useEffect } from 'react';
import api from '../api/axios';
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
    Menu
} from 'lucide-react';

const BoutiqueCatalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-[#191410] dark:text-[#fbfaf9] flex flex-col">
            {/* Top Navigation - Exact Mockup Style */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#f1ede9] dark:border-[#332a22] bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-10 py-5">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4 text-primary">
                        <div className="size-6">
                            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4V4Z" fillRule="evenodd"></path>
                            </svg>
                        </div>
                        <h2 className="text-[#191410] dark:text-[#fbfaf9] text-xl font-extrabold tracking-tight">Elsa Coiffure</h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-9">
                        <a href="#" className="text-[#191410] dark:text-[#fbfaf9] text-sm font-semibold hover:text-primary transition-colors">Shop</a>
                        <a href="#" className="text-[#8c705a] text-sm font-medium hover:text-primary transition-colors">Salon</a>
                        <a href="#" className="text-[#8c705a] text-sm font-medium hover:text-primary transition-colors">Gallery</a>
                        <a href="#" className="text-[#8c705a] text-sm font-medium hover:text-primary transition-colors">Booking</a>
                    </nav>
                </div>
                <div className="flex flex-1 justify-end gap-6">
                    <div className="hidden lg:block w-64">
                        <div className="flex items-center rounded-lg bg-[#f1ede9] dark:bg-[#332a22] px-4 h-10 border border-transparent focus-within:border-primary/20 transition-all">
                            <SearchIcon className="size-4 text-[#8c705a]" />
                            <input className="bg-transparent border-none focus:ring-0 text-sm w-full pl-3" placeholder="Search products..." />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-[#f1ede9] dark:bg-[#332a22] hover:bg-primary/20 transition-all">
                            <BagIcon className="size-5" />
                        </button>
                        <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-[#f1ede9] dark:bg-[#332a22] hover:bg-primary/20 transition-all">
                            <UserIcon className="size-5" />
                        </button>
                    </div>
                </div>
            </header>

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
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-[1100px] mx-auto px-10 py-12 space-y-12">
                        {/* Page Heading */}
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                            <div className="space-y-4">
                                <h1 className="text-5xl font-black tracking-tight leading-none italic font-display">The Curated Boutique</h1>
                                <p className="text-[#8c705a] text-lg font-light max-w-xl">Premium, professional-grade treatments selected for the specific needs of Afro-textured and coiled hair.</p>
                            </div>
                            <Button variant="secondary" className="bg-[#f1ede9] dark:bg-[#332a22] border-none text-sm font-bold h-12 px-8">
                                Sort By: Newest
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
                                {products.map((p, idx) => (
                                    <div key={p.id} className="group space-y-5 animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                                        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-xl shadow-maroon-dark/5 bg-white">
                                            <img src={p.image} className="size-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={p.name} />
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
                                            <p className="text-xl font-display font-medium italic text-primary">${p.price.toFixed(2)}</p>
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
                                        <p className="text-lg font-display italic text-primary">$32.00</p>
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

            {/* Standard Premium Footer */}
            <footer className="bg-maroon-dark text-background-light py-24 xl:px-40 lg:px-20 px-4 border-t border-white/5">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-4 mb-8 text-primary">
                            <span className="material-symbols-outlined text-4xl">spa</span>
                            <h2 className="text-3xl font-bold tracking-tight uppercase font-display italic text-white leading-none">Elsa</h2>
                        </div>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-sm italic">
                            Elevating the standard of Afro hair care through luxury experience and artistic excellence for over a decade.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-black uppercase text-[10px] tracking-[0.4em] mb-10 opacity-40">Navigation</h4>
                        <ul className="space-y-6 text-[10px] font-black tracking-[0.2em] uppercase text-slate-200">
                            <li><a className="hover:text-primary transition-colors" href="/about">Our Story</a></li>
                            <li><a className="hover:text-primary transition-colors" href="/providers">Services</a></li>
                            <li><a className="hover:text-primary transition-colors" href="/client/shop">Boutique</a></li>
                            <li><a className="hover:text-primary transition-colors" href="/contact">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-black uppercase text-[10px] tracking-[0.4em] mb-10 opacity-40">Concierge</h4>
                        <ul className="space-y-6 text-[10px] font-black tracking-[0.2em] uppercase text-slate-300">
                            <li className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-primary text-base">mail</span>
                                concierge@elsacoiffure.com
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-primary text-base">call</span>
                                +33 1 23 45 67 89
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-primary text-base">location_on</span>
                                75 Av. des Champs-Élysées, Paris
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-[1200px] mx-auto border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 font-sans">
                    <p>© 2026 ELSA COIFFURE PARIS. ALL RIGHTS RESERVED.</p>
                    <div className="flex gap-10">
                        <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
                        <a className="hover:text-white transition-colors" href="#">Booking Policy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default BoutiqueCatalog;
