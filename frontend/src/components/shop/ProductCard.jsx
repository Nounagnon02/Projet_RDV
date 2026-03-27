import PropTypes from 'prop-types';
import { Card, Button } from '../ui';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
    const {
        name,
        price,
        category,
        image_url,
        hair_goal,
        is_featured
    } = product;

    return (
        <Card variant="elevated" className="group h-full flex flex-col overflow-hidden border border-accent-cream/20 dark:border-maroon-light/20 shadow-sm hover:shadow-xl transition-all duration-500">
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden">
                <img
                    src={image_url || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400'}
                    alt={name}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay with Quick View */}
                <div className="absolute inset-0 bg-maroon-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onViewDetails?.(product)}
                        className="scale-90 group-hover:scale-100 transition-transform duration-300"
                    >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                    </Button>
                </div>

                {is_featured && (
                    <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                        Best Seller
                    </div>
                )}

                {hair_goal && (
                    <div className="absolute bottom-4 right-4 bg-white/90 /90 backdrop-blur-sm px-3 py-1 rounded-lg border border-accent-cream/20 shadow-md">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{hair_goal}</p>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-6 flex-1 flex flex-col">
                <p className="text-[10px] font-bold text-accent-bronze uppercase tracking-[0.2em] mb-2">
                    {category}
                </p>
                <h4 className="text-lg font-display font-bold text-maroon-dark dark:text-text-light mb-auto group-hover:text-primary transition-colors">
                    {name}
                </h4>

                <div className="mt-4 flex items-center justify-between gap-4">
                    <p className="text-xl font-bold text-maroon-dark dark:text-text-light">
                        {price}
                    </p>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onAddToCart?.(product)}
                        className="rounded-lg px-4"
                        leftIcon={<span className="material-symbols-outlined text-lg">add_shopping_cart</span>}
                    >
                        Add
                    </Button>
                </div>
            </div>
        </Card>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        image_url: PropTypes.string,
        hair_goal: PropTypes.string,
        is_featured: PropTypes.bool,
    }).isRequired,
    onAddToCart: PropTypes.func,
    onViewDetails: PropTypes.func,
};

export default ProductCard;
