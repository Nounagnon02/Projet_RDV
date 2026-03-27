import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Mail, MailOpen, Reply, Archive, Trash2, Eye, X, Send, Loader2 } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchMessages();
        fetchStats();
    }, [filter]);

    const fetchMessages = async () => {
        try {
            const params = filter !== 'all' ? { status: filter } : {};
            const response = await axios.get('/admin/contact-messages', { params });
            setMessages(response.data.data || response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get('/admin/contact-messages/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
        }
    };

    const handleViewMessage = async (message) => {
        setSelectedMessage(message);
        if (message.status === 'new') {
            try {
                await axios.get(`/admin/contact-messages/${message.id}`);
                fetchMessages();
                fetchStats();
            } catch (error) {
                console.error('Erreur:', error);
            }
        }
    };

    const handleReply = async () => {
        if (!replyText.trim()) return;

        setSending(true);
        try {
            await axios.post(`/admin/contact-messages/${selectedMessage.id}/reply`, {
                reply: replyText
            });
            setReplyText('');
            setSelectedMessage(null);
            fetchMessages();
            fetchStats();
            alert('Réponse envoyée avec succès !');
        } catch (error) {
            alert('Erreur lors de l\'envoi de la réponse');
            console.error(error);
        } finally {
            setSending(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.patch(`/admin/contact-messages/${id}/status`, { status });
            fetchMessages();
            fetchStats();
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

        try {
            await axios.delete(`/admin/contact-messages/${id}`);
            setSelectedMessage(null);
            fetchMessages();
            fetchStats();
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            new: 'bg-blue-100 text-blue-800 border-blue-200',
            read: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            replied: 'bg-green-100 text-green-800 border-green-200',
            archived: 'bg-gray-100 text-gray-800 border-gray-200'
        };
        const labels = {
            new: 'Nouveau',
            read: 'Lu',
            replied: 'Répondu',
            archived: 'Archivé'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badges[status]}`}>
                {labels[status]}
            </span>
        );
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="size-12 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-maroon-dark mb-2 flex items-center gap-3">
                    <Mail className="size-8 text-primary" />
                    Messages de Contact
                </h1>
                <p className="text-accent-bronze">Gérez les messages reçus depuis le formulaire de contact</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {[
                    { label: 'Total', value: stats.total || 0, color: 'bg-primary/10 text-primary', filter: 'all' },
                    { label: 'Nouveaux', value: stats.new || 0, color: 'bg-blue-100 text-blue-800', filter: 'new' },
                    { label: 'Lus', value: stats.read || 0, color: 'bg-yellow-100 text-yellow-800', filter: 'read' },
                    { label: 'Répondus', value: stats.replied || 0, color: 'bg-green-100 text-green-800', filter: 'replied' },
                    { label: 'Archivés', value: stats.archived || 0, color: 'bg-gray-100 text-gray-800', filter: 'archived' }
                ].map((stat) => (
                    <button
                        key={stat.filter}
                        onClick={() => setFilter(stat.filter)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                            filter === stat.filter 
                                ? 'border-primary shadow-lg scale-105' 
                                : 'border-[#f1ede9] hover:border-primary/50'
                        }`}
                    >
                        <div className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</div>
                        <div className="text-sm font-bold text-maroon-dark/60 mt-1">{stat.label}</div>
                    </button>
                ))}
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#f1ede9] overflow-hidden">
                {messages.length === 0 ? (
                    <div className="p-12 text-center text-accent-bronze">
                        <Mail className="size-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">Aucun message pour le moment</p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#f1ede9]">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`p-6 hover:bg-[#fbfaf9] transition-colors cursor-pointer ${
                                    message.status === 'new' ? 'bg-blue-50/30' : ''
                                }`}
                                onClick={() => handleViewMessage(message)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className={`size-10 rounded-full flex items-center justify-center ${
                                            message.status === 'new' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {message.status === 'new' ? <Mail className="size-5" /> : <MailOpen className="size-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-maroon-dark">{message.name}</h3>
                                                {getStatusBadge(message.status)}
                                            </div>
                                            <p className="text-sm text-accent-bronze mb-1">{message.email}</p>
                                            {message.subject && (
                                                <p className="text-sm font-medium text-maroon-dark/70 mb-2">Sujet: {message.subject}</p>
                                            )}
                                            <p className="text-sm text-maroon-dark/60 line-clamp-2">{message.message}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-accent-bronze">
                                            {new Date(message.created_at).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="p-6 border-b border-[#f1ede9] flex items-center justify-between sticky top-0 bg-white">
                            <div>
                                <h2 className="text-2xl font-bold text-maroon-dark mb-1">{selectedMessage.name}</h2>
                                <p className="text-sm text-accent-bronze">{selectedMessage.email}</p>
                            </div>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="size-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Info */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-[#fbfaf9] rounded-lg">
                                <div>
                                    <p className="text-xs font-bold text-accent-bronze mb-1">Date</p>
                                    <p className="text-sm font-medium">
                                        {new Date(selectedMessage.created_at).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-accent-bronze mb-1">Statut</p>
                                    {getStatusBadge(selectedMessage.status)}
                                </div>
                                {selectedMessage.phone && (
                                    <div>
                                        <p className="text-xs font-bold text-accent-bronze mb-1">Téléphone</p>
                                        <p className="text-sm font-medium">{selectedMessage.phone}</p>
                                    </div>
                                )}
                                {selectedMessage.subject && (
                                    <div>
                                        <p className="text-xs font-bold text-accent-bronze mb-1">Sujet</p>
                                        <p className="text-sm font-medium">{selectedMessage.subject}</p>
                                    </div>
                                )}
                            </div>

                            {/* Message */}
                            <div>
                                <h3 className="text-sm font-bold text-accent-bronze mb-3">MESSAGE</h3>
                                <div className="p-4 bg-[#fbfaf9] rounded-lg">
                                    <p className="text-maroon-dark whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>
                            </div>

                            {/* Previous Reply */}
                            {selectedMessage.admin_reply && (
                                <div>
                                    <h3 className="text-sm font-bold text-accent-bronze mb-3">VOTRE RÉPONSE</h3>
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-maroon-dark whitespace-pre-wrap">{selectedMessage.admin_reply}</p>
                                        <p className="text-xs text-accent-bronze mt-2">
                                            Envoyé le {new Date(selectedMessage.replied_at).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Reply Form */}
                            {selectedMessage.status !== 'replied' && (
                                <div>
                                    <h3 className="text-sm font-bold text-accent-bronze mb-3">RÉPONDRE PAR EMAIL</h3>
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Écrivez votre réponse ici..."
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                    />
                                    <button
                                        onClick={handleReply}
                                        disabled={sending || !replyText.trim()}
                                        className="mt-3 w-full bg-primary text-white py-3 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {sending ? (
                                            <>
                                                <Loader2 className="size-4 animate-spin" />
                                                Envoi en cours...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="size-4" />
                                                Envoyer la Réponse
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-[#f1ede9]">
                                {selectedMessage.status !== 'archived' && (
                                    <button
                                        onClick={() => handleUpdateStatus(selectedMessage.id, 'archived')}
                                        className="flex-1 py-3 border border-[#e3dbd3] rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Archive className="size-4" />
                                        Archiver
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(selectedMessage.id)}
                                    className="flex-1 py-3 border border-red-200 text-red-600 rounded-lg font-bold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="size-4" />
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </DashboardLayout>
    );
};

export default ContactMessages;
