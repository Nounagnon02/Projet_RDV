import PropTypes from 'prop-types';
import { forwardRef } from 'react';

/**
 * Premium Button Component - Elsa Coiffure Style
 * 
 * @param {Object} props
 * @param {'primary'|'secondary'|'ghost'|'outline'} props.variant - Button style variant
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {boolean} props.loading - Show loading state
 * @param {boolean} props.disabled - Disable button
 * @param {React.ReactNode} props.leftIcon - Icon to show on the left
 * @param {React.ReactNode} props.rightIcon - Icon to show on the right
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 */
const Button = forwardRef(({
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    className = '',
    children,
    ...props
}, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-gradient-to-r from-primary-dark to-primary text-white shadow-primary-glow hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-98',
        secondary: 'bg-background-light  text-maroon-dark dark:text-text-light border border-primary/20 dark:border-primary/30 hover:bg-accent-cream dark:hover:bg-maroon-light hover:border-primary/40',
        ghost: 'text-maroon-dark dark:text-text-light hover:bg-accent-cream/50 dark:hover:bg-maroon-dark/50',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    const variantClass = variants[variant] || variants.primary;
    const sizeClass = sizes[size] || sizes.md;

    return (
        <button
            ref={ref}
            className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <span className="material-symbols-outlined animate-spin mr-2">
                    progress_activity
                </span>
            )}
            {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </button>
    );
});

Button.displayName = 'Button';

Button.propTypes = {
    variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'outline']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export default Button;
