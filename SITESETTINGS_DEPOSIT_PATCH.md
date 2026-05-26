# Ajout de la section Acompte dans SiteSettings.jsx

## Instructions

Ajouter cette section APRÈS la section "Configuration FedaPay" (ligne ~580) et AVANT la section "Configuration Email (SMTP)":

```jsx
{/* Configuration Acompte */}
<div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f1ede9]">
    <h2 className="text-xl font-bold mb-2 text-maroon-dark">Acompte pour les Réservations</h2>
    <p className="text-sm text-accent-bronze mb-6 italic">
        Configurez le système d'acompte obligatoire pour les réservations
    </p>
    <div className="space-y-6">
        {/* Toggle Activer/Désactiver */}
        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
            <div className="flex-1">
                <label className="block text-sm font-bold text-maroon-dark mb-1">
                    Activer l'acompte obligatoire
                </label>
                <p className="text-xs text-accent-bronze">
                    Les clients devront payer un acompte pour confirmer leur réservation
                </p>
            </div>
            <button
                type="button"
                onClick={() => handleChange('deposit_enabled', settings.deposit_enabled === 'true' ? 'false' : 'true')}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    settings.deposit_enabled === 'true' ? 'bg-primary' : 'bg-gray-300'
                }`}
            >
                <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        settings.deposit_enabled === 'true' ? 'translate-x-7' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>

        {/* Pourcentage d'acompte */}
        <div>
            <label className="block text-sm font-bold text-maroon-dark mb-2">
                Pourcentage d'acompte (%)
            </label>
            <div className="flex items-center gap-4">
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={settings.deposit_percentage || 30}
                    onChange={(e) => handleChange('deposit_percentage', e.target.value)}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    disabled={settings.deposit_enabled !== 'true'}
                />
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={settings.deposit_percentage || 30}
                        onChange={(e) => {
                            const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                            handleChange('deposit_percentage', val.toString());
                        }}
                        className="w-20 px-3 py-2 rounded-lg border border-[#e3dbd3] focus:outline-none focus:ring-2 focus:ring-primary text-center font-bold"
                        disabled={settings.deposit_enabled !== 'true'}
                    />
                    <span className="text-lg font-bold text-maroon-dark">%</span>
                </div>
            </div>
            <p className="text-xs text-accent-bronze mt-2">
                Le client paiera {settings.deposit_percentage || 30}% du montant total en acompte
            </p>
        </div>

        {/* Exemple de calcul */}
        {settings.deposit_enabled === 'true' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-bold text-green-900 mb-2">💡 Exemple de calcul</p>
                <div className="text-xs text-green-800 space-y-1">
                    <p>Service à <strong>10 000 FCFA</strong> :</p>
                    <p>• Acompte à payer : <strong>{Math.round(10000 * (parseInt(settings.deposit_percentage) || 30) / 100).toLocaleString()} FCFA</strong> ({settings.deposit_percentage || 30}%)</p>
                    <p>• Reste à payer au salon : <strong>{Math.round(10000 * (100 - (parseInt(settings.deposit_percentage) || 30)) / 100).toLocaleString()} FCFA</strong></p>
                </div>
            </div>
        )}

        {/* Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-bold text-blue-900 mb-2">ℹ️ Comment ça fonctionne ?</p>
            <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                <li>Le client choisit un service et une date</li>
                <li>Le système calcule automatiquement l'acompte requis</li>
                <li>Le client paie l'acompte via FedaPay</li>
                <li>Le rendez-vous est confirmé après paiement</li>
                <li>Le reste est à payer au salon le jour du rendez-vous</li>
            </ol>
        </div>
    </div>
</div>
```

## Emplacement exact

Cherchez cette ligne dans SiteSettings.jsx:
```jsx
{/* Configuration Email */}
<div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f1ede9]">
    <h2 className="text-xl font-bold mb-2 text-maroon-dark">Configuration Email (SMTP)</h2>
```

Et ajoutez la section Acompte JUSTE AVANT cette ligne.
