import PropTypes from 'prop-types';
import { Card, Button } from '../ui';

const CartDrawer = ({ isOpen, onClose, items, onRemove, onUpdateQuantity }) => {
    const total = items.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return sum + (price * item.quantity);
    }, 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-maroon-dark/40 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>

            <aside className="relative w-full max-w-md bg-background-light dark:bg-background-dark shadow-2xl h-full flex flex-col animate-slide-in-right">
                <header className="p-8 border-b border-accent-cream/50 dark:border-maroon-light/30 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-display font-bold text-maroon-dark dark:text-text-light">Shopping Cart</h3>
                        <p className="text-xs text-accent-bronze font-bold uppercase tracking-widest mt-1">
                            {items.length} {items.length === 1 ? 'Item' : 'Items'} selected
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="size-10 rounded-full hover:bg-accent-cream/30 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 group">
                                <div className="size-20 rounded-xl overflow-hidden bg-white border border-accent-cream/20 shrink-0">
                                    <img src={item.image_url} alt={item.name} className="size-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-display font-bold text-maroon-dark dark:text-text-light truncate">
                                        {item.name}
                                    </h4>
                                    <p className="text-sm text-primary font-bold mt-1">{item.price}</p>

                                    <div className="flex items-center gap-4 mt-3">
                                        <div className="flex items-center border border-accent-cream/50 dark:border-maroon-light/30 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                className="px-2 py-1 hover:bg-accent-cream/30 dark:hover:bg-white/10"
                                            >
                                                <span className="material-symbols-outlined text-sm">remove</span>
                                            </button>
                                            <span className="px-3 text-xs font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                className="px-2 py-1 hover:bg-accent-cream/30 dark:hover:bg-white/10"
                                            >
                                                <span className="material-symbols-outlined text-sm">add</span>
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => onRemove(item.id)}
                                            className="text-[10px] font-bold text-accent-rose hover:underline uppercase tracking-widest"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                            <span className="material-symbols-outlined text-6xl text-accent-cream">shopping_bag</span>
                            <p className="text-accent-bronze font-bold">Your cart is empty</p>
                            <Button variant="outline" size="sm" onClick={onClose}>
                                Continue Shopping
                            </Button>
                        </div>
                    )}
                </div>

                <footer className="p-8 border-t border-accent-cream/50 dark:border-maroon-light/30 bg-maroon-dark/5 dark:bg-white/5 space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-accent-bronze font-medium">Subtotal</span>
                            <span className="text-maroon-dark dark:text-text-light font-bold">${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-accent-bronze font-medium">Shipping</span>
                            <span className="text-accent-emerald font-bold uppercase text-[10px] tracking-widest">Calculated at next step</span>
                        </div>
                        <div className="flex justify-between text-xl border-t border-accent-cream/30 pt-4 mt-2">
                            <span className="font-display font-bold text-maroon-dark dark:text-text-light">Total</span>
                            <span className="font-display font-bold text-primary">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <Button variant="primary" size="lg" className="w-full h-14" disabled={items.length === 0}>
                        Checkout Now
                    </Button>
                    <p className="text-[10px] text-accent-bronze text-center font-bold italic">
                        Free delivery on orders over $100
                    </p>
                </footer>
            </aside>
        </div>
    );
};

CartDrawer.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    onRemove: PropTypes.func.isRequired,
    onUpdateQuantity: PropTypes.func.isRequired,
};

export default CartDrawer;
