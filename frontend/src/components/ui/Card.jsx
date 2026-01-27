import PropTypes from 'prop-types';

/**
 * Glass Card Component - Elsa Coiffure Style
 * Premium card with glassmorphism effect
 * 
 * @param {Object} props
 * @param {'default'|'light'|'elevated'} props.variant - Card style variant
 * @param {boolean} props.hover - Enable hover effect
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Card content
 */
const Card = ({
    variant = 'default',
    hover = false,
    className = '',
    children,
    ...props
}) => {
    const baseStyles = 'rounded-2xl transition-all duration-300';

    const variants = {
        default: 'glass-card',
        light: 'glass-card-light',
        elevated: 'bg-white dark:bg-maroon-dark shadow-elevated border border-accent-cream/20 dark:border-maroon-light/20',
    };

    const hoverStyles = hover ? 'hover:scale-[1.01] hover:shadow-glass-dark cursor-pointer' : '';

    const variantClass = variants[variant] || variants.default;

    return (
        <div
            className={`${baseStyles} ${variantClass} ${hoverStyles} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

Card.propTypes = {
    variant: PropTypes.oneOf(['default', 'light', 'elevated']),
    hover: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export default Card;
