import { Card, Button, Input } from '../components/ui';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Phone, Mail, MessageCircle, Clock, MapPin } from 'lucide-react';

const WHATSAPP_NUMBER = '2290162348521';
const CALL_NUMBER = '+229 01 68 31 18 96';
const CONTACT_EMAIL = 'lantonkpodearielle@gmail.com';

const Contact = () => {
    const { t } = useTranslation();
    const { settings } = useSiteSettings();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [openingHours, setOpeningHours] = useState({
        tuesday_saturday: '09:00 — 18:00',
        sunday: '09:00 — 15:00',
        monday: 'Fermé'
    });

    useEffect(() => {
        axios.get('/opening-hours')
            .then(response => setOpeningHours(response.data))
            .catch(() => {});
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await axios.post('/contact', formData);
            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            setError(err.response?.data?.message || t('contact.error_retry', { defaultValue: 'Une erreur est survenue. Veuillez reessayer.' }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-maroon-dark dark:text-text-light transition-colors duration-300 font-display" style={{ paddingTop: '73px' }}>
            <Navbar />

            <main style={{ display: 'grid', gridTemplateColumns: '50% 50%', minHeight: 'calc(100vh - 73px)' }}>
                {/* Left: Map Container */}
                <div className="relative w-full h-full bg-[#f1ede9]">
                    {settings.location_latitude && settings.location_longitude ? (
                        <>
                            {/* OpenStreetMap Embed */}
                            <iframe
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(settings.location_longitude) - 0.01},${parseFloat(settings.location_latitude) - 0.01},${parseFloat(settings.location_longitude) + 0.01},${parseFloat(settings.location_latitude) + 0.01}&layer=mapnik&marker=${settings.location_latitude},${settings.location_longitude}`}
                                className="w-full h-full border-0"
                                title="Localisation du salon"
                            />
                            {/* Info Card on Map */}
                            <div className="absolute bottom-8 left-8 right-8 px-6 py-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-primary/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <MapPin className="text-primary size-6 shrink-0" />
                                    <div>
                                        <p className="font-bold text-lg tracking-tight text-maroon-dark">{settings.site_name || 'ELSA COIFFURE'}</p>
                                        <p className="text-sm text-accent-bronze">{settings.contact_address || 'Cotonou, Bénin'}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="absolute inset-0 grayscale contrast-125 opacity-70 mix-blend-multiply dark:mix-blend-overlay">
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200')" }}
                                ></div>
                            </div>
                            {/* Decorative Marker */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                <MapPin className="text-primary size-10 drop-shadow-lg" />
                                <div className="mt-2 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl border border-primary/30">
                                    <p className="font-bold text-sm tracking-widest uppercase">{settings.site_name || 'ELSA COIFFURE'}</p>
                                    <p className="text-[10px] italic font-medium">{settings.contact_address || 'Cotonou, Bénin'}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Right: Form and Info */}
                <div className="bg-background-light dark:bg-background-dark flex items-center justify-center p-8 md:p-12 lg:p-16 xl:p-20 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 73px)' }}>
                    <div className="max-w-2xl mx-auto w-full">
                        <div className="mb-10 animate-fade-in">
                            <h1 className="text-primary text-4xl lg:text-5xl font-medium italic mb-3">{t('contact.title')}</h1>
                            <p className="text-accent-bronze text-base lg:text-lg italic font-medium">{t('contact.subtitle')}</p>
                        </div>

                        <div className="flex flex-col gap-6 animate-fade-in stagger-1">
                            {success && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm font-medium flex items-center gap-3">
                                    <span className="material-symbols-outlined">check_circle</span>
                                    {t('contact.success_message', { defaultValue: 'Votre message a ete envoye avec succes ! Nous vous repondrons rapidement.' })}
                                </div>
                            )}

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm font-medium flex items-center gap-3">
                                    <span className="material-symbols-outlined">error</span>
                                    {error}
                                </div>
                            )}

                            <form className="space-y-8" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <label className="flex flex-col gap-2">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-accent-bronze">{t('contact.full_name')}</span>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="h-12 bg-transparent border-0 border-b-2 border-maroon-dark/10 dark:border-white/10 focus:ring-0 focus:border-primary px-0 text-lg transition-all placeholder:text-accent-bronze/30 italic"
                                            placeholder={t('contact.placeholder_name')}
                                            type="text"
                                        />
                                    </label>
                                    <label className="flex flex-col gap-2">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-accent-bronze">{t('contact.email_address')}</span>
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="h-12 bg-transparent border-0 border-b-2 border-maroon-dark/10 dark:border-white/10 focus:ring-0 focus:border-primary px-0 text-lg transition-all placeholder:text-accent-bronze/30 italic"
                                            placeholder={t('contact.placeholder_email')}
                                            type="email"
                                        />
                                    </label>
                                </div>

                                <label className="flex flex-col gap-2">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-accent-bronze">{t('contact.phone_optional', { defaultValue: 'Telephone (optionnel)' })}</span>
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="h-12 bg-transparent border-0 border-b-2 border-maroon-dark/10 dark:border-white/10 focus:ring-0 focus:border-primary px-0 text-lg transition-all placeholder:text-accent-bronze/30 italic"
                                        placeholder="+229 XX XX XX XX"
                                        type="tel"
                                    />
                                </label>

                                <label className="flex flex-col gap-2">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-accent-bronze">{t('contact.inquiry_type')}</span>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="h-12 bg-transparent border-0 border-b-2 border-maroon-dark/10 dark:border-white/10 focus:ring-0 focus:border-primary px-0 text-lg transition-all appearance-none italic"
                                    >
                                        <option value="">{t('contact.select_subject', { defaultValue: 'Choisir un sujet' })}</option>
                                        <option value="wedding">{t('contact.wedding_styling')}</option>
                                        <option value="gala">{t('contact.gala_red_carpet')}</option>
                                        <option value="commercial">{t('contact.commercial_shoots')}</option>
                                        <option value="private">{t('contact.private_booking')}</option>
                                    </select>
                                </label>

                                <label className="flex flex-col gap-2">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-accent-bronze">{t('contact.message')}</span>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="bg-transparent border-0 border-b-2 border-maroon-dark/10 dark:border-white/10 focus:ring-0 focus:border-primary px-0 text-lg transition-all placeholder:text-accent-bronze/30 italic resize-none"
                                        placeholder={t('contact.placeholder_message')}
                                        rows="3"
                                    ></textarea>
                                </label>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    disabled={loading}
                                    className="w-full h-14 uppercase tracking-widest text-xs font-black shadow-xl shadow-primary/20"
                                >
                                    {loading ? t('contact.sending', { defaultValue: 'Envoi en cours...' }) : t('contact.send_message')}
                                </Button>
                            </form>
                        </div>

                        {/* Info Grid */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-maroon-dark/10 dark:border-white/10 pt-10 animate-fade-in stagger-2">
                            {/* Contact Info */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-primary">{t('contact.the_salon')}</h4>

                                {/* WhatsApp */}
                                <a
                                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 group"
                                >
                                    <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        <MessageCircle className="size-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-accent-bronze uppercase tracking-wider">WhatsApp</p>
                                        <p className="text-base font-bold text-maroon-dark dark:text-text-light">+229 01 62 34 85 21</p>
                                    </div>
                                </a>

                                {/* Appel direct */}
                                <a
                                    href={`tel:${CALL_NUMBER.replace(/\s/g, '')}`}
                                    className="flex items-center gap-3 group"
                                >
                                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        <Phone className="size-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-accent-bronze uppercase tracking-wider">{t('contact.phone_optional', { defaultValue: 'Appels directs' })}</p>
                                        <p className="text-base font-bold text-maroon-dark dark:text-text-light">{CALL_NUMBER}</p>
                                    </div>
                                </a>

                                {/* Email */}
                                <a
                                    href={`mailto:${CONTACT_EMAIL}`}
                                    className="flex items-center gap-3 group"
                                >
                                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        <Mail className="size-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-accent-bronze uppercase tracking-wider">Email</p>
                                        <p className="text-base font-bold text-maroon-dark dark:text-text-light break-all">{CONTACT_EMAIL}</p>
                                    </div>
                                </a>
                            </div>

                            {/* Opening Hours */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-primary">{t('contact.hours')}</h4>
                                <ul className="text-sm space-y-3 font-bold text-accent-bronze">
                                    <li className="flex justify-between border-b border-maroon-dark/5 dark:border-white/5 pb-2">
                                        <span>{t('contact.tuesday')} - {t('contact.saturday')}</span>
                                        <span className="text-maroon-dark dark:text-text-light">{openingHours.tuesday_saturday}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-maroon-dark/5 dark:border-white/5 pb-2">
                                        <span>{t('contact.sunday')}</span>
                                        <span className="text-maroon-dark dark:text-text-light">{openingHours.sunday}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>{t('contact.monday')}</span>
                                        <span className="text-primary italic">{openingHours.monday}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="mt-8 flex gap-6 animate-fade-in stagger-3">
                            {[
                                { icon: 'photo_camera', url: settings.social_instagram },
                                { icon: 'public', url: settings.social_facebook },
                                { icon: 'smart_display', url: settings.social_youtube }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    className="size-12 rounded-full border border-maroon-dark/10 dark:border-white/10 flex items-center justify-center text-accent-bronze hover:text-primary hover:border-primary transition-all duration-300"
                                    href={social.url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="material-symbols-outlined text-xl">{social.icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
