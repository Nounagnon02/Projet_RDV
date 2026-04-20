import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'fr',
        defaultNS: 'translation',
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        // Réduire les namespaces à la traduction uniquement
        // N'effectuer aucun parsing du DOM automatique
        ns: ['translation'],
        // Désactiver la traduction des attributs HTML
        attr: [],
        // Seulement traduire les clés explicites avec t() ou Trans
        translation: {
            baked: true,
        }
    });

export default i18n;
