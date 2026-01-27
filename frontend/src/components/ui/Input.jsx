import PropTypes from 'prop-types';
import { forwardRef, useState } from 'react';

/**
 * Premium Input Component - Elsa Coiffure Style
 * 
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {string} props.helperText - Helper text below input
 * @param {React.ReactNode} props.leftIcon - Icon on the left
 * @param {React.ReactNode} props.rightIcon - Icon on the right
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.required - Mark as required
 */
const Input = forwardRef(({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    className = '',
    required = false,
    type = 'text',
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const baseInputStyles = 'w-full px-4 py-3 bg-white/60 dark:bg-maroon-dark/60 border rounded-xl text-text-dark dark:text-text-light placeholder:text-accent-bronze/60 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm';

    const errorStyles = error
        ? 'border-accent-rose focus:ring-accent-rose/50'
        : 'border-accent-cream dark:border-maroon-light hover:border-primary/40';

    const iconPadding = leftIcon ? 'pl-12' : rightIcon ? 'pr-12' : '';

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label className="text-sm font-semibold text-maroon-dark dark:text-text-light flex items-center gap-1">
                    {label}
                    {required && <span className="text-accent-rose">*</span>}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-bronze">
                        {leftIcon}
                    </div>
                )}

                <input
                    ref={ref}
                    type={type}
                    className={`${baseInputStyles} ${errorStyles} ${iconPadding}`}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />

                {rightIcon && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-accent-bronze">
                        {rightIcon}
                    </div>
                )}
            </div>

            {error && (
                <p className="text-sm text-accent-rose flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">error</span>
                    {error}
                </p>
            )}

            {!error && helperText && (
                <p className="text-sm text-accent-bronze">{helperText}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

Input.propTypes = {
    label: PropTypes.string,
    error: PropTypes.string,
    helperText: PropTypes.string,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    className: PropTypes.string,
    required: PropTypes.bool,
    type: PropTypes.string,
};

export default Input;
