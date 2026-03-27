import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = ({ className = "" }) => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'fr' ? 'en' : 'fr';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark/60 dark:text-text-light/60 hover:text-primary transition-all ${className}`}
            title={i18n.language === 'fr' ? 'Switch to English' : 'Passer au Français'}
        >
            <Globe size={16} />
            <span>{i18n.language === 'fr' ? 'EN' : 'FR'}</span>
        </button>
    );
};

export default LanguageSwitcher;
