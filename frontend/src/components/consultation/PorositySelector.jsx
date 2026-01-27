import PropTypes from 'prop-types';
import { Card } from '../ui';

const PorositySelector = ({ selected, onChange }) => {
    const options = [
        {
            id: 'low',
            title: 'Low Porosity',
            description: 'Hair takes a long time to get wet and dry. Products tend to sit on top of the hair.',
            image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=200',
        },
        {
            id: 'medium',
            title: 'Medium Porosity',
            description: 'Hair absorbs and retains moisture easily. Low maintenance and holds styles well.',
            image: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&q=80&w=200',
        },
        {
            id: 'high',
            title: 'High Porosity',
            description: 'Hair absorbs water quickly but loses it just as fast. Often feels dry and tangles easily.',
            image: 'https://images.unsplash.com/photo-1522337094846-8a81819202f9?auto=format&fit=crop&q=80&w=200',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {options.map((option) => (
                <Card
                    key={option.id}
                    variant={selected === option.id ? 'default' : 'elevated'}
                    hover
                    onClick={() => onChange(option.id)}
                    className={`relative p-6 cursor-pointer border-2 transition-all duration-300 ${selected === option.id
                            ? 'border-primary ring-4 ring-primary/10'
                            : 'border-transparent'
                        }`}
                >
                    {selected === option.id && (
                        <div className="absolute top-4 right-4 bg-primary text-white rounded-full p-1 animate-scale-in">
                            <span className="material-symbols-outlined text-sm block">check</span>
                        </div>
                    )}

                    <div className="aspect-square rounded-xl overflow-hidden mb-4 border border-accent-cream/20">
                        <img
                            src={option.image}
                            alt={option.title}
                            className="size-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                        />
                    </div>

                    <h4 className="text-xl font-display font-bold text-maroon-dark dark:text-text-light mb-2">
                        {option.title}
                    </h4>
                    <p className="text-sm text-accent-bronze font-medium leading-relaxed">
                        {option.description}
                    </p>
                </Card>
            ))}
        </div>
    );
};

PorositySelector.propTypes = {
    selected: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default PorositySelector;
