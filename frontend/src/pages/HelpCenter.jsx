/**
 * HelpCenter.jsx - Centre d'aide et support
 * 
 * Page pour les questions, FAQ et support client
 */

import { useState } from 'react';
import ClientLayout from '../layouts/ClientLayout';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import api from '../api/axios';
import { Button } from '../components/ui';
import { HelpCircle, Mail, Phone, MessageSquare, ChevronDown } from 'lucide-react';

const HelpCenter = () => {
    const { t, i18n } = useTranslation();
    const [openFaq, setOpenFaq] = useState(null);
    const [siteSettings, setSiteSettings] = useState({});
    const [dynamicFaqs, setDynamicFaqs] = useState([]);
    const [helpHeader, setHelpHeader] = useState({ title: '', subtitle: '' });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const [settingsResponse, helpResponse] = await Promise.all([
                    api.get('/site-settings'),
                    api.get(`/help-center/content?lang=${i18n.language === 'en' ? 'en' : 'fr'}`),
                ]);

                setSiteSettings(settingsResponse.data || {});
                setDynamicFaqs(helpResponse.data?.faqs || []);
                setHelpHeader({
                    title: helpResponse.data?.title || '',
                    subtitle: helpResponse.data?.subtitle || '',
                });
            } catch (error) {
                console.error('Error loading site settings', error);
            }
        };

        fetchSettings();
    }, [i18n.language]);

    const fallbackFaqs = [
        {
            id: 1,
            category: t('help.faq.booking', { defaultValue: 'Reservation' }),
            question: t('help.q1', { defaultValue: 'Comment reserver un rendez-vous ?' }),
            answer: t('help.a1', { defaultValue: 'Cliquez sur reservation, choisissez votre prestation puis votre date et confirmez votre rendez-vous.' })
        },
        {
            id: 2,
            category: t('help.faq.booking', { defaultValue: 'Reservation' }),
            question: t('help.q2', { defaultValue: 'Puis-je reporter ou annuler un rendez-vous ?' }),
            answer: t('help.a2', { defaultValue: 'Oui, vous pouvez annuler votre rendez-vous depuis Mes reservations selon les conditions du salon.' })
        },
        {
            id: 3,
            category: t('help.faq.shop', { defaultValue: 'Boutique' }),
            question: t('help.q3', { defaultValue: 'Comment fonctionne la livraison des produits ?' }),
            answer: t('help.a3', { defaultValue: 'Les commandes sont traitees puis expediees suivant la disponibilite des produits.' })
        },
        {
            id: 4,
            category: t('help.faq.shop', { defaultValue: 'Boutique' }),
            question: t('help.q4', { defaultValue: 'Y a-t-il des retours ou remboursements ?' }),
            answer: t('help.a4', { defaultValue: 'Les retours sont etudies selon la politique du salon et l etat du produit.' })
        },
        {
            id: 5,
            category: t('help.faq.rewards', { defaultValue: 'Fidelite' }),
            question: t('help.q5', { defaultValue: 'Comment gagner des points de fidelite ?' }),
            answer: t('help.a5', { defaultValue: 'Vous gagnez des points selon vos achats et prestations. Consultez la page fidelite pour le detail.' })
        },
        {
            id: 6,
            category: t('help.faq.account', { defaultValue: 'Compte' }),
            question: t('help.q6', { defaultValue: 'Comment modifier mes informations de profil ?' }),
            answer: t('help.a6', { defaultValue: 'Ouvrez la page Parametres pour consulter vos informations de compte.' })
        },
    ];

    const contactMethods = [
        {
            icon: Phone,
            method: t('help.call_us', { defaultValue: 'Appelez-nous' }),
            detail: siteSettings.contact_phone || '+33 1 23 45 67 89',
            hours: t('help.phone_hours', { defaultValue: 'Lun-Sam: 10h-19h' })
        },
        {
            icon: Mail,
            method: t('help.email_us', { defaultValue: 'Ecrivez-nous' }),
            detail: siteSettings.contact_email || 'support@elsacoiffure.com',
            hours: t('help.email_hours', { defaultValue: 'Reponse sous 24h' })
        },
        {
            icon: MessageSquare,
            method: t('help.visit_us', { defaultValue: 'Adresse' }),
            detail: siteSettings.contact_address || '75 Av. des Champs-Elysees',
            hours: t('help.visit_hours', { defaultValue: 'Selon horaires du salon' })
        },
    ];

    const faqsToRender = dynamicFaqs.length > 0 ? dynamicFaqs : fallbackFaqs;

    return (
        <ClientLayout title="Aide" subtitle="Questions frequentes et support Elsa Coiffure.">
            <div>
                {/* Hero */}
                <div className="relative overflow-hidden py-8 lg:py-12 px-4 lg:px-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl">
                    <div className="max-w-6xl mx-auto relative text-center">
                        <HelpCircle className="size-12 text-primary mx-auto mb-4" />
                        <h1 className="text-5xl lg:text-6xl font-display font-black text-maroon-dark dark:text-text-light italic leading-tight mb-6">
                            {helpHeader.title || t('help.title', { defaultValue: 'Comment pouvons-nous vous aider ?' })}
                        </h1>
                        <p className="text-lg text-accent-bronze font-medium italic max-w-2xl mx-auto">
                            {helpHeader.subtitle || t('help.subtitle', { defaultValue: 'Retrouvez les reponses frequentes ou contactez notre equipe.' })}
                        </p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-16">
                    {/* Contact Methods */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {contactMethods.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div 
                                    key={item.method}
                                    className="bg-white dark:bg-white/5 rounded-2xl p-8 border border-maroon-dark/5 text-center hover:border-primary/20 transition-all"
                                >
                                    <Icon className="size-8 text-primary mx-auto mb-4" />
                                    <h3 className="font-bold text-lg mb-2">{item.method}</h3>
                                    <p className="text-primary font-bold mb-2">{item.detail}</p>
                                    <p className="text-xs text-accent-bronze">{item.hours}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* FAQ Section */}
                    <div className="mb-16">
                        <h2 className="text-4xl font-display font-bold italic text-maroon-dark dark:text-text-light mb-8">
                            {t('help.faq_title', { defaultValue: 'Questions frequentes' })}
                        </h2>

                        <div className="space-y-4">
                            {faqsToRender.map((faq) => (
                                <div 
                                    key={faq.id}
                                    className="bg-white dark:bg-white/5 rounded-2xl border border-maroon-dark/5 overflow-hidden transition-all"
                                >
                                    <button 
                                        onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                        className="w-full p-6 flex items-center justify-between hover:bg-maroon-dark/2 transition-colors text-left"
                                    >
                                        <div>
                                            <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-3">
                                                {faq.category}
                                            </span>
                                            <h3 className="text-lg font-bold text-maroon-dark dark:text-text-light">
                                                {faq.question}
                                            </h3>
                                        </div>
                                        <ChevronDown 
                                            className={`size-5 text-primary transition-transform flex-shrink-0 ml-4 ${openFaq === faq.id ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {openFaq === faq.id && (
                                        <div className="px-6 pb-6 text-accent-bronze border-t border-maroon-dark/5">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Still Need Help */}
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 text-center">
                        <h3 className="text-3xl font-display font-bold italic text-maroon-dark dark:text-text-light mb-4">
                            {t('help.still_questions', { defaultValue: 'Besoin d une aide supplementaire ?' })}
                        </h3>
                        <p className="text-accent-bronze mb-8 max-w-xl mx-auto">
                            {t('help.still_questions_desc', { defaultValue: 'Notre equipe reste disponible pour vous accompagner.' })}
                        </p>
                        <Button variant="primary" className="h-14 px-12 rounded-full font-black uppercase tracking-widest">
                            {t('help.contact_support', { defaultValue: 'Contacter le support' })}
                        </Button>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
};

export default HelpCenter;
