import PropTypes from 'prop-types';

const BrandLogo = ({ className = '', alt = 'Elsa Coiffure logo' }) => {
  return (
    <img
      src="/assets/logo-elsa-coiffure.png"
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      translate="no"
      data-i18n="false"
    />
  );
};

BrandLogo.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
};

export default BrandLogo;
