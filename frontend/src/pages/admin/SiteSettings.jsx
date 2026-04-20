import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Save, Globe, Mail, Phone, MapPin, Instagram, Facebook, Youtube, Navigation, Loader2, Plus, Trash2 } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import DashboardLayout from '../../layouts/DashboardLayout';

const SiteSettings = () => {
    const { refreshSettings } = useSiteSettings();
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [gettingLocation, setGettingLocation] = useState(false);
    const [faqLang, setFaqLang] = useState('fr');
    const [faqFr, setFaqFr] = useState([]);
    const [faqEn, setFaqEn] = useState([]);

    const getCounterClass = (current, max) => {
        if (current > max) return 'text-rose-600';
        if (current >= Math.floor(max * 0.9)) return 'text-amber-600';
        return 'text-accent-bronze';
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get('/admin/site-settings');
            const settingsObj = {};
            response.data.forEach(setting => {
                settingsObj[setting.key] = setting.value;
            });
            setSettings(settingsObj);
            setFaqFr(parseFaqValue(settingsObj.help_faqs_fr, [
                { id: 1, category: 'Reservation', question: '', answer: '' }
            ]));
            setFaqEn(parseFaqValue(settingsObj.help_faqs_en, [
                { id: 1, category: 'Booking', question: '', answer: '' }
            ]));
        } catch (error) {
            console.error('Erreur lors du chargement des paramètres:', error);
        } finally {
            setLoading(false);
        }
    };

    const parseFaqValue = (rawValue, fallback = []) => {
        if (!rawValue) return fallback;
        try {
            const parsed = JSON.parse(rawValue);
            return Array.isArray(parsed) ? parsed : fallback;
        } catch (error) {
            return fallback;
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const normalizeAndValidateFaqList = (list, label) => {
        const cleaned = list
            .map((item) => ({
                ...item,
                category: (item.category || '').trim(),
                question: (item.question || '').trim(),
                answer: (item.answer || '').trim(),
            }))
            .filter((item) => item.category || item.question || item.answer);

        if (cleaned.length === 0) {
            throw new Error(`La liste FAQ ${label} ne peut pas etre vide.`);
        }

        cleaned.forEach((item, index) => {
            if (!item.category || !item.question || !item.answer) {
                throw new Error(`FAQ ${label} #${index + 1}: categorie, question et reponse sont obligatoires.`);
            }

            if (item.category.length > 60) {
                throw new Error(`FAQ ${label} #${index + 1}: categorie trop longue (max 60 caracteres).`);
            }

            if (item.question.length > 220) {
                throw new Error(`FAQ ${label} #${index + 1}: question trop longue (max 220 caracteres).`);
            }

            if (item.answer.length > 2000) {
                throw new Error(`FAQ ${label} #${index + 1}: reponse trop longue (max 2000 caracteres).`);
            }
        });

        return cleaned.map((item, index) => ({
            ...item,
            id: index + 1,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const normalizedFr = normalizeAndValidateFaqList(faqFr, 'FR');
            const normalizedEn = normalizeAndValidateFaqList(faqEn, 'EN');

            setFaqFr(normalizedFr);
            setFaqEn(normalizedEn);

            const settingsWithFaq = {
                ...settings,
                help_faqs_fr: JSON.stringify(normalizedFr),
                help_faqs_en: JSON.stringify(normalizedEn),
            };

            const settingsArray = Object.entries(settingsWithFaq).map(([key, value]) => ({
                key,
                value,
                type: key.includes('social') ? 'url' : 
                      key.includes('email') ? 'email' : 
                      key.includes('location') ? 'number' :
                      key === 'footer_description' ? 'textarea' :
                      key.includes('help_faqs') ? 'json' : 'text'
            }));

            await axios.put('/admin/site-settings', { settings: settingsArray });
            setMessage('Paramètres enregistrés avec succès !');
            refreshSettings();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error?.message || 'Erreur lors de l\'enregistrement');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const getCurrentFaqs = () => (faqLang === 'fr' ? faqFr : faqEn);

    const updateCurrentFaqs = (newFaqs) => {
        if (faqLang === 'fr') {
            setFaqFr(newFaqs);
            return;
        }
        setFaqEn(newFaqs);
    };

    const addFaqItem = () => {
        const currentFaqs = getCurrentFaqs();
        const nextId = currentFaqs.length > 0 ? Math.max(...currentFaqs.map((item) => Number(item.id) || 0)) + 1 : 1;
        updateCurrentFaqs([
            ...currentFaqs,
            { id: nextId, category: faqLang === 'fr' ? 'Reservation' : 'Booking', question: '', answer: '' }
        ]);
    };

    const removeFaqItem = (id) => {
        const currentFaqs = getCurrentFaqs();
        updateCurrentFaqs(currentFaqs.filter((item) => item.id !== id));
    };

    const updateFaqItem = (id, key, value) => {
        const currentFaqs = getCurrentFaqs();
        updateCurrentFaqs(
            currentFaqs.map((item) => (item.id === id ? { ...item, [key]: value } : item))
        );
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setMessage('La géolocalisation n\'est pas supportée par votre navigateur');
            return;
        }

        setGettingLocation(true);
        setMessage('');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setSettings(prev => ({
                    ...prev,
                    location_latitude: position.coords.latitude.toFixed(6),
                    location_longitude: position.coords.longitude.toFixed(6)
                }));
                setMessage('📍 Position actuelle récupérée avec succès !');
                setGettingLocation(false);
                setTimeout(() => setMessage(''), 3000);
            },
            (error) => {
                console.error('Erreur de géolocalisation:', error);
                setMessage('Erreur: Impossible de récupérer votre position. Vérifiez les autorisations.');
                setGettingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-maroon-dark mb-2 flex items-center gap-3">
                    <Globe className="size-8 text-primary" />
                    Paramètres du Site
                </h1>
                <p className="text-accent-bronze">Configurez les informations affichées dans le footer et sur le site</p>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.includes('succès') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Informations générales */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f1ede9]">
                    <h2 className="text-xl font-bold mb-6 text-maroon-dark">Informations Générales</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-maroon-dark mb-2">Nom du Salon</label>
                            <input
                                type="text"
                                value={settings.site_name || ''}
                                onChange={(e) => handleChange('site_name', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-maroon-dark mb-2">Description Footer</label>
                            <textarea
                                value={settings.footer_description || ''}
                                onChange={(e) => handleChange('footer_description', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f1ede9]">
                    <h2 className="text-xl font-bold mb-6 text-maroon-dark">Coordonnées</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-maroon-dark mb-2 flex items-center gap-2">
                                <Mail className="size-4 text-primary" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={settings.contact_email || ''}
                                onChange={(e) => handleChange('contact_email', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-maroon-dark mb-2 flex items-center gap-2">
                                <Phone className="size-4 text-primary" />
                                Téléphone
                            </label>
                            <input
                                type="text"
                                value={settings.contact_phone || ''}
                                onChange={(e) => handleChange('contact_phone', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-maroon-dark mb-2 flex items-center gap-2">
                                <MapPin className="size-4 text-primary" />
                                Adresse
                            </label>
                            <input
                                type="text"
                                value={settings.contact_address || ''}
                                onChange={(e) => handleChange('contact_address', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Centre d'aide */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f1ede9] space-y-6">
                    <h2 className="text-xl font-bold text-maroon-dark">Centre d'aide</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-maroon-dark mb-2">Titre (FR)</label>
                            <input
                                type="text"
                                value={settings.help_title_fr || ''}
                                onChange={(e) => handleChange('help_title_fr', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-maroon-dark mb-2">Titre (EN)</label>
                            <input
                                type="text"
                                value={settings.help_title_en || ''}
                                onChange={(e) => handleChange('help_title_en', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-maroon-dark mb-2">Sous-titre (FR)</label>
                            <textarea
                                rows={2}
                                value={settings.help_subtitle_fr || ''}
                                onChange={(e) => handleChange('help_subtitle_fr', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-maroon-dark mb-2">Sous-titre (EN)</label>
                            <textarea
                                rows={2}
                                value={settings.help_subtitle_en || ''}
                                onChange={(e) => handleChange('help_subtitle_en', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="inline-flex rounded-lg border border-[#e3dbd3] overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setFaqLang('fr')}
                                className={`px-4 py-2 text-sm font-bold ${faqLang === 'fr' ? 'bg-primary text-white' : 'bg-white text-maroon-dark'}`}
                            >
                                FAQ FR
                            </button>
                            <button
                                type="button"
                                onClick={() => setFaqLang('en')}
                                className={`px-4 py-2 text-sm font-bold ${faqLang === 'en' ? 'bg-primary text-white' : 'bg-white text-maroon-dark'}`}
                            >
                                FAQ EN
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={addFaqItem}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors"
                        >
                            <Plus className="size-4" />
                            Ajouter une FAQ
                        </button>
                    </div>

                    <div className="space-y-4">
                        {getCurrentFaqs().map((faqItem) => (
                            <div key={faqItem.id} className="rounded-xl border border-[#e3dbd3] p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <p className="text-xs font-bold uppercase tracking-wider text-accent-bronze">FAQ #{faqItem.id}</p>
                                    <button
                                        type="button"
                                        onClick={() => removeFaqItem(faqItem.id)}
                                        className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 text-sm font-bold"
                                    >
                                        <Trash2 className="size-4" />
                                        Supprimer
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-maroon-dark mb-1">Catégorie</label>
                                    <input
                                        type="text"
                                        value={faqItem.category || ''}
                                        onChange={(e) => updateFaqItem(faqItem.id, 'category', e.target.value)}
                                        maxLength={60}
                                        className="w-full px-4 py-2 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <p className={`mt-1 text-xs font-medium ${getCounterClass((faqItem.category || '').length, 60)}`}>
                                        {(faqItem.category || '').length}/60
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-maroon-dark mb-1">Question</label>
                                    <input
                                        type="text"
                                        value={faqItem.question || ''}
                                        onChange={(e) => updateFaqItem(faqItem.id, 'question', e.target.value)}
                                        maxLength={220}
                                        className="w-full px-4 py-2 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <p className={`mt-1 text-xs font-medium ${getCounterClass((faqItem.question || '').length, 220)}`}>
                                        {(faqItem.question || '').length}/220
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-maroon-dark mb-1">Réponse</label>
                                    <textarea
                                        rows={3}
                                        value={faqItem.answer || ''}
                                        onChange={(e) => updateFaqItem(faqItem.id, 'answer', e.target.value)}
                                        maxLength={2000}
                                        className="w-full px-4 py-2 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <p className={`mt-1 text-xs font-medium ${getCounterClass((faqItem.answer || '').length, 2000)}`}>
                                        {(faqItem.answer || '').length}/2000
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Réseaux sociaux */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f1ede9]">
                    <h2 className="text-xl font-bold mb-6 text-maroon-dark">Réseaux Sociaux</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-maroon-dark mb-2 flex items-center gap-2">
                                <Instagram className="size-4 text-primary" />
                                Instagram
                            </label>
                            <input
                                type="url"
                                value={settings.social_instagram || ''}
                                onChange={(e) => handleChange('social_instagram', e.target.value)}
                                placeholder="https://instagram.com/..."
                                className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-maroon-dark mb-2 flex items-center gap-2">
                                <Facebook className="size-4 text-primary" />
                                Facebook
                            </label>
                            <input
                                type="url"
                                value={settings.social_facebook || ''}
                                onChange={(e) => handleChange('social_facebook', e.target.value)}
                                placeholder="https://facebook.com/..."
                                className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-maroon-dark mb-2 flex items-center gap-2">
                                <Youtube className="size-4 text-primary" />
                                YouTube
                            </label>
                            <input
                                type="url"
                                value={settings.social_youtube || ''}
                                onChange={(e) => handleChange('social_youtube', e.target.value)}
                                placeholder="https://youtube.com/@..."
                                className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Localisation Géographique */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f1ede9]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-maroon-dark">Localisation Géographique</h2>
                        <button
                            type="button"
                            onClick={getCurrentLocation}
                            disabled={gettingLocation}
                            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 text-sm font-bold"
                        >
                            {gettingLocation ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Récupération...
                                </>
                            ) : (
                                <>
                                    <Navigation className="size-4" />
                                    Utiliser ma position
                                </>
                            )}
                        </button>
                    </div>
                    <p className="text-sm text-accent-bronze mb-4 italic">
                        Ces coordonnées seront utilisées pour afficher la carte du salon sur la page de contact.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-maroon-dark mb-2">
                                Latitude
                            </label>
                            <input
                                type="number"
                                step="0.000001"
                                value={settings.location_latitude || ''}
                                onChange={(e) => handleChange('location_latitude', e.target.value)}
                                placeholder="6.3703"
                                className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-maroon-dark mb-2">
                                Longitude
                            </label>
                            <input
                                type="number"
                                step="0.000001"
                                value={settings.location_longitude || ''}
                                onChange={(e) => handleChange('location_longitude', e.target.value)}
                                placeholder="2.3912"
                                className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                    {settings.location_latitude && settings.location_longitude && (
                        <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                            <p className="text-sm font-bold text-maroon-dark mb-2">Aperçu de la position :</p>
                            <a
                                href={`https://www.google.com/maps?q=${settings.location_latitude},${settings.location_longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-sm flex items-center gap-2"
                            >
                                <MapPin className="size-4" />
                                Voir sur Google Maps
                            </a>
                        </div>
                    )}
                </div>

                {/* Configuration Email */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f1ede9]">
                    <h2 className="text-xl font-bold mb-2 text-maroon-dark">Configuration FedaPay</h2>
                    <p className="text-sm text-accent-bronze mb-6 italic">
                        Configurez vos clés API FedaPay pour activer les paiements en ligne
                    </p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-maroon-dark mb-2">
                                Mode
                            </label>
                            <select
                                value={settings.fedapay_mode || 'sandbox'}
                                onChange={(e) => handleChange('fedapay_mode', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="sandbox">Sandbox (Test)</option>
                                <option value="live">Live (Production)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-maroon-dark mb-2">
                                Clé Publique (Public Key)
                            </label>
                            <input
                                type="text"
                                value={settings.fedapay_public_key || ''}
                                onChange={(e) => handleChange('fedapay_public_key', e.target.value)}
                                placeholder="pk_sandbox_..."
                                className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-maroon-dark mb-2">
                                Clé Secrète (Secret Key)
                            </label>
                            <input
                                type="password"
                                value={settings.fedapay_secret_key || ''}
                                onChange={(e) => handleChange('fedapay_secret_key', e.target.value)}
                                placeholder="sk_sandbox_..."
                                className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                            />
                        </div>
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm font-bold text-blue-900 mb-2">💡 Comment obtenir vos clés FedaPay</p>
                            <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                                <li>Créer un compte sur <a href="https://fedapay.com" target="_blank" rel="noopener noreferrer" className="underline">fedapay.com</a></li>
                                <li>Se connecter au dashboard</li>
                                <li>Aller dans "Paramètres" → "Clés API"</li>
                                <li>Copier la Public Key et la Secret Key</li>
                                <li>Pour tester, utiliser les clés Sandbox</li>
                                <li>Pour la production, utiliser les clés Live</li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Configuration Email */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f1ede9]">
                    <h2 className="text-xl font-bold mb-2 text-maroon-dark">Configuration Email (SMTP)</h2>
                    <p className="text-sm text-accent-bronze mb-6 italic">
                        Configurez les paramètres SMTP pour envoyer des emails (réponses aux messages de contact, notifications, etc.)
                    </p>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-maroon-dark mb-2">
                                    Serveur SMTP (Host)
                                </label>
                                <input
                                    type="text"
                                    value={settings.mail_host || ''}
                                    onChange={(e) => handleChange('mail_host', e.target.value)}
                                    placeholder="smtp.gmail.com"
                                    className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-maroon-dark mb-2">
                                    Port
                                </label>
                                <input
                                    type="number"
                                    value={settings.mail_port || ''}
                                    onChange={(e) => handleChange('mail_port', e.target.value)}
                                    placeholder="587"
                                    className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-maroon-dark mb-2">
                                Nom d'utilisateur (Email)
                            </label>
                            <input
                                type="email"
                                value={settings.mail_username || ''}
                                onChange={(e) => handleChange('mail_username', e.target.value)}
                                placeholder="votre-email@gmail.com"
                                className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-maroon-dark mb-2">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                value={settings.mail_password || ''}
                                onChange={(e) => handleChange('mail_password', e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <p className="text-xs text-accent-bronze mt-2">
                                Pour Gmail, utilisez un "Mot de passe d'application" (pas votre mot de passe principal)
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-maroon-dark mb-2">
                                    Chiffrement
                                </label>
                                <select
                                    value={settings.mail_encryption || 'tls'}
                                    onChange={(e) => handleChange('mail_encryption', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="tls">TLS (Port 587)</option>
                                    <option value="ssl">SSL (Port 465)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-maroon-dark mb-2">
                                    Email expéditeur
                                </label>
                                <input
                                    type="email"
                                    value={settings.mail_from_address || ''}
                                    onChange={(e) => handleChange('mail_from_address', e.target.value)}
                                    placeholder="noreply@elsacoiffure.com"
                                    className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-maroon-dark mb-2">
                                Nom de l'expéditeur
                            </label>
                            <input
                                type="text"
                                value={settings.mail_from_name || ''}
                                onChange={(e) => handleChange('mail_from_name', e.target.value)}
                                placeholder="Elsa Coiffure"
                                className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm font-bold text-blue-900 mb-2">💡 Configuration Gmail</p>
                            <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                                <li>Activer la validation en 2 étapes sur votre compte Google</li>
                                <li>Aller dans "Paramètres" → "Sécurité" → "Mots de passe des applications"</li>
                                <li>Générer un mot de passe pour "Autre (nom personnalisé)"</li>
                                <li>Utiliser ce mot de passe dans le champ ci-dessus</li>
                            </ol>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-primary text-white py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                >
                    <Save className="size-5" />
                    {saving ? 'Enregistrement...' : 'Enregistrer les Paramètres'}
                </button>
            </form>
        </div>
        </DashboardLayout>
    );
};

export default SiteSettings;
