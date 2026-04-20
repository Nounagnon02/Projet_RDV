/**
 * TranslationProtectionValidator.jsx
 * 
 * This component validates that logos, icons, and visual elements
 * are protected from translation and remain unchanged across languages.
 * 
 * ⚠️ CRITICAL: DO NOT REMOVE OR MODIFY - This ensures visual integrity
 */
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Utility function to extract inner text from an element
 * and check if it contains "material-symbols-outlined" class
 */
const getElementContent = (element) => {
  if (!element) return null;
  
  return {
    text: element.innerText,
    html: element.innerHTML,
    translate: element.getAttribute('translate'),
    dataI18n: element.getAttribute('data-i18n'),
    classes: element.className,
  };
};

/**
 * Validator Component - Run in development to catch translation issues
 * 
 * Usage in a page:
 * {process.env.NODE_ENV === 'development' && <TranslationProtectionValidator />}
 */
const TranslationProtectionValidator = ({ enabled = true, verbose = false }) => {
  const { i18n } = useTranslation();
  const [protectionState, setProtectionState] = useState({
    protected: [],
    unprotected: [],
    issues: [],
    timestamp: null,
  });

  useEffect(() => {
    if (!enabled) return;

    const validateProtection = () => {
      const issues = [];
      const protected_ = [];
      const unprotected = [];

      // Check for all material symbols icons
      const materialIcons = document.querySelectorAll('.material-symbols-outlined');
      
      materialIcons.forEach((icon, index) => {
        // Check if parent has translate="no" or data-i18n="false"
        let isProtected = false;
        let parent = icon;

        // Check up to 3 levels of parent elements
        for (let i = 0; i < 3; i++) {
          if (!parent) break;
          
          const translate = parent.getAttribute('translate');
          const dataI18n = parent.getAttribute('data-i18n');
          
          if (translate === 'no' || dataI18n === 'false') {
            isProtected = true;
            break;
          }
          parent = parent.parentElement;
        }

        const iconData = {
          name: icon.innerText || icon.innerHTML,
          index,
          parents: icon.parentElement?.className || 'unknown',
        };

        if (isProtected) {
          protected_.push(iconData);
        } else {
          unprotected.push(iconData);
          issues.push(`Icon #${index} "${icon.innerText}" is NOT protected from translation`);
        }
      });

      // Check for logo elements
      const logos = document.querySelectorAll('[class*="logo"], [data-testid*="logo"]');
      logos.forEach((logo) => {
        const isProtected = logo.getAttribute('translate') === 'no' || 
                          logo.getAttribute('data-i18n') === 'false';
        
        if (!isProtected) {
          issues.push(`Logo element "${logo.className}" is NOT protected from translation`);
          unprotected.push({ name: 'logo', element: logo.className });
        } else {
          protected_.push({ name: 'logo', element: logo.className });
        }
      });

      setProtectionState({
        protected: protected_,
        unprotected,
        issues,
        timestamp: new Date().toISOString(),
      });

      // Log warnings if issues found
      if (issues.length > 0 && verbose) {
        console.warn('🚨 TRANSLATION PROTECTION ISSUES DETECTED:', issues);
      }
    };

    // Validate on mount and when language changes
    validateProtection();
    const timer = setTimeout(validateProtection, 500); // Re-validate after DOM updates

    return () => clearTimeout(timer);
  }, [i18n.language, enabled, verbose]);

  if (!enabled || protectionState.issues.length === 0) {
    return null;
  }

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div 
      id="translation-protection-validator"
      className="fixed bottom-4 right-4 z-50 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg text-sm font-mono text-yellow-900 max-w-md max-h-48 overflow-y-auto"
      role="alert"
    >
      <h3 className="font-bold mb-2">⚠️ Translation Protection Issues</h3>
      <ul className="text-xs space-y-1">
        {protectionState.issues.slice(0, 5).map((issue, idx) => (
          <li key={idx}>• {issue}</li>
        ))}
        {protectionState.issues.length > 5 && (
          <li>... and {protectionState.issues.length - 5} more issues</li>
        )}
      </ul>
      <p className="text-xs mt-2 opacity-70">
        Protected: {protectionState.protected.length} | 
        Unprotected: {protectionState.unprotected.length}
      </p>
    </div>
  );
};

TranslationProtectionValidator.propTypes = {
  enabled: PropTypes.bool,
  verbose: PropTypes.bool,
};

export default TranslationProtectionValidator;
