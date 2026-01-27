import PropTypes from 'prop-types';
import { Card } from '../ui';

const CurlPatternSelector = ({ selected, onChange }) => {
    const patterns = [
        {
            id: '4A',
            title: 'Pattern 4A',
            description: 'Defined S-pattern coils, about the size of a crochet needle.',
            image: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&q=80&w=200',
        },
        {
            id: '4B',
            title: 'Pattern 4B',
            description: 'Z-pattern curls with less definition and more shrinkage.',
            image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=200',
        },
        {
            id: '4C',
            title: 'Pattern 4C',
            description: 'Tight coily hair with no defined curl pattern and maximum shrinkage.',
            image: 'https://images.unsplash.com/photo-1522337094846-8a81819202f9?auto=format&fit=crop&q=80&w=200',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {patterns.map((pattern) => (
                <Card
                    key={pattern.id}
                    variant={selected === pattern.id ? 'default' : 'elevated'}
                    hover
                    onClick={() => onChange(pattern.id)}
                    className={`relative p-6 cursor-pointer border-2 transition-all duration-300 ${selected === pattern.id
                            ? 'border-primary ring-4 ring-primary/10'
                            : 'border-transparent'
                        }`}
                >
                    {selected === pattern.id && (
                        <div className="absolute top-4 right-4 bg-primary text-white rounded-full p-1 animate-scale-in">
                            <span className="material-symbols-outlined text-sm block">check</span>
                        </div>
                    )}

                    <div className="aspect-square rounded-xl overflow-hidden mb-4 border border-accent-cream/20">
                        <img
                            src={pattern.image}
                            alt={pattern.title}
                            className="size-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                        />
                    </div>

                    <h4 className="text-xl font-display font-bold text-maroon-dark dark:text-text-light mb-2">
                        {pattern.title}
                    </h4>
                    <p className="text-sm text-accent-bronze font-medium leading-relaxed">
                        {pattern.description}
                    </p>
                </Card>
            ))}
        </div>
    );
};

CurlPatternSelector.propTypes = {
    selected: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default CurlPatternSelector;
