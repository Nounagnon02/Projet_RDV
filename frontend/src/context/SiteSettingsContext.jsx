import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const SiteSettingsContext = createContext();

export const useSiteSettings = () => {
    const context = useContext(SiteSettingsContext);
    if (!context) {
        throw new Error('useSiteSettings must be used within SiteSettingsProvider');
    }
    return context;
};

export const SiteSettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        site_name: 'Elsa Coiffure',
        contact_email: 'concierge@elsacoiffure.com',
        contact_phone: '+33 1 23 45 67 89',
        contact_address: '75 Av. des Champs-Élysées, Paris',
        social_instagram: 'https://instagram.com/elsacoiffure',
        social_facebook: 'https://facebook.com/elsacoiffure',
        social_youtube: 'https://youtube.com/@elsacoiffure',
        footer_description: 'Élever les standards du soin capillaire Afro à travers une expérience de luxe et une excellence artistique depuis plus d\'une décennie.',
        location_latitude: '6.3703',
        location_longitude: '2.3912'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get('/site-settings');
            setSettings(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des paramètres du site:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshSettings = () => {
        fetchSettings();
    };

    return (
        <SiteSettingsContext.Provider value={{ settings, loading, refreshSettings }}>
            {children}
        </SiteSettingsContext.Provider>
    );
};
