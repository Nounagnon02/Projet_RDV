/**
 * ProtectedLogo - Composant de logo/marque protégé de la traduction
 * 
 * IMPORTANT: Les logos et noms de marque ne DOIVENT JAMAIS être traduits.
 * Cet élément est protégé avec:
 * - translate="no" (standard W3C)
 * - data-i18n="false" (react-i18next)
 * 
 * Utilisation:
 * <ProtectedLogo>Mon Logo</ProtectedLogo>
 */
import PropTypes from 'prop-types';

const ProtectedLogo = ({ 
  children, 
  className = '',
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={className}
      translate="no"
      data-i18n="false"
      {...props}
    >
      {children}
    </Component>
  );
};

ProtectedLogo.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  as: PropTypes.elementType,
};

export default ProtectedLogo;
