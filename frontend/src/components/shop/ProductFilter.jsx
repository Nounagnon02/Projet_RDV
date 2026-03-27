import PropTypes from 'prop-types';
import { Input } from '../ui';

const ProductFilter = ({ filters, setFilters }) => {
    const categories = ['All', 'Oils & Serums', 'Masks', 'Scalp Care', 'Tools & Accessories'];
    const goals = ['All', 'Hydration', 'Retention', 'Scalp Health', 'Growth'];

    return (
        <div className="space-y-10">
            {/* Search */}
            <div className="space-y-4">
                <h5 className="text-sm font-bold text-maroon-dark dark:text-text-light uppercase tracking-widest">Search</h5>
                <Input
                    placeholder="Find a product..."
                    value={filters.search || ''}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    leftIcon={<span className="material-symbols-outlined">search</span>}
                />
            </div>

            {/* Categories */}
            <div className="space-y-4">
                <h5 className="text-sm font-bold text-maroon-dark dark:text-text-light uppercase tracking-widest">Category</h5>
                <div className="flex flex-col gap-2">
                    {categories.map((cat) => (
                        <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                            <input
                                type="radio"
                                name="category"
                                checked={(filters.category || 'All') === cat}
                                onChange={() => setFilters({ ...filters, category: cat })}
                                className="size-4 text-primary border-accent-cream focus:ring-primary ring-offset-0 bg-white/50"
                            />
                            <span className={`text-sm font-medium transition-colors ${(filters.category || 'All') === cat ? 'text-primary font-bold' : 'text-accent-bronze group-hover:text-maroon-dark dark:group-hover:text-text-light'
                                }`}>
                                {cat}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Hair Goals */}
            <div className="space-y-4">
                <h5 className="text-sm font-bold text-maroon-dark dark:text-text-light uppercase tracking-widest">Hair Goal</h5>
                <div className="flex flex-col gap-2">
                    {goals.map((goal) => (
                        <label key={goal} className="flex items-center gap-3 group cursor-pointer">
                            <input
                                type="radio"
                                name="goal"
                                checked={(filters.goal || 'All') === goal}
                                onChange={() => setFilters({ ...filters, goal: goal })}
                                className="size-4 text-primary border-accent-cream focus:ring-primary ring-offset-0 bg-white/50"
                            />
                            <span className={`text-sm font-medium transition-colors ${(filters.goal || 'All') === goal ? 'text-primary font-bold' : 'text-accent-bronze group-hover:text-maroon-dark dark:group-hover:text-text-light'
                                }`}>
                                {goal}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h5 className="text-sm font-bold text-maroon-dark dark:text-text-light uppercase tracking-widest">Price Range</h5>
                    <span className="text-xs font-bold text-primary">{(filters.price || 150000).toLocaleString('fr-FR')} FCFA</span>
                </div>
                <input
                    type="range"
                    min="10"
                    max="300"
                    value={filters.price || 150}
                    onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                    className="w-full accent-primary h-1.5 bg-accent-cream dark:bg-white/10 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-accent-bronze font-bold">
                    <span>5 000 FCFA</span>
                    <span>300 000 FCFA</span>
                </div>
            </div>

            {/* Clear Filters */}
            <button
                onClick={() => setFilters({})}
                className="text-xs font-bold text-accent-bronze hover:text-primary underline transition-colors"
            >
                Clear all filters
            </button>
        </div>
    );
};

ProductFilter.propTypes = {
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
};

export default ProductFilter;
