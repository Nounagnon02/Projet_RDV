/**
 * ProtectedIcon - Composant d'icône protégé de la traduction
 * 
 * IMPORTANT: Les icônes ne DOIVENT JAMAIS être traduites.
 * Cet élément est protégé avec:
 * - translate="no" (standard W3C)
 * - data-i18n="false" (react-i18next)
 * - Le contenu textuel est isolé du DOM translatable
 */
import PropTypes from 'prop-types';

const ProtectedIcon = ({ 
  children, 
  className = '', 
  type = 'material', // 'material' ou 'lucide'
  title = '',
  ...props 
}) => {
  return (
    <span
      className={className}
      translate="no"
      data-i18n="false"
      aria-label={title || 'icon'}
      role="img"
      {...props}
    >
      {children}
    </span>
  );
};

ProtectedIcon.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf(['material', 'lucide']),
  title: PropTypes.string,
};

export default ProtectedIcon;
